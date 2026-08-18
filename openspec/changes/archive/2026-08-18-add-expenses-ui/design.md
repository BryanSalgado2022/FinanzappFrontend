## Context

See proposal.md - Why. `useSummary(anio, mes)` (`src/hooks/useSummary.ts`) queries `['summary', anio, mes]`; `useEntries.ts` and `useConcepts.ts` already invalidate the broad `['summary']` key on mutations that affect the balance, which also invalidates every year/month-scoped variant since TanStack Query matches by key prefix.

## Goals / Non-Goals

**Goals:**
- Make the two Dashboard creation actions ("new concept" vs "record expense") unmistakable from each other.
- Keep the expense list/edit/delete screen consistent with the existing Categorías/Tareas pattern rather than inventing a new one.

**Non-Goals:**
- Category-level aggregation UI (backlog, per proposal).
- Any new shared component beyond `NewExpenseForm` - `CategoryPicker` is reused unchanged.

## Decisions

**Two visually distinct Dashboard buttons, not a combined menu.** "+ Nuevo concepto" stays as-is; "Registrar gasto" gets its own button with a different icon (a receipt/shopping icon, distinct from the concept-type icons already in use) and sits immediately next to it. A combined dropdown ("+" → choose concept or expense) would technically also satisfy "distinguishable," but adds an extra click to the single most frequent action in the app (per grilling, this is meant to be fast) and a new interaction pattern not used elsewhere in the Dashboard.

**`useGastos.ts` mirrors `useDeudores.ts`'s hook shape** (`useGastos(anio, mes)`, `useCreateGasto`, `useUpdateGasto`, `useDeleteGasto`), with one addition: every mutation's `onSuccess` invalidates both `['gastos']` and `['summary']`, following the existing precedent in `useEntries.ts`/`useConcepts.ts` where a mutation that can move the balance always invalidates `['summary']` alongside its own entity key.

**Dashboard's "variable expenses" section reuses `useGastos(anio, mes)` already scoped to the viewed month** rather than fetching all expenses and filtering client-side - consistent with how the concept list only shows entries for the selected month.

**`Gastos.tsx` (the dedicated screen) has no year/month filter UI in this change** - it lists all of the user's expenses, editable/deletable inline (accordion), matching `Categorias.tsx`'s unfiltered list. Filtering by month, if needed later, is a natural extension but wasn't asked for.

## Risks / Trade-offs

- [Two prominent buttons on the Dashboard header row could feel cluttered on narrow mobile widths] → Mitigate with icon-first buttons (label visible only on wider screens), consistent with how Header nav links already collapse to icon-only below `sm`.
