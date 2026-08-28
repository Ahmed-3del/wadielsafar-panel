import { createCrudApi } from '@/services/api/client'
import type { VisaCountry, VisaType, VisaTypeWrite } from '@/features/visas/types'

export const visasApi = createCrudApi<VisaType, VisaTypeWrite>('visas')
export const visaCountriesApi = createCrudApi<VisaCountry>('visas/countries')
