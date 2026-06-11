const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

// ── Token helpers ────────────────────────────────────────────────────────────
const TOKEN_KEY = 'sigap_token'
export const getToken   = ()      => localStorage.getItem(TOKEN_KEY)
export const setToken   = (token) => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = ()      => localStorage.removeItem(TOKEN_KEY)

// ── CSRF (wajib untuk Sanctum) ───────────────────────────────────────────────
export const initCsrf = () =>
  fetch(`${BASE_URL.replace('/api', '')}/sanctum/csrf-cookie`, { credentials: 'include' })

// ── Core request ─────────────────────────────────────────────────────────────
async function request(path, { params, ...options } = {}) {
  let url = `${BASE_URL}${path}`
  if (params) {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined)
    ).toString()
    if (qs) url += `?${qs}`
  }

  const token = getToken()
  const headers = {
    'Accept': 'application/json',
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(url, { ...options, headers, credentials: 'include' })

  if (res.status === 204) return null

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw Object.assign(
      new Error(data?.message ?? 'Terjadi kesalahan'),
      { status: res.status, data }
    )
  }

  return data
}

// ── HTTP method helpers ───────────────────────────────────────────────────────
const get    = (path, opts)       => request(path, { method: 'GET', ...opts })
const post   = (path, body, opts) => request(path, { method: 'POST',   body: body instanceof FormData ? body : JSON.stringify(body), ...opts })
const patch  = (path, body, opts) => request(path, { method: 'PATCH',  body: JSON.stringify(body), ...opts })
const put    = (path, body, opts) => request(path, { method: 'PUT',    body: JSON.stringify(body), ...opts })
const del    = (path, opts)       => request(path, { method: 'DELETE', ...opts })

// ── Auth ─────────────────────────────────────────────────────────────────────
export const auth = {
  login:         async (email, password) => { await initCsrf(); return post('/auth/login', { email, password }) },
  logout:        ()     => post('/auth/logout', {}),
  me:            ()     => get('/auth/me'),
  register:      (body) => post('/auth/register', body),
  updateProfile: (body) => patch('/auth/profile', body),
}

// ── Reports ───────────────────────────────────────────────────────────────────
export const reports = {
  index:   (params)     => get('/reports', { params }),
  show:    (id)         => get(`/reports/${id}`),
  store:   (body)       => post('/reports', body),
  update:  (id, body)   => patch(`/reports/${id}`, body),
  destroy: (id)         => del(`/reports/${id}`),
  updateStatus: (id, body) => patch(`/reports/${id}/status`, body),
  submitFeedback: (id, body) => post(`/reports/${id}/feedback`, body),
  reanalyze: (id) => post(`/reports/${id}/reanalyze`, {})
}

// ── Categories ────────────────────────────────────────────────────────────────
export const categories = {
  index: ()   => get('/categories'),
  show:  (id) => get(`/categories/${id}`),
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboard = {
  stats: () => get('/dashboard'),
}

// ── Users (admin) ─────────────────────────────────────────────────────────────
export const users = {
  index:   (params)   => get('/users', { params }),
  show:    (id)       => get(`/users/${id}`),
  update:  (id, body) => patch(`/users/${id}`, body),
  destroy: (id)       => del(`/users/${id}`),
}

// ── Instansi (admin) ──────────────────────────────────────────────────────────
export const instansi = {
  index:   (params)   => get('/instansi', { params }),
  show:    (id)       => get(`/instansi/${id}`),
  store:   (body)     => post('/instansi', body),
  update:  (id, body) => patch(`/instansi/${id}`, body),
  destroy: (id)       => del(`/instansi/${id}`),
}