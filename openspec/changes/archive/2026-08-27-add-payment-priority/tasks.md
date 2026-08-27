## 1. Priority computation

- [x] 1.1 Create `src/lib/paymentPriority.ts`: a `PriorityEntry` type (concepto id/nombre/tipo, anio, mes, monto_planeado, dueDate, level: 'alta'|'media'|'baja') and a `computePaymentPriority(rows: DashboardConceptRow[], today: Date): PriorityEntry[]` function per design.md's algorithm (filter deuda/gasto_fijo + unpaid + has due day, classify alta/media/baja, sort by due date ascending).

## 2. Dashboard card

- [x] 2.1 Create `src/components/PaymentPriorityCard.tsx`: renders the top `PriorityEntry` (name, amount, priority badge, due-status text e.g. "atrasado · 18 ago" / "vence en 3 días"), empty state when there are none, and a "Ver todas" control (hidden when empty).
- [x] 2.2 Add the one-click "Pagar mes" button using `useUpsertEntry(topEntry.conceptoId)` per design.md, submitting the planned amount as paid.
- [x] 2.3 Make the card's name/amount clickable, navigating to `/concepts/:id`.
- [x] 2.4 Mount `PaymentPriorityCard` in `src/pages/Dashboard.tsx`, above the "Gastos variables del mes" section, passing it the full `rows` from `useDashboardConcepts` (not filtered to the selected month).

## 3. "Ver todas" list

- [x] 3.1 Create `src/components/PaymentPriorityList.tsx` (modal, following `MonthlyBalanceBreakdown.tsx`'s pattern): lists every `PriorityEntry`, each row showing name, amount, priority badge, due-status text, clickable to `/concepts/:id`.
- [x] 3.2 Wire "Ver todas" on `PaymentPriorityCard` to open this modal.

## 4. Verification

- [x] 4.1 Run `npx tsc -b` to confirm no type errors.
- [x] 4.2 Manually verify in-browser: create/edit concepts with due days in the past, within 5 days, and further out, confirm Alta/Media/Baja classification and sort order match; confirm the card stays the same entry when navigating the Dashboard to a different month; confirm "Pagar mes" marks the entry paid and the card advances to the next most urgent one; confirm "Ver todas" shows the full ranked list and each row navigates correctly; confirm the empty state when nothing qualifies.
