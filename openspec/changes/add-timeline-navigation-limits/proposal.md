## Why

The Concept Detail timeline always shows all 12 months of the selected year, and the year selector has no lower bound. The user doesn't want to always see past months by default, and doesn't want to be able to navigate to years before a concept even existed - there's no real historical data to look back on since the app is only now launching.

## What Changes

- Within the current year, months that have already passed are collapsed by default behind a single "Mostrar meses anteriores" control at the top of the list; the current month and future months always show in full. Expanding reveals the collapsed months.
- Viewing a past year (via the year selector) always shows all 12 months in full - the collapse is only the current year's default state.
- The year selector's "previous year" control stops working once the selected year reaches the concept's creation year (from `created_at`). No change to the "next year" control - it stays unbounded.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `concept-management`: the twelve-month entry list gains a default collapsed state for past months in the current year, and year navigation gains a lower bound.

## Impact

- `src/types.ts`: `Concepto` gains `created_at: string`.
- `src/pages/ConceptDetail.tsx`: past-month collapse state and rendering; year-selector lower bound.
