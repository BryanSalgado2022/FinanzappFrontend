## Context

See proposal.md for motivation. Relevant current state in `src/pages/ConceptDetail.tsx`:

- `QUARTERS` groups the 12 months into 4 fixed quarter blocks, each rendered as its own `<div>` with a quarter-label `<p>` and a `<ul>` containing that quarter's `MonthEntryRow`s, with an absolutely-positioned vertical connector line spanning the `<ul>`.
- `isCurrentMonth={anio === now.getFullYear() && mes === now.getMonth() + 1}` is the only existing "is this month special" logic - there's no existing notion of "past" months.
- The year selector is two plain buttons (`ChevronLeft`/`ChevronRight`) with no disabled state today.

## Goals / Non-Goals

**Goals:**
- Collapse past months without breaking the existing quarter-grouped rendering (a quarter with zero visible months must not render an empty header/connector line).

**Non-Goals:**
- No change to `MonthEntryRow` itself or its props.
- No persistence of the expanded/collapsed state across visits (reverts to collapsed every time the screen mounts) - not requested, and persisting it would need a storage decision not worth making here.

## Decisions

### Collapse is a derived boolean per month, computed once, not per-quarter
Add `esMesPasado(mes: number) => anio === now.getFullYear() && mes < now.getMonth() + 1` and a `mostrarMesesPasados` boolean state (default `false`). When rendering each quarter's months, filter to `months.filter((mes) => mostrarMesesPasados || !esMesPasado(mes))`. A quarter whose filtered list is empty renders nothing for that quarter (skip the `<div>` entirely) - this naturally handles quarters that are entirely in the past (e.g. Q1/Q2 when today is August) disappearing until expanded, without special-casing "empty quarter" logic beyond the existing `.filter().length === 0` check.

The "Mostrar meses anteriores" control itself renders once, above the quarters, only when `anio === now.getFullYear() && !mostrarMesesPasados` and at least one month in the year is actually past (guards against showing the control in January, when there's nothing to hide). Clicking it sets `mostrarMesesPasados = true`; per the grilling, no need to collapse back afterward, so no toggle-off control.

Alternative considered: collapse at the quarter level (hide/show a whole `T1`/`T2` header). Rejected in grilling explicitly - the user chose the single-button, month-level approach.

### Year lower bound: derive from `created_at`, compare directly
```ts
const creationYear = new Date(c.created_at).getFullYear()
const canGoToPreviousYear = anio > creationYear
```
The "previous year" button gets `disabled={!canGoToPreviousYear}` plus the existing hover styles conditioned on that same flag (so a disabled button doesn't show a hover affordance it can't act on). No change to the "next year" button.

### Reset `mostrarMesesPasados` when the year changes
If the user expands past months while viewing the current year, then navigates to a past year and back, `mostrarMesesPasados` should reset to collapsed (its stale `true` value would otherwise skip the collapse on return, silently violating "past months are collapsed by default"). Reset it inside the year-selector's `onClick` handlers (both directions) rather than a `useEffect`, consistent with this component's existing style of doing state updates directly in event handlers.

## Risks / Trade-offs

- **[Risk]** `new Date(c.created_at)` parses server time; if the concept was created late at night UTC, its "creation year" could differ by one from the user's local calendar view of when they created it, in edge cases right at year boundaries. → Acceptable; this is a soft UX guard against pointless navigation, not a data-integrity constraint - a one-day edge case at midnight Dec 31 is not worth adding timezone-aware logic for.
