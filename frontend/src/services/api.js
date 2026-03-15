const BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = res.status === 204 ? null : await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || res.statusText);
  return data;
}

export const userApi = {
  getAll: (params = {}) => {
    const search = new URLSearchParams(params).toString();
    return request(`/users${search ? `?${search}` : ''}`);
  },
  getById: (id) => request(`/users/${id}`),
  create: (body) => request('/users', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  getFilters: () => request('/users/filters'),
  delete: (id) => request(`/users/${id}`, { method: 'DELETE' }),
};
