## 1. apiClient fix

- [x] 1.1 In `src/lib/apiClient.ts`, fix the 401 branch of `request()` to read the response body and use `body?.detail` for the thrown `ApiError` message, per design.md

## 2. AuthContext

- [x] 2.1 Add `signInWithPassword(email, password)` to `AuthContext.tsx`, mirroring `signInWithGoogleCredential`'s structure, posting to `/auth/login`
- [x] 2.2 Add `registerWithPassword(nombre, email, password)`, posting to `/auth/register`
- [x] 2.3 Expose both from `AuthContextValue`/the context value object

## 3. Login screen

- [x] 3.1 Add a visual divider ("o") below the existing Google/dev-login buttons in `Login.tsx`
- [x] 3.2 Add `mode: 'login' | 'register'` local state and a toggle button switching between them, with no route change
- [x] 3.3 Render the email/password form (login mode) and name/email/password form (register mode) using the shared `inputClass` pattern from `NewConceptForm.tsx`
- [x] 3.4 Add client-side password-length validation (min 8) for immediate feedback before submit, in register mode
- [x] 3.5 Wire form submission to `signInWithPassword`/`registerWithPassword` depending on `mode`
- [x] 3.6 Map `ApiError.status` to the specific messages from design.md's table (409, 401, 429, 422) and display them

## 4. Verification

- [x] 4.1 Run `npx tsc -b` and confirm no type errors
- [x] 4.2 In the browser: register a new account through the form, confirm it lands authenticated on the Dashboard
- [x] 4.3 In the browser: sign out, log back in with that same email/password, confirm it authenticates
- [x] 4.4 In the browser: attempt to register with an email that already exists, confirm the 409 message shows
- [x] 4.5 In the browser: attempt to log in with a wrong password, confirm the generic invalid-credentials message shows (not the old hardcoded "Not authenticated" text)
- [x] 4.6 In the browser: confirm the existing Google Sign-In flow still works unchanged after the apiClient fix
- [x] 4.7 In the browser: check both light and dark mode, and mobile width, for the new form
- [x] 4.8 Clean up any test accounts created against the real backend during verification
