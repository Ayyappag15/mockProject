import { render, screen, fireEvent } from '@testing-library/react';
import EmployeeForm from './EmployeeForm';

test('submits form with employee data', () => {
  const mockSubmit = jest.fn();
  render(<EmployeeForm onSubmit={mockSubmit} onCancel={() => {}} />);

  fireEvent.change(screen.getByPlaceholderText(/First Name/i), {
    target: { value: 'John' },
  });
  fireEvent.change(screen.getByPlaceholderText(/Last Name/i), {
    target: { value: 'Doe' },
  });
  fireEvent.change(screen.getByPlaceholderText(/Email/i), {
    target: { value: 'john@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText(/Salary/i), {
    target: { value: '50000' },
  });
  fireEvent.change(screen.getByPlaceholderText(/Date/i), {
    target: { value: '2025-07-10' },
  });

  fireEvent.click(screen.getByText(/Add/i));
  expect(mockSubmit).toHaveBeenCalled();
});
