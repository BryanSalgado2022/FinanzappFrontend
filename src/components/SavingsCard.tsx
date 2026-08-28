import { useState } from 'react'
import { PiggyBank } from 'lucide-react'
import { MoneyInput } from './MoneyInput'
import { useCurrentUser, useUpdateUserPreferences } from '../hooks/useAccentColor'
import { formatCOP } from '../lib/format'

const inputClass =
  'w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none'

export function SavingsCard() {
  const user = useCurrentUser()
  const updatePrefs = useUpdateUserPreferences()

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  if (!user.data) return null

  const ahorros = user.data.ahorros

  const startEditing = () => {
    setDraft(ahorros ?? '')
    setEditing(true)
  }

  const save = () => {
    updatePrefs.mutate({ ahorros: draft || null }, { onSuccess: () => setEditing(false) })
  }

  return (
    <div className="w-full rounded-3xl border border-line bg-paper-raised p-6 shadow-sm">
      <div className="flex items-center gap-1.5">
        <PiggyBank className="h-3.5 w-3.5 text-ink-muted" strokeWidth={2} />
        <p className="text-xs font-medium tracking-wide text-ink-muted uppercase">Ahorros</p>
      </div>

      {editing ? (
        <div className="mt-2 space-y-2">
          <MoneyInput value={draft} onChange={setDraft} placeholder="Ahorros" className={inputClass} />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={updatePrefs.isPending}
              className="rounded-full bg-ink px-3.5 py-1.5 text-xs font-medium text-paper disabled:opacity-50"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-full px-3.5 py-1.5 text-xs text-ink-muted hover:text-ink"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={startEditing} className="mt-2 block w-full text-left">
          {ahorros !== null ? (
            <p className="font-tabular font-display text-3xl font-semibold text-accent">
              {formatCOP(ahorros)}
            </p>
          ) : (
            <p className="text-sm text-ink-muted">Toca para agregar cuánto tienes ahorrado</p>
          )}
        </button>
      )}
    </div>
  )
}
