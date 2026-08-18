## Context

See proposal.md for motivation. Relevant current state:

- `ConceptDetail.tsx` is the closest existing detail-screen pattern: a header card with `ProgressRing`, `editingHeader` local state toggling between display and inline-editable inputs, and "Marcar como terminado"/"Eliminar" actions below a divider. `DeudorDetail.tsx` reuses this shape directly.
- `Deudas.tsx`/`Tareas.tsx` are the closest list-screen patterns: summary cards (or a create button) above a list, each item linking or expanding to more detail.
- `NewConceptForm.tsx`/`NewTaskForm.tsx` are the modal-creation pattern: fixed overlay, form with several fields, Cancelar/Crear.
- `useDebtsSummary.ts` computes its three summary figures server-side (`GET /debts/summary`); Deudores computes its three analogous figures client-side instead, per the grilling decision to skip a summary endpoint — this is a new pattern for this codebase (aggregating a list into summary cards purely in the frontend), worth noting since it looks superficially similar to `Deudas.tsx` but works differently under the hood.

## Goals / Non-Goals

**Goals:**
- Reuse `ConceptDetail.tsx`'s header/edit/progress-ring shape as closely as possible for `DeudorDetail.tsx`, since the two are structurally the same problem (an entity with a total amount, a computed remaining balance, and inline editing).

**Non-Goals:**
- No pagination or search on the Deudores list — matches Categorías/Tareas' "just a list" simplicity.
- No optimistic UI — same invalidate-then-refetch convention as every other mutation hook in this codebase.

## Decisions

**Summary cards computed with a single `useMemo`-free inline reduction over `useDeudores()`'s data, not a separate hook.**
Since the three figures (total owed, count, count-with-collateral) are cheap to compute and only used on the Deudores list screen itself, they're derived directly in `Deudores.tsx` from the already-fetched list (`deudores.data ?? []`), filtered to `activo` and reduced — no `useDebtorsSummary` hook, no memoization needed given realistic list sizes (same reasoning already applied to Categorías/Tareas' simplicity).

**Abono registration is a small always-visible form, not a modal.**
Two fields (monto, fecha) don't warrant a modal's overhead — an inline form above the abono list (mirroring how `Categorias.tsx`'s create control is a plain top-of-page form, not a modal, despite `NewTaskForm`/`NewConceptForm` using modals for their heavier field counts) keeps the friction of "log a payment" low, since this is likely the most frequent action on this screen.

**Abono list rows are plain (fecha + monto + Eliminar), no accordion.**
Since abonos have no update endpoint (design.md, backend `add-debtors`) there's nothing to expand into — a delete-only row doesn't need the click-to-expand affordance `CategoriaRow`/`TareaRow` use for editing. A simple `<li>` with a delete button matches the complexity actually present.

**Debtor detail's `ProgressRing` percent: `(monto_total - saldo_restante) / monto_total * 100`, matching `ConceptDetail.tsx`'s `percentPaid` formula exactly.**
Same computation already used for regular debts (`ConceptDetail.tsx`'s `percentPaid`) — no need to invent a different formula for the inverse case.

## Risks / Trade-offs

[Client-side summary computation re-derives on every render rather than being cached/memoized] → Accepted: matches this codebase's existing convention of not memoizing cheap derived values (see `ConceptDetail.tsx`'s `percentPaid`, computed inline on every render with no `useMemo`); revisit only if a real user's debtor count makes this measurably slow, which is unlikely for a personal finance app.
