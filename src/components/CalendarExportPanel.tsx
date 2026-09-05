import { useEffect, useState } from 'react'
import { Check, Copy, Download } from 'lucide-react'
import { downloadAuthenticated } from '../lib/apiClient'
import { useCalendarTokenStatus, useGenerateCalendarToken } from '../hooks/useCalendarToken'

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string

export function CalendarExportPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const tokenStatus = useCalendarTokenStatus()
  const generateToken = useGenerateCalendarToken()
  const [copied, setCopied] = useState(false)
  const [downloadError, setDownloadError] = useState(false)

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  const token = tokenStatus.data?.ics_token ?? null
  const subscribeUrl = token ? `${BASE_URL}/calendar/subscribe/${token}` : null

  const handleDownload = () => {
    setDownloadError(false)
    downloadAuthenticated('/calendar/export', 'tobe.ics').catch(() => setDownloadError(true))
  }

  const handleCopy = () => {
    if (!subscribeUrl) return
    void navigator.clipboard.writeText(subscribeUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute top-full right-0 z-30 mt-2 w-80 rounded-2xl border border-line bg-paper-raised p-4 shadow-xl">
        <p className="mb-3 px-1 text-xs font-medium tracking-wide text-ink-muted uppercase">
          Exportar calendario
        </p>

        <button
          type="button"
          onClick={handleDownload}
          className="flex w-full items-center gap-2 rounded-xl bg-paper px-3 py-2.5 text-left text-sm text-ink transition hover:bg-accent-soft"
        >
          <Download className="h-4 w-4 text-ink-muted" strokeWidth={2} />
          Descargar .ics
        </button>
        {downloadError && <p className="mt-1.5 px-1 text-xs text-danger">No se pudo descargar.</p>}

        <div className="mt-4 border-t border-line pt-4">
          <p className="px-1 text-xs text-ink-muted">
            Suscribirse mantiene tu calendario actualizado automáticamente.
          </p>

          {subscribeUrl ? (
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2 rounded-xl border border-line bg-paper px-3 py-2">
                <p className="min-w-0 flex-1 truncate text-xs text-ink-muted">{subscribeUrl}</p>
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label="Copiar enlace"
                  className="shrink-0 text-ink-muted hover:text-ink"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
                  ) : (
                    <Copy className="h-3.5 w-3.5" strokeWidth={2} />
                  )}
                </button>
              </div>
              <button
                type="button"
                onClick={() => generateToken.mutate()}
                disabled={generateToken.isPending}
                className="px-1 text-xs text-ink-muted underline decoration-line underline-offset-4 hover:text-ink disabled:opacity-50"
              >
                Regenerar enlace
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => generateToken.mutate()}
              disabled={generateToken.isPending}
              className="mt-2 rounded-full bg-ink px-3.5 py-1.5 text-xs font-medium text-paper disabled:opacity-50"
            >
              {generateToken.isPending ? 'Generando…' : 'Generar enlace'}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
