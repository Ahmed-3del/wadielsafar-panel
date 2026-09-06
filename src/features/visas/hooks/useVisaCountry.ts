import { useQuery } from '@tanstack/react-query'
import { visaCountriesApi } from '@/services/api/visas'

export function useVisaCountry(id: number | undefined) {
  return useQuery({
    queryKey: ['visas', 'countries', 'detail', id],
    queryFn: () => visaCountriesApi.retrieve(id as number),
    enabled: id !== undefined,
  })
}
