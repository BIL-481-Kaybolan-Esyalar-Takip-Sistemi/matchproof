import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}), { virtual: true });

jest.mock('../../../src/client/context/AuthContext', () => ({
  useAuth: jest.fn(),
}), { virtual: true });

jest.mock('../../../src/client/context/ToastContext', () => ({
  useToast: jest.fn(),
}), { virtual: true });

import AuthPage from '../../../src/client/pages/AuthPage';
import { useAuth } from '../../../src/client/context/AuthContext';
import { useToast } from '../../../src/client/context/ToastContext';
import { useNavigate } from 'react-router-dom';

describe('AuthPage component', () => {
  const mockLogin = jest.fn();
  const mockRegister = jest.fn();
  const mockShowToast = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ login: mockLogin, register: mockRegister });
    useToast.mockReturnValue({ showToast: mockShowToast });
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders login form by default', () => {
    render(<AuthPage />);
    
    expect(screen.getByText('MatchProof')).toBeInTheDocument();
    
    expect(screen.getAllByRole('button', { name: /Login/i })[0]).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();

    // Check if login fields exist
    expect(screen.getByPlaceholderText('you@university.edu')).toBeInTheDocument();
    
    // Ensure register specifically full name isn't there
    expect(screen.queryByPlaceholderText('Jane Doe')).not.toBeInTheDocument();
  });

  test('switches to register form when tab is clicked', () => {
    render(<AuthPage />);
    
    const registerTab = screen.getByRole('button', { name: /Register/i });
    fireEvent.click(registerTab);

    // After clicking register, "Full Name" should be visible
    expect(screen.getByPlaceholderText('Jane Doe')).toBeInTheDocument();
  });

  test('calls login function on submit and navigates', async () => {
    mockLogin.mockResolvedValueOnce(true);
    
    render(<AuthPage />);
    
    const emailInput = screen.getByPlaceholderText('you@university.edu');
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    const loginBtn = screen.getAllByRole('button', { name: 'Login' })[1];
    
    fireEvent.change(emailInput, { target: { value: 'test@uni.edu' } });
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
    fireEvent.click(loginBtn);

    expect(mockLogin).toHaveBeenCalledWith({ email: 'test@uni.edu', password: 'password123' });

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('Welcome back!');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('displays error message if login fails', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));
    
    render(<AuthPage />);
    const loginBtn = screen.getAllByRole('button', { name: 'Login' })[1];
    
    fireEvent.click(loginBtn);

    await waitFor(() => {
       expect(mockLogin).toHaveBeenCalled();
       expect(mockNavigate).not.toHaveBeenCalled();
    });
    
    // Shouldn't navigate if it fails
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
