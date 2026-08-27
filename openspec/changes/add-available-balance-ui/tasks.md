## 1. Types and data

- [x] 1.1 Add `ahorros`, `saldo_disponible_inicial`, `saldo_disponible_fecha` to `UserRead`/`UserUpdateInput` in `src/types.ts`; add `DisponibleRead { disponible: string | null; saldo_disponible_fecha: string | null }`.
- [x] 1.2 Create `src/hooks/useDisponible.ts`: `useDisponible()` querying `GET /summary/disponible`, key `['summary', 'disponible']`.
- [x] 1.3 Extend the existing user-preference mutation (`src/hooks/useAccentColor.ts` or equivalent) to support `ahorros`/`saldo_disponible_inicial` via `PATCH /users/me`, invalidating both `['users','me']` and `['summary','disponible']` on success.

## 2. Disponible card

- [x] 2.1 Create `src/components/AvailableBalanceCard.tsx`: setup-prompt state when `saldo_disponible_fecha` is null, figure state otherwise, both using inline click-to-edit `MoneyInput` per design.md.
- [x] 2.2 Add the Ahorros figure with its own inline click-to-edit control in the same card.
- [x] 2.3 Add the deficit warning (Disponible < 0), including the Ahorros figure only when set, per design.md's copy.
- [x] 2.4 Mount `AvailableBalanceCard` in `src/pages/Dashboard.tsx` next to the existing "Balance del mes" card.

## 3. Verification

- [x] 3.1 Run `npx tsc -b` to confirm no type errors.
- [x] 3.2 Manually verify in-browser (once the backend change is deployed/running locally): setup prompt appears before configuration; entering an initial value switches to showing the figure; editing it later re-baselines (verify by checking that a paid entry from before the new edit date no longer affects Disponible); Ahorros edits independently; the deficit warning appears/disappears correctly with and without Ahorros set.
