import { useQuery } from '@tanstack/react-query'
import { navigationApi } from '../services/navigationApi'

export function useNavItems() {
  return useQuery({ queryKey: ['navigation', 'list'], queryFn: () => navigationApi.list() })
}
