## Why

FinanzappBackend now supports an optional `dia_vencimiento` on debts and fixed expenses, and returns a computed `vencida` flag per monthly entry, but the frontend has no way to set that day or show which unpaid entries are overdue.

## What Changes

- Let the user set an optional due day (1-28) when creating a `deuda` or `gasto_fijo` concept, and edit it at any time from the Concept Detail header.
- Display the concept's due day in the Concept Detail header when set.
- Visually distinguish an overdue (`vencida`) monthly entry from a merely-pending one in the twelve-month timeline, using the `danger` design tokens (overdue is worse than pending).

Out of scope: due-date reminders/notifications, an "upcoming due dates" view, any Dashboard-level surfacing.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `dashboard`: the concept-creation form gains an optional due-day field.
- `concept-management`: the detail header gains an editable/displayable due-day field, and the monthly entry list distinguishes overdue entries.

## Impact

- `src/types.ts`: `Concepto`, `ConceptoCreateInput`, `ConceptoUpdateInput` gain `dia_vencimiento`; `EntradaMensual` gains `vencida`.
- `src/components/NewConceptForm.tsx`: new conditional input.
- `src/pages/ConceptDetail.tsx`: header edit form and read-only display.
- `src/components/MonthEntryRow.tsx`: `Node` component gains an overdue visual state.
