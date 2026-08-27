## Context

`useDashboardConcepts(anio, mes)` (`src/hooks/useDashboardConcepts.ts`) already fetches, for every concept, its **full** entry history (`entries: EntradaMensual[]`) alongside the single selected-month `entry` the Dashboard displays today — the comment on that field even calls out that Agenda already reuses it for a similar "look across all months" need. Each `EntradaMensual` carries a backend-computed `vencida` flag (`es_vencida` in `entry_service.py`, comparing `dia_vencimiento`+`anio`+`mes` against the server's `date.today()`) and `pagado`. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Compute payment priority entirely client-side from data `useDashboardConcepts` already fetches — no new endpoint, no new query.
- Priority is stable across Dashboard month navigation (per the grilled decision) — recomputed from the full dataset, never filtered by the currently selected month.

**Non-Goals:**
- Any backend change to `vencida`'s computation or a new priority-specific field.
- Manually-assigned priority levels (explicitly date-driven only, per the user's "en función de la fecha").

## Decisions

**Priority computation** (`src/lib/paymentPriority.ts`, pure function, no React): given `DashboardConceptRow[]` and `today: Date`, for every row:
1. Skip if `concepto.tipo === 'ingreso'` or `concepto.dia_vencimiento === null`.
2. Flatten `entries` (not just the selected-month `entry`) and skip any entry that's `pagado` or has no `dia_vencimiento` on its parent concept.
3. Build each qualifying entry's due date as `new Date(entry.anio, entry.mes - 1, concepto.dia_vencimiento)`.
4. Classify: `entry.vencida` (trust the backend's own flag, computed the same way) → **Alta**; else `dueDate <= today + 5 days` → **Media**; else **Baja**.
5. Sort all qualifying entries by `dueDate` ascending (most overdue / soonest first) — this single sort already produces the right within-tier order, since Alta entries all have `dueDate < today` and sort earliest-first naturally, and the tiers themselves are strictly ordered by how `dueDate` relates to `today`.

Output: an ordered array; the Dashboard card shows index 0, the "Ver todas" modal shows the full array.

**"Today" is the client's local date** (`new Date()`), consistent with how Dashboard/Agenda already default their own month state — not the AI agent chat's client-date-passed-to-backend pattern, since this computation never leaves the browser.

**One-click "Pagar mes"**: `PaymentPriorityCard` calls `useUpsertEntry(topEntry.concepto.id)` (a normal hook call — the argument varies per render like any other, not a conditional hook) and on click submits `{ anio: topEntry.anio, mes: topEntry.mes, input: { monto_planeado: topEntry.monto_planeado, monto_pagado: topEntry.monto_planeado, pagado: true } }`. Its `onSuccess` already invalidates `['concepts', conceptoId, 'entries']` (`useEntries.ts`) — the exact query key `useDashboardConcepts` uses per concept — so the Dashboard's own data refetches and the card recomputes its top entry automatically, no extra invalidation needed.

**Reusing the modal pattern**: `PaymentPriorityList` (the "Ver todas" modal) follows `MonthlyBalanceBreakdown.tsx`'s existing structure (fixed-overlay modal, row list, click-to-navigate) rather than a new visual pattern.

## Risks / Trade-offs

- [Risk] Computing across *all* entries for *every* concept on every Dashboard render is more work than the current single-month filter. → Mitigation: concept counts are small (personal-finance MVP scale, same assumption `useDashboardConcepts`'s own code comment already makes), and the computation is a plain array filter/sort, not a new network request.
- [Risk] `new Date(anio, mes - 1, dia_vencimiento)` assumes `dia_vencimiento` (1-28) is always a valid day in that month, which it always is by construction (the field is capped at 28, per `NewConceptForm.tsx`'s `Math.min(28, ...)`), so no invalid-date edge case exists.
