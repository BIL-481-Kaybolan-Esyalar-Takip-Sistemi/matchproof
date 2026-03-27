jest.mock('../../../src/server/services/db', () => ({
  query: jest.fn(),
}));

const { query } = require('../../../src/server/services/db');
const userModel = require('../../../src/server/models/user.model');

describe('user.model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createUser constructs correct INSERT query and params', async () => {
    const mockUser = { id: 1, name: 'Alice', email: 'alice@example.com', role: 'user' };
    query.mockResolvedValue({ rows: [mockUser] });

    const result = await userModel.createUser({
      name: 'Alice',
      email: 'alice@example.com',
      passwordHash: 'hashedpassword',
      role: 'user',
    });

    expect(result).toEqual(mockUser);
    expect(query).toHaveBeenCalledTimes(1);
    const sqlStr = query.mock.calls[0][0];
    const sqlParams = query.mock.calls[0][1];

    expect(sqlStr).toContain('INSERT INTO users');
    expect(sqlStr).toContain('RETURNING id, name, email, role');
    expect(sqlParams).toEqual(['Alice', 'alice@example.com', 'hashedpassword', 'user']);
  });

  test('createUser uses "user" role as default', async () => {
    query.mockResolvedValue({ rows: [{ id: 2 }] });

    await userModel.createUser({
      name: 'Bob',
      email: 'bob@example.com',
      passwordHash: 'secret',
    });

    const sqlParams = query.mock.calls[0][1];
    expect(sqlParams[3]).toBe('user');
  });

  test('findUserByEmail looks up user accurately', async () => {
    const mockUser = { id: 1, email: 'alice@example.com' };
    query.mockResolvedValue({ rows: [mockUser] });

    const result = await userModel.findUserByEmail('alice@example.com');

    expect(result).toEqual(mockUser);
    const sqlStr = query.mock.calls[0][0];
    const sqlParams = query.mock.calls[0][1];

    expect(sqlStr).toContain('SELECT');
    expect(sqlStr).toContain('WHERE email = $1');
    expect(sqlStr).toContain('LIMIT 1');
    expect(sqlParams).toEqual(['alice@example.com']);
  });

  test('findUserByEmail returns null if no user matches', async () => {
    query.mockResolvedValue({ rows: [] });

    const result = await userModel.findUserByEmail('nobody@example.com');

    expect(result).toBeNull();
  });

  test('findUserById retrieves user without password_hash', async () => {
    const mockUser = { id: 5, name: 'Charlie', email: 'charlie@example.com' };
    query.mockResolvedValue({ rows: [mockUser] });

    const result = await userModel.findUserById(5);

    expect(result).toEqual(mockUser);
    const sqlStr = query.mock.calls[0][0];
    const sqlParams = query.mock.calls[0][1];

    expect(sqlStr).toContain('SELECT');
    // Ensure we are selecting id, name, email, role but NOT password_hash
    expect(sqlStr).toContain('role');
    expect(sqlStr).not.toContain('password_hash AS "passwordHash"'); // Because findUserById shouldn't return password
    expect(sqlStr).toContain('WHERE id = $1');
    expect(sqlParams).toEqual([5]);
  });

  test('findUserById returns null if not found', async () => {
    query.mockResolvedValue({ rows: [] });

    const result = await userModel.findUserById(99);

    expect(result).toBeNull();
  });
});
