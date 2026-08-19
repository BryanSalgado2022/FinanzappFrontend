## Context

See proposal.md - Why. The app is a standard Vite + React SPA (`npm run build` → `tsc -b && vite build` → static output in `dist/`), routed client-side via `react-router-dom`'s `BrowserRouter` (`src/main.tsx`). `vite.config.ts` has no `base` path or other deployment-specific config. Two env vars drive runtime behavior: `VITE_API_BASE_URL` and `VITE_GOOGLE_CLIENT_ID` (see `.env.example`), both meant to be set per-environment rather than hardcoded - already documented in the README as "set these in Vercel project settings."

## Goals / Non-Goals

**Goals:**
- Direct navigation or a page refresh on any client-side route (e.g. `/agenda`, `/concepts/3`) works on Vercel, not just navigation that originates from `/`.
- CI catches a broken typecheck or build before it reaches `main`.
- The user has an exact, copy-pasteable list of what to configure in Vercel's project settings - I do not touch Vercel itself.

**Non-Goals:**
- Not adding a `base` path to `vite.config.ts` - Vercel serves the project at its domain root by default, so the existing root-relative build is already correct; only add this later if the app ever moves under a subpath.
- Not adding a CD (auto-deploy) step to the GitHub Actions workflow - Vercel's own GitHub integration builds and deploys on push once the user connects the repo from their dashboard; this workflow is CI (typecheck + build) only, and is a separate check from Vercel's own build.
- Not adding automated UI/E2E tests - none exist in this project today (matches its current state; out of scope here).

## Decisions

**`vercel.json` with a catch-all rewrite, not a `vite.config.ts` change.** SPA routing on a static host needs the platform to serve `index.html` for any path it doesn't recognize as a real file, so the client-side router can take over. This is a hosting-layer concern, not a build-layer one, so it belongs in `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
*Alternative considered*: relying on Vercel's zero-config SPA detection (Vercel does auto-detect some frameworks and rewrite accordingly). Rejected as too implicit to document confidently - an explicit `vercel.json` is one small file and removes any ambiguity about whether it's applied.

**CI: typecheck + build, no separate lint step.** The workflow (`.github/workflows/frontend-build.yml`) runs on `push` to `main` and `pull_request`, using `actions/setup-node` (pin to the Node major version already implied by this project's tooling - check `package.json`'s `engines` field if present, otherwise use the current Node LTS), `npm ci`, then `npm run build` (which already runs `tsc -b` before `vite build`, so a single command covers both typecheck and build failures). `oxlint` is available (`npm run lint`) but is left out of CI for now since it's not currently part of anyone's local pre-commit habit for this project - can be added later without controversy.

**Environment variables to configure in Vercel's project settings** (documented in README, not committed anywhere as real values):
| Variable | Value in Vercel |
|---|---|
| `VITE_API_BASE_URL` | The Railway backend's production URL, once deployed (see the sibling `prepare-railway-deploy` change) |
| `VITE_GOOGLE_CLIENT_ID` | Same value as local `.env` (same Google OAuth client, unless the user creates a separate prod client - if so, also add the Vercel production URL as an authorized JavaScript origin in Google Cloud Console) |

Vite only inlines `VITE_*` variables at *build* time, not runtime - so these must be set in Vercel's project settings before the first production build, not after.

## Risks / Trade-offs

[`VITE_API_BASE_URL` can't be set to the real Railway URL until Railway assigns one, and vice versa for the backend's `CORS_ORIGINS` needing this Vercel URL] → Documented as an explicit two-step manual sequence in the README, mirrored in the backend's own README: deploy backend first (get its URL), then deploy frontend with that URL, then return to Railway and add the frontend's URL to `CORS_ORIGINS`.
[A missed `vercel.json` would silently 404 on refresh for every route but `/`, easy to miss if the user only ever navigates by clicking links during a quick smoke test] → Call this out explicitly in tasks.md's verification step: test a hard refresh on a non-root route, not just in-app navigation.
