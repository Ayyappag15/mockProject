import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';

test('calls setIsAuthenticated on valid login', () => {
  const mockLogin = jest.fn();
  render(<Login setIsAuthenticated={mockLogin} />);

  fireEvent.change(screen.getByPlaceholderText(/User ID/i), {
    target: { value: 'admin' }
  });
  fireEvent.change(screen.getByPlaceholderText(/Password/i), {
    target: { value: 'admin123' }
  });

  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  expect(mockLogin).toHaveBeenCalledWith(true);
});
