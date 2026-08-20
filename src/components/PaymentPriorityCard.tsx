import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { PaymentPriorityList } from './PaymentPriorityList'
import { useUpsertEntry } from '../hooks/useEntries'
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

export function PaymentPriorityCard({ entries, today }: { entries: PriorityEntry[]; today: Date }) {
  const [showAll, setShowAll] = useState(false)
  const top = entries[0]
  const upsertEntry = useUpsertEntry(top?.conceptoId ?? 0)

  const handlePagar = () => {
    if (!top) return
    upsertEntry.mutate({
      anio: top.anio,
      mes: top.mes,
      input: { monto_planeado: top.monto_planeado, monto_pagado: top.monto_planeado, pagado: true },
    })
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg font-medium text-ink">Prioridad de pago</h2>
        {top && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="text-sm text-ink-muted underline decoration-line underline-offset-4 hover:text-ink"
          >
            Ver todas
          </button>
        )}
      </div>

      {!top ? (
        <div className="rounded-2xl border border-dashed border-line px-4 py-6 text-center">
          <p className="text-sm text-ink-muted">Estás al día — no hay pagos pendientes con vencimiento.</p>
        </div>
      ) : (
        <div
          className={`rounded-2xl border p-5 ${
            top.level === 'alta' ? 'border-danger/40 bg-danger-soft/40' : 'border-line bg-paper-raised'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <Link to={`/concepts/${top.conceptoId}`} className="min-w-0">
              <div className="flex items-center gap-2">
                {top.level === 'alta' && (
                  <AlertTriangle className="h-4 w-4 shrink-0 text-danger" strokeWidth={2} />
                )}
                <span className="truncate font-display text-base font-medium text-ink hover:underline">
                  {top.nombre}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${LEVEL_BADGE_CLASS[top.level]}`}>
                  {LEVEL_LABEL[top.level]}
                </span>
                <span
                  className={`flex items-center gap-1 text-xs font-medium ${
                    top.level === 'alta' ? 'text-danger' : 'text-ink-muted'
                  }`}
                >
                  {top.level === 'alta' && <AlertTriangle className="h-3 w-3" strokeWidth={2.5} />}
                  {formatDueStatus(top, today)}
                </span>
              </div>
            </Link>
            <p className="font-tabular shrink-0 text-lg font-semibold text-ink">
              {formatCOP(top.monto_planeado)}
            </p>
          </div>

          <button
            type="button"
            onClick={handlePagar}
            disabled={upsertEntry.isPending}
            className="mt-4 w-full rounded-full bg-accent px-4 py-2 text-sm font-medium text-paper transition hover:opacity-90 disabled:opacity-50"
          >
            {upsertEntry.isPending ? 'Guardando…' : '✓ Pagar mes'}
          </button>
        </div>
      )}

      {showAll && <PaymentPriorityList entries={entries} today={today} onClose={() => setShowAll(false)} />}
    </div>
  )
}
