const { query } = require('../services/db');

async function createModerationAction({ itemId, adminUserId, reason, actionType }) {
  const result = await query(
    `
      INSERT INTO moderation_actions (item_id, admin_user_id, reason, action_type)
      VALUES ($1, $2, $3, $4)
      RETURNING
        id,
        item_id AS "itemId",
        admin_user_id AS "adminUserId",
        reason,
        action_type AS "actionType",
        created_at AS "createdAt"
    `,
    [itemId, adminUserId, reason, actionType]
  );

  return result.rows[0];
}

module.exports = {
  createModerationAction,
};
