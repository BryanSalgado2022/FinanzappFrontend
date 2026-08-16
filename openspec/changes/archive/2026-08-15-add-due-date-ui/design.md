## Context

See proposal.md for motivation. Relevant current state:

- `src/types.ts`: `Concepto`/`ConceptoCreateInput` already carry amortization and `duracion_meses` fields following the same "optional, type-gated" shape this needs. `ConceptoUpdateInput` only has `nombre`/`categoria`/`activo`/`valor_total` today - `dia_vencimiento` needs adding there since (unlike the amortization fields) it's editable post-creation.
- `src/components/NewConceptForm.tsx`: `TIPO_OPTIONS` drives a 3-way segmented control; `puedeTenerDuracion = tipo === 'gasto_fijo' || tipo === 'ingreso'` gates the existing duration input. The due-day field needs its own gate: `tipo === 'deuda' || tipo === 'gasto_fijo'`.
- `src/pages/ConceptDetail.tsx`: `editingHeader` toggles between a read-only header (name, category, and read-only blocks for `cuota_fija`/`duracion_meses` when set) and an edit form (`nombreDraft`/`categoriaDraft`, Guardar calls `updateConcept.mutate(...)`). The edit form currently has no numeric inputs.
- `src/components/MonthEntryRow.tsx`'s `Node` component has three visual states today: paid (filled `accent` circle + check), has-entry-unpaid (`warn`-bordered ring, thicker ring when current month), no-entry (neutral outline). There's no fourth state yet.

## Goals / Non-Goals

**Goals:**
- Reuse existing conditional-field and read-only-block patterns rather than inventing new ones.
- Make "overdue" read as strictly worse than "pending" using the existing `danger` design tokens, without introducing a new color.

**Non-Goals:**
- No due-date picker/calendar widget - a plain number input, per the user's explicit call in grilling.
- No changes to `PagadoToggle` or the edit-form's amount inputs.

## Decisions

### `dia_vencimiento` input reuses `NewConceptForm`'s existing input styling, not a new component
Add a `diaVencimiento` string state (same pattern as `duracionMeses`) and a `puedeTenerDiaVencimiento = tipo === 'deuda' || tipo === 'gasto_fijo'` gate, rendered as a plain `<input inputMode="numeric">` with the shared `inputClass`, placed near the existing duration input. On submit, parse to a number and validate 1-28 client-side before sending (the backend already rejects out-of-range, but catching it client-side avoids a round-trip for an obviously bad value) - clamp/ignore rather than block-submit on invalid input, consistent with how the rest of this form treats optional numeric fields (it doesn't hard-block submission on client-side validation elsewhere; the backend is the source of truth).

Alternative considered (from grilling): a compact calendar-style day grid. Rejected by the user as unnecessary complexity for picking a single 1-28 number - a plain input matches the form's existing visual language.

### `ConceptDetail`'s header edit form gains the same input, always enabled
Unlike `valor_total` (which `concept-management`'s existing "Amortization terms are never editable" requirement locks out entirely for amortized debts), the due-day input in the edit form is never disabled - there is no locked/unlocked branching to build. When set, show it in a small read-only block alongside the existing `cuota_fija`/`duracion_meses` blocks (same `rounded-xl bg-paper px-3 py-2.5 text-center` treatment), e.g. "Vence el día 15".

### Overdue visual state added to `Node` as a fourth branch, checked first
```tsx
if (entry?.vencida) {
  return (
    <span className={`${base} ${size} border-2 border-danger bg-danger-soft ${
      isCurrentMonth ? 'ring-4 ring-danger-soft' : ''
    }`}>
      <AlertTriangle className="h-3 w-3 text-danger" strokeWidth={2.5} />
    </span>
  )
}
```
This branch is checked before the existing `entry?.pagado` and plain-`entry` branches (though `vencida` is already false for paid entries per the backend contract, checking it first keeps the visual precedence explicit and self-documenting). Uses `border-danger`/`bg-danger-soft`/`ring-danger-soft` - the same structural pattern as the existing `warn` (pending) state, swapping the color token, plus an `AlertTriangle` icon (lucide-react, not yet used elsewhere in this component) inside the node so the overdue state is distinguishable even for someone with red/orange color-vision deficiency, not just by color.

Alternative considered: reuse the pending (`warn`) treatment and only change the row's background. Rejected - the user's ask was specifically that overdue read as more urgent than pending, and the `Node` circle is what already carries all status meaning in this component; changing only the row background would compete with the existing `isCurrentMonth` row highlight.

### `useUpdateConcept` needs no changes
It already PATCHes an arbitrary `ConceptoUpdateInput`; adding `dia_vencimiento` to that type and passing it through `updateConcept.mutate({ dia_vencimiento })` from `ConceptDetail` requires no hook changes.

## Risks / Trade-offs

- **[Risk]** Client-side 1-28 validation could drift from the backend's rule if either changes independently. → Low risk (both were defined together in this feature); the backend remains the enforced source of truth regardless.
- **[Trade-off]** Adding a 4th `Node` visual state increases the component's branching. → Acceptable; the alternative (encoding overdue as a modifier on the existing pending state) was rejected above for legibility reasons.
