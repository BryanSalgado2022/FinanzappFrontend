import { useState, type FormEvent } from 'react'
import { Landmark, Receipt, TrendingUp, X } from 'lucide-react'
import { useCreateConcept } from '../hooks/useConcepts'
import type { PeriodoTasa, TipoConcepto } from '../types'

const TIPO_OPTIONS: { value: TipoConcepto; label: string; Icon: typeof Landmark }[] = [
  { value: 'gasto_fijo', label: 'Gasto fijo', Icon: Receipt },
  { value: 'deuda', label: 'Deuda', Icon: Landmark },
  { value: 'ingreso', label: 'Ingreso', Icon: TrendingUp },
]

const inputClass =
  'w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none'

export function NewConceptForm({ onDone }: { onDone: () => void }) {
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState<TipoConcepto>('gasto_fijo')
  const [categoria, setCategoria] = useState('')
  const [valorTotal, setValorTotal] = useState('')
  const [montoPlaneado, setMontoPlaneado] = useState('')
  const [tasaInteres, setTasaInteres] = useState('')
  const [periodoTasa, setPeriodoTasa] = useState<PeriodoTasa>('mensual')
  const [numeroCuotas, setNumeroCuotas] = useState('')
  const [duracionMeses, setDuracionMeses] = useState('')
  const createConcept = useCreateConcept()

  const tieneAmortizacion = tipo === 'deuda' && tasaInteres !== '' && numeroCuotas !== ''
  const puedeTenerDuracion = tipo === 'gasto_fijo' || tipo === 'ingreso'

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    createConcept.mutate(
      {
        nombre,
        tipo,
        categoria: categoria || undefined,
        valor_total: tipo === 'deuda' && valorTotal ? valorTotal : undefined,
        monto_planeado: tieneAmortizacion ? undefined : montoPlaneado || undefined,
        tasa_interes: tieneAmortizacion ? tasaInteres : undefined,
        periodo_tasa: tieneAmortizacion ? periodoTasa : undefined,
        numero_cuotas: tieneAmortizacion ? Number(numeroCuotas) : undefined,
        duracion_meses:
          puedeTenerDuracion && duracionMeses !== '' ? Number(duracionMeses) : undefined,
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
          <h2 className="font-display text-xl font-medium text-ink">Nuevo concepto</h2>
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
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className={inputClass}
        />

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

        <input
          placeholder="Categoría (opcional)"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className={inputClass}
        />

        {tipo === 'deuda' && (
          <>
            <input
              placeholder="Valor total de la deuda"
              inputMode="decimal"
              value={valorTotal}
              onChange={(e) => setValorTotal(e.target.value)}
              className={inputClass}
            />

            <div className="rounded-xl border border-line p-3">
              <p className="mb-2 text-xs text-ink-muted">
                Opcional: si conoces la tasa de interés y el número de cuotas, calculamos la
                cuota fija automáticamente (no editable después).
              </p>
              <div className="flex gap-2">
                <input
                  placeholder="Tasa de interés (%)"
                  inputMode="decimal"
                  value={tasaInteres}
                  onChange={(e) => setTasaInteres(e.target.value)}
                  className={inputClass}
                />
                <select
                  value={periodoTasa}
                  onChange={(e) => setPeriodoTasa(e.target.value as PeriodoTasa)}
                  className={`${inputClass} w-auto`}
                >
                  <option value="mensual">mensual</option>
                  <option value="anual">anual (E.A.)</option>
                </select>
              </div>
              <input
                placeholder="Número de cuotas"
                inputMode="numeric"
                value={numeroCuotas}
                onChange={(e) => setNumeroCuotas(e.target.value)}
                className={`${inputClass} mt-2`}
              />
            </div>
          </>
        )}

        {!tieneAmortizacion && (
          <input
            placeholder={
              tipo === 'ingreso' ? 'Monto esperado este mes (opcional)' : 'Monto planeado este mes (opcional)'
            }
            inputMode="decimal"
            value={montoPlaneado}
            onChange={(e) => setMontoPlaneado(e.target.value)}
            className={inputClass}
          />
        )}

        {puedeTenerDuracion && (
          <div>
            <input
              placeholder="Duración en meses (opcional — indefinido si se deja vacío)"
              inputMode="numeric"
              value={duracionMeses}
              onChange={(e) => setDuracionMeses(e.target.value)}
              className={inputClass}
            />
            <p className="mt-1 px-1 text-xs text-ink-muted">
              {duracionMeses
                ? `Se generarán exactamente ${duracionMeses} meses y luego se detiene.`
                : 'Vacío = se repite indefinidamente cada mes, como hoy.'}
            </p>
          </div>
        )}

        {createConcept.isError && (
          <p className="text-sm text-danger">No se pudo crear el concepto.</p>
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
            disabled={createConcept.isPending}
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:opacity-90 disabled:opacity-50"
          >
            {createConcept.isPending ? 'Creando…' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  )
}
