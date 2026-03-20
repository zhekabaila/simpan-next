'use client'

import { useEffect } from 'react'
import useAuthStore from '@/app/_stores/useAuthStore'
import { authService } from '@/services/auth'

export function AuthProvider({ children, cookiesToken }: { children: React.ReactNode; cookiesToken: string }) {
  const { setToken, setUser, setHydrated } = useAuthStore()

  // Initialize auth with token from cookie and fetch user data
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Set token from cookie to store first
        if (cookiesToken) {
          setToken(cookiesToken)

          // Fetch user data using the token
          const currentUser = await authService.getCurrentUser(cookiesToken)
          setUser(currentUser.data)
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        // Middleware will handle logout/redirect
      } finally {
        setHydrated(true)
      }
    }

    initializeAuth()
  }, [setToken, setUser, setHydrated, cookiesToken])

  return <>{children}</>
}
