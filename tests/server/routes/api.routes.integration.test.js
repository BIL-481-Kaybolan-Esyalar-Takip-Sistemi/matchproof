jest.mock('../../../src/server/services/session-store', () => ({
  createSessionMiddleware: () => (req, res, next) => {
    if (req.header('x-test-no-session') === '1') {
      next();
      return;
    }

    const hasRegenerateError = req.header('x-test-session-regenerate-error') === '1';
    const hasDestroyError = req.header('x-test-session-destroy-error') === '1';
    const headerUserId = req.header('x-test-user-id');
    const headerUserRole = req.header('x-test-user-role') || 'user';

    req.session = {
      regenerate: (callback) => {
        callback(hasRegenerateError ? new Error('regenerate failed') : undefined);
      },
      destroy: (callback) => {
        callback(hasDestroyError ? new Error('destroy failed') : undefined);
      },
    };

    if (headerUserId) {
      req.session.userId = Number(headerUserId);
      req.session.userRole = headerUserRole;
    }

    next();
  },
}));

jest.mock('../../../src/server/services/upload.service', () => ({
  uploadRoot: 'uploads',
  singleImageUpload: (req, res, next) => {
    const fileName = req.header('x-test-file-name');

    if (fileName) {
      req.file = { filename: fileName };
    }

    next();
  },
  deleteUploadedFile: jest.fn(),
}));

jest.mock('../../../src/server/services/auth.service', () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
  getCurrentUser: jest.fn(),
  toPublicUser: jest.fn((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  })),
}));

jest.mock('../../../src/server/services/items.service', () => ({
  createItem: jest.fn(),
  deleteItem: jest.fn(),
  getItemById: jest.fn(),
  searchItems: jest.fn(),
  updateItemStatus: jest.fn(),
  updateItem: jest.fn(),
}));

jest.mock('../../../src/server/services/moderation.service', () => ({
  removeItemPost: jest.fn(),
}));

jest.mock('../../../src/server/services/db', () => ({
  healthCheck: jest.fn(),
  pool: {},
}));

const request = require('supertest');
const authService = require('../../../src/server/services/auth.service');
const itemsService = require('../../../src/server/services/items.service');
const moderationService = require('../../../src/server/services/moderation.service');
const dbService = require('../../../src/server/services/db');
const uploadService = require('../../../src/server/services/upload.service');
const { app } = require('../../../src/server/app');

describe('API routes integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/health returns ok when db is up', async () => {
    dbService.healthCheck.mockResolvedValue();

    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.database).toBe('up');
  });

  test('GET /api/health returns degraded when db is down', async () => {
    dbService.healthCheck.mockRejectedValue(new Error('db down'));

    const response = await request(app).get('/api/health');

    expect(response.status).toBe(503);
    expect(response.body.status).toBe('degraded');
    expect(response.body.database).toBe('down');
  });

  test('POST /api/auth/register registers user and returns public user', async () => {
    authService.registerUser.mockResolvedValue({
      id: 11,
      name: 'Ada',
      email: 'ada@example.com',
      role: 'user',
    });

    const response = await request(app).post('/api/auth/register').send({
      name: 'Ada',
      email: 'ada@example.com',
      password: 'supersecret',
    });

    expect(response.status).toBe(201);
    expect(authService.registerUser).toHaveBeenCalledWith({
      name: 'Ada',
      email: 'ada@example.com',
      password: 'supersecret',
    });
    expect(response.body.user).toEqual({
      id: 11,
      name: 'Ada',
      email: 'ada@example.com',
      role: 'user',
    });
  });

  test('POST /api/auth/register returns 500 when session regenerate fails', async () => {
    authService.registerUser.mockResolvedValue({
      id: 11,
      name: 'Ada',
      email: 'ada@example.com',
      role: 'user',
    });

    const response = await request(app)
      .post('/api/auth/register')
      .set('x-test-session-regenerate-error', '1')
      .send({
        name: 'Ada',
        email: 'ada@example.com',
        password: 'supersecret',
      });

    expect(response.status).toBe(500);
    expect(response.body.error.code).toBe('INTERNAL_SERVER_ERROR');
    expect(response.body.error.message).toBe('Unexpected server error.');
  });

  test('POST /api/auth/login returns public user', async () => {
    authService.loginUser.mockResolvedValue({
      id: 5,
      name: 'Bob',
      email: 'bob@example.com',
      role: 'user',
    });

    const response = await request(app).post('/api/auth/login').send({
      email: 'bob@example.com',
      password: 'secret123',
    });

    expect(response.status).toBe(200);
    expect(authService.loginUser).toHaveBeenCalledWith({
      email: 'bob@example.com',
      password: 'secret123',
    });
    expect(response.body.user.id).toBe(5);
  });

  test('POST /api/auth/login forwards service errors', async () => {
    authService.loginUser.mockRejectedValue({
      statusCode: 401,
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password.',
    });

    const response = await request(app).post('/api/auth/login').send({
      email: 'bob@example.com',
      password: 'badpass',
    });

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  test('POST /api/auth/logout returns 204 without session', async () => {
    const response = await request(app)
      .post('/api/auth/logout')
      .set('x-test-no-session', '1');

    expect(response.status).toBe(204);
    expect(response.headers['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining('matchproof.sid=')])
    );
  });

  test('POST /api/auth/logout returns 500 when session destroy fails', async () => {
    const response = await request(app)
      .post('/api/auth/logout')
      .set('x-test-session-destroy-error', '1');

    expect(response.status).toBe(500);
    expect(response.body.error.code).toBe('INTERNAL_SERVER_ERROR');
  });

  test('POST /api/auth/logout destroys session successfully', async () => {
    const response = await request(app).post('/api/auth/logout');

    expect(response.status).toBe(204);
  });

  test('GET /api/auth/me rejects unauthenticated requests', async () => {
    const response = await request(app).get('/api/auth/me');

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('AUTH_REQUIRED');
  });

  test('GET /api/auth/me returns current user for authenticated session', async () => {
    authService.getCurrentUser.mockResolvedValue({
      id: 9,
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
    });

    const response = await request(app)
      .get('/api/auth/me')
      .set('x-test-user-id', '9')
      .set('x-test-user-role', 'user');

    expect(response.status).toBe(200);
    expect(authService.getCurrentUser).toHaveBeenCalledWith(9);
    expect(response.body.user.id).toBe(9);
  });

  test('GET /api/items/search requires authentication', async () => {
    const response = await request(app).get('/api/items/search');

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('AUTH_REQUIRED');
  });

  test('GET /api/items/search returns mocked search payload', async () => {
    itemsService.searchItems.mockResolvedValue({
      items: [
        {
          id: 1,
          title: 'Wallet',
          status: 'open',
          itemType: 'lost',
        },
      ],
      pagination: { page: 1, pageSize: 10, total: 1, totalPages: 1 },
      filters: {},
    });

    const response = await request(app)
      .get('/api/items/search?query=wallet&page=1&pageSize=10')
      .set('x-test-user-id', '3')
      .set('x-test-user-role', 'user');

    expect(response.status).toBe(200);
    expect(itemsService.searchItems).toHaveBeenCalledWith(
      expect.objectContaining({ query: 'wallet', page: '1', pageSize: '10' })
    );
    expect(response.body.pagination.total).toBe(1);
  });

  test('POST /api/items creates item for authenticated user', async () => {
    itemsService.createItem.mockResolvedValue({ id: 10, title: 'Wallet' });

    const response = await request(app)
      .post('/api/items')
      .set('x-test-user-id', '3')
      .send({ title: 'Wallet' });

    expect(response.status).toBe(201);
    expect(itemsService.createItem).toHaveBeenCalledWith({
      userId: 3,
      payload: { title: 'Wallet' },
      file: undefined,
    });
    expect(response.body.item.id).toBe(10);
  });

  test('POST /api/items cleans up uploaded file when service throws', async () => {
    itemsService.createItem.mockRejectedValue({
      statusCode: 400,
      code: 'INVALID_ITEM_TYPE',
      message: 'bad payload',
    });

    const response = await request(app)
      .post('/api/items')
      .set('x-test-user-id', '3')
      .set('x-test-file-name', 'tmp.jpg')
      .send({ title: 'Wallet' });

    expect(response.status).toBe(400);
    expect(uploadService.deleteUploadedFile).toHaveBeenCalledWith('tmp.jpg');
  });

  test('POST /api/items skips cleanup when no uploaded file exists', async () => {
    itemsService.createItem.mockRejectedValue({
      statusCode: 400,
      code: 'INVALID_ITEM_TYPE',
      message: 'bad payload',
    });

    const response = await request(app)
      .post('/api/items')
      .set('x-test-user-id', '3')
      .send({ title: 'Wallet' });

    expect(response.status).toBe(400);
    expect(uploadService.deleteUploadedFile).not.toHaveBeenCalled();
  });

  test('POST /api/items ignores cleanup failures and still returns original error', async () => {
    itemsService.createItem.mockRejectedValue({
      statusCode: 400,
      code: 'INVALID_ITEM_TYPE',
      message: 'bad payload',
    });
    uploadService.deleteUploadedFile.mockRejectedValueOnce(new Error('cleanup failed'));

    const response = await request(app)
      .post('/api/items')
      .set('x-test-user-id', '3')
      .set('x-test-file-name', 'tmp.jpg')
      .send({ title: 'Wallet' });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('INVALID_ITEM_TYPE');
  });

  test('GET /api/items/:itemId returns item details', async () => {
    itemsService.getItemById.mockResolvedValue({ id: 7, title: 'Phone' });

    const response = await request(app)
      .get('/api/items/7')
      .set('x-test-user-id', '3')
      .set('x-test-user-role', 'user');

    expect(response.status).toBe(200);
    expect(itemsService.getItemById).toHaveBeenCalledWith('7', {
      userId: 3,
      userRole: 'user',
    });
    expect(response.body.item.id).toBe(7);
  });

  test('GET /api/items/:itemId forwards service errors', async () => {
    itemsService.getItemById.mockRejectedValue({
      statusCode: 404,
      code: 'ITEM_NOT_FOUND',
      message: 'Item not found.',
    });

    const response = await request(app)
      .get('/api/items/999')
      .set('x-test-user-id', '3')
      .set('x-test-user-role', 'user');

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('ITEM_NOT_FOUND');
  });

  test('PATCH /api/items/:itemId/status updates status', async () => {
    itemsService.updateItemStatus.mockResolvedValue({ id: 7, status: 'claimed' });

    const response = await request(app)
      .patch('/api/items/7/status')
      .set('x-test-user-id', '3')
      .send({ status: 'claimed' });

    expect(response.status).toBe(200);
    expect(itemsService.updateItemStatus).toHaveBeenCalledWith({
      itemId: '7',
      userId: 3,
      status: 'claimed',
    });
    expect(response.body.item.status).toBe('claimed');
  });

  test('PATCH /api/items/:itemId/status forwards service errors', async () => {
    itemsService.updateItemStatus.mockRejectedValue({
      statusCode: 400,
      code: 'INVALID_STATUS_TRANSITION',
      message: 'Invalid status transition.',
    });

    const response = await request(app)
      .patch('/api/items/7/status')
      .set('x-test-user-id', '3')
      .send({ status: 'resolved' });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('INVALID_STATUS_TRANSITION');
  });

  test('PATCH /api/items/:itemId updates item', async () => {
    itemsService.updateItem.mockResolvedValue({ id: 7, title: 'New Title' });

    const response = await request(app)
      .patch('/api/items/7')
      .set('x-test-user-id', '3')
      .send({ title: 'New Title' });

    expect(response.status).toBe(200);
    expect(itemsService.updateItem).toHaveBeenCalledWith({
      itemId: '7',
      userId: 3,
      payload: { title: 'New Title' },
      file: undefined,
    });
  });

  test('PATCH /api/items/:itemId cleans up uploaded file on update failure', async () => {
    itemsService.updateItem.mockRejectedValue({
      statusCode: 400,
      code: 'EMPTY_ITEM_UPDATE',
      message: 'No update payload',
    });

    const response = await request(app)
      .patch('/api/items/7')
      .set('x-test-user-id', '3')
      .set('x-test-file-name', 'tmp-update.jpg')
      .send({});

    expect(response.status).toBe(400);
    expect(uploadService.deleteUploadedFile).toHaveBeenCalledWith('tmp-update.jpg');
  });

  test('PATCH /api/items/:itemId skips cleanup when no file exists', async () => {
    itemsService.updateItem.mockRejectedValue({
      statusCode: 400,
      code: 'EMPTY_ITEM_UPDATE',
      message: 'No update payload',
    });

    const response = await request(app)
      .patch('/api/items/7')
      .set('x-test-user-id', '3')
      .send({});

    expect(response.status).toBe(400);
    expect(uploadService.deleteUploadedFile).not.toHaveBeenCalled();
  });

  test('DELETE /api/items/:itemId deletes item', async () => {
    itemsService.deleteItem.mockResolvedValue();

    const response = await request(app)
      .delete('/api/items/7')
      .set('x-test-user-id', '3');

    expect(response.status).toBe(204);
    expect(itemsService.deleteItem).toHaveBeenCalledWith({
      itemId: '7',
      userId: 3,
    });
  });

  test('DELETE /api/items/:itemId forwards service errors', async () => {
    itemsService.deleteItem.mockRejectedValue({
      statusCode: 403,
      code: 'NOT_ITEM_OWNER',
      message: 'You can only delete your own posts.',
    });

    const response = await request(app)
      .delete('/api/items/7')
      .set('x-test-user-id', '3');

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('NOT_ITEM_OWNER');
  });

  test('GET /api/items/search preserves error contract from app error handler', async () => {
    itemsService.searchItems.mockRejectedValue({
      statusCode: 400,
      code: 'INVALID_STATUS',
      message: 'status must be one of open, claimed, resolved',
    });

    const response = await request(app)
      .get('/api/items/search?status=invalid')
      .set('x-test-user-id', '3');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: {
        code: 'INVALID_STATUS',
        message: 'status must be one of open, claimed, resolved',
      },
    });
  });

  test('POST /api/moderation/items/:itemId/remove rejects non-admin users', async () => {
    const response = await request(app)
      .post('/api/moderation/items/7/remove')
      .set('x-test-user-id', '9')
      .set('x-test-user-role', 'user')
      .send({ reason: 'spam' });

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('ADMIN_REQUIRED');
  });

  test('POST /api/moderation/items/:itemId/remove accepts admin users', async () => {
    moderationService.removeItemPost.mockResolvedValue({
      item: { id: 7, status: 'removed' },
      moderationAction: { id: 22, actionType: 'remove' },
    });

    const response = await request(app)
      .post('/api/moderation/items/7/remove')
      .set('x-test-user-id', '1')
      .set('x-test-user-role', 'admin')
      .send({ reason: 'inappropriate content' });

    expect(response.status).toBe(200);
    expect(moderationService.removeItemPost).toHaveBeenCalledWith({
      itemId: '7',
      adminUserId: 1,
      reason: 'inappropriate content',
    });
    expect(response.body.item.status).toBe('removed');
  });

  test('POST /api/moderation/items/:itemId/remove forwards service errors', async () => {
    moderationService.removeItemPost.mockRejectedValue({
      statusCode: 400,
      code: 'MODERATION_REASON_REQUIRED',
      message: 'Removal reason is required.',
    });

    const response = await request(app)
      .post('/api/moderation/items/7/remove')
      .set('x-test-user-id', '1')
      .set('x-test-user-role', 'admin')
      .send({ reason: '' });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('MODERATION_REASON_REQUIRED');
  });

  test('returns 404 route contract for unknown API endpoint', async () => {
    const response = await request(app).get('/api/not-exists');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: {
        code: 'ROUTE_NOT_FOUND',
        message: 'Route not found.',
      },
    });
  });

  test('returns 403 when origin is not allowed by CORS policy', async () => {
    const response = await request(app)
      .get('/api/health')
      .set('origin', 'https://evil.example.com');

    expect(response.status).toBe(403);
    expect(response.body.error.message).toBe('Origin not allowed by CORS');
  });

  test('returns 500 fallback contract for unexpected errors', async () => {
    itemsService.searchItems.mockRejectedValue(new Error('unknown crash'));

    const response = await request(app)
      .get('/api/items/search')
      .set('x-test-user-id', '3');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Unexpected server error.',
      },
    });
  });

  test('returns fixed payload for LIMIT_FILE_SIZE errors', async () => {
    itemsService.searchItems.mockRejectedValue({
      code: 'LIMIT_FILE_SIZE',
      message: 'file too large',
    });

    const response = await request(app)
      .get('/api/items/search')
      .set('x-test-user-id', '3');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: {
        code: 'LIMIT_FILE_SIZE',
        message: 'Image size must be 5 MB or less.',
      },
    });
  });

  test('GET /api/auth/me bubbles service errors', async () => {
    authService.getCurrentUser.mockRejectedValue({
      statusCode: 401,
      code: 'AUTH_USER_NOT_FOUND',
      message: 'Authenticated user could not be found.',
    });

    const response = await request(app)
      .get('/api/auth/me')
      .set('x-test-user-id', '9');

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('AUTH_USER_NOT_FOUND');
  });
});
