import { createCrudApi } from '@/services/api/client'
import type { ScaffoldEntity } from '@/types'

export const usersApi = createCrudApi<ScaffoldEntity>('users')
