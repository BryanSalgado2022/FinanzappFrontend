import { useState } from 'react'
import { ChevronDown, Trash2 } from 'lucide-react'
import { CategoryPicker } from '../components/CategoryPicker'
import { Header } from '../components/Header'
import { MoneyInput } from '../components/MoneyInput'
import { NewExpenseForm } from '../components/NewExpenseForm'
import { useDeleteGasto, useGastos, useUpdateGasto } from '../hooks/useGastos'
import { formatCOP, formatFecha } from '../lib/format'
import type { Gasto } from '../types'

const inputClass =
  'w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none'

function GastoRow({
  gasto,
  isEditing,
  onStartEdit,
  onStopEdit,
}: {
  gasto: Gasto
  isEditing: boolean
  onStartEdit: () => void
  onStopEdit: () => void
}) {
  const [monto, setMonto] = useState(gasto.monto)
  const [fecha, setFecha] = useState(gasto.fecha)
  const [descripcion, setDescripcion] = useState(gasto.descripcion)
  const [categoriaIds, setCategoriaIds] = useState<number[]>(gasto.categorias.map((c) => c.id))
  const updateGasto = useUpdateGasto(gasto.id)
  const deleteGasto = useDeleteGasto(gasto.id)

  const startEditing = () => {
    setMonto(gasto.monto)
    setFecha(gasto.fecha)
    setDescripcion(gasto.descripcion)
    setCategoriaIds(gasto.categorias.map((c) => c.id))
    onStartEdit()
  }

  const handleSave = () => {
    updateGasto.mutate(
      { monto, fecha, descripcion, categoria_ids: categoriaIds },
      { onSuccess: onStopEdit },
    )
  }

  const handleDelete = () => {
    deleteGasto.mutate()
  }

  if (!isEditing) {
    return (
      <li>
        <button
          type="button"
          onClick={startEditing}
          className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm transition hover:bg-accent-soft/40"
        >
          <span className="min-w-0">
            <span className="flex items-center gap-1.5 truncate text-ink">
              {gasto.categorias.some((c) => c.emoji) && (
                <span aria-hidden>
                  {gasto.categorias
                    .filter((c) => c.emoji)
                    .map((c) => c.emoji)
                    .join(' ')}
                </span>
              )}
              {gasto.descripcion}
            </span>
            <span className="block text-xs text-ink-muted">{formatFecha(gasto.fecha)}</span>
          </span>
          <span className="flex shrink-0 items-center gap-2">
            <span className="font-tabular text-ink-muted">{formatCOP(gasto.monto)}</span>
            <ChevronDown className="h-4 w-4 text-ink-muted" strokeWidth={2} />
          </span>
        </button>
      </li>
    )
  }

  return (
    <li className="space-y-3 bg-paper px-4 py-4">
      <input
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        className={inputClass}
      />
      <MoneyInput value={monto} onChange={setMonto} className={inputClass} />
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        className={inputClass}
      />
      <CategoryPicker selectedIds={categoriaIds} onChange={setCategoriaIds} />

      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteGasto.isPending}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-danger hover:opacity-80 disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
          {deleteGasto.isPending ? 'Eliminando…' : 'Eliminar'}
        </button>
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
            disabled={updateGasto.isPending || !descripcion.trim()}
            className="rounded-full bg-ink px-3 py-1.5 text-sm font-medium text-paper disabled:opacity-50"
          >
            {updateGasto.isPending ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>
    </li>
  )
}

export function Gastos() {
  const gastos = useGastos()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const ordenados = [...(gastos.data ?? [])].sort((a, b) => (a.fecha < b.fecha ? 1 : -1))

  return (
    <div className="min-h-svh bg-paper">
      <Header />

      <main className="mx-auto max-w-xl space-y-6 p-5 pb-24">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-medium text-ink">Gastos</h1>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:opacity-90"
          >
            Registrar gasto
          </button>
        </div>

        {gastos.isLoading && <p className="text-sm text-ink-muted">Cargando…</p>}

        {!gastos.isLoading && ordenados.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line px-4 py-8 text-center">
            <p className="text-sm text-ink-muted">Aún no has registrado ningún gasto.</p>
          </div>
        )}

        {ordenados.length > 0 && (
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper-raised">
            {ordenados.map((gasto) => (
              <GastoRow
                key={gasto.id}
                gasto={gasto}
                isEditing={editingId === gasto.id}
                onStartEdit={() => setEditingId(gasto.id)}
                onStopEdit={() => setEditingId(null)}
              />
            ))}
          </ul>
        )}
      </main>

      {showForm && <NewExpenseForm onDone={() => setShowForm(false)} />}
    </div>
  )
}
