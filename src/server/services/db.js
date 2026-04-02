const { Pool } = require('pg');
const { newDb } = require('pg-mem');

const { env } = require('./env');

const isInMemoryDatabase = env.databaseUrl.startsWith('pg-mem://');

let memoryDatabase = null;
let PoolImplementation = Pool;

if (isInMemoryDatabase) {
  memoryDatabase = newDb({
    autoCreateForeignKeyIndices: true,
  });

  const adapter = memoryDatabase.adapters.createPg();
  PoolImplementation = adapter.Pool;
}

const pool = isInMemoryDatabase
  ? new PoolImplementation()
  : new PoolImplementation({
      connectionString: env.databaseUrl,
      ssl: env.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
    });

async function query(text, params) {
  return pool.query(text, params);
}

async function healthCheck() {
  await query('SELECT 1');
}

module.exports = {
  isInMemoryDatabase,
  memoryDatabase,
  pool,
  query,
  healthCheck,
};

