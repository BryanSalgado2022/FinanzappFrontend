import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Landmark, Plus, Receipt, TrendingUp, Wallet } from 'lucide-react'
import { Header } from '../components/Header'
import { NewConceptForm } from '../components/NewConceptForm'
import { AnnualTrendChart } from '../components/AnnualTrendChart'
import { ConceptTypeTable } from '../components/ConceptTypeTable'
import { useSummary } from '../hooks/useSummary'
import { useAnnualTrend } from '../hooks/useAnnualTrend'
import { useDashboardConcepts } from '../hooks/useDashboardConcepts'
import { formatCOP, monthName } from '../lib/format'

const now = new Date()

export function Dashboard() {
  const [anio, setAnio] = useState(now.getFullYear())
  const [mes, setMes] = useState(now.getMonth() + 1)
  const [showNewConcept, setShowNewConcept] = useState(false)

  const summary = useSummary(anio, mes)
  const annualTrend = useAnnualTrend(anio)
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

  const deudas = rows.filter((r) => r.concepto.tipo === 'deuda')
  const gastosFijos = rows.filter((r) => r.concepto.tipo === 'gasto_fijo')
  const ingresos = rows.filter((r) => r.concepto.tipo === 'ingreso')

  return (
    <div className="min-h-svh bg-paper">
      <Header />

      <main className="mx-auto max-w-xl space-y-8 p-5 pb-24 lg:max-w-6xl">
        <div className="flex items-center justify-center gap-1 pt-1">
          <button
            type="button"
            onClick={goToPreviousMonth}
            aria-label="Mes anterior"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition hover:bg-accent-soft hover:text-ink"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
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
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-6">
          <div
            className={`rounded-3xl border p-6 text-center shadow-sm lg:col-span-4 lg:text-left ${
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

            <div className="mt-5 flex justify-center gap-8 border-t border-ink/10 pt-4 lg:justify-start">
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

          <div className="mt-8 lg:col-span-8 lg:mt-0">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-medium text-ink">Tendencia {anio}</h2>
              <Link
                to="/deudas"
                className="flex items-center gap-1.5 text-sm text-ink-muted underline decoration-line underline-offset-4 hover:text-ink"
              >
                <Wallet className="h-3.5 w-3.5" strokeWidth={2} />
                Ver deudas
              </Link>
            </div>
            {annualTrend.data ? (
              <AnnualTrendChart trend={annualTrend.data} />
            ) : (
              <p className="text-sm text-ink-muted">Cargando…</p>
            )}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-medium text-ink">Conceptos</h2>
            <button
              type="button"
              onClick={() => setShowNewConcept(true)}
              className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 text-sm font-medium text-paper transition hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              Nuevo
            </button>
          </div>

          {rowsLoading && <p className="text-sm text-ink-muted">Cargando…</p>}

          {!rowsLoading && rows.length === 0 && (
            <div className="rounded-2xl border border-dashed border-line px-4 py-8 text-center">
              <p className="text-sm text-ink-muted">Aún no tienes conceptos.</p>
              <p className="mt-1 text-sm text-ink-muted">Crea el primero con "Nuevo".</p>
            </div>
          )}

          {!rowsLoading && rows.length > 0 && (
            <div className="space-y-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">
              <ConceptTypeTable
                title="Deudas"
                Icon={Landmark}
                rows={deudas}
                emptyLabel="Sin deudas este mes."
              />
              <ConceptTypeTable
                title="Gastos fijos"
                Icon={Receipt}
                rows={gastosFijos}
                emptyLabel="Sin gastos fijos este mes."
              />
              <ConceptTypeTable
                title="Ingresos"
                Icon={TrendingUp}
                rows={ingresos}
                emptyLabel="Sin ingresos este mes."
              />
            </div>
          )}
        </div>
      </main>

      {showNewConcept && <NewConceptForm onDone={() => setShowNewConcept(false)} />}
    </div>
  )
}
