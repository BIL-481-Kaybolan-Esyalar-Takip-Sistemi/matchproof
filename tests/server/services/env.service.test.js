jest.mock('dotenv', () => ({ config: jest.fn() }));

describe('env service', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
    process.env.DATABASE_URL = 'postgres://test';
    process.env.SESSION_SECRET = 'secret';
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  test('throws when required variables are missing', () => {
    delete process.env.SESSION_SECRET;

    expect(() => {
      jest.isolateModules(() => {
        require('../../../src/server/services/env');
      });
    }).toThrow('Missing required environment variable: SESSION_SECRET');
  });

  test('uses default values when optional env vars are absent', () => {
    delete process.env.NODE_ENV;
    delete process.env.PORT;
    delete process.env.UPLOAD_DIR;
    delete process.env.CLIENT_ORIGIN;

    let env;
    jest.isolateModules(() => {
      ({ env } = require('../../../src/server/services/env'));
    });

    expect(env.port).toBe(3001);
    expect(env.nodeEnv).toBe('development');
    expect(env.uploadDir).toBe('uploads');
    expect(env.clientOrigins).toEqual(['http://localhost:3000']);
  });

  test('parses optional values when provided', () => {
    process.env.PORT = '4000';
    process.env.NODE_ENV = 'test';
    process.env.UPLOAD_DIR = 'my-uploads';
    process.env.CLIENT_ORIGIN = 'http://a.local, http://b.local';

    let env;
    jest.isolateModules(() => {
      ({ env } = require('../../../src/server/services/env'));
    });

    expect(env.port).toBe(4000);
    expect(env.nodeEnv).toBe('test');
    expect(env.uploadDir).toBe('my-uploads');
    expect(env.clientOrigins).toEqual(['http://a.local', 'http://b.local']);
  });
});
