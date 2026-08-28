import { createCrudApi } from '@/services/api/client'
import type { Airport, AirportWrite } from '@/features/airports/types'

export const airportsApi = createCrudApi<Airport, AirportWrite>('airports')
