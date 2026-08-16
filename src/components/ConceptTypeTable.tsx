import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import type { DashboardConceptRow } from '../hooks/useDashboardConcepts'

export function ConceptTypeTable({
  title,
  Icon,
  rows,
  emptyLabel,
}: {
  title: string
  Icon: LucideIcon
  rows: DashboardConceptRow[]
  emptyLabel: string
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-ink-muted" strokeWidth={2} />
        <h3 className="font-display text-base font-medium text-ink">{title}</h3>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line px-4 py-5 text-center text-xs text-ink-muted">
          {emptyLabel}
        </p>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper-raised">
          {rows.map(({ concepto, entry }) => (
            <li key={concepto.id}>
              <Link
                to={`/concepts/${concepto.id}`}
                className="flex items-center justify-between gap-2 px-4 py-3 text-sm transition hover:bg-accent-soft/40"
              >
                <span className="min-w-0 truncate font-medium text-ink">{concepto.nombre}</span>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                    entry?.pagado
                      ? 'bg-accent-soft text-accent'
                      : entry
                        ? 'bg-warn-soft text-warn'
                        : 'text-ink-muted'
                  }`}
                >
                  {entry?.pagado
                    ? concepto.tipo === 'ingreso'
                      ? '✓ Recibido'
                      : '✓ Pagado'
                    : entry
                      ? 'Pendiente'
                      : 'Sin entrada'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
