import { useState, type FormEvent } from 'react'
import { Landmark, Receipt, TrendingUp, X } from 'lucide-react'
import { CategoryPicker } from './CategoryPicker'
import { MoneyInput } from './MoneyInput'
import { useCreateConcept } from '../hooks/useConcepts'
import { diaVencimientoLabel, monthName } from '../lib/format'
import type { PeriodoTasa, TipoConcepto } from '../types'

const TIPO_OPTIONS: { value: TipoConcepto; label: string; Icon: typeof Landmark }[] = [
  { value: 'gasto_fijo', label: 'Pago mensual', Icon: Receipt },
  { value: 'deuda', label: 'Deuda', Icon: Landmark },
  { value: 'ingreso', label: 'Ingreso', Icon: TrendingUp },
]

const inputClass =
  'w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none'

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1)
const YEAR_OPTIONS = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i)

// Keeps only digits and a single decimal point - blocks letters, signs, and
// extra dots so the field can never hold anything but a plain percentage.
// Some mobile keyboards offer "," instead of "." as the decimal key
// (locale-dependent), so a comma is treated the same as a period rather
// than silently dropped.
function sanitizeTasaInteres(raw: string): string {
  const cleaned = raw.replace(',', '.').replace(/[^0-9.]/g, '')
  const firstDot = cleaned.indexOf('.')
  if (firstDot === -1) return cleaned
  return cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, '')
}

export function NewConceptForm({
  onDone,
  anio,
  mes,
  initialTipo = 'gasto_fijo',
  initialDiaVencimiento,
}: {
  onDone: () => void
  anio: number
  mes: number
  initialTipo?: TipoConcepto
  initialDiaVencimiento?: number
}) {
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState<TipoConcepto>(initialTipo)
  const [categoriaIds, setCategoriaIds] = useState<number[]>([])
  const [valorTotal, setValorTotal] = useState('')
  const [montoPlaneado, setMontoPlaneado] = useState('')
  const [tasaInteres, setTasaInteres] = useState('')
  const [periodoTasa, setPeriodoTasa] = useState<PeriodoTasa>('mensual')
  const [numeroCuotas, setNumeroCuotas] = useState('')
  const [cuotaInicial, setCuotaInicial] = useState('')
  const [duracionMeses, setDuracionMeses] = useState('')
  const [diaVencimiento, setDiaVencimiento] = useState(
    initialDiaVencimiento !== undefined ? String(initialDiaVencimiento) : '',
  )
  const [showStartMonth, setShowStartMonth] = useState(false)
  const [startAnio, setStartAnio] = useState(anio)
  const [startMes, setStartMes] = useState(mes)
  const createConcept = useCreateConcept()

  const tieneAmortizacion = tipo === 'deuda' && tasaInteres !== '' && numeroCuotas !== ''
  const puedeTenerDuracion = tipo === 'gasto_fijo' || tipo === 'ingreso'
  const puedeTenerDiaVencimiento = tipo === 'deuda' || tipo === 'gasto_fijo' || tipo === 'ingreso'
  const diaLabel = diaVencimientoLabel(tipo)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    createConcept.mutate(
      {
        nombre,
        tipo,
        categoria_ids: categoriaIds.length > 0 ? categoriaIds : undefined,
        valor_total: tipo === 'deuda' && valorTotal ? valorTotal : undefined,
        monto_planeado: tieneAmortizacion ? undefined : montoPlaneado || undefined,
        tasa_interes: tieneAmortizacion ? tasaInteres : undefined,
        periodo_tasa: tieneAmortizacion ? periodoTasa : undefined,
        numero_cuotas: tieneAmortizacion ? Number(numeroCuotas) : undefined,
        cuota_inicial: tieneAmortizacion && cuotaInicial !== '' ? Number(cuotaInicial) : undefined,
        duracion_meses:
          puedeTenerDuracion && duracionMeses !== '' ? Number(duracionMeses) : undefined,
        dia_vencimiento:
          puedeTenerDiaVencimiento && diaVencimiento !== ''
            ? Math.min(28, Math.max(1, Number(diaVencimiento)))
            : undefined,
        anio: showStartMonth ? startAnio : anio,
        mes: showStartMonth ? startMes : mes,
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
          <div>
            <h2 className="font-display text-xl font-medium text-ink">Nuevo concepto</h2>
            <p className="text-xs text-ink-muted">
              Se planeará para {monthName(mes)} {anio}
            </p>
          </div>
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

        {!showStartMonth ? (
          <button
            type="button"
            onClick={() => setShowStartMonth(true)}
            className="text-left text-xs text-ink-muted underline decoration-dotted hover:text-ink"
          >
            ¿Empieza en otro mes?
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <select
              value={startMes}
              onChange={(e) => setStartMes(Number(e.target.value))}
              className={`${inputClass} !w-auto`}
            >
              {MONTH_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {monthName(m)}
                </option>
              ))}
            </select>
            <select
              value={startAnio}
              onChange={(e) => setStartAnio(Number(e.target.value))}
              className={`${inputClass} !w-auto`}
            >
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                setShowStartMonth(false)
                setStartAnio(anio)
                setStartMes(mes)
              }}
              className="text-xs text-ink-muted underline decoration-dotted hover:text-ink"
            >
              Cancelar
            </button>
          </div>
        )}

        <CategoryPicker selectedIds={categoriaIds} onChange={setCategoriaIds} />

        {tipo === 'deuda' && (
          <>
            <MoneyInput
              placeholder="Valor total de la deuda"
              value={valorTotal}
              onChange={setValorTotal}
              className={inputClass}
            />

            <div className="rounded-xl border border-line p-3">
              <p className="mb-2 text-xs text-ink-muted">
                Opcional: si conoces la tasa de interés y el número de cuotas, calculamos la
                cuota fija automáticamente (no editable después).
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
                    placeholder="¿Ya vas pagando? ¿En qué cuota vas? (opcional)"
                    inputMode="numeric"
                    value={cuotaInicial}
                    onChange={(e) => setCuotaInicial(e.target.value)}
                    className={inputClass}
                  />
                  <p className="mt-1 px-1 text-xs text-ink-muted">
                    Si ya llevas cuotas pagadas fuera de la app, indica en cuál vas — no se
                    generarán las anteriores. Vacío = empieza en la cuota 1. No editable después.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {!tieneAmortizacion && (
          <MoneyInput
            placeholder={
              tipo === 'ingreso' ? 'Monto esperado este mes (opcional)' : 'Monto planeado este mes (opcional)'
            }
            value={montoPlaneado}
            onChange={setMontoPlaneado}
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

        {puedeTenerDiaVencimiento && (
          <div>
            <input
              placeholder={`${diaLabel.field} (opcional, 1-28)`}
              inputMode="numeric"
              value={diaVencimiento}
              onChange={(e) => setDiaVencimiento(e.target.value)}
              className={inputClass}
            />
            <p className="mt-1 px-1 text-xs text-ink-muted">
              {diaVencimiento
                ? tipo === 'ingreso'
                  ? 'Se usará para ubicar este ingreso en la Agenda.'
                  : 'Se usará para marcar cuotas vencidas si no las has pagado a tiempo.'
                : `Vacío = sin ${diaLabel.field.toLowerCase()}, como hoy.`}
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
