import { useMutation, useQueryClient } from '@tanstack/react-query'
import { pageHeroesApi } from '../services/pageHeroesApi'
import type { PageHeroWrite } from '../types'

export function useSavePageHero(pageKey?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PageHeroWrite) =>
      pageKey ? pageHeroesApi.update(pageKey, payload) : pageHeroesApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['page-heroes'] })
    },
  })
}
