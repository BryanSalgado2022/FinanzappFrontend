import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { NewConceptForm } from '../components/NewConceptForm'
import { useSummary } from '../hooks/useSummary'
import { useDashboardConcepts } from '../hooks/useDashboardConcepts'
import { formatCOP, monthName, tipoDotClass, tipoLabel } from '../lib/format'

const now = new Date()

export function Dashboard() {
  const [anio, setAnio] = useState(now.getFullYear())
  const [mes, setMes] = useState(now.getMonth() + 1)
  const [showNewConcept, setShowNewConcept] = useState(false)

  const summary = useSummary(anio, mes)
  const { rows, isLoading: rowsLoading } = useDashboardConcepts(anio, mes)

  const goToPreviousMonth = () => {
    if (mes === 1) {
      setMes(12)
      setAnio((y) => y - 1)
    } else {
      setMes((m) => m - 1)
    }
  }

  const goToNextMonth = () => {
    if (mes === 12) {
      setMes(1)
      setAnio((y) => y + 1)
    } else {
      setMes((m) => m + 1)
    }
  }

  const balance = summary.data ? Number(summary.data.balance_neto) : 0
  const isPositive = balance >= 0

  return (
    <div className="min-h-svh bg-paper">
      <Header />

      <main className="mx-auto max-w-xl space-y-8 p-5 pb-24">
        <div className="flex items-center justify-center gap-1 pt-1">
          <button
            type="button"
            onClick={goToPreviousMonth}
            aria-label="Mes anterior"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition hover:bg-accent-soft hover:text-ink"
          >
            ‹
          </button>
          <span className="min-w-40 text-center font-display text-2xl font-medium text-ink">
            {monthName(mes)} {anio}
          </span>
          <button
            type="button"
            onClick={goToNextMonth}
            aria-label="Mes siguiente"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition hover:bg-accent-soft hover:text-ink"
          >
            ›
          </button>
        </div>

        <div
          className={`rounded-3xl border p-6 text-center shadow-sm ${
            isPositive ? 'border-accent/25 bg-accent-soft' : 'border-danger/25 bg-danger-soft'
          }`}
        >
          <p className="text-xs font-medium tracking-wide text-ink-muted uppercase">Balance del mes</p>
          <p
            className={`font-tabular mt-2 font-display text-4xl font-semibold ${
              isPositive ? 'text-accent' : 'text-danger'
            }`}
          >
            {summary.data ? formatCOP(summary.data.balance_neto) : '—'}
          </p>

          <div className="mt-5 flex justify-center gap-8 border-t border-ink/10 pt-4">
            <div className="text-left">
              <p className="text-xs text-ink-muted">Ingresos</p>
              <p className="font-tabular text-base font-semibold text-ink">
                {summary.data ? formatCOP(summary.data.total_ingresos) : '—'}
              </p>
            </div>
            <div className="text-left">
              <p className="text-xs text-ink-muted">Gastos</p>
              <p className="font-tabular text-base font-semibold text-ink">
                {summary.data ? formatCOP(summary.data.total_gastos) : '—'}
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-medium text-ink">Conceptos</h2>
            <button
              type="button"
              onClick={() => setShowNewConcept(true)}
              className="rounded-full bg-ink px-4 py-1.5 text-sm font-medium text-paper transition hover:opacity-90"
            >
              + Nuevo
            </button>
          </div>

          {rowsLoading && <p className="text-sm text-ink-muted">Cargando…</p>}

          {!rowsLoading && rows.length === 0 && (
            <div className="rounded-2xl border border-dashed border-line px-4 py-8 text-center">
              <p className="text-sm text-ink-muted">Aún no tienes conceptos.</p>
              <p className="mt-1 text-sm text-ink-muted">Crea el primero con "+ Nuevo".</p>
            </div>
          )}

          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper-raised">
            {rows.map(({ concepto, entry }) => (
              <li key={concepto.id}>
                <Link
                  to={`/concepts/${concepto.id}`}
                  className="flex items-center gap-3 px-4 py-3.5 text-sm transition hover:bg-accent-soft/40"
                >
                  <span className={`h-2 w-2 shrink-0 rounded-full ${tipoDotClass(concepto.tipo)}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">{concepto.nombre}</p>
                    <p className="text-xs text-ink-muted">{tipoLabel(concepto.tipo)}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                      entry?.pagado
                        ? 'bg-accent-soft text-accent'
                        : entry
                          ? 'bg-warn-soft text-warn'
                          : 'text-ink-muted'
                    }`}
                  >
                    {entry?.pagado ? '✓ Pagado' : entry ? 'Pendiente' : 'Sin entrada'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>

      {showNewConcept && <NewConceptForm onDone={() => setShowNewConcept(false)} />}
    </div>
  )
}
