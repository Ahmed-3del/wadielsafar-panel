import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cruisePortsApi } from '@/services/api/cruises'
import type { CruisePortWrite } from '@/features/cruises/types'

export function useSaveCruisePort(id?: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CruisePortWrite) =>
      id ? cruisePortsApi.update(id, payload) : cruisePortsApi.create(payload),
    onSuccess: () => {
      // Cruises embed their port, so a renamed port has to invalidate those
      // lists too.
      void queryClient.invalidateQueries({ queryKey: ['cruises'] })
    },
  })
}
