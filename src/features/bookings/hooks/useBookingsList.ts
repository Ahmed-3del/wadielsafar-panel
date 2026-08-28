import { useQuery } from '@tanstack/react-query'
import { bookingsApi } from '../services/bookingsApi'

export function useBookingsList() {
  return useQuery({
    queryKey: ['bookings', 'list'],
    queryFn: () => bookingsApi.list(),
  })
}
