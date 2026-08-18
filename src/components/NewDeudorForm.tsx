import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { MoneyInput } from './MoneyInput'
import { useCreateDeudor } from '../hooks/useDeudores'

const inputClass =
  'w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none'

export function NewDeudorForm({ onDone }: { onDone: () => void }) {
  const [nombre, setNombre] = useState('')
  const [montoTotal, setMontoTotal] = useState('')
  const [fecha, setFecha] = useState('')
  const [garantia, setGarantia] = useState('')
  const createDeudor = useCreateDeudor()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    createDeudor.mutate(
      {
        nombre,
        monto_total: montoTotal,
        fecha,
        garantia: garantia || undefined,
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
          <h2 className="font-display text-xl font-medium text-ink">Nuevo deudor</h2>
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
          placeholder="¿A quién le prestaste?"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className={inputClass}
        />

        <MoneyInput
          placeholder="Monto"
          value={montoTotal}
          onChange={setMontoTotal}
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

        <input
          placeholder="Garantía (opcional)"
          value={garantia}
          onChange={(e) => setGarantia(e.target.value)}
          className={inputClass}
        />

        {createDeudor.isError && (
          <p className="text-sm text-danger">No se pudo crear el deudor.</p>
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
            disabled={createDeudor.isPending}
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:opacity-90 disabled:opacity-50"
          >
            {createDeudor.isPending ? 'Creando…' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  )
}
