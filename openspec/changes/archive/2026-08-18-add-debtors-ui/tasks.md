## 1. Types and data layer

- [x] 1.1 In `src/types.ts`: add `Deudor { id: number; nombre: string; monto_total: string; fecha: string; garantia: string | null; activo: boolean; saldo_restante: string }`, `DeudorCreateInput { nombre: string; monto_total: string; fecha: string; garantia?: string }`, `DeudorUpdateInput { nombre?: string; monto_total?: string; fecha?: string; garantia?: string; activo?: boolean }`, `Abono { id: number; monto: string; fecha: string }`, `AbonoCreateInput { monto: string; fecha: string }`
- [x] 1.2 Create `src/hooks/useDeudores.ts`: `useDeudores()` (list), `useDeudor(id)` (get one), `useCreateDeudor()`, `useUpdateDeudor(id)`, `useDeleteDeudor(id)`, `useAbonos(deudorId)`, `useCreateAbono(deudorId)`, `useDeleteAbono(deudorId, abonoId)` — mutations invalidate the relevant query keys on success, mirroring `useConcepts.ts`'s/`useEntries.ts`'s shape (deudor mutations invalidate the deudores list + that deudor; abono mutations invalidate that deudor's abonos list + the deudor itself, since its `saldo_restante` changes)

## 2. Creation modal

- [x] 2.1 Create `src/components/NewDeudorForm.tsx`: modal (overlay + form, mirroring `NewConceptForm.tsx`'s/`NewTaskForm.tsx`'s shell) with nombre, monto_total (`MoneyInput`), fecha (`<input type="date">`), garantia (optional text input), Cancelar/Crear buttons

## 3. Deudores list screen

- [x] 3.1 Add "Deudores" `NavLink` to `Header.tsx` (fifth link, same pattern/icon style as the existing four)
- [x] 3.2 Add `/deudores` route in `App.tsx` inside the authenticated route group
- [x] 3.3 Create `src/pages/Deudores.tsx`: computes the three summary figures client-side from `useDeudores()`'s active debtors (total saldo_restante, count, count with garantia), renders them as cards (mirroring `Deudas.tsx`'s summary card style), a "+ Añadir deudor" button opening `NewDeudorForm`, and a list of debtors (nombre, saldo_restante, garantia indicator) each linking to `/deudores/:id`

## 4. Deudor detail screen

- [x] 4.1 Add `/deudores/:id` route in `App.tsx`
- [x] 4.2 Create `src/pages/DeudorDetail.tsx`: header card mirroring `ConceptDetail.tsx`'s structure — `ProgressRing` with percent repaid `(monto_total - saldo_restante) / monto_total * 100`, saldo_restante prominently displayed, monto_total/fecha/garantia shown below, `editingHeader` inline-edit state for nombre/monto_total/fecha/garantia with Cancelar/Guardar, "Marcar como terminado" (sets `activo: false`) and "Eliminar" (deletes the debtor and navigates back to `/deudores`) actions matching `ConceptDetail.tsx`'s pattern/icons/styling
- [x] 4.3 Below the header, add an always-visible "Registrar abono" form (monto via `MoneyInput`, fecha via `<input type="date">`, submit button) that calls `useCreateAbono`
- [x] 4.4 Below the abono form, render the abono history list (fecha + monto per row, most-recent-first, each with a delete button) sourced from `useAbonos(id)`

## 5. Manual verification in the browser

- [x] 5.1 Create a debtor with required fields only; confirm it appears in the list with its full monto_total as saldo_restante and the summary cards update
- [x] 5.2 Create a debtor with garantia; confirm the "con garantía" summary count increases
- [x] 5.3 Open a debtor's detail, record two abonos, confirm the progress ring and saldo_restante update without a manual reload, and confirm the Deudores list's total-owed summary reflects it when navigating back
- [x] 5.4 Delete one abono; confirm the balance is restored correctly
- [x] 5.5 Edit a debtor's fields via the inline header edit; confirm they persist
- [x] 5.6 Mark a debtor as terminado while it still has a balance; confirm it disappears from the summary counts but the debtor itself (if navigated to directly) still shows its history
- [x] 5.7 Delete a debtor; confirm it and its abono history are gone
- [x] 5.8 Confirm the Header's 5 links still look correct on a mobile viewport, and that both screens render correctly in light/dark mode
- [x] 5.9 Clean up any test debtors/abonos created during verification so no orphaned test data remains in the real account
