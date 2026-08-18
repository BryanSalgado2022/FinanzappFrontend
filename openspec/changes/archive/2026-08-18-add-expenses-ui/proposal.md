## Why

The backend's `add-expenses` change (FinanzappBackend) adds `Gasto`, a standalone entity for ad-hoc variable expenses, and makes `GET /summary` account for them. The frontend has no way yet to create, browse, edit, or delete these expenses, so the new balance figure has nothing feeding it.

## What Changes

- Add a "Registrar gasto" quick-entry button on the Dashboard, visually distinct from the existing "+ Nuevo concepto" button, opening a create modal (monto, fecha, descripción, optional categories via the existing `CategoryPicker`).
- Add a "Gastos variables del mes" summary section on the Dashboard showing the current month's most recent expenses.
- Add a dedicated `/gastos` screen (new Header link) listing all expenses with inline-accordion edit and delete, mirroring the Categorías/Tareas list pattern.
- Creating, editing, or deleting an expense invalidates the `summary` query so the Dashboard balance reflects it without a manual reload.
- No category-level aggregation/reporting in this change (backlog).

## Capabilities

### New Capabilities
- `expense-management`: create, browse, edit, and delete ad-hoc variable expenses from the Dashboard and a dedicated screen.

### Modified Capabilities
- `dashboard`: the Dashboard now offers a way to record a variable expense and shows a summary of the current month's variable expenses, and its balance/total-expenses figures reflect them.

## Impact

- New: `src/pages/Gastos.tsx`, `src/components/NewExpenseForm.tsx`, `src/hooks/useGastos.ts`.
- Modified: `src/pages/Dashboard.tsx` (quick-entry button + summary section), `src/components/Header.tsx` (new nav link), `src/App.tsx` (new route), `src/types.ts` (`Gasto`, `GastoCreateInput`, `GastoUpdateInput`).
- Reused as-is: `src/components/CategoryPicker.tsx`, `src/lib/format.ts` (`formatCOP`, `formatFecha`).
