import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { ALLOWED_TASK_EMOJIS } from '../lib/taskEmojis'
import { useCreateTarea } from '../hooks/useTareas'

const inputClass =
  'w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none'

export function NewTaskForm({ onDone }: { onDone: () => void }) {
  const [titulo, setTitulo] = useState('')
  const [emoji, setEmoji] = useState<string | null>(null)
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [nota, setNota] = useState('')
  const createTarea = useCreateTarea()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    createTarea.mutate(
      {
        titulo,
        emoji: emoji ?? undefined,
        fecha: fecha || undefined,
        hora: hora || undefined,
        nota: nota || undefined,
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
          <h2 className="font-display text-xl font-medium text-ink">Nueva tarea</h2>
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
          placeholder="¿Qué tienes que hacer?"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className={inputClass}
        />

        <div>
          <p className="mb-1.5 text-xs text-ink-muted">Emoji (opcional)</p>
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

        {createTarea.isError && (
          <p className="text-sm text-danger">No se pudo crear la tarea.</p>
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
            disabled={createTarea.isPending}
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:opacity-90 disabled:opacity-50"
          >
            {createTarea.isPending ? 'Creando…' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  )
}
