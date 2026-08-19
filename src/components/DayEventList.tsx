import { CheckSquare, HandCoins, Landmark, ShoppingBag } from 'lucide-react'
import type { AgendaEvent } from '../lib/agendaEvents'
import { formatCOP, formatFecha } from '../lib/format'

const KIND_ICON: Record<AgendaEvent['kind'], typeof Landmark> = {
  concepto: Landmark,
  concepto_cierre: Landmark,
  gasto: ShoppingBag,
  tarea: CheckSquare,
  deudor_inicio: HandCoins,
  abono: HandCoins,
  deudor_cierre: HandCoins,
}

function eventTitle(event: AgendaEvent): string {
  switch (event.kind) {
    case 'concepto':
    case 'concepto_cierre':
      return event.concepto.nombre
    case 'gasto':
      return event.gasto.descripcion
    case 'tarea':
      return event.tarea.titulo
    case 'deudor_inicio':
    case 'abono':
    case 'deudor_cierre':
      return event.deudor.nombre
  }
}

function eventSubtitle(event: AgendaEvent): string {
  switch (event.kind) {
    case 'concepto':
      return event.entry.pagado ? 'Pagado' : 'Pendiente'
    case 'concepto_cierre':
      return 'Deuda cerrada'
    case 'gasto':
      return 'Gasto puntual'
    case 'tarea':
      return event.tarea.completada ? 'Completada' : 'Tarea'
    case 'deudor_inicio':
      return 'Préstamo registrado'
    case 'abono':
      return 'Abono recibido'
    case 'deudor_cierre':
      return 'Deudor cerrado'
  }
}

function eventMonto(event: AgendaEvent): string | null {
  switch (event.kind) {
    case 'concepto':
      return event.entry.monto_pagado ?? event.entry.monto_planeado
    case 'gasto':
      return event.gasto.monto
    case 'deudor_inicio':
      return event.deudor.monto_total
    case 'abono':
      return event.abono.monto
    case 'concepto_cierre':
    case 'tarea':
    case 'deudor_cierre':
      return null
  }
}

export function DayEventList({
  date,
  events,
  onSelectEvent,
}: {
  date: string | null
  events: AgendaEvent[]
  onSelectEvent: (event: AgendaEvent) => void
}) {
  if (!date) return null

  return (
    <div>
      <h2 className="mb-3 font-display text-lg font-medium text-ink">{formatFecha(date)}</h2>

      {events.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line px-4 py-6 text-center">
          <p className="text-sm text-ink-muted">Sin eventos este día.</p>
        </div>
      )}

      {events.length > 0 && (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper-raised">
          {events.map((event, index) => {
            const Icon = KIND_ICON[event.kind]
            const monto = eventMonto(event)
            const isPaidConcepto = event.kind === 'concepto' && event.entry.pagado
            return (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => onSelectEvent(event)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-accent-soft/40 ${
                    isPaidConcepto ? 'opacity-60' : ''
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 text-ink-muted" strokeWidth={2} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-ink">{eventTitle(event)}</span>
                    <span className="block text-xs text-ink-muted">{eventSubtitle(event)}</span>
                  </span>
                  {monto && (
                    <span className="font-tabular shrink-0 text-ink-muted">{formatCOP(monto)}</span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
