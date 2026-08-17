## Why

FinanzappBackend now supports `cuota_inicial` (a starting installment number) for debts with amortization, so a debt the user already had before adopting the app can skip the installments already paid outside the system - but the frontend has no way to set or see it.

## What Changes

- The debt-creation form gains an optional starting-installment input inside the existing amortization block, with helper text making clear it's immutable after creation.
- Concept Detail's amortization display shows the starting installment when it's set to something other than 1, making it visible that this debt didn't start from scratch.
- `cuota_inicial` never appears in any edit form - it's set-once, view-only afterward, consistent with the backend always rejecting attempts to change it.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `dashboard`: the debt-creation form gains an optional starting-installment field.
- `concept-management`: the amortization display shows the starting installment when set.

## Impact

- `src/types.ts`: `Concepto` gains `cuota_inicial`; `ConceptoCreateInput` gains `cuota_inicial`.
- `src/components/NewConceptForm.tsx`: new input in the amortization block.
- `src/pages/ConceptDetail.tsx`: amortization display shows the starting installment when relevant.
