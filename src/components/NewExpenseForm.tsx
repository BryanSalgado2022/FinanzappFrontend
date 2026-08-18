import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { CategoryPicker } from './CategoryPicker'
import { MoneyInput } from './MoneyInput'
import { useCreateGasto } from '../hooks/useGastos'

const inputClass =
  'w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none'

export function NewExpenseForm({ onDone }: { onDone: () => void }) {
  const [monto, setMonto] = useState('')
  const [fecha, setFecha] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [categoriaIds, setCategoriaIds] = useState<number[]>([])
  const createGasto = useCreateGasto()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    createGasto.mutate(
      {
        monto,
        fecha,
        descripcion,
        categoria_ids: categoriaIds.length > 0 ? categoriaIds : undefined,
      },
      { onSuccess: onDone },
    )
  }

  return (
    <div className="fixed inset-0 z-10 flex items-end justify-center bg-ink/50 backdrop-blur-sm sm:items-center">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90svh] w-full max-w-sm space-y-3.5 overflow-y-auto rounded-t-3xl border border-line bg-paper-raised p-6 shadow-xl sm:rounded-3xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-medium text-ink">Registrar gasto</h2>
          <button
            type="button"
            onClick={onDone}
            aria-label="Cerrar"
            className="flex h-7 w-7 items-center justify-center rounded-full text-ink-muted hover:bg-paper hover:text-ink"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <input
          required
          placeholder="¿En qué gastaste? (ej: Pizza)"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className={inputClass}
        />

        <MoneyInput
          placeholder="Monto"
          value={monto}
          onChange={setMonto}
          className={inputClass}
          required
        />

        <input
          required
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className={inputClass}
        />

        <CategoryPicker selectedIds={categoriaIds} onChange={setCategoriaIds} />

        {createGasto.isError && (
          <p className="text-sm text-danger">No se pudo registrar el gasto.</p>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onDone}
            className="rounded-full px-4 py-2 text-sm text-ink-muted transition hover:text-ink"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={createGasto.isPending}
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:opacity-90 disabled:opacity-50"
          >
            {createGasto.isPending ? 'Registrando…' : 'Registrar'}
          </button>
        </div>
      </form>
    </div>
  )
}
