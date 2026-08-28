import { useQuery } from '@tanstack/react-query'
import { packagesApi } from '../services/packagesApi'

/** Package detail routes are keyed by slug, matching the API's lookup_field. */
export function usePackage(slug: string | undefined) {
  return useQuery({
    queryKey: ['packages', 'detail', slug],
    queryFn: () => packagesApi.retrieve(slug as string),
    enabled: slug !== undefined,
  })
}
