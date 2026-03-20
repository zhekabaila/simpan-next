'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/app/_stores/useAuthStore'
import { ROLES } from '@/lib/config'

export interface ProtectedRouteProps {
  allowedRoles?: (typeof ROLES)[keyof typeof ROLES][]
  children: React.ReactNode
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const router = useRouter()
  const { user, token, checkAuth, isLoading } = useAuthStore()

  useEffect(() => {
    const checkAndValidateAuth = async () => {
      if (!token) {
        router.push('/login')
        return
      }

      try {
        await checkAuth()
      } catch (error) {
        router.push('/login')
        return
      }
    }

    checkAndValidateAuth()
  }, [])

  if (isLoading || !user || !token) {
    return <div>Loading...</div>
  }

  // Check if user has allowed roles
  if (allowedRoles && allowedRoles.length > 0) {
    const hasAllowedRole = user.role

    if (!hasAllowedRole) {
      // Redirect based on user role
      if (user.role.includes(ROLES.ADMIN)) {
        router.push('/admin')
      } else if (user.role.includes(ROLES.PETUGAS)) {
        router.push('/petugas')
      } else if (user.role.includes(ROLES.MASYARAKAT)) {
        router.push('/masyarakat')
      } else {
        router.push('/login')
      }
      return null
    }
  }

  return <>{children}</>
}
