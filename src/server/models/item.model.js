const { query } = require('../services/db');

async function createItem({
  ownerId,
  itemType,
  title,
  description,
  category,
  location,
  imagePath,
}) {
  const result = await query(
    `
      INSERT INTO items (
        owner_id,
        item_type,
        title,
        description,
        category,
        location,
        image_path
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `,
    [ownerId, itemType, title, description, category, location, imagePath]
  );

  return result.rows[0];
}

async function findItemById(itemId) {
  const result = await query(
    `
      SELECT
        items.id,
        items.owner_id AS "ownerId",
        items.item_type AS "itemType",
        items.title,
        items.description,
        items.category,
        items.location,
        items.status,
        items.image_path AS "imagePath",
        items.created_at AS "createdAt",
        items.updated_at AS "updatedAt",
        users.name AS "ownerName",
        users.email AS "ownerEmail"
      FROM items
      JOIN users ON users.id = items.owner_id
      WHERE items.id = $1
      LIMIT 1
    `,
    [itemId]
  );

  return result.rows[0] || null;
}

async function searchItems({
  queryText,
  category,
  itemType,
  status,
  dateFrom,
  dateTo,
  page,
  pageSize,
}) {
  const whereParts = [`items.status <> 'removed'`];
  const values = [];

  if (queryText) {
    values.push(`%${queryText}%`);
    const parameterIndex = values.length;

    whereParts.push(
      `(items.title ILIKE $${parameterIndex} OR items.description ILIKE $${parameterIndex})`
    );
  }

  if (category) {
    values.push(category);
    whereParts.push(`LOWER(items.category) = LOWER($${values.length})`);
  }

  if (itemType) {
    values.push(itemType);
    whereParts.push(`items.item_type = $${values.length}`);
  }

  if (status) {
    values.push(status);
    whereParts.push(`items.status = $${values.length}`);
  }

  if (dateFrom) {
    values.push(dateFrom);
    whereParts.push(`items.created_at::date >= $${values.length}`);
  }

  if (dateTo) {
    values.push(dateTo);
    whereParts.push(`items.created_at::date <= $${values.length}`);
  }

  const whereClause = whereParts.length > 0 ? `WHERE ${whereParts.join(' AND ')}` : '';
  const offset = (page - 1) * pageSize;

  values.push(pageSize);
  const limitParameterIndex = values.length;
  values.push(offset);
  const offsetParameterIndex = values.length;

  const rowsPromise = query(
    `
      SELECT
        items.id,
        items.owner_id AS "ownerId",
        items.item_type AS "itemType",
        items.title,
        items.description,
        items.category,
        items.location,
        items.status,
        items.image_path AS "imagePath",
        items.created_at AS "createdAt",
        items.updated_at AS "updatedAt"
      FROM items
      ${whereClause}
      ORDER BY items.created_at DESC, items.id DESC
      LIMIT $${limitParameterIndex}
      OFFSET $${offsetParameterIndex}
    `,
    values
  );

  const countPromise = query(
    `
      SELECT COUNT(*)::INT AS total
      FROM items
      ${whereClause}
    `,
    values.slice(0, limitParameterIndex - 1)
  );

  const [rowsResult, countResult] = await Promise.all([rowsPromise, countPromise]);

  return {
    items: rowsResult.rows,
    total: countResult.rows[0]?.total || 0,
  };
}

async function updateItemById(itemId, fields) {
  const result = await query(
    `
      UPDATE items
      SET
        item_type = $2,
        title = $3,
        description = $4,
        category = $5,
        location = $6,
        image_path = $7,
        updated_at = NOW()
      WHERE id = $1
      RETURNING id
    `,
    [
      itemId,
      fields.itemType,
      fields.title,
      fields.description,
      fields.category,
      fields.location,
      fields.imagePath,
    ]
  );

  return result.rows[0] || null;
}

async function deleteItemById(itemId) {
  const result = await query(
    `
      DELETE FROM items
      WHERE id = $1
      RETURNING id
    `,
    [itemId]
  );

  return result.rows[0] || null;
}

module.exports = {
  createItem,
  deleteItemById,
  findItemById,
  searchItems,
  updateItemById,
};

