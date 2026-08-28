import { useQuery } from '@tanstack/react-query'
import { homeSectionsApi } from '../services/homeSectionsApi'

export function useHomeSections() {
  return useQuery({
    queryKey: ['home-sections'],
    // Eleven rows at most — the whole list, unpaginated, is the point.
    queryFn: () => homeSectionsApi.list({ page_size: 50 }),
  })
}
