import { render, screen } from '@testing-library/react';
import App from './App';

// Mock Login and Home
jest.mock('./components/Login', () => () => <div>Mock Login</div>);
jest.mock('./components/Home', () => () => <div>Mock Home</div>);

test('renders Login screen initially', () => {
  render(<App />);
  expect(screen.getByText(/mock login/i)).toBeInTheDocument();
});
