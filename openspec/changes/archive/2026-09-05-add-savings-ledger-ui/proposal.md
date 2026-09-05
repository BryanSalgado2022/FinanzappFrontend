## Why

Sibling to the backend's `add-savings-ledger`. `SavingsCard.tsx`'s inline "click the figure to edit" interaction no longer works — `ahorros` is now a computed, read-only running balance, set exclusively through the new ledger endpoints (`POST /ahorros`, `GET /ahorros`, `DELETE /ahorros/{id}`).

## What Changes

- `SavingsCard.tsx`: remove the inline-edit-on-click interaction entirely. The figure is always shown (never null/empty-state-for-unset). A "+ Agregar" button opens a modal (new `NewAporteAhorroForm.tsx`, mirroring `NewDeudorForm.tsx`'s modal shell) to record a contribution or withdrawal (monto, fecha, tipo).
- Add a "Ver historial" control that opens a list of the user's recorded entries (fecha, monto, tipo) with a delete action per entry — without this, the ledger's core value (seeing savings grow over time) has no visible surface anywhere in the app. This is a necessary consequence of the original ask, not added scope.
- Remove `useUpdateUserPreferences` and its only call site outright (dead code once `SavingsCard.tsx` no longer PATCHes `ahorros` directly).

## Capabilities

### Modified Capabilities
- `dashboard`: the Ahorros card is no longer inline-editable — contributions and withdrawals are recorded through a dedicated ledger flow, and its history is viewable from the card.

## Impact

- `src/types.ts`: `UserRead.ahorros` becomes non-nullable; `UserUpdateInput.ahorros` removed; new `TipoAporte`, `AporteAhorro`, `AporteAhorroCreateInput` types.
- `src/hooks/useAhorros.ts` (new): `useAportesAhorro()`, `useCreateAporte()`, `useDeleteAporte(id)`.
- `src/hooks/useAccentColor.ts`: `useUpdateUserPreferences` removed.
- `src/components/SavingsCard.tsx`: rewritten (figure display, "+ Agregar" trigger, "Ver historial" trigger).
- `src/components/NewAporteAhorroForm.tsx` (new): creation modal.
- `src/components/AhorroHistoryModal.tsx` (new, or equivalent): history list with delete.
