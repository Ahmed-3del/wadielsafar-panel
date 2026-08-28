import { createCrudApi } from '@/services/api/client'
import type { ScaffoldEntity } from '@/types'

export const pagesApi = createCrudApi<ScaffoldEntity>('pages')
