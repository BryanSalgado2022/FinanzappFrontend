## Why

The top navigation bar now carries 6 links (Dashboard, Deudas, Categorías, Tareas, Deudores, Gastos) plus the logo and user actions, and the user finds it too crowded. They chose, among three options, to replace the horizontal nav with a hidden-by-default collapsible sidebar opened via a hamburger button.

## What Changes

- The 6 navigation links move out of the horizontal `<nav>` in `Header.tsx` into a new slide-in sidebar panel, closed by default.
- `Header.tsx` becomes a thin top bar: logo (link to `/`) + a hamburger button on the left to open the sidebar, and the existing user actions (name, theme toggle, sign out) unchanged on the right.
- The sidebar opens as a full-screen overlay (dark backdrop, reusing the app's existing modal overlay pattern), closes on backdrop click, Escape, or clicking any nav link inside it, and never persists its open/closed state across page loads.
- **BREAKING** (internal, not user-facing): the horizontal nav markup and its mobile icon-only collapsing behavior are removed entirely, replaced by the sidebar's always-visible-text vertical list.

## Capabilities

### New Capabilities
- `app-navigation`: the global navigation shell (top bar + sidebar) shared by every authenticated screen - how the user gets from one section of the app to another.

### Modified Capabilities
(none - no existing capability spec documents the Header/nav shell; each screen's own spec only references "a Header link exists," which remains true and unchanged)

## Impact

- Modified: `src/components/Header.tsx` (simplified to top bar + hamburger).
- New: `src/components/Sidebar.tsx` (the slide-in panel with the 6 nav links).
- No changes to any page component - every screen already renders `<Header />` as its first child, so this is fully contained within the nav components.
- No backend changes.
