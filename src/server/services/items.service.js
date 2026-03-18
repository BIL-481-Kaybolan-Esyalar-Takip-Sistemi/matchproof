const {
  createItem: insertItem,
  deleteItemById,
  findItemById,
  searchItems: searchItemsInStore,
  updateItemStatusById,
  updateItemById,
} = require('../models/item.model');
const { AppError } = require('./app-error');
const { deleteStoredImage, toPublicImageUrl } = require('./upload.service');

const VALID_ITEM_TYPES = new Set(['lost', 'found']);
const VALID_SEARCH_STATUSES = new Set(['open', 'claimed', 'resolved']);
const VALID_MUTABLE_STATUSES = new Set(['claimed', 'resolved']);
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;
const VALID_STATUS_TRANSITIONS = {
  open: new Set(['claimed']),
  claimed: new Set(['resolved']),
  resolved: new Set(),
  removed: new Set(),
};

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

function toPublicItemSummary(item) {
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

function normalizeOptionalField(value) {
  const normalizedValue = normalizeText(value);
  return normalizedValue || null;
}

function parsePositiveInteger(value, fallback, fieldName) {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    throw new AppError(`${fieldName} must be a positive integer.`, {
      statusCode: 400,
      code: `INVALID_${fieldName.toUpperCase()}`,
    });
  }

  return parsedValue;
}

function parsePageSize(value) {
  const pageSize = parsePositiveInteger(value, DEFAULT_PAGE_SIZE, 'pageSize');

  if (pageSize > MAX_PAGE_SIZE) {
    throw new AppError(`pageSize must be ${MAX_PAGE_SIZE} or less.`, {
      statusCode: 400,
      code: 'INVALID_PAGESIZE',
    });
  }

  return pageSize;
}

function parseSearchStatus(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const normalizedStatus = normalizeText(value).toLowerCase();

  if (!VALID_SEARCH_STATUSES.has(normalizedStatus)) {
    throw new AppError('status must be one of "open", "claimed", or "resolved".', {
      statusCode: 400,
      code: 'INVALID_STATUS',
    });
  }

  return normalizedStatus;
}

function parseNextStatus(value) {
  if (value === undefined || value === null || value === '') {
    throw new AppError('status is required.', {
      statusCode: 400,
      code: 'INVALID_STATUS',
    });
  }

  const normalizedStatus = normalizeText(value).toLowerCase();

  if (!VALID_MUTABLE_STATUSES.has(normalizedStatus)) {
    throw new AppError('status must be either "claimed" or "resolved".', {
      statusCode: 400,
      code: 'INVALID_STATUS',
    });
  }

  return normalizedStatus;
}

function parseOptionalDate(value, fieldName) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const normalizedValue = normalizeText(value);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedValue)) {
    throw new AppError(`${fieldName} must be in YYYY-MM-DD format.`, {
      statusCode: 400,
      code: `INVALID_${fieldName.toUpperCase()}`,
    });
  }

  const parsedDate = new Date(`${normalizedValue}T00:00:00.000Z`);

  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== normalizedValue
  ) {
    throw new AppError(`${fieldName} must be a valid date.`, {
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

function getSearchFilters(queryParams) {
  const page = parsePositiveInteger(queryParams.page, DEFAULT_PAGE, 'page');
  const pageSize = parsePageSize(queryParams.pageSize);
  const dateFrom = parseOptionalDate(queryParams.dateFrom, 'dateFrom');
  const dateTo = parseOptionalDate(queryParams.dateTo, 'dateTo');

  if (dateFrom && dateTo && dateFrom > dateTo) {
    throw new AppError('dateFrom cannot be later than dateTo.', {
      statusCode: 400,
      code: 'INVALID_DATE_RANGE',
    });
  }

  return {
    queryText: normalizeOptionalField(queryParams.query),
    category: normalizeOptionalField(queryParams.category),
    itemType:
      queryParams.itemType === undefined || queryParams.itemType === null || queryParams.itemType === ''
        ? null
        : validateItemType(queryParams.itemType),
    status: parseSearchStatus(queryParams.status),
    dateFrom,
    dateTo,
    page,
    pageSize,
  };
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

async function searchItems(queryParams) {
  const filters = getSearchFilters(queryParams);
  const { items, total } = await searchItemsInStore(filters);
  const totalPages = total === 0 ? 0 : Math.ceil(total / filters.pageSize);

  return {
    items: items.map(toPublicItemSummary),
    pagination: {
      page: filters.page,
      pageSize: filters.pageSize,
      total,
      totalPages,
    },
    filters: {
      query: filters.queryText,
      category: filters.category,
      itemType: filters.itemType,
      status: filters.status,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
    },
  };
}

async function updateItemStatus({ itemId: itemIdValue, userId, status }) {
  const itemId = parseItemId(itemIdValue);
  const existingItem = await assertItemOwner(itemId, userId);
  const nextStatus = parseNextStatus(status);
  const allowedNextStatuses = VALID_STATUS_TRANSITIONS[existingItem.status] || new Set();

  if (!allowedNextStatuses.has(nextStatus)) {
    throw new AppError(
      `Status transition from "${existingItem.status}" to "${nextStatus}" is not allowed.`,
      {
        statusCode: 400,
        code: 'INVALID_STATUS_TRANSITION',
      }
    );
  }

  await updateItemStatusById(itemId, nextStatus);

  const updatedItem = await findItemById(itemId);

  return toPublicItem(updatedItem);
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
  searchItems,
  updateItemStatus,
  updateItem,
};
