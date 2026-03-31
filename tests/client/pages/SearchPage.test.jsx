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
}));

jest.mock('../../../src/client/context/ToastContext', () => ({
  useToast: jest.fn(),
}));

import SearchPage from '../../../src/client/pages/SearchPage';
import { Items } from '../../../src/client/api';
import { useToast } from '../../../src/client/context/ToastContext';
import { useNavigate } from 'react-router-dom';

describe('SearchPage component', () => {
  const mockNavigate = jest.fn();
  const mockShowToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useToast.mockReturnValue({ showToast: mockShowToast });
  });

  test('renders page header and default search inputs', async () => {
    Items.search.mockResolvedValueOnce({ items: [], pagination: { total: 0, page: 1, totalPages: 0 } });
    
    render(<SearchPage />);

    expect(screen.getByText('Lost & Found Board')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('keywords…')).toBeInTheDocument();
    
    expect(screen.getByRole('button', { name: /\+ New Post/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(Items.search).toHaveBeenCalledWith(expect.objectContaining({ page: 1 }));
    });
  });

  test('displays fetched items on load', async () => {
    const mockData = {
      items: [
        { id: 1, title: 'Lost Keys', description: 'Found keys', itemType: 'lost', status: 'open', createdAt: new Date().toISOString() }
      ],
      pagination: { total: 1, page: 1, totalPages: 1 }
    };
    
    Items.search.mockResolvedValueOnce(mockData);

    render(<SearchPage />);

    await waitFor(() => {
      expect(screen.getByText('Lost Keys')).toBeInTheDocument();
      expect(screen.getByText('1 result')).toBeInTheDocument();
    });
  });

  test('navigates to item details when clicking an item card', async () => {
    const mockData = {
      items: [
        { id: 42, title: 'Target Item', description: 'desc', itemType: 'found', status: 'open', createdAt: new Date().toISOString() }
      ],
      pagination: { total: 1, page: 1, totalPages: 1 }
    };
    Items.search.mockResolvedValueOnce(mockData);

    render(<SearchPage />);

    await waitFor(() => {
      expect(screen.getByText('Target Item')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Target Item'));
    expect(mockNavigate).toHaveBeenCalledWith('/items/42');
  });

  test('handles search API failure gracefully', async () => {
    Items.search.mockRejectedValueOnce(new Error('Network Error'));

    render(<SearchPage />);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('Network Error', 'error');
    });
  });

  test('applies draft filters when clicking Find', async () => {
    Items.search
      .mockResolvedValueOnce({ items: [], pagination: { total: 0, page: 1, totalPages: 0 } })
      .mockResolvedValueOnce({ items: [], pagination: { total: 0, page: 1, totalPages: 0 } });

    render(<SearchPage />);

    await waitFor(() => {
      expect(Items.search).toHaveBeenCalledTimes(1);
    });

    fireEvent.change(screen.getByPlaceholderText('keywords…'), { target: { value: 'wallet' } });
    fireEvent.click(screen.getByRole('button', { name: 'Find' }));

    await waitFor(() => {
      expect(Items.search).toHaveBeenCalledTimes(2);
      expect(Items.search).toHaveBeenLastCalledWith(expect.objectContaining({ query: 'wallet', page: 1 }));
    });
  });
});
