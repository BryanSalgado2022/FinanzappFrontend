import { useState } from 'react'
import { formatCOP, monthName } from '../lib/format'
import type { EntradaMensual, TipoConcepto } from '../types'

interface MonthEntryRowProps {
  mes: number
  isCurrentMonth: boolean
  entry: EntradaMensual | undefined
  tipo: TipoConcepto
  onSave: (input: { monto_planeado: string; monto_pagado?: string; pagado?: boolean }) => void
  saving: boolean
}

// "Pagado"/"monto pagado" only makes sense for money going out (deuda,
// gasto_fijo). For an ingreso, the same field means "¿ya lo recibiste?" -
// same underlying data, different label so it reads correctly either way.
const LABELS: Record<TipoConcepto, { planeado: string; real: string; estado: string }> = {
  deuda: { planeado: 'Monto planeado', real: 'Monto pagado (opcional)', estado: 'Pagado' },
  gasto_fijo: { planeado: 'Monto planeado', real: 'Monto pagado (opcional)', estado: 'Pagado' },
  ingreso: { planeado: 'Monto esperado', real: 'Monto recibido (opcional)', estado: 'Recibido' },
}

const inputClass =
  'w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none'

function Node({ entry, isCurrentMonth }: { entry: EntradaMensual | undefined; isCurrentMonth: boolean }) {
  const base = 'relative z-10 flex shrink-0 items-center justify-center rounded-full'
  const size = isCurrentMonth ? 'h-7 w-7' : 'h-5 w-5'

  if (entry?.pagado) {
    return (
      <span className={`${base} ${size} bg-accent text-[11px] text-paper-raised`}>
        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
          <path d="M2 6.2l2.6 2.6L10 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    )
  }

  if (entry) {
    return (
      <span
        className={`${base} ${size} border-2 border-warn bg-paper-raised ${
          isCurrentMonth ? 'ring-4 ring-warn-soft' : ''
        }`}
      />
    )
  }

  return (
    <span
      className={`${base} ${isCurrentMonth ? 'h-4 w-4 ring-4 ring-accent-soft' : 'h-2.5 w-2.5'} border border-line bg-paper`}
    />
  )
}

export function MonthEntryRow({ mes, isCurrentMonth, entry, tipo, onSave, saving }: MonthEntryRowProps) {
  const labels = LABELS[tipo]
  const [editing, setEditing] = useState(false)
  const [montoPlaneado, setMontoPlaneado] = useState(entry?.monto_planeado ?? '')
  const [montoPagado, setMontoPagado] = useState(entry?.monto_pagado ?? '')
  const [pagado, setPagado] = useState(entry?.pagado ?? false)

  const startEditing = () => {
    setMontoPlaneado(entry?.monto_planeado ?? '')
    setMontoPagado(entry?.monto_pagado ?? '')
    setPagado(entry?.pagado ?? false)
    setEditing(true)
  }

  const handleSave = () => {
    onSave({
      monto_planeado: montoPlaneado,
      monto_pagado: montoPagado || undefined,
      pagado,
    })
    setEditing(false)
  }

  return (
    <li className="relative flex gap-3 py-2 pl-1">
      <div className="flex w-6 shrink-0 justify-center pt-1">
        <Node entry={entry} isCurrentMonth={isCurrentMonth} />
      </div>

      <div className={`min-w-0 flex-1 ${isCurrentMonth ? 'pb-1' : ''}`}>
        {!editing ? (
          <button
            type="button"
            onClick={startEditing}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition ${
              isCurrentMonth ? 'bg-accent-soft/60' : 'hover:bg-paper-raised'
            }`}
          >
            <span className={`text-sm ${isCurrentMonth ? 'font-semibold text-ink' : 'text-ink-muted'}`}>
              {monthName(mes)}
            </span>
            <span className="font-tabular text-sm text-ink">
              {entry ? formatCOP(entry.monto_planeado) : <span className="text-ink-muted">Sin planear</span>}
            </span>
          </button>
        ) : (
          <div className="space-y-2 rounded-xl border border-line bg-paper-raised p-3">
            <p className="text-xs font-medium text-ink-muted">{monthName(mes)}</p>
            <input
              placeholder={labels.planeado}
              inputMode="decimal"
              value={montoPlaneado}
              onChange={(e) => setMontoPlaneado(e.target.value)}
              className={inputClass}
            />
            <input
              placeholder={labels.real}
              inputMode="decimal"
              value={montoPagado}
              onChange={(e) => setMontoPagado(e.target.value)}
              className={inputClass}
            />
            <label className="flex items-center gap-2 text-sm text-ink-muted">
              <input
                type="checkbox"
                checked={pagado}
                onChange={(e) => setPagado(e.target.checked)}
                className="accent-accent"
              />
              {labels.estado}
            </label>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-full px-3 py-1.5 text-sm text-ink-muted hover:text-ink"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !montoPlaneado}
                className="rounded-full bg-ink px-3 py-1.5 text-sm font-medium text-paper disabled:opacity-50"
              >
                {saving ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </li>
  )
}
