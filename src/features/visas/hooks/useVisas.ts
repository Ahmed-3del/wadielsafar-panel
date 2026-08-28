import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { visasApi } from '../services/visasApi'

export function useVisas(page: number) {
  return useQuery({
    queryKey: ['visas', 'list', page],
    queryFn: () => visasApi.list({ page }),
    placeholderData: keepPreviousData,
  })
}
