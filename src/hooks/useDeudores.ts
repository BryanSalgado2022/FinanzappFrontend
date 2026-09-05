import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/apiClient'
import type {
  Abono,
  AbonoCreateInput,
  CuotaDeudor,
  CuotaDeudorUpdateInput,
  Deudor,
  DeudorAmortizacionUpdateInput,
  DeudorCreateInput,
  DeudorUpdateInput,
} from '../types'

const deudoresKey = ['deudores'] as const
const deudorKey = (id: number) => ['deudores', id] as const
const abonosKey = (deudorId: number) => ['deudores', deudorId, 'abonos'] as const
const cuotasKey = (deudorId: number) => ['deudores', deudorId, 'cuotas'] as const

export function useDeudores() {
  return useQuery({
    queryKey: deudoresKey,
    queryFn: () => apiClient.get<Deudor[]>('/deudores'),
  })
}

export function useDeudor(id: number) {
  return useQuery({
    queryKey: deudorKey(id),
    queryFn: () => apiClient.get<Deudor>(`/deudores/${id}`),
  })
}

export function useCreateDeudor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: DeudorCreateInput) => apiClient.post<Deudor>('/deudores', input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: deudoresKey })
    },
  })
}

export function useUpdateDeudor(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: DeudorUpdateInput) => apiClient.patch<Deudor>(`/deudores/${id}`, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: deudoresKey })
      void queryClient.invalidateQueries({ queryKey: deudorKey(id) })
    },
  })
}

export function useDeleteDeudor(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => apiClient.delete<void>(`/deudores/${id}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: deudoresKey })
    },
  })
}

export function useAbonos(deudorId: number) {
  return useQuery({
    queryKey: abonosKey(deudorId),
    queryFn: () => apiClient.get<Abono[]>(`/deudores/${deudorId}/abonos`),
  })
}

export function useCreateAbono(deudorId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: AbonoCreateInput) =>
      apiClient.post<Abono>(`/deudores/${deudorId}/abonos`, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: abonosKey(deudorId) })
      void queryClient.invalidateQueries({ queryKey: deudorKey(deudorId) })
      void queryClient.invalidateQueries({ queryKey: deudoresKey })
    },
  })
}

export function useDeleteAbono(deudorId: number, abonoId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => apiClient.delete<void>(`/deudores/${deudorId}/abonos/${abonoId}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: abonosKey(deudorId) })
      void queryClient.invalidateQueries({ queryKey: deudorKey(deudorId) })
      void queryClient.invalidateQueries({ queryKey: deudoresKey })
    },
  })
}

export function useCuotasDeudor(deudorId: number) {
  return useQuery({
    queryKey: cuotasKey(deudorId),
    queryFn: () => apiClient.get<CuotaDeudor[]>(`/deudores/${deudorId}/cuotas`),
  })
}

export function useMarkCuota(deudorId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ anio, mes, ...input }: CuotaDeudorUpdateInput & { anio: number; mes: number }) =>
      apiClient.patch<CuotaDeudor>(`/deudores/${deudorId}/cuotas/${anio}/${mes}`, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cuotasKey(deudorId) })
      void queryClient.invalidateQueries({ queryKey: deudorKey(deudorId) })
      void queryClient.invalidateQueries({ queryKey: deudoresKey })
      void queryClient.invalidateQueries({ queryKey: ['summary'] })
    },
  })
}

export function useUpdateAmortizacionDeudor(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: DeudorAmortizacionUpdateInput) =>
      apiClient.put<Deudor>(`/deudores/${id}/amortizacion`, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: deudoresKey })
      void queryClient.invalidateQueries({ queryKey: deudorKey(id) })
      void queryClient.invalidateQueries({ queryKey: cuotasKey(id) })
      void queryClient.invalidateQueries({ queryKey: ['summary'] })
    },
  })
}
