## Why

The backend (`add-debt-amortization`, already implemented) now supports real debt amortization (interest rate, installment count, computed fixed installment) and two new aggregate endpoints (`GET /debts/summary`, `GET /summary/annual`). The frontend doesn't expose any of this yet: there's no way to create a debt with amortization terms, no way to see it, and no aggregate view across debts or across the year — which was the user's core feedback after using the MVP ("se siente como un simple registro, no como un presupuesto real").

## What Changes

- Extend the "new concept" form: when creating a `deuda`, optionally enter `tasa_interes`, whether it's monthly or annual, and `numero_cuotas`. Once submitted, these terms cannot be edited (matches the backend's immutability rule) — the UI must not offer an edit control for them.
- Extend Concept Detail's header to show amortization info when present: the fixed installment (`cuota_fija`), interest rate, and installment count, alongside the existing remaining-balance ring.
- Add a new "Deudas" screen: aggregate totals (total owed, total paid, overall percent progress), a composition chart across debts, and a list of debts each with their own progress — reachable from the Dashboard.
- Add an annual planned-vs-actual trend chart to the Dashboard, showing income/expenses across the 12 months of the selected year.

**BREAKING**: None (additive UI on top of an already-complete backend).

## Capabilities

### New Capabilities
- `debts-screen`: the aggregate "Deudas" view (totals, composition, per-debt list with progress).

### Modified Capabilities
- `dashboard`: creating a concept can now include amortization terms for debts; the Dashboard gains an annual trend chart and a link to the Deudas screen.
- `concept-management`: Concept Detail displays amortization terms (rate, installment count, fixed installment) when present, and never offers to edit them or `valor_total` for an amortized debt.

## Impact

- `FinanzappFrontend`: new screen, new hooks (`useDebtsSummary`, `useAnnualTrend`), a charting library added as a new dependency (decision in design.md).
- No backend changes — consumes the already-complete `add-debt-amortization` API as-is.

## Out of Scope (backlog, not part of this change)

- Envelope-style budget categories (Necesidades/Deseos/Deudas/Futuro).
- Data import/migration tooling.
- Per-concept (non-aggregate) trend charts.
- Editing an existing debt's amortization terms (the backend rejects it by design; the frontend surfaces the "delete and recreate" guidance, but doesn't build a special flow for it).
