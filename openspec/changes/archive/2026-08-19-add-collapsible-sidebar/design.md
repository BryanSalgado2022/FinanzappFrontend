## Context

See proposal.md - Why. Today `src/components/Header.tsx` owns its own `sidebarOpen` boolean and is mounted independently by every protected page (`Dashboard.tsx`, `Agenda.tsx`, `ConceptDetail.tsx`, `Deudas.tsx`, `Categorias.tsx`, `Tareas.tsx`, `Deudores.tsx`, `DeudorDetail.tsx`, `Gastos.tsx`), each wrapping `<Header /><main>...</main>` in its own `<div className="min-h-svh bg-paper">`. `src/App.tsx` has no shared layout — just `<Routes>` with `RequireAuth`/`RedirectIfAuthenticated` wrapper routes (both already `<Outlet />`-based). `src/components/Sidebar.tsx` is a single component that is always an overlay (`fixed inset-0` backdrop + `fixed inset-y-0 left-0 w-64` panel sliding via `translate-x`).

## Goals / Non-Goals

**Goals:**
- One shared layout owns the top bar, the sidebar, and the sidebar's state, mounted once instead of per-page.
- The sidebar behaves as today (overlay, no persistence) below `md:`, and as a persistent, collapsible rail from `md:` up, per specs/app-navigation/spec.md.
- Every existing page keeps its current visual appearance (padding, max-width, background) except for the added left offset on `md:`+ screens.

**Non-Goals:**
- No change to the sidebar's link set or icons beyond adding the already-shipped Agenda link (spec catch-up, not new scope).
- No change to the top bar's other controls (accent color picker, theme toggle, user name, sign out) beyond the sidebar-open control's visibility.
- Not building a generic/reusable layout system for other future shells - `AppShell` is purpose-built for this app's current navigation.

## Decisions

**Shared layout via a nested route, not a per-page hook.** Add an `AppShell` component rendered as a nested `<Route>` inside the existing `<Route element={<RequireAuth />}>` block, wrapping all protected page routes. `AppShell` renders the top bar, the sidebar, and `<Outlet />` for the page content. Every page drops its own `<Header />` mount and its outer `min-h-svh bg-paper` wrapper (that background/height now lives once in `AppShell`); each page keeps its own `<main className="mx-auto max-w-* ...">` for its individual width/padding. This is the minimal change that lets `RequireAuth` keep working unmodified (it already renders `<Outlet />`) while still gating the shell behind authentication.
*Alternative considered*: a `useSidebar()` hook with the state in a module-level store, keeping each page's own `<Header />` mount. Rejected - it does not remove the duplicated Header/wrapper markup per page, which is exactly what causes today's per-page-independent `sidebarOpen` state.

**State lives in `AppShell`, passed as props (no new Context).** `AppShell` holds two pieces of state: `collapsed` (boolean, `md:`+ only, persisted) and `mobileOpen` (boolean, below `md:` only, not persisted - matches the existing spec that mobile never remembers sidebar state). Both are passed directly as props to `Header` (for the mobile-only open control) and `Sidebar` (for both mobile open/close and desktop collapse/expand). Direct props are enough since `Header` and `Sidebar` are both direct children of `AppShell` - no context needed for this shallow a tree, even though `AuthContext` shows the codebase already has a context pattern available if a deeper need arises later.

**`collapsed` persistence via `localStorage`, lazy-initialized.** Key `finanzapp.sidebarCollapsed` (`"true"`/`"false"`). `AppShell` reads it once via a lazy `useState` initializer (defaulting to `false`/expanded when absent or unparseable) and writes it in a `useEffect` on every change. This mirrors the "read once, write on change" pattern already used for the accent-color preference read in `App.tsx`'s existing `useEffect`.

**Sidebar stays `fixed`, `<main>` gets a matching left margin.** The sidebar keeps `position: fixed` at every breakpoint (simplest single code path, and already how the mobile overlay works today). At `md:`+, its width is `w-16` (64px, collapsed) or `w-64` (256px, expanded, same as today); below `md:` its width stays `w-64` and visibility is driven by `translate-x` as today. Since a `fixed` element doesn't participate in document flow, `AppShell`'s content wrapper gets a matching `md:ml-16` / `md:ml-64` (synced to the same `collapsed` state) so the page content is pushed rather than covered - both the sidebar's width change and the content's margin change use `transition-[width]`/`transition-[margin]` with the same `duration-200 ease-in-out` already used for the mobile slide, so they move together.
*Alternative considered*: a CSS grid/flex row with the sidebar as a real (non-fixed) column. Rejected for now - it would require every page's outer wrapper to participate in that grid, a larger structural change than the fixed-plus-margin approach for the same visible result.

**Collapsed-state tooltips via the native `title` attribute.** No new dependency, no custom tooltip component - `<NavLink title="Dashboard">` on each link is enough, consistent with this codebase's preference for minimal dependencies (no UI kit is used anywhere else).

**Collapse/expand icon**: `lucide-react`'s `PanelLeftClose` / `PanelLeftOpen` (already the icon family used everywhere else in this app), swapped based on `collapsed`. Verify the exact export names exist in the installed `lucide-react` version during implementation; fall back to `ChevronLeft`/`ChevronRight` if not.

**Mobile overflow bug**: investigate `Dashboard.tsx`'s balance-card/trend-chart layout at genuine mobile widths (375-414px) before assuming a fix is needed - the reported screenshot is suspected to be an artifact of an earlier failed browser-resize test (viewport reported 390px but the page rendered at full desktop width), not a real production bug. Confirm with real mobile emulation first; fix only what's genuinely found.

## Risks / Trade-offs

[Fixed-position sidebar + margin-matching on `<main>` can drift out of sync if a future page forgets the `md:ml-*` class] → Centralize the margin classes in `AppShell`'s content wrapper (not per-page) so no individual page can omit it; pages only control their own inner `max-w-*`/padding.
[`localStorage` unavailable or throws (e.g. private browsing edge cases)] → Wrap the read/write in a try/catch, default to expanded on any failure - matches how the app already treats other client-only preferences defensively.
[Removing each page's own `<Header />` mount touches all 9 protected pages] → Mechanical, low-risk change per page (delete the `<Header />` line and the outer wrapper div, keep the `<main>` as-is); verify each page visually after the change rather than trusting the diff alone.
