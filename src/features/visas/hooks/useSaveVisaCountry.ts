import { useMutation, useQueryClient } from '@tanstack/react-query'
import { visaCountriesApi } from '@/services/api/visas'
import type { VisaCountryWrite } from '../types'

export function useSaveVisaCountry(id?: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: VisaCountryWrite) =>
      id ? visaCountriesApi.update(id, payload) : visaCountriesApi.create(payload),
    onSuccess: () => {
      // Visa types embed their country, so a renamed or re-photographed
      // country has to invalidate the type lists too.
      void queryClient.invalidateQueries({ queryKey: ['visas'] })
    },
  })
}
