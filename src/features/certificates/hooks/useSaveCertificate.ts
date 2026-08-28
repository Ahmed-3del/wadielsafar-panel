import { useMutation, useQueryClient } from '@tanstack/react-query'
import { certificatesApi } from '../services/certificatesApi'
import type { CertificateWrite } from '../types'

export function useSaveCertificate(id?: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CertificateWrite) =>
      id ? certificatesApi.update(id, payload) : certificatesApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['certificates'] })
    },
  })
}
