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
    create: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock('../../../src/client/context/ToastContext', () => ({
  useToast: jest.fn(),
}));

import PostFormPage from '../../../src/client/pages/PostFormPage';
import { Items } from '../../../src/client/api';
import { useToast } from '../../../src/client/context/ToastContext';
import { useNavigate, useParams } from 'react-router-dom';

describe('PostFormPage component', () => {
  const mockNavigate = jest.fn();
  const mockShowToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useToast.mockReturnValue({ showToast: mockShowToast });
    useParams.mockReturnValue({});
  });

  test('shows validation errors for missing required fields', async () => {
    render(<PostFormPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Save Post' }));

    await waitFor(() => {
      expect(screen.getByText('Title is required.')).toBeInTheDocument();
    });
    expect(Items.create).not.toHaveBeenCalled();
  });

  test('creates post and navigates to detail page', async () => {
    Items.create.mockResolvedValueOnce({ item: { id: 99 } });

    render(<PostFormPage />);

    fireEvent.change(screen.getByPlaceholderText('e.g. Black leather wallet'), { target: { value: 'Black Wallet' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Wallet' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. Library, Floor 2'), { target: { value: 'Library' } });
    fireEvent.change(screen.getByPlaceholderText('Describe the item in detail…'), { target: { value: 'Leather wallet with student card.' } });

    fireEvent.click(screen.getByRole('button', { name: 'Save Post' }));

    await waitFor(() => {
      expect(Items.create).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Black Wallet',
        category: 'Wallet',
        location: 'Library',
        description: 'Leather wallet with student card.',
      }), null);
      expect(mockShowToast).toHaveBeenCalledWith('Post created!');
      expect(mockNavigate).toHaveBeenCalledWith('/items/99');
    });
  });

  test('forces private mode for sensitive ID Card category in the form', async () => {
    Items.create.mockResolvedValueOnce({ item: { id: 101 } });

    render(<PostFormPage />);

    fireEvent.change(screen.getByPlaceholderText('e.g. Black leather wallet'), { target: { value: 'Student ID' } });
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'ID Card' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. Library, Floor 2'), { target: { value: 'Library' } });
    fireEvent.change(screen.getByPlaceholderText('Describe the item in detail…'), { target: { value: 'Blue student card' } });

    const privateCheckbox = screen.getByRole('checkbox');
    await waitFor(() => {
      expect(privateCheckbox).toBeChecked();
      expect(privateCheckbox).toBeDisabled();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Save Post' }));

    await waitFor(() => {
      expect(Items.create).toHaveBeenCalledWith(
        expect.objectContaining({ category: 'ID Card', isPrivate: true }),
        null
      );
    });
  });

  test('loads item in edit mode and saves changes', async () => {
    useParams.mockReturnValue({ itemId: '12' });
    Items.get.mockResolvedValueOnce({
      item: {
        id: 12,
        itemType: 'found',
        title: 'Old Title',
        category: 'Keys',
        location: 'Lab',
        description: 'Old description',
        imageUrl: null,
      },
    });
    Items.update.mockResolvedValueOnce({ item: { id: 12 } });

    render(<PostFormPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Old Title')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByDisplayValue('Old Title'), { target: { value: 'Updated Title' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => {
      expect(Items.update).toHaveBeenCalledWith('12', expect.objectContaining({ title: 'Updated Title' }), null);
      expect(mockShowToast).toHaveBeenCalledWith('Post updated!');
      expect(mockNavigate).toHaveBeenCalledWith('/items/12');
    });
  });
});
