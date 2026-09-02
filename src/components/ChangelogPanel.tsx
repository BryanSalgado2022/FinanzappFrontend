import { useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { CHANGELOG } from '../data/changelog'
import { formatFecha } from '../lib/format'

export function ChangelogPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute top-full right-0 z-30 mt-2 max-h-[70svh] w-80 overflow-y-auto rounded-2xl border border-line bg-paper-raised p-3 shadow-xl">
        <p className="mb-2 flex items-center gap-1.5 px-1 text-xs font-medium tracking-wide text-ink-muted uppercase">
          <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
          Novedades
        </p>
        <ul className="space-y-3">
          {CHANGELOG.map((entry) => (
            <li key={entry.id} className="rounded-xl px-1 py-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-display text-sm font-medium text-ink">{entry.title}</p>
                <span className="shrink-0 text-xs text-ink-muted">{formatFecha(entry.date)}</span>
              </div>
              <p className="mt-0.5 text-xs text-ink-muted">{entry.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
