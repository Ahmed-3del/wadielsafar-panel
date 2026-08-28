import { useMutation, useQueryClient } from '@tanstack/react-query'
import { socialLinksApi } from '../services/socialLinksApi'
import type { SocialLinkWrite } from '../types'

export function useSaveSocialLink(id?: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SocialLinkWrite) =>
      id ? socialLinksApi.update(id, payload) : socialLinksApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['socialLinks'] })
    },
  })
}
