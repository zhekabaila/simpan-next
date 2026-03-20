'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Shield, Users, HardHat, ShieldCheck, AlertCircle } from 'lucide-react'
import useAuthStore from '@/app/_stores/useAuthStore'
import { ROLES } from '@/lib/config'
import { saveToken } from '@/actions/auth'

type Role = 'masyarakat' | 'petugas' | 'admin'

const roleConfig = {
  masyarakat: {
    icon: Users,
    label: 'Masyarakat',
    desc: 'Penerima bantuan sosial',
    redirectTo: ROLES.MASYARAKAT
  },
  petugas: {
    icon: HardHat,
    label: 'Petugas',
    desc: 'Petugas lapangan distribusi',
    redirectTo: ROLES.PETUGAS
  },
  admin: {
    icon: ShieldCheck,
    label: 'Admin',
    desc: 'Pengelola sistem',
    redirectTo: ROLES.ADMIN
  }
}

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading, error, clearError } = useAuthStore()
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [localError, setLocalError] = useState('')
  const [saving, startSaveToken] = useTransition()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')
    clearError()

    if (!form.email || !form.password) {
      setLocalError('Email dan password harus diisi')
      return
    }

    try {
      const response = await login(form.email, form.password)

      startSaveToken(async () => {
        await saveToken(response.data.access_token, response.data.user.role).then(() => {
          const redirectRoute: Record<string, string> = {
            masyarakat: '/masyarakat/dashboard',
            petugas: '/petugas/dashboard',
            admin: '/admin/dashboard'
          }
          const role = response.data.user.role as keyof typeof redirectRoute
          router.push(redirectRoute[role] || '/login')
        })
      })
    } catch (err: any) {
      setLocalError(err.message || 'Login gagal')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mb-4">
          <Shield className="w-9 h-9 text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-800">SIBANSOS-QR</h1>
        <p className="text-slate-500 mt-1 text-center max-w-xs">Penyaluran Bantuan Sosial yang Tepat Sasaran</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl shadow-slate-100 border border-slate-100 w-full max-w-md p-6">
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Error Messages */}
          {(localError || error) && (
            <div className="flex gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{localError || error}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="nama@email.com"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-60"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Masukkan password"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-11 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:opacity-60">
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || saving}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold rounded-xl transition-colors shadow-md shadow-blue-200 disabled:cursor-not-allowed">
            {isLoading || saving ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-5">
          Belum punya akun?{' '}
          <button
            onClick={() => router.push('/register')}
            className="text-blue-600 font-semibold hover:underline disabled:opacity-60"
            disabled={isLoading || saving}>
            Daftar sebagai Masyarakat
          </button>
        </p>
      </div>

      <p className="mt-6 text-xs text-slate-400 text-center">© 2025 SIBANSOS-QR · Kementerian Sosial RI</p>
    </div>
  )
}
