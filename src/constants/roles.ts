import type { Role } from '@/types'

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
  SALES: 'SALES',
} as const satisfies Record<Role, Role>

export const ALL_ROLES: Role[] = Object.values(ROLES)

/** Roles permitted to manage users/settings — mirrors backend, UX gating only. */
export const ADMIN_ROLES: Role[] = [ROLES.SUPER_ADMIN, ROLES.ADMIN]
