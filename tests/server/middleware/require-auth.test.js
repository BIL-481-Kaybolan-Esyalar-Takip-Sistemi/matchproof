const { requireAuth } = require('../../../src/server/services/require-auth');

describe('requireAuth', () => {
  test('returns AUTH_REQUIRED when there is no session', () => {
    const next = jest.fn();

    requireAuth({}, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error).toBeTruthy();
    expect(error.code).toBe('AUTH_REQUIRED');
    expect(error.statusCode).toBe(401);
  });

  test('returns AUTH_REQUIRED when session has no userId', () => {
    const next = jest.fn();

    requireAuth({ session: {} }, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error).toBeTruthy();
    expect(error.code).toBe('AUTH_REQUIRED');
  });

  test('passes through when session has userId', () => {
    const next = jest.fn();

    requireAuth({ session: { userId: 42 } }, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
});
