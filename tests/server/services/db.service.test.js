describe('db service', () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('creates pool with non-production ssl disabled and proxies query', async () => {
    const poolQuery = jest.fn().mockResolvedValue({ rows: [] });
    const PoolMock = jest.fn(() => ({ query: poolQuery }));

    jest.doMock('pg', () => ({ Pool: PoolMock }));
    jest.doMock('../../../src/server/services/env', () => ({
      env: {
        databaseUrl: 'postgres://dev-db',
        nodeEnv: 'development',
      },
    }));

    let db;
    jest.isolateModules(() => {
      db = require('../../../src/server/services/db');
    });

    expect(PoolMock).toHaveBeenCalledWith({
      connectionString: 'postgres://dev-db',
      ssl: false,
    });

    await db.query('SELECT 1', ['x']);
    expect(poolQuery).toHaveBeenCalledWith('SELECT 1', ['x']);
  });

  test('enables ssl in production and healthCheck executes SELECT 1', async () => {
    const poolQuery = jest.fn().mockResolvedValue({ rows: [] });
    const PoolMock = jest.fn(() => ({ query: poolQuery }));

    jest.doMock('pg', () => ({ Pool: PoolMock }));
    jest.doMock('../../../src/server/services/env', () => ({
      env: {
        databaseUrl: 'postgres://prod-db',
        nodeEnv: 'production',
      },
    }));

    let db;
    jest.isolateModules(() => {
      db = require('../../../src/server/services/db');
    });

    expect(PoolMock).toHaveBeenCalledWith({
      connectionString: 'postgres://prod-db',
      ssl: { rejectUnauthorized: false },
    });

    await db.healthCheck();
    expect(poolQuery).toHaveBeenCalledWith('SELECT 1', undefined);
  });
});
