import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/apiClient'
import type { EntradaMensual, EntradaMensualInput } from '../types'

const entriesKey = (conceptoId: number) => ['concepts', conceptoId, 'entries'] as const

export function useConceptEntries(conceptoId: number) {
  return useQuery({
    queryKey: entriesKey(conceptoId),
    queryFn: () => apiClient.get<EntradaMensual[]>(`/concepts/${conceptoId}/entries`),
  })
}

export function useUpsertEntry(conceptoId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ anio, mes, input }: { anio: number; mes: number; input: EntradaMensualInput }) =>
      apiClient.put<EntradaMensual>(`/concepts/${conceptoId}/entries/${anio}/${mes}`, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: entriesKey(conceptoId) })
      void queryClient.invalidateQueries({ queryKey: ['summary'] })
      void queryClient.invalidateQueries({ queryKey: ['concepts', conceptoId] })
    },
  })
}
