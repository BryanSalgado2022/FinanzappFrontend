import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronDown, ChevronLeft, ChevronRight, Pencil, CheckCircle2, Trash2 } from 'lucide-react'
import { CategoryPicker } from '../components/CategoryPicker'
import { MonthEntryLegend, MonthEntryRow } from '../components/MonthEntryRow'
import { ProgressRing } from '../components/ProgressRing'
import { useConcept, useDeleteConcept, useUpdateConcept } from '../hooks/useConcepts'
import { useConceptEntries, useDeleteEntry, useUpsertEntry } from '../hooks/useEntries'
import { diaVencimientoLabel, formatCOP, quarterLabel, tipoDotClass, tipoLabel } from '../lib/format'

const now = new Date()
const QUARTERS: { quarter: 1 | 2 | 3 | 4; months: number[] }[] = [
  { quarter: 1, months: [1, 2, 3] },
  { quarter: 2, months: [4, 5, 6] },
  { quarter: 3, months: [7, 8, 9] },
  { quarter: 4, months: [10, 11, 12] },
]

const inputClass =
  'w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none'

export function ConceptDetail() {
  const { id } = useParams<{ id: string }>()
  const conceptoId = Number(id)
  const navigate = useNavigate()

  const [anio, setAnio] = useState(now.getFullYear())
  const [editingHeader, setEditingHeader] = useState(false)
  const [nombreDraft, setNombreDraft] = useState('')
  const [categoriaIdsDraft, setCategoriaIdsDraft] = useState<number[]>([])
  const [diaVencimientoDraft, setDiaVencimientoDraft] = useState('')
  // Accordion: only one month row can be in edit mode across the whole year.
  const [editingMes, setEditingMes] = useState<number | null>(null)
  // Fully-past quarters of the current year start collapsed, independently
  // toggleable per quarter - resets whenever the selected year changes so it
  // doesn't leak a stale "expanded" state in.
  const [trimestresExpandidos, setTrimestresExpandidos] = useState<Set<number>>(new Set())

  const concept = useConcept(conceptoId)
  const entries = useConceptEntries(conceptoId)
  const upsertEntry = useUpsertEntry(conceptoId)
  const deleteEntry = useDeleteEntry(conceptoId)
  const updateConcept = useUpdateConcept(conceptoId)
  const deleteConcept = useDeleteConcept(conceptoId)

  if (concept.isLoading || !concept.data) {
    return <p className="p-5 text-sm text-ink-muted">Cargando…</p>
  }

  const c = concept.data
  const entriesByMonth = new Map((entries.data ?? []).filter((e) => e.anio === anio).map((e) => [e.mes, e]))

  const isDebt = c.tipo === 'deuda' && c.valor_total !== null && c.saldo_restante !== null
  const percentPaid = isDebt
    ? Math.round(((Number(c.valor_total) - Number(c.saldo_restante)) / Number(c.valor_total)) * 100)
    : 0
  const puedeTenerDiaVencimiento = c.tipo === 'deuda' || c.tipo === 'gasto_fijo' || c.tipo === 'ingreso'
  const diaLabel = diaVencimientoLabel(c.tipo)
  // Mirrors the backend's fixed-schedule condition (entry_service.py) - only
  // concepts without a generated schedule allow deleting an individual entry.
  const puedeEliminarse = c.duracion_meses === null && !(c.tasa_interes !== null && c.numero_cuotas !== null)

  const esAnioActual = anio === now.getFullYear()
  const mesActual = now.getMonth() + 1
  const creationYear = new Date(c.created_at).getFullYear()
  const puedeIrAAnioAnterior = anio > creationYear

  const toggleTrimestre = (quarter: number) => {
    setTrimestresExpandidos((prev) => {
      const next = new Set(prev)
      if (next.has(quarter)) {
        next.delete(quarter)
      } else {
        next.add(quarter)
      }
      return next
    })
  }

  const goToPreviousYear = () => {
    setTrimestresExpandidos(new Set())
    setAnio((y) => y - 1)
  }
  const goToNextYear = () => {
    setTrimestresExpandidos(new Set())
    setAnio((y) => y + 1)
  }

  const startEditingHeader = () => {
    setNombreDraft(c.nombre)
    setCategoriaIdsDraft(c.categorias.map((cat) => cat.id))
    setDiaVencimientoDraft(c.dia_vencimiento !== null ? String(c.dia_vencimiento) : '')
    setEditingHeader(true)
  }

  const handleFinish = () => updateConcept.mutate({ activo: false })
  const handleDelete = () => deleteConcept.mutate(undefined, { onSuccess: () => navigate('/') })

  return (
    <>
      <main className="mx-auto max-w-xl space-y-8 p-5 pb-24 lg:max-w-3xl">
        <div className="rounded-3xl border border-line bg-paper-raised p-6">
          {!editingHeader ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${tipoDotClass(c.tipo)}`} />
                    <p className="text-xs font-medium tracking-wide text-ink-muted uppercase">
                      {tipoLabel(c.tipo)}
                      {!c.activo ? ' · Terminado' : ''}
                    </p>
                    {c.categorias.some((cat) => cat.emoji) && (
                      <span className="text-sm" aria-hidden>
                        {c.categorias
                          .filter((cat) => cat.emoji)
                          .map((cat) => cat.emoji)
                          .join(' ')}
                      </span>
                    )}
                  </div>
                  <h1 className="mt-1 truncate font-display text-2xl font-medium text-ink">{c.nombre}</h1>
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

              {isDebt && (
                <div className="mt-5 flex items-center gap-5 border-t border-line pt-5">
                  <div className="relative shrink-0">
                    <ProgressRing percent={percentPaid} />
                    <span className="absolute inset-0 flex items-center justify-center font-tabular text-sm font-semibold text-ink">
                      {percentPaid}%
                    </span>
                  </div>
                  <div>
                    <p className="font-tabular font-display text-2xl font-semibold text-ink">
                      {formatCOP(c.saldo_restante!)}
                    </p>
                    <p className="text-xs text-ink-muted">
                      de {formatCOP(c.valor_total!)} prestados originalmente
                    </p>
                  </div>
                </div>
              )}

              {c.cuota_fija !== null && (
                <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl bg-paper px-3 py-2.5 text-center">
                  <div>
                    <p className="text-xs text-ink-muted">Cuota fija</p>
                    <p className="font-tabular text-sm font-semibold text-ink">
                      {formatCOP(c.cuota_fija)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-ink-muted">Tasa</p>
                    <p className="font-tabular text-sm font-semibold text-ink">
                      {c.tasa_interes}% {c.periodo_tasa}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-ink-muted">Cuotas</p>
                    <p className="font-tabular text-sm font-semibold text-ink">{c.numero_cuotas}</p>
                  </div>
                </div>
              )}

              {c.cuota_inicial !== null && c.cuota_inicial > 1 && (
                <div className="mt-4 rounded-xl bg-paper px-3 py-2.5 text-center">
                  <p className="text-xs text-ink-muted">Punto de partida</p>
                  <p className="font-tabular text-sm font-semibold text-ink">
                    Empezó en la cuota {c.cuota_inicial} de {c.numero_cuotas}
                  </p>
                </div>
              )}

              {c.duracion_meses !== null && (
                <div className="mt-4 rounded-xl bg-paper px-3 py-2.5 text-center">
                  <p className="text-xs text-ink-muted">Duración fija</p>
                  <p className="font-tabular text-sm font-semibold text-ink">
                    {c.duracion_meses} {c.duracion_meses === 1 ? 'mes' : 'meses'}
                  </p>
                </div>
              )}

              {c.dia_vencimiento !== null && (
                <div className="mt-4 rounded-xl bg-paper px-3 py-2.5 text-center">
                  <p className="text-xs text-ink-muted">{diaLabel.field}</p>
                  <p className="font-tabular text-sm font-semibold text-ink">
                    {diaLabel.display(c.dia_vencimiento)}
                  </p>
                </div>
              )}

              <div className="mt-5 flex gap-4 border-t border-line pt-4 text-sm">
                {c.activo && (
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
              <CategoryPicker selectedIds={categoriaIdsDraft} onChange={setCategoriaIdsDraft} />
              {puedeTenerDiaVencimiento && (
                <input
                  placeholder={`${diaLabel.field} (opcional, 1-28)`}
                  inputMode="numeric"
                  value={diaVencimientoDraft}
                  onChange={(e) => setDiaVencimientoDraft(e.target.value)}
                  className={inputClass}
                />
              )}
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
                    updateConcept.mutate(
                      {
                        nombre: nombreDraft,
                        categoria_ids: categoriaIdsDraft,
                        dia_vencimiento:
                          puedeTenerDiaVencimiento && diaVencimientoDraft !== ''
                            ? Math.min(28, Math.max(1, Number(diaVencimientoDraft)))
                            : undefined,
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

        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={goToPreviousYear}
            disabled={!puedeIrAAnioAnterior}
            aria-label="Año anterior"
            className={`flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition ${
              puedeIrAAnioAnterior ? 'hover:bg-accent-soft hover:text-ink' : 'cursor-not-allowed opacity-30'
            }`}
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>
          <span className="min-w-16 text-center font-display text-lg font-medium text-ink">{anio}</span>
          <button
            type="button"
            onClick={goToNextYear}
            aria-label="Año siguiente"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition hover:bg-accent-soft hover:text-ink"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <MonthEntryLegend />

        <div className="space-y-6">
          {QUARTERS.map(({ quarter, months }) => {
            const esTrimestrePasado = esAnioActual && months.every((mes) => mes < mesActual)
            const expandido = trimestresExpandidos.has(quarter)
            const colapsado = esTrimestrePasado && !expandido

            return (
              <div key={quarter}>
                {esTrimestrePasado ? (
                  <button
                    type="button"
                    onClick={() => toggleTrimestre(quarter)}
                    className="mb-1 flex items-center gap-1 pl-9 text-xs font-medium tracking-wide text-ink-muted uppercase transition hover:text-ink"
                  >
                    <ChevronDown
                      className={`h-3 w-3 shrink-0 transition-transform ${expandido ? '' : '-rotate-90'}`}
                      strokeWidth={2}
                    />
                    {quarterLabel(quarter)}
                  </button>
                ) : (
                  <p className="mb-1 pl-9 text-xs font-medium tracking-wide text-ink-muted uppercase">
                    {quarterLabel(quarter)}
                  </p>
                )}
                {!colapsado && (
                <ul className="relative">
                  <div className="absolute top-2 bottom-2 left-[22px] w-px bg-line" aria-hidden />
                  {months.map((mes) => (
                    <MonthEntryRow
                      key={mes}
                      mes={mes}
                      isCurrentMonth={anio === now.getFullYear() && mes === now.getMonth() + 1}
                      entry={entriesByMonth.get(mes)}
                      tipo={c.tipo}
                      isEditing={editingMes === mes}
                      onStartEdit={() => {
                        deleteEntry.reset()
                        setEditingMes(mes)
                      }}
                      onStopEdit={() => setEditingMes(null)}
                      saving={upsertEntry.isPending}
                      onSave={(input) => upsertEntry.mutate({ anio, mes, input })}
                      puedeEliminarse={puedeEliminarse}
                      deleting={deleteEntry.isPending}
                      onDelete={() => deleteEntry.mutate({ anio, mes }, { onSuccess: () => setEditingMes(null) })}
                      deleteError={deleteEntry.isError ? deleteEntry.error.message : undefined}
                    />
                  ))}
                </ul>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}
