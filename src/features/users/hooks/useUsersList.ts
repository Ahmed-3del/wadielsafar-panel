import { useQuery } from '@tanstack/react-query'
import { usersApi } from '../services/usersApi'

export function useUsersList() {
  return useQuery({
    queryKey: ['users', 'list'],
    queryFn: () => usersApi.list(),
  })
}
