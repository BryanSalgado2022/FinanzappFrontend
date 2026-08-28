## Why

Sibling to the backend's `remove-disponible`. The user tested Disponible and found it confusing; removing it. Ahorros stays, but the user also flagged it looked bad crammed into the bottom of the old combined card ("se ve feo") — it gets its own properly-designed card.

## What Changes

- **BREAKING**: the Disponible portion of the Dashboard (figure, setup prompt, deficit warning) is removed entirely.
- Ahorros becomes its own standalone card next to "Balance del mes", redesigned with the same visual weight as the other Dashboard summary cards (icon, label, large figure), rather than a small subsection.

## Capabilities

### Modified Capabilities
- `dashboard`: the combined Disponible/Ahorros card is replaced by a dedicated Ahorros card; the two Disponible-only requirements (setup prompt, deficit warning) are removed with no successor.

## Impact

- `src/components/AvailableBalanceCard.tsx`: deleted.
- New `src/components/SavingsCard.tsx`: standalone, redesigned Ahorros card.
- `src/hooks/useDisponible.ts`: deleted.
- `src/hooks/useAccentColor.ts`: `useUpdateUserPreferences` stays (still used for `ahorros`).
- `src/types.ts`: remove `saldo_disponible_inicial`/`saldo_disponible_fecha` from `UserRead`/`UserUpdateInput`; remove `DisponibleRead`.
- `src/pages/Dashboard.tsx`: mount `SavingsCard` instead of `AvailableBalanceCard`.
