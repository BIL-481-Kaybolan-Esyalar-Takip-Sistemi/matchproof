const { AppError } = require('../../../src/server/services/app-error');

describe('app-error', () => {
  test('uses default statusCode and code when options are omitted', () => {
    const error = new AppError('boom');

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('AppError');
    expect(error.message).toBe('boom');
    expect(error.statusCode).toBe(500);
    expect(error.code).toBe('INTERNAL_SERVER_ERROR');
  });

  test('uses custom statusCode and code when provided', () => {
    const error = new AppError('bad request', {
      statusCode: 400,
      code: 'BAD_REQUEST',
    });

    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('BAD_REQUEST');
  });
});
