import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cruisesApi } from '../services/cruisesApi'
import type { CruiseWrite } from '../types'

export function useSaveCruise(slug?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CruiseWrite) =>
      slug ? cruisesApi.update(slug, payload) : cruisesApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cruises'] })
    },
  })
}
