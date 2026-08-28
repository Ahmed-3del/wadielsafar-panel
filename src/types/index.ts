export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'SALES'

export interface User {
  id: number
  email: string
  first_name?: string
  last_name?: string
  role: Role
  is_active?: boolean
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface ApiErrorBody {
  success: false
  error: {
    code: string
    message: string
    details?: Record<string, unknown> | null
  }
}

export interface ListParams {
  page?: number
  search?: string
  [key: string]: string | number | undefined
}

/**
 * Shape for backend modules that are scaffolded-but-minimal in phase 1 (see project README).
 * Real fields land in phase 2 without touching the CRUD plumbing built on top of this type.
 */
export interface ScaffoldEntity {
  id: number
  [key: string]: unknown
}
