## 1. Contributor list logic

- [x] 1.1 Create `src/components/MonthlyBalanceBreakdown.tsx` accepting the already-loaded concepts (with `EntradaMensual` entries) and gastos for the selected month.
- [x] 1.2 Build the merged contributor list: for each concept with a defined entry, use `monto_pagado` if `pagado`, else `monto_planeado`, classified as income (`tipo === 'ingreso'`) or expense (`deuda`/`gasto_fijo`); for each gasto, always expense, amount = `monto`. Exclude concepts with no entry for the month. Sort the merged list by amount descending.
- [x] 1.3 Render the list with a visual tag distinguishing income vs. expense rows (reuse existing color/style conventions from the summary cards).
- [x] 1.4 Render an empty state when the merged list has zero items.

## 2. Wiring into the Dashboard

- [x] 2.1 Make the "BALANCE DEL MES" card in `src/pages/Dashboard.tsx` clickable (button/role, keyboard-accessible), opening `MonthlyBalanceBreakdown` in a modal (same modal pattern as the existing creation forms).
- [x] 2.2 Wire concept rows to navigate to `/concepts/:id`.
- [x] 2.3 Wire gasto rows to navigate to `/gastos`.

## 3. Verification

- [x] 3.1 Run `npx tsc -b` to confirm no type errors.
- [x] 3.2 Manually verify in-browser: clicking the balance card opens the breakdown for the currently selected month; list is sorted correctly and matches the sum shown on the summary cards; clicking a concept row navigates to its detail page; clicking a gasto row navigates to /gastos; changing the Dashboard's month and reopening the breakdown reflects the new month; a month with no data shows the empty state.
