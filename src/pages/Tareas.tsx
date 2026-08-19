import { useState } from 'react'
import { Check, ChevronDown, Plus, Trash2 } from 'lucide-react'
import { NewTaskForm } from '../components/NewTaskForm'
import { ALLOWED_TASK_EMOJIS } from '../lib/taskEmojis'
import { formatFecha, formatHora } from '../lib/format'
import { useDeleteTarea, useTareas, useUpdateTarea } from '../hooks/useTareas'
import type { Tarea } from '../types'

const inputClass =
  'w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none'

/** Circular toggle mirroring MonthEntryRow's Node: filled+check when done,
 * danger ring+icon when overdue, plain ring otherwise - reusing the same
 * visual vocabulary the user already knows from Concept Detail. */
function TareaToggle({ tarea, onToggle }: { tarea: Tarea; onToggle: () => void }) {
  const base =
    'relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-transform'

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    onToggle()
  }

  if (tarea.completada) {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label="Marcar como pendiente"
        className={`${base} bg-accent text-paper-raised`}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </button>
    )
  }

  if (tarea.vencida) {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label="Marcar como completada"
        className={`${base} border-2 border-danger bg-danger-soft`}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Marcar como completada"
      className={`${base} border-2 border-line bg-paper hover:border-accent`}
    />
  )
}

function TareaRow({
  tarea,
  isEditing,
  onStartEdit,
  onStopEdit,
}: {
  tarea: Tarea
  isEditing: boolean
  onStartEdit: () => void
  onStopEdit: () => void
}) {
  const [titulo, setTitulo] = useState(tarea.titulo)
  const [emoji, setEmoji] = useState<string | null>(tarea.emoji)
  const [fecha, setFecha] = useState(tarea.fecha ?? '')
  const [hora, setHora] = useState(tarea.hora ?? '')
  const [nota, setNota] = useState(tarea.nota ?? '')
  const updateTarea = useUpdateTarea(tarea.id)
  const deleteTarea = useDeleteTarea(tarea.id)

  const startEditing = () => {
    setTitulo(tarea.titulo)
    setEmoji(tarea.emoji)
    setFecha(tarea.fecha ?? '')
    setHora(tarea.hora ?? '')
    setNota(tarea.nota ?? '')
    onStartEdit()
  }

  const toggleCompletada = () => {
    updateTarea.mutate({ completada: !tarea.completada })
  }

  const handleSave = () => {
    updateTarea.mutate(
      {
        titulo,
        emoji: emoji ?? undefined,
        fecha: fecha || undefined,
        hora: hora || undefined,
        nota: nota || undefined,
      },
      { onSuccess: onStopEdit },
    )
  }

  const handleDelete = () => {
    deleteTarea.mutate()
  }

  if (!isEditing) {
    return (
      <li>
        <button
          type="button"
          onClick={startEditing}
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm transition hover:bg-accent-soft/40"
        >
          <TareaToggle tarea={tarea} onToggle={toggleCompletada} />
          <span className="min-w-0 flex-1">
            <span
              className={`flex items-center gap-1.5 ${tarea.completada ? 'text-ink-muted line-through' : 'text-ink'}`}
            >
              {tarea.emoji && <span>{tarea.emoji}</span>}
              <span className="truncate">{tarea.titulo}</span>
            </span>
            {(tarea.fecha || tarea.hora) && (
              <span className={`text-xs ${tarea.vencida ? 'text-danger' : 'text-ink-muted'}`}>
                {tarea.fecha ? formatFecha(tarea.fecha) : ''}
                {tarea.fecha && tarea.hora ? ' · ' : ''}
                {tarea.hora ? formatHora(tarea.hora) : ''}
              </span>
            )}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-ink-muted" strokeWidth={2} />
        </button>
      </li>
    )
  }

  return (
    <li className="space-y-3 bg-paper px-4 py-4">
      <input
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className={inputClass}
      />

      <div className="flex flex-wrap gap-1.5">
        {ALLOWED_TASK_EMOJIS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setEmoji(option === emoji ? null : option)}
            aria-label={option}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border text-base transition ${
              option === emoji
                ? 'border-accent bg-accent-soft'
                : 'border-line bg-paper hover:border-accent'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className={inputClass}
        />
        <input
          type="time"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          className={inputClass}
        />
      </div>

      <textarea
        placeholder="Nota (opcional)"
        value={nota}
        onChange={(e) => setNota(e.target.value)}
        rows={3}
        className={`${inputClass} resize-none`}
      />

      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteTarea.isPending}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-danger hover:opacity-80 disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
          {deleteTarea.isPending ? 'Eliminando…' : 'Eliminar'}
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onStopEdit}
            className="rounded-full px-3 py-1.5 text-sm text-ink-muted hover:text-ink"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={updateTarea.isPending || !titulo.trim()}
            className="rounded-full bg-ink px-3 py-1.5 text-sm font-medium text-paper disabled:opacity-50"
          >
            {updateTarea.isPending ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>
    </li>
  )
}

export function Tareas() {
  const tareas = useTareas()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const todas = tareas.data ?? []
  const conFecha = todas
    .filter((t) => t.fecha !== null)
    .sort((a, b) => (a.fecha! < b.fecha! ? -1 : a.fecha! > b.fecha! ? 1 : 0))
  const sinFecha = todas.filter((t) => t.fecha === null)

  return (
    <>
      <main className="mx-auto max-w-xl space-y-6 p-5 pb-24">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-medium text-ink">Tareas</h1>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Nueva
          </button>
        </div>

        {tareas.isLoading && <p className="text-sm text-ink-muted">Cargando…</p>}

        {!tareas.isLoading && todas.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line px-4 py-8 text-center">
            <p className="text-sm text-ink-muted">Aún no tienes tareas.</p>
          </div>
        )}

        {conFecha.length > 0 && (
          <div>
            <p className="mb-1 pl-1 text-xs font-medium tracking-wide text-ink-muted uppercase">
              Con fecha
            </p>
            <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper-raised">
              {conFecha.map((tarea) => (
                <TareaRow
                  key={tarea.id}
                  tarea={tarea}
                  isEditing={editingId === tarea.id}
                  onStartEdit={() => setEditingId(tarea.id)}
                  onStopEdit={() => setEditingId(null)}
                />
              ))}
            </ul>
          </div>
        )}

        {sinFecha.length > 0 && (
          <div>
            <p className="mb-1 pl-1 text-xs font-medium tracking-wide text-ink-muted uppercase">
              Sin fecha
            </p>
            <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper-raised">
              {sinFecha.map((tarea) => (
                <TareaRow
                  key={tarea.id}
                  tarea={tarea}
                  isEditing={editingId === tarea.id}
                  onStartEdit={() => setEditingId(tarea.id)}
                  onStopEdit={() => setEditingId(null)}
                />
              ))}
            </ul>
          </div>
        )}
      </main>

      {showForm && <NewTaskForm onDone={() => setShowForm(false)} />}
    </>
  )
}
