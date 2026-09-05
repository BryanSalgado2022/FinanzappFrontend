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

// Separate from useUpdateAccentColor for clarity at call sites that edit
// ahorros specifically, though both currently do the same PATCH + invalidate.
export function useUpdateUserPreferences() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UserUpdateInput) => apiClient.patch<UserRead>('/users/me', input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: meKey })
    },
  })
}
