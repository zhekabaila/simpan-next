'use client'

import { removeToken } from '@/actions/auth'
import useAuthStore, { User as UserType } from '@/app/_stores/useAuthStore'
import { User, MapPin, Briefcase, LogOut, ChevronRight, Edit2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useTransition, useState, useEffect } from 'react'
import { toast } from 'sonner'
import { authService } from '@/services/auth'

const ProfilPage = () => {
  const [saving, startSaving] = useTransition()
  const { logout, isLoading, token } = useAuthStore()
  const [profileData, setProfileData] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return

    const fetchProfile = async () => {
      try {
        setLoading(true)
        const result = await authService.getCurrentUser(token)
        if (result.data) {
          setProfileData(result.data)
        }
      } catch (error: any) {
        toast.error('Gagal mengambil data profil', { description: error.message })
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [token])

  const getAvatarInitials = (nama: string) => {
    if (!nama) return 'U'
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

  if (!profileData) {
    return (
      <div className="max-w-2xl mx-auto p-4 py-6 flex items-center justify-center min-h-screen">
        <p className="text-slate-600">Data profil tidak ditemukan</p>
      </div>
    )
  }
  return (
    <div className="max-w-2xl mx-auto p-4 py-6">
      <h1 className="text-xl font-bold text-slate-800 mb-5">Profil Saya</h1>

      {/* Avatar & Name */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 mb-4 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <span className="text-2xl font-extrabold">{getAvatarInitials(profileData.nama)}</span>
          </div>
          <div>
            <h2 className="text-lg font-bold">{profileData.nama}</h2>
            <p className="text-blue-100 text-sm">{profileData.email}</p>
            <p className="text-blue-100 text-sm">{profileData.aktif ? '🟢 Aktif' : '🔴 Tidak Aktif'}</p>
          </div>
          <button className="ml-auto p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Data Diri */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-blue-50 rounded-xl">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="font-bold text-slate-800">Data Diri</h3>
          <Link
            href={`/masyarakat/profil/${profileData.id}`}
            className="ml-auto text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1">
          <Edit2 className="w-3 h-3" />
            Edit
          </Link>
        </div>
        <div className="space-y-2.5">
          {[
            { label: 'NIK', value: profileData.profil?.nik || '-' },
            {
              label: 'RT/RW',
              value: profileData.profil?.rt_rw || '-'
            },
            {
              label: 'Jumlah Anggota Keluarga',
              value: profileData.profil?.jumlah_anggota_keluarga
                ? `${profileData.profil?.jumlah_anggota_keluarga} orang`
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

      {/* Alamat */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-green-50 rounded-xl">
            <MapPin className="w-4 h-4 text-green-600" />
          </div>
          <h3 className="font-bold text-slate-800">Alamat</h3>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">{profileData.profil?.alamat || '-'}</p>
      </div>

      {/* Ekonomi */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-amber-50 rounded-xl">
            <Briefcase className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="font-bold text-slate-800">Kondisi Ekonomi</h3>
        </div>
        <div className="space-y-2.5">
          {[
            {
              label: 'Penghasilan Bulanan',
              value: profileData.profil?.penghasilan_bulanan
                ? `Rp ${profileData.profil?.penghasilan_bulanan.toLocaleString('id-ID')}`
                : '-'
            },
            { label: 'Status Rumah', value: profileData.profil?.status_rumah || '-' }
          ].map((item) => (
            <div key={item.label} className="flex justify-between py-1.5 border-b border-slate-50 last:border-0">
              <span className="text-sm text-slate-500">{item.label}</span>
              <span className="text-sm font-semibold text-slate-800">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50 mb-4">
        {[
          { label: 'Ubah Password', icon: '🔑' },
          { label: 'Notifikasi & Pengaturan', icon: '🔔' },
          { label: 'Bantuan & FAQ', icon: '❓' },
          { label: 'Syarat & Ketentuan', icon: '📋' }
        ].map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors text-left">
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm font-semibold text-slate-700">{item.label}</span>
            <ChevronRight className="w-4 h-4 text-slate-300 ml-auto" />
          </button>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-500 font-semibold rounded-xl hover:bg-red-100 transition-colors">
        <LogOut className="w-4 h-4" />
        Keluar
      </button>
    </div>
  )
}

export default ProfilPage
