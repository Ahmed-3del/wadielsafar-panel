import { useQuery } from '@tanstack/react-query'
import { cruisePortsApi } from '@/services/api/cruises'

export function useCruisePort(id: number | undefined) {
  return useQuery({
    queryKey: ['cruises', 'ports', 'detail', id],
    queryFn: () => cruisePortsApi.retrieve(id as number),
    enabled: id !== undefined,
  })
}
