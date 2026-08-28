import { useQuery } from '@tanstack/react-query'
import { partnersApi } from '../services/partnersApi'

export function usePartner(id: number | undefined) {
  return useQuery({
    queryKey: ['partners', 'detail', id],
    queryFn: () => partnersApi.retrieve(id as number),
    enabled: id !== undefined,
  })
}
