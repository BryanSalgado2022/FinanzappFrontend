## 1. Types and data

- [x] 1.1 In `src/types.ts`, add `tasa_interes`, `periodo_tasa`, `numero_cuotas`, `cuota_fija`, `cuota_inicial` to `Deudor`; add the same four (minus cuota_fija) as optional fields to `DeudorCreateInput`.
- [x] 1.2 Add `DeudorAmortizacionUpdateInput { monto_total: string; tasa_interes: string; periodo_tasa: PeriodoTasa; numero_cuotas: number }`, mirroring `ConceptoAmortizacionUpdateInput`.
- [x] 1.3 Add `CuotaDeudor { id: number; deudor_id: number; anio: number; mes: number; monto_planeado: string; monto_pagado: string | null; pagado: boolean; fecha_pago: string | null; interes: string | null }` and `CuotaDeudorUpdateInput { monto_pagado?: string; pagado: boolean }`.
- [x] 1.4 In `src/hooks/useDeudores.ts`, add `useCuotasDeudor(deudorId)` (`GET /deudores/{id}/cuotas`), `useMarkCuota(deudorId)` (`PATCH /deudores/{id}/cuotas/{anio}/{mes}`, invalidating the cuotas query key plus `deudorKey`/`deudoresKey`/`['summary']`), and `useUpdateAmortizacionDeudor(id)` (`PUT /deudores/{id}/amortizacion`, invalidating `deudoresKey`, `deudorKey(id)`, the cuotas key, and `['summary']`), mirroring `useConcepts.ts`'s `useUpdateAmortizacion`.

## 2. Creation form

- [x] 2.1 In `src/components/NewDeudorForm.tsx`, add the amortization fields block (tasa_interes with a local `sanitizeTasaInteres`, periodo_tasa select defaulting to mensual, numero_cuotas, and an optional cuota_inicial shown once both are filled), mirroring `NewConceptForm.tsx`'s deuda block, unconditionally shown (no type-gate needed).
- [x] 2.2 Wire the new fields into `useCreateDeudor`'s payload, omitting them when tasa_interes/numero_cuotas aren't both filled.

## 3. Debtor Detail

- [x] 3.1 In `src/pages/DeudorDetail.tsx`, show a cuota_fija/tasa/numero_cuotas summary block with an "Editar términos" control when `d.cuota_fija !== null`, mirroring `ConceptDetail.tsx`'s amortization-terms UI (pre-filled form, `MoneyInput` + `sanitizeTasaInteres` + periodo_tasa select + numero_cuotas input, two-step confirm-before-submit using the loaded cuotas' unpaid count, `useUpdateAmortizacionDeudor(id).mutate(...)`, inline `error.message` on failure).
- [x] 3.2 When `d.cuota_fija !== null`, hide the "Registrar abono" form and "Historial de abonos" list entirely, replacing them with a "Cronograma de pagos" section: a flat chronologically-sorted list of `useCuotasDeudor(deudorId)` rows, each showing its period (month/year), planned amount, and paid state.
- [x] 3.3 Give each unpaid row in that list an inline "Marcar pagado" action calling `useMarkCuota(deudorId).mutate({ anio, mes, pagado: true })`; give each paid row its `fecha_pago` and a "Marcar no pagado" action calling the same mutation with `pagado: false`.
- [x] 3.4 Leave the non-amortized path (`d.cuota_fija === null`) byte-for-byte unchanged: the existing "Registrar abono" form and "Historial de abonos" list render exactly as before.

## 4. Verification

- [x] 4.1 Run `npx tsc -b` to confirm no type errors.
- [x] 4.2 Manually verify in-browser (backend already deployed/running locally): creating an amortized debtor generates its schedule; the amortization summary and "Editar términos" flow work like on Concept Detail; marking a cuota paid/unpaid updates the list and remaining balance without a reload; correcting terms with an invalid `numero_cuotas` shows the server's error; a non-amortized debtor's creation form and detail screen are unaffected.
