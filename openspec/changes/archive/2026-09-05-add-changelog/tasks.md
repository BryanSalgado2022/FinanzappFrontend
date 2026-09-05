## 1. Data and seen-tracking

- [x] 1.1 Create `src/data/changelog.ts`: `ChangelogEntry { id: string; date: string; title: string; description: string }` and an exported array, sorted newest first. Seed with entries for: landing page, prioridad de pago, desglose del balance mensual, botones separados de ingreso/gasto, interés en abonos, ahorros como tarjeta propia.
- [x] 1.2 Create `src/hooks/useChangelogSeen.ts`: reads/writes the last-seen entry id to `localStorage` (key e.g. `tobe.changelogSeen`), exposing `hasUnseen: boolean` (newest entry id !== stored id) and `markSeen(): void`.

## 2. UI

- [x] 2.1 Create `src/components/ChangelogPanel.tsx`: dropdown/panel (matching `AccentColorPicker`'s open/close/outside-click/Escape pattern) listing entries with title, date, description.
- [x] 2.2 Add the Header indicator button (icon + conditional dot) that toggles the panel and calls `markSeen()` on open.
- [x] 2.3 Mount in `src/components/Header.tsx` alongside the existing accent-color/theme controls.

## 3. Verification

- [x] 3.1 Run `npx tsc -b` to confirm no type errors.
- [x] 3.2 Manually verify in-browser: indicator shows on first load (unseen entries exist); opening the panel shows all entries newest-first and clears the indicator; reloading keeps it cleared; closing via outside-click/Escape works; dark and light theme both look right.
