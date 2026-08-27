## Why

The backend (see sibling change `add-abono-interest` in FinanzappBackend) adds an optional `interes` field to abonos, so interest earned on a loan can count toward monthly income. The frontend's abono form has no way to enter it.

## What Changes

- Add an optional "¿Cuánto de este pago es interés?" field to the abono-creation form on the Debtor Detail screen, validated client-side to not exceed the payment amount, matching the backend's rejection.
- No new list/section — the interest amount only affects the balance/income figures already computed elsewhere (Dashboard summary, debtor's remaining balance), per the earlier grilled decision to keep this change invisible beyond the totals.

## Capabilities

### Modified Capabilities
- `debtor-management`: "Record and remove abonos" gains the optional interest field.

## Impact

- `src/types.ts`: `Abono`/`AbonoCreateInput` gain `interes?: string`.
- `src/pages/DeudorDetail.tsx`: abono form gains the optional interest input, using the existing `MoneyInput` pattern, with client-side validation against the entered `monto`.
- No new component — reuses the existing abono form's structure.
