## 1. Sidebar component

- [x] 1.1 Create `src/components/Sidebar.tsx`: accepts `open`/`onClose` props, always mounted, backdrop + left-anchored sliding panel via `translate-x` + `transition-transform`, backdrop click and Escape both call `onClose`
- [x] 1.2 Move the 6 `NavLink`s (Dashboard, Deudas, Categorías, Tareas, Deudores, Gastos) with their icons into `Sidebar.tsx`, full text label always visible, active-state styling adapted to a vertical list
- [x] 1.3 Each link click calls `onClose` in addition to navigating

## 2. Header simplification

- [x] 2.1 Remove the horizontal `<nav>` and its 6 `NavLink`s from `Header.tsx`
- [x] 2.2 Add a hamburger button (`Menu` icon from `lucide-react`) to `Header.tsx` that opens the sidebar; add local `sidebarOpen` state and render `<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />`
- [x] 2.3 Keep the logo, user's name, theme toggle, and sign-out button unchanged in the top bar

## 3. Manual verification

- [x] 3.1 Confirm the sidebar is closed on initial load on every screen, opens via the hamburger, and shows all 6 links with full text
- [x] 3.2 Confirm closing via backdrop click, Escape, and clicking a nav link (which also navigates)
- [x] 3.3 Confirm the active link is visually distinguished when the sidebar is opened on that section
- [x] 3.4 Confirm reloading the page always shows the sidebar closed, even if it was left open before reload
- [x] 3.5 Check the top bar and sidebar in mobile viewport and dark/light mode across a few different screens
