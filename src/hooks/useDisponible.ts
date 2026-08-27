import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/apiClient'
import type { DisponibleRead } from '../types'

export function useDisponible() {
  return useQuery({
    queryKey: ['summary', 'disponible'],
    queryFn: () => apiClient.get<DisponibleRead>('/summary/disponible'),
  })
}
