import { useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { AddMenu } from '../components/AddMenu'
import { CalendarGrid, CalendarLegend } from '../components/CalendarGrid'
import { DayEventList } from '../components/DayEventList'
import { EventDetailPopover } from '../components/EventDetailPopover'
import { NewConceptForm } from '../components/NewConceptForm'
import { NewExpenseForm } from '../components/NewExpenseForm'
import { NewTaskForm } from '../components/NewTaskForm'
import { apiClient } from '../lib/apiClient'
import {
  buildConceptoEvents,
  buildDeudorEvents,
  buildGastoEvents,
  buildTareaEvents,
  mergeEventsByDay,
  type AgendaEvent,
} from '../lib/agendaEvents'
import { buildMonthGrid } from '../lib/calendarGrid'
import { monthName } from '../lib/format'
import { useDashboardConcepts } from '../hooks/useDashboardConcepts'
import { useDeudores } from '../hooks/useDeudores'
import { useGastos } from '../hooks/useGastos'
import { useTareas } from '../hooks/useTareas'
import type { Abono, TipoConcepto } from '../types'

const now = new Date()

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

const today = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`

export function Agenda() {
  const [anio, setAnio] = useState(now.getFullYear())
  const [mes, setMes] = useState(now.getMonth() + 1)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<AgendaEvent | null>(null)
  const [addMenuOpen, setAddMenuOpen] = useState(false)
  const [showNewConcept, setShowNewConcept] = useState(false)
  const [newConceptTipo, setNewConceptTipo] = useState<TipoConcepto>('gasto_fijo')
  const [showNewExpense, setShowNewExpense] = useState(false)
  const [showNewTask, setShowNewTask] = useState(false)

  const { rows: conceptoRows, isLoading: conceptosLoading } = useDashboardConcepts(anio, mes)
  const gastos = useGastos(anio, mes)
  const tareas = useTareas()
  const deudoresQuery = useDeudores()
  const deudores = deudoresQuery.data ?? []

  // Mirrors useDashboardConcepts's own per-item fan-out: no single backend
  // endpoint returns every debtor's abonos at once.
  const abonoQueries = useQueries({
    queries: deudores.map((deudor) => ({
      queryKey: ['deudores', deudor.id, 'abonos'] as const,
      queryFn: () => apiClient.get<Abono[]>(`/deudores/${deudor.id}/abonos`),
      enabled: deudoresQuery.isSuccess,
    })),
  })
  const abonosPorDeudor = new Map(
    deudores.map((deudor, index) => [deudor.id, abonoQueries[index]?.data ?? []]),
  )

  const isLoading = conceptosLoading || gastos.isLoading || tareas.isLoading || deudoresQuery.isLoading

  const events: AgendaEvent[] = [
    ...buildConceptoEvents(conceptoRows, anio, mes),
    ...buildGastoEvents(gastos.data ?? []),
    ...buildTareaEvents(tareas.data ?? [], anio, mes),
    ...buildDeudorEvents(deudores, abonosPorDeudor, anio, mes),
  ]
  const eventsByDay = mergeEventsByDay(events)
  const grid = buildMonthGrid(anio, mes)
  const selectedDayEvents = selectedDate ? (eventsByDay.get(selectedDate) ?? []) : []

  const goToPreviousMonth = () => {
    setSelectedDate(null)
    if (mes === 1) {
      setMes(12)
      setAnio((y) => y - 1)
    } else {
      setMes((m) => m - 1)
    }
  }

  const goToNextMonth = () => {
    setSelectedDate(null)
    if (mes === 12) {
      setMes(1)
      setAnio((y) => y + 1)
    } else {
      setMes((m) => m + 1)
    }
  }

  const yearOptions = Array.from({ length: 11 }, (_, i) => now.getFullYear() - 5 + i)
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1)

  const diaSeleccionado = selectedDate ? Number(selectedDate.split('-')[2]) : null

  return (
    <>
      <main className="mx-auto max-w-xl space-y-6 p-5 pb-24 lg:max-w-3xl">
        <div className="flex items-center justify-center gap-2 pt-1">
          <button
            type="button"
            onClick={goToPreviousMonth}
            aria-label="Mes anterior"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition hover:bg-accent-soft hover:text-ink"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>
          <select
            value={mes}
            onChange={(e) => {
              setSelectedDate(null)
              setMes(Number(e.target.value))
            }}
            className="rounded-full border border-line bg-paper px-2 py-1 text-center font-display text-base font-medium text-ink"
          >
            {monthOptions.map((m) => (
              <option key={m} value={m}>
                {monthName(m)}
              </option>
            ))}
          </select>
          <select
            value={anio}
            onChange={(e) => {
              setSelectedDate(null)
              setAnio(Number(e.target.value))
            }}
            className="rounded-full border border-line bg-paper px-2 py-1 text-sm text-ink"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={goToNextMonth}
            aria-label="Mes siguiente"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition hover:bg-accent-soft hover:text-ink"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {isLoading && <p className="text-center text-sm text-ink-muted">Cargando…</p>}

        <CalendarGrid
          grid={grid}
          eventsByDay={eventsByDay}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          today={today}
        />

        <CalendarLegend />

        {selectedDate && (
          <div>
            <div className="mb-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setNewConceptTipo('ingreso')
                  setShowNewConcept(true)
                }}
                className="flex items-center gap-1.5 rounded-full border border-line px-4 py-1.5 text-sm font-medium text-ink transition hover:bg-accent-soft"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                Agregar ingreso
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAddMenuOpen((v) => !v)}
                  className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-paper transition hover:opacity-90"
                >
                  <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                  Agregar gasto
                </button>
                <AddMenu
                  open={addMenuOpen}
                  onClose={() => setAddMenuOpen(false)}
                  onSelectGasto={() => setShowNewExpense(true)}
                  onSelectTarea={() => setShowNewTask(true)}
                  onSelectConcepto={(tipo) => {
                    setNewConceptTipo(tipo)
                    setShowNewConcept(true)
                  }}
                />
              </div>
            </div>
            <DayEventList date={selectedDate} events={selectedDayEvents} onSelectEvent={setSelectedEvent} />
          </div>
        )}
      </main>

      <EventDetailPopover event={selectedEvent} onClose={() => setSelectedEvent(null)} />

      {showNewConcept && diaSeleccionado !== null && (
        <NewConceptForm
          anio={anio}
          mes={mes}
          initialTipo={newConceptTipo}
          initialDiaVencimiento={diaSeleccionado}
          onDone={() => setShowNewConcept(false)}
        />
      )}
      {showNewExpense && selectedDate && (
        <NewExpenseForm initialFecha={selectedDate} onDone={() => setShowNewExpense(false)} />
      )}
      {showNewTask && selectedDate && (
        <NewTaskForm initialFecha={selectedDate} onDone={() => setShowNewTask(false)} />
      )}
    </>
  )
}
