import useAuthStore from '@/app/_stores/useAuthStore'
import { authService } from '@/services/auth'

/**
 * Fetches data with automatic token refresh on 401
 */
export async function fetchWithTokenRefresh(
  url: string,
  options: RequestInit & { skipAuth?: boolean } = {}
): Promise<Response> {
  const { skipAuth = false, ...fetchOptions } = options

  let response = await fetch(url, fetchOptions)

  // If token expired (401), try to refresh and retry
  if (response.status === 401 && !skipAuth) {
    try {
      const { token } = useAuthStore.getState()

      if (token) {
        // Attempt to refresh token
        const refreshResponse = await authService.refreshToken(token)
        const { token: newToken } = refreshResponse.data

        // Update store with new token
        useAuthStore.setState({ token: newToken })

        // Update Authorization header with new token
        const headers = new Headers(fetchOptions.headers || {})
        headers.set('Authorization', `Bearer ${newToken}`)

        // Retry original request with new token
        response = await fetch(url, { ...fetchOptions, headers })
      }
    } catch (refreshError) {
      // Token refresh failed, logout user
      useAuthStore.getState().logout()
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  }

  return response
}

/**
 * Hook for using fetch with automatic token refresh
 */
export function useFetchWithTokenRefresh() {
  return {
    fetch: fetchWithTokenRefresh
  }
}
