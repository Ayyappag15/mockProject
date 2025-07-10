import { render, screen, waitFor } from '@testing-library/react';
import EmployeeTable from './EmployeeTable';
import axios from 'axios';

// Mock axios
jest.mock('axios');

test('renders employee data in the table', async () => {
  axios.get.mockResolvedValue({
    data: [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        salary: 4500,
        date:"2025-07-01"
      },
    ],
  });

  render(<EmployeeTable />);

  // Wait for the table row to load
  await waitFor(() => {
    expect(screen.getByText(/John/i)).toBeInTheDocument();
    expect(screen.getByText(/Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/4500/i)).toBeInTheDocument();
    expect(screen.getByText(/2025-07-01/i)).toBeInTheDocument();
  });
});
