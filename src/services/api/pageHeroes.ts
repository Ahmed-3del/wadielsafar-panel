import { createCrudApi } from '@/services/api/client'
import type { PageHero, PageHeroWrite } from '@/features/pages/types'

// Keyed by page_key rather than id, matching the backend's lookup_field.
export const pageHeroesApi = createCrudApi<PageHero, PageHeroWrite>('pages/heroes')
