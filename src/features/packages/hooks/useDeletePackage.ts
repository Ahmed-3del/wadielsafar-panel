import { useMutation, useQueryClient } from '@tanstack/react-query'
import { packagesApi } from '../services/packagesApi'

export function useDeletePackage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => packagesApi.remove(slug),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['packages'] })
    },
  })
}
