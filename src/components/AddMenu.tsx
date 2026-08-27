import { useEffect } from 'react'
import { CheckSquare, Landmark, Receipt, ShoppingBag } from 'lucide-react'
import type { TipoConcepto } from '../types'

interface AddMenuProps {
  open: boolean
  onClose: () => void
  onSelectGasto: () => void
  onSelectConcepto: (tipo: TipoConcepto) => void
  // Optional - only the Agenda passes this, adding a 5th "Tarea" option.
  // Dashboard's usage omits it and keeps its existing 4 options unchanged.
  onSelectTarea?: () => void
}

export function AddMenu({ open, onClose, onSelectGasto, onSelectConcepto, onSelectTarea }: AddMenuProps) {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  const options: { label: string; Icon: typeof Landmark; onSelect: () => void }[] = [
    { label: 'Gasto puntual', Icon: ShoppingBag, onSelect: onSelectGasto },
    ...(onSelectTarea ? [{ label: 'Tarea', Icon: CheckSquare, onSelect: onSelectTarea }] : []),
    { label: 'Deuda', Icon: Landmark, onSelect: () => onSelectConcepto('deuda') },
    { label: 'Pago mensual', Icon: Receipt, onSelect: () => onSelectConcepto('gasto_fijo') },
  ]

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute top-full right-0 z-30 mt-2 w-52 rounded-2xl border border-line bg-paper-raised p-2 shadow-xl">
        <p className="mb-1 px-2 pt-1 text-xs font-medium tracking-wide text-ink-muted uppercase">
          ¿Qué quieres agregar?
        </p>
        {options.map(({ label, Icon, onSelect }) => (
          <button
            key={label}
            type="button"
            onClick={() => {
              onSelect()
              onClose()
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-ink transition hover:bg-paper"
          >
            <Icon className="h-4 w-4 text-ink-muted" strokeWidth={2} />
            {label}
          </button>
        ))}
      </div>
    </>
  )
}
