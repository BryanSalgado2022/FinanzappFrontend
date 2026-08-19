import { Link } from 'react-router-dom'
import { DebtCompositionChart } from '../components/DebtCompositionChart'
import { useDebtsSummary } from '../hooks/useDebtsSummary'
import { formatCOP } from '../lib/format'

export function Deudas() {
  const { data, isLoading } = useDebtsSummary()

  return (
    <>
      <main className="mx-auto max-w-xl space-y-8 p-5 pb-24">
        <h1 className="font-display text-2xl font-medium text-ink">Deudas</h1>

        {isLoading && <p className="text-sm text-ink-muted">Cargando…</p>}

        {!isLoading && data && data.numero_deudas === 0 && (
          <div className="rounded-2xl border border-dashed border-line px-4 py-8 text-center">
            <p className="text-sm text-ink-muted">Aún no tienes deudas registradas.</p>
          </div>
        )}

        {!isLoading && data && data.numero_deudas > 0 && (
          <>
            <div className="rounded-3xl border border-line bg-paper-raised p-6">
              <p className="text-xs font-medium tracking-wide text-ink-muted uppercase">
                Progreso general
              </p>
              <p className="font-tabular mt-2 font-display text-3xl font-semibold text-ink">
                {data.progreso_porcentaje}%
              </p>

              <div className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4 text-center">
                <div>
                  <p className="text-xs text-ink-muted">Adeudado</p>
                  <p className="font-tabular text-sm font-semibold text-ink">
                    {formatCOP(data.total_adeudado)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted">Pagado</p>
                  <p className="font-tabular text-sm font-semibold text-ink">
                    {formatCOP(data.total_pagado)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted">Restante</p>
                  <p className="font-tabular text-sm font-semibold text-ink">
                    {formatCOP(data.saldo_total_restante)}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-3 font-display text-lg font-medium text-ink">Composición</h2>
              <DebtCompositionChart composicion={data.composicion} />
            </div>

            <div>
              <h2 className="mb-3 font-display text-lg font-medium text-ink">Tus deudas</h2>
              <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper-raised">
                {data.composicion.map((d) => (
                  <li key={d.concepto_id}>
                    <Link
                      to={`/concepts/${d.concepto_id}`}
                      className="flex items-center justify-between px-4 py-3.5 text-sm transition hover:bg-accent-soft/40"
                    >
                      <span className="font-medium text-ink">{d.nombre}</span>
                      <span className="font-tabular text-ink-muted">
                        {formatCOP(d.saldo_restante)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </main>
    </>
  )
}
