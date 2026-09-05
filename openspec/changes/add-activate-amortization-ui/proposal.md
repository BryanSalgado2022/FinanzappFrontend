## Why

Sibling to the backend's `add-activate-amortization`. There's no UI control anywhere to add amortization terms to a debt concept or debtor that doesn't already have them — the only path was deleting and recreating.

## What Changes

- On Concept Detail, a debt concept with no amortization terms shows an "Agregar términos de amortización" control, opening the same form shell as "Editar términos" (`ConceptDetail.tsx`'s existing amortization form) but wired to the new activation endpoint, with an extra optional "¿ya vas pagando? ¿en qué cuota vas?" field.
- Same on Debtor Detail for a non-amortized debtor.
- The confirmation step's copy adapts to the activation case ("esto generará el cronograma..." instead of "esto recalculará...").

## Capabilities

### Modified Capabilities
- `concept-management`: adds a control to set amortization terms for the first time on a debt concept that doesn't have them.
- `debtor-management`: adds a control to set amortization terms for the first time on a debtor that doesn't have them.

## Impact

- `src/types.ts`: new `ConceptoAmortizacionActivarInput`, `DeudorAmortizacionActivarInput`.
- `src/hooks/useConcepts.ts`: new `useActivarAmortizacion(id)`.
- `src/hooks/useDeudores.ts`: new `useActivarAmortizacionDeudor(id)`.
- `src/pages/ConceptDetail.tsx` / `src/pages/DeudorDetail.tsx`: reuse the existing "Editar términos" form/state, branching on whether the entity already has `cuota_fija` to call activation vs correction.
