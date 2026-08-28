import { useQuery } from '@tanstack/react-query'
import { navigationApi } from '../services/navigationApi'

export function useNavItem(id: number | undefined) {
  return useQuery({
    queryKey: ['navigation', 'detail', id],
    queryFn: () => navigationApi.retrieve(id as number),
    enabled: id !== undefined,
  })
}
