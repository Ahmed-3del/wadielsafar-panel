import { createCrudApi } from '@/services/api/client'
import type {
  Cruise,
  CruisePort,
  CruisePortWrite,
  CruiseWrite,
} from '@/features/cruises/types'

export const cruisesApi = createCrudApi<Cruise, CruiseWrite>('cruises')
export const cruisePortsApi = createCrudApi<CruisePort, CruisePortWrite>('cruises/ports')
