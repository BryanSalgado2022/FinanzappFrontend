## Context

The Dashboard already loads, for the selected month, `useDashboardConcepts` (each concept's `EntradaMensual` entry: `monto_planeado`, `monto_pagado`, `pagado`) and `useGastos` (variable expenses: `descripcion`, `fecha`, `monto`, `categorias`). No new backend query is needed — the breakdown is a client-side merge/sort of data already in memory. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Produce a single list of "contributors" to the selected month's balance, mixing concept entries and variable expenses, sorted by amount descending, with income visually separated from expenses.
- Reuse existing navigation (`/concepts/:id`) and the existing Gastos page for expense edits — no new edit UI.

**Non-Goals:**
- Annual aggregation (explicitly deferred per proposal.md).
- Category-level aggregation (explicitly rejected during grilling — multi-category amount-splitting is unresolved and out of scope).
- A new backend endpoint.

## Decisions

**Which amount represents a concept's contribution**: use `monto_pagado` when `pagado === true`, else `monto_planeado`. This matches what the backend's `MonthlySummary.total_gastos`/`total_ingresos` already reflects (confirmed: total expenses already includes planned debt/fixed-expense amounts), so the breakdown's sum lines up with the balance card's own numbers. A concept with no entry for the selected month (`entry` is `undefined`) is excluded from the list entirely — it has no contribution to show.

**Sign / income vs. expense classification**: a concept row is "income" when its `tipo === 'ingreso'`, else "expense" (`deuda`/`gasto_fijo`). Every `Gasto` (variable expense) is always "expense" — the entity has no income variant.

**Sorting**: single flat list sorted by amount descending regardless of income/expense, with each row visually tagged (color/icon) by income vs. expense — matches the "Lista de contribuyentes ordenada por monto" decision, avoiding two separate sub-lists that would need independent scroll/empty states.

**Row navigation**: concept rows use the existing `useNavigate` pattern to `/concepts/:id` (already used elsewhere, e.g. from the Dashboard's concept list). Expense rows navigate to `/gastos` (no deep-link to a specific row/edit state — the Gastos page's existing inline edit is a manual next click, not automated, since there's no shared identifier-based edit-open API today).

**Zero-amount / edge entries**: an entry with `monto_planeado === '0'` (or `monto_pagado === '0'`) is still included — it's a legitimate zero-value contribution, not filtered out, consistent with "Empty month shows an empty breakdown" only applying when there are truly no entries at all.

## Risks / Trade-offs

- [Risk] The list's sum could drift from the balance card's number if `MonthlySummary` and the client-side merge ever diverge (e.g. a backend-side inclusion rule the frontend doesn't replicate). → Mitigation: this change does not recompute the balance itself — the card still shows the backend's number; the breakdown is presented as "contributors," not as a recomputation, so a minor mismatch is a transparency issue, not a correctness bug in the displayed balance.
- [Risk] Navigating to `/gastos` on expense-row click loses the user's Dashboard month context (Gastos page has its own view, not necessarily month-filtered the same way). → Mitigation: acceptable per the user's explicit choice; documented as a known limitation, not a blocker.
