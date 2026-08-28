import { useMutation, useQueryClient } from '@tanstack/react-query'
import { hotelsApi } from '../services/hotelsApi'
import type { HotelWrite } from '../types'

export function useSaveHotel(slug?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: HotelWrite) =>
      slug ? hotelsApi.update(slug, payload) : hotelsApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['hotels'] })
    },
  })
}
