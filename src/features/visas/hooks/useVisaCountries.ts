import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { visaCountriesApi } from '@/services/api/visas'

export function useVisaCountries(page: number) {
  return useQuery({
    queryKey: ['visas', 'countries', 'list', page],
    queryFn: () => visaCountriesApi.list({ page }),
    placeholderData: keepPreviousData,
  })
}
