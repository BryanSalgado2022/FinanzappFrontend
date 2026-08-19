## Context

See proposal.md - Why. No calendar-grid component exists in the codebase today. `useDashboardConcepts(anio, mes)` already solves "concepts + their entry for a given month" via a `useConcepts()` + fanned-out `useQueries` pattern - the closest existing reference. `AddMenu.tsx` already solves "one button, several creation choices" for the Dashboard.

## Goals / Non-Goals

**Goals:**
- Reuse every existing creation form, data hook, and detail screen unchanged wherever possible; the Agenda is a new *view* over existing data and existing entry points, not a parallel data model.
- Keep the event-combination and celebration logic pure and client-side, easily unit-testable in isolation from any component.

**Non-Goals:**
- Any new backend endpoint (confirmed in grilling).
- Editing an event's full detail inline in the popover - the popover is read-mostly with a link out; full editing stays on each entity's existing screen.
- Making Dashboard's `AddMenu` usage show the new "Tarea" option - it stays 4 options there, unchanged.

## Decisions

**A single `AgendaEvent` union type models all five sources uniformly**, so the grid/list/popover components never need to know about `Concepto`/`Gasto`/`Tarea`/`Deudor`/`Abono` individually:

```ts
type AgendaEvent =
  | { kind: 'concepto'; fecha: string; concepto: Concepto; entry: EntradaMensual; celebracion: 'pago' | 'cierre' | null }
  | { kind: 'gasto'; fecha: string; gasto: Gasto }
  | { kind: 'tarea'; fecha: string; tarea: Tarea }
  | { kind: 'deudor_inicio'; fecha: string; deudor: Deudor }
  | { kind: 'abono'; fecha: string; abono: Abono; deudor: Deudor; celebracion: 'pago' | null }
```

`celebracion` is `null` for the ordinary case; `'pago'` marks the zero-balance-reached event, `'cierre'` marks the manual-close event - kept as two independent optional tags (not a single boolean) because design decision 3(ii)/(iii) says they can land on different days for the same debt and both deserve the celebratory treatment where they occur, not just one flag per debt.

**`src/lib/agendaEvents.ts` owns the pure combination + celebration logic**, consumed by `Agenda.tsx` after the five data hooks resolve - no component does this math inline:
- `buildConceptoEvents(rows: DashboardConceptRow[]): AgendaEvent[]` - one event per row where `concepto.dia_vencimiento` is set and an entry exists for the viewed month; `fecha` is synthesized as `${anio}-${mes}-${dia_vencimiento}`.
- `findCelebracionPago(entries: EntradaMensual[], saldoRestante: Decimal-like): string | null` - returns the `fecha_pago` of the entry with the latest `fecha_pago` among paid entries, only when `saldoRestante` is zero; otherwise `null`. Takes a plain list and a balance, not a whole `Concepto`, so the identical logic is reused for a debtor's abonos (latest `Abono.fecha` when `deudor.saldo_restante` is zero) without duplicating the "find max, gate on zero" rule.
- `mergeEventsByDay(events: AgendaEvent[]): Map<string, AgendaEvent[]>` - groups by `fecha` (`YYYY-MM-DD`), the calendar grid and day-panel both consume this map, never the flat list.

**`src/lib/calendarGrid.ts` owns the pure date-grid math**, independent of any data: `buildMonthGrid(anio, mes): { date: string; inMonth: boolean }[][]` returns a 6-row×7-column grid (always 6 rows, so the grid height never jumps between months - simpler CSS than a variable row count), including the trailing days of the previous/next month needed to fill the first/last week, each flagged `inMonth` so the UI can render them dimmed. Mirrors `formatFecha`'s existing approach of hand-computing dates from parts instead of `new Date()`, for the same timezone-safety reason already documented there.

**Fetching**: `Agenda.tsx` calls, for the viewed `anio`/`mes`: `useDashboardConcepts(anio, mes)` (concept events, reused as-is), `useGastos(anio, mes)` (already filters server-side), `useTareas()` (no month filter exists server-side today - confirmed in research; filtered client-side to entries whose `fecha` falls in the viewed month, same acceptable-cost approach as `useDashboardConcepts` already takes for concepts), `useDeudores()` plus one `useAbonos(deudorId)` per debtor via `useQueries` (mirroring `useDashboardConcepts`'s own fan-out pattern exactly) - filtered client-side to the viewed month for both the loan-start and abono dates.

**Generic `EventDetailPopover` renders per-`kind` content via a switch, not five separate popover components** - one shared overlay/close/backdrop shell (copied from `AccentColorPicker`'s pattern: fixed backdrop + Escape listener + click-outside), with the body content and the "Ver en X" link's destination (`/concepts/{id}`, `/gastos` + row-level edit, `/tareas`, `/deudores/{id}`) chosen by `event.kind`. Consistent with the rest of the app's approach of small purpose-built components rather than a generic "detail renderer" abstraction, since there are exactly 5 known kinds, not an open-ended set.

**Form pre-fill props, minimal additions**:
- `NewConceptForm` gains `initialDiaVencimiento?: number` alongside its existing `initialTipo` - when the Agenda opens it for a clicked day, both are set (`initialTipo` to whichever the user picked from the extended `AddMenu`, `initialDiaVencimiento` to the clicked day-of-month). Dashboard's existing usage passes neither, unaffected.
- `NewTaskForm` gains `initialFecha?: string`, defaulting the existing empty-string `fecha` state.
- `AddMenu` gains `onSelectTarea?: () => void` (optional); the "Tarea" option renders in the options list only when the prop is provided - `Dashboard.tsx`'s call site is untouched and keeps rendering 4 options.

**`ingreso` due-day wiring is a small, mechanical unblock, not a new feature**: `ConceptDetail.tsx`'s `puedeTenerDiaVencimiento` gains `'ingreso'`; `NewConceptForm.tsx`'s equivalent gains it too. A new `src/lib/format.ts` export, `diaVencimientoLabel(tipo: TipoConcepto): { field: string; display: (dia: number) => string }`, centralizes the two label variants ("Día de vencimiento" / "Vence el día X" vs. "Día de pago" / "Te pagan el día X") so both call sites (and the Agenda's own event rendering) pull from one place instead of duplicating the tipo-check.

**No spec delta for `debtor-management`**: `finalizado_en` is already returned by the backend and typed on the frontend `Deudor` after this change, but no *requirement* in that capability changes - the Deudores screen itself doesn't grow a new UI for it (the field is purely consumed by the Agenda's celebration logic). Adding a delta there would describe a UI change that isn't happening.

## Risks / Trade-offs

- [Fetching all debtors' abonos via one query per debtor could be slow for a user with many debtors] → Accepted: mirrors `useDashboardConcepts`'s existing per-concept fan-out, which has been fine in production so far; the debtor list is realistically small (this is a personal budget app, not a lending business).
- [`useTareas()` has no server-side month filter, so all tasks are fetched and filtered client-side every time the Agenda mounts] → Accepted for the same reason `useDashboardConcepts` already accepts this trade-off for concepts - revisit only if it becomes an observed problem, not speculatively here.
