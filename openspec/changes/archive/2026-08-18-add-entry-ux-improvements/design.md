## Context

See proposal.md for motivation. Relevant current state:

- `NewConceptForm.tsx` already has a helper-text pattern for optional fields (`cuotaInicial`, `duracionMeses`, `diaVencimiento`): a `<p className="mt-1 px-1 text-xs text-ink-muted">` under the input.
- `MonthEntryRow.tsx`'s `Node` component renders one of four visual states purely from `entry` (`undefined`/`pagado`/`vencida`/plain), with no `tipo`-aware or schedule-aware information passed to it beyond what's needed for those checks.
- `ConceptDetail.tsx` already computes concept-derived booleans (`isDebt`, `puedeTenerDiaVencimiento`) at the top of the component from `c` (the loaded `Concepto`), and passes per-row callbacks into `MonthEntryRow`.
- `useEntries.ts` has `useConceptEntries` and `useUpsertEntry`, both keyed by `conceptoId`, with `useUpsertEntry` invalidating `entries`, `summary`, and `concepts/{id}` query keys on success.
- The backend's "fixed schedule" check (`concepto.duracion_meses is not None or (concepto.tasa_interes is not None and concepto.numero_cuotas is not None)`) is the authority for whether `DELETE` is rejected (409); the frontend must mirror this exact condition to decide whether to show the delete button, since showing it and then getting a 409 back would be a broken affordance, not just a rare edge case to handle gracefully.

## Goals / Non-Goals

**Goals:**
- Mirror the backend's fixed-schedule condition in the frontend so the delete button's visibility exactly matches when the backend would accept the request.
- Keep the delete button visually separated from Cancelar/Guardar to avoid accidental destructive taps, consistent with how "Eliminar" is already placed in the concept header (`ConceptDetail.tsx`'s own delete-concept button: left-aligned, `text-danger`, separated from the finish/edit actions).

**Non-Goals:**
- No confirmation dialog/modal before deleting an entry — out of scope for this change; matches the existing concept-level delete, which also has no confirmation step.
- No change to how `asegurar_entradas_anio_actual` (lazy year-extension) behaves — already decided in Group B grilling that a deleted current-month entry may be silently regenerated on next visit if an earlier entry exists to copy from; not revisited here.

## Decisions

**Where "can this entry be deleted" is computed: `ConceptDetail.tsx`, passed down as a prop.**
`MonthEntryRow` currently receives `tipo` but not `duracion_meses`/`tasa_interes`/`numero_cuotas`. Rather than passing three raw fields down and duplicating the fixed-schedule check inside `MonthEntryRow`, `ConceptDetail.tsx` computes a single `puedeEliminarse: boolean` from `c` (mirroring the backend's exact condition) and passes that one prop down. This keeps `MonthEntryRow` a presentation component that doesn't need to know the shape of `Concepto`, and keeps the fixed-schedule rule in one place per layer (backend service, frontend page) rather than three.

**`useDeleteEntry` as a new hook in `useEntries.ts`, mirroring `useUpsertEntry`'s invalidation.**
Same three invalidations as `useUpsertEntry` (`entries`, `summary`, `concepts/{id}`) since a deleted entry can affect a debt's `saldo_restante` and the monthly summary exactly like an upsert can. `apiClient.delete<T>` already exists and already treats a 204 response as `undefined`, so no changes needed there.

**Legend placement and content: static row between the year selector and the quarter list, using the same icons/classes as `Node`.**
Building the legend as small inline spans reusing the exact Tailwind classes/icons already defined in `Node` (`bg-accent`+`Check`, `border-danger`+`AlertTriangle`, `border-warn`, plain `border-line`) rather than writing new icon markup, so the legend can never visually drift from what `Node` actually renders. A `flex flex-wrap` container handles mobile width without truncation or forced single-line overflow.

**409 handling on delete: surface the error message, don't pre-empt it silently.**
Even though the button is only shown when `puedeEliminarse` is true, `useDeleteEntry`'s `onError` still surfaces `error.message` (from `ApiError`) if a 409 somehow comes back (e.g. stale client state), consistent with how `NewConceptForm` already surfaces `createConcept.isError`.

## Risks / Trade-offs

[Frontend's fixed-schedule condition drifts from the backend's if either changes independently] → Both are small, already-duplicated boolean expressions (the same condition is already inlined in three places in the backend and once in `ConceptDetail.tsx`'s `isDebt`/`c.cuota_fija` checks); acceptable given the existing codebase convention of recomputing this per-layer rather than sharing it over the wire.
