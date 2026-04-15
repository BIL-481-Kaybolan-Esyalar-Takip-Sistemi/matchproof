import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../../src/client/context/AuthContext';
import { Auth } from '../../../src/client/api';

jest.mock('../../../src/client/api');

// A dummy component to consume context
function TestComponent() {
  const { user, login, register, logout } = useAuth();
  return (
    <div>
      <div data-testid="user-status">{user === undefined ? 'loading' : user ? user.name : 'empty'}</div>
      <button onClick={() => login({ email: 'test@test.com' })}>Login</button>
      <button onClick={() => register({ email: 'new@test.com' })}>Register</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initially checks session and sets user', async () => {
    Auth.me.mockResolvedValueOnce({ user: { name: 'Initial User' } });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initial state is undefined (loading) -> handled by components usually
    expect(Auth.me).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.getByTestId('user-status').textContent).toBe('Initial User');
    });
  });

  it('sets user to null if initial check fails', async () => {
    Auth.me.mockRejectedValueOnce(new Error('Not logged in'));
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-status').textContent).toBe('empty');
    });
  });

  it('updates state on login, register, logout', async () => {
    Auth.me.mockResolvedValueOnce({ user: { name: 'Initial' } });
    Auth.login.mockResolvedValueOnce({ user: { name: 'Logged In User' } });
    Auth.register.mockResolvedValueOnce({ user: { name: 'Registered User' } });
    Auth.logout.mockResolvedValueOnce({});
    
    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-status').textContent).toBe('Initial');
    });

    // Test Login
    fireEvent.click(getByText('Login'));
    await waitFor(() => {
      expect(screen.getByTestId('user-status').textContent).toBe('Logged In User');
    });

    // Test Register
    fireEvent.click(getByText('Register'));
    await waitFor(() => {
      expect(screen.getByTestId('user-status').textContent).toBe('Registered User');
    });

    // Test Logout
    fireEvent.click(getByText('Logout'));
    await waitFor(() => {
      expect(screen.getByTestId('user-status').textContent).toBe('empty');
    });
  });
});
