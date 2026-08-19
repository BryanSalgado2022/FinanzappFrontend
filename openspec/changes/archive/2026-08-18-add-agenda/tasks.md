## 1. Types and ingreso due-day wiring

- [x] 1.1 Add `finalizado_en: string | null` to `Concepto` and `Deudor` in `src/types.ts`; add `fecha_pago: string | null` to `EntradaMensual`
- [x] 1.2 Add `diaVencimientoLabel(tipo: TipoConcepto)` to `src/lib/format.ts`: returns field/display label variants ("Día de vencimiento"/"Vence el día X" for `deuda`/`gasto_fijo`, "Día de pago"/"Te pagan el día X" for `ingreso`)
- [x] 1.3 `ConceptDetail.tsx`: `puedeTenerDiaVencimiento` includes `ingreso`; header display and edit-form placeholder use `diaVencimientoLabel`
- [x] 1.4 `NewConceptForm.tsx`: `puedeTenerDiaVencimiento` includes `ingreso`; field label uses `diaVencimientoLabel`

## 2. Calendar and event-combination helpers

- [x] 2.1 Create `src/lib/calendarGrid.ts`: `buildMonthGrid(anio, mes)` returns a fixed 6×7 grid of `{ date, inMonth }`, hand-computed (no `new Date()` timezone reliance, mirroring `formatFecha`)
- [x] 2.2 Create `src/lib/agendaEvents.ts`: `AgendaEvent` union type, `buildConceptoEvents`, `findCelebracionPago` (shared for both deuda entries and debtor abonos), `mergeEventsByDay`

## 3. Form and AddMenu extensions

- [x] 3.1 `NewConceptForm.tsx`: add optional `initialDiaVencimiento?: number` prop, seeding the `diaVencimiento` state
- [x] 3.2 `NewTaskForm.tsx`: add optional `initialFecha?: string` prop, seeding the `fecha` state
- [x] 3.3 `AddMenu.tsx`: add optional `onSelectTarea?: () => void` prop; render a 5th "Tarea" option only when provided; `Dashboard.tsx`'s existing call site is left unchanged (still 4 options)

## 4. Calendar grid component

- [x] 4.1 Create `src/components/CalendarGrid.tsx`: renders `buildMonthGrid`'s 6×7 grid, marks each in-month day that has events (from the day→events map) with per-category indicators, dims out-of-month days, highlights the selected day
- [x] 4.2 Add a legend below the grid explaining each category's marker (Deuda/Pago mensual, Ingreso, Gasto, Tarea, Deudor) plus the celebratory marker

## 5. Day panel and event detail

- [x] 5.1 Create `src/components/DayEventList.tsx`: shown when a day is selected, lists that day's events (empty state when none), each item clickable
- [x] 5.2 Create `src/components/EventDetailPopover.tsx`: shared overlay/backdrop/Escape shell (mirrors `AccentColorPicker`'s pattern), renders per-`AgendaEvent.kind` content plus a "Ver en X" link to the entity's existing screen

## 6. Agenda screen

- [x] 6.1 Create `src/pages/Agenda.tsx`: month+year navigation, fetches `useDashboardConcepts`, `useGastos`, `useTareas`, `useDeudores` + per-debtor `useAbonos` via `useQueries`, combines via `agendaEvents.ts`, renders `CalendarGrid` + `DayEventList` + `EventDetailPopover`
- [x] 6.2 Wire quick-entry: selecting a day shows an "Agregar" control opening the extended `AddMenu` (with `onSelectTarea`); each selection opens `NewExpenseForm`/`NewTaskForm`/`NewConceptForm` with that day pre-filled (date, or `dia_vencimiento` + the viewed `anio`/`mes` for concepts)
- [x] 6.3 Add `/agenda` route to `App.tsx` and an "Agenda" link to `Sidebar.tsx`

## 7. Manual verification

- [x] 7.1 Create test data covering all five event sources for the viewed month (a `deuda` and an `ingreso` with due days, a variable expense, a task, a debtor with an abono) and confirm each appears on its correct day with the right category marker
- [x] 7.2 Pay off a debt concept's last installment (bringing its balance to zero) and confirm the celebratory marker appears on that payment's day; separately mark a concept `activo: false` and confirm the celebratory marker appears on that day too, distinct from the payoff case
- [x] 7.3 Register abonos on a debtor until its balance reaches zero and confirm the celebratory marker on the final abono's day
- [x] 7.4 Click a day with multiple events, confirm the event list shows all of them; click one, confirm the detail popover shows correct info and its "Ver en X" link navigates correctly
- [x] 7.5 Create a Gasto puntual, a Tarea, a Deuda, a Pago mensual, and an Ingreso from a clicked calendar day each, confirming the pre-filled date/due-day is correct in each form
- [x] 7.6 Confirm month/year navigation, and that Deudor/Abono are not offered as quick-entry options
- [x] 7.7 Confirm the `ingreso` due-day field now works end-to-end from both the Dashboard's "+ Agregar" flow and Concept Detail, with the "Día de pago" wording
- [x] 7.8 Check the calendar, legend, day panel, and popovers in mobile viewport and dark/light mode
- [x] 7.9 Clean up all test data created during verification (concepts, gastos, tareas, deudores/abonos) so the real account isn't left with orphaned test data
