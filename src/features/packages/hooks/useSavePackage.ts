import { useMutation, useQueryClient } from '@tanstack/react-query'
import { packagesApi } from '../services/packagesApi'
import type { PackageWrite } from '../types'

export function useSavePackage(slug?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PackageWrite) =>
      slug ? packagesApi.update(slug, payload) : packagesApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['packages'] })
    },
  })
}
