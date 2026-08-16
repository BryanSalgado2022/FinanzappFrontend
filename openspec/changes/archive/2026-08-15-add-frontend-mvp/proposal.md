## Why

The FinanzappBackend API (auth, budget concepts, monthly entries, monthly summary) is fully built and tested, but there is no way for the user to actually use it yet. This change delivers the React frontend so the user can replace their manual spreadsheet workflow with a real app: sign in, see their monthly budget at a glance, and manage debts/fixed expenses/income month by month.

## What Changes

- Add Google Sign-In: obtain a Google ID token client-side, exchange it with the backend for a JWT, and persist the authenticated session for subsequent API calls.
- Add route protection: unauthenticated users are redirected to Login; authenticated users are redirected away from Login.
- Add a Dashboard screen: month/year selector, summary cards (income, expenses, net balance) from `GET /summary`, and a list of the selected month's concepts with their paid/pending status, plus an entry point to create a new concept.
- Add a Concept Detail screen: concept header (name, type, category, and remaining balance when it's a debt), and a vertical (not spreadsheet-grid) list of the concept's 12 monthly entries for a year, with the current month visually distinguished and inline editing of a month's planned/paid amounts.
- Add light/dark mode support across the app.
- Add a mobile-first responsive layout (the primary use case is logging an entry on the go; desktop is a responsive expansion of the same layout, not a separate design).

**BREAKING**: None (new frontend, no prior UI).

## Capabilities

### New Capabilities
- `auth-ui`: Google Sign-In flow, session persistence, and route protection based on authentication state.
- `dashboard`: monthly summary and current-month concept list in a single view, with month/year navigation.
- `concept-management`: creating concepts, and viewing/editing a concept's monthly entries (including debt remaining balance display).

### Modified Capabilities
(none — greenfield project, no existing frontend specs)

## Impact

- New Vite + React + TypeScript project (`FinanzappFrontend`), styled with Tailwind CSS.
- Consumes the existing `FinanzappBackend` API as-is — no backend changes in this change.
- No impact on other systems.

## Out of Scope (backlog, not part of this change)

- CI/CD pipeline setup and actual Vercel deployment execution (only a Vercel-compatible build).
- Any feature from the backend's own backlog (AI-based expense categorization, real debt amortization, multi-currency, annual budgets as their own entity, reports/export) — this frontend only consumes what the backend already exposes.
- Final visual design system specifics (exact spacing, color palette, micro-interactions) beyond "clean, modern, light/dark mode, mobile-first" — the concrete visual treatment, especially for the Concept Detail screen, is an explicit follow-up during implementation using the `/frontend-design` skill, not pinned down here.
