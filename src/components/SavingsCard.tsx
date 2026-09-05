import { useState } from 'react'
import { PiggyBank, Plus } from 'lucide-react'
import { AhorroHistoryModal } from './AhorroHistoryModal'
import { NewAporteAhorroForm } from './NewAporteAhorroForm'
import { useCurrentUser } from '../hooks/useAccentColor'
import { formatCOP } from '../lib/format'

export function SavingsCard() {
  const user = useCurrentUser()
  const [creating, setCreating] = useState(false)
  const [viewingHistory, setViewingHistory] = useState(false)

  if (!user.data) return null

  const ahorros = user.data.ahorros
  const isZero = Number(ahorros) === 0

  return (
    <div className="w-full rounded-3xl border border-line bg-paper-raised p-6 shadow-sm">
      <div className="flex items-center gap-1.5">
        <PiggyBank className="h-3.5 w-3.5 text-ink-muted" strokeWidth={2} />
        <p className="text-xs font-medium tracking-wide text-ink-muted uppercase">Ahorros</p>
      </div>

      <p className="mt-2 font-tabular font-display text-3xl font-semibold text-accent">
        {formatCOP(ahorros)}
      </p>
      {isZero && (
        <p className="mt-1 text-xs text-ink-muted">
          Aún no tienes ahorros registrados — agrega tu primer aporte.
        </p>
      )}

      <div className="mt-3 flex gap-4 text-xs">
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex items-center gap-1 font-medium text-ink-muted hover:text-ink"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          Agregar
        </button>
        <button
          type="button"
          onClick={() => setViewingHistory(true)}
          className="text-ink-muted underline decoration-line underline-offset-4 hover:text-ink"
        >
          Ver historial
        </button>
      </div>

      {creating && <NewAporteAhorroForm onDone={() => setCreating(false)} />}
      {viewingHistory && <AhorroHistoryModal onDone={() => setViewingHistory(false)} />}
    </div>
  )
}
