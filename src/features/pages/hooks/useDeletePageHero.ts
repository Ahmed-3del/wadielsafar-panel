import { useMutation, useQueryClient } from '@tanstack/react-query'
import { pageHeroesApi } from '../services/pageHeroesApi'

export function useDeletePageHero() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (pageKey: string) => pageHeroesApi.remove(pageKey),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['page-heroes'] })
    },
  })
}
