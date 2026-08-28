import { apiClient, createCrudApi } from '@/services/api/client'
import type { NavItem, NavItemWrite } from '@/features/navigation/types'

const base = createCrudApi<NavItem, NavItemWrite>('navigation')

export const navigationApi = {
  ...base,
  /* The API returns navigation unpaginated — the header wants the whole set in
     one request — so this endpoint answers with a bare array, not an envelope. */
  list: () => apiClient.get<NavItem[]>('/navigation/').then((res) => res.data),
}
