import { useState, type ReactNode } from 'react'
import { AlertTriangle, Check, Circle, Trash2 } from 'lucide-react'
import { MoneyInput } from './MoneyInput'
import { formatCOP, monthName } from '../lib/format'
import type { EntradaMensual, TipoConcepto } from '../types'

interface MonthEntryRowProps {
  mes: number
  isCurrentMonth: boolean
  entry: EntradaMensual | undefined
  tipo: TipoConcepto
  isEditing: boolean
  onStartEdit: () => void
  onStopEdit: () => void
  onSave: (input: { monto_planeado: string; monto_pagado?: string; pagado?: boolean }) => void
  saving: boolean
  puedeEliminarse: boolean
  deleting: boolean
  onDelete: () => void
  deleteError?: string
}

// "Pagado"/"monto pagado" only makes sense for money going out (deuda,
// gasto_fijo). For an ingreso, the same field means "¿ya lo recibiste?" -
// same underlying data, different label so it reads correctly either way.
// "pendiente" is phrased as the action the button performs, not the current
// state ("Marcar como pagado" not "Pendiente") - a static state label reads
// as inert text, not as something clickable.
const LABELS: Record<TipoConcepto, { planeado: string; real: string; estado: string; pendiente: string }> = {
  deuda: {
    planeado: 'Monto planeado',
    real: 'Monto pagado (opcional)',
    estado: 'Pagado',
    pendiente: 'Marcar como pagado',
  },
  gasto_fijo: {
    planeado: 'Monto planeado',
    real: 'Monto pagado (opcional)',
    estado: 'Pagado',
    pendiente: 'Marcar como pagado',
  },
  ingreso: {
    planeado: 'Monto esperado',
    real: 'Monto recibido (opcional)',
    estado: 'Recibido',
    pendiente: 'Marcar como recibido',
  },
}

const inputClass =
  'w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none'

function Node({ entry, isCurrentMonth }: { entry: EntradaMensual | undefined; isCurrentMonth: boolean }) {
  const base = 'relative z-10 flex shrink-0 items-center justify-center rounded-full transition-transform'
  const size = isCurrentMonth ? 'h-7 w-7' : 'h-5 w-5'

  if (entry?.pagado) {
    return (
      <span className={`${base} ${size} scale-100 bg-accent text-paper-raised`}>
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    )
  }

  if (entry?.vencida) {
    return (
      <span
        className={`${base} ${size} border-2 border-danger bg-danger-soft text-danger ${
          isCurrentMonth ? 'ring-4 ring-danger-soft' : ''
        }`}
      >
        <AlertTriangle className="h-3 w-3" strokeWidth={2.5} />
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

const LEGEND_ITEMS: { key: string; label: string; node: ReactNode }[] = [
  {
    key: 'pagado',
    label: 'Pagado',
    node: (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-paper-raised">
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
    ),
  },
  {
    key: 'vencido',
    label: 'Vencido',
    node: (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-danger bg-danger-soft text-danger">
        <AlertTriangle className="h-2.5 w-2.5" strokeWidth={2.5} />
      </span>
    ),
  },
  {
    key: 'pendiente',
    label: 'Pendiente',
    node: <span className="h-5 w-5 shrink-0 rounded-full border-2 border-warn bg-paper-raised" />,
  },
  {
    key: 'sin-entrada',
    label: 'Sin entrada',
    node: <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-line bg-paper" />,
  },
]

/** Fixed, always-visible legend explaining the four Node states - built from
 * the exact same classes/icons Node renders so it can never visually drift
 * from what the entry list actually shows. No tooltip/hover: the app is
 * mobile-first and touch has no hover state. */
export function MonthEntryLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-line bg-paper-raised px-4 py-3">
      {LEGEND_ITEMS.map((item) => (
        <div key={item.key} className="flex items-center gap-2">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center">{item.node}</span>
          <span className="text-xs text-ink-muted">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

/** A pill toggle (not a native checkbox) so marking something paid/received
 * feels like a deliberate, satisfying action rather than a form checkbox. */
function PagadoToggle({
  checked,
  onChange,
  labelOn,
  labelOff,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  labelOn: string
  labelOff: string
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-all active:scale-[0.98] ${
        checked
          ? 'border-accent bg-accent text-paper-raised shadow-sm'
          : 'border-dashed border-line bg-paper text-ink-muted hover:border-warn hover:bg-warn-soft/40 hover:text-warn'
      }`}
    >
      {checked ? (
        <Check className="h-4 w-4" strokeWidth={3} />
      ) : (
        <Circle className="h-4 w-4" strokeWidth={2} />
      )}
      {checked ? labelOn : labelOff}
    </button>
  )
}

export function MonthEntryRow({
  mes,
  isCurrentMonth,
  entry,
  tipo,
  isEditing,
  onStartEdit,
  onStopEdit,
  onSave,
  saving,
  puedeEliminarse,
  deleting,
  onDelete,
  deleteError,
}: MonthEntryRowProps) {
  const labels = LABELS[tipo]
  const [montoPlaneado, setMontoPlaneado] = useState(entry?.monto_planeado ?? '')
  const [montoPagado, setMontoPagado] = useState(entry?.monto_pagado ?? '')
  const [pagado, setPagado] = useState(entry?.pagado ?? false)

  const startEditing = () => {
    setMontoPlaneado(entry?.monto_planeado ?? '')
    setMontoPagado(entry?.monto_pagado ?? '')
    setPagado(entry?.pagado ?? false)
    onStartEdit()
  }

  const handleSave = () => {
    onSave({
      monto_planeado: montoPlaneado,
      monto_pagado: montoPagado || undefined,
      pagado,
    })
    onStopEdit()
  }

  return (
    <li className="relative flex gap-3 py-2 pl-1">
      <div className="flex w-6 shrink-0 justify-center pt-1">
        <Node entry={entry} isCurrentMonth={isCurrentMonth} />
      </div>

      <div className={`min-w-0 flex-1 ${isCurrentMonth ? 'pb-1' : ''}`}>
        {!isEditing ? (
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
            <MoneyInput
              placeholder={labels.planeado}
              value={montoPlaneado}
              onChange={setMontoPlaneado}
              className={inputClass}
            />
            <MoneyInput
              placeholder={labels.real}
              value={montoPagado}
              onChange={setMontoPagado}
              className={inputClass}
            />
            <PagadoToggle
              checked={pagado}
              onChange={setPagado}
              labelOn={labels.estado}
              labelOff={labels.pendiente}
            />
            {deleteError && <p className="text-xs text-danger">{deleteError}</p>}

            <div className="flex items-center justify-between gap-2 pt-1">
              {puedeEliminarse && entry ? (
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={deleting}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-danger hover:opacity-80 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                  {deleting ? 'Eliminando…' : 'Eliminar'}
                </button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onStopEdit}
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
          </div>
        )}
      </div>
    </li>
  )
}
