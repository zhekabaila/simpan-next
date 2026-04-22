'use client'

import { useState } from 'react'
import { Eye, EyeOff, AlertCircle, Lock, Check } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'

interface ResetPasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (password: string) => Promise<void>
  isLoading?: boolean
  userId?: string
}

export default function ResetPasswordDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  userId
}: ResetPasswordDialogProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const validatePassword = (pwd: string): string | null => {
    if (!pwd) return 'Password harus diisi'
    if (pwd.length < 8) return 'Password minimal 8 karakter'
    if (!/[A-Z]/.test(pwd)) return 'Password harus mengandung huruf besar'
    if (!/[0-9]/.test(pwd)) return 'Password harus mengandung angka'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validation
    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak sama')
      return
    }

    try {
      await onSubmit(password)
      setSuccess(true)
      setPassword('')
      setConfirmPassword('')

      // Close dialog after success
      setTimeout(() => {
        onOpenChange(false)
        setSuccess(false)
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Gagal mereset password')
    }
  }

  const handleClose = () => {
    if (!isLoading && !success) {
      setPassword('')
      setConfirmPassword('')
      setError('')
      setSuccess(false)
      onOpenChange(false)
    }
  }

  const passwordStrength = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password)
  }

  const allRequirementsMet = Object.values(passwordStrength).every(Boolean)

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Reset Password
          </AlertDialogTitle>
          <AlertDialogDescription>Masukkan password baru untuk akun Anda</AlertDialogDescription>
        </AlertDialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm font-semibold text-slate-800">Password berhasil direset!</p>
            <p className="text-xs text-slate-500 text-center">Silakan login kembali dengan password baru Anda</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="flex gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Password Input */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Password Baru</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  placeholder="Minimal 8 karakter"
                  disabled={isLoading}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-60 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:opacity-60">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2 space-y-1.5">
                  <p className="text-xs text-slate-500 font-medium">Persyaratan password:</p>
                  <div className="space-y-1 text-xs">
                    <div
                      className={`flex items-center gap-2 ${passwordStrength.length ? 'text-green-600' : 'text-slate-400'}`}>
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${passwordStrength.length ? 'bg-green-600' : 'bg-slate-300'}`}
                      />
                      Minimal 8 karakter
                    </div>
                    <div
                      className={`flex items-center gap-2 ${passwordStrength.uppercase ? 'text-green-600' : 'text-slate-400'}`}>
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${passwordStrength.uppercase ? 'bg-green-600' : 'bg-slate-300'}`}
                      />
                      Mengandung huruf besar
                    </div>
                    <div
                      className={`flex items-center gap-2 ${passwordStrength.number ? 'text-green-600' : 'text-slate-400'}`}>
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${passwordStrength.number ? 'bg-green-600' : 'bg-slate-300'}`}
                      />
                      Mengandung angka
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Konfirmasi Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setError('')
                  }}
                  placeholder="Ketik password yang sama"
                  disabled={isLoading}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-60 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:opacity-60">
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Match Indicator */}
            {password && confirmPassword && (
              <div className={`text-xs font-medium ${password === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                {password === confirmPassword ? '✓ Password cocok' : '✗ Password tidak cocok'}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors disabled:opacity-60">
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading || !allRequirementsMet || password !== confirmPassword}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed">
                {isLoading ? 'Memproses...' : 'Reset Password'}
              </button>
            </div>
          </form>
        )}

        <AlertDialogFooter />
      </AlertDialogContent>
    </AlertDialog>
  )
}
