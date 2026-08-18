## 1. Types and data layer

- [x] 1.1 Add `Gasto`, `GastoCreateInput`, `GastoUpdateInput` to `src/types.ts` (`Gasto.categorias: Categoria[]`, mirroring `Concepto`)
- [x] 1.2 Create `src/hooks/useGastos.ts`: `useGastos(anio, mes)`, `useGasto(id)`, `useCreateGasto`, `useUpdateGasto`, `useDeleteGasto` — every mutation invalidates both `['gastos']` and `['summary']` on success

## 2. Create-expense form

- [x] 2.1 Create `src/components/NewExpenseForm.tsx`: modal form (monto via `MoneyInput`, fecha, descripción, `CategoryPicker` for optional categories), same overlay/Cancelar/Crear pattern as `NewConceptForm`/`NewTaskForm`/`NewDeudorForm`

## 3. Dedicated expenses screen

- [x] 3.1 Create `src/pages/Gastos.tsx`: list of all expenses (amount, date, description, category emoji/name if assigned), inline-accordion edit (reusing `NewExpenseForm`'s fields inline) and delete, empty state, mirroring `Categorias.tsx`
- [x] 3.2 Add `Gastos` route (`/gastos`) to `src/App.tsx`
- [x] 3.3 Add the Gastos nav link to `src/components/Header.tsx` with a distinct icon, verify mobile icon-only layout still fits with 6 links

## 4. Dashboard integration

- [x] 4.1 Add the "Registrar gasto" quick-entry button to `src/pages/Dashboard.tsx`, visually distinct (icon + label) from "+ Nuevo concepto", opening `NewExpenseForm`
- [x] 4.2 Add the "Gastos variables del mes" summary section to `src/pages/Dashboard.tsx` using `useGastos(anio, mes)`, with an empty state when there are none

## 5. Manual verification

- [x] 5.1 Create an expense with only required fields, confirm it appears in the Dashboard section and `/gastos`, and the balance updates without reload
- [x] 5.2 Create an expense with categories assigned, confirm the emoji/name shows in both listings
- [x] 5.3 Edit and delete an expense from `/gastos`, confirm the Dashboard balance updates accordingly
- [x] 5.4 Confirm the two Dashboard creation buttons are visually distinguishable and both work
- [x] 5.5 Check the 6-link Header in mobile viewport and dark/light mode across both screens
- [x] 5.6 Clean up any test expenses created during verification
