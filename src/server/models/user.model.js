const { query } = require('../services/db');

async function createUser({ name, email, passwordHash, role = 'user' }) {
  const result = await query(
    `
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at AS "createdAt", updated_at AS "updatedAt"
    `,
    [name, email, passwordHash, role]
  );

  return result.rows[0];
}

async function findUserByEmail(email) {
  const result = await query(
    `
      SELECT
        id,
        name,
        email,
        password_hash AS "passwordHash",
        role,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [email]
  );

  return result.rows[0] || null;
}

async function findUserById(id) {
  const result = await query(
    `
      SELECT
        id,
        name,
        email,
        role,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM users
      WHERE id = $1
      LIMIT 1
    `,
    [id]
  );

  return result.rows[0] || null;
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};

