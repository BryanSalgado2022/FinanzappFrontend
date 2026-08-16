import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/apiClient'
import type { MonthlySummary } from '../types'

export function useSummary(anio: number, mes: number) {
  return useQuery({
    queryKey: ['summary', anio, mes],
    queryFn: () => apiClient.get<MonthlySummary>(`/summary?anio=${anio}&mes=${mes}`),
  })
}
