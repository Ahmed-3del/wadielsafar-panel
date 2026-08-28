import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Role, User } from '@/types'
import { registerSessionExpiredHandler, setAccessToken } from '@/services/api/client'
import { authApi } from '../services/authApi'
import { AuthContext } from '../hooks/AuthContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessTokenState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const clearAuth = useCallback(() => {
    setAccessToken(null)
    setAccessTokenState(null)
    setUser(null)
  }, [])

  useEffect(() => {
    registerSessionExpiredHandler(clearAuth)
  }, [clearAuth])

  // Cookie-based refresh token isn't readable from JS, so the only way to know if a
  // session exists on load is to attempt a silent refresh before rendering protected routes.
  useEffect(() => {
    let cancelled = false

    async function silentRefresh() {
      try {
        const { access } = await authApi.refresh()
        if (cancelled) return
        setAccessToken(access)
        setAccessTokenState(access)
        const me = await authApi.me()
        if (!cancelled) setUser(me)
      } catch {
        if (!cancelled) clearAuth()
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void silentRefresh()
    return () => {
      cancelled = true
    }
  }, [clearAuth])

  const login = useCallback(async (email: string, password: string) => {
    const { access } = await authApi.login({ email, password })
    setAccessToken(access)
    setAccessTokenState(access)
    const me = await authApi.me()
    setUser(me)
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      clearAuth()
    }
  }, [clearAuth])

  const hasRole = useCallback(
    (...roles: Role[]) => (user ? roles.includes(user.role) : false),
    [user],
  )

  const value = useMemo(
    () => ({ user, accessToken, isLoading, login, logout, hasRole }),
    [user, accessToken, isLoading, login, logout, hasRole],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
