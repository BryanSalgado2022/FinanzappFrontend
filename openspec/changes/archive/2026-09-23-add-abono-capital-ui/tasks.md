## 1. Types and data

- [x] 1.1 In `src/types.ts`, add `type ModoAbonoCapital = 'reducir_plazo' | 'reducir_cuota'` and `AbonoCapitalCreateInput { monto: string; fecha: string; modo: ModoAbonoCapital }`. Add `es_abono_capital: boolean` to `Abono`.
- [x] 1.2 In `src/hooks/useDeudores.ts`, add `useRegistrarAbonoCapital(id)` (`POST /deudores/{id}/abono-capital` → `Deudor`), invalidating `deudoresKey`, `deudorKey(id)`, `cuotasKey(id)`, `abonosKey(id)`, and `['summary']` — same set as `useActivarAmortizacionDeudor`.

## 2. UI

- [x] 2.1 In `src/pages/DeudorDetail.tsx`, add an "Abono a capital" button next to the "Cronograma de pagos" header, shown only when `d.cuota_fija !== null`. Opens a form (monto via `MoneyInput`, fecha date input, modo as a two-option toggle: "Reducir plazo" / "Reducir cuota").
- [x] 2.2 Show a confirmation step before submitting (mirrors the existing "Editar términos" confirm pattern) explaining the schedule will be regenerated and a full prepayment finalizes the debtor. On confirm, call `useRegistrarAbonoCapital`; on success, close the form.
- [x] 2.3 Show the mutation's server error inline on rejection, without clearing the form (mirrors `activarAmortizacion`/`updateAmortizacion`'s existing error handling).
- [x] 2.4 Add an "Abonos a capital" list below the cronograma, filtering `useAbonos(deudorId)`'s data to `es_abono_capital === true`, reusing `AbonoRow`-style rendering (fecha, monto, delete via the existing `useDeleteAbono`).

## 3. Verification

- [x] 3.1 Run `npx tsc -b` to confirm no type errors.
- [x] 3.2 Manually verify in-browser: the control appears only on amortized debtors; both modos work and visibly change cuota fija / número de cuotas; a full prepayment finalizes the debtor and clears the cronograma without a manual reload; rejected submissions show the server error and keep the form open; the prepayment history list shows recorded prepayments and deleting one restores the balance.
