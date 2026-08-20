## Why

The Dashboard shows the selected month's net balance as a single number, but gives no way to see what drove it. When the balance is negative, the user has no quick way to see which concepts or expenses contributed most, without manually checking each one.

## What Changes

- Make the "BALANCE DEL MES" card clickable, opening a modal with a breakdown of the selected month.
- The breakdown lists every contributor to that month's balance — each concept's entry and each variable expense — in a single list sorted by amount descending, visually separating income from expenses.
- Each row is clickable: a concept row navigates to its Concept Detail page; a variable expense row navigates to the Gastos screen, where editing it is already possible (no reusable edit-expense modal exists today — expense editing is inline within the Gastos page, not extracted here).
- Scope is the currently selected month only (matches what the balance card already shows); an annual view is explicitly out of scope for this change.

## Capabilities

### Modified Capabilities
- `dashboard`: "Monthly summary cards" gains a detail breakdown accessible from the balance card.

## Impact

- `src/pages/Dashboard.tsx`: make the balance card clickable, mount the new breakdown modal.
- New component (e.g. `src/components/MonthlyBalanceBreakdown.tsx`): renders the sorted contributor list from data already loaded by `useDashboardConcepts`/`useGastos` — no new backend endpoint.
