## 1. CSS and presets

- [x] 1.1 In `src/index.css`, replace the hardcoded `--accent-soft` values in `:root` and `.dark` with `color-mix()` formulas derived from `--accent` (light: mixed with `--paper`; dark: mixed with transparent)
- [x] 1.2 Create `src/lib/accentColors.ts`: the 9 presets (`verde`, `azul`, `morado`, `rosa`, `naranja`, `amarillo`, `rojo`, `turquesa`, `gris`), each with a light and dark hex value, matching the backend's `ALLOWED_ACCENT_COLORS` identifiers exactly

## 2. Data layer

- [x] 2.1 Add `UserRead`/`UserUpdateInput` types (with `color_acento: string | null`) to `src/types.ts` - kept separate from the existing `User` type, which is the client-decoded session identity object, not the `/users/me` response shape
- [x] 2.2 Create `src/hooks/useAccentColor.ts`: `useQuery(['users', 'me'])` (enabled only when authenticated) plus a `useUpdateAccentColor` mutation (`PATCH /users/me`) that invalidates the query on success

## 3. Applying the color

- [x] 3.1 In `App.tsx`, add an effect that reads the current `color_acento` from the shared query and sets both `--accent-override-light`/`--accent-override-dark` on `document.documentElement` (index.css's `:root`/`.dark` each reference their own half, so no theme-state coordination is needed in JS), falling back to `verde`'s values when `color_acento` is `null`

## 4. Picker UI

- [x] 4.1 Create `src/components/AccentColorPicker.tsx`: a small popover with 9 swatches, current selection visually marked, closes on backdrop click/Escape/selection (mirrors `Sidebar.tsx`'s overlay pattern, anchored near the trigger instead of full-screen)
- [x] 4.2 Selecting a swatch sets `--accent-override-light`/`-dark` immediately (optimistic) and fires the `PATCH` mutation in the background; show an inline error in the picker if the mutation fails, without reverting the visual change
- [x] 4.3 Add a `Palette`-icon button to `Header.tsx`, next to the existing theme toggle, that opens `AccentColorPicker`

## 5. Manual verification

- [x] 5.1 Confirm opening/closing the picker (button click, backdrop click, Escape, selecting a color)
- [x] 5.2 Select each of the 9 colors one at a time and confirm the whole app's accented elements (active nav link in the Sidebar, buttons, links, summary card) update immediately and remain legible in both light and dark mode
- [x] 5.3 Reload the page after selecting a non-default color and confirm it's still applied (persisted via the backend, not just in-memory)
- [x] 5.4 Confirm the current selection is visually marked when reopening the picker
- [x] 5.5 Check the picker and trigger button in mobile viewport
- [x] 5.6 Reset the account back to a color of your choice (or the default) when done testing, so the account isn't left on an arbitrary test color
