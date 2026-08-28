import { createCrudApi } from '@/services/api/client'
import type { Partner, PartnerWrite } from '@/features/partners/types'

export const partnersApi = createCrudApi<Partner, PartnerWrite>('partners')
