const {
  createItem: insertItem,
  deleteItemById,
  findItemById,
  updateItemById,
} = require('../models/item.model');
const { AppError } = require('./app-error');
const { deleteStoredImage, toPublicImageUrl } = require('./upload.service');

const VALID_ITEM_TYPES = new Set(['lost', 'found']);

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

function normalizeText(value) {
  return String(value || '').trim();
}

function toPublicItem(item) {
  return {
    id: item.id,
    ownerId: item.ownerId,
    itemType: item.itemType,
    title: item.title,
    description: item.description,
    category: item.category,
    location: item.location,
    status: item.status,
    imageUrl: item.imagePath ? toPublicImageUrl(item.imagePath) : null,
    ownerContact: {
      name: item.ownerName,
      email: item.ownerEmail,
    },
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function validateItemType(itemType) {
  const normalizedItemType = normalizeText(itemType).toLowerCase();

  if (!VALID_ITEM_TYPES.has(normalizedItemType)) {
    throw new AppError('itemType must be either "lost" or "found".', {
      statusCode: 400,
      code: 'INVALID_ITEM_TYPE',
    });
  }

  return normalizedItemType;
}

function validateRequiredField(fieldName, value) {
  const normalizedValue = normalizeText(value);

  if (!normalizedValue) {
    throw new AppError(`${fieldName} is required.`, {
      statusCode: 400,
      code: `INVALID_${fieldName.toUpperCase()}`,
    });
  }

  return normalizedValue;
}

function getCreatePayload(payload) {
  return {
    itemType: validateItemType(payload.itemType),
    title: validateRequiredField('title', payload.title),
    description: validateRequiredField('description', payload.description),
    category: validateRequiredField('category', payload.category),
    location: validateRequiredField('location', payload.location),
  };
}

function getUpdatedFieldValue(fieldName, nextValue, currentValue) {
  if (nextValue === undefined) {
    return currentValue;
  }

  if (fieldName === 'itemType') {
    return validateItemType(nextValue);
  }

  return validateRequiredField(fieldName, nextValue);
}

async function assertItemOwner(itemId, userId) {
  const existingItem = await findItemById(itemId);

  if (!existingItem) {
    throw new AppError('Item could not be found.', {
      statusCode: 404,
      code: 'ITEM_NOT_FOUND',
    });
  }

  if (String(existingItem.ownerId) !== String(userId)) {
    throw new AppError('You do not have permission to modify this item.', {
      statusCode: 403,
      code: 'ITEM_OWNERSHIP_REQUIRED',
    });
  }

  return existingItem;
}

async function createItem({ userId, payload, file }) {
  const validatedPayload = getCreatePayload(payload);

  const createdItem = await insertItem({
    ownerId: userId,
    ...validatedPayload,
    imagePath: file ? file.filename : null,
  });

  const item = await findItemById(createdItem.id);

  return toPublicItem(item);
}

async function getItemById(itemIdValue) {
  const itemId = parseItemId(itemIdValue);
  const item = await findItemById(itemId);

  if (!item) {
    throw new AppError('Item could not be found.', {
      statusCode: 404,
      code: 'ITEM_NOT_FOUND',
    });
  }

  return toPublicItem(item);
}

async function updateItem({ itemId: itemIdValue, userId, payload, file }) {
  const itemId = parseItemId(itemIdValue);
  const existingItem = await assertItemOwner(itemId, userId);
  const hasBodyChanges = ['itemType', 'title', 'description', 'category', 'location'].some(
    (fieldName) => payload[fieldName] !== undefined
  );

  if (!hasBodyChanges && !file) {
    throw new AppError('At least one item field or image must be provided.', {
      statusCode: 400,
      code: 'EMPTY_ITEM_UPDATE',
    });
  }

  await updateItemById(itemId, {
    itemType: getUpdatedFieldValue('itemType', payload.itemType, existingItem.itemType),
    title: getUpdatedFieldValue('title', payload.title, existingItem.title),
    description: getUpdatedFieldValue('description', payload.description, existingItem.description),
    category: getUpdatedFieldValue('category', payload.category, existingItem.category),
    location: getUpdatedFieldValue('location', payload.location, existingItem.location),
    imagePath: file ? file.filename : existingItem.imagePath,
  });

  if (file && existingItem.imagePath) {
    await deleteStoredImage(existingItem.imagePath);
  }

  const updatedItem = await findItemById(itemId);

  return toPublicItem(updatedItem);
}

async function deleteItem({ itemId: itemIdValue, userId }) {
  const itemId = parseItemId(itemIdValue);
  const existingItem = await assertItemOwner(itemId, userId);

  await deleteItemById(itemId);

  if (existingItem.imagePath) {
    await deleteStoredImage(existingItem.imagePath);
  }
}

module.exports = {
  createItem,
  deleteItem,
  getItemById,
  updateItem,
};
