import { useMutation, useQueryClient } from '@tanstack/react-query'
import { destinationsApi } from '../services/destinationsApi'
import type { DestinationWrite } from '../types'

export function useSaveDestination(slug?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: DestinationWrite) =>
      slug ? destinationsApi.update(slug, payload) : destinationsApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['destinations'] })
    },
  })
}
