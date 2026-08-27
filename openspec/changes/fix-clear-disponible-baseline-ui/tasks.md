## 1. Card

- [x] 1.1 Add a "Quitar" button next to "Guardar"/"Cancelar" in `AvailableBalanceCard.tsx`'s Disponible editing view, calling `updatePrefs.mutate({ saldo_disponible_inicial: null })`, only shown when a baseline is currently configured (not during first-time setup).

## 2. Verification

- [x] 2.1 Run `npx tsc -b` to confirm no type errors.
- [x] 2.2 Manually verify in-browser (backend fix deployed/running locally): configuring Disponible, then editing and activating "Quitar" returns the card to the setup prompt; Ahorros is unaffected. Confirmed the cleared state survives a page reload (backend actually persisted it, not just frontend cache).
