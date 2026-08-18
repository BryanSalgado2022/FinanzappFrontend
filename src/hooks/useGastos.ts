import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/apiClient'
import type { Gasto, GastoCreateInput, GastoUpdateInput } from '../types'

const gastosKey = (anio?: number, mes?: number) => ['gastos', anio, mes] as const
const gastoKey = (id: number) => ['gastos', 'detail', id] as const

export function useGastos(anio?: number, mes?: number) {
  const params = anio !== undefined && mes !== undefined ? `?anio=${anio}&mes=${mes}` : ''
  return useQuery({
    queryKey: gastosKey(anio, mes),
    queryFn: () => apiClient.get<Gasto[]>(`/gastos${params}`),
  })
}

export function useGasto(id: number) {
  return useQuery({
    queryKey: gastoKey(id),
    queryFn: () => apiClient.get<Gasto>(`/gastos/${id}`),
  })
}

export function useCreateGasto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: GastoCreateInput) => apiClient.post<Gasto>('/gastos', input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['gastos'] })
      void queryClient.invalidateQueries({ queryKey: ['summary'] })
    },
  })
}

export function useUpdateGasto(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: GastoUpdateInput) => apiClient.patch<Gasto>(`/gastos/${id}`, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['gastos'] })
      void queryClient.invalidateQueries({ queryKey: ['summary'] })
    },
  })
}

export function useDeleteGasto(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => apiClient.delete<void>(`/gastos/${id}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['gastos'] })
      void queryClient.invalidateQueries({ queryKey: ['summary'] })
    },
  })
}
