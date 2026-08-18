## Why

Three small but real usability gaps surfaced in user feedback on the live app: the interest-rate field when creating an amortized debt doesn't make clear whether to type a percentage or a fraction, the four visual states of a monthly entry (paid, overdue, pending, no entry) have no explanation anywhere, and there is no way to remove a monthly entry that was added by mistake. The backend already exposes `DELETE /concepts/{id}/entries/{anio}/{mes}` for the last one; this change wires it into the UI and ships the two other UI clarity fixes alongside it.

## What Changes

- Improve the interest-rate input in the new-concept form (`NewConceptForm.tsx`) with a concrete example placeholder and persistent helper text, so it's unambiguous that the value is a percentage typed as-is (e.g. "27.7" for 27.7%), matching the existing helper-text pattern already used for `dia_vencimiento`/`duracion_meses`/`cuota_inicial`.
- Add a fixed, compact, always-visible legend on the Concept Detail screen explaining the four visual states of a monthly entry (paid/received, overdue, pending, no entry) — no tooltip or click-to-reveal, since the app is mobile-first and can't rely on hover.
- Add a delete action for a single monthly entry, available only on concepts without a fixed schedule (no amortization, no `duracion_meses`), consuming the existing `DELETE /concepts/{id}/entries/{anio}/{mes}` backend endpoint. Deleting restores that month to its "no entry" state.

## Capabilities

### Modified Capabilities
- `dashboard`: the amortization-terms input on concept creation gains explicit guidance on how to enter the interest rate.
- `concept-management`: adds a status legend for the monthly entry list, and adds the ability to delete a single month's entry (restricted to concepts without a fixed schedule).

## Impact

- Frontend only: `src/components/NewConceptForm.tsx`, `src/components/MonthEntryRow.tsx`, `src/pages/ConceptDetail.tsx`, `src/hooks/useEntries.ts` (new `useDeleteEntry` mutation).
- Consumes an existing backend endpoint (`DELETE /concepts/{id}/entries/{anio}/{mes}`, already implemented and deployed) — no backend changes.
