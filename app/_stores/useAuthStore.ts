'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { AuthResponse, authService } from '@/services/auth'
import { AUTH_TOKEN_KEY, USER_KEY, TOKEN_EXPIRY_KEY } from '@/lib/config'

export interface User {
  id: string
  nama: string
  email: string
  aktif: boolean
  role: string
  created_at: string
  profil?: {
    id: string
    nik: string
    alamat: string
    rt_rw: string | null
    jumlah_anggota_keluarga: number | null
    penghasilan_bulanan: number | null
    status_rumah: string | null
    created_at: string
    updated_at: string
  }
}

interface AuthStore {
  token: string | null
  user: User | null
  isLoading: boolean
  error: string | null
  hydrated: boolean

  // Actions
  register: (nama: string, email: string, password: string, password_confirmation: string) => Promise<void>
  login: (email: string, password: string) => Promise<AuthResponse>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  checkAuth: () => Promise<void>
  initAuth: (token: string, user: User) => void
  clearError: () => void
  setToken: (token: string | null) => void
  setUser: (user: User | null) => void
  setHydrated: (hydrated: boolean) => void
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoading: false,
      error: null,
      hydrated: false,

      register: async (nama, email, password, password_confirmation) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authService.register({
            nama,
            email,
            password,
            password_confirmation
          })

          set({
            token: response.data.access_token,
            user: response.data.user,
            isLoading: false
          })

          // Save additional auth data
          if (typeof window !== 'undefined') {
            localStorage.setItem(AUTH_TOKEN_KEY, response.data.access_token)
            localStorage.setItem(USER_KEY, JSON.stringify(response.data.user))
            localStorage.setItem(TOKEN_EXPIRY_KEY, (Date.now() + response.data.expires_in * 1000).toString())
          }
        } catch (error: any) {
          set({
            error: error.message || 'Registration failed',
            isLoading: false
          })
          throw error
        }
      },

      login: async (email, password): Promise<AuthResponse> => {
        set({ isLoading: true, error: null })
        try {
          const response = await authService.login({ email, password })

          set({
            token: response.data.access_token,
            user: response.data.user,
            isLoading: false
          })

          // Save additional auth data
          if (typeof window !== 'undefined') {
            localStorage.setItem(AUTH_TOKEN_KEY, response.data.access_token)
            localStorage.setItem(USER_KEY, JSON.stringify(response.data.user))
            localStorage.setItem(TOKEN_EXPIRY_KEY, (Date.now() + response.data.expires_in * 1000).toString())
          }

          return response
        } catch (error: any) {
          set({
            error: error.message || 'Login failed',
            isLoading: false
          })
          throw error
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null })
        try {
          const { token } = get()
          if (token) {
            await authService.logout(token)
          }

          set({ token: null, user: null, isLoading: false })

          // Clear auth data
          if (typeof window !== 'undefined') {
            localStorage.removeItem(AUTH_TOKEN_KEY)
            localStorage.removeItem(USER_KEY)
            localStorage.removeItem(TOKEN_EXPIRY_KEY)
          }
        } catch (error: any) {
          set({
            error: error.message || 'Logout failed',
            isLoading: false
          })
        }
      },

      refreshToken: async () => {
        try {
          const { token } = get()
          if (!token) return

          const response = await authService.refreshToken(token)
          set({ token: response.access_token })

          if (typeof window !== 'undefined') {
            localStorage.setItem(AUTH_TOKEN_KEY, response.access_token)
            localStorage.setItem(TOKEN_EXPIRY_KEY, (Date.now() + response.expires_in * 1000).toString())
          }
        } catch (error: any) {
          // Token refresh failed, logout user
          set({ token: null, user: null })
          if (typeof window !== 'undefined') {
            localStorage.removeItem(AUTH_TOKEN_KEY)
            localStorage.removeItem(USER_KEY)
            localStorage.removeItem(TOKEN_EXPIRY_KEY)
          }
        }
      },

      checkAuth: async () => {
        try {
          const { token } = get()
          if (!token) return

          const response = await authService.getCurrentUser(token)
          set({ user: response.data })
        } catch (error) {
          // Invalid token, clear auth
          set({ token: null, user: null })
          if (typeof window !== 'undefined') {
            localStorage.removeItem(AUTH_TOKEN_KEY)
            localStorage.removeItem(USER_KEY)
            localStorage.removeItem(TOKEN_EXPIRY_KEY)
          }
        }
      },

      clearError: () => set({ error: null }),
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      setHydrated: (hydrated) => set({ hydrated }),
      initAuth: (token, user) => {
        set({ token, user })
        if (typeof window !== 'undefined') {
          localStorage.setItem(AUTH_TOKEN_KEY, token)
          localStorage.setItem(USER_KEY, JSON.stringify(user))
        }
      }
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {}
        }
      }),
      partialize: (state) => ({
        token: state.token,
        user: state.user
      }),
      onRehydrateStorage: () => (state) => {
        // Mark as hydrated after persist middleware restores from storage
        if (state) {
          state.hydrated = true
        }
      }
    }
  )
)

export default useAuthStore
