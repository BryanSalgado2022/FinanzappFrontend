## Context

Greenfield Vite + React + TypeScript project (`FinanzappFrontend`), a separate repo from `FinanzappBackend`. See proposal.md for motivation. The backend API is complete and frozen for this change (see the sibling repo's `add-budget-mvp` change for its contract) — this design only covers how the frontend consumes it.

## Goals / Non-Goals

**Goals:**
- A project structure and data-fetching approach that maps cleanly onto the three capabilities in specs/ (`auth-ui`, `dashboard`, `concept-management`).
- A session model that survives page reloads and cleanly handles backend auth rejection.
- A responsive layout that is genuinely mobile-first, not a desktop layout retrofitted with breakpoints.

**Non-Goals:**
- Pixel-level visual design (colors, spacing scale, typography, the exact Concept Detail treatment) — deferred to implementation time using the `/frontend-design` skill, per proposal.md's explicit scope note.
- CI/CD and actual Vercel deployment — only ensuring the build output is Vercel-compatible.
- Any backend modification.

## Decisions

### Data fetching: TanStack Query, one hook per resource
Each backend resource (concepts, a concept's entries, the monthly summary) gets a small `useXxx` hook wrapping TanStack Query (`useConcepts`, `useConcept(id)`, `useConceptEntries(id, anio)`, `useSummary(anio, mes)`). Mutations (`useCreateConcept`, `useUpdateConcept`, `useDeleteConcept`, `useUpsertEntry`) invalidate the relevant query keys on success so the Dashboard and Concept Detail screens stay in sync without manual refetch calls.

**Rationale**: matches the `dashboard` and `concept-management` specs' requirement that lists refresh after a mutation, and avoids hand-rolled loading/error state per screen.

**Alternative considered**: a single global store (Redux/Zustand) holding all server data. Rejected — there's no client-only state complex enough to justify it (confirmed in grilling), and it would duplicate what TanStack Query's cache already does.

### Auth/session: React Context + localStorage
An `AuthContext` holds the current session token and user info in memory, initialized from `localStorage` on app load, and cleared (from both memory and storage) on sign-out or on any API response indicating the token was rejected. A `RequireAuth` wrapper component around protected routes redirects to `/login` when no session is present; the `/login` route itself redirects to `/` when a session is present.

**Rationale**: directly implements the `auth-ui` spec's session-persistence and route-protection requirements with the simplest mechanism that satisfies them — no separate auth library needed since the token exchange itself is just one API call handled by `@react-oauth/google` + a fetch to `/auth/google`.

**Alternative considered**: storing the token only in memory (no persistence). Rejected — that would violate the spec's "session persists across page loads" requirement, forcing a re-login on every refresh.

### API client: thin fetch wrapper, not a generated client
A single small `apiClient` module wraps `fetch`, attaches the `Authorization` header from `AuthContext` when present, and centralizes JSON parsing and error handling (including detecting a 401 to trigger the "clear session" path). Each resource hook calls this client with the concrete endpoint.

**Rationale**: the API surface is small and stable (documented in FinanzappBackend's README); a generated OpenAPI client would add a build step and a dependency on the backend's `openapi.json` staying in sync, for little benefit at this size.

### Routing structure
```
/login                         - Login (public only)
/                               - Dashboard (protected)
/concepts/:id                  - Concept Detail (protected)
```
Both protected routes render inside a shared `RequireAuth` layout route.

### Concept Detail's monthly list: data/structure now, visuals later
The list of twelve entries is built as a plain ordered list of month rows (component: `MonthEntryRow`), each independently editable inline (an amount input + a paid toggle, submitted via `useUpsertEntry`). This satisfies the `concept-management` spec's structural requirements (list not grid, current month distinguished, inline edit) without committing to a specific visual treatment — the "make it feel purposeful, not a spreadsheet clone" exploration happens on top of this same component structure using `/frontend-design`, so restyling it later does not require changing the data flow.

### Mobile-first implementation
Tailwind's default unprefixed styles target mobile; `sm:`/`md:`/`lg:` variants layer on desktop adjustments (e.g., summary cards stack vertically on mobile, row of three on desktop). No separate desktop-only components.

### Dark mode
Tailwind's `class` dark-mode strategy: a root-level class toggled by the user's preference (defaulting to `prefers-color-scheme`), persisted to `localStorage` alongside the session so the choice survives reloads.

### Deployment shape (Vercel)
Standard Vite build (`vite build` → static `dist/`), no server-side code. The backend API base URL and Google OAuth client ID are read from Vite env vars (`VITE_API_BASE_URL`, `VITE_GOOGLE_CLIENT_ID`), set per-environment in Vercel project settings — never hardcoded.

## Risks / Trade-offs

- [Storing the session token in `localStorage` is readable by any script on the page (XSS risk)] → Accepted for this MVP given it's a personal single-user finance tool with no third-party scripts; documented here so it's a conscious choice, not an oversight, and revisited before this app ever handles other users' data at scale.
- [No generated API client means the frontend and backend contracts can drift silently] → Mitigated by keeping the endpoint list in one `apiClient` module and cross-referencing FinanzappBackend's README/OpenAPI docs (`/docs`) when either side changes.
- [Deferring the Concept Detail visual design to implementation time risks the spec being "too structural" to guide `/frontend-design` later] → Mitigated by design.md's explicit `MonthEntryRow` component boundary above, which gives `/frontend-design` a concrete seam to restyle without needing to renegotiate data flow.

## Open Questions

- Exact TanStack Query cache/staleness times per resource — an implementation detail that doesn't change any spec's externally observable behavior; decide during implementation.
- Whether the dark-mode toggle lives in a header icon or a settings area — a placement detail for `/frontend-design` to resolve, not a spec-level decision.
