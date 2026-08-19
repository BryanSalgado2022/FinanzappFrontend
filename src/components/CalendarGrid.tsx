import type { CalendarCell } from '../lib/calendarGrid'
import type { AgendaEvent } from '../lib/agendaEvents'

const WEEKDAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

// Reuses the app's existing per-tipo dot colors for concept events
// (tipoDotClass), plus three of the dataviz-validated categorical series
// tokens already defined in index.css for Gasto/Tarea/Deudor - viz-series-2
// is literally commented "orange: gastos" there, a natural fit.
const CATEGORY_DOT_CLASS: Record<string, string> = {
  deuda: 'bg-danger',
  gasto_fijo: 'bg-warn',
  ingreso: 'bg-accent',
  gasto: 'bg-viz-series-2',
  tarea: 'bg-viz-series-7',
  deudor: 'bg-viz-series-5',
}

const CATEGORY_LEGEND: { key: string; label: string }[] = [
  { key: 'deuda', label: 'Deuda' },
  { key: 'gasto_fijo', label: 'Pago mensual' },
  { key: 'ingreso', label: 'Ingreso' },
  { key: 'gasto', label: 'Gasto' },
  { key: 'tarea', label: 'Tarea' },
  { key: 'deudor', label: 'Deudor' },
]

function categoriesForDay(events: AgendaEvent[]): string[] {
  const cats = new Set<string>()
  for (const event of events) {
    if (event.kind === 'concepto' || event.kind === 'concepto_cierre') cats.add(event.concepto.tipo)
    else if (event.kind === 'gasto') cats.add('gasto')
    else if (event.kind === 'tarea') cats.add('tarea')
    else cats.add('deudor')
  }
  return Array.from(cats)
}

function hasCelebracion(events: AgendaEvent[]): boolean {
  return events.some(
    (event) =>
      event.kind === 'concepto_cierre' ||
      event.kind === 'deudor_cierre' ||
      ((event.kind === 'concepto' || event.kind === 'abono') && event.celebracion === 'pago'),
  )
}

export function CalendarGrid({
  grid,
  eventsByDay,
  selectedDate,
  onSelectDate,
  today,
}: {
  grid: CalendarCell[][]
  eventsByDay: Map<string, AgendaEvent[]>
  selectedDate: string | null
  onSelectDate: (date: string) => void
  today: string
}) {
  return (
    <div>
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAY_LABELS.map((label) => (
          <p key={label} className="pb-1 text-center text-xs font-medium text-ink-muted uppercase">
            {label}
          </p>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {grid.flatMap((row) =>
          row.map((cell) => {
            const events = eventsByDay.get(cell.date) ?? []
            const categories = categoriesForDay(events)
            const celebracion = hasCelebracion(events)
            const isSelected = cell.date === selectedDate
            const isToday = cell.date === today
            const dayNumber = Number(cell.date.split('-')[2])

            return (
              <button
                key={cell.date}
                type="button"
                onClick={() => onSelectDate(cell.date)}
                className={`flex flex-col items-center gap-1 rounded-xl py-2 text-sm transition ${
                  cell.inMonth ? 'text-ink' : 'text-ink-muted/40'
                } ${isSelected ? 'bg-accent-soft' : 'hover:bg-paper-raised'}`}
              >
                <span className={`relative ${isToday ? 'font-tabular font-semibold text-accent' : ''}`}>
                  {dayNumber}
                  {celebracion && (
                    <span className="absolute -top-2 -right-3" aria-hidden>
                      🎉
                    </span>
                  )}
                </span>
                <span className="flex h-1.5 gap-0.5">
                  {categories.map((cat) => (
                    <span
                      key={cat}
                      className={`h-1.5 w-1.5 rounded-full ${CATEGORY_DOT_CLASS[cat] ?? 'bg-ink-muted'}`}
                    />
                  ))}
                </span>
              </button>
            )
          }),
        )}
      </div>
    </div>
  )
}

export function CalendarLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-line bg-paper-raised px-4 py-3 text-xs text-ink-muted">
      {CATEGORY_LEGEND.map(({ key, label }) => (
        <span key={key} className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${CATEGORY_DOT_CLASS[key]}`} />
          {label}
        </span>
      ))}
      <span className="flex items-center gap-1.5">
        <span aria-hidden>🎉</span>
        Deuda saldada
      </span>
    </div>
  )
}
