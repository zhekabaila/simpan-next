'use client'

import { removeToken } from '@/actions/auth'
import useAuthStore from '@/app/_stores/useAuthStore'
import { User, MapPin, Edit2, Loader2, Phone, Lock, LogOut } from 'lucide-react'
import { useTransition, useState, useEffect } from 'react'
import { petugasService } from '@/services/petugas'
import ResetPasswordDialog from '@/components/dialogs/reset-password-dialog'
import { EditProfilPetugasDialog } from '@/components/dialogs/edit-profil-petugas-dialog'

interface ProfilData {
  id: string
  user_id: string
  nama: string
  email: string
  nomor_telepon: string
  alamat: string
  latitude: number
  longitude: number
  created_at: string
  updated_at: string
}

const ProfilPetugasPage = () => {
  const [saving, startSaving] = useTransition()
  const { logout, isLoading, token, user } = useAuthStore()
  const [profileData, setProfileData] = useState<ProfilData | null>(null)
  const [loading, setLoading] = useState(true)
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [editProfilOpen, setEditProfilOpen] = useState(false)

  useEffect(() => {
    if (!token) return

    const fetchProfil = async () => {
      setLoading(true)
      try {
        const result = await petugasService.getProfil(token)
        if (result.data) {
          setProfileData(result.data)
        }
      } catch (err) {
        // New profile, continue with empty form
      } finally {
        setLoading(false)
      }
    }
    fetchProfil()
  }, [token])

  const getAvatarInitials = (nama: string) => {
    if (!nama) return 'P'
    return nama
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = async () => {
    try {
      startSaving(async () => {
        await removeToken()
        await logout()
      })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleResetPassword = async (password: string) => {
    if (!token || !user?.id) {
      throw new Error('User tidak terautentikasi')
    }

    setResetLoading(true)
    try {
      await petugasService.resetPassword(token, user.id, password)
    } finally {
      setResetLoading(false)
    }
  }

  const handleUpdateProfil = async (data: {
    nomor_telepon: string
    alamat: string
    latitude: number
    longitude: number
  }) => {
    if (!token) {
      throw new Error('User tidak terautentikasi')
    }

    await petugasService.updateProfil(token, data)
    // Refresh profil data
    const result = await petugasService.getProfil(token)
    if (result.data) {
      setProfileData(result.data)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 py-6 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-slate-600">Memuat profil...</p>
        </div>
      </div>
    )
  }

  // Use default profile data if empty
  const displayProfile = profileData || {
    id: '',
    user_id: '',
    nama: '',
    email: '',
    nomor_telepon: '',
    alamat: '',
    latitude: 0,
    longitude: 0,
    created_at: '',
    updated_at: ''
  }

  return (
    <div className="max-w-2xl mx-auto p-4 py-6">
      <h1 className="text-xl font-bold text-slate-800 mb-5">Profil Saya</h1>

      {/* Avatar & Name */}
      <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl p-5 mb-4 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <span className="text-2xl font-extrabold">{getAvatarInitials(displayProfile.nama)}</span>
          </div>
          <div>
            <h2 className="text-lg font-bold">{displayProfile.nama || '-'}</h2>
            <p className="text-amber-100 text-sm">{user?.email}</p>
            <p className="text-amber-100 text-sm">{user?.aktif ? '🟢 Aktif' : '🔴 Tidak Aktif'}</p>
          </div>
          <button
            onClick={() => setEditProfilOpen(true)}
            className="ml-auto p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Informasi Akun */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-blue-50 rounded-xl">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="font-bold text-slate-800">Informasi Akun</h3>
        </div>
        <div className="space-y-2.5">
          {[
            { label: 'Email', value: displayProfile.email || '-' },
            { label: 'Nama Lengkap', value: displayProfile.nama || '-' }
          ].map((item) => (
            <div key={item.label} className="flex justify-between py-1.5 border-b border-slate-50 last:border-0">
              <span className="text-sm text-slate-500">{item.label}</span>
              <span className="text-sm font-semibold text-slate-800">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Kontak & Lokasi */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-green-50 rounded-xl">
            <MapPin className="w-4 h-4 text-green-600" />
          </div>
          <h3 className="font-bold text-slate-800">Lokasi & Kontak</h3>
        </div>
        <div className="space-y-2.5">
          {[
            { label: 'Nomor Telepon', value: displayProfile.nomor_telepon || '-', icon: Phone },
            { label: 'Alamat', value: displayProfile.alamat || '-' },
            {
              label: 'Koordinat',
              value:
                displayProfile.latitude && displayProfile.longitude
                  ? `${Number(displayProfile.latitude).toFixed(4)}, ${Number(displayProfile.longitude).toFixed(4)}`
                  : '-'
            }
          ].map((item) => (
            <div key={item.label} className="flex justify-between py-1.5 border-b border-slate-50 last:border-0">
              <span className="text-sm text-slate-500">{item.label}</span>
              <span className="text-sm font-semibold text-slate-800">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Password Button */}
      <button
        onClick={() => setResetPasswordOpen(true)}
        disabled={saving || isLoading}
        className="w-full flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 font-semibold rounded-xl hover:bg-blue-100 transition-colors disabled:opacity-60 mb-3">
        <Lock className="w-4 h-4" />
        Reset Password
      </button>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-500 font-semibold rounded-xl hover:bg-red-100 transition-colors">
        <LogOut className="w-4 h-4" />
        Keluar
      </button>

      {/* Reset Password Dialog */}
      <ResetPasswordDialog
        open={resetPasswordOpen}
        onOpenChange={setResetPasswordOpen}
        onSubmit={handleResetPassword}
        isLoading={resetLoading}
        userId={user?.id}
      />

      {/* Edit Profil Dialog */}
      <EditProfilPetugasDialog
        open={editProfilOpen}
        onOpenChange={setEditProfilOpen}
        profilData={profileData}
        onSubmit={handleUpdateProfil}
      />
    </div>
  )
}

export default ProfilPetugasPage
