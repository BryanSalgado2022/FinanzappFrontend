import { useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, Pencil, Trash2 } from 'lucide-react'
import { Header } from '../components/Header'
import { MoneyInput } from '../components/MoneyInput'
import { ProgressRing } from '../components/ProgressRing'
import {
  useAbonos,
  useCreateAbono,
  useDeleteAbono,
  useDeleteDeudor,
  useDeudor,
  useUpdateDeudor,
} from '../hooks/useDeudores'
import { formatCOP, formatFecha } from '../lib/format'

const inputClass =
  'w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none'

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

  const deudor = useDeudor(deudorId)
  const abonos = useAbonos(deudorId)
  const updateDeudor = useUpdateDeudor(deudorId)
  const deleteDeudor = useDeleteDeudor(deudorId)
  const createAbono = useCreateAbono(deudorId)

  if (deudor.isLoading || !deudor.data) {
    return (
      <div className="min-h-svh bg-paper">
        <Header />
        <p className="p-5 text-sm text-ink-muted">Cargando…</p>
      </div>
    )
  }

  const d = deudor.data
  const percentPaid = Math.round(
    ((Number(d.monto_total) - Number(d.saldo_restante)) / Number(d.monto_total)) * 100,
  )
  const abonosOrdenados = [...(abonos.data ?? [])].sort((a, b) => (a.fecha < b.fecha ? 1 : -1))

  const startEditingHeader = () => {
    setNombreDraft(d.nombre)
    setMontoTotalDraft(d.monto_total)
    setFechaDraft(d.fecha)
    setGarantiaDraft(d.garantia ?? '')
    setEditingHeader(true)
  }

  const handleFinish = () => updateDeudor.mutate({ activo: false })
  const handleDelete = () => deleteDeudor.mutate(undefined, { onSuccess: () => navigate('/deudores') })

  const handleCreateAbono = (event: FormEvent) => {
    event.preventDefault()
    createAbono.mutate(
      { monto: abonoMonto, fecha: abonoFecha },
      { onSuccess: () => { setAbonoMonto(''); setAbonoFecha('') } },
    )
  }

  return (
    <div className="min-h-svh bg-paper">
      <Header />

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

        <div>
          <h2 className="mb-3 font-display text-lg font-medium text-ink">Registrar abono</h2>
          <form onSubmit={handleCreateAbono} className="flex gap-2">
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
      </main>
    </div>
  )
}
