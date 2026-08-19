## Why

Sibling to `prepare-railway-deploy` in FinanzappBackend: the frontend has no deployment infrastructure today - no CI, no SPA-routing config for a static host, nothing connected to Vercel. The user wants both repos prepared for a real deployment. This is pure tooling/infrastructure - no application behavior changes.

## What Changes

- Add a GitHub Actions workflow that runs `tsc -b` (typecheck) and `vite build` on every push to `main` and every PR, catching a broken build before it reaches `main`.
- Add a `vercel.json` SPA rewrite rule - the app uses `BrowserRouter` (client-side routing with real paths like `/agenda`, `/concepts/:id`), so a direct visit or refresh on any non-root route needs Vercel to serve `index.html` instead of 404ing.
- Document the exact environment variables the user must set in Vercel's project settings, and the two-step sequencing with the backend's Railway URL (chicken-and-egg: the frontend needs the backend's URL, the backend's CORS needs the frontend's URL, so one has to deploy first).
- No application code changes - this is CI config, a Vercel routing file, and documentation only.

## Capabilities

### New Capabilities
(none - infrastructure/tooling only, no spec-level behavior change; `skip_specs: true` set in `.openspec.yaml`)

### Modified Capabilities
(none)

## Impact

- `.github/workflows/`: new CI workflow file.
- `vercel.json`: new file, SPA rewrite rule.
- `README.md`: deployment section documenting required Vercel environment variables and the manual account-connection/sequencing steps the user performs themselves.
