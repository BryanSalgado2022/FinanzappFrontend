import { useQueries } from '@tanstack/react-query'
import { apiClient } from '../lib/apiClient'
import { useConcepts } from './useConcepts'
import type { Concepto, EntradaMensual } from '../types'

export interface DashboardConceptRow {
  concepto: Concepto
  entry: EntradaMensual | undefined
  // All of the concept's entries, not just the selected month's - used by
  // the Agenda to find which paid entry most recently zeroed out a debt's
  // balance (see lib/agendaEvents.ts). Dashboard.tsx only ever reads `entry`.
  entries: EntradaMensual[]
}

/**
 * The backend has no single endpoint for "all concepts' entries for month X"
 * (see FinanzappBackend API), so this fetches each concept's entries and
 * picks out the selected month client-side. Fine at MVP scale (a handful of
 * concepts per user); revisit if that grows.
 */
export function useDashboardConcepts(anio: number, mes: number) {
  const conceptsQuery = useConcepts()
  const concepts = conceptsQuery.data ?? []

  const entryQueries = useQueries({
    queries: concepts.map((concepto) => ({
      queryKey: ['concepts', concepto.id, 'entries'] as const,
      queryFn: () => apiClient.get<EntradaMensual[]>(`/concepts/${concepto.id}/entries`),
      enabled: conceptsQuery.isSuccess,
    })),
  })

  const isLoading = conceptsQuery.isLoading || entryQueries.some((q) => q.isLoading)

  const rows: DashboardConceptRow[] = concepts.map((concepto, index) => {
    const entries = entryQueries[index]?.data ?? []
    const entry = entries.find((e) => e.anio === anio && e.mes === mes)
    return { concepto, entry, entries }
  })

  return { rows, isLoading }
}
