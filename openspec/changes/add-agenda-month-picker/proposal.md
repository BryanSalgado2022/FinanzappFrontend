## Why

Agenda already lets the user jump directly to any year via a dropdown, but changing the month still requires clicking the previous/next arrow one month at a time. The user wants to reach any month just as directly as they can already reach any year.

## What Changes

- Add a month `<select>` (12 month names) next to the existing year `<select>` in Agenda, so the user can jump straight to any month/year combination in one action, alongside the existing prev/next arrows (kept for the adjacent-month case).

## Capabilities

### Modified Capabilities
- `agenda`: "Dedicated Agenda screen" gains a direct month picker alongside the existing year picker and prev/next navigation.

## Impact

- `src/pages/Agenda.tsx`: add the month `<select>` next to the existing year `<select>`.
- No backend changes.
