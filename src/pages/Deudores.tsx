import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Shield } from 'lucide-react'
import { Header } from '../components/Header'
import { NewDeudorForm } from '../components/NewDeudorForm'
import { useDeudores } from '../hooks/useDeudores'
import { formatCOP } from '../lib/format'

export function Deudores() {
  const deudores = useDeudores()
  const [showForm, setShowForm] = useState(false)

  const todos = deudores.data ?? []
  const activos = todos.filter((d) => d.activo)
  const totalQueDeben = activos.reduce((sum, d) => sum + Number(d.saldo_restante), 0)
  const conGarantia = activos.filter((d) => d.garantia).length

  return (
    <div className="min-h-svh bg-paper">
      <Header />

      <main className="mx-auto max-w-xl space-y-8 p-5 pb-24">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-medium text-ink">Deudores</h1>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Añadir deudor
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-line bg-paper-raised p-4 text-center">
            <p className="text-xs text-ink-muted">Total que te deben</p>
            <p className="font-tabular mt-1 text-lg font-semibold text-ink">
              {formatCOP(totalQueDeben)}
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-paper-raised p-4 text-center">
            <p className="text-xs text-ink-muted">Personas</p>
            <p className="font-tabular mt-1 text-lg font-semibold text-ink">{activos.length}</p>
          </div>
          <div className="rounded-2xl border border-line bg-paper-raised p-4 text-center">
            <p className="text-xs text-ink-muted">Con garantía</p>
            <p className="font-tabular mt-1 text-lg font-semibold text-ink">{conGarantia}</p>
          </div>
        </div>

        {deudores.isLoading && <p className="text-sm text-ink-muted">Cargando…</p>}

        {!deudores.isLoading && todos.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line px-4 py-8 text-center">
            <p className="text-sm text-ink-muted">Nadie te debe (por ahora).</p>
            <p className="mt-1 text-xs text-ink-muted">
              Si le prestaste a alguien, regístralo para no olvidarlo.
            </p>
          </div>
        )}

        {todos.length > 0 && (
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper-raised">
            {todos.map((deudor) => (
              <li key={deudor.id}>
                <Link
                  to={`/deudores/${deudor.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3.5 text-sm transition hover:bg-accent-soft/40"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span className={`truncate font-medium ${deudor.activo ? 'text-ink' : 'text-ink-muted line-through'}`}>
                      {deudor.nombre}
                    </span>
                    {deudor.garantia && (
                      <Shield className="h-3.5 w-3.5 shrink-0 text-ink-muted" strokeWidth={2} />
                    )}
                  </span>
                  <span className="font-tabular shrink-0 text-ink-muted">
                    {formatCOP(deudor.saldo_restante)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

      {showForm && <NewDeudorForm onDone={() => setShowForm(false)} />}
    </div>
  )
}
