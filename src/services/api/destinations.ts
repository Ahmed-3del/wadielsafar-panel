import { createCrudApi } from '@/services/api/client'
import type { Destination, DestinationWrite } from '@/features/destinations/types'

export const destinationsApi = createCrudApi<Destination, DestinationWrite>('destinations')
