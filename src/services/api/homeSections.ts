import { apiClient, createCrudApi } from '@/services/api/client'
import type { HomeSection } from '@/features/homeSections/types'

const base = createCrudApi<HomeSection, Partial<HomeSection>>('pages/home-sections')

export const homeSectionsApi = {
  ...base,
  /**
   * The whole running order in one call. Sending the full list rather than the
   * two rows that swapped keeps it consistent: two PATCHes can interleave with
   * another editor's and leave two sections claiming the same position.
   */
  reorder: (keys: string[]) =>
    apiClient
      .post<HomeSection[]>('/pages/home-sections/reorder/', { keys })
      .then((res) => res.data),
}
