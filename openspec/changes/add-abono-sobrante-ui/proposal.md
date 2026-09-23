## Why

Sibling to the backend's `add-abono-sobrante`. `PATCH /deudores/{id}/cuotas/{anio}/{mes}` and `PUT /concepts/{id}/entries/{anio}/{mes}` now accept an optional `abono_capital_modo`: when the amount paid exceeds the planned amount and a modo is given, the surplus is routed into a principal prepayment in the same request. There's no UI for it yet — worse, `CuotaRow` in `DeudorDetail.tsx` doesn't even let you enter a custom paid amount at all today (just a blind "Marcar pagado" toggle).

## What Changes

- `CuotaRow` (`DeudorDetail.tsx`) becomes an expandable row with an editable monto field, mirroring the pattern `MonthEntryRow.tsx` already uses for Concepto's entries.
- When the entered amount exceeds the cuota's planned amount, an inline "Reducir plazo"/"Reducir cuota" toggle appears (defaulting to "Reducir cuota"); saving sends `abono_capital_modo` alongside the amount.
- `MonthEntryRow.tsx` gains the same inline surplus toggle, shown only when the entry belongs to an amortized debt (`tipo === 'deuda' && cuota_fija !== null`) — `gasto_fijo`/`ingreso` rows and non-amortized debts are visually and behaviorally unchanged.
- No extra confirmation step in either case — picking a modo and pressing "Guardar" applies directly (unlike the standalone "Abono a capital" form, which keeps its own two-step confirm).
- Concepto gets no standalone "abono a capital" button or history list — only this inline surplus detection.

## Capabilities

### Modified Capabilities
- `debtor-management`: adds routing a payment surplus into a principal prepayment when marking an installment paid.
- `concept-management`: adds routing a payment surplus into a principal prepayment when marking a monthly entry paid, for amortized debts.

## Impact

- `src/types.ts`: `CuotaDeudorUpdateInput` and `EntradaMensualInput` gain `abono_capital_modo?: ModoAbonoCapital`.
- `src/pages/DeudorDetail.tsx`: `CuotaRow` becomes stateful/expandable (mirrors `MonthEntryRow`'s self-contained editing pattern).
- `src/components/MonthEntryRow.tsx`: new `esAmortizada: boolean` prop gating the new surplus toggle.
- `src/pages/ConceptDetail.tsx`: passes `esAmortizada={c.tipo === 'deuda' && c.cuota_fija !== null}` to `MonthEntryRow`.
- No hook changes needed — `useMarkCuota`/`useUpsertEntry` already forward whatever fields are in their input object.
