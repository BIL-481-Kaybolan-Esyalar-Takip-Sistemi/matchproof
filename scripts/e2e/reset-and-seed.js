function ensureE2eEnvironment() {
  process.env.NODE_ENV = process.env.NODE_ENV || 'test';
  process.env.DATABASE_URL_TEST = process.env.DATABASE_URL_TEST || 'pg-mem://matchproof_e2e';
  process.env.DATABASE_URL = process.env.DATABASE_URL || process.env.DATABASE_URL_TEST;
  process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'matchproof-e2e-secret';
  process.env.CLIENT_ORIGIN =
    process.env.CLIENT_ORIGIN || 'http://127.0.0.1:3000,http://localhost:3000';
  process.env.MATCHING_MODE = process.env.MATCHING_MODE || 'stub';
}

ensureE2eEnvironment();

const bcrypt = require('bcryptjs');

const { query, pool } = require('../../src/server/services/db');
const { runMigrations } = require('../../src/server/services/migrate');

const seedConstants = {
  adminUser: {
    name: 'Admin User',
    email: 'admin@matchproof.test',
    password: 'Password123!',
    role: 'admin',
  },
  normalUser: {
    name: 'Owner User',
    email: 'owner@matchproof.test',
    password: 'Password123!',
    role: 'user',
  },
  moderationTargetTitle: 'Moderation Target Wallet',
  seededMatchTitle: 'Found Black Wallet Near Library',
  removedItemTitle: 'Removed Headphones Listing',
};

async function insertUser(user) {
  const passwordHash = await bcrypt.hash(user.password, 10);
  const result = await query(
    `
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `,
    [user.name, user.email, passwordHash, user.role]
  );

  return result.rows[0].id;
}

async function insertItem({
  ownerId,
  itemType,
  title,
  description,
  category,
  location,
  status,
  createdAt,
}) {
  await query(
    `
      INSERT INTO items (
        owner_id,
        item_type,
        title,
        description,
        category,
        location,
        status,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8)
    `,
    [ownerId, itemType, title, description, category, location, status, createdAt]
  );
}

async function resetAndSeedDatabase() {
  await runMigrations({ closePool: false });

  await query('DELETE FROM moderation_actions');
  await query('DELETE FROM items');
  await query('DELETE FROM users');
  await query('DELETE FROM user_sessions');

  const ownerUserId = await insertUser(seedConstants.normalUser);
  const adminUserId = await insertUser(seedConstants.adminUser);

  await insertItem({
    ownerId: ownerUserId,
    itemType: 'found',
    title: seedConstants.seededMatchTitle,
    description: 'Black leather wallet with student card found near the central library.',
    category: 'Wallet',
    location: 'Central Library',
    status: 'open',
    createdAt: '2026-04-01T10:00:00.000Z',
  });

  await insertItem({
    ownerId: ownerUserId,
    itemType: 'lost',
    title: 'Lost Blue Water Bottle',
    description: 'Metal blue water bottle lost near the engineering building.',
    category: 'Other',
    location: 'Engineering Building',
    status: 'open',
    createdAt: '2026-04-01T11:00:00.000Z',
  });

  await insertItem({
    ownerId: ownerUserId,
    itemType: 'lost',
    title: seedConstants.removedItemTitle,
    description: 'Removed listing fixture.',
    category: 'Electronics',
    location: 'Dormitory',
    status: 'removed',
    createdAt: '2026-03-20T09:00:00.000Z',
  });

  await insertItem({
    ownerId: ownerUserId,
    itemType: 'lost',
    title: seedConstants.moderationTargetTitle,
    description: 'Seeded listing used for admin moderation flow tests.',
    category: 'Wallet',
    location: 'North Campus Gate',
    status: 'open',
    createdAt: '2026-04-01T12:00:00.000Z',
  });

  return {
    adminUserId,
    ownerUserId,
    ...seedConstants,
  };
}

async function closeDatabase() {
  await pool.end();
}

if (require.main === module) {
  resetAndSeedDatabase()
    .then(async () => {
      console.log('E2E test database prepared.');
      await closeDatabase();
    })
    .catch(async (error) => {
      console.error('E2E test database preparation failed:', error);
      await closeDatabase();
      process.exit(1);
    });
}

module.exports = {
  closeDatabase,
  ensureE2eEnvironment,
  resetAndSeedDatabase,
  seedConstants,
};
