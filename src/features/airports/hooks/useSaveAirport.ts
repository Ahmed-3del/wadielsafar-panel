import { useMutation, useQueryClient } from '@tanstack/react-query'
import { airportsApi } from '../services/airportsApi'
import type { AirportWrite } from '../types'

export function useSaveAirport(id?: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AirportWrite) =>
      id ? airportsApi.update(id, payload) : airportsApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['airports'] })
    },
  })
}
