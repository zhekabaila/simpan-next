'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import useAuthStore from '@/app/_stores/useAuthStore'

export default function RegisterPage() {
  const router = useRouter()
  const { register, user, token, isLoading, error, clearError } = useAuthStore()
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [localError, setLocalError] = useState('')
  const [form, setForm] = useState({
    nama: '',
    email: '',
    password: '',
    password_confirmation: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')
    clearError()

    // Validation
    if (!form.nama || !form.email || !form.password || !form.password_confirmation) {
      setLocalError('Semua field harus diisi')
      return
    }

    if (form.password.length < 8) {
      setLocalError('Password minimal 8 karakter')
      return
    }

    if (form.password !== form.password_confirmation) {
      setLocalError('Password tidak cocok')
      return
    }

    try {
      await register(form.nama, form.email, form.password, form.password_confirmation)
      setSubmitted(true)
    } catch (err: any) {
      setLocalError(err.message || 'Registrasi gagal')
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Pendaftaran Berhasil!</h2>
          <p className="text-slate-500 mb-6">
            Akun Anda telah berhasil dibuat. Silakan lengkapi data profil untuk mengajukan bantuan sosial.
          </p>
          <button
            onClick={() => router.push('/masyarakat/profil/1')}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
            Lengkapi Profil Sekarang
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full mt-3 py-3 text-slate-600 hover:text-slate-800 font-semibold rounded-xl transition-colors">
            Nanti Saja
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.push('/')}
            className="p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="Logo SIMPAN" className="w-8 h-8 rounded-xl object-cover" />
            <span className="font-bold text-slate-800">SIMPAN</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
          <h1 className="text-xl font-bold text-slate-800 mb-1">Daftar Akun Baru</h1>
          <p className="text-sm text-slate-500 mb-6">Buat akun untuk mengajukan bantuan sosial</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Messages */}
            {(localError || error) && (
              <div className="flex gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{localError || error}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                placeholder="Sesuai KTP"
                disabled={isLoading}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-60"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="nama@email.com"
                disabled={isLoading}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-60"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Minimal 8 karakter"
                  disabled={isLoading}
                  required
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

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                Konfirmasi Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={form.password_confirmation}
                  onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                  placeholder="Ulangi password"
                  disabled={isLoading}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-11 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:opacity-60">
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {form.password && form.password_confirmation && form.password !== form.password_confirmation && (
                <p className="text-xs text-red-500 mt-1">Password tidak cocok</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || form.password !== form.password_confirmation}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold rounded-xl transition-colors shadow-md shadow-blue-200 mt-2 disabled:cursor-not-allowed">
              {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Sudah punya akun?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-blue-600 font-semibold hover:underline disabled:opacity-60"
              disabled={isLoading}>
              Masuk
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
