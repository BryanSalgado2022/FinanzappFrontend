import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/apiClient'
import type { Concepto, ConceptoCreateInput, ConceptoUpdateInput } from '../types'

const conceptsKey = ['concepts'] as const
const conceptKey = (id: number) => ['concepts', id] as const

export function useConcepts() {
  return useQuery({
    queryKey: conceptsKey,
    queryFn: () => apiClient.get<Concepto[]>('/concepts'),
  })
}

export function useConcept(id: number) {
  return useQuery({
    queryKey: conceptKey(id),
    queryFn: () => apiClient.get<Concepto>(`/concepts/${id}`),
  })
}

export function useCreateConcept() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ConceptoCreateInput) => apiClient.post<Concepto>('/concepts', input),
    onSuccess: () => {
      // Creating a concept with an initial monto_planeado auto-generates entries
      // server-side (see FinanzappBackend monthly-budget spec), which changes the
      // month's summary too - not just the concept list.
      void queryClient.invalidateQueries({ queryKey: conceptsKey })
      void queryClient.invalidateQueries({ queryKey: ['summary'] })
    },
  })
}

export function useUpdateConcept(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ConceptoUpdateInput) => apiClient.patch<Concepto>(`/concepts/${id}`, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: conceptsKey })
      void queryClient.invalidateQueries({ queryKey: conceptKey(id) })
    },
  })
}

export function useDeleteConcept(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => apiClient.delete<void>(`/concepts/${id}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: conceptsKey })
    },
  })
}
