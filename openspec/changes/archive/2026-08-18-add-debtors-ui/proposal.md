## Why

The backend (change `add-debtors`, `FinanzappBackend`) adds a `Deudor` entity (money others owe the user) with partial-payment tracking via `Abono`. This change gives the user a screen to register debtors, see how much each one still owes, and log payments over time — the last of three future-facing ideas noted from a reference app, completing the set alongside the already-shipped Categorías and Tareas.

## What Changes

- Add a new "Deudores" screen (`/deudores`, fifth link in `Header.tsx`): three summary cards computed client-side from the debtor list (total owed, number of active debtors, number with collateral), and a list of debtors linking to their detail page.
- Add a creation modal (nombre, monto_total, fecha, garantia) mirroring `NewConceptForm.tsx`'s/`NewTaskForm.tsx`'s pattern.
- Add a `/deudores/:id` detail screen mirroring `ConceptDetail.tsx`'s structure: a header with a `ProgressRing` showing percent repaid, inline-editable fields, "Marcar como terminado"/"Eliminar" actions, and below it a simple always-visible "registrar abono" form plus a list of recorded abonos (each deletable).
- No integration with the Dashboard or any other screen — Deudores is fully standalone, like Categorías and Tareas.

## Capabilities

### New Capabilities
- `debtor-management`: the `/deudores` list screen and `/deudores/:id` detail screen for creating, editing, closing, and deleting debtors, and for recording/deleting their abonos.

## Impact

- Frontend only: `src/types.ts`, `src/hooks/useDeudores.ts` (new), `src/components/Header.tsx`, `src/App.tsx`, `src/pages/Deudores.tsx` (new), `src/pages/DeudorDetail.tsx` (new), `src/components/NewDeudorForm.tsx` (new, modal).
- Depends on the backend change `add-debtors` (`FinanzappBackend`) being implemented and deployed first — this change only consumes that API, it does not modify it.
- No changes to any existing screen or capability.
