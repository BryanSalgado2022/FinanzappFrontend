## Why

The sidebar today is a hidden-by-default overlay on every screen size: even on desktop/tablet, where there's ample room for a permanent navigation rail, the user has to open a full-screen drawer just to switch sections. The user wants a ChatGPT-style navigation shell instead — a sidebar that stays visible and pushes the content on wider screens, collapsible to an icon-only rail when they want more room, while mobile keeps the overlay behavior since there's no space there to push content.

## What Changes

- **BREAKING** (spec-level): on screens `md:` (768px) and wider, the sidebar is no longer a hidden-by-default overlay — it is persistent, pushes page content instead of covering it, and can be toggled between an expanded (icons + labels) and collapsed (icons only, with hover tooltips) state by a control inside the sidebar itself.
- The user's collapsed/expanded choice on `md:`+ screens is remembered across reloads (`localStorage`), defaulting to expanded on first use.
- Below `md:` (mobile), the sidebar keeps today's exact behavior: closed by default, opened via the top bar's menu control, overlays the content with a darkened backdrop, and closes via backdrop click, Escape, or navigating.
- The top bar's menu (hamburger) control is only shown below `md:`; from `md:` up it disappears since the sidebar is always visible and has its own collapse/expand control.
- Introduces a shared layout wrapper around every authenticated screen so the top bar and sidebar mount once instead of being duplicated per page, and so the shared collapsed/expanded state can live in one place. This is an internal restructuring with no additional user-facing behavior beyond what's described above.
- Fixes a horizontal-overflow bug on narrow viewports where the Dashboard's balance card and annual trend chart could render wider than the screen (pure bug fix, no requirement change — the existing responsive behavior was already implied, just broken).
- The sidebar's link list also gains the Agenda entry it was already missing from its own spec (the spec drifted out of sync with the shipped `add-agenda` change).

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `app-navigation`: the sidebar's default-closed/overlay-always behavior becomes breakpoint-dependent (persistent + collapsible from `md:` up, unchanged overlay below `md:`); the top bar's menu control becomes conditionally visible; the link list gains Agenda.

## Impact

- `src/components/Sidebar.tsx`: rewritten to support two rendering modes (persistent rail vs. mobile overlay) and a collapsed/expanded state.
- `src/components/Header.tsx`: no longer owns sidebar open/close state; menu control hidden from `md:` up.
- `src/App.tsx`: gains a shared layout wrapper (e.g. `AppShell`) around the protected routes, replacing each page's independent `<Header />` mount.
- Every protected page (`Dashboard.tsx`, `Agenda.tsx`, `ConceptDetail.tsx`, `Deudas.tsx`, `Categorias.tsx`, `Tareas.tsx`, `Deudores.tsx`, `DeudorDetail.tsx`, `Gastos.tsx`): drops its own `<Header />` mount and outer `min-h-svh` wrapper in favor of the shared layout; content margin adjusts to the sidebar's current width on `md:`+.
- `src/pages/Dashboard.tsx` (and any other screen sharing the same overflow pattern): mobile horizontal-overflow fix.
- New `localStorage` key for the sidebar's collapsed/expanded preference.
