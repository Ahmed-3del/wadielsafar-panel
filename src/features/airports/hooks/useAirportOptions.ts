import { useQuery } from '@tanstack/react-query'
import { airportsApi } from '../services/airportsApi'

/*
 * The whole catalogue in one request, for the pickers.
 *
 * It is 176 rows and it barely changes, so fetching it once and filtering in
 * the browser beats a request per keystroke — and it means the list still
 * works while someone types faster than the network answers.
 */
export function useAirportOptions() {
  return useQuery({
    queryKey: ['airports', 'options'],
    queryFn: () => airportsApi.list({ page_size: 500 }),
    staleTime: 10 * 60 * 1000,
  })
}
