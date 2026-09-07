import { useMutation, useQueryClient } from '@tanstack/react-query'
import { inquiryServiceTypesApi } from '@/services/api/inquiryServiceTypes'

export function useDeleteInquiryServiceType() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => inquiryServiceTypesApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['inquiryServiceTypes'] })
    },
  })
}
