const { startServer } = require('../../src/server/index');
const { app } = require('../../src/server/app');
const { pool } = require('../../src/server/services/db');

jest.mock('../../src/server/app', () => ({
  app: {
    listen: jest.fn((port, cb) => {
      if (cb) cb();
      return { close: jest.fn(closeCb => closeCb()) };
    }),
  },
}));

jest.mock('../../src/server/services/db', () => ({
  pool: { end: jest.fn() },
}));

describe('Server Index', () => {
  let exitMock;
  let processOnSpy;

  beforeEach(() => {
    exitMock = jest.spyOn(process, 'exit').mockImplementation(() => {});
    processOnSpy = jest.spyOn(process, 'on');
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('starts server and registers listeners', () => {
    const server = startServer();
    expect(app.listen).toHaveBeenCalled();
    expect(processOnSpy).toHaveBeenCalledWith('SIGINT', expect.any(Function));
    expect(processOnSpy).toHaveBeenCalledWith('SIGTERM', expect.any(Function));
  });

  it('handles SIGINT gracefully', async () => {
    startServer();
    
    // Find the registered SIGINT callback
    const call = processOnSpy.mock.calls.find(c => c[0] === 'SIGINT');
    expect(call).toBeDefined();
    const sigintHandler = call[1];
    
    await sigintHandler();
    
    expect(pool.end).toHaveBeenCalled();
    expect(exitMock).toHaveBeenCalledWith(0);
  });
});
