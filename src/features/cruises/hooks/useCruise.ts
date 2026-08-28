import { useQuery } from '@tanstack/react-query'
import { cruisesApi } from '../services/cruisesApi'

export function useCruise(slug: string | undefined) {
  return useQuery({
    queryKey: ['cruises', 'detail', slug],
    queryFn: () => cruisesApi.retrieve(slug as string),
    enabled: slug !== undefined,
  })
}
