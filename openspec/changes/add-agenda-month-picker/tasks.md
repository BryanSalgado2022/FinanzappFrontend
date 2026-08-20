## 1. Month picker in Agenda

- [x] 1.1 Add a month `<select>` (12 Spanish month names) next to the existing year `<select>` in `src/pages/Agenda.tsx`, bound to the same `mes` state the prev/next arrows already update.
- [x] 1.2 Keep the existing prev/next arrows and year selector behavior unchanged.

## 2. Verification

- [x] 2.1 Run `npx tsc -b` to confirm no type errors.
- [x] 2.2 Manually verify in-browser: selecting a month from the dropdown jumps the calendar directly to that month/year combination; prev/next arrows and year selector still work as before; events reload for the newly selected month.
