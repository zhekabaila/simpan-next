// Services untuk API Authentication
import { User } from '@/app/_stores/useAuthStore'
import { API } from './index'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  nama: string
  email: string
  password: string
  password_confirmation: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    token_type: string
    access_token: string
    expires_in: number
    user: User
  }
}

export interface CurrentUserResponse {
  success: boolean
  message: string
  data: User
}

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await API.post('/auth/register', data)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Register failed')
    }
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await API.post('/auth/login', data)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  },

  async logout(token: string): Promise<any> {
    try {
      const response = await API.post(
        '/auth/logout',
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Logout failed')
    }
  },

  async refreshToken(token: string): Promise<any> {
    try {
      const response = await API.post(
        '/auth/refresh',
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Refresh token failed')
    }
  },

  async getCurrentUser(token: string): Promise<CurrentUserResponse> {
    try {
      const response = await API.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get current user')
    }
  }
}
