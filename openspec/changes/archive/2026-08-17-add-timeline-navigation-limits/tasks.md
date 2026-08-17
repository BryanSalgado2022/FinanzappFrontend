## 1. Types

- [x] 1.1 Add `created_at: string` to `Concepto` in `src/types.ts`

## 2. Past-month collapse

- [x] 2.1 Add `mostrarMesesPasados` state (default `false`) and an `esMesPasado(mes)` helper to `ConceptDetail.tsx`
- [x] 2.2 Filter each quarter's rendered months by `mostrarMesesPasados || !esMesPasado(mes)`; skip rendering a quarter block entirely when its filtered list is empty
- [x] 2.3 Add the "Mostrar meses anteriores" control above the quarters, shown only when viewing the current year, not yet expanded, and at least one month is actually past
- [x] 2.4 Reset `mostrarMesesPasados` to `false` inside both year-selector click handlers

## 3. Year navigation lower bound

- [x] 3.1 Compute `creationYear` from `c.created_at` and derive `canGoToPreviousYear`
- [x] 3.2 Disable the "previous year" button (and its hover affordance) when `!canGoToPreviousYear`

## 4. Verification

- [x] 4.1 Run `npx tsc -b` and confirm no type errors
- [x] 4.2 In the browser, on a real concept with past/current/future months in the current year: confirm past months are collapsed by default, the control appears, and expanding reveals them
- [x] 4.3 In the browser: confirm a quarter that's entirely in the past (e.g. Q1 when viewing from August) doesn't show an empty header before expanding
- [x] 4.4 In the browser: navigate to a past year and confirm all 12 months show in full with no collapse control
- [x] 4.5 In the browser: navigate back to the current year after expanding and confirm the collapse resets to its default state
- [x] 4.6 In the browser: navigate back to the concept's creation year and confirm the "previous year" button becomes disabled and does nothing further
- [x] 4.7 In the browser: confirm the "next year" button remains unbounded
- [x] 4.8 Check light/dark mode and mobile width for the new control
