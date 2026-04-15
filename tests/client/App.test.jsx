import { render, screen } from '@testing-library/react';
import App from '../../src/client/App';

// We just want to mock the whole router system inside App because App defines its own BrowserRouter
// If we mock react-router-dom, we should do it carefully.
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ path }) => <div data-testid={`route-${path}`}></div>,
  Navigate: ({ to }) => <div data-testid={`navigate-${to}`}></div>,
}));

// Mock Header
jest.mock('../../src/client/components/Header', () => () => <div data-testid="app-header" />);

// Mock hooks
jest.mock('../../src/client/context/AuthContext', () => ({
  AuthProvider: ({ children }) => <div>{children}</div>,
  useAuth: () => ({ user: { id: 1, name: 'Dummy' } }),
}));
jest.mock('../../src/client/context/ToastContext', () => ({
  ToastProvider: ({ children }) => <div>{children}</div>,
}));

describe('App', () => {
  it('renders App providers and routes without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('app-header')).toBeInTheDocument();
    
    // Check if routes are mounted (dummy checking)
    expect(screen.getByTestId('route-/login')).toBeInTheDocument();
    expect(screen.getByTestId('route-/')).toBeInTheDocument();
    expect(screen.getByTestId('route-/new')).toBeInTheDocument();
    expect(screen.getByTestId('route-/items/:itemId')).toBeInTheDocument();
  });
});
