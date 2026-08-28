import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { servicesApi } from '../services/servicesApi'

export function useServices(page: number) {
  return useQuery({
    queryKey: ['services', 'list', page],
    queryFn: () => servicesApi.list({ page }),
    placeholderData: keepPreviousData,
  })
}
