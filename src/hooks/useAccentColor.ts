import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/apiClient'
import { useAuth } from '../context/AuthContext'
import type { UserRead, UserUpdateInput } from '../types'

const meKey = ['users', 'me'] as const

export function useCurrentUser() {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: meKey,
    queryFn: () => apiClient.get<UserRead>('/users/me'),
    enabled: isAuthenticated,
  })
}

export function useUpdateAccentColor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UserUpdateInput) => apiClient.patch<UserRead>('/users/me', input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: meKey })
    },
  })
}

// Separate from useUpdateAccentColor because editing ahorros/saldo_disponible_inicial
// also needs to refresh the Disponible figure - the backend re-dates
// saldo_disponible_fecha as a side effect of this same request (see
// FinanzappBackend's add-available-balance), so the query must refetch even
// though the mutation body didn't touch it directly.
export function useUpdateUserPreferences() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UserUpdateInput) => apiClient.patch<UserRead>('/users/me', input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: meKey })
      void queryClient.invalidateQueries({ queryKey: ['summary', 'disponible'] })
    },
  })
}
