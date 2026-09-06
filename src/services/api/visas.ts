import { createCrudApi } from '@/services/api/client'
import type {
  VisaCountry,
  VisaCountryWrite,
  VisaType,
  VisaTypeWrite,
} from '@/features/visas/types'

export const visasApi = createCrudApi<VisaType, VisaTypeWrite>('visas')
export const visaCountriesApi = createCrudApi<VisaCountry, VisaCountryWrite>('visas/countries')
