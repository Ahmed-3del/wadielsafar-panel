import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { PaginatedResponse } from '@/types'
import { homeSectionsApi } from '../services/homeSectionsApi'
import type { HomeSection } from '../types'

type Page = PaginatedResponse<HomeSection>

export function useReorderHomeSections() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (keys: string[]) => homeSectionsApi.reorder(keys),

    /* The row has to move under the cursor, not a round trip later —
       otherwise the second click of a two-step move lands on the wrong row. */
    onMutate: async (keys) => {
      await queryClient.cancelQueries({ queryKey: ['home-sections'] })
      const previous = queryClient.getQueryData<Page>(['home-sections'])
      if (previous) {
        const position = new Map(keys.map((key, index) => [key, index]))
        queryClient.setQueryData<Page>(['home-sections'], {
          ...previous,
          results: previous.results.map((section) => ({
            ...section,
            order: position.get(section.key) ?? section.order,
          })),
        })
      }
      return { previous }
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(['home-sections'], context.previous)
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['home-sections'] })
    },
  })
}
