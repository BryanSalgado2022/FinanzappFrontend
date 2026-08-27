## Why

Users reported it isn't obvious where to add income — today "Ingreso" is buried as the 4th option inside the same "+ Agregar" dropdown as Deuda, Pago mensual, and Gasto puntual, indistinguishable from the others until opened.

## What Changes

- Replace the single "+ Agregar" button (Dashboard, and Agenda's per-day quick-entry) with two buttons: "+ Agregar ingreso" (opens the income concept form directly, no menu) and "+ Agregar gasto" (opens the existing dropdown with Deuda/Pago mensual/Gasto puntual, plus Tarea in Agenda).
- No change to any of the underlying creation forms — only how they're reached.

## Capabilities

### Modified Capabilities
- `dashboard`: the concept/expense creation entry point splits into two buttons instead of one dropdown covering all four options.
- `agenda`: "Quick-entry from a calendar day" splits the same way.

## Impact

- `src/components/AddMenu.tsx`: drops the "Ingreso" option (now handled by its own button, no menu needed for a single choice).
- `src/pages/Dashboard.tsx` and `src/pages/Agenda.tsx`: render two buttons instead of one, each wired to the same existing `NewConceptForm`/`NewExpenseForm`/`NewTaskForm` — "+ Agregar ingreso" opens `NewConceptForm` with `initialTipo="ingreso"` directly.
- No backend changes.
