## Context

See proposal.md - Why. `Header.tsx` today renders logo + horizontal `<nav>` (6 `NavLink`s, text hidden below `sm`) + user actions, and is mounted as the first child on all 8 authenticated screens (`Dashboard`, `Deudas`, `ConceptDetail`, `Categorias`, `Tareas`, `Deudores`, `DeudorDetail`, `Gastos`). The app's existing overlay pattern (`fixed inset-0 z-10 bg-ink/50 backdrop-blur-sm`) is used by every "New X" modal form.

## Goals / Non-Goals

**Goals:**
- Move the 6 nav links into a sidebar without touching any of the 8 page components.
- Reuse the existing overlay visual language instead of inventing a new one.

**Non-Goals:**
- Any change to which sections exist or their icons/labels/order.
- Any change to the user-actions area (name, theme, sign out) beyond leaving it in place.
- Persisting sidebar state (explicitly ruled out in grilling).

## Decisions

**`Sidebar.tsx` is a new component owning its own open/closed state, rendered from `Header.tsx`.** `Header` holds a single `useState<boolean>` for `sidebarOpen` and passes `open`/`onClose` to `<Sidebar>`; the hamburger button in `Header` calls `setSidebarOpen(true)`. This keeps the state colocated with the one control that opens it, avoids a new context/global-state layer for a single boolean, and matches how every existing "New X" modal already manages its own `show*` boolean in the parent page.

**Panel anchors to the left, backdrop covers the full viewport.** Left-anchoring matches the hamburger's position (top-left, same side as the logo) and is the universal convention for this pattern, so the slide direction is unsurprising. Structure: `<div className="fixed inset-0 z-20 ...">` (backdrop, `onClick` closes) wrapping a `<nav>` panel that stops propagation on click, positioned `fixed inset-y-0 left-0` with `translate-x-0` (open) / `-translate-x-full` (closed) and `transition-transform duration-200 ease-in-out`. `z-20` sits above the existing modals' `z-10` is unnecessary here since the sidebar and modals are never open simultaneously in normal use - z-10 is fine and kept consistent with the established overlay pattern rather than introducing a new stacking value.

**Escape-to-close via a `keydown` listener scoped to the open state.** A `useEffect` in `Sidebar` adds a `document` `keydown` listener only while `open` is true (added on open, removed on close/unmount) - avoids a permanently-attached global listener when the sidebar is never opened.

**Mounting**: `Sidebar` always renders in the tree (not conditionally mounted like the "New X" modals) so the closed→open transition can animate; visibility is purely via the `translate-x` class plus `pointer-events-none`/backdrop opacity 0 when closed, matching how a slide-in panel must stay mounted to transition instead of popping in.

**`navLinkClass` is duplicated (not shared) between `Header`'s removed nav and `Sidebar`'s new one.** Since `Header`'s horizontal nav is being deleted entirely, there's nothing left to share the helper with - `Sidebar` defines its own small `sidebarLinkClass` styled for a stacked vertical list (full-width row, left-aligned icon+label) rather than the pill-shaped horizontal one being removed.

## Risks / Trade-offs

- [Always-mounted `Sidebar` runs its Escape-listener effect logic on every screen even when closed] → Negligible cost: the effect body is a no-op (early return) unless `open` is true, so no listener is ever attached unless the sidebar is open.
- [Removing mobile icon-only collapsing changes the horizontal-nav muscle memory for nothing, since it's being replaced anyway] → Intentional per grilling: full labels are always shown once space is no longer constrained by an inline row.
