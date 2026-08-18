import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/apiClient'
import type { Tarea, TareaCreateInput, TareaUpdateInput } from '../types'

const tareasKey = ['tareas'] as const

export function useTareas() {
  return useQuery({
    queryKey: tareasKey,
    queryFn: () => apiClient.get<Tarea[]>('/tareas'),
  })
}

export function useCreateTarea() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: TareaCreateInput) => apiClient.post<Tarea>('/tareas', input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tareasKey })
    },
  })
}

export function useUpdateTarea(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: TareaUpdateInput) => apiClient.patch<Tarea>(`/tareas/${id}`, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tareasKey })
    },
  })
}

export function useDeleteTarea(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => apiClient.delete<void>(`/tareas/${id}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tareasKey })
    },
  })
}
