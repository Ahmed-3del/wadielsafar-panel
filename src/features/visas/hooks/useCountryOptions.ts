import { useQuery } from '@tanstack/react-query'
import { visaCountriesApi } from '@/services/api/visas'

/** Powers the country <select> in the visa type form. */
export function useCountryOptions() {
  return useQuery({
    queryKey: ['visas', 'countries', 'options'],
    queryFn: () => visaCountriesApi.list({ page: 1 }),
  })
}
