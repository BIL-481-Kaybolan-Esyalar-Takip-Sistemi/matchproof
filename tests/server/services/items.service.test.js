jest.mock('../../../src/server/models/item.model', () => ({
  createItem: jest.fn(),
  deleteItemById: jest.fn(),
  findItemById: jest.fn(),
  searchItems: jest.fn(),
  updateItemStatusById: jest.fn(),
  updateItemById: jest.fn(),
}));

jest.mock('../../../src/server/services/upload.service', () => ({
  deleteStoredImage: jest.fn(),
  toPublicImageUrl: jest.fn((filename) => `/uploads/${filename}`),
}));

const itemModel = require('../../../src/server/models/item.model');
const uploadService = require('../../../src/server/services/upload.service');
const {
  createItem,
  getItemById,
  searchItems,
  updateItemStatus,
  updateItem,
  deleteItem,
} = require('../../../src/server/services/items.service');

describe('items.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createItem validates payload and returns mapped item', async () => {
    itemModel.createItem.mockResolvedValue({ id: 9 });
    itemModel.findItemById.mockResolvedValue({
      id: 9,
      ownerId: 1,
      itemType: 'lost',
      title: 'Wallet',
      description: 'Black wallet',
      category: 'Accessories',
      location: 'Library',
      status: 'open',
      imagePath: 'wallet.jpg',
      ownerName: 'Ada',
      ownerEmail: 'ada@example.com',
      createdAt: '2026-03-01T00:00:00.000Z',
      updatedAt: '2026-03-01T00:00:00.000Z',
    });

    const result = await createItem({
      userId: 1,
      payload: {
        itemType: 'lost',
        title: 'Wallet',
        description: 'Black wallet',
        category: 'Accessories',
        location: 'Library',
      },
      file: { filename: 'wallet.jpg' },
    });

    expect(itemModel.createItem).toHaveBeenCalledWith({
      ownerId: 1,
      itemType: 'lost',
      title: 'Wallet',
      description: 'Black wallet',
      category: 'Accessories',
      location: 'Library',
      isPrivate: false,
      imagePath: 'wallet.jpg',
    });
    expect(result.imageUrl).toBe('/uploads/wallet.jpg');
    expect(result.ownerContact).toEqual({
      name: 'Ada',
      email: 'ada@example.com',
    });
  });

  test('createItem rejects invalid itemType', async () => {
    await expect(
      createItem({
        userId: 1,
        payload: {
          itemType: 'other',
          title: 'Wallet',
          description: 'Black wallet',
          category: 'Accessories',
          location: 'Library',
        },
      })
    ).rejects.toMatchObject({ code: 'INVALID_ITEM_TYPE', statusCode: 400 });

    expect(itemModel.createItem).not.toHaveBeenCalled();
  });

  test('createItem stores null imagePath when no file is provided', async () => {
    itemModel.createItem.mockResolvedValue({ id: 12 });
    itemModel.findItemById.mockResolvedValue({
      id: 12,
      ownerId: 1,
      itemType: 'found',
      title: 'Keys',
      description: 'Blue keychain',
      category: 'Keys',
      location: 'Cafeteria',
      status: 'open',
      imagePath: null,
      ownerName: 'Ada',
      ownerEmail: 'ada@example.com',
      createdAt: '2026-03-01T00:00:00.000Z',
      updatedAt: '2026-03-01T00:00:00.000Z',
    });

    const result = await createItem({
      userId: 1,
      payload: {
        itemType: 'found',
        title: 'Keys',
        description: 'Blue keychain',
        category: 'Keys',
        location: 'Cafeteria',
      },
      file: undefined,
    });

    expect(itemModel.createItem).toHaveBeenCalledWith(
      expect.objectContaining({ imagePath: null })
    );
    expect(result.imageUrl).toBeNull();
  });

  test('createItem parses isPrivate truthy variants to true', async () => {
    itemModel.createItem.mockResolvedValue({ id: 20 });
    itemModel.findItemById.mockResolvedValue({
      id: 20,
      ownerId: 1,
      itemType: 'lost',
      title: 'Wallet',
      description: 'Black wallet',
      category: 'Accessories',
      location: 'Library',
      status: 'open',
      isPrivate: true,
      imagePath: null,
      ownerName: 'Ada',
      ownerEmail: 'ada@example.com',
      createdAt: '2026-03-01T00:00:00.000Z',
      updatedAt: '2026-03-01T00:00:00.000Z',
    });

    await createItem({
      userId: 1,
      payload: {
        itemType: 'lost',
        title: 'Wallet',
        description: 'Black wallet',
        category: 'Accessories',
        location: 'Library',
        isPrivate: '1',
      },
    });

    expect(itemModel.createItem).toHaveBeenCalledWith(
      expect.objectContaining({ isPrivate: true })
    );
  });

  test('getItemById hides removed item from non-owner/non-admin', async () => {
    itemModel.findItemById.mockResolvedValue({
      id: 5,
      ownerId: 99,
      status: 'removed',
      imagePath: null,
      ownerName: 'Owner',
      ownerEmail: 'owner@example.com',
      createdAt: '2026-03-01T00:00:00.000Z',
      updatedAt: '2026-03-01T00:00:00.000Z',
    });

    await expect(
      getItemById(5, { userId: 1, userRole: 'user' })
    ).rejects.toMatchObject({ code: 'ITEM_NOT_FOUND', statusCode: 404 });
  });

  test('getItemById returns removed item for owner', async () => {
    itemModel.findItemById.mockResolvedValue({
      id: 5,
      ownerId: 1,
      itemType: 'lost',
      title: 'Wallet',
      description: 'Black wallet',
      category: 'Accessories',
      location: 'Library',
      status: 'removed',
      imagePath: null,
      ownerName: 'Ada',
      ownerEmail: 'ada@example.com',
      createdAt: '2026-03-01T00:00:00.000Z',
      updatedAt: '2026-03-01T00:00:00.000Z',
    });

    const item = await getItemById(5, { userId: 1, userRole: 'user' });
    expect(item.id).toBe(5);
    expect(item.status).toBe('removed');
  });

  test('getItemById rejects invalid id values', async () => {
    await expect(getItemById('invalid-id')).rejects.toMatchObject({
      code: 'INVALID_ITEM_ID',
      statusCode: 400,
    });
  });

  test('getItemById returns not found when item does not exist', async () => {
    itemModel.findItemById.mockResolvedValue(null);

    await expect(getItemById(999, { userId: 1, userRole: 'user' })).rejects.toMatchObject({
      code: 'ITEM_NOT_FOUND',
      statusCode: 404,
    });
  });

  test('getItemById allows removed item for admin', async () => {
    itemModel.findItemById.mockResolvedValue({
      id: 5,
      ownerId: 7,
      itemType: 'lost',
      title: 'Wallet',
      description: 'Black wallet',
      category: 'Accessories',
      location: 'Library',
      status: 'removed',
      imagePath: null,
      ownerName: 'Ada',
      ownerEmail: 'ada@example.com',
      createdAt: '2026-03-01T00:00:00.000Z',
      updatedAt: '2026-03-01T00:00:00.000Z',
    });

    const item = await getItemById(5, { userId: 1, userRole: 'admin' });
    expect(item.id).toBe(5);
  });

  test('getItemById returns non-removed items regardless of requester role', async () => {
    itemModel.findItemById.mockResolvedValue({
      id: 8,
      ownerId: 42,
      itemType: 'found',
      title: 'Card',
      description: 'Campus card',
      category: 'Cards',
      location: 'Lab',
      status: 'open',
      isPrivate: false,
      imagePath: null,
      ownerName: 'Owner',
      ownerEmail: 'owner@example.com',
      createdAt: '2026-03-01T00:00:00.000Z',
      updatedAt: '2026-03-01T00:00:00.000Z',
    });

    const item = await getItemById(8, { userId: 7, userRole: 'user' });

    expect(item.id).toBe(8);
    expect(item.status).toBe('open');
  });

  test('searchItems validates and returns pagination envelope', async () => {
    itemModel.searchItems.mockResolvedValue({
      items: [
        {
          id: 1,
          ownerId: 1,
          itemType: 'lost',
          title: 'Wallet',
          description: 'Black wallet',
          category: 'Accessories',
          location: 'Library',
          status: 'open',
          imagePath: null,
          createdAt: '2026-03-01T00:00:00.000Z',
          updatedAt: '2026-03-01T00:00:00.000Z',
        },
      ],
      total: 1,
    });

    const result = await searchItems({
      query: 'wallet',
      status: 'open',
      page: '2',
      pageSize: '10',
    });

    expect(itemModel.searchItems).toHaveBeenCalledWith(
      expect.objectContaining({
        queryText: 'wallet',
        status: 'open',
        page: 2,
        pageSize: 10,
      })
    );
    expect(result.pagination).toEqual({
      page: 2,
      pageSize: 10,
      total: 1,
      totalPages: 1,
    });
  });

  test('searchItems returns zero totalPages when there are no results', async () => {
    itemModel.searchItems.mockResolvedValue({ items: [], total: 0 });

    const result = await searchItems({ page: '1', pageSize: '10' });

    expect(result.pagination.totalPages).toBe(0);
    expect(result.items).toEqual([]);
  });

  test('searchItems validates query parameters and date rules', async () => {
    await expect(
      searchItems({ page: '0' })
    ).rejects.toMatchObject({ code: 'INVALID_PAGE', statusCode: 400 });

    await expect(
      searchItems({ pageSize: '200' })
    ).rejects.toMatchObject({ code: 'INVALID_PAGESIZE', statusCode: 400 });

    await expect(
      searchItems({ status: 'removed' })
    ).rejects.toMatchObject({ code: 'INVALID_STATUS', statusCode: 400 });

    await expect(
      searchItems({ itemType: 'unknown' })
    ).rejects.toMatchObject({ code: 'INVALID_ITEM_TYPE', statusCode: 400 });

    await expect(
      searchItems({ dateFrom: '2026-03-10', dateTo: '2026-03-09' })
    ).rejects.toMatchObject({ code: 'INVALID_DATE_RANGE', statusCode: 400 });

    await expect(
      searchItems({ dateFrom: '2026-13-01' })
    ).rejects.toMatchObject({ code: 'INVALID_DATEFROM', statusCode: 400 });

    await expect(
      searchItems({ dateTo: '20260301' })
    ).rejects.toMatchObject({ code: 'INVALID_DATETO', statusCode: 400 });
  });

  test('searchItems normalizes empty optional fields to null', async () => {
    itemModel.searchItems.mockResolvedValue({ items: [], total: 0 });

    await searchItems({ query: '  ', category: '  ', status: '', itemType: '' });

    expect(itemModel.searchItems).toHaveBeenCalledWith(
      expect.objectContaining({
        queryText: null,
        category: null,
        status: null,
        itemType: null,
      })
    );
  });

  test('updateItemStatus rejects invalid status transition', async () => {
    itemModel.findItemById.mockResolvedValue({
      id: 1,
      ownerId: 1,
      status: 'open',
    });

    await expect(
      updateItemStatus({ itemId: 1, userId: 1, status: 'resolved' })
    ).rejects.toMatchObject({ code: 'INVALID_STATUS_TRANSITION', statusCode: 400 });

    expect(itemModel.updateItemStatusById).not.toHaveBeenCalled();
  });

  test('updateItemStatus rejects missing status value', async () => {
    itemModel.findItemById.mockResolvedValue({ id: 1, ownerId: 1, status: 'open' });

    await expect(
      updateItemStatus({ itemId: 1, userId: 1, status: '' })
    ).rejects.toMatchObject({ code: 'INVALID_STATUS', statusCode: 400 });
  });

  test('updateItemStatus rejects invalid mutable status values', async () => {
    itemModel.findItemById.mockResolvedValue({ id: 1, ownerId: 1, status: 'open' });

    await expect(
      updateItemStatus({ itemId: 1, userId: 1, status: 'open' })
    ).rejects.toMatchObject({ code: 'INVALID_STATUS', statusCode: 400 });
  });

  test('updateItemStatus rejects when status transition starts from removed', async () => {
    itemModel.findItemById.mockResolvedValue({ id: 1, ownerId: 1, status: 'removed' });

    await expect(
      updateItemStatus({ itemId: 1, userId: 1, status: 'claimed' })
    ).rejects.toMatchObject({ code: 'INVALID_STATUS_TRANSITION', statusCode: 400 });
  });

  test('updateItemStatus rejects when item is missing', async () => {
    itemModel.findItemById.mockResolvedValue(null);

    await expect(
      updateItemStatus({ itemId: 1, userId: 1, status: 'claimed' })
    ).rejects.toMatchObject({ code: 'ITEM_NOT_FOUND', statusCode: 404 });
  });

  test('updateItemStatus updates valid transition', async () => {
    itemModel.findItemById
      .mockResolvedValueOnce({ id: 1, ownerId: 1, status: 'open' })
      .mockResolvedValueOnce({
        id: 1,
        ownerId: 1,
        itemType: 'lost',
        title: 'Wallet',
        description: 'Black wallet',
        category: 'Accessories',
        location: 'Library',
        status: 'claimed',
        imagePath: null,
        ownerName: 'Ada',
        ownerEmail: 'ada@example.com',
        createdAt: '2026-03-01T00:00:00.000Z',
        updatedAt: '2026-03-01T00:00:00.000Z',
      });

    await updateItemStatus({ itemId: 1, userId: 1, status: 'claimed' });

    expect(itemModel.updateItemStatusById).toHaveBeenCalledWith(1, 'claimed');
  });

  test('updateItem replaces image and removes previous file', async () => {
    itemModel.findItemById
      .mockResolvedValueOnce({
        id: 1,
        ownerId: 1,
        itemType: 'lost',
        title: 'Wallet',
        description: 'Black wallet',
        category: 'Accessories',
        location: 'Library',
        status: 'open',
        imagePath: 'old.jpg',
      })
      .mockResolvedValueOnce({
        id: 1,
        ownerId: 1,
        itemType: 'lost',
        title: 'Wallet Updated',
        description: 'Black wallet',
        category: 'Accessories',
        location: 'Library',
        status: 'open',
        imagePath: 'new.jpg',
        ownerName: 'Ada',
        ownerEmail: 'ada@example.com',
        createdAt: '2026-03-01T00:00:00.000Z',
        updatedAt: '2026-03-01T00:00:00.000Z',
      });

    await updateItem({
      itemId: 1,
      userId: 1,
      payload: { title: 'Wallet Updated' },
      file: { filename: 'new.jpg' },
    });

    expect(itemModel.updateItemById).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ title: 'Wallet Updated', imagePath: 'new.jpg' })
    );
    expect(uploadService.deleteStoredImage).toHaveBeenCalledWith('old.jpg');
  });

  test('updateItem rejects removed items', async () => {
    itemModel.findItemById.mockResolvedValue({
      id: 1,
      ownerId: 1,
      status: 'removed',
      itemType: 'lost',
      title: 'Wallet',
      description: 'Black wallet',
      category: 'Accessories',
      location: 'Library',
      imagePath: null,
    });

    await expect(
      updateItem({ itemId: 1, userId: 1, payload: { title: 'x' } })
    ).rejects.toMatchObject({ code: 'ITEM_REMOVED', statusCode: 400 });
  });

  test('updateItem rejects empty updates without file', async () => {
    itemModel.findItemById.mockResolvedValue({
      id: 1,
      ownerId: 1,
      status: 'open',
      itemType: 'lost',
      title: 'Wallet',
      description: 'Black wallet',
      category: 'Accessories',
      location: 'Library',
      imagePath: null,
    });

    await expect(
      updateItem({ itemId: 1, userId: 1, payload: {}, file: null })
    ).rejects.toMatchObject({ code: 'EMPTY_ITEM_UPDATE', statusCode: 400 });
  });

  test('updateItem validates provided itemType and required fields', async () => {
    itemModel.findItemById.mockResolvedValue({
      id: 1,
      ownerId: 1,
      status: 'open',
      itemType: 'lost',
      title: 'Wallet',
      description: 'Black wallet',
      category: 'Accessories',
      location: 'Library',
      imagePath: null,
    });

    await expect(
      updateItem({ itemId: 1, userId: 1, payload: { itemType: 'bad' } })
    ).rejects.toMatchObject({ code: 'INVALID_ITEM_TYPE', statusCode: 400 });

    await expect(
      updateItem({ itemId: 1, userId: 1, payload: { title: '' } })
    ).rejects.toMatchObject({ code: 'INVALID_TITLE', statusCode: 400 });
  });

  test('updateItem updates with existing image when no new file is provided', async () => {
    itemModel.findItemById
      .mockResolvedValueOnce({
        id: 1,
        ownerId: 1,
        itemType: 'lost',
        title: 'Wallet',
        description: 'Black wallet',
        category: 'Accessories',
        location: 'Library',
        status: 'open',
        imagePath: 'old.jpg',
      })
      .mockResolvedValueOnce({
        id: 1,
        ownerId: 1,
        itemType: 'lost',
        title: 'Wallet Updated',
        description: 'Black wallet',
        category: 'Accessories',
        location: 'Library',
        status: 'open',
        imagePath: 'old.jpg',
        ownerName: 'Ada',
        ownerEmail: 'ada@example.com',
        createdAt: '2026-03-01T00:00:00.000Z',
        updatedAt: '2026-03-01T00:00:00.000Z',
      });

    await updateItem({
      itemId: 1,
      userId: 1,
      payload: { title: 'Wallet Updated' },
      file: null,
    });

    expect(itemModel.updateItemById).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ imagePath: 'old.jpg' })
    );
    expect(uploadService.deleteStoredImage).not.toHaveBeenCalled();
  });

  test('updateItem parses false-y isPrivate variants to false', async () => {
    itemModel.findItemById
      .mockResolvedValueOnce({
        id: 3,
        ownerId: 1,
        itemType: 'lost',
        title: 'Wallet',
        description: 'Black wallet',
        category: 'Accessories',
        location: 'Library',
        status: 'open',
        isPrivate: true,
        imagePath: null,
      })
      .mockResolvedValueOnce({
        id: 3,
        ownerId: 1,
        itemType: 'lost',
        title: 'Wallet',
        description: 'Black wallet',
        category: 'Accessories',
        location: 'Library',
        status: 'open',
        isPrivate: false,
        imagePath: null,
        ownerName: 'Ada',
        ownerEmail: 'ada@example.com',
        createdAt: '2026-03-01T00:00:00.000Z',
        updatedAt: '2026-03-01T00:00:00.000Z',
      });

    await updateItem({
      itemId: 3,
      userId: 1,
      payload: { isPrivate: '0' },
      file: null,
    });

    expect(itemModel.updateItemById).toHaveBeenCalledWith(
      3,
      expect.objectContaining({ isPrivate: false })
    );
  });

  test('deleteItem enforces ownership', async () => {
    itemModel.findItemById.mockResolvedValue({ id: 1, ownerId: 5, imagePath: null });

    await expect(deleteItem({ itemId: 1, userId: 1 })).rejects.toMatchObject({
      code: 'ITEM_OWNERSHIP_REQUIRED',
      statusCode: 403,
    });

    expect(itemModel.deleteItemById).not.toHaveBeenCalled();
  });

  test('deleteItem removes item and associated image', async () => {
    itemModel.findItemById.mockResolvedValue({ id: 1, ownerId: 1, imagePath: 'img.jpg' });
    itemModel.deleteItemById.mockResolvedValue({ id: 1 });

    await deleteItem({ itemId: 1, userId: 1 });

    expect(itemModel.deleteItemById).toHaveBeenCalledWith(1);
    expect(uploadService.deleteStoredImage).toHaveBeenCalledWith('img.jpg');
  });

  test('deleteItem does not delete image when item has no imagePath', async () => {
    itemModel.findItemById.mockResolvedValue({ id: 1, ownerId: 1, imagePath: null });
    itemModel.deleteItemById.mockResolvedValue({ id: 1 });

    await deleteItem({ itemId: 1, userId: 1 });

    expect(uploadService.deleteStoredImage).not.toHaveBeenCalled();
  });
});
