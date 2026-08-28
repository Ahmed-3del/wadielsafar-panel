import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { mediaApi } from '../services/mediaApi'

export function useMediaAssets(page = 1) {
  return useQuery({
    queryKey: ['media', 'list', page],
    queryFn: () => mediaApi.list({ page }),
    placeholderData: keepPreviousData,
  })
}
