import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Pencil, CheckCircle2, Trash2 } from 'lucide-react'
import { Header } from '../components/Header'
import { MonthEntryRow } from '../components/MonthEntryRow'
import { ProgressRing } from '../components/ProgressRing'
import { useConcept, useDeleteConcept, useUpdateConcept } from '../hooks/useConcepts'
import { useConceptEntries, useUpsertEntry } from '../hooks/useEntries'
import { formatCOP, quarterLabel, tipoDotClass, tipoLabel } from '../lib/format'

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
  const [categoriaDraft, setCategoriaDraft] = useState('')
  // Accordion: only one month row can be in edit mode across the whole year.
  const [editingMes, setEditingMes] = useState<number | null>(null)

  const concept = useConcept(conceptoId)
  const entries = useConceptEntries(conceptoId)
  const upsertEntry = useUpsertEntry(conceptoId)
  const updateConcept = useUpdateConcept(conceptoId)
  const deleteConcept = useDeleteConcept(conceptoId)

  if (concept.isLoading || !concept.data) {
    return (
      <div className="min-h-svh bg-paper">
        <Header />
        <p className="p-5 text-sm text-ink-muted">Cargando…</p>
      </div>
    )
  }

  const c = concept.data
  const entriesByMonth = new Map((entries.data ?? []).filter((e) => e.anio === anio).map((e) => [e.mes, e]))

  const isDebt = c.tipo === 'deuda' && c.valor_total !== null && c.saldo_restante !== null
  const percentPaid = isDebt
    ? Math.round(((Number(c.valor_total) - Number(c.saldo_restante)) / Number(c.valor_total)) * 100)
    : 0

  const startEditingHeader = () => {
    setNombreDraft(c.nombre)
    setCategoriaDraft(c.categoria ?? '')
    setEditingHeader(true)
  }

  const handleFinish = () => updateConcept.mutate({ activo: false })
  const handleDelete = () => deleteConcept.mutate(undefined, { onSuccess: () => navigate('/') })

  return (
    <div className="min-h-svh bg-paper">
      <Header />

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
                      {c.categoria ? ` · ${c.categoria}` : ''}
                      {!c.activo ? ' · Terminado' : ''}
                    </p>
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

              {c.duracion_meses !== null && (
                <div className="mt-4 rounded-xl bg-paper px-3 py-2.5 text-center">
                  <p className="text-xs text-ink-muted">Duración fija</p>
                  <p className="font-tabular text-sm font-semibold text-ink">
                    {c.duracion_meses} {c.duracion_meses === 1 ? 'mes' : 'meses'}
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
              <input
                placeholder="Categoría"
                value={categoriaDraft}
                onChange={(e) => setCategoriaDraft(e.target.value)}
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
                    updateConcept.mutate(
                      { nombre: nombreDraft, categoria: categoriaDraft || undefined },
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
            onClick={() => setAnio((y) => y - 1)}
            aria-label="Año anterior"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition hover:bg-accent-soft hover:text-ink"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>
          <span className="min-w-16 text-center font-display text-lg font-medium text-ink">{anio}</span>
          <button
            type="button"
            onClick={() => setAnio((y) => y + 1)}
            aria-label="Año siguiente"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition hover:bg-accent-soft hover:text-ink"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <div className="space-y-6">
          {QUARTERS.map(({ quarter, months }) => (
            <div key={quarter}>
              <p className="mb-1 pl-9 text-xs font-medium tracking-wide text-ink-muted uppercase">
                {quarterLabel(quarter)}
              </p>
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
                    onStartEdit={() => setEditingMes(mes)}
                    onStopEdit={() => setEditingMes(null)}
                    saving={upsertEntry.isPending}
                    onSave={(input) => upsertEntry.mutate({ anio, mes, input })}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
