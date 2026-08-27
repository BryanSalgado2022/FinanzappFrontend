## Why

Sibling to the backend's `fix-clear-disponible-baseline`. The Disponible card's edit view only offered "Guardar" (blocked on an empty value) and "Cancelar" — there was no way to turn Disponible back off once configured.

## What Changes

- The Disponible edit view gains a "Quitar" action that clears the baseline (`saldo_disponible_inicial: null`), returning the card to its setup-prompt state.

## Capabilities

### Modified Capabilities
- `dashboard`: "Disponible card shows the real, accumulated available balance" gains the ability to clear the baseline back to unconfigured.

## Impact

- `src/components/AvailableBalanceCard.tsx`: add a "Quitar" button in the Disponible editing view.
