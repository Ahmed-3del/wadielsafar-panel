import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import type { Role } from '@/types'
import { useAuth } from '@/features/authentication'

interface RequireRoleProps {
  roles: Role[]
  children: ReactNode
}

/**
 * UX-only gate: hides a module from roles that shouldn't see it in this panel.
 * The Django backend is the real authorization boundary and re-checks every request.
 */
export function RequireRole({ roles, children }: RequireRoleProps) {
  const { hasRole } = useAuth()

  if (!hasRole(...roles)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
