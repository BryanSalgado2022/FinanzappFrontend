## Why

Creating a concept (debt, fixed expense, or income) that starts in a future month today requires first navigating to that month in Agenda, since the Dashboard's "new concept" form always uses whichever month the Dashboard itself is currently viewing, with no way to pick a different one. The user wants to create a future-starting concept without leaving the Dashboard.

## What Changes

- Add an optional month/year picker inside the concept-creation form, hidden by default behind a "¿Empieza en otro mes?" link, so the common case (starting this month) stays visually unchanged.
- Applies to all three concept types (`deuda`, `gasto_fijo`, `ingreso`) since all three can start in a future month.
- When the link is not activated, the concept is created for whatever month/year the containing screen (Dashboard or Agenda) is currently displaying — exactly as today.
- When activated, the chosen month/year overrides the containing screen's current month/year for that one concept only.

## Capabilities

### Modified Capabilities
- `dashboard`: "Create a new concept from the Dashboard" gains an optional month/year override, decoupling the concept's starting month from the Dashboard's currently-viewed month.

## Impact

- `src/components/NewConceptForm.tsx`: add the hidden-by-default month/year picker and wire it to override the `anio`/`mes` props when active.
- No backend changes — `ConceptoCreateInput.anio`/`mes` already support any year/month.
