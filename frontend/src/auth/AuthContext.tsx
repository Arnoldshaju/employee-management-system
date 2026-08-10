import { useEffect, useMemo, useState } from 'react'
import * as authApi from './api'
import { AuthContext, type AuthContextValue } from './context'
import type { User } from './types'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const restoreSession = async () => {
      if (!authApi.hasStoredSession()) {
        setLoading(false)
        return
      }

      try {
        setUser(await authApi.getCurrentUser())
      } catch {
        authApi.clearTokens()
      } finally {
        setLoading(false)
      }
    }

    void restoreSession()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login: async (email, password) => setUser(await authApi.login(email, password)),
      register: async (input) => setUser(await authApi.register(input)),
      logout: async () => {
        await authApi.logout()
        setUser(null)
      },
    }),
    [loading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
