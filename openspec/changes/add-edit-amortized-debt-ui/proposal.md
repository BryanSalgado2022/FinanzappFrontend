## Why

Sibling to the backend's `add-edit-amortized-debt`. There's no way from the app to reach the new recalculation endpoint, and the current Concept Detail edit form doesn't offer any control for financial terms at all.

## What Changes

- Add an "Editar términos" control on Concept Detail, shown only for debts that already have amortization terms, opening a form for `valor_total`/`tasa_interes`/`periodo_tasa`/`numero_cuotas` (pre-filled with current values). `cuota_inicial` stays absent from this form — it remains permanently locked.
- Before submitting, show a confirmation explaining the impact: "Esto recalculará tu cuota fija y reemplazará los N meses pendientes que aún no has pagado. Los meses ya pagados no se verán afectados." (`N` computed from the currently-loaded unpaid entry count).

## Capabilities

### Modified Capabilities
- `concept-management`: "Amortization terms are never editable" changes to describe the new dedicated editing path with its confirmation step, replacing the previous flat "never editable" behavior for `valor_total`/tasa/periodo/número de cuotas (`cuota_inicial` remains never-editable, unchanged).

## Impact

- `src/types.ts`: new `ConceptoAmortizacionUpdateInput` type.
- `src/hooks/useConcepts.ts`: new `useUpdateAmortizacion(id)` mutation calling `PUT /concepts/{id}/amortizacion`.
- `src/pages/ConceptDetail.tsx`: new "Editar términos" control + form + confirmation step, shown only when the concept already has amortization terms.
