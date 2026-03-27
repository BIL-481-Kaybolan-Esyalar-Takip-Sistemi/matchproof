jest.mock('../../../src/server/models/user.model', () => ({
  createUser: jest.fn(),
  findUserByEmail: jest.fn(),
  findUserById: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

const bcrypt = require('bcryptjs');
const {
  createUser,
  findUserByEmail,
  findUserById,
} = require('../../../src/server/models/user.model');
const {
  registerUser,
  loginUser,
  getCurrentUser,
  toPublicUser,
} = require('../../../src/server/services/auth.service');

describe('auth.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('registerUser creates account with hashed password', async () => {
    findUserByEmail.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashed-password');

    const createdUser = {
      id: 11,
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      role: 'user',
      createdAt: '2026-03-01T00:00:00.000Z',
      updatedAt: '2026-03-01T00:00:00.000Z',
    };
    createUser.mockResolvedValue(createdUser);

    const result = await registerUser({
      name: '  Ada Lovelace  ',
      email: 'ADA@example.com',
      password: 'supersecret',
    });

    expect(findUserByEmail).toHaveBeenCalledWith('ada@example.com');
    expect(bcrypt.hash).toHaveBeenCalledWith('supersecret', 10);
    expect(createUser).toHaveBeenCalledWith({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      passwordHash: 'hashed-password',
    });
    expect(result).toEqual(createdUser);
  });

  test('registerUser rejects when email already exists', async () => {
    findUserByEmail.mockResolvedValue({ id: 1 });

    await expect(
      registerUser({
        name: 'Ada',
        email: 'ada@example.com',
        password: 'supersecret',
      })
    ).rejects.toMatchObject({ code: 'EMAIL_ALREADY_IN_USE', statusCode: 409 });

    expect(createUser).not.toHaveBeenCalled();
  });

  test('registerUser validates input fields', async () => {
    await expect(
      registerUser({ name: '', email: 'bad-mail', password: '123' })
    ).rejects.toMatchObject({ code: 'INVALID_NAME', statusCode: 400 });

    expect(findUserByEmail).not.toHaveBeenCalled();
  });

  test('registerUser validates email and password constraints', async () => {
    await expect(
      registerUser({ name: 'Ada', email: 'bad-mail', password: 'supersecret' })
    ).rejects.toMatchObject({ code: 'INVALID_EMAIL', statusCode: 400 });

    await expect(
      registerUser({ name: 'Ada', email: 'ada@example.com', password: 'short' })
    ).rejects.toMatchObject({ code: 'INVALID_PASSWORD', statusCode: 400 });
  });

  test('loginUser rejects invalid credentials when user does not exist', async () => {
    findUserByEmail.mockResolvedValue(null);

    await expect(
      loginUser({ email: 'ada@example.com', password: 'secret' })
    ).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS', statusCode: 401 });

    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  test('loginUser validates email and password presence', async () => {
    await expect(
      loginUser({ email: 'invalid', password: 'secret' })
    ).rejects.toMatchObject({ code: 'INVALID_EMAIL', statusCode: 400 });

    await expect(
      loginUser({ email: 'ada@example.com', password: '' })
    ).rejects.toMatchObject({ code: 'INVALID_PASSWORD', statusCode: 400 });
  });

  test('loginUser rejects invalid credentials when password is wrong', async () => {
    findUserByEmail.mockResolvedValue({ id: 1, passwordHash: 'stored' });
    bcrypt.compare.mockResolvedValue(false);

    await expect(
      loginUser({ email: 'ada@example.com', password: 'wrong-password' })
    ).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS', statusCode: 401 });
  });

  test('loginUser returns user for valid credentials', async () => {
    const user = { id: 10, email: 'ada@example.com', passwordHash: 'stored' };
    findUserByEmail.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);

    const result = await loginUser({
      email: 'ada@example.com',
      password: 'correct-password',
    });

    expect(result).toBe(user);
  });

  test('getCurrentUser returns user or throws when missing', async () => {
    const user = { id: 3, name: 'Ada' };
    findUserById.mockResolvedValueOnce(user);

    await expect(getCurrentUser(3)).resolves.toBe(user);

    findUserById.mockResolvedValueOnce(null);
    await expect(getCurrentUser(999)).rejects.toMatchObject({
      code: 'AUTH_USER_NOT_FOUND',
      statusCode: 401,
    });
  });

  test('toPublicUser removes sensitive fields', () => {
    const publicUser = toPublicUser({
      id: 3,
      name: 'Ada',
      email: 'ada@example.com',
      role: 'user',
      passwordHash: 'secret',
      createdAt: '2026-03-01T00:00:00.000Z',
      updatedAt: '2026-03-01T00:00:00.000Z',
    });

    expect(publicUser).toEqual({
      id: 3,
      name: 'Ada',
      email: 'ada@example.com',
      role: 'user',
      createdAt: '2026-03-01T00:00:00.000Z',
      updatedAt: '2026-03-01T00:00:00.000Z',
    });
    expect(publicUser.passwordHash).toBeUndefined();
  });
});
