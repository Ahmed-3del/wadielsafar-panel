import { useQuery } from '@tanstack/react-query'
import { socialLinksApi } from '../services/socialLinksApi'

export function useSocialLink(id: number | undefined) {
  return useQuery({
    queryKey: ['socialLinks', 'detail', id],
    queryFn: () => socialLinksApi.retrieve(id as number),
    enabled: id !== undefined,
  })
}
