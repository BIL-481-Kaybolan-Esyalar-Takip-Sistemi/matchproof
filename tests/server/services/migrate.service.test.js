jest.mock('fs/promises', () => ({
  readdir: jest.fn(),
  readFile: jest.fn(),
}));

jest.mock('../../../src/server/services/db', () => ({
  pool: {
    connect: jest.fn(),
    end: jest.fn(),
  },
}));

const fs = require('fs/promises');
const path = require('path');
const { spawnSync } = require('child_process');
const { pool } = require('../../../src/server/services/db');
const migrateService = require('../../../src/server/services/migrate');

describe('migrate service', () => {
  let client;

  beforeEach(() => {
    jest.clearAllMocks();
    client = {
      query: jest.fn(),
      release: jest.fn(),
    };
    pool.connect.mockResolvedValue(client);
    pool.end.mockResolvedValue();
  });

  test('getMigrationFiles returns sorted .sql file names only', async () => {
    fs.readdir.mockResolvedValue([
      { name: '002_create_items.sql', isFile: () => true },
      { name: 'README.md', isFile: () => true },
      { name: '001_create_users.sql', isFile: () => true },
      { name: 'folder', isFile: () => false },
    ]);

    const files = await migrateService.getMigrationFiles();

    expect(files).toEqual(['001_create_users.sql', '002_create_items.sql']);
  });

  test('getAppliedMigrations returns filename set from schema_migrations table', async () => {
    client.query.mockResolvedValue({ rows: [{ filename: '001.sql' }, { filename: '002.sql' }] });

    const applied = await migrateService.getAppliedMigrations(client);

    expect(client.query).toHaveBeenCalledWith('SELECT filename FROM schema_migrations');
    expect(applied).toEqual(new Set(['001.sql', '002.sql']));
  });

  test('runMigrations applies only unapplied files and commits', async () => {
    fs.readdir.mockResolvedValue([
      { name: '001.sql', isFile: () => true },
      { name: '002.sql', isFile: () => true },
    ]);
    fs.readFile.mockResolvedValue('-- migration sql');

    client.query.mockImplementation(async (sql) => {
      if (sql.includes('SELECT filename FROM schema_migrations')) {
        return { rows: [{ filename: '001.sql' }] };
      }
      return { rows: [] };
    });

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await migrateService.runMigrations();

    expect(client.query).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS schema_migrations'));
    expect(client.query).toHaveBeenCalledWith('BEGIN');
    expect(client.query).toHaveBeenCalledWith('-- migration sql');
    expect(client.query).toHaveBeenCalledWith(
      'INSERT INTO schema_migrations (filename) VALUES ($1)',
      ['002.sql']
    );
    expect(client.query).toHaveBeenCalledWith('COMMIT');
    expect(client.release).toHaveBeenCalled();
    expect(pool.end).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('Applied migration: 002.sql');
  });

  test('runMigrations rolls back and rethrows when migration query fails', async () => {
    fs.readdir.mockResolvedValue([{ name: '001.sql', isFile: () => true }]);
    fs.readFile.mockResolvedValue('-- bad migration');

    client.query.mockImplementation(async (sql) => {
      if (sql.includes('SELECT filename FROM schema_migrations')) {
        return { rows: [] };
      }
      if (sql === '-- bad migration') {
        throw new Error('SQL broke');
      }
      return { rows: [] };
    });

    await expect(migrateService.runMigrations()).rejects.toThrow('SQL broke');
    expect(client.query).toHaveBeenCalledWith('ROLLBACK');
    expect(client.release).toHaveBeenCalled();
    expect(pool.end).toHaveBeenCalled();
  });

  test('CLI mode exits with code 1 and logs when migration run fails', () => {
    const scriptPath = path.resolve(__dirname, '../../../src/server/services/migrate.js');
    const result = spawnSync(process.execPath, [scriptPath], {
      env: {
        ...process.env,
        DATABASE_URL: 'postgresql://invalid:invalid@127.0.0.1:1/matchproof',
        SESSION_SECRET: 'test-secret',
        NODE_ENV: 'test',
      },
      encoding: 'utf8',
      timeout: 5000,
    });

    expect(result.status).toBe(1);
    expect(`${result.stdout}\n${result.stderr}`).toContain('Migration failed:');
  });
});
