## 1. Setup

- [x] 1.1 Add `recharts` dependency
- [x] 1.2 Update `types.ts` with the new backend response shapes (`DebtsSummary`, `DebtComposition`, `AnnualTrend`, `AnnualMonthTotal`) and the new `ConceptoCreateInput`/`Concepto` amortization fields (`tasa_interes`, `periodo_tasa`, `numero_cuotas`, `cuota_fija`)

## 2. New Concept Form (spec: `dashboard`)

- [x] 2.1 Add optional amortization fields (interest rate, mensual/anual toggle, installment count) to `NewConceptForm`, shown only when `tipo = deuda`
- [x] 2.2 Wire the fields into `useCreateConcept`'s payload
- [x] 2.3 Verify in the browser: creating a debt with amortization terms produces the expected `cuota_fija` and generated entries (cross-check against the backend behavior already verified in `add-debt-amortization`)

## 3. Concept Detail Amortization Display (spec: `concept-management`)

- [x] 3.1 Display `cuota_fija`, interest rate, and installment count in the Concept Detail header when present, alongside the existing remaining-balance ring
- [x] 3.2 Confirm (already true today, verify no regression) that the edit form never submits `valor_total`/rate/installment fields

## 4. Deudas Screen (spec: `debts-screen`)

- [x] 4.1 Implement `useDebtsSummary()` hook wrapping `GET /debts/summary`
- [x] 4.2 Add the `/deudas` route and page shell
- [x] 4.3 Implement aggregate totals display (total owed, total paid, overall percent progress), including the zero-debts empty state
- [x] 4.4 Implement the debt composition chart with `recharts` (load the `dataviz` skill first for chart design conventions)
- [x] 4.5 Implement the per-debt list with individual progress, linking each entry to its Concept Detail screen
- [x] 4.6 Add a link/button to the Deudas screen from the Dashboard

## 5. Annual Trend on Dashboard (spec: `dashboard`)

- [x] 5.1 Implement `useAnnualTrend(anio)` hook wrapping `GET /summary/annual`
- [x] 5.2 Implement the annual trend chart with `recharts` (income/expenses across 12 months for the selected year)
- [x] 5.3 Add the trend chart to the Dashboard, styled consistently with the existing summary section

## 6. Wrap-up

- [x] 6.1 Verify end-to-end locally against the real backend: create an amortized and a non-amortized debt, confirm both display correctly, confirm the Deudas screen totals and composition, confirm the annual trend chart
- [x] 6.2 Verify `vite build` still produces a working production build
- [x] 6.3 Confirm light/dark mode and mobile-first layout for the new screen and chart additions
