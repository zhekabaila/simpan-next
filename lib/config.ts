// Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Storage keys
export const AUTH_TOKEN_KEY = 'sibansos_auth_token'
export const USER_KEY = 'sibansos_user'
export const TOKEN_EXPIRY_KEY = 'sibansos_token_expiry'

// Role constants
export const ROLES = {
  MASYARAKAT: 'masyarakat',
  PETUGAS: 'petugas',
  ADMIN: 'admin'
} as const
