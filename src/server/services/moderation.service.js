const { createModerationAction } = require('../models/moderation-action.model');
const {
  findItemById,
  markItemAsRemovedById,
} = require('../models/item.model');
const { AppError } = require('./app-error');
const { deleteStoredImage } = require('./upload.service');

const REMOVE_ACTION = 'remove';

function parseItemId(value) {
  const itemId = Number(value);

  if (!Number.isInteger(itemId) || itemId < 1) {
    throw new AppError('A valid item id is required.', {
      statusCode: 400,
      code: 'INVALID_ITEM_ID',
    });
  }

  return itemId;
}

function normalizeReason(value) {
  return String(value || '').trim();
}

async function removeItemPost({ itemId, adminUserId, reason }) {
  const parsedItemId = parseItemId(itemId);
  const normalizedReason = normalizeReason(reason);

  if (!normalizedReason) {
    throw new AppError('reason is required.', {
      statusCode: 400,
      code: 'INVALID_REASON',
    });
  }

  const existingItem = await findItemById(parsedItemId);

  if (!existingItem) {
    throw new AppError('Item could not be found.', {
      statusCode: 404,
      code: 'ITEM_NOT_FOUND',
    });
  }

  if (existingItem.status === 'removed') {
    throw new AppError('Item is already removed.', {
      statusCode: 400,
      code: 'ITEM_ALREADY_REMOVED',
    });
  }

  await markItemAsRemovedById(parsedItemId);

  if (existingItem.imagePath) {
    await deleteStoredImage(existingItem.imagePath);
  }

  const updatedItem = await findItemById(parsedItemId);
  const moderationAction = await createModerationAction({
    itemId: parsedItemId,
    adminUserId,
    reason: normalizedReason,
    actionType: REMOVE_ACTION,
  });

  return {
    item: {
      id: updatedItem.id,
      ownerId: updatedItem.ownerId,
      itemType: updatedItem.itemType,
      title: updatedItem.title,
      description: updatedItem.description,
      category: updatedItem.category,
      location: updatedItem.location,
      status: updatedItem.status,
      imageUrl: null,
      createdAt: updatedItem.createdAt,
      updatedAt: updatedItem.updatedAt,
    },
    moderationAction,
  };
}

module.exports = {
  removeItemPost,
};
