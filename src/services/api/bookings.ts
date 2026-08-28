import { createCrudApi } from '@/services/api/client'
import type { ScaffoldEntity } from '@/types'

export const bookingsApi = createCrudApi<ScaffoldEntity>('bookings')
