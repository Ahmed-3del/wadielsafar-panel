import { useMutation, useQueryClient } from '@tanstack/react-query'
import { visaCountriesApi } from '@/services/api/visas'

export function useDeleteVisaCountry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => visaCountriesApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['visas'] })
    },
  })
}
