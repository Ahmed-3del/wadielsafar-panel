import { useQuery } from '@tanstack/react-query'
import { packageCategoriesApi } from '@/services/api/packages'

/** Powers the category <select> in the package form. */
export function useCategoryOptions() {
  return useQuery({
    queryKey: ['packages', 'categories', 'options'],
    queryFn: () => packageCategoriesApi.list({ page: 1 }),
  })
}
