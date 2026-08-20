## 1. Starting month/year picker in NewConceptForm

- [x] 1.1 Add local state for whether the "start in a different month" control is expanded, plus its own month/year selection, defaulting to the `anio`/`mes` props passed into the form.
- [x] 1.2 Add the "¿Empieza en otro mes?" link below the type selector, hidden state by default; activating it reveals a month `<select>` (12 names) and a year `<select>` matching Agenda's existing ±5-year range pattern.
- [x] 1.3 On submit, use the picker's month/year when expanded, otherwise fall back to the `anio`/`mes` props exactly as today.
- [x] 1.4 Apply to all three concept types (`deuda`, `gasto_fijo`, `ingreso`) — no type-specific gating.

## 2. Verification

- [x] 2.1 Run `npx tsc -b` to confirm no type errors.
- [x] 2.2 Manually verify in-browser from the Dashboard: default creation (link untouched) still uses the Dashboard's current month; expanding the link and picking a future month creates the concept there instead (confirm by navigating Agenda to that month).
- [x] 2.3 Manually verify from Agenda: form still works as before, and the new picker does not conflict with Agenda's own month/year navigation.
