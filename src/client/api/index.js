const BASE = '/api';

async function request(method, path, body, isFormData = false) {
  const opts = {
    method,
    credentials: 'include',
  };
  if (body) {
    if (isFormData) {
      opts.body = body;
    } else {
      opts.headers = { 'Content-Type': 'application/json' };
      opts.body = JSON.stringify(body);
    }
  }
  const res = await fetch(BASE + path, opts);
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || 'Request failed');
  return data;
}

export const Auth = {
  register: (payload) => request('POST', '/auth/register', payload),
  login: (payload) => request('POST', '/auth/login', payload),
  logout: () => request('POST', '/auth/logout'),
  me: () => request('GET', '/auth/me'),
};

export const Items = {
  search: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) params.set(k, v);
    });
    const qs = params.toString();
    return request('GET', `/items/search${qs ? '?' + qs : ''}`);
  },
  get: (itemId) => request('GET', `/items/${itemId}`),
  create: (data, imageFile) => {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => form.append(k, v));
    if (imageFile) form.append('image', imageFile);
    return request('POST', '/items', form, true);
  },
  update: (itemId, data, imageFile) => {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => form.append(k, v));
    if (imageFile) form.append('image', imageFile);
    return request('PATCH', `/items/${itemId}`, form, true);
  },
  delete: (itemId) => request('DELETE', `/items/${itemId}`),
  updateStatus: (itemId, status) => request('PATCH', `/items/${itemId}/status`, { status }),
  getMatches: (itemId) => request('GET', `/items/${itemId}/matches`),
};

export const Moderation = {
  removePost: (itemId, reason) => request('POST', `/moderation/items/${itemId}/remove`, { reason }),
};
