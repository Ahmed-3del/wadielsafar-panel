import { useQuery } from '@tanstack/react-query'
import { hotelAmenitiesApi } from '@/services/api/hotels'

/** Powers the amenities checkbox group in the hotel form. */
export function useAmenityOptions() {
  return useQuery({
    queryKey: ['hotels', 'amenities', 'options'],
    queryFn: () => hotelAmenitiesApi.list({ page: 1 }),
  })
}
