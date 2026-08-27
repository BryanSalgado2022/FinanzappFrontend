## Why

The backend (see sibling change `add-available-balance` in FinanzappBackend) computes a running "Disponible" figure and stores a manually-set "Ahorros" balance. The Dashboard has nowhere to show either, or to configure them.

## What Changes

- Add a "Disponible" card next to "Balance del mes" on the Dashboard, showing the running available-balance figure and the Ahorros figure, both editable inline.
- Before the user has configured a Disponible baseline, the card shows a setup prompt ("¿Cuánto tienes disponible hoy?") instead of a figure.
- When Disponible is negative, the card shows a warning comparing the deficit against Ahorros (e.g. "Estás gastando $X más de lo que has recibido — tienes $Y en ahorros"), without automatically changing the Ahorros number, per the earlier grilled decision.

## Capabilities

### Modified Capabilities
- `dashboard`: gains the Disponible card, its setup flow, and the deficit-vs-savings warning.

## Impact

- `src/types.ts`: `UserRead`/`UserUpdateInput` gain `ahorros`, `saldo_disponible_inicial`, `saldo_disponible_fecha`; new `DisponibleRead` type (`disponible: string | null`, `saldo_disponible_fecha: string | null`).
- New `src/hooks/useDisponible.ts`: `useDisponible()` query against the new `GET /summary/disponible` endpoint.
- `src/hooks/useAccentColor.ts` (or wherever `useCurrentUser`/`useUpdateAccentColor`-equivalent mutations live): extend or add a mutation for updating `ahorros`/`saldo_disponible_inicial` via the existing `PATCH /users/me`.
- New `src/components/AvailableBalanceCard.tsx`, mounted in `src/pages/Dashboard.tsx` next to the existing balance card.
- No changes to `MonthlySummary`/`useSummary` — this is fully additive.
