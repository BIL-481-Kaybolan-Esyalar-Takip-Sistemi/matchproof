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
  updateItemById,
};

