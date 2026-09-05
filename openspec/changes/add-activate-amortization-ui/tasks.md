## 1. Types and data

- [x] 1.1 In `src/types.ts`, add `ConceptoAmortizacionActivarInput { valor_total: string; tasa_interes: string; periodo_tasa: PeriodoTasa; numero_cuotas: number; cuota_inicial?: number }` and `DeudorAmortizacionActivarInput` (same shape, `monto_total` instead of `valor_total`).
- [x] 1.2 Add `useActivarAmortizacion(id)` to `src/hooks/useConcepts.ts` (`POST /concepts/{id}/amortizacion`) and `useActivarAmortizacionDeudor(id)` to `src/hooks/useDeudores.ts` (`POST /deudores/{id}/amortizacion`), same invalidations as the existing correction hooks.

## 2. UI

- [x] 2.1 In `src/pages/ConceptDetail.tsx`, show an "Agregar términos de amortización" control when `c.tipo === 'deuda' && c.cuota_fija === null`, reusing the existing amortization-terms form/state (adding an optional `cuota_inicial` field), branching `handleSubmitTerminos` to call `useActivarAmortizacion` instead of `useUpdateAmortizacion` when not yet amortized.
- [x] 2.2 Same in `src/pages/DeudorDetail.tsx` for `d.cuota_fija === null`, using `useActivarAmortizacionDeudor`.
- [x] 2.3 Adapt the confirmation copy and error/pending state to whichever mutation (activate vs correct) is active.

## 3. Verification

- [x] 3.1 Run `npx tsc -b` to confirm no type errors.
- [x] 3.2 Manually verify in-browser: the control appears only on non-amortized debts/debtors; the form works with and without `cuota_inicial`; confirmation copy reads correctly; existing paid history/abonos survive; the detail screen switches over to showing the schedule/cronograma immediately after activation.
