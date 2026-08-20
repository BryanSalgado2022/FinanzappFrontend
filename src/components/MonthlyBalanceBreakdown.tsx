import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import type { DashboardConceptRow } from '../hooks/useDashboardConcepts'
import { formatCOP, monthName } from '../lib/format'
import type { Gasto } from '../types'

interface ContributorRow {
  key: string
  label: string
  monto: number
  isIncome: boolean
  to: string
}

function buildContributors(rows: DashboardConceptRow[], gastos: Gasto[]): ContributorRow[] {
  const fromConcepts: ContributorRow[] = rows
    .filter((r) => r.entry !== undefined)
    .map(({ concepto, entry }) => ({
      key: `concepto-${concepto.id}`,
      label: concepto.nombre,
      monto: Number(entry!.pagado ? entry!.monto_pagado : entry!.monto_planeado),
      isIncome: concepto.tipo === 'ingreso',
      to: `/concepts/${concepto.id}`,
    }))

  const fromGastos: ContributorRow[] = gastos.map((gasto) => ({
    key: `gasto-${gasto.id}`,
    label: gasto.descripcion,
    monto: Number(gasto.monto),
    isIncome: false,
    to: '/gastos',
  }))

  return [...fromConcepts, ...fromGastos].sort((a, b) => b.monto - a.monto)
}

export function MonthlyBalanceBreakdown({
  anio,
  mes,
  rows,
  gastos,
  onDone,
}: {
  anio: number
  mes: number
  rows: DashboardConceptRow[]
  gastos: Gasto[]
  onDone: () => void
}) {
  const contributors = buildContributors(rows, gastos)

  return (
    <div className="fixed inset-0 z-10 flex items-end justify-center bg-ink/50 backdrop-blur-sm sm:items-center">
      <div className="max-h-[90svh] w-full max-w-sm space-y-3.5 overflow-y-auto rounded-t-3xl border border-line bg-paper-raised p-6 shadow-xl sm:rounded-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-medium text-ink">Detalle del balance</h2>
            <p className="text-xs text-ink-muted">
              {monthName(mes)} {anio}
            </p>
          </div>
          <button
            type="button"
            onClick={onDone}
            aria-label="Cerrar"
            className="flex h-7 w-7 items-center justify-center rounded-full text-ink-muted hover:bg-paper hover:text-ink"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {contributors.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line px-4 py-6 text-center text-sm text-ink-muted">
            Sin conceptos ni gastos este mes.
          </p>
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
            {contributors.map((row) => (
              <li key={row.key}>
                <Link
                  to={row.to}
                  onClick={onDone}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm transition hover:bg-accent-soft/40"
                >
                  <span className="min-w-0 truncate text-ink">{row.label}</span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        row.isIncome ? 'bg-accent-soft text-accent' : 'bg-danger-soft text-danger'
                      }`}
                    >
                      {row.isIncome ? 'Ingreso' : 'Gasto'}
                    </span>
                    <span
                      className={`font-tabular font-semibold ${
                        row.isIncome ? 'text-accent' : 'text-danger'
                      }`}
                    >
                      {row.isIncome ? '+' : '-'}
                      {formatCOP(row.monto)}
                    </span>
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
