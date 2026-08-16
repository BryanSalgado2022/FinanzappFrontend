## Why

FinanzappBackend now supports email/password registration and login (`POST /auth/register`, `POST /auth/login`), but the Login screen only offers Google Sign-In - there's no way to use the new backend capability from the app.

## What Changes

- Login screen gains an email/password form below the existing Google button, with a text toggle switching the same form between login (email, password) and register (name, email, password) modes - no new route.
- Successful register/login stores the session exactly like the existing Google flow (same `AuthContext`/storage mechanism), so the rest of the app is unaffected.
- Backend error responses (409 email taken, 401 invalid credentials, 429 rate limited, 422 password too short) are shown to the user with a clear message per case.

Explicitly out of scope: password reset/"forgot password" (no link, not even a placeholder - per prior grilling), any change to Google Sign-In's own behavior.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `auth-ui`: the Login screen gains password-based registration and login as an alternative to Google Sign-In.

## Impact

- `src/pages/Login.tsx`: adds the email/password form and login/register mode toggle.
- `src/context/AuthContext.tsx`: adds `signInWithPassword`/`registerWithPassword`, mirroring the existing `signInWithGoogleCredential` pattern.
- `src/lib/apiClient.ts`: fixes a message-swallowing bug on 401 responses (see design.md) surfaced by this change's need to show the backend's actual "invalid credentials" text.
- `src/types.ts`: no data-shape changes needed (`User` already just needs `email`/`name`).
