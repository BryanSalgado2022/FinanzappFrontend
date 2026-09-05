## 1. Types and data

- [x] 1.1 Add `ConceptoAmortizacionUpdateInput { valor_total: string; tasa_interes: string; periodo_tasa: PeriodoTasa; numero_cuotas: number }` to `src/types.ts`.
- [x] 1.2 Add `useUpdateAmortizacion(id: number)` to `src/hooks/useConcepts.ts`: `PUT /concepts/${id}/amortizacion`, invalidating the same keys as `useUpdateConcept` plus entries (`['concepts', id, 'entries']`) and `['summary']` since the schedule changes.

## 2. UI

- [x] 2.1 In `src/pages/ConceptDetail.tsx`, add an "Editar términos" control (near the existing "Editar" button, shown only when `c.tasa_interes !== null && c.numero_cuotas !== null`), opening a form pre-filled with `valor_total`/`tasa_interes`/`periodo_tasa`/`numero_cuotas` (reusing `MoneyInput` and the same tasa-sanitizing pattern as `NewConceptForm.tsx`).
- [x] 2.2 Add the confirmation step before submitting: count unpaid entries from the already-loaded `entries.data`, show "Esto recalculará tu cuota fija y reemplazará los N meses pendientes que aún no has pagado. Los meses ya pagados no se verán afectados." with Confirmar/Cancelar.
- [x] 2.3 On confirm, call `useUpdateAmortizacion(id).mutate(...)`; show the backend's rejection message inline on error (e.g. reducing `numero_cuotas` below what's paid).

## 3. Verification

- [x] 3.1 Run `npx tsc -b` to confirm no type errors.
- [x] 3.2 Manually verify in-browser (backend change deployed/running locally): "Editar términos" only appears on amortized debts; form pre-fills current values; confirmation shows the correct unpaid-month count; submitting recalculates and the entry list reflects the new schedule while paid months stay untouched; submitting an invalid `numero_cuotas` shows the backend's error.
