import { useState, type FormEvent } from 'react'
import { ArrowDownCircle, ArrowUpCircle, X } from 'lucide-react'
import { MoneyInput } from './MoneyInput'
import { useCreateAporte } from '../hooks/useAhorros'
import type { TipoAporte } from '../types'

const inputClass =
  'w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none'

const TIPO_OPTIONS: { value: TipoAporte; label: string; Icon: typeof ArrowUpCircle }[] = [
  { value: 'aporte', label: 'Aporte', Icon: ArrowUpCircle },
  { value: 'retiro', label: 'Retiro', Icon: ArrowDownCircle },
]

export function NewAporteAhorroForm({ onDone }: { onDone: () => void }) {
  const [monto, setMonto] = useState('')
  const [fecha, setFecha] = useState('')
  const [tipo, setTipo] = useState<TipoAporte>('aporte')
  const createAporte = useCreateAporte()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    createAporte.mutate({ monto, fecha, tipo }, { onSuccess: onDone })
  }

  return (
    <div className="fixed inset-0 z-10 flex items-end justify-center bg-ink/50 backdrop-blur-sm sm:items-center">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90svh] w-full max-w-sm space-y-3.5 overflow-y-auto rounded-t-3xl border border-line bg-paper-raised p-6 shadow-xl sm:rounded-3xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-medium text-ink">Nuevo movimiento</h2>
          <button
            type="button"
            onClick={onDone}
            aria-label="Cerrar"
            className="flex h-7 w-7 items-center justify-center rounded-full text-ink-muted hover:bg-paper hover:text-ink"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <div className="flex gap-1.5 rounded-xl bg-paper p-1">
          {TIPO_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setTipo(option.value)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium transition ${
                tipo === option.value ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink'
              }`}
            >
              <option.Icon className="h-3.5 w-3.5" strokeWidth={2} />
              {option.label}
            </button>
          ))}
        </div>

        <MoneyInput placeholder="Monto" value={monto} onChange={setMonto} className={inputClass} required />

        <input
          required
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className={inputClass}
        />

        {createAporte.isError && (
          <p className="text-sm text-danger">No se pudo guardar el movimiento.</p>
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
            disabled={createAporte.isPending}
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:opacity-90 disabled:opacity-50"
          >
            {createAporte.isPending ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  )
}
