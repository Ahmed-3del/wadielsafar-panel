import { useQuery } from '@tanstack/react-query'
import { cruisePortsApi } from '@/services/api/cruises'

/*
 * The whole catalogue in one request, for the departure-port picker.
 *
 * A hundred rows that barely change, so fetching once and filtering in the
 * browser beats a request per keystroke.
 */
export function useCruisePortOptions() {
  return useQuery({
    queryKey: ['cruises', 'ports', 'options'],
    queryFn: () => cruisePortsApi.list({ page_size: 300 }),
    staleTime: 10 * 60 * 1000,
  })
}
