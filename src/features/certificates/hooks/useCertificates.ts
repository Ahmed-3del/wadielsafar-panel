import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { certificatesApi } from '../services/certificatesApi'

export function useCertificates(page: number) {
  return useQuery({
    queryKey: ['certificates', 'list', page],
    queryFn: () => certificatesApi.list({ page }),
    placeholderData: keepPreviousData,
  })
}
