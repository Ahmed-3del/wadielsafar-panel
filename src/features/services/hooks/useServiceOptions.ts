import { useQuery } from '@tanstack/react-query'
import { servicesApi } from '../services/servicesApi'

/**
 * Every service, for the pickers that attach something to one.
 *
 * Not paged: there are a handful of services and a dropdown that only offers
 * the first twenty is a dropdown that quietly cannot reach the rest.
 */
export function useServiceOptions() {
  return useQuery({
    queryKey: ['services', 'options'],
    queryFn: () => servicesApi.list({ page_size: 200 }),
    select: (data) => data.results,
  })
}
