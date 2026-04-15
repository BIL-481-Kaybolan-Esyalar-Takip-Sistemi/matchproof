const path = require('path');

jest.mock('fs/promises', () => ({
  readdir: jest.fn(),
  readFile: jest.fn(),
}));

jest.mock('../../src/server/services/db', () => ({
  pool: {
    connect: jest.fn(),
    end: jest.fn(),
  },
}));

describe('Server Migrate Script', () => {
  let clientMock;
  let consoleLogMock, consoleErrorMock;
  let processExitMock;
  let poolMock;
  let fsMock;

  beforeEach(() => {
    jest.resetModules();
    poolMock = require('../../src/server/services/db').pool;
    fsMock = require('fs/promises');

    clientMock = {
      query: jest.fn(),
      release: jest.fn(),
    };
    poolMock.connect.mockResolvedValue(clientMock);

    fsMock.readdir.mockResolvedValue([
      { name: '001_initial.sql', isFile: () => true },
      { name: '002_update.sql', isFile: () => true },
      { name: 'not_migration.txt', isFile: () => true },
    ]);
    fsMock.readFile.mockResolvedValue('SELECT 1;');

    consoleLogMock = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
    processExitMock = jest.spyOn(process, 'exit').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('runs migrations successfully', async () => {
    clientMock.query.mockImplementation(async (q) => {
      if (q.includes('SELECT filename')) {
        return { rows: [{ filename: '001_initial.sql' }] }; // 001 exists, 002 will be run
      }
      return {};
    });

    // requiring the module will run it
    require('../../src/server/migrate');

    // we must wait for microtasks to finish because require is sync but
    // the code inside does an async runMigrations().catch(...)
    await new Promise(process.nextTick);
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(clientMock.query).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS schema_migrations'));
    
    // We expect it to run 002.sql but skip 001.sql
    expect(fsMock.readFile).toHaveBeenCalledTimes(1);
    expect(fsMock.readFile).toHaveBeenCalledWith(expect.stringContaining('002_update.sql'), 'utf8');

    expect(clientMock.query).toHaveBeenCalledWith('BEGIN');
    expect(clientMock.query).toHaveBeenCalledWith('SELECT 1;'); // mock contents
    expect(clientMock.query).toHaveBeenCalledWith('INSERT INTO schema_migrations (filename) VALUES ($1)', ['002_update.sql']);
    expect(clientMock.query).toHaveBeenCalledWith('COMMIT');

    expect(clientMock.release).toHaveBeenCalled();
    expect(poolMock.end).toHaveBeenCalled();
  });

  it('rolls back and catches error on failure', async () => {
    clientMock.query.mockImplementation(async (q) => {
      if (q.includes('SELECT filename')) return { rows: [] };
      if (q === 'SELECT 1;') throw new Error('Query failed');
      return {};
    });

    require('../../src/server/migrate');
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(clientMock.query).toHaveBeenCalledWith('ROLLBACK');
    expect(consoleErrorMock).toHaveBeenCalledWith('Migration failed:', expect.any(Error));
    expect(processExitMock).toHaveBeenCalledWith(1);
  });
});
