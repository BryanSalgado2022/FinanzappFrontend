## Why

Today, anyone who visits the app while signed out is bounced straight to the Login screen — there is no page explaining what the product is or why to sign up. A first-time visitor sees a sign-in form with no context.

## What Changes

- Add a public landing page at `/` explaining the product (hero headline/subheadline, 3-4 feature highlights, a single "Comenzar" call-to-action) — reachable without a session.
- **BREAKING** (route restructuring, no user-facing data change): the Dashboard moves from `/` to `/dashboard`. Every other authenticated route (`/agenda`, `/concepts/:id`, `/deudas`, etc.) is unaffected.
- The landing page redirects an already-authenticated visitor straight to `/dashboard`, matching the existing pattern used for Login.
- The "Comenzar" button navigates to `/login`, where the existing login/register toggle is unchanged.
- Update every place that assumed `/` was the Dashboard: `RequireAuth`'s authenticated-redirect target, the Header's logo link (only rendered for authenticated users, inside the app shell), and Concept Detail's post-delete navigation.

## Capabilities

### New Capabilities
- `landing-page`: the public, unauthenticated marketing page shown at `/`, explaining the product and linking to sign-in.

### Modified Capabilities
- `auth-ui`: "Route protection by authentication state" changes from "redirect authenticated users away from Login to the Dashboard" to also cover the new landing page — an authenticated visitor to `/` is redirected to `/dashboard`, and the Dashboard itself now lives at `/dashboard` instead of `/`.

## Impact

- `src/App.tsx`: new public route for Landing at `/` (wrapped in `RedirectIfAuthenticated`); Dashboard's route path changes from `/` to `/dashboard`.
- New `src/pages/Landing.tsx`.
- `src/components/RequireAuth.tsx`: `RedirectIfAuthenticated`'s target changes from `/` to `/dashboard`.
- `src/components/Header.tsx`: logo link target changes from `/` to `/dashboard`.
- `src/pages/ConceptDetail.tsx`: post-delete navigation target changes from `/` to `/dashboard`.
- No backend changes.
