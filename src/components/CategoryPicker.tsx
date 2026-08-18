import { useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useCategorias, useCreateCategoria } from '../hooks/useCategorias'

const inputClass =
  'w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none'

/** Multi-select + inline-create category picker, shared by NewConceptForm
 * and ConceptDetail's edit mode. Selected categories render as removable
 * chips; typing filters existing categories to click-add, and a name that
 * matches nothing offers to create it on the fly (find-or-create is
 * idempotent server-side, so this is safe to call unconditionally). */
export function CategoryPicker({
  selectedIds,
  onChange,
}: {
  selectedIds: number[]
  onChange: (ids: number[]) => void
}) {
  const categorias = useCategorias()
  const createCategoria = useCreateCategoria()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const all = categorias.data ?? []
  const selected = all.filter((c) => selectedIds.includes(c.id))
  const query_ = query.trim().toLowerCase()
  const matches = query_
    ? all.filter((c) => !selectedIds.includes(c.id) && c.nombre.toLowerCase().includes(query_))
    : all.filter((c) => !selectedIds.includes(c.id))
  const exactMatch = all.some((c) => c.nombre.toLowerCase() === query_)

  const addExisting = (id: number) => {
    onChange([...selectedIds, id])
    setQuery('')
    inputRef.current?.focus()
  }

  const removeSelected = (id: number) => {
    onChange(selectedIds.filter((existing) => existing !== id))
  }

  const createAndAdd = () => {
    const nombre = query.trim()
    if (!nombre) return
    createCategoria.mutate(
      { nombre },
      {
        onSuccess: (categoria) => {
          onChange([...selectedIds, categoria.id])
          setQuery('')
          inputRef.current?.focus()
        },
      },
    )
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    if (query_ && !exactMatch) {
      createAndAdd()
    } else if (matches.length > 0) {
      addExisting(matches[0].id)
    }
  }

  return (
    <div className="relative">
      {selected.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {selected.map((categoria) => (
            <span
              key={categoria.id}
              className="flex items-center gap-1 rounded-full border border-line bg-paper px-2.5 py-1 text-xs text-ink"
            >
              {categoria.emoji && <span>{categoria.emoji}</span>}
              {categoria.nombre}
              <button
                type="button"
                onClick={() => removeSelected(categoria.id)}
                aria-label={`Quitar ${categoria.nombre}`}
                className="text-ink-muted hover:text-danger"
              >
                <X className="h-3 w-3" strokeWidth={2.5} />
              </button>
            </span>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        placeholder="Categoría (opcional) — elige o escribe una nueva"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        className={inputClass}
      />

      {focused && (matches.length > 0 || (query_ && !exactMatch)) && (
        <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-line bg-paper-raised p-1 shadow-lg">
          {matches.map((categoria) => (
            <button
              key={categoria.id}
              type="button"
              onClick={() => addExisting(categoria.id)}
              className="flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-left text-sm text-ink hover:bg-paper"
            >
              {categoria.emoji && <span>{categoria.emoji}</span>}
              {categoria.nombre}
            </button>
          ))}
          {query_ && !exactMatch && (
            <button
              type="button"
              onClick={createAndAdd}
              disabled={createCategoria.isPending}
              className="flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-left text-sm text-accent hover:bg-paper disabled:opacity-50"
            >
              Crear "{query.trim()}"
            </button>
          )}
        </div>
      )}
    </div>
  )
}
