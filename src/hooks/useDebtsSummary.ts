import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/apiClient'
import type { DebtsSummary } from '../types'

export function useDebtsSummary() {
  return useQuery({
    queryKey: ['debts', 'summary'],
    queryFn: () => apiClient.get<DebtsSummary>('/debts/summary'),
  })
}
