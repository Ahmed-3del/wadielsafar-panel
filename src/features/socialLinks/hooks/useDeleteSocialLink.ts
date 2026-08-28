import { useMutation, useQueryClient } from '@tanstack/react-query'
import { socialLinksApi } from '../services/socialLinksApi'

export function useDeleteSocialLink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => socialLinksApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['socialLinks'] })
    },
  })
}
