import { Auth, Items, Moderation } from '../../../src/client/api/index.js';

describe('Frontend API Layer', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Core Request Behaviors', () => {
    it('returns null on 204 response', async () => {
      global.fetch.mockResolvedValueOnce({
        status: 204,
        ok: true,
      });

      const res = await Auth.logout();
      expect(res).toBeNull();
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/logout', expect.any(Object));
    });

    it('throws error when response is not ok', async () => {
      global.fetch.mockResolvedValueOnce({
        status: 400,
        ok: false,
        json: async () => ({ error: { message: 'Custom error message' } }),
      });

      await expect(Auth.me()).rejects.toThrow('Custom error message');
    });

    it('throws fallback error when response is not ok and no error message provided', async () => {
      global.fetch.mockResolvedValueOnce({
        status: 500,
        ok: false,
        json: async () => ({}),
      });

      await expect(Auth.me()).rejects.toThrow('Request failed');
    });

    it('sends FormData properly', async () => {
      global.fetch.mockResolvedValueOnce({
        status: 200,
        ok: true,
        json: async () => ({ success: true }),
      });

      // To test FormData, we will mock FormData globally or rely on JSDOM FormData
      const fakeImage = new File([''], 'test.png', { type: 'image/png' });
      await Items.create({ title: 'Test' }, fakeImage);

      const fetchCallArgs = global.fetch.mock.calls[0];
      expect(fetchCallArgs[0]).toBe('/api/items');
      expect(fetchCallArgs[1].method).toBe('POST');
      expect(fetchCallArgs[1].body).toBeInstanceOf(FormData);
    });
  });

  describe('Auth API', () => {
    beforeEach(() => {
      global.fetch.mockResolvedValue({
        status: 200,
        ok: true,
        json: async () => ({ user: { id: 1 } }),
      });
    });

    it('register', async () => {
      await Auth.register({ email: 'a@a.com', password: 'password' });
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/register', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'a@a.com', password: 'password' })
      }));
    });

    it('login', async () => {
      await Auth.login({ email: 'a@a.com', password: 'password' });
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({
        method: 'POST',
      }));
    });

    it('me', async () => {
      await Auth.me();
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/me', expect.objectContaining({
        method: 'GET',
        credentials: 'include'
      }));
    });
  });

  describe('Items API', () => {
    beforeEach(() => {
      global.fetch.mockResolvedValue({
        status: 200,
        ok: true,
        json: async () => ({ items: [] }),
      });
    });

    it('search with params', async () => {
      await Items.search({ type: 'found', status: undefined, search: 'keys' });
      expect(global.fetch).toHaveBeenCalledWith('/api/items/search?type=found&search=keys', expect.any(Object));
    });

    it('search without params', async () => {
      await Items.search();
      expect(global.fetch).toHaveBeenCalledWith('/api/items/search', expect.any(Object));
    });

    it('get', async () => {
      await Items.get('item123');
      expect(global.fetch).toHaveBeenCalledWith('/api/items/item123', expect.any(Object));
    });

    it('create without image', async () => {
      await Items.create({ title: 'Test' });
      const call = global.fetch.mock.calls[0];
      expect(call[0]).toBe('/api/items');
    });

    it('update', async () => {
      const fakeImage = new File([''], 'test.png', { type: 'image/png' });
      await Items.update('item123', { description: 'Updated' }, fakeImage);
      const callArgs = global.fetch.mock.calls[0];
      expect(callArgs[0]).toBe('/api/items/item123');
      expect(callArgs[1].method).toBe('PATCH');
    });

    it('delete', async () => {
      await Items.delete('item123');
      expect(global.fetch).toHaveBeenCalledWith('/api/items/item123', expect.objectContaining({ method: 'DELETE' }));
    });

    it('updateStatus', async () => {
      await Items.updateStatus('item123', 'resolved');
      expect(global.fetch).toHaveBeenCalledWith('/api/items/item123/status', expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ status: 'resolved' })
      }));
    });

    it('getMatches', async () => {
      await Items.getMatches('item123');
      expect(global.fetch).toHaveBeenCalledWith('/api/items/item123/matches', expect.objectContaining({ method: 'GET' }));
    });
  });

  describe('Moderation API', () => {
    beforeEach(() => {
      global.fetch.mockResolvedValue({
        status: 200,
        ok: true,
        json: async () => ({ success: true }),
      });
    });

    it('removePost', async () => {
      await Moderation.removePost('item123', 'Inappropriate content');
      expect(global.fetch).toHaveBeenCalledWith('/api/moderation/items/item123/remove', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Inappropriate content' })
      }));
    });
  });
});
