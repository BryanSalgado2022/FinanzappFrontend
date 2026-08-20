import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { formatDueStatus, type PriorityEntry } from '../lib/paymentPriority'
import { formatCOP } from '../lib/format'

const LEVEL_LABEL: Record<PriorityEntry['level'], string> = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
}

const LEVEL_BADGE_CLASS: Record<PriorityEntry['level'], string> = {
  alta: 'bg-danger-soft text-danger',
  media: 'bg-warn-soft text-warn',
  baja: 'bg-accent-soft text-accent',
}

export function PaymentPriorityList({
  entries,
  today,
  onClose,
}: {
  entries: PriorityEntry[]
  today: Date
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-10 flex items-end justify-center bg-ink/50 backdrop-blur-sm sm:items-center">
      <div className="max-h-[90svh] w-full max-w-sm space-y-3.5 overflow-y-auto rounded-t-3xl border border-line bg-paper-raised p-6 shadow-xl sm:rounded-3xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-medium text-ink">Prioridad de pago</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-7 w-7 items-center justify-center rounded-full text-ink-muted hover:bg-paper hover:text-ink"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {entries.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line px-4 py-6 text-center text-sm text-ink-muted">
            No hay pagos pendientes con vencimiento.
          </p>
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
            {entries.map((entry) => (
              <li key={`${entry.conceptoId}-${entry.anio}-${entry.mes}`}>
                <Link
                  to={`/concepts/${entry.conceptoId}`}
                  onClick={onClose}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm transition hover:bg-accent-soft/40"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-ink">{entry.nombre}</span>
                    <span className="mt-1 flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${LEVEL_BADGE_CLASS[entry.level]}`}
                      >
                        {LEVEL_LABEL[entry.level]}
                      </span>
                      <span className="text-xs text-ink-muted">{formatDueStatus(entry, today)}</span>
                    </span>
                  </span>
                  <span className="font-tabular shrink-0 font-semibold text-ink">
                    {formatCOP(entry.monto_planeado)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
