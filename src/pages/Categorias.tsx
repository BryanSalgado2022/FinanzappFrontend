import { useState, type FormEvent } from 'react'
import { ChevronDown, Trash2 } from 'lucide-react'
import { ALLOWED_CATEGORY_EMOJIS } from '../lib/categoryEmojis'
import {
  useCategorias,
  useCreateCategoria,
  useDeleteCategoria,
  useUpdateCategoria,
} from '../hooks/useCategorias'
import type { Categoria } from '../types'

const inputClass =
  'w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none'

// The backend's PATCH treats an omitted emoji as "don't touch" (same
// None-means-unchanged convention as dia_vencimiento/categoria_ids), so once
// a category has an emoji it can be changed but not cleared back to none -
// this picker only offers picking one of the fixed set, matching the spec's
// "set or change" wording (no "clear").
function EmojiPicker({
  value,
  onChange,
}: {
  value: string | null
  onChange: (emoji: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {ALLOWED_CATEGORY_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onChange(emoji)}
          aria-label={emoji}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border text-base transition ${
            value === emoji
              ? 'border-accent bg-accent-soft'
              : 'border-line bg-paper hover:border-accent'
          }`}
        >
          {emoji}
        </button>
      ))}
    </div>
  )
}

function CategoriaRow({
  categoria,
  isEditing,
  onStartEdit,
  onStopEdit,
}: {
  categoria: Categoria
  isEditing: boolean
  onStartEdit: () => void
  onStopEdit: () => void
}) {
  const [nombre, setNombre] = useState(categoria.nombre)
  const [emoji, setEmoji] = useState<string | null>(categoria.emoji)
  const updateCategoria = useUpdateCategoria(categoria.id)
  const deleteCategoria = useDeleteCategoria(categoria.id)

  const startEditing = () => {
    setNombre(categoria.nombre)
    setEmoji(categoria.emoji)
    onStartEdit()
  }

  const handleSave = () => {
    updateCategoria.mutate(
      { nombre, emoji: emoji ?? undefined },
      { onSuccess: onStopEdit },
    )
  }

  const handleDelete = () => {
    deleteCategoria.mutate()
  }

  if (!isEditing) {
    return (
      <li>
        <button
          type="button"
          onClick={startEditing}
          className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm transition hover:bg-accent-soft/40"
        >
          <span className="flex items-center gap-2 text-ink">
            {categoria.emoji && <span>{categoria.emoji}</span>}
            {categoria.nombre}
          </span>
          <ChevronDown className="h-4 w-4 text-ink-muted" strokeWidth={2} />
        </button>
      </li>
    )
  }

  return (
    <li className="space-y-3 bg-paper px-4 py-4">
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputClass} />
      <EmojiPicker value={emoji} onChange={setEmoji} />

      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteCategoria.isPending}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-danger hover:opacity-80 disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
          {deleteCategoria.isPending ? 'Eliminando…' : 'Eliminar'}
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
            disabled={updateCategoria.isPending || !nombre.trim()}
            className="rounded-full bg-ink px-3 py-1.5 text-sm font-medium text-paper disabled:opacity-50"
          >
            {updateCategoria.isPending ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>
    </li>
  )
}

export function Categorias() {
  const categorias = useCategorias()
  const createCategoria = useCreateCategoria()
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)

  const handleCreate = (event: FormEvent) => {
    event.preventDefault()
    if (!nuevoNombre.trim()) return
    createCategoria.mutate({ nombre: nuevoNombre.trim() }, { onSuccess: () => setNuevoNombre('') })
  }

  return (
    <>
      <main className="mx-auto max-w-xl space-y-6 p-5 pb-24">
        <h1 className="font-display text-2xl font-medium text-ink">Categorías</h1>

        <form onSubmit={handleCreate} className="flex gap-2">
          <input
            placeholder="Nueva categoría"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            className={inputClass}
          />
          <button
            type="submit"
            disabled={createCategoria.isPending || !nuevoNombre.trim()}
            className="shrink-0 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:opacity-90 disabled:opacity-50"
          >
            Agregar
          </button>
        </form>

        {categorias.isLoading && <p className="text-sm text-ink-muted">Cargando…</p>}

        {!categorias.isLoading && (categorias.data ?? []).length === 0 && (
          <div className="rounded-2xl border border-dashed border-line px-4 py-8 text-center">
            <p className="text-sm text-ink-muted">Aún no tienes categorías.</p>
          </div>
        )}

        {!categorias.isLoading && (categorias.data ?? []).length > 0 && (
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper-raised">
            {(categorias.data ?? []).map((categoria) => (
              <CategoriaRow
                key={categoria.id}
                categoria={categoria}
                isEditing={editingId === categoria.id}
                onStartEdit={() => setEditingId(categoria.id)}
                onStopEdit={() => setEditingId(null)}
              />
            ))}
          </ul>
        )}
      </main>
    </>
  )
}
