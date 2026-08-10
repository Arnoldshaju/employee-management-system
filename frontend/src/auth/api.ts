import type { AuthResponse, AuthTokens, RegisterInput, User } from './types'

const TOKEN_KEY = 'peopleflow-auth-tokens'

function readTokens(): AuthTokens | null {
  const stored = sessionStorage.getItem(TOKEN_KEY)
  if (!stored) return null

  try {
    return JSON.parse(stored) as AuthTokens
  } catch {
    sessionStorage.removeItem(TOKEN_KEY)
    return null
  }
}

function saveTokens(tokens: AuthTokens) {
  sessionStorage.setItem(TOKEN_KEY, JSON.stringify(tokens))
}

export function clearTokens() {
  sessionStorage.removeItem(TOKEN_KEY)
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    if (response.status === 204) return undefined as T
    return response.json() as Promise<T>
  }

  let message = 'Something went wrong. Please try again.'
  try {
    const body = (await response.json()) as Record<string, unknown>
    const firstValue = Object.values(body)[0]
    if (typeof body.detail === 'string') message = body.detail
    else if (typeof firstValue === 'string') message = firstValue
    else if (Array.isArray(firstValue) && typeof firstValue[0] === 'string') {
      message = firstValue[0]
    }
  } catch {
    // Keep the general message when the server does not return JSON.
  }
  throw new Error(message)
}

async function refreshAccessToken(): Promise<AuthTokens> {
  const currentTokens = readTokens()
  if (!currentTokens) throw new Error('Your session has expired.')

  const response = await fetch('/api/auth/refresh/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: currentTokens.refresh }),
  })
  const refreshed = await parseResponse<{ access: string; refresh?: string }>(response)
  const tokens = {
    access: refreshed.access,
    refresh: refreshed.refresh ?? currentTokens.refresh,
  }
  saveTokens(tokens)
  return tokens
}

async function authenticatedFetch(path: string, init: RequestInit = {}) {
  const tokens = readTokens()
  if (!tokens) throw new Error('You need to sign in.')

  const request = (access: string) =>
    fetch(path, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init.headers,
        Authorization: `Bearer ${access}`,
      },
    })

  let response = await request(tokens.access)
  if (response.status === 401) {
    const refreshed = await refreshAccessToken()
    response = await request(refreshed.access)
  }
  return response
}

export async function login(email: string, password: string) {
  const response = await fetch('/api/auth/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await parseResponse<AuthResponse>(response)
  saveTokens({ access: data.access, refresh: data.refresh })
  return data.user
}

export async function register(input: RegisterInput) {
  const response = await fetch('/api/auth/register/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const data = await parseResponse<AuthResponse>(response)
  saveTokens({ access: data.access, refresh: data.refresh })
  return data.user
}

export async function getCurrentUser() {
  const response = await authenticatedFetch('/api/auth/me/')
  return parseResponse<User>(response)
}

export async function logout() {
  const tokens = readTokens()
  try {
    if (tokens) {
      const response = await authenticatedFetch('/api/auth/logout/', {
        method: 'POST',
        body: JSON.stringify({ refresh: tokens.refresh }),
      })
      await parseResponse<void>(response)
    }
  } catch {
    // Local logout must still succeed if the token already expired or rotated.
  } finally {
    clearTokens()
  }
}

export function hasStoredSession() {
  return readTokens() !== null
}
