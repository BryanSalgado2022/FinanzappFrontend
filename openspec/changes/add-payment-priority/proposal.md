## Why

The Dashboard lists pending concepts but gives no sense of which one to pay first. The user wants a "Prioridad de pago" card — inspired by a reference app screenshot — that surfaces the single most urgent pending payment, computed from its due date, so they know what to act on without scanning every list.

## What Changes

- Add a "Prioridad de pago" card on the Dashboard, above "Gastos variables del mes", highlighting the single most urgent pending `deuda`/`gasto_fijo` entry across **all of the user's months** (not just the Dashboard's currently selected month) — an overdue payment from a past month stays visible regardless of which month is being viewed.
- Priority is computed purely from the due date: **Alta** (overdue), **Media** (due within 5 days), **Baja** (due in more than 5 days). Entries with no `dia_vencimiento` set, already-paid entries, and `ingreso` concepts are excluded entirely.
- The card shows the concept's name, amount, priority badge, and due-status text (e.g. "atrasado · 18 ago" or "vence en 3 días"), with a one-click "Pagar mes" action that marks the entry paid using its planned amount, and a "Ver todas" control opening the full priority-ranked list.

## Capabilities

### Modified Capabilities
- `dashboard`: gains the "Prioridad de pago" card and its "Ver todas" list, and the one-click pay action.

## Impact

- New `src/lib/paymentPriority.ts`: pure function computing priority tier + ranking from `DashboardConceptRow[]` (using each row's full `entries` array, not just the selected month's `entry`) and today's date — no backend change, reuses `dia_vencimiento`/`vencida`/`pagado` already returned today.
- New `src/components/PaymentPriorityCard.tsx` (Dashboard card) and `src/components/PaymentPriorityList.tsx` (the "Ver todas" modal, same pattern as `MonthlyBalanceBreakdown.tsx`).
- `src/pages/Dashboard.tsx`: mounts the new card and modal.
- One-click "Pagar mes" reuses the existing `useUpsertEntry` mutation (`src/hooks/useEntries.ts`) — no new endpoint.
