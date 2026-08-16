import { loadStoredSession } from './session'

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string

// Read synchronously at module load, not from an AuthContext effect: effects on a
// child component (e.g. a Dashboard useQuery) run before an ancestor's (AuthProvider),
// so waiting for AuthContext's effect to call setAuthToken would let the very first
// request after a page load go out unauthenticated and be treated as a real 401.
let authToken: string | null = loadStoredSession()?.accessToken ?? null
let onUnauthorized: (() => void) | null = null

export function setAuthToken(token: string | null): void {
  authToken = token
}

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')
  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`)
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...init, headers })

  if (response.status === 401) {
    onUnauthorized?.()
    throw new ApiError(401, 'Not authenticated')
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const message = body?.detail ? String(body.detail) : response.statusText
    throw new ApiError(response.status, message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: body !== undefined ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: body !== undefined ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
