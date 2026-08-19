import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import type { AgendaEvent } from '../lib/agendaEvents'
import { formatCOP, formatFecha, tipoLabel } from '../lib/format'

function verEnHref(event: AgendaEvent): { label: string; to: string } {
  switch (event.kind) {
    case 'concepto':
    case 'concepto_cierre':
      return { label: 'Ver en Deudas', to: `/concepts/${event.concepto.id}` }
    case 'gasto':
      return { label: 'Ver en Gastos', to: '/gastos' }
    case 'tarea':
      return { label: 'Ver en Tareas', to: '/tareas' }
    case 'deudor_inicio':
    case 'abono':
    case 'deudor_cierre':
      return { label: 'Ver en Deudores', to: `/deudores/${event.deudor.id}` }
  }
}

function EventDetailBody({ event }: { event: AgendaEvent }) {
  switch (event.kind) {
    case 'concepto':
      return (
        <>
          <p className="font-display text-lg font-medium text-ink">{event.concepto.nombre}</p>
          <p className="text-sm text-ink-muted">
            {tipoLabel(event.concepto.tipo)} · {event.entry.pagado ? 'Pagado' : 'Pendiente'}
          </p>
          <p className="font-tabular mt-2 text-2xl font-semibold text-ink">
            {formatCOP(event.entry.monto_pagado ?? event.entry.monto_planeado)}
          </p>
          {event.celebracion === 'pago' && (
            <p className="mt-2 text-sm text-accent">🎉 ¡Con este pago quedó saldada!</p>
          )}
        </>
      )
    case 'concepto_cierre':
      return (
        <>
          <p className="font-display text-lg font-medium text-ink">{event.concepto.nombre}</p>
          <p className="text-sm text-ink-muted">Marcada como terminada este día</p>
        </>
      )
    case 'gasto':
      return (
        <>
          <p className="font-display text-lg font-medium text-ink">{event.gasto.descripcion}</p>
          <p className="text-sm text-ink-muted">Gasto puntual</p>
          <p className="font-tabular mt-2 text-2xl font-semibold text-ink">
            {formatCOP(event.gasto.monto)}
          </p>
        </>
      )
    case 'tarea':
      return (
        <>
          <p className="font-display text-lg font-medium text-ink">
            {event.tarea.emoji ? `${event.tarea.emoji} ` : ''}
            {event.tarea.titulo}
          </p>
          <p className="text-sm text-ink-muted">{event.tarea.completada ? 'Completada' : 'Pendiente'}</p>
          {event.tarea.nota && <p className="mt-2 text-sm text-ink">{event.tarea.nota}</p>}
        </>
      )
    case 'deudor_inicio':
      return (
        <>
          <p className="font-display text-lg font-medium text-ink">{event.deudor.nombre}</p>
          <p className="text-sm text-ink-muted">Préstamo registrado</p>
          <p className="font-tabular mt-2 text-2xl font-semibold text-ink">
            {formatCOP(event.deudor.monto_total)}
          </p>
        </>
      )
    case 'abono':
      return (
        <>
          <p className="font-display text-lg font-medium text-ink">{event.deudor.nombre}</p>
          <p className="text-sm text-ink-muted">Abono recibido</p>
          <p className="font-tabular mt-2 text-2xl font-semibold text-ink">
            {formatCOP(event.abono.monto)}
          </p>
          {event.celebracion === 'pago' && (
            <p className="mt-2 text-sm text-accent">🎉 ¡Con este abono quedó saldado!</p>
          )}
        </>
      )
    case 'deudor_cierre':
      return (
        <>
          <p className="font-display text-lg font-medium text-ink">{event.deudor.nombre}</p>
          <p className="text-sm text-ink-muted">Marcado como terminado este día</p>
        </>
      )
  }
}

export function EventDetailPopover({ event, onClose }: { event: AgendaEvent | null; onClose: () => void }) {
  useEffect(() => {
    if (!event) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [event, onClose])

  if (!event) return null

  const { label, to } = verEnHref(event)

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-ink/50 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm space-y-3 rounded-t-3xl border border-line bg-paper-raised p-6 shadow-xl sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-medium tracking-wide text-ink-muted uppercase">
            {formatFecha(event.fecha)}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-muted hover:bg-paper hover:text-ink"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <EventDetailBody event={event} />

        <Link
          to={to}
          onClick={onClose}
          className="mt-2 block text-sm text-ink-muted underline decoration-line underline-offset-4 hover:text-ink"
        >
          {label}
        </Link>
      </div>
    </div>
  )
}
