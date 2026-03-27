describe('session-store service', () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('creates configured session middleware in non-production mode', () => {
    const sessionMock = jest.fn((options) => options);
    const PgStoreConstructor = jest.fn(function PgStore(options) {
      this.options = options;
    });
    const connectPgSimpleMock = jest.fn(() => PgStoreConstructor);

    jest.doMock('express-session', () => sessionMock);
    jest.doMock('connect-pg-simple', () => connectPgSimpleMock);
    jest.doMock('../../../src/server/services/db', () => ({ pool: { id: 'pool' } }));
    jest.doMock('../../../src/server/services/env', () => ({
      env: {
        sessionSecret: 'secret',
        nodeEnv: 'development',
      },
    }));

    let createSessionMiddleware;
    jest.isolateModules(() => {
      ({ createSessionMiddleware } = require('../../../src/server/services/session-store'));
    });

    const middlewareConfig = createSessionMiddleware();

    expect(connectPgSimpleMock).toHaveBeenCalledWith(sessionMock);
    expect(PgStoreConstructor).toHaveBeenCalledWith({
      pool: { id: 'pool' },
      tableName: 'user_sessions',
      createTableIfMissing: false,
    });
    expect(sessionMock).toHaveBeenCalledTimes(1);
    expect(middlewareConfig.name).toBe('matchproof.sid');
    expect(middlewareConfig.secret).toBe('secret');
    expect(middlewareConfig.cookie.secure).toBe(false);
    expect(middlewareConfig.cookie.sameSite).toBe('lax');
  });

  test('sets secure cookie in production mode', () => {
    const sessionMock = jest.fn((options) => options);
    const PgStoreConstructor = jest.fn(function PgStore(options) {
      this.options = options;
    });

    jest.doMock('express-session', () => sessionMock);
    jest.doMock('connect-pg-simple', () => () => PgStoreConstructor);
    jest.doMock('../../../src/server/services/db', () => ({ pool: {} }));
    jest.doMock('../../../src/server/services/env', () => ({
      env: {
        sessionSecret: 'secret',
        nodeEnv: 'production',
      },
    }));

    let createSessionMiddleware;
    jest.isolateModules(() => {
      ({ createSessionMiddleware } = require('../../../src/server/services/session-store'));
    });

    const middlewareConfig = createSessionMiddleware();
    expect(middlewareConfig.cookie.secure).toBe(true);
  });
});
