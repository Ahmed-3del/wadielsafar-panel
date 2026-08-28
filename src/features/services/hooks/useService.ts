import { useQuery } from '@tanstack/react-query'
import { servicesApi } from '../services/servicesApi'

export function useService(id: number | undefined) {
  return useQuery({
    queryKey: ['services', 'detail', id],
    queryFn: () => servicesApi.retrieve(id as number),
    enabled: id !== undefined,
  })
}
