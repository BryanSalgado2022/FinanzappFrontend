## 1. Types

- [x] 1.1 In `src/types.ts`, add `abono_capital_modo?: ModoAbonoCapital` to `CuotaDeudorUpdateInput` and `EntradaMensualInput`.

## 2. Deudor: expandable CuotaRow with surplus detection

- [x] 2.1 In `src/pages/DeudorDetail.tsx`, convert `CuotaRow` to a self-contained expandable row (local `isEditing`/`montoPagado`/`modo` state, mirroring `MonthEntryRow`'s pattern): collapsed view unchanged (month, amount, paid/unpaid state); expanded view shows an editable monto field (`MoneyInput`, defaulting to `monto_pagado ?? monto_planeado`) and a paid/unpaid toggle.
- [x] 2.2 When the entered amount exceeds `cuota.monto_planeado`, show an inline "Reducir plazo"/"Reducir cuota" toggle (mirrors the existing standalone abono-capital form's toggle styling), defaulting to "Reducir cuota". On save, include `abono_capital_modo` in the `useMarkCuota` mutation input only when a surplus is present; omit it entirely otherwise.
- [x] 2.3 Show the mutation's server error inline on rejection (mirrors the existing standalone abono-capital form's error handling).

## 3. Concepto: surplus detection in MonthEntryRow

- [x] 3.1 In `src/components/MonthEntryRow.tsx`, add an `esAmortizada: boolean` prop. When `montoPagado` (draft) exceeds `entry?.monto_planeado` (or the draft `montoPlaneado` when there's no existing entry) AND `esAmortizada`, show the same inline "Reducir plazo"/"Reducir cuota" toggle, defaulting to "Reducir cuota". Include `abono_capital_modo` in `onSave`'s input only in that case.
- [x] 3.2 In `src/pages/ConceptDetail.tsx`, pass `esAmortizada={c.tipo === 'deuda' && c.cuota_fija !== null}` to every `MonthEntryRow`.

## 4. Verification

- [x] 4.1 Run `npx tsc -b` to confirm no type errors.
- [x] 4.2 Manually verify in-browser: `CuotaRow` expands and lets an amount be entered; a surplus reveals the modo toggle and saving routes it (cuota_fija/numero_cuotas update without a manual reload); no surplus sends no modo; `MonthEntryRow` shows the same behavior only for amortized debts, with `gasto_fijo`/`ingreso`/non-amortized-debt rows completely unaffected.
