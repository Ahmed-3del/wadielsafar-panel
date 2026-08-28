import type { Role, User } from '@/types'

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthContextValue {
  user: User | null
  accessToken: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  /** UX gating only — the backend is the real authority on what a role may do. */
  hasRole: (...roles: Role[]) => boolean
}
