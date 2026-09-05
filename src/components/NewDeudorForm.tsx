import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { MoneyInput } from './MoneyInput'
import { useCreateDeudor } from '../hooks/useDeudores'
import type { PeriodoTasa } from '../types'

const inputClass =
  'w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none'

// Keeps only digits and a single decimal point - blocks letters, signs, and
// extra dots so the field can never hold anything but a plain percentage.
// Mirrors NewConceptForm.tsx's sanitizer for consistent input behavior.
function sanitizeTasaInteres(raw: string): string {
  const cleaned = raw.replace(',', '.').replace(/[^0-9.]/g, '')
  const firstDot = cleaned.indexOf('.')
  if (firstDot === -1) return cleaned
  return cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, '')
}

export function NewDeudorForm({ onDone }: { onDone: () => void }) {
  const [nombre, setNombre] = useState('')
  const [montoTotal, setMontoTotal] = useState('')
  const [fecha, setFecha] = useState('')
  const [garantia, setGarantia] = useState('')
  const [tasaInteres, setTasaInteres] = useState('')
  const [periodoTasa, setPeriodoTasa] = useState<PeriodoTasa>('mensual')
  const [numeroCuotas, setNumeroCuotas] = useState('')
  const [cuotaInicial, setCuotaInicial] = useState('')
  const createDeudor = useCreateDeudor()

  const tieneAmortizacion = tasaInteres !== '' && numeroCuotas !== ''

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    createDeudor.mutate(
      {
        nombre,
        monto_total: montoTotal,
        fecha,
        garantia: garantia || undefined,
        tasa_interes: tieneAmortizacion ? tasaInteres : undefined,
        periodo_tasa: tieneAmortizacion ? periodoTasa : undefined,
        numero_cuotas: tieneAmortizacion ? Number(numeroCuotas) : undefined,
        cuota_inicial: tieneAmortizacion && cuotaInicial !== '' ? Number(cuotaInicial) : undefined,
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

        <div className="rounded-xl border border-line p-3">
          <p className="mb-2 text-xs text-ink-muted">
            Opcional: si conoces la tasa de interés y el número de cuotas, calculamos la
            cuota fija automáticamente (no editable después, salvo con "Editar términos").
          </p>
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <input
                placeholder="Tasa de interés, ej: 27.7"
                inputMode="decimal"
                value={tasaInteres}
                onChange={(e) => setTasaInteres(sanitizeTasaInteres(e.target.value))}
                className={`${inputClass} pr-7`}
              />
              <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm text-ink-muted">
                %
              </span>
            </div>
            <select
              value={periodoTasa}
              onChange={(e) => setPeriodoTasa(e.target.value as PeriodoTasa)}
              className={`${inputClass} !w-auto shrink-0`}
            >
              <option value="mensual">mensual</option>
              <option value="anual">anual (E.A.)</option>
            </select>
          </div>
          <p className="mt-1 px-1 text-xs text-ink-muted">
            Escribe el número del porcentaje tal cual (ej: 27.7 para 27.7%), no la fracción
            (0.277).
          </p>
          <input
            placeholder="Número de cuotas"
            inputMode="numeric"
            value={numeroCuotas}
            onChange={(e) => setNumeroCuotas(e.target.value)}
            className={`${inputClass} mt-2`}
          />
          {tieneAmortizacion && (
            <div className="mt-2">
              <input
                placeholder="¿Ya vas cobrando? ¿En qué cuota vas? (opcional)"
                inputMode="numeric"
                value={cuotaInicial}
                onChange={(e) => setCuotaInicial(e.target.value)}
                className={inputClass}
              />
              <p className="mt-1 px-1 text-xs text-ink-muted">
                Si ya llevas cuotas cobradas fuera de la app, indica en cuál vas — no se
                generarán las anteriores. Vacío = empieza en la cuota 1. No editable después.
              </p>
            </div>
          )}
        </div>

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
