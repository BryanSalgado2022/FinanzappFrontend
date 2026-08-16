import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { apiClient, setAuthToken, setUnauthorizedHandler } from '../lib/apiClient'
import { clearStoredSession, loadStoredSession, saveStoredSession, type StoredSession } from '../lib/session'
import type { User } from '../types'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  signInError: string | null
  signInWithGoogleCredential: (credential: string) => Promise<void>
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

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: session !== null,
      signInError,
      signInWithGoogleCredential,
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
