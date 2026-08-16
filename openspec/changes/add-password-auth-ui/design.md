## Context

See proposal.md for motivation. Relevant current state:

- `src/pages/Login.tsx`: a `GoogleLogin` button calling `signInWithGoogleCredential`, plus a dev-only button behind `import.meta.env.DEV` calling `signInAsDevUser`. Both live in `AuthContext`, not TanStack Query mutations - they're plain async functions that call `apiClient.post`, build a `StoredSession`, and call `saveStoredSession`/`setAuthToken`/`setSession` directly.
- `src/context/AuthContext.tsx`: `session.user` is a plain `{ email, name, picture? }` (see `src/types.ts`'s `User`) built client-side - for Google, by decoding the ID token's JWT payload (no server round-trip for user info); for dev-login, hardcoded.
- `src/lib/apiClient.ts`'s `request()` special-cases `response.status === 401`: it calls the global `onUnauthorized` handler (which clears the stored session - meant for "your session expired mid-use") and throws `ApiError(401, 'Not authenticated')` with a **hardcoded** message, before ever reading the response body. Every other error status reads `body.detail` for the message.

## Goals / Non-Goals

**Goals:**
- Reuse the existing `AuthContext` function pattern (plain async functions, not a new TanStack Query hook) for consistency with `signInWithGoogleCredential`/`signInAsDevUser`.
- Surface the backend's actual per-case error text to the user.

**Non-Goals:**
- No backend changes - `TokenResponse` stays `{access_token, token_type}` with no user-info fields.
- No password-reset UI, not even a disabled/placeholder link.

## Decisions

### Fix `apiClient.ts`'s 401 handling to preserve the response body's message
`/auth/login`'s 401 ("Invalid email or password") is a **legitimate expected response from an unauthenticated call**, not a signal that an existing session went stale - but `request()`'s current 401 branch fires unconditionally before reading the body, discarding the backend's actual message and always throwing the hardcoded `'Not authenticated'` string. Without a fix, the login form could never display the real backend message for wrong credentials.

Fix: read the body in the 401 branch too (mirroring the generic `!response.ok` branch) and use `body?.detail` when present:
```ts
if (response.status === 401) {
  const body = await response.json().catch(() => null)
  onUnauthorized?.()
  throw new ApiError(401, body?.detail ? String(body.detail) : 'Not authenticated')
}
```
`onUnauthorized` still fires on every 401 (including from `/auth/login`), but that's harmless here: at login/register time there is no session to clear yet (`clearSession()` on an empty session is a no-op), and calling it doesn't navigate anywhere on its own - only `RequireAuth`'s route logic acts on `isAuthenticated`, which was already `false` while sitting on the Login screen. No change needed to the interceptor's wiring, only to what message survives.

Alternative considered: add a per-call flag to skip the interceptor for `/auth/login`/`/auth/register`. Rejected as unnecessary complexity - the interceptor's side effect is already inert in this context, and the real bug is only the swallowed message.

### `AuthContext` gains `signInWithPassword` and `registerWithPassword`, mirroring the existing functions exactly
```ts
const signInWithPassword = async (email: string, password: string) => {
  setSignInError(null)
  try {
    const { access_token } = await apiClient.post<{ access_token: string; token_type: string }>(
      '/auth/login', { email, password },
    )
    const next: StoredSession = { accessToken: access_token, user: { email, name: email } }
    saveStoredSession(next)
    setAuthToken(next.accessToken)
    setSession(next)
  } catch (err) {
    setSignInError(err instanceof ApiError ? err.message : 'No se pudo iniciar sesión.')
  }
}
```
`registerWithPassword(nombre, email, password)` follows the same shape, posting to `/auth/register` and using `{ email, name: nombre }` for the session user (the name the user just typed, which the backend never echoes back).

**Known cosmetic limitation, accepted rather than worked around**: because `TokenResponse` carries no user info, a password-login session's `user.name` falls back to the email address (the name typed at registration is only known in that same browser session, not on a later login, possibly from a different device). This means the header greeting shows an email instead of a name for password-only users after a fresh login. Fixing this would require a backend change (e.g. a `/auth/me` endpoint or adding name to `TokenResponse`), which is out of scope here per the Non-Goals - flagged as a candidate for a small future backend addition if it bothers the user in practice, not built speculatively now.

### Error message mapping (in `Login.tsx`, using `ApiError.status`)
| Status | Case | Message shown |
|---|---|---|
| 409 | register: email taken | "Ese correo ya tiene una cuenta. Intenta iniciar sesión." |
| 401 | login: bad credentials | "Correo o contraseña incorrectos." (backend's own text, now correctly surfaced) |
| 429 | either | "Demasiados intentos. Espera un momento y vuelve a intentar." |
| 422 | register: password too short (also checked client-side before submit for instant feedback) | "La contraseña debe tener al menos 8 caracteres." |

### Login screen layout
Existing Google button and dev-login button stay exactly where they are. Below them: a `<hr>`-style divider with centered "o" text (matching the app's `border-line`/`text-ink-muted` tokens), then the email/password form using the same `inputClass` pattern already used in `NewConceptForm.tsx`, and a text toggle button at the bottom ("¿No tienes cuenta? Regístrate" / "¿Ya tienes cuenta? Inicia sesión") that flips a local `mode: 'login' | 'register'` state - the name field only renders in `'register'` mode.

## Risks / Trade-offs

- **[Trade-off]** Password-login sessions display email instead of name in the header. → Accepted per above; not a data-integrity issue, purely cosmetic, and fixable later without breaking anything already built.
- **[Risk]** The `apiClient.ts` 401 fix is a shared code path used by every authenticated request in the app, not just login. → Low risk: the change only affects which message is thrown, not control flow (`onUnauthorized` still fires the same way); verify via the existing protected-route tests/flows still behave the same after the change (manual check in tasks.md).
