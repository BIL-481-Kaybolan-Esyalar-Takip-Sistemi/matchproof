const { requireAdmin } = require('../../../src/server/services/require-admin');

describe('requireAdmin', () => {
  test('bubbles AUTH_REQUIRED when not authenticated', () => {
    const next = jest.fn();

    requireAdmin({}, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error).toBeTruthy();
    expect(error.code).toBe('AUTH_REQUIRED');
    expect(error.statusCode).toBe(401);
  });

  test('returns ADMIN_REQUIRED for authenticated non-admin user', () => {
    const next = jest.fn();

    requireAdmin({ session: { userId: 5, userRole: 'user' } }, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error).toBeTruthy();
    expect(error.code).toBe('ADMIN_REQUIRED');
    expect(error.statusCode).toBe(403);
  });

  test('passes through for admin user', () => {
    const next = jest.fn();

    requireAdmin({ session: { userId: 1, userRole: 'admin' } }, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
});
