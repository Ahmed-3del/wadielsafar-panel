import { useQuery } from '@tanstack/react-query'
import { visasApi } from '../services/visasApi'

export function useVisa(id: number | undefined) {
  return useQuery({
    queryKey: ['visas', 'detail', id],
    queryFn: () => visasApi.retrieve(id as number),
    enabled: id !== undefined,
  })
}
