import { useState } from 'react'
import { apiClient, ApiError } from '../lib/apiClient'
import type { ChatMessage, ChatRequest, ChatResponse } from '../types'

function todayIso(): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

// What goes back into history for the model's side of the turn - keeps
// future messages in the same conversation aware of what was just proposed
// or asked, even though a proposed_action isn't itself free text.
function responseToModelContent(response: ChatResponse): string {
  if (response.type === 'proposed_action') {
    return `[Propuse registrar un(a) ${response.entity} con estos datos: ${JSON.stringify(response.fields)}]`
  }
  return response.message
}

export function useAgentChat() {
  const [history, setHistory] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = async (text: string): Promise<ChatResponse | null> => {
    const userMessage: ChatMessage = { role: 'user', content: text }
    const nextHistory = [...history, userMessage]
    setHistory(nextHistory)
    setIsLoading(true)
    setError(null)

    const body: ChatRequest = { messages: nextHistory, current_date: todayIso() }

    try {
      const response = await apiClient.post<ChatResponse>('/agent/chat', body)
      setHistory((h) => [...h, { role: 'model', content: responseToModelContent(response) }])
      return response
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo contactar al asistente.')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { sendMessage, isLoading, error }
}
