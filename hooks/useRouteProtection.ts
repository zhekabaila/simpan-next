'use client'

import { useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import useAuthStore from '@/app/_stores/useAuthStore'
import { ROLES } from '@/lib/config'

const ROLE_ROUTES: { [key: string]: string } = {
  [ROLES.ADMIN]: '/admin',
  [ROLES.PETUGAS]: '/petugas',
  [ROLES.MASYARAKAT]: '/masyarakat'
}

export function useRouteProtection() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, token, checkAuth } = useAuthStore()

  const validateRoute = useCallback(async () => {
    // Public routes
    const publicRoutes = ['/login', '/register']
    if (publicRoutes.includes(pathname)) {
      if (token && user) {
        // Already logged in, redirect to dashboard
        const dashboard = ROLE_ROUTES[user.role]
        if (dashboard && !pathname.startsWith(dashboard)) {
          router.push(dashboard)
        }
      }
      return
    }

    // Check if token exists
    if (!token) {
      router.push('/login')
      return
    }

    // Validate token by getting current user
    try {
      if (!user) {
        await checkAuth()
      }
    } catch (error) {
      router.push('/login')
      return
    }

    // Check role-based routing
    if (user) {
      const userRole = user.role
      const allowedRoute = ROLE_ROUTES[userRole]

      if (allowedRoute && !pathname?.startsWith(allowedRoute)) {
        router.push(allowedRoute)
      }
    }
  }, [user, token, pathname, router, checkAuth])

  useEffect(() => {
    validateRoute()
  }, [validateRoute])
}
