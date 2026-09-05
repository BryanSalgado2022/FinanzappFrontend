import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/apiClient'
import type { AporteAhorro, AporteAhorroCreateInput } from '../types'

const ahorrosKey = ['ahorros'] as const
const meKey = ['users', 'me'] as const

export function useAportesAhorro() {
  return useQuery({
    queryKey: ahorrosKey,
    queryFn: () => apiClient.get<AporteAhorro[]>('/ahorros'),
  })
}

export function useCreateAporte() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: AporteAhorroCreateInput) => apiClient.post<AporteAhorro>('/ahorros', input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ahorrosKey })
      void queryClient.invalidateQueries({ queryKey: meKey })
    },
  })
}

export function useDeleteAporte(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => apiClient.delete<void>(`/ahorros/${id}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ahorrosKey })
      void queryClient.invalidateQueries({ queryKey: meKey })
    },
  })
}
