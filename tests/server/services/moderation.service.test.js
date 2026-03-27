jest.mock('../../../src/server/models/item.model', () => ({
  findItemById: jest.fn(),
  markItemAsRemovedById: jest.fn(),
}));

jest.mock('../../../src/server/models/moderation-action.model', () => ({
  createModerationAction: jest.fn(),
}));

jest.mock('../../../src/server/services/upload.service', () => ({
  deleteStoredImage: jest.fn(),
}));

const { findItemById, markItemAsRemovedById } = require('../../../src/server/models/item.model');
const { createModerationAction } = require('../../../src/server/models/moderation-action.model');
const { deleteStoredImage } = require('../../../src/server/services/upload.service');
const { removeItemPost } = require('../../../src/server/services/moderation.service');

describe('moderation.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('rejects invalid itemId', async () => {
    await expect(
      removeItemPost({ itemId: 'not-a-number', adminUserId: 1, reason: 'spam' })
    ).rejects.toMatchObject({ code: 'INVALID_ITEM_ID', statusCode: 400 });
  });

  test('rejects empty reason', async () => {
    await expect(
      removeItemPost({ itemId: 5, adminUserId: 1, reason: '   ' })
    ).rejects.toMatchObject({ code: 'INVALID_REASON', statusCode: 400 });
  });

  test('rejects missing reason value', async () => {
    await expect(
      removeItemPost({ itemId: 5, adminUserId: 1, reason: undefined })
    ).rejects.toMatchObject({ code: 'INVALID_REASON', statusCode: 400 });
  });

  test('rejects missing item', async () => {
    findItemById.mockResolvedValue(null);

    await expect(
      removeItemPost({ itemId: 5, adminUserId: 1, reason: 'duplicate' })
    ).rejects.toMatchObject({ code: 'ITEM_NOT_FOUND', statusCode: 404 });
  });

  test('rejects already removed item', async () => {
    findItemById.mockResolvedValue({ id: 5, status: 'removed' });

    await expect(
      removeItemPost({ itemId: 5, adminUserId: 1, reason: 'duplicate' })
    ).rejects.toMatchObject({ code: 'ITEM_ALREADY_REMOVED', statusCode: 400 });
  });

  test('removes item, deletes image, and creates moderation action', async () => {
    findItemById
      .mockResolvedValueOnce({
        id: 5,
        ownerId: 9,
        itemType: 'found',
        title: 'Phone',
        description: 'Blue phone',
        category: 'Electronics',
        location: 'Cafeteria',
        status: 'open',
        imagePath: 'phone.jpg',
      })
      .mockResolvedValueOnce({
        id: 5,
        ownerId: 9,
        itemType: 'found',
        title: 'Phone',
        description: 'Blue phone',
        category: 'Electronics',
        location: 'Cafeteria',
        status: 'removed',
        imagePath: null,
        createdAt: '2026-03-01T00:00:00.000Z',
        updatedAt: '2026-03-02T00:00:00.000Z',
      });

    createModerationAction.mockResolvedValue({
      id: 101,
      itemId: 5,
      adminUserId: 1,
      reason: 'duplicate',
      actionType: 'remove',
      createdAt: '2026-03-02T00:00:00.000Z',
    });

    const result = await removeItemPost({
      itemId: '5',
      adminUserId: 1,
      reason: ' duplicate ',
    });

    expect(markItemAsRemovedById).toHaveBeenCalledWith(5);
    expect(deleteStoredImage).toHaveBeenCalledWith('phone.jpg');
    expect(createModerationAction).toHaveBeenCalledWith({
      itemId: 5,
      adminUserId: 1,
      reason: 'duplicate',
      actionType: 'remove',
    });

    expect(result.item).toEqual({
      id: 5,
      ownerId: 9,
      itemType: 'found',
      title: 'Phone',
      description: 'Blue phone',
      category: 'Electronics',
      location: 'Cafeteria',
      status: 'removed',
      imageUrl: null,
      createdAt: '2026-03-01T00:00:00.000Z',
      updatedAt: '2026-03-02T00:00:00.000Z',
    });
    expect(result.moderationAction.id).toBe(101);
  });

  test('skips image deletion when item has no imagePath', async () => {
    findItemById
      .mockResolvedValueOnce({
        id: 8,
        ownerId: 9,
        itemType: 'found',
        title: 'Notebook',
        description: 'Blue notebook',
        category: 'Books',
        location: 'Library',
        status: 'open',
        imagePath: null,
      })
      .mockResolvedValueOnce({
        id: 8,
        ownerId: 9,
        itemType: 'found',
        title: 'Notebook',
        description: 'Blue notebook',
        category: 'Books',
        location: 'Library',
        status: 'removed',
        imagePath: null,
        createdAt: '2026-03-01T00:00:00.000Z',
        updatedAt: '2026-03-02T00:00:00.000Z',
      });

    createModerationAction.mockResolvedValue({ id: 1, actionType: 'remove' });

    await removeItemPost({ itemId: 8, adminUserId: 1, reason: 'duplicate' });

    expect(deleteStoredImage).not.toHaveBeenCalled();
  });
});
