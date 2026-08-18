## 1. Interest-rate input clarity (#3)

- [x] 1.1 Update the interest-rate input's placeholder in `NewConceptForm.tsx` to include a concrete example (e.g. "Tasa de interés, ej: 27.7 para 27.7%")
- [x] 1.2 Add persistent helper text below the interest-rate input, matching the existing pattern used for `cuotaInicial`/`duracionMeses`/`diaVencimiento`, clarifying the value is typed as a plain percentage

## 2. Monthly entry status legend (#6)

- [x] 2.1 Build a compact legend component/block reusing `Node`'s exact icons and Tailwind classes for each of the four states (paid/received, overdue, pending, no entry)
- [x] 2.2 Place the legend in `ConceptDetail.tsx` between the year selector and the quarter list
- [x] 2.3 Make the legend wrap (`flex flex-wrap`) rather than force a single line on narrow screens

## 3. Delete a monthly entry (#8)

- [x] 3.1 Add `useDeleteEntry(conceptoId)` to `useEntries.ts`, calling `apiClient.delete` on `/concepts/{conceptoId}/entries/{anio}/{mes}` and invalidating the same query keys as `useUpsertEntry` (`entries`, `summary`, `concepts/{id}`) on success
- [x] 3.2 In `ConceptDetail.tsx`, compute `puedeEliminarse` from `c.duracion_meses`/`c.tasa_interes`/`c.numero_cuotas`, mirroring the backend's fixed-schedule condition, and pass it into each `MonthEntryRow`
- [x] 3.3 In `MonthEntryRow.tsx`, accept `puedeEliminarse` and `onDelete` props; render a left-aligned, `text-danger` "Eliminar" button in edit mode, separated from the right-aligned Cancelar/Guardar pair, shown only when `puedeEliminarse` is true and `entry` exists
- [x] 3.4 Wire the delete button to call `useDeleteEntry`'s mutation and close edit mode on success; surface `error.message` if the request fails (e.g. an unexpected 409)

## 4. Manual verification in the browser

- [x] 4.1 Verify the interest-rate placeholder/helper text render correctly when creating an amortized debt
- [x] 4.2 Verify the legend is visible and correctly labeled in both light and dark mode, and wraps correctly on a narrow/mobile viewport
- [x] 4.3 Verify the full delete flow on a recurring concept without a fixed schedule: add an entry, delete it, confirm the month reverts to "Sin planear" and dependent figures (balance/summary) update
- [x] 4.4 Verify the delete button does NOT appear on a concept with amortization terms or `duracion_meses`
