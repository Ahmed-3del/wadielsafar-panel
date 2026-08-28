import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { PaginatedResponse } from '@/types'
import { homeSectionsApi } from '../services/homeSectionsApi'
import type { HomeSection } from '../types'

type Page = PaginatedResponse<HomeSection>

export function useToggleHomeSection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) =>
      homeSectionsApi.update(id, { is_active }),

    /* Applied to the cache before the request goes out. A controlled checkbox
       bound to server state does not move until the reply lands, which reads
       as a dead control rather than a slow one. */
    onMutate: async ({ id, is_active }) => {
      await queryClient.cancelQueries({ queryKey: ['home-sections'] })
      const previous = queryClient.getQueryData<Page>(['home-sections'])
      if (previous) {
        queryClient.setQueryData<Page>(['home-sections'], {
          ...previous,
          results: previous.results.map((section) =>
            section.id === id ? { ...section, is_active } : section,
          ),
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
