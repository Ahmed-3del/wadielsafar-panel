import { useMutation, useQueryClient } from '@tanstack/react-query'
import { certificatesApi } from '../services/certificatesApi'

export function useDeleteCertificate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => certificatesApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['certificates'] })
    },
  })
}
