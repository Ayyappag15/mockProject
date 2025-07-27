import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmployeeTable from './EmployeeTable';
import { fetchEmployees, deleteEmployee, updateEmployee, addEmployee } from '../api/employeeApi';
import Swal from 'sweetalert2';
 
// Mock the API functions
jest.mock('../api/employeeApi', () => ({
  fetchEmployees: jest.fn(),
  deleteEmployee: jest.fn(),
  updateEmployee: jest.fn(),
  addEmployee: jest.fn(),
}));
 
// Mock SweetAlert2
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));
 
// Mock EmployeeForm component
jest.mock('./EmployeeForm', () => {
  return function MockEmployeeForm({ onSubmit, onCancel, initialData }) {
    return (
      <div data-testid="employee-form">
        <button
          onClick={() => onSubmit({
            id: initialData?.id || null,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@test.com',
            salary: 50000,
            date: '2025-01-01'
          })}
        >
          {initialData ? 'Update' : 'Add'} Employee
        </button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    );
  };
});
 
const mockEmployees = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@test.com', salary: 50000, date: '2025-01-01' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@test.com', salary: 60000, date: '2025-01-02' },
  { id: 3, firstName: 'Bob', lastName: 'Johnson', email: 'bob@test.com', salary: 45000, date: '2025-01-03' },
];
 
describe('EmployeeTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchEmployees.mockResolvedValue({ data: mockEmployees });
    deleteEmployee.mockResolvedValue({});
    updateEmployee.mockResolvedValue({});
    addEmployee.mockResolvedValue({});
    Swal.fire.mockResolvedValue({ isConfirmed: true });
  });
 
  afterEach(() => {
    jest.clearAllMocks();
  });
 
  test('renders employee table with correct headers', async () => {
    render(<EmployeeTable />);
   
    await waitFor(() => {
      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('Last Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Salary')).toBeInTheDocument();
      expect(screen.getByText('DOJ')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });
  });
 
  test('loads and displays employees on mount', async () => {
    render(<EmployeeTable />);
   
    await waitFor(() => {
      expect(fetchEmployees).toHaveBeenCalledTimes(1);
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Jane')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });
  });
 
  test('shows employee form when Add Employee button is clicked', async () => {
    render(<EmployeeTable />);
   
    await waitFor(() => {
      expect(screen.getByText('Add Employee')).toBeInTheDocument();
    });
   
    fireEvent.click(screen.getByText('Add Employee'));
   
    await waitFor(() => {
      expect(screen.getByTestId('employee-form')).toBeInTheDocument();
    });
  });
 
  test('shows employee form for editing when Edit button is clicked', async () => {
    render(<EmployeeTable />);
   
    await waitFor(() => {
      const editButtons = screen.getAllByText('Edit');
      expect(editButtons[0]).toBeInTheDocument();
    });
   
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
   
    await waitFor(() => {
      expect(screen.getByTestId('employee-form')).toBeInTheDocument();
    });
  });
 
  test('deletes employee when Delete button is clicked and confirmed', async () => {
    render(<EmployeeTable />);
   
    await waitFor(() => {
      const deleteButtons = screen.getAllByText('Delete');
      expect(deleteButtons[0]).toBeInTheDocument();
    });
   
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
   
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        title: 'Are you sure?',
        text: "This will delete the employee!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });
    });
   
    await waitFor(() => {
      expect(deleteEmployee).toHaveBeenCalledWith(1);
    });
  });
 
  test('handles form submission for adding new employee', async () => {
    render(<EmployeeTable />);
   
    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });
   
    const addButton = screen.getByRole('button', { name: 'Add Employee' });
    fireEvent.click(addButton);
   
    await waitFor(() => {
      expect(screen.getByTestId('employee-form')).toBeInTheDocument();
    });
   
    const formAddButton = screen.getByTestId('employee-form').querySelector('button');
    fireEvent.click(formAddButton);
   
    await waitFor(() => {
      expect(addEmployee).toHaveBeenCalledWith({
        id: null,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        salary: 50000,
        date: '2025-01-01'
      });
    });
  });
 
  test('handles form submission for updating employee', async () => {
    render(<EmployeeTable />);
   
    await waitFor(() => {
      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);
    });
   
    await waitFor(() => {
      expect(screen.getByTestId('employee-form')).toBeInTheDocument();
    });
   
    const updateButton = screen.getByText('Update Employee');
    fireEvent.click(updateButton);
   
    await waitFor(() => {
      expect(updateEmployee).toHaveBeenCalledWith(1, {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        salary: 50000,
        date: '2025-01-01'
      });
    });
  });
 
  test('sorts employees when column header is clicked', async () => {
    render(<EmployeeTable />);
   
    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });
   
    const firstNameHeader = screen.getByText('First Name');
    fireEvent.click(firstNameHeader);
   
    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });
  });
 
  test('selects individual employee when checkbox is clicked', async () => {
    render(<EmployeeTable />);
   
    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });
   
    const employeeCheckboxes = screen.getAllByRole('checkbox');
    fireEvent.click(employeeCheckboxes[1]);
   
    await waitFor(() => {
      expect(screen.getByText(/Delete Selected \(1\)/)).toBeInTheDocument();
    });
  });
 
  test('selects all employees when select all checkbox is clicked', async () => {
    render(<EmployeeTable />);
   
    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });
   
    const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(selectAllCheckbox);
   
    await waitFor(() => {
      expect(screen.getByText(/Delete Selected \(3\)/)).toBeInTheDocument();
    });
  });
 
  test('performs bulk delete when Delete Selected button is clicked', async () => {
    render(<EmployeeTable />);
   
    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });
   
    const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(selectAllCheckbox);
   
    await waitFor(() => {
      expect(screen.getByText(/Delete Selected \(3\)/)).toBeInTheDocument();
    });
   
    const deleteSelectedButton = screen.getByText(/Delete Selected \(3\)/);
    fireEvent.click(deleteSelectedButton);
   
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        title: 'Are you sure?',
        text: 'This will delete 3 employee(s)!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete them!'
      });
    });
   
    await waitFor(() => {
      expect(deleteEmployee).toHaveBeenCalledTimes(3);
    });
  });
});