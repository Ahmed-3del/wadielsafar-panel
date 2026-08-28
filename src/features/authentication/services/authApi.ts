import { apiClient } from '@/services/api/client'
import type { User } from '@/types'
import type { LoginPayload } from '../types'

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<{ access: string }>('/auth/login/', payload).then((res) => res.data),
  refresh: () => apiClient.post<{ access: string }>('/auth/refresh/').then((res) => res.data),
  logout: () => apiClient.post<void>('/auth/logout/').then(() => undefined),
  me: () => apiClient.get<User>('/auth/me/').then((res) => res.data),
}
