import { createCrudApi } from '@/services/api/client'
import type { Cruise, CruiseWrite } from '@/features/cruises/types'

export const cruisesApi = createCrudApi<Cruise, CruiseWrite>('cruises')
