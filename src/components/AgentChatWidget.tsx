import { useState, type FormEvent } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'
import { AgentProposedActionCard } from './AgentProposedActionCard'
import { useAgentChat } from '../hooks/useAgentChat'
import type { AgentEntity } from '../types'

type DisplayItem =
  | { kind: 'user'; text: string }
  | { kind: 'assistant'; text: string }
  | { kind: 'proposal'; entity: AgentEntity; fields: Record<string, unknown>; resolved: boolean }

export function AgentChatWidget() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<DisplayItem[]>([])
  const [input, setInput] = useState('')
  const { sendMessage, isLoading, error } = useAgentChat()

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const text = input.trim()
    if (!text) return
    setInput('')
    setItems((prev) => [...prev, { kind: 'user', text }])

    const response = await sendMessage(text)
    if (!response) return

    if (response.type === 'proposed_action') {
      setItems((prev) => [
        ...prev,
        { kind: 'proposal', entity: response.entity, fields: response.fields, resolved: false },
      ])
    } else {
      setItems((prev) => [...prev, { kind: 'assistant', text: response.message }])
    }
  }

  const resolveProposal = (index: number, summary: string) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, resolved: true } : item)))
    setItems((prev) => [...prev, { kind: 'assistant', text: summary }])
  }

  const dismissProposal = (index: number) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, resolved: true } : item)))
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir asistente"
        className="fixed right-5 bottom-5 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-paper shadow-xl transition hover:opacity-90"
      >
        <MessageCircle className="h-5 w-5" strokeWidth={2} />
      </button>
    )
  }

  return (
    <div className="fixed right-5 bottom-5 z-30 flex h-[32rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-3xl border border-line bg-paper-raised shadow-2xl">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <p className="font-display text-base font-medium text-ink">Asistente</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Cerrar asistente"
          className="flex h-7 w-7 items-center justify-center rounded-full text-ink-muted hover:bg-paper hover:text-ink"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {items.length === 0 && (
          <p className="text-sm text-ink-muted">
            Cuéntame qué quieres registrar, ej. "Hoy gasté 50.000 en gasolina".
          </p>
        )}
        {items.map((item, index) => {
          if (item.kind === 'user') {
            return (
              <div key={index} className="ml-auto max-w-[85%] rounded-2xl bg-accent-soft px-3 py-2 text-sm text-ink">
                {item.text}
              </div>
            )
          }
          if (item.kind === 'assistant') {
            return (
              <div key={index} className="max-w-[85%] rounded-2xl bg-paper px-3 py-2 text-sm text-ink">
                {item.text}
              </div>
            )
          }
          if (item.resolved) return null
          return (
            <AgentProposedActionCard
              key={index}
              entity={item.entity}
              fields={item.fields}
              onDone={(summary) => resolveProposal(index, summary)}
              onDismiss={() => dismissProposal(index)}
            />
          )
        })}
        {isLoading && <p className="text-sm text-ink-muted">Pensando…</p>}
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-line p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje…"
          className="flex-1 rounded-full border border-line bg-paper px-3.5 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          aria-label="Enviar"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-paper transition hover:opacity-90 disabled:opacity-50"
        >
          <Send className="h-4 w-4" strokeWidth={2} />
        </button>
      </form>
    </div>
  )
}
