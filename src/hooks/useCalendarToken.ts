import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/apiClient'

interface IcsTokenStatus {
  ics_token: string | null
}

const tokenKey = ['calendar', 'token'] as const

export function useCalendarTokenStatus() {
  return useQuery({
    queryKey: tokenKey,
    queryFn: () => apiClient.get<IcsTokenStatus>('/calendar/token'),
  })
}

export function useGenerateCalendarToken() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => apiClient.post<IcsTokenStatus>('/calendar/token'),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tokenKey })
    },
  })
}
