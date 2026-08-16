## Context

Builds on `add-frontend-mvp` (archived; see `openspec/specs/dashboard/` and `openspec/specs/concept-management/`) and consumes the already-implemented `add-debt-amortization` backend API (`GET /debts/summary`, `GET /summary/annual`, and the amortization fields on `POST /concepts`). This change is frontend-only.

## Goals / Non-Goals

**Goals:**
- Let the user enter amortization terms when creating a debt, without complicating the form for users who don't need it.
- A new Deudas screen and an annual trend chart on the Dashboard, both driven by the new backend aggregate endpoints.
- Follow the existing "editorial ledger" visual direction (Fraunces + Manrope, warm paper/ink palette) already established for the app — these are new views, not a new design language.

**Non-Goals:**
- Any backend change.
- Envelope-style budget categories, data import, per-concept trend charts (all explicitly deferred per proposal.md).
- A dedicated design pass with `/frontend-design` for these specific new screens — reuse the existing component/color/typography system as-is, in the interest of shipping this analytically-focused change without another full visual iteration. A follow-up `/frontend-design` pass remains available later if the user wants one.

## Decisions

### Charting library: Recharts
Add `recharts` as a new dependency for the composition chart (Deudas) and the annual trend chart (Dashboard). It's the most common React charting library, has good TypeScript support, and composes as React components rather than an imperative canvas API — fits this codebase's patterns better than a canvas-based alternative.

**Alternative considered**: hand-rolled SVG charts (as already done for `ProgressRing`). Rejected for the composition/trend charts specifically — a ring is a single simple shape; a multi-series line chart with axes, legends, and tooltips is enough surface area that a maintained library is worth the dependency.

Before implementing the chart components, load the `dataviz` skill for this project's chart design conventions (color mapping, axis/legend treatment, accessibility) so these new charts read as part of one system rather than being styled ad hoc.

### New concept form: amortization fields shown only for `deuda`
Extend `NewConceptForm` with three optional fields (interest rate, a mensual/anual toggle, installment count), rendered only when the type toggle is set to `deuda` - mirroring how `valor_total` is already conditionally shown today. No separate "advanced" step or second screen; it's the same single form, just with more fields visible in the debt case.

**Rationale**: matches the user's stated preference for simplicity - one form, not a wizard, and the existing conditional-field pattern (`valor_total` already appears/disappears based on type) extends naturally.

### Deudas screen hooks
Add `useDebtsSummary()` (wraps `GET /debts/summary`) and `useAnnualTrend(anio)` (wraps `GET /summary/annual`), following the existing one-hook-per-resource pattern (`useSummary`, `useConcepts`, etc.) already used throughout the app.

### Concept Detail: amortization display is read-only info, not a new edit path
The existing edit form on Concept Detail already only submits `nombre`/`categoria` (never `valor_total`) - so "amortization terms are never editable" (per the `concept-management` delta) requires no new guard, only a display addition (installment/rate/cuota_fija shown next to the existing balance). Confirmed by reading the current `ConceptDetail.tsx` edit form before starting implementation.

## Risks / Trade-offs

- [Adding a charting library increases bundle size] → Recharts tree-shakes reasonably well and this is a single-user local-first app where a few hundred KB is not a meaningful concern; revisit only if it becomes one.
- [Skipping a `/frontend-design` pass for these new screens risks them feeling bolted-on rather than integrated] → Mitigated by deliberately reusing the existing color tokens (`bg-paper`, `text-ink`, `accent`, etc.) and typography (Fraunces/Manrope) rather than introducing new ad hoc styles; a dedicated design pass remains available as a fast follow if the result doesn't feel cohesive enough once built.

## Open Questions

- Exact chart type for "debt composition" (pie vs. donut vs. horizontal stacked bar) - a `dataviz`-skill-guided implementation detail, not a spec-level behavior; decide during implementation.
