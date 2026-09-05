import { useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, Pencil, Trash2 } from 'lucide-react'
import { MoneyInput } from '../components/MoneyInput'
import { ProgressRing } from '../components/ProgressRing'
import {
  useAbonos,
  useCreateAbono,
  useCuotasDeudor,
  useDeleteAbono,
  useDeleteDeudor,
  useDeudor,
  useMarkCuota,
  useUpdateAmortizacionDeudor,
  useUpdateDeudor,
} from '../hooks/useDeudores'
import { formatCOP, formatFecha, monthName } from '../lib/format'
import type { CuotaDeudor, PeriodoTasa } from '../types'

const inputClass =
  'w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none'

// Keeps only digits and a single decimal point - blocks letters, signs, and
// extra dots so the field can never hold anything but a plain percentage.
// Mirrors NewConceptForm.tsx's sanitizer for consistent input behavior.
function sanitizeTasaInteres(raw: string): string {
  const cleaned = raw.replace(',', '.').replace(/[^0-9.]/g, '')
  const firstDot = cleaned.indexOf('.')
  if (firstDot === -1) return cleaned
  return cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, '')
}

function CuotaRow({ deudorId, cuota }: { deudorId: number; cuota: CuotaDeudor }) {
  const markCuota = useMarkCuota(deudorId)

  return (
    <li className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
      <span className="text-ink-muted">
        {monthName(cuota.mes)} {cuota.anio}
        {cuota.pagado && cuota.fecha_pago && (
          <span className="ml-1.5 text-xs">· pagado el {formatFecha(cuota.fecha_pago)}</span>
        )}
      </span>
      <span className="flex items-center gap-3">
        <span className="font-tabular text-ink">{formatCOP(cuota.monto_pagado ?? cuota.monto_planeado)}</span>
        {cuota.pagado ? (
          <button
            type="button"
            onClick={() => markCuota.mutate({ anio: cuota.anio, mes: cuota.mes, pagado: false })}
            disabled={markCuota.isPending}
            className="text-xs text-ink-muted underline decoration-line underline-offset-4 hover:text-ink disabled:opacity-50"
          >
            Marcar no pagado
          </button>
        ) : (
          <button
            type="button"
            onClick={() => markCuota.mutate({ anio: cuota.anio, mes: cuota.mes, pagado: true })}
            disabled={markCuota.isPending}
            className="rounded-full bg-ink px-3 py-1 text-xs font-medium text-paper disabled:opacity-50"
          >
            Marcar pagado
          </button>
        )}
      </span>
    </li>
  )
}

function AbonoRow({ deudorId, abono }: { deudorId: number; abono: { id: number; monto: string; fecha: string } }) {
  const deleteAbono = useDeleteAbono(deudorId, abono.id)

  return (
    <li className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
      <span className="text-ink-muted">{formatFecha(abono.fecha)}</span>
      <span className="flex items-center gap-3">
        <span className="font-tabular text-ink">{formatCOP(abono.monto)}</span>
        <button
          type="button"
          onClick={() => deleteAbono.mutate()}
          disabled={deleteAbono.isPending}
          aria-label="Eliminar abono"
          className="text-ink-muted hover:text-danger disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </span>
    </li>
  )
}

export function DeudorDetail() {
  const { id } = useParams<{ id: string }>()
  const deudorId = Number(id)
  const navigate = useNavigate()

  const [editingHeader, setEditingHeader] = useState(false)
  const [nombreDraft, setNombreDraft] = useState('')
  const [montoTotalDraft, setMontoTotalDraft] = useState('')
  const [fechaDraft, setFechaDraft] = useState('')
  const [garantiaDraft, setGarantiaDraft] = useState('')

  const [abonoMonto, setAbonoMonto] = useState('')
  const [abonoFecha, setAbonoFecha] = useState('')
  const [abonoInteres, setAbonoInteres] = useState('')
  const [abonoError, setAbonoError] = useState<string | null>(null)

  const [editingTerminos, setEditingTerminos] = useState(false)
  const [confirmingTerminos, setConfirmingTerminos] = useState(false)
  const [terminosMontoTotal, setTerminosMontoTotal] = useState('')
  const [tasaInteresDraft, setTasaInteresDraft] = useState('')
  const [periodoTasaDraft, setPeriodoTasaDraft] = useState<PeriodoTasa>('mensual')
  const [numeroCuotasDraft, setNumeroCuotasDraft] = useState('')

  const deudor = useDeudor(deudorId)
  const abonos = useAbonos(deudorId)
  const cuotas = useCuotasDeudor(deudorId)
  const updateDeudor = useUpdateDeudor(deudorId)
  const deleteDeudor = useDeleteDeudor(deudorId)
  const createAbono = useCreateAbono(deudorId)
  const updateAmortizacion = useUpdateAmortizacionDeudor(deudorId)

  if (deudor.isLoading || !deudor.data) {
    return <p className="p-5 text-sm text-ink-muted">Cargando…</p>
  }

  const d = deudor.data
  const percentPaid = Math.round(
    ((Number(d.monto_total) - Number(d.saldo_restante)) / Number(d.monto_total)) * 100,
  )
  const abonosOrdenados = [...(abonos.data ?? [])].sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
  const cuotasOrdenadas = [...(cuotas.data ?? [])].sort((a, b) => (a.anio - b.anio) || (a.mes - b.mes))
  const mesesPendientes = (cuotas.data ?? []).filter((c) => !c.pagado).length

  const startEditingHeader = () => {
    setNombreDraft(d.nombre)
    setMontoTotalDraft(d.monto_total)
    setFechaDraft(d.fecha)
    setGarantiaDraft(d.garantia ?? '')
    setEditingHeader(true)
  }

  const startEditingTerminos = () => {
    setTerminosMontoTotal(d.monto_total)
    setTasaInteresDraft(d.tasa_interes ?? '')
    setPeriodoTasaDraft(d.periodo_tasa ?? 'mensual')
    setNumeroCuotasDraft(d.numero_cuotas !== null ? String(d.numero_cuotas) : '')
    updateAmortizacion.reset()
    setEditingTerminos(true)
  }

  const handleSubmitTerminos = () => {
    updateAmortizacion.mutate(
      {
        monto_total: terminosMontoTotal,
        tasa_interes: tasaInteresDraft,
        periodo_tasa: periodoTasaDraft,
        numero_cuotas: Number(numeroCuotasDraft),
      },
      {
        onSuccess: () => {
          setConfirmingTerminos(false)
          setEditingTerminos(false)
        },
      },
    )
  }

  const handleFinish = () => updateDeudor.mutate({ activo: false })
  const handleDelete = () => deleteDeudor.mutate(undefined, { onSuccess: () => navigate('/deudores') })

  const handleCreateAbono = (event: FormEvent) => {
    event.preventDefault()
    setAbonoError(null)
    if (abonoInteres !== '' && Number(abonoInteres) > Number(abonoMonto)) {
      setAbonoError('El interés no puede ser mayor que el monto pagado.')
      return
    }
    createAbono.mutate(
      { monto: abonoMonto, fecha: abonoFecha, interes: abonoInteres || undefined },
      { onSuccess: () => { setAbonoMonto(''); setAbonoFecha(''); setAbonoInteres('') } },
    )
  }

  return (
    <>
      <main className="mx-auto max-w-xl space-y-8 p-5 pb-24">
        <div className="rounded-3xl border border-line bg-paper-raised p-6">
          {!editingHeader ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium tracking-wide text-ink-muted uppercase">
                    Deudor
                    {!d.activo ? ' · Terminado' : ''}
                  </p>
                  <h1 className="mt-1 truncate font-display text-2xl font-medium text-ink">{d.nombre}</h1>
                </div>
                <button
                  type="button"
                  onClick={startEditingHeader}
                  className="flex shrink-0 items-center gap-1.5 text-sm text-ink-muted underline decoration-line underline-offset-4 hover:text-ink"
                >
                  <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
                  Editar
                </button>
              </div>

              <div className="mt-5 flex items-center gap-5 border-t border-line pt-5">
                <div className="relative shrink-0">
                  <ProgressRing percent={percentPaid} />
                  <span className="absolute inset-0 flex items-center justify-center font-tabular text-sm font-semibold text-ink">
                    {percentPaid}%
                  </span>
                </div>
                <div>
                  <p className="font-tabular font-display text-2xl font-semibold text-ink">
                    {formatCOP(d.saldo_restante)}
                  </p>
                  <p className="text-xs text-ink-muted">
                    de {formatCOP(d.monto_total)} prestados originalmente
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-paper px-3 py-2.5 text-center">
                <div>
                  <p className="text-xs text-ink-muted">Desde</p>
                  <p className="font-tabular text-sm font-semibold text-ink">{formatFecha(d.fecha)}</p>
                </div>
                {d.garantia && (
                  <div>
                    <p className="text-xs text-ink-muted">Garantía</p>
                    <p className="font-tabular text-sm font-semibold text-ink">{d.garantia}</p>
                  </div>
                )}
              </div>

              {d.cuota_fija !== null && !editingTerminos && (
                <div className="mt-4 rounded-xl bg-paper px-3 py-2.5">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-xs text-ink-muted">Cuota fija</p>
                      <p className="font-tabular text-sm font-semibold text-ink">
                        {formatCOP(d.cuota_fija)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-ink-muted">Tasa</p>
                      <p className="font-tabular text-sm font-semibold text-ink">
                        {d.tasa_interes}% {d.periodo_tasa}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-ink-muted">Cuotas</p>
                      <p className="font-tabular text-sm font-semibold text-ink">{d.numero_cuotas}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={startEditingTerminos}
                    className="mt-2 flex w-full items-center justify-center gap-1.5 text-xs text-ink-muted underline decoration-line underline-offset-4 hover:text-ink"
                  >
                    <Pencil className="h-3 w-3" strokeWidth={2} />
                    Editar términos
                  </button>
                </div>
              )}

              {editingTerminos && (
                <div className="mt-4 space-y-3 rounded-xl border border-line p-3">
                  <p className="text-xs text-ink-muted">
                    Corrige el monto total, la tasa o el número de cuotas — se recalcula la
                    cuota fija. La cuota inicial no cambia.
                  </p>
                  <MoneyInput
                    placeholder="Monto total"
                    value={terminosMontoTotal}
                    onChange={setTerminosMontoTotal}
                    className={inputClass}
                  />
                  <div className="flex gap-2">
                    <div className="relative min-w-0 flex-1">
                      <input
                        placeholder="Tasa de interés, ej: 27.7"
                        inputMode="decimal"
                        value={tasaInteresDraft}
                        onChange={(e) => setTasaInteresDraft(sanitizeTasaInteres(e.target.value))}
                        className={`${inputClass} pr-7`}
                      />
                      <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm text-ink-muted">
                        %
                      </span>
                    </div>
                    <select
                      value={periodoTasaDraft}
                      onChange={(e) => setPeriodoTasaDraft(e.target.value as PeriodoTasa)}
                      className={`${inputClass} !w-auto shrink-0`}
                    >
                      <option value="mensual">mensual</option>
                      <option value="anual">anual (E.A.)</option>
                    </select>
                  </div>
                  <input
                    placeholder="Número de cuotas"
                    inputMode="numeric"
                    value={numeroCuotasDraft}
                    onChange={(e) => setNumeroCuotasDraft(e.target.value)}
                    className={inputClass}
                  />

                  {confirmingTerminos && (
                    <p className="rounded-lg bg-warn-soft px-3 py-2 text-xs text-ink">
                      Esto recalculará tu cuota fija y reemplazará los {mesesPendientes}{' '}
                      {mesesPendientes === 1
                        ? 'mes pendiente que aún no has cobrado'
                        : 'meses pendientes que aún no has cobrado'}
                      . Los meses ya cobrados no se verán afectados.
                    </p>
                  )}

                  {updateAmortizacion.isError && (
                    <p className="text-xs text-danger">{updateAmortizacion.error.message}</p>
                  )}

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTerminos(false)
                        setConfirmingTerminos(false)
                      }}
                      className="rounded-full px-3 py-1.5 text-sm text-ink-muted hover:text-ink"
                    >
                      Cancelar
                    </button>
                    {!confirmingTerminos ? (
                      <button
                        type="button"
                        onClick={() => setConfirmingTerminos(true)}
                        className="rounded-full bg-ink px-3 py-1.5 text-sm font-medium text-paper"
                      >
                        Guardar
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmitTerminos}
                        disabled={updateAmortizacion.isPending}
                        className="rounded-full bg-ink px-3 py-1.5 text-sm font-medium text-paper disabled:opacity-50"
                      >
                        {updateAmortizacion.isPending ? 'Guardando…' : 'Confirmar'}
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-5 flex gap-4 border-t border-line pt-4 text-sm">
                {d.activo && (
                  <button
                    type="button"
                    onClick={handleFinish}
                    className="flex items-center gap-1.5 text-ink-muted hover:text-ink"
                  >
                    <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
                    Marcar como terminado
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 text-danger hover:opacity-80"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2} />
                  Eliminar
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <input
                value={nombreDraft}
                onChange={(e) => setNombreDraft(e.target.value)}
                className={inputClass}
              />
              <MoneyInput
                value={montoTotalDraft}
                onChange={setMontoTotalDraft}
                placeholder="Monto"
                className={inputClass}
              />
              <input
                type="date"
                value={fechaDraft}
                onChange={(e) => setFechaDraft(e.target.value)}
                className={inputClass}
              />
              <input
                placeholder="Garantía (opcional)"
                value={garantiaDraft}
                onChange={(e) => setGarantiaDraft(e.target.value)}
                className={inputClass}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingHeader(false)}
                  className="rounded-full px-3 py-1.5 text-sm text-ink-muted hover:text-ink"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateDeudor.mutate(
                      {
                        nombre: nombreDraft,
                        monto_total: montoTotalDraft,
                        fecha: fechaDraft,
                        garantia: garantiaDraft || undefined,
                      },
                      { onSuccess: () => setEditingHeader(false) },
                    )
                  }
                  className="rounded-full bg-ink px-3 py-1.5 text-sm font-medium text-paper"
                >
                  Guardar
                </button>
              </div>
            </div>
          )}
        </div>

        {d.cuota_fija === null ? (
          <>
            <div>
              <h2 className="mb-3 font-display text-lg font-medium text-ink">Registrar abono</h2>
              <form onSubmit={handleCreateAbono} className="space-y-2">
                <div className="flex gap-2">
                  <MoneyInput
                    placeholder="Monto"
                    value={abonoMonto}
                    onChange={setAbonoMonto}
                    className={inputClass}
                    required
                  />
                  <input
                    required
                    type="date"
                    value={abonoFecha}
                    onChange={(e) => setAbonoFecha(e.target.value)}
                    className={inputClass}
                  />
                  <button
                    type="submit"
                    disabled={createAbono.isPending}
                    className="shrink-0 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:opacity-90 disabled:opacity-50"
                  >
                    Guardar
                  </button>
                </div>
                <MoneyInput
                  placeholder="¿Cuánto de este pago es interés? (opcional)"
                  value={abonoInteres}
                  onChange={setAbonoInteres}
                  className={inputClass}
                />
                {abonoError && <p className="text-sm text-danger">{abonoError}</p>}
              </form>
            </div>

            <div>
              <h2 className="mb-3 font-display text-lg font-medium text-ink">Historial de abonos</h2>
              {abonosOrdenados.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-line px-4 py-8 text-center">
                  <p className="text-sm text-ink-muted">Aún no hay abonos registrados.</p>
                </div>
              ) : (
                <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper-raised">
                  {abonosOrdenados.map((abono) => (
                    <AbonoRow key={abono.id} deudorId={deudorId} abono={abono} />
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : (
          <div>
            <h2 className="mb-3 font-display text-lg font-medium text-ink">Cronograma de pagos</h2>
            {cuotasOrdenadas.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line px-4 py-8 text-center">
                <p className="text-sm text-ink-muted">Cargando cronograma…</p>
              </div>
            ) : (
              <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper-raised">
                {cuotasOrdenadas.map((cuota) => (
                  <CuotaRow key={cuota.id} deudorId={deudorId} cuota={cuota} />
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
    </>
  )
}
