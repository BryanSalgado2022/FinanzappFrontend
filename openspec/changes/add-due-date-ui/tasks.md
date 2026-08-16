## 1. Types

- [x] 1.1 Add `dia_vencimiento: number | null` to `Concepto` in `src/types.ts`
- [x] 1.2 Add `dia_vencimiento?: number` to `ConceptoCreateInput`
- [x] 1.3 Add `dia_vencimiento?: number` to `ConceptoUpdateInput`
- [x] 1.4 Add `vencida: boolean` to `EntradaMensual`

## 2. Creation form

- [x] 2.1 Add `diaVencimiento` state and a `puedeTenerDiaVencimiento` gate (`tipo === 'deuda' || tipo === 'gasto_fijo'`) to `NewConceptForm.tsx`
- [x] 2.2 Render the due-day input (plain numeric input, shared `inputClass`, helper text noting the 1-28 range and that it's optional) when `puedeTenerDiaVencimiento`
- [x] 2.3 Wire `diaVencimiento` into the create payload, parsed to a number when non-empty

## 3. Concept Detail header

- [x] 3.1 Add a due-day input to `ConceptDetail.tsx`'s header edit form, always enabled (no lock for amortized debts)
- [x] 3.2 Wire the edit form's save action to include `dia_vencimiento` in the `updateConcept.mutate(...)` call
- [x] 3.3 Add a read-only display block for `dia_vencimiento` (e.g. "Vence el día X") next to the existing `cuota_fija`/`duracion_meses` blocks, shown only when set

## 4. Overdue entry highlighting

- [x] 4.1 Add the `vencida` branch to `MonthEntryRow.tsx`'s `Node` component per design.md, using `border-danger`/`bg-danger-soft`/`ring-danger-soft` and an `AlertTriangle` icon
- [x] 4.2 Import `AlertTriangle` from `lucide-react` in `MonthEntryRow.tsx`

## 5. Verification

- [x] 5.1 Run `npx tsc -b` and confirm no type errors
- [x] 5.2 In the browser: create a `deuda` with a due day, confirm it saves and displays
- [x] 5.3 In the browser: edit the due day on an existing amortized debt, confirm it's accepted
- [x] 5.4 In the browser: verify an `ingreso` concept's creation form has no due-day field
- [x] 5.5 In the browser: use the backend to mark an entry overdue (past due date, unpaid) and confirm the `Node` shows the new overdue treatment, distinct from a merely-pending entry, in both light and dark mode
