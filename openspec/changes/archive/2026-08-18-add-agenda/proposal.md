## Why

The last of three future-idea features from 2026-08-18 (Tareas and Deudores already shipped): a calendar view that lets the user see everything with a date - debt/income due days, variable expenses, tasks, debtor loans and payments - laid out spatially by day instead of only as separate lists, with quick-entry from any day and a special marker celebrating a debt paid off.

## What Changes

- New dedicated "Agenda" screen (Sidebar link, `/agenda` route) with a month-grid calendar, prev/next month navigation plus a year selector, and a day → event-list → event-detail interaction structure.
- `ingreso` concepts can now have a `dia_vencimiento` in the UI (the backend already allows it) - `ConceptDetail.tsx` and `NewConceptForm.tsx` both need their type-gating and labels updated ("Día de pago" instead of "Día de vencimiento" for `ingreso`).
- `types.ts` picks up the backend's `finalizado_en` (`Concepto`, `Deudor`) and `fecha_pago` (`EntradaMensual`) fields, unused until now.
- The Agenda combines five existing data sources client-side into a day → events map for the viewed month: concept due days (deuda/gasto_fijo/ingreso), variable expenses, tasks, debtor loan starts, and individual abonos - no new backend endpoint.
- A "paid off" celebration marker appears on the day a debt (own or a debtor's) reaches a zero balance via a payment, or the day it's manually closed.
- Quick-entry from any calendar day for Gasto puntual, Tarea, Deuda, Pago mensual, or Ingreso, reusing the existing creation forms with that day pre-filled. `NewTaskForm` and `NewConceptForm` gain optional pre-fill props; `AddMenu` gains an optional 5th "Tarea" option, used only by the Agenda (Dashboard's usage is unchanged).
- Clicking an existing event opens a lightweight detail popover (not immediate navigation) with a "Ver en X" link to the full screen.

## Capabilities

### New Capabilities
- `agenda`: a calendar view of everything with a date across the app, with day-level browsing, event detail, and quick-entry.

### Modified Capabilities
- `concept-management`: due-day editing now applies to `ingreso` too, with a type-appropriate label.
- `debtor-management`: no behavior change to debtor management itself, but `finalizado_en` becomes a field the frontend is aware of (surfaced only for the Agenda's use, not a new UI requirement on the Deudores screen itself - see design.md for why no spec delta is needed there).

## Impact

- New: `src/pages/Agenda.tsx`, `src/components/CalendarGrid.tsx`, `src/components/DayEventList.tsx`, `src/components/EventDetailPopover.tsx`, `src/lib/calendarGrid.ts`, `src/lib/agendaEvents.ts`.
- Modified: `src/types.ts`, `src/pages/ConceptDetail.tsx`, `src/components/NewConceptForm.tsx`, `src/components/NewTaskForm.tsx`, `src/components/AddMenu.tsx`, `src/components/Sidebar.tsx`, `src/App.tsx`, `src/lib/format.ts` (new date-label helper for due-day type).
- No backend changes (already shipped separately).
