import { createCrudApi } from '@/services/api/client'
import type { Service, ServiceWrite } from '@/features/services/types'

export const servicesApi = createCrudApi<Service, ServiceWrite>('services')
