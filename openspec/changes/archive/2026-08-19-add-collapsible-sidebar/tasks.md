## 1. Sidebar rewrite

- [x] 1.1 Add the Agenda link (and its `CalendarDays` icon) to the sidebar's link list if not already exact - confirm all 7 links: Dashboard, Agenda, Deudas, Categorías, Tareas, Deudores, Gastos
- [x] 1.2 `Sidebar.tsx`: accept new props for the two states - `mobileOpen`/`onCloseMobile` (existing overlay behavior, unchanged below `md:`) and `collapsed`/`onToggleCollapsed` (new, `md:`+ only)
- [x] 1.3 Below `md:`: keep exact current behavior (backdrop, Escape, click-outside, close-on-navigate, `w-64`, translate-x slide)
- [x] 1.4 From `md:` up: render persistently (no backdrop, no open/close), width `md:w-16` when collapsed / `md:w-64` when expanded, with `transition-[width] duration-200 ease-in-out`
- [x] 1.5 Add a collapse/expand control inside the sidebar (top, near the logo area) using `PanelLeftClose`/`PanelLeftOpen` from `lucide-react` (fall back to `ChevronLeft`/`ChevronRight` if those exports don't exist in the installed version)
- [x] 1.6 When collapsed, hide link text labels and add a `title` attribute with the section name to each link for a native hover tooltip
- [x] 1.7 `npx tsc --noEmit` clean

## 2. Shared layout (AppShell)

- [x] 2.1 Create `src/components/AppShell.tsx`: owns `collapsed` (lazy-init from `localStorage["finanzapp.sidebarCollapsed"]`, default `false`, try/catch around read/write, persisted via `useEffect`) and `mobileOpen` (plain `useState(false)`, not persisted)
- [x] 2.2 `AppShell` renders `<div className="min-h-svh bg-paper">` once, containing `<Header />` (passing the mobile-open control), `<Sidebar />` (passing both state pairs), and a content wrapper with `md:ml-16`/`md:ml-64` (matching `collapsed`) and the same transition duration as the sidebar, wrapping `<Outlet />`
- [x] 2.3 `npx tsc --noEmit` clean

## 3. Header adjustment

- [x] 3.1 `Header.tsx`: remove its local `sidebarOpen` state and its own `<Sidebar />` mount; accept an `onOpenMobileSidebar` prop instead, wired to the hamburger button
- [x] 3.2 Hide the hamburger button from `md:` up (`md:hidden` or equivalent) since the sidebar is always visible there
- [x] 3.3 `npx tsc --noEmit` clean

## 4. Route wiring

- [x] 4.1 `App.tsx`: add a nested `<Route element={<AppShell />}>` inside the existing `<Route element={<RequireAuth />}>`, moving all 9 protected page routes under it
- [x] 4.2 `npx tsc --noEmit` clean

## 5. Per-page migration

- [x] 5.1 `Dashboard.tsx`: drop its own `<Header />` mount and outer `min-h-svh bg-paper` wrapper div, keep its `<main className="mx-auto max-w-xl ... lg:max-w-6xl">` as the top-level returned element
- [x] 5.2 `Agenda.tsx`: same removal, keep its `lg:max-w-3xl` `<main>`
- [x] 5.3 `ConceptDetail.tsx`: same removal, keep its own `<main>` width
- [x] 5.4 `Deudas.tsx`: same removal, keep its own `<main>` width
- [x] 5.5 `Categorias.tsx`: same removal, keep its own `<main>` width
- [x] 5.6 `Tareas.tsx`: same removal, keep its own `<main>` width
- [x] 5.7 `Deudores.tsx`: same removal, keep its own `<main>` width
- [x] 5.8 `DeudorDetail.tsx`: same removal, keep its own `<main>` width
- [x] 5.9 `Gastos.tsx`: same removal, keep its own `<main>` width
- [x] 5.10 `npx tsc --noEmit` clean after all 9 pages

## 6. Mobile overflow investigation

- [x] 6.1 Load the Dashboard in the browser at genuine mobile widths (375px, 390px, 414px) via correctly-configured viewport emulation (not window resize, which was unreliable in a prior session) and check for horizontal overflow on the balance card / annual trend chart
- [x] 6.2 If a genuine overflow is found, identify its source (e.g. a fixed-width element, missing `min-w-0` on a flex/grid child) and fix it; if not found, note in the PR/commit that the reported screenshot was confirmed to be a stale test artifact, not a real bug, and make no unnecessary change

## 7. Manual verification

- [x] 7.1 Mobile (< md:): sidebar behaves exactly as before - closed by default, hamburger opens it, backdrop/Escape/navigation all close it, no persistence across reload
- [x] 7.2 Tablet/desktop (md: and wider): sidebar is visible without opening it, starts expanded on first-ever load, hamburger control is not shown in the top bar
- [x] 7.3 Collapse the sidebar via its own control: rail narrows to icons only, page content shifts left to fill the freed space, hovering an icon shows its label as a tooltip
- [x] 7.4 Expand it back: rail widens to icons + labels, content shifts back
- [x] 7.5 Reload the page at md:+ after collapsing: sidebar restores collapsed; reload after expanding: restores expanded
- [x] 7.6 Navigate between sections at md:+: active link is distinguished, collapsed/expanded state is unchanged by navigation
- [x] 7.7 Resize across the md: breakpoint while the sidebar is open on mobile: confirm no broken intermediate state
- [x] 7.8 Confirm all 7 links (incl. Agenda) are present and correct in both collapsed and expanded states
- [x] 7.9 Check dark and light mode for the sidebar, top bar, and content offset
- [x] 7.10 Confirm the mobile overflow fix (or lack thereof, per 6.2) at real mobile widths
