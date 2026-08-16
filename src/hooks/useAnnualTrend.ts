import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/apiClient'
import type { AnnualTrend } from '../types'

export function useAnnualTrend(anio: number) {
  return useQuery({
    queryKey: ['summary', 'annual', anio],
    queryFn: () => apiClient.get<AnnualTrend>(`/summary/annual?anio=${anio}`),
  })
}
