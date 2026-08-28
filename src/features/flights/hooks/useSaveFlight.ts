import { useMutation, useQueryClient } from '@tanstack/react-query'
import { flightsApi } from '../services/flightsApi'
import type { FlightDealWrite } from '../types'

export function useSaveFlight(slug?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: FlightDealWrite) =>
      slug ? flightsApi.update(slug, payload) : flightsApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['flights'] })
    },
  })
}
