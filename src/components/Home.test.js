import { render, screen, fireEvent } from '@testing-library/react';
import Home from './Home';

test('calls setIsAuthenticated(false) when logout is clicked', () => {
  const mockLogout = jest.fn();
  render(<Home setIsAuthenticated={mockLogout} />);
  fireEvent.click(screen.getByText(/Logout/i));
  expect(mockLogout).toHaveBeenCalledWith(false);
});
