import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../../src/client/api', () => ({
  Items: {
    search: jest.fn(),
  },
  Moderation: {
    removePost: jest.fn(),
  },
}));

jest.mock('../../../src/client/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../src/client/context/ToastContext', () => ({
  useToast: jest.fn(),
}));

import AdminPage from '../../../src/client/pages/AdminPage';
import { Items, Moderation } from '../../../src/client/api';
import { useAuth } from '../../../src/client/context/AuthContext';
import { useToast } from '../../../src/client/context/ToastContext';
import { useNavigate } from 'react-router-dom';

describe('AdminPage component', () => {
  const mockNavigate = jest.fn();
  const mockShowToast = jest.fn();

  const item = {
    id: 7,
    title: 'Lost Wallet',
    description: 'Black leather wallet with cards',
    itemType: 'lost',
    status: 'open',
    category: 'Wallet',
    location: 'Library',
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useToast.mockReturnValue({ showToast: mockShowToast });
    Items.search.mockResolvedValue({
      items: [],
      pagination: { total: 0, page: 1, totalPages: 0 },
    });
  });

  test('shows access denied for non-admin user', async () => {
    useAuth.mockReturnValue({ user: { id: 1, role: 'user' } });

    render(<AdminPage />);

    expect(screen.getByText('Access denied. Admin role required.')).toBeInTheDocument();
    await waitFor(() => {
      expect(Items.search).toHaveBeenCalledWith({ page: 1, pageSize: 20 });
    });
  });

  test('loads and displays moderation items for admin', async () => {
    useAuth.mockReturnValue({ user: { id: 9, role: 'admin' } });
    Items.search.mockResolvedValueOnce({
      items: [item],
      pagination: { total: 1, page: 1, totalPages: 1 },
    });

    render(<AdminPage />);

    await waitFor(() => {
      expect(Items.search).toHaveBeenCalledWith({ page: 1, pageSize: 20 });
    });

    expect(screen.getByText('Moderation Panel')).toBeInTheDocument();
    expect(await screen.findByText('Lost Wallet')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'View' }));
    expect(mockNavigate).toHaveBeenCalledWith('/items/7');
  });

  test('prevents removal without reason', async () => {
    useAuth.mockReturnValue({ user: { id: 9, role: 'admin' } });
    Items.search.mockResolvedValueOnce({
      items: [item],
      pagination: { total: 1, page: 1, totalPages: 1 },
    });

    render(<AdminPage />);

    await waitFor(() => {
      expect(screen.getByText('Lost Wallet')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByRole('button', { name: 'Remove' })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: 'Remove' })[1]);

    expect(mockShowToast).toHaveBeenCalledWith('Reason is required.', 'error');
    expect(Moderation.removePost).not.toHaveBeenCalled();
  });

  test('removes post with reason and refreshes list', async () => {
    useAuth.mockReturnValue({ user: { id: 9, role: 'admin' } });
    Items.search
      .mockResolvedValueOnce({
        items: [item],
        pagination: { total: 1, page: 1, totalPages: 1 },
      })
      .mockResolvedValueOnce({
        items: [],
        pagination: { total: 0, page: 1, totalPages: 0 },
      });
    Moderation.removePost.mockResolvedValueOnce({ ok: true });

    render(<AdminPage />);

    await waitFor(() => {
      expect(screen.getByText('Lost Wallet')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByRole('button', { name: 'Remove' })[0]);
    fireEvent.change(screen.getByPlaceholderText('e.g. Duplicate post, inappropriate content…'), { target: { value: 'duplicate' } });
    fireEvent.click(screen.getAllByRole('button', { name: 'Remove' })[1]);

    await waitFor(() => {
      expect(Moderation.removePost).toHaveBeenCalledWith(7, 'duplicate');
      expect(mockShowToast).toHaveBeenCalledWith('Post removed.');
      expect(Items.search).toHaveBeenCalledTimes(2);
    });
  });
});
