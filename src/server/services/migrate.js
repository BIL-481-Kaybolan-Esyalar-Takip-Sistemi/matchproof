const fs = require('fs/promises');
const path = require('path');

const { pool } = require('./db');

const migrationsDirectory = path.join(__dirname, '..', 'models', 'migrations');

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
}

async function getMigrationFiles() {
  const entries = await fs.readdir(migrationsDirectory, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.sql'))
    .map((entry) => entry.name)
    .sort();
}

async function getAppliedMigrations(client) {
  const result = await client.query('SELECT filename FROM schema_migrations');
  return new Set(result.rows.map((row) => row.filename));
}

async function runMigrations({ closePool = true } = {}) {
  const client = await pool.connect();

  try {
    await ensureMigrationsTable(client);

    const migrationFiles = await getMigrationFiles();
    const appliedMigrations = await getAppliedMigrations(client);

    for (const filename of migrationFiles) {
      if (appliedMigrations.has(filename)) {
        continue;
      }

      const filePath = path.join(migrationsDirectory, filename);
      const sql = await fs.readFile(filePath, 'utf8');

      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query(
          'INSERT INTO schema_migrations (filename) VALUES ($1)',
          [filename]
        );
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }

      console.log(`Applied migration: ${filename}`);
    }

    console.log('Database migrations are up to date.');
  } catch (error) {
    throw error;
  } finally {
    client.release();
    if (closePool) {
      await pool.end();
    }
  }
}

if (require.main === module) {
  runMigrations().catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
}

module.exports = {
  ensureMigrationsTable,
  getMigrationFiles,
  getAppliedMigrations,
  runMigrations,
  migrationsDirectory,
};
