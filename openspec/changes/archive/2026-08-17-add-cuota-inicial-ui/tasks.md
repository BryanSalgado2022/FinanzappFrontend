## 1. Types

- [x] 1.1 Add `cuota_inicial: number | null` to `Concepto` in `src/types.ts`
- [x] 1.2 Add `cuota_inicial?: number` to `ConceptoCreateInput` (not `ConceptoUpdateInput` - immutable, no edit flow needs it)

## 2. Creation form

- [x] 2.1 Add `cuotaInicial` state to `NewConceptForm.tsx`
- [x] 2.2 Render a numeric input for it inside the existing amortization block (`tieneAmortizacion` block, near `numeroCuotas`), with helper text explaining what it does and that it's immutable after creation
- [x] 2.3 Wire `cuotaInicial` into the create payload when `tieneAmortizacion` and non-empty

## 3. Concept Detail display

- [x] 3.1 In the `c.cuota_fija !== null` block of `ConceptDetail.tsx`, show the starting installment when `c.cuota_inicial !== null && c.cuota_inicial > 1`
- [x] 3.2 Confirm `cuota_inicial` is not added anywhere in the header edit form (`editingHeader` block) - no task needed beyond not adding it, but verify in step 4

## 4. Verification

- [x] 4.1 Run `npx tsc -b` and confirm no type errors
- [x] 4.2 In the browser: create a debt with amortization terms and a starting installment, confirm it's created and the entries/saldo_restante reflect it (already backend-verified, this confirms the UI round-trip)
- [x] 4.3 In the browser: confirm the starting installment is not shown for a debt without it set, and not shown for debts without amortization at all
- [x] 4.4 In the browser: confirm the starting-installment field does not appear anywhere in the header edit form
- [x] 4.5 Check light/dark mode and mobile width for the new form field and display
- [x] 4.6 Clean up any test concepts created against the real backend during verification
