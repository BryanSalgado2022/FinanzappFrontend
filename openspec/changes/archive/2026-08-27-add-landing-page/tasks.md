## 1. Route restructuring

- [x] 1.1 In `src/App.tsx`, change the Dashboard route inside the `RequireAuth`-wrapped `AppShell` group from `path="/"` to `path="/dashboard"`.
- [x] 1.2 Add a new route rendering `Landing` at `path="/"`, wrapped in `RedirectIfAuthenticated`.
- [x] 1.3 In `src/components/RequireAuth.tsx`, change `RedirectIfAuthenticated`'s `<Navigate to="/" />` to `<Navigate to="/dashboard" />`.
- [x] 1.4 Update `src/components/Header.tsx`'s logo `<Link to="/">` to `<Link to="/dashboard">`.
- [x] 1.5 Update `src/pages/ConceptDetail.tsx`'s post-delete `navigate('/')` to `navigate('/dashboard')`.
- [x] 1.6 Grep the repo for any other `to="/"`, `navigate('/')`, or `href="/"` reference to catch call sites missed above. (Found and fixed a 4th site not covered by the proposal's enumeration: `Sidebar.tsx`'s `{ to: '/', ... }` nav item object.)

## 2. Landing page

- [x] 2.1 Create `src/pages/Landing.tsx`: minimal header (TOBE wordmark, theme-aware per `useTheme()`, plus a small "Iniciar sesión" link to `/login`), hero section (headline + subheadline explaining TOBE's purpose), primary "Comenzar" CTA button navigating to `/login`.
- [x] 2.2 Add the 4 feature-highlight cards (Dashboard, Agenda, Deudas con amortización, Asistente con IA) using existing `lucide-react` icons per design.md, styled with the app's existing design tokens (Fraunces/Manrope, paper/ink/accent).
- [x] 2.3 Verify the page respects both light and dark themes.

## 3. Verification

- [x] 3.1 Run `npx tsc -b` to confirm no type errors.
- [x] 3.2 Manually verify in-browser (logged out): visiting `/` shows the landing page, not Login; the "Comenzar" and "Iniciar sesión" links both reach `/login`; the login/register flow still works unchanged.
- [x] 3.3 Manually verify in-browser (logged in): visiting `/` redirects to `/dashboard`; visiting `/login` still redirects to `/dashboard`; the Header logo navigates to `/dashboard`. (Concept-delete redirect verified by code inspection — identical one-line change to the same navigate-after-delete pattern already confirmed working end-to-end for other concepts earlier in this session.)
- [x] 3.4 Verify both themes on the landing page.
