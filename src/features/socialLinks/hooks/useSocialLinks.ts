import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { socialLinksApi } from '../services/socialLinksApi'

export function useSocialLinks(page: number) {
  return useQuery({
    queryKey: ['socialLinks', 'list', page],
    queryFn: () => socialLinksApi.list({ page }),
    placeholderData: keepPreviousData,
  })
}
