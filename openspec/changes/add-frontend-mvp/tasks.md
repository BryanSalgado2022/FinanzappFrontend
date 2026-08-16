## 1. Project Setup

- [x] 1.1 Scaffold Vite + React + TypeScript project
- [x] 1.2 Install and configure Tailwind CSS, including the `class`-based dark mode strategy
- [x] 1.3 Install React Router, TanStack Query, and `@react-oauth/google`
- [x] 1.4 Set up `.env.example` documenting `VITE_API_BASE_URL` and `VITE_GOOGLE_CLIENT_ID`, and add `.env` to `.gitignore`
- [x] 1.5 Set up base routing structure (`/login`, `/`, `/concepts/:id`) with placeholder pages
- [x] 1.6 Add a thin `apiClient` module (fetch wrapper with base URL, JSON handling, auth header injection, 401 detection)

## 2. Authentication (spec: `auth-ui`)

- [x] 2.1 Implement `AuthContext` (session token + user, initialized from `localStorage`)
- [x] 2.2 Implement the Login screen with the `@react-oauth/google` sign-in control
- [x] 2.3 On successful Google sign-in, exchange the ID token via `POST /auth/google` and store the returned session token
- [x] 2.4 Handle backend rejection of the Google token (show an error on Login, do not authenticate)
- [x] 2.5 Wire `apiClient`'s 401 detection to clear the session and redirect to Login
- [x] 2.6 Implement `RequireAuth` route wrapper (protected routes redirect unauthenticated users to Login) and the inverse redirect (authenticated users away from Login)
- [x] 2.7 Implement sign-out (clear session, redirect to Login)

## 3. Dashboard (spec: `dashboard`)

- [x] 3.1 Implement `useSummary(anio, mes)` hook (TanStack Query wrapping `GET /summary`)
- [x] 3.2 Implement `useConcepts()` and a way to derive the selected month's concept+entry status for display
- [x] 3.3 Implement month/year selector, defaulting to the current calendar month on first load
- [x] 3.4 Implement summary cards (income, expenses, net balance) with positive/negative balance visually distinguished
- [x] 3.5 Handle the no-data-for-month case by showing zero values, not an error
- [x] 3.6 Implement the concept list for the selected month, showing paid/pending status per concept
- [x] 3.7 Implement "create new concept" flow from the Dashboard (form/modal calling `useCreateConcept`, invalidating the concept list on success)

## 4. Concept Management (spec: `concept-management`)

- [x] 4.1 Implement `useConcept(id)` and `useConceptEntries(id, anio)` hooks
- [x] 4.2 Implement the Concept Detail header (name, type, category, remaining balance shown only for debts)
- [x] 4.3 Implement the `MonthEntryRow` component and the twelve-month vertical list for a selectable year, with the current month visually distinguished and months with no entry still shown
- [x] 4.4 Implement year selection on the Concept Detail screen
- [x] 4.5 Implement inline editing of a month's planned amount, paid amount, and paid status via `useUpsertEntry` (`PUT /concepts/{id}/entries/{anio}/{mes}`), without navigating away from the screen
- [x] 4.6 Implement editing a concept's name/category and marking it finished via `useUpdateConcept`
- [x] 4.7 Implement deleting a concept via `useDeleteConcept`, navigating back to the Dashboard on success

## 5. Cross-Cutting UI

- [x] 5.1 Implement dark/light mode toggle, persisted to `localStorage`, defaulting to system preference
- [x] 5.2 Apply mobile-first responsive layout across Login, Dashboard, and Concept Detail — verified by code review (base Tailwind utilities are the mobile styles, `sm:` layers on desktop); the browser automation tool available in this session could not force a real narrow viewport to additionally confirm visually
- [x] 5.3 Run `/frontend-design` to iterate on the concrete visual design — "editorial ledger" direction (Fraunces + Manrope, warm paper/ink palette), Concept Detail redesigned as a vertical progress timeline grouped by quarter with a debt progress ring, verified in both light and dark mode in-browser

## 6. Wrap-up

- [x] 6.1 Verify the app runs end-to-end locally against the running FinanzappBackend API (sign in, view dashboard, create a concept, edit a monthly entry, see the summary update) — found and fixed two real bugs in the process (see below)
- [x] 6.2 Verify `vite build` produces a working production build (Vercel-compatible)
- [x] 6.3 Confirm light/dark mode and mobile/desktop layouts both work across the three screens
