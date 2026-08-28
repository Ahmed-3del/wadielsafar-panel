import axios, { type AxiosError, type AxiosRequestConfig } from 'axios'
import type { ApiErrorBody, ListParams, PaginatedResponse } from '@/types'

const baseURL = import.meta.env.VITE_API_URL

let accessToken: string | null = null

export function getAccessToken(): string | null {
  return accessToken
}

export function setAccessToken(token: string | null): void {
  accessToken = token
}

/** Set by AuthProvider so the interceptor can clear auth state without importing React context here. */
let onSessionExpired: (() => void) | null = null

export function registerSessionExpiredHandler(handler: () => void): void {
  onSessionExpired = handler
}

export const apiClient = axios.create({ baseURL, withCredentials: true })

/** Separate instance with no interceptors, used only for the refresh call itself to avoid retry loops. */
const refreshClient = axios.create({ baseURL, withCredentials: true })

apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  refreshPromise ??= refreshClient
    .post<{ access: string }>('/auth/refresh/')
    .then((res) => res.data.access)
    .catch(() => null)
    .finally(() => {
      refreshPromise = null
    })
  return refreshPromise
}

interface RetryableConfig extends AxiosRequestConfig {
  _retried?: boolean
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryableConfig | undefined
    const isRefreshCall = config?.url?.includes('/auth/refresh/')

    if (error.response?.status === 401 && config && !config._retried && !isRefreshCall) {
      config._retried = true
      const newToken = await refreshAccessToken()
      if (newToken) {
        setAccessToken(newToken)
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${newToken}`
        return apiClient(config)
      }
      setAccessToken(null)
      onSessionExpired?.()
    }

    return Promise.reject(error)
  },
)

export function isApiErrorBody(data: unknown): data is ApiErrorBody {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    data.success === false
  )
}

function detailText(value: unknown): string {
  if (Array.isArray(value)) return (value as unknown[]).map(detailText).join(' ')
  if (typeof value === 'string') return value
  return JSON.stringify(value) ?? ''
}

/**
 * DRF puts the actionable text in `details` (per field); the top-level `message` is a
 * generic "Validation failed." — surfacing only that leaves the user with no idea what to fix.
 */
function formatDetails(details: Record<string, unknown>): string {
  return Object.entries(details)
    .map(([field, value]) => `${field}: ${detailText(value)}`)
    .join(' · ')
}

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data: unknown = error.response?.data
    if (isApiErrorBody(data)) {
      const { message, details } = data.error
      if (details && Object.keys(details).length > 0) {
        return `${message} ${formatDetails(details)}`
      }
      return message
    }
    if (error.message) return error.message
  }
  if (error instanceof Error) return error.message
  return 'Something went wrong. Please try again.'
}

/**
 * Generic CRUD factory over DRF's standard list/create/retrieve/update/delete routes,
 * shared by every domain module so feature code never re-implements request plumbing.
 */
export function createCrudApi<TEntity, TWrite = Partial<TEntity>>(resource: string) {
  const basePath = `/${resource}/`

  return {
    list: (params?: ListParams) =>
      apiClient
        .get<PaginatedResponse<TEntity>>(basePath, { params })
        .then((res) => res.data),
    retrieve: (id: number | string) =>
      apiClient.get<TEntity>(`${basePath}${id}/`).then((res) => res.data),
    create: (payload: TWrite) =>
      apiClient.post<TEntity>(basePath, payload).then((res) => res.data),
    update: (id: number | string, payload: Partial<TWrite>) =>
      apiClient.patch<TEntity>(`${basePath}${id}/`, payload).then((res) => res.data),
    remove: (id: number | string) =>
      apiClient.delete<void>(`${basePath}${id}/`).then(() => undefined),
  }
}
