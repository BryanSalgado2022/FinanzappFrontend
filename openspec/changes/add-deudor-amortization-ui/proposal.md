## Why

Sibling to the backend's `add-deudor-amortization`. There's no way from the app to set a debtor's amortization terms, view its generated installment schedule, mark installments paid, or correct its terms later — the Deudores creation form and detail screen only know about the plain `monto_total`/`Abono` flow.

## What Changes

- Add the amortization fields (tasa_interes/periodo_tasa/numero_cuotas/cuota_inicial) to the "Nuevo deudor" creation form, mirroring `NewConceptForm.tsx`'s deuda block — unconditionally shown, since every debtor is inherently a debt (no type-gate needed, unlike concepts).
- On Debtor Detail, show a cuota_fija/tasa/numero_cuotas summary with an "Editar términos" control when the debtor is amortized, mirroring `ConceptDetail.tsx`'s recalculation UI exactly (same confirm-before-submit flow, same inline error handling).
- Replace the "Registrar abono" form and abono history with a "Cronograma de pagos" list when the debtor is amortized: each scheduled installment shown with its period, planned amount, and paid state, with an inline action to mark it paid or unpaid. Non-amortized debtors are entirely unaffected — the existing abono UI stays untouched.

## Capabilities

### Modified Capabilities
- `debtor-management`: adds amortized debtors to debtor creation and the detail screen (amortization terms at creation, installment schedule display, marking installments paid/unpaid, correcting terms later), alongside the existing non-amortized create/edit/abono behavior, which is unchanged.

## Impact

- `src/types.ts`: `Deudor`/`DeudorCreateInput` gain amortization fields; new `DeudorAmortizacionUpdateInput`, `CuotaDeudor`, `CuotaDeudorUpdateInput` types.
- `src/hooks/useDeudores.ts`: new `useCuotasDeudor(deudorId)`, `useMarkCuota(deudorId)`, `useUpdateAmortizacionDeudor(id)`.
- `src/components/NewDeudorForm.tsx`: new amortization fields block.
- `src/pages/DeudorDetail.tsx`: new amortization summary + "Editar términos" control + "Cronograma de pagos" list, shown only for amortized debtors.
- Out of scope: recording a paid installment's actual amount (only the default-to-planned amount is supported when marking paid in this pass) — a possible follow-up, not a gap.
