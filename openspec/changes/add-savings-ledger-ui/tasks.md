## 1. Types and data

- [x] 1.1 In `src/types.ts`, change `UserRead.ahorros` to non-nullable `string`; remove `ahorros` from `UserUpdateInput`.
- [x] 1.2 Add `TipoAporte = 'aporte' | 'retiro'`, `AporteAhorro { id: number; monto: string; fecha: string; tipo: TipoAporte; created_at: string }`, `AporteAhorroCreateInput { monto: string; fecha: string; tipo: TipoAporte }`.
- [x] 1.3 Create `src/hooks/useAhorros.ts`: `useAportesAhorro()` (`GET /ahorros`, query key `['ahorros']`), `useCreateAporte()` (`POST /ahorros`, invalidating `['ahorros']` and `['users','me']`), `useDeleteAporte(id)` (`DELETE /ahorros/{id}`, same invalidations), mirroring `useDeudores.ts`'s abono hooks.
- [x] 1.4 In `src/hooks/useAccentColor.ts`, remove `useUpdateUserPreferences` (dead code once `SavingsCard.tsx` no longer PATCHes `ahorros`).

## 2. Creation modal

- [x] 2.1 Create `src/components/NewAporteAhorroForm.tsx`, mirroring `NewDeudorForm.tsx`'s modal shell: `MoneyInput` for monto, a date input for fecha, a two-button pill toggle for tipo (aporte/retiro, mirroring `NewConceptForm.tsx`'s `TIPO_OPTIONS` pattern), calling `useCreateAporte().mutate(...)` on submit.

## 3. History view

- [x] 3.1 Create a history list view (new component, e.g. `src/components/AhorroHistoryModal.tsx`) reusing the modal shell, listing `useAportesAhorro()` entries (fecha, monto, tipo) each with a delete button calling `useDeleteAporte(id).mutate()`, mirroring `AbonoRow`'s layout in `DeudorDetail.tsx`.

## 4. SavingsCard rewrite

- [x] 4.1 Rewrite `src/components/SavingsCard.tsx`: remove the inline-edit-on-click interaction and `useUpdateUserPreferences` import entirely. Always show the (now non-nullable) balance via `formatCOP`. Add a "+ Agregar" button opening `NewAporteAhorroForm`, and a "Ver historial" control opening the history view. Zero-balance state shows the balance as zero with copy inviting the user to add their first entry via "+ Agregar" (not "toca para agregar").

## 5. Verification

- [x] 5.1 Run `npx tsc -b` to confirm no type errors.
- [ ] 5.2 Manually verify in-browser (backend already deployed/running locally): recording a contribution/withdrawal updates the card balance immediately; the history view lists entries correctly and deleting one updates the balance; the zero-balance empty state reads correctly; no client-side code links a retiro to any other balance/summary figure. (Pending: browser extension disconnected — verify once reconnected.)
