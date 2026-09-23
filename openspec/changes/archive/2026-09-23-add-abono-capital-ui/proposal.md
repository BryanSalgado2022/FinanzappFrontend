## Why

Sibling to the backend's `add-abono-capital`. Amortized debtors can now record an extraordinary principal prepayment (`POST /deudores/{id}/abono-capital`), but there's no UI for it anywhere — no way to trigger it, choose `reducir_plazo` vs `reducir_cuota`, or see that a prepayment was recorded.

Deudor-only, per the same session's explicit scoping decision: `Concepto` (the user's own debts) has no equivalent payment-ledger entity to extend, so it's out of scope here too.

## What Changes

- On Debtor Detail, an amortized debtor (`d.cuota_fija !== null`) gets an "Abono a capital" control next to the cronograma — a button that opens a form for monto, fecha, and a `reducir_plazo` / `reducir_cuota` choice.
- Submitting always shows a confirmation step first (mirrors "Editar términos"), since a prepayment regenerates the remaining schedule and can finalize the debtor outright.
- The cronograma section also gets a small "Abonos a capital" history list, showing only `Abono` rows with `es_abono_capital: true` (the field the backend now returns), each deletable like a regular abono.
- If the prepayment fully settles the balance, the debtor's `activo`/`finalizado_en` flip is already reflected automatically once the header re-renders from the invalidated query — no separate finalize action needed in the UI.

## Capabilities

### Modified Capabilities
- `debtor-management`: adds a control to record a principal prepayment on an amortized debtor, and a history view for it.

## Impact

- `src/types.ts`: new `ModoAbonoCapital`, `AbonoCapitalCreateInput`; add `es_abono_capital: boolean` to `Abono`.
- `src/hooks/useDeudores.ts`: new `useRegistrarAbonoCapital(id)` (`POST /deudores/{id}/abono-capital`), same invalidations as `useActivarAmortizacionDeudor`.
- `src/pages/DeudorDetail.tsx`: new "Abono a capital" form/state next to the cronograma header, and an "Abonos a capital" list filtered from `useAbonos` by `es_abono_capital`.
