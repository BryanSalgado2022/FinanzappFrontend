## 1. AddMenu

- [x] 1.1 Remove the "Ingreso" option from `src/components/AddMenu.tsx`'s options array.

## 2. Dashboard

- [x] 2.1 In `src/pages/Dashboard.tsx`, add a second button "+ Agregar ingreso" next to the existing "+ Agregar" button, calling `setNewConceptTipo('ingreso'); setShowNewConcept(true)` directly (no menu).
- [x] 2.2 Rename the remaining button's label to "+ Agregar gasto" (still opens `AddMenu` with Deuda/Pago mensual/Gasto puntual).

## 3. Agenda

- [x] 3.1 In `src/pages/Agenda.tsx`'s per-day quick-entry section, mirror the same two-button split ("+ Agregar ingreso" direct, "+ Agregar gasto" opens the menu with Deuda/Pago mensual/Gasto puntual/Tarea).

## 4. Verification

- [x] 4.1 Run `npx tsc -b` to confirm no type errors.
- [x] 4.2 Manually verify in-browser: Dashboard shows two buttons; "+ Agregar ingreso" opens the income form directly; "+ Agregar gasto" still opens the existing 3-option menu without Ingreso listed. Same check on Agenda's per-day quick-entry, confirming Tarea still appears in the gasto menu there.
