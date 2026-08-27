## 1. Types

- [x] 1.1 Add `interes?: string` to `Abono` and `AbonoCreateInput` in `src/types.ts`.

## 2. Abono form

- [x] 2.1 In `src/pages/DeudorDetail.tsx`'s abono-creation form, add an optional `MoneyInput` for "¿Cuánto de este pago es interés? (opcional)".
- [x] 2.2 Validate client-side that the entered interest does not exceed the entered monto before submitting; show an inline error and block submission otherwise.
- [x] 2.3 Include `interes` in the mutation payload only when non-empty (matches the existing optional-field pattern used elsewhere in the form).

## 3. Verification

- [x] 3.1 Run `npx tsc -b` to confirm no type errors.
- [x] 3.2 Manually verify in-browser (once the backend change is deployed/running locally): recording an abono with an interest amount succeeds and the debtor's remaining balance decreases only by the principal portion; recording without interest behaves exactly as before; entering an interest greater than the monto is blocked client-side with an error; the Dashboard's balance/income figures for that abono's month reflect the interest.
