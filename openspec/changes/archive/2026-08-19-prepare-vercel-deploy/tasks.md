## 1. Vercel SPA routing

- [x] 1.1 Create `vercel.json` at the repo root with the catch-all rewrite to `/index.html`
- [x] 1.2 Verify locally via `npm run build && npx serve dist` (or equivalent) that a direct request to a nested route still needs the rewrite to work - Vercel applies it, a plain static server may not, so this step mainly confirms the build output itself is a normal SPA bundle with no other routing assumption baked in

## 2. CI workflow

- [x] 2.1 Create `.github/workflows/frontend-build.yml`: triggers on `push` to `main` and `pull_request`, sets up Node 22.x (no `.nvmrc`/`engines` field exists to pin from; 22 is current LTS), `npm ci`, `npm run build`
- [x] 2.2 Verify the workflow file is valid YAML and matches GitHub Actions schema expectations (actionlint or manual review, since it can't be run locally without pushing)

## 3. Documentation

- [x] 3.1 Add a "Despliegue" section to `README.md`: the environment variable table from design.md, the build-time-only note about `VITE_*` vars, the two-step URL-sequencing note (mirrors the backend's), and a short "connect the repo from Vercel's dashboard" pointer (no Vercel CLI steps, since the user does this themselves)

## 4. Verification

- [x] 4.1 `npm run build` succeeds locally (already the CI check, run once more as a final sanity pass)
- [x] 4.2 Confirm `vercel.json` is valid JSON and its rewrite pattern matches Vercel's documented `rewrites` config shape
