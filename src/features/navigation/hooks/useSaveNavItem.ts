import { useMutation, useQueryClient } from '@tanstack/react-query'
import { navigationApi } from '../services/navigationApi'
import type { NavItemWrite } from '../types'

export function useSaveNavItem(id?: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: NavItemWrite) =>
      id ? navigationApi.update(id, payload) : navigationApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['navigation'] })
    },
  })
}
