import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('../../../src/client/api', () => ({
  Items: {
    get: jest.fn(),
    getMatches: jest.fn(),
    updateStatus: jest.fn(),
    delete: jest.fn(),
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

import DetailPage from '../../../src/client/pages/DetailPage';
import { Items, Moderation } from '../../../src/client/api';
import { useAuth } from '../../../src/client/context/AuthContext';
import { useToast } from '../../../src/client/context/ToastContext';
import { useNavigate, useParams } from 'react-router-dom';

describe('DetailPage component', () => {
  const mockNavigate = jest.fn();
  const mockShowToast = jest.fn();

  const baseItem = {
    id: 42,
    ownerId: 1,
    itemType: 'lost',
    status: 'open',
    title: 'Lost Keys',
    description: 'Keys with blue keychain',
    category: 'Keys',
    location: 'Cafeteria',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ownerContact: { name: 'Alice', email: 'alice@uni.edu' },
    imageUrl: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({ itemId: '42' });
    useToast.mockReturnValue({ showToast: mockShowToast });
    Items.getMatches.mockResolvedValue({ matches: [] });
  });

  test('renders error alert when item fetch fails', async () => {
    useAuth.mockReturnValue({ user: null });
    Items.get.mockRejectedValueOnce(new Error('Item not found'));

    render(<DetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Item not found')).toBeInTheDocument();
    });
  });

  test('owner can mark item as claimed', async () => {
    useAuth.mockReturnValue({ user: { id: 1, role: 'user' } });
    Items.get.mockResolvedValueOnce({ item: baseItem });
    Items.updateStatus.mockResolvedValueOnce({ item: { ...baseItem, status: 'claimed' } });

    render(<DetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Lost Keys')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Mark as Claimed' }));

    await waitFor(() => {
      expect(Items.updateStatus).toHaveBeenCalledWith(42, 'claimed');
      expect(mockShowToast).toHaveBeenCalledWith('Status updated to "claimed"');
    });
  });

  test('admin removal requires reason and then removes post', async () => {
    useAuth.mockReturnValue({ user: { id: 9, role: 'admin' } });
    Items.get.mockResolvedValueOnce({ item: { ...baseItem, ownerId: 77 } });
    Moderation.removePost.mockResolvedValueOnce({ ok: true });

    render(<DetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Lost Keys')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Remove Post' }));
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));

    expect(mockShowToast).toHaveBeenCalledWith('Reason is required.', 'error');
    expect(Moderation.removePost).not.toHaveBeenCalled();

    fireEvent.change(screen.getByPlaceholderText('e.g. Duplicate post, inappropriate content…'), { target: { value: 'duplicate' } });
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));

    await waitFor(() => {
      expect(Moderation.removePost).toHaveBeenCalledWith(42, 'duplicate');
      expect(mockShowToast).toHaveBeenCalledWith('Post removed by admin.');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('renders AI matches and navigates to match detail on click', async () => {
    useAuth.mockReturnValue({ user: { id: 1, role: 'user' } });
    Items.get.mockResolvedValueOnce({ item: baseItem });
    Items.getMatches.mockResolvedValueOnce({
      matches: [
        {
          itemId: 88,
          score: 0.82,
          reasons: ['Same category'],
          item: {
            id: 88,
            ownerId: 7,
            itemType: 'found',
            title: 'Found Keys',
            description: 'Keys near cafeteria',
            category: 'Keys',
            location: 'Cafeteria',
            status: 'open',
            isPrivate: false,
            imageUrl: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      ],
    });

    render(<DetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Found Keys')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('match-card-88'));
    expect(mockNavigate).toHaveBeenCalledWith('/items/88');
  });

  test('shows fallback message when AI matches are unavailable', async () => {
    useAuth.mockReturnValue({ user: { id: 1, role: 'user' } });
    Items.get.mockResolvedValueOnce({ item: baseItem });
    Items.getMatches.mockRejectedValueOnce(new Error('AI unavailable'));

    render(<DetailPage />);

    await waitFor(() => {
      expect(screen.getByText('AI matching is temporarily unavailable. You can continue with manual search and filters.')).toBeInTheDocument();
    });
  });
});
