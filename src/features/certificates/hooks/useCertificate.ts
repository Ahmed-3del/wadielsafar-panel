import { useQuery } from '@tanstack/react-query'
import { certificatesApi } from '../services/certificatesApi'

export function useCertificate(id: number | undefined) {
  return useQuery({
    queryKey: ['certificates', 'detail', id],
    queryFn: () => certificatesApi.retrieve(id as number),
    enabled: id !== undefined,
  })
}
