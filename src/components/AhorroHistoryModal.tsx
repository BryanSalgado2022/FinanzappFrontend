import { ArrowDownCircle, ArrowUpCircle, Trash2, X } from 'lucide-react'
import { useAportesAhorro, useDeleteAporte } from '../hooks/useAhorros'
import { formatCOP, formatFecha } from '../lib/format'
import type { AporteAhorro } from '../types'

function AporteRow({ aporte }: { aporte: AporteAhorro }) {
  const deleteAporte = useDeleteAporte(aporte.id)
  const Icon = aporte.tipo === 'aporte' ? ArrowUpCircle : ArrowDownCircle

  return (
    <li className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
      <span className="flex items-center gap-2 text-ink-muted">
        <Icon
          className={`h-3.5 w-3.5 ${aporte.tipo === 'aporte' ? 'text-accent' : 'text-ink-muted'}`}
          strokeWidth={2}
        />
        {formatFecha(aporte.fecha)}
      </span>
      <span className="flex items-center gap-3">
        <span className="font-tabular text-ink">{formatCOP(aporte.monto)}</span>
        <button
          type="button"
          onClick={() => deleteAporte.mutate()}
          disabled={deleteAporte.isPending}
          aria-label="Eliminar movimiento"
          className="text-ink-muted hover:text-danger disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </span>
    </li>
  )
}

export function AhorroHistoryModal({ onDone }: { onDone: () => void }) {
  const aportes = useAportesAhorro()
  const ordenados = [...(aportes.data ?? [])].sort((a, b) => (a.fecha < b.fecha ? 1 : -1))

  return (
    <div className="fixed inset-0 z-10 flex items-end justify-center bg-ink/50 backdrop-blur-sm sm:items-center">
      <div className="max-h-[90svh] w-full max-w-sm space-y-3.5 overflow-y-auto rounded-t-3xl border border-line bg-paper-raised p-6 shadow-xl sm:rounded-3xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-medium text-ink">Historial de ahorros</h2>
          <button
            type="button"
            onClick={onDone}
            aria-label="Cerrar"
            className="flex h-7 w-7 items-center justify-center rounded-full text-ink-muted hover:bg-paper hover:text-ink"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {ordenados.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line px-4 py-8 text-center">
            <p className="text-sm text-ink-muted">Aún no hay movimientos registrados.</p>
          </div>
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper">
            {ordenados.map((aporte) => (
              <AporteRow key={aporte.id} aporte={aporte} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
