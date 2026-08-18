import { useEffect } from 'react'
import { Check } from 'lucide-react'
import { ACCENT_COLOR_PRESETS, DEFAULT_ACCENT_COLOR_ID } from '../lib/accentColors'
import { useCurrentUser, useUpdateAccentColor } from '../hooks/useAccentColor'

export function AccentColorPicker({ open, onClose }: { open: boolean; onClose: () => void }) {
  const currentUser = useCurrentUser()
  const updateAccentColor = useUpdateAccentColor()
  const selectedId = currentUser.data?.color_acento ?? DEFAULT_ACCENT_COLOR_ID

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  const handleSelect = (id: string) => {
    // Applied immediately by App.tsx's effect once the query cache updates
    // (or optimistically here via CSS override, kept in sync by the
    // mutation's onSuccess invalidation) - not rolled back if the PATCH
    // fails, only surfaced as an inline error.
    document.documentElement.style.setProperty(
      '--accent-override-light',
      ACCENT_COLOR_PRESETS.find((p) => p.id === id)!.light,
    )
    document.documentElement.style.setProperty(
      '--accent-override-dark',
      ACCENT_COLOR_PRESETS.find((p) => p.id === id)!.dark,
    )
    updateAccentColor.mutate({ color_acento: id })
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute top-full right-0 z-30 mt-2 w-56 rounded-2xl border border-line bg-paper-raised p-3 shadow-xl">
        <p className="mb-2 px-1 text-xs font-medium tracking-wide text-ink-muted uppercase">
          Color de acento
        </p>
        <div className="grid grid-cols-5 gap-2">
          {ACCENT_COLOR_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelect(preset.id)}
              aria-label={preset.label}
              className="flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-line ring-offset-2 ring-offset-paper-raised transition hover:scale-105"
              style={{ backgroundColor: preset.light }}
            >
              {selectedId === preset.id && <Check className="h-4 w-4 text-white" strokeWidth={2.5} />}
            </button>
          ))}
        </div>
        {updateAccentColor.isError && (
          <p className="mt-2 px-1 text-xs text-danger">No se pudo guardar el color.</p>
        )}
      </div>
    </>
  )
}
