import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/apiClient'
import type { Categoria } from '../types'

const categoriasKey = ['categorias'] as const

export function useCategorias() {
  return useQuery({
    queryKey: categoriasKey,
    queryFn: () => apiClient.get<Categoria[]>('/categorias'),
  })
}

// Renaming or re-styling a category must be reflected on every concept that
// uses it (see FinanzappBackend design.md's propagation guarantee) - every
// mutation here invalidates concepts too, not just the categorias list.
function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: categoriasKey })
  void queryClient.invalidateQueries({ queryKey: ['concepts'] })
}

export function useCreateCategoria() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { nombre: string; emoji?: string }) =>
      apiClient.post<Categoria>('/categorias', input),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export function useUpdateCategoria(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { nombre?: string; emoji?: string }) =>
      apiClient.patch<Categoria>(`/categorias/${id}`, input),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export function useDeleteCategoria(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => apiClient.delete<void>(`/categorias/${id}`),
    onSuccess: () => invalidateAll(queryClient),
  })
}
