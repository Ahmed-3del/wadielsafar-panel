import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { pageHeroesApi } from '../services/pageHeroesApi'

export function usePageHeroes(page = 1) {
  return useQuery({
    queryKey: ['page-heroes', 'list', page],
    queryFn: () => pageHeroesApi.list({ page }),
    placeholderData: keepPreviousData,
  })
}
