import { useQuery } from '@tanstack/react-query'
import { pageHeroesApi } from '../services/pageHeroesApi'

export function usePageHero(pageKey: string | undefined) {
  return useQuery({
    queryKey: ['page-heroes', 'detail', pageKey],
    queryFn: () => pageHeroesApi.retrieve(pageKey as string),
    enabled: pageKey !== undefined,
  })
}
