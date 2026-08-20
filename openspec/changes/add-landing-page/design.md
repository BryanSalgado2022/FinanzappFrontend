## Context

`/` currently renders the Dashboard behind `RequireAuth`; `RedirectIfAuthenticated` (wrapping `/login`) sends already-authenticated visitors to `/`. Three other call sites hardcode `/` as "the Dashboard": `Header.tsx`'s logo link (rendered only inside the authenticated `AppShell`), and `ConceptDetail.tsx`'s post-delete navigation. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Public, unauthenticated `/` that explains the product and links to `/login`.
- Every existing "go to the Dashboard" navigation still lands on the Dashboard after its path changes to `/dashboard`.

**Non-Goals:**
- Pricing/subscription content on the landing page (explicitly deferred by the user to a later, separate initiative).
- Real product screenshots (per grilling: text/icon feature highlights only for v1).
- Any backend change.

## Decisions

**Route restructuring**: `App.tsx`'s `RequireAuth`-wrapped `AppShell` group changes its Dashboard route from `path="/"` to `path="/dashboard"`. A new top-level route renders `Landing` at `path="/"`, wrapped in `RedirectIfAuthenticated` (the same guard already used for `/login`) so an authenticated visitor to `/` is bounced to `/dashboard` instead of seeing marketing content meant for logged-out visitors.

**Guard target update**: `RedirectIfAuthenticated`'s `<Navigate to="/" .../>` becomes `<Navigate to="/dashboard" .../>` — this one change fixes both the Login screen's and the new Landing page's authenticated-redirect behavior, since both routes use the same guard component.

**Hardcoded `/` call sites**: `Header.tsx`'s logo `<Link to="/">` becomes `<Link to="/dashboard">` (safe — Header only renders inside the authenticated `AppShell`, never on the public landing page, so this link is never reachable by a logged-out visitor). `ConceptDetail.tsx`'s `navigate('/')` after delete becomes `navigate('/dashboard')`.

**Landing page structure**: a single new `src/pages/Landing.tsx`, not wrapped by `AppShell` (no sidebar/header chrome — it's a pre-auth page, matching how `Login.tsx` today has no shell either). Own minimal header: TOBE wordmark (reusing the existing theme-aware wordmark images) plus a small "Iniciar sesión" text link in the corner for returning visitors who don't want to read the pitch, in addition to the primary "Comenzar" CTA in the hero. Both navigate to `/login`.

**Feature highlights content** (4, matching the app's actual shipped capabilities, to avoid overpromising): Dashboard mensual (balance, tendencia anual), Agenda (calendario de vencimientos y pagos), Deudas con amortización (tasa de interés, cuotas, seguimiento del saldo), Asistente con IA (registrar gastos y deudas por lenguaje natural). Icons reuse `lucide-react` icons already used elsewhere in the app for these concepts (`Wallet`/`TrendingUp` for Dashboard, `CalendarDays`-equivalent already used in Agenda's sidebar entry, `Landmark` for Deudas, `MessageCircle` for the AI assistant, matching `AgentChatWidget.tsx`'s own icon) rather than introducing new iconography.

**Theme on a pre-auth page**: `useTheme()` is already used unauthenticated on `Login.tsx` today (theme preference is stored independent of auth state), so `Landing.tsx` reuses the same hook with no new plumbing.

## Risks / Trade-offs

- [Risk] Any external link, bookmark, or the Vercel/DNS config pointing at `tobefinance.com/` for "the app" now lands on marketing content instead of the Dashboard for a logged-out visitor. → Mitigation: this is the intended behavior change per the proposal; an authenticated visitor (the common case for a returning user with a valid session) is transparently redirected to `/dashboard`, so only genuinely logged-out visits are affected.
- [Risk] Missing a hardcoded `/`-as-Dashboard reference during implementation would silently regress a navigation flow. → Mitigation: the three known call sites are enumerated above and in proposal.md's Impact section; tasks.md includes a repo-wide grep as a verification step before marking this done.
