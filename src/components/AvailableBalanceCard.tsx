import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { MoneyInput } from './MoneyInput'
import { useCurrentUser, useUpdateUserPreferences } from '../hooks/useAccentColor'
import { useDisponible } from '../hooks/useDisponible'
import { formatCOP } from '../lib/format'

const inputClass =
  'w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none'

export function AvailableBalanceCard() {
  const user = useCurrentUser()
  const disponibleQuery = useDisponible()
  const updatePrefs = useUpdateUserPreferences()

  const [editingDisponible, setEditingDisponible] = useState(false)
  const [disponibleDraft, setDisponibleDraft] = useState('')
  const [editingAhorros, setEditingAhorros] = useState(false)
  const [ahorrosDraft, setAhorrosDraft] = useState('')

  if (!user.data) return null

  const isConfigured = user.data.saldo_disponible_fecha !== null
  const disponible = disponibleQuery.data?.disponible ?? null
  const ahorros = user.data.ahorros

  const startEditingDisponible = () => {
    setDisponibleDraft(user.data!.saldo_disponible_inicial ?? '')
    setEditingDisponible(true)
  }

  const saveDisponible = () => {
    if (!disponibleDraft) return
    updatePrefs.mutate(
      { saldo_disponible_inicial: disponibleDraft },
      { onSuccess: () => setEditingDisponible(false) },
    )
  }

  const startEditingAhorros = () => {
    setAhorrosDraft(user.data!.ahorros ?? '')
    setEditingAhorros(true)
  }

  const saveAhorros = () => {
    updatePrefs.mutate(
      { ahorros: ahorrosDraft || null },
      { onSuccess: () => setEditingAhorros(false) },
    )
  }

  return (
    <div className="rounded-3xl border border-line bg-paper-raised p-6 shadow-sm">
      <p className="text-xs font-medium tracking-wide text-ink-muted uppercase">Disponible</p>

      {editingDisponible ? (
        <div className="mt-2 space-y-2">
          <MoneyInput
            value={disponibleDraft}
            onChange={setDisponibleDraft}
            placeholder="¿Cuánto tienes disponible hoy?"
            className={inputClass}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={saveDisponible}
              disabled={updatePrefs.isPending}
              className="rounded-full bg-ink px-3.5 py-1.5 text-xs font-medium text-paper disabled:opacity-50"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setEditingDisponible(false)}
              className="rounded-full px-3.5 py-1.5 text-xs text-ink-muted hover:text-ink"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : !isConfigured ? (
        <div className="mt-2">
          <p className="text-sm text-ink-muted">¿Cuánto tienes disponible hoy?</p>
          <button
            type="button"
            onClick={startEditingDisponible}
            className="mt-2 rounded-full bg-ink px-3.5 py-1.5 text-xs font-medium text-paper"
          >
            Configurar
          </button>
        </div>
      ) : (
        <button type="button" onClick={startEditingDisponible} className="block w-full text-left">
          <p
            className={`font-tabular mt-2 font-display text-3xl font-semibold ${
              disponible !== null && Number(disponible) < 0 ? 'text-danger' : 'text-accent'
            }`}
          >
            {disponible !== null ? formatCOP(disponible) : '—'}
          </p>
        </button>
      )}

      <div className="mt-4 border-t border-line pt-4">
        <p className="text-xs text-ink-muted">Ahorros</p>
        {editingAhorros ? (
          <div className="mt-1.5 space-y-2">
            <MoneyInput
              value={ahorrosDraft}
              onChange={setAhorrosDraft}
              placeholder="Ahorros"
              className={inputClass}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={saveAhorros}
                disabled={updatePrefs.isPending}
                className="rounded-full bg-ink px-3.5 py-1.5 text-xs font-medium text-paper disabled:opacity-50"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setEditingAhorros(false)}
                className="rounded-full px-3.5 py-1.5 text-xs text-ink-muted hover:text-ink"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={startEditingAhorros}
            className="font-tabular mt-0.5 block text-base font-semibold text-ink hover:underline"
          >
            {ahorros !== null ? formatCOP(ahorros) : 'Agregar'}
          </button>
        )}
      </div>

      {disponible !== null && Number(disponible) < 0 && (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-danger-soft p-3 text-sm text-danger">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
          <p>
            Estás gastando {formatCOP(Math.abs(Number(disponible)))} más de lo que has recibido
            {ahorros !== null ? ` — tienes ${formatCOP(ahorros)} en ahorros.` : '.'}
          </p>
        </div>
      )}
    </div>
  )
}
