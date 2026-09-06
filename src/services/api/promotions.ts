import { createCrudApi } from '@/services/api/client'
import type { Promotion, PromotionWrite } from '@/features/promotions/types'

export const promotionsApi = createCrudApi<Promotion, PromotionWrite>('company/promotions')
