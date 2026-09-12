import { apiClient } from './client'
import type { PromoBar, PromoBarWrite } from '@/features/promoBar/types'

// Not createCrudApi: there is no id to route on, and no list, create or
// delete — exactly one row exists, always at this same path.
const PATH = '/company/promo-bar/'

export const promoBarApi = {
  retrieve: () => apiClient.get<PromoBar>(PATH).then((res) => res.data),
  update: (payload: PromoBarWrite) =>
    apiClient.patch<PromoBar>(PATH, payload).then((res) => res.data),
}
