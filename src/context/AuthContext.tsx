import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ApiError, apiClient, setAuthToken, setUnauthorizedHandler } from '../lib/apiClient'
import { clearStoredSession, loadStoredSession, saveStoredSession, type StoredSession } from '../lib/session'
import type { User } from '../types'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  signInError: string | null
  signInWithGoogleCredential: (credential: string) => Promise<void>
  signInAsDevUser: () => Promise<void>
  signInWithPassword: (email: string, password: string) => Promise<void>
  registerWithPassword: (nombre: string, email: string, password: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function decodeGoogleCredential(credential: string): User {
  const payloadSegment = credential.split('.')[1]
  const payload = JSON.parse(atob(payloadSegment.replace(/-/g, '+').replace(/_/g, '/'))) as {
    email: string
    name: string
    picture?: string
  }
  return { email: payload.email, name: payload.name, picture: payload.picture }
}

function mapPasswordAuthError(err: unknown, kind: 'login' | 'register'): string {
  if (!(err instanceof ApiError)) {
    return kind === 'login' ? 'No se pudo iniciar sesión.' : 'No se pudo crear la cuenta.'
  }
  switch (err.status) {
    case 409:
      return 'Ese correo ya tiene una cuenta. Intenta iniciar sesión.'
    case 401:
      return 'Correo o contraseña incorrectos.'
    case 429:
      return 'Demasiados intentos. Espera un momento y vuelve a intentar.'
    case 422:
      return 'La contraseña debe tener al menos 8 caracteres.'
    default:
      return kind === 'login' ? 'No se pudo iniciar sesión.' : 'No se pudo crear la cuenta.'
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StoredSession | null>(() => loadStoredSession())
  const [signInError, setSignInError] = useState<string | null>(null)

  // Sets apiClient's in-memory token synchronously alongside every session change
  // (not via a useEffect keyed on `session`) - a descendant's query effect can run
  // before this provider's own effect, so an effect-based sync would still race the
  // very first request after sign-in. apiClient itself seeds the initial token from
  // storage at import time, closing the equivalent race on page load.
  const clearSession = () => {
    clearStoredSession()
    setAuthToken(null)
    setSession(null)
  }

  useEffect(() => {
    setUnauthorizedHandler(() => clearSession())
    return () => setUnauthorizedHandler(null)
  }, [])

  const signInWithGoogleCredential = async (credential: string) => {
    setSignInError(null)
    try {
      const { access_token } = await apiClient.post<{ access_token: string; token_type: string }>(
        '/auth/google',
        { id_token: credential },
      )
      const user = decodeGoogleCredential(credential)
      const next: StoredSession = { accessToken: access_token, user }
      saveStoredSession(next)
      setAuthToken(next.accessToken)
      setSession(next)
    } catch {
      setSignInError('No se pudo iniciar sesión con Google. Intenta de nuevo.')
    }
  }

  // Backend-guarded (DEV_MODE) and only ever called from a button that is
  // itself gated behind import.meta.env.DEV, so this path is unreachable in
  // a production build regardless of what the backend has enabled.
  const signInAsDevUser = async () => {
    setSignInError(null)
    try {
      const { access_token } = await apiClient.post<{ access_token: string; token_type: string }>(
        '/auth/dev-login',
      )
      const next: StoredSession = {
        accessToken: access_token,
        user: { email: 'dev@localhost', name: 'Usuario de prueba' },
      }
      saveStoredSession(next)
      setAuthToken(next.accessToken)
      setSession(next)
    } catch {
      setSignInError('El login de desarrollo no está disponible (¿DEV_MODE=true en el backend?).')
    }
  }

  // The backend never echoes back a display name for password sign-in
  // (TokenResponse is just the token) - email is the only identifier
  // available client-side, so it doubles as the display name here.
  const signInWithPassword = async (email: string, password: string) => {
    setSignInError(null)
    try {
      const { access_token } = await apiClient.post<{ access_token: string; token_type: string }>(
        '/auth/login',
        { email, password },
      )
      const next: StoredSession = { accessToken: access_token, user: { email, name: email } }
      saveStoredSession(next)
      setAuthToken(next.accessToken)
      setSession(next)
    } catch (err) {
      setSignInError(mapPasswordAuthError(err, 'login'))
    }
  }

  const registerWithPassword = async (nombre: string, email: string, password: string) => {
    setSignInError(null)
    try {
      const { access_token } = await apiClient.post<{ access_token: string; token_type: string }>(
        '/auth/register',
        { nombre, email, password },
      )
      const next: StoredSession = { accessToken: access_token, user: { email, name: nombre } }
      saveStoredSession(next)
      setAuthToken(next.accessToken)
      setSession(next)
    } catch (err) {
      setSignInError(mapPasswordAuthError(err, 'register'))
    }
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: session !== null,
      signInError,
      signInWithGoogleCredential,
      signInAsDevUser,
      signInWithPassword,
      registerWithPassword,
      signOut: clearSession,
    }),
    [session, signInError],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
