## 1. Remove Disponible

- [x] 1.1 Delete `src/components/AvailableBalanceCard.tsx` and `src/hooks/useDisponible.ts`.
- [x] 1.2 Remove `saldo_disponible_inicial`/`saldo_disponible_fecha` from `UserRead`/`UserUpdateInput` and remove `DisponibleRead` in `src/types.ts`.

## 2. Redesigned Ahorros card

- [x] 2.1 Create `src/components/SavingsCard.tsx`: icon + "Ahorros" label + large editable figure, matching the visual weight of "Balance del mes" (rounded-3xl card, font-display text-3xl figure), with inline click-to-edit `MoneyInput` and a clear/empty state.
- [x] 2.2 Mount `SavingsCard` in `src/pages/Dashboard.tsx` in place of `AvailableBalanceCard`.

## 3. Verification

- [x] 3.1 Run `npx tsc -b` to confirm no type errors.
- [x] 3.2 Manually verify in-browser (once the backend removal is deployed/running locally): Disponible is gone from the Dashboard; Ahorros shows as its own card, editable, with a clean empty state when unset. Confirmed edit, clear-to-empty-state, and re-save all work correctly.
