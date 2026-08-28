import { useQuery } from '@tanstack/react-query'
import { hotelsApi } from '../services/hotelsApi'

/** Hotel detail routes are keyed by slug. */
export function useHotel(slug: string | undefined) {
  return useQuery({
    queryKey: ['hotels', 'detail', slug],
    queryFn: () => hotelsApi.retrieve(slug as string),
    enabled: slug !== undefined,
  })
}
