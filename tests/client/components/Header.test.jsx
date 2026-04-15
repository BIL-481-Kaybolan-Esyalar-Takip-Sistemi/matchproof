import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Header from '../../../src/client/components/Header';
import * as AuthCtx from '../../../src/client/context/AuthContext';
import * as ToastCtx from '../../../src/client/context/ToastContext';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: () => ({ pathname: '/' }),
}));

describe('Header', () => {
  const mockNavigate = jest.fn();
  const mockShowToast = jest.fn();
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    jest.spyOn(ToastCtx, 'useToast').mockReturnValue({ showToast: mockShowToast });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('renders login button when user is not authenticated', () => {
    jest.spyOn(AuthCtx, 'useAuth').mockReturnValue({ user: null, logout: mockLogout });
    
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('Log Out')).toBeNull();
    expect(screen.queryByText('Browse')).toBeNull(); // Only available when user exists
    
    fireEvent.click(screen.getByText('Login'));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('renders user details and nav links when authenticated', () => {
    jest.spyOn(AuthCtx, 'useAuth').mockReturnValue({ 
      user: { name: 'Test User', role: 'user' }, 
      logout: mockLogout 
    });
    
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('[user]')).toBeInTheDocument();
    expect(screen.getByText('Browse')).toBeInTheDocument();
    expect(screen.getByText('+ New Post')).toBeInTheDocument();
    expect(screen.queryByText('Admin')).toBeNull();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('renders Admin link when user is admin', () => {
    jest.spyOn(AuthCtx, 'useAuth').mockReturnValue({ 
      user: { name: 'Admin', role: 'admin' }, 
      logout: mockLogout 
    });
    
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getAllByText('Admin').length).toBe(2); // One is the Link, one is the user name
  });

  it('calls logout and navigates to login on Logout click', async () => {
    jest.spyOn(AuthCtx, 'useAuth').mockReturnValue({ 
      user: { name: 'Test User', role: 'user' }, 
      logout: mockLogout 
    });
    mockLogout.mockResolvedValueOnce();

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Logout'));

    // We have to wait for the async handleLogout to finish
    await screen.findByText('Logout'); 
    // The button doesn't change text, but we wait for event loop to flush
    
    expect(mockLogout).toHaveBeenCalled();
    // mockShowToast and mockNavigate might be called asynchronously
    // it's safer to use setTimeout or just resolve promises
    await new Promise(r => setTimeout(r, 0));
    expect(mockShowToast).toHaveBeenCalledWith('Logged out.');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
