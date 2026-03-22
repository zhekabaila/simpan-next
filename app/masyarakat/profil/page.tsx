'use client'

import { removeToken } from '@/actions/auth'
import useAuthStore from '@/app/_stores/useAuthStore'
import { User, MapPin, Briefcase, LogOut, ChevronRight, Edit2, Loader2, Home } from 'lucide-react'
import Link from 'next/link'
import { useTransition, useState, useEffect } from 'react'
import { masyarakatService } from '@/services/masyarakat'

interface ProfileData {
  id: string
  user_id: string
  nik: string
  nama: string
  nomor_telepon: string
  tanggal_lahir: string
  jenis_kelamin: string
  alamat: string
  rt: string
  rw: string
  kelurahan: string
  kecamatan: string
  kota: string
  provinsi: string
  latitude: string
  longitude: string
  status_pernikahan: string
  jumlah_tanggungan: number
  status_pekerjaan: string
  penghasilan_bulanan: number
  status_kepemilikan_rumah: string
  foto_rumah: Array<{
    id: string
    jenis_foto: string
    url_foto: string
    keterangan: string
    diunggah_pada: string
  }>
  created_at: string
  updated_at: string
}

const ProfilPage = () => {
  const [saving, startSaving] = useTransition()
  const { logout, isLoading, token, user } = useAuthStore()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return

    const fetchProfil = async () => {
      setLoading(true)
      try {
        const result = await masyarakatService.getProfil(token)
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
            <p className="text-blue-100 text-sm">{user?.email}</p>
            <p className="text-blue-100 text-sm">{user?.aktif ? '🟢 Aktif' : '🔴 Tidak Aktif'}</p>
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
            { label: 'NIK', value: profileData?.nik || '-' },
            {
              label: 'RT/RW',
              value: profileData.rt && profileData.rw ? `${profileData.rt}/${profileData.rw}` : '-'
            },
            {
              label: 'Jumlah Tanggungan',
              value: profileData.jumlah_tanggungan ? `${profileData.jumlah_tanggungan} orang` : '-'
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
        <p className="text-sm text-slate-700 leading-relaxed mb-4">{profileData.alamat || '-'}</p>
        <div className="space-y-2">
          {[
            { label: 'Kelurahan', value: profileData.kelurahan || '-' },
            { label: 'Kecamatan', value: profileData.kecamatan || '-' },
            { label: 'Kota', value: profileData.kota || '-' },
            { label: 'Provinsi', value: profileData.provinsi || '-' }
          ].map((item) => (
            <div key={item.label} className="flex justify-between text-sm">
              <span className="text-slate-500">{item.label}</span>
              <span className="font-semibold text-slate-800">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ekonomi & Pekerjaan */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-amber-50 rounded-xl">
            <Briefcase className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="font-bold text-slate-800">Kondisi Ekonomi & Pekerjaan</h3>
        </div>
        <div className="space-y-2.5">
          {[
            {
              label: 'Penghasilan Bulanan',
              value: profileData.penghasilan_bulanan ? `Rp ${profileData.penghasilan_bulanan.toLocaleString('id-ID')}` : '-'
            },
            { label: 'Status Kepemilikan Rumah', value: profileData.status_kepemilikan_rumah || '-' },
            { label: 'Status Pekerjaan', value: profileData.status_pekerjaan || '-' }
          ].map((item) => (
            <div key={item.label} className="flex justify-between py-1.5 border-b border-slate-50 last:border-0">
              <span className="text-sm text-slate-500">{item.label}</span>
              <span className="text-sm font-semibold text-slate-800">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Informasi Pribadi */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-purple-50 rounded-xl">
            <User className="w-4 h-4 text-purple-600" />
          </div>
          <h3 className="font-bold text-slate-800">Informasi Pribadi</h3>
        </div>
        <div className="space-y-2.5">
          {[
            { label: 'No. Telepon', value: profileData.nomor_telepon || '-' },
            {
              label: 'Tanggal Lahir',
              value: profileData.tanggal_lahir ? new Date(profileData.tanggal_lahir).toLocaleDateString('id-ID') : '-'
            },
            {
              label: 'Jenis Kelamin',
              value: profileData.jenis_kelamin === 'L' ? 'Laki-laki' : profileData.jenis_kelamin === 'P' ? 'Perempuan' : '-'
            },
            { label: 'Status Pernikahan', value: profileData.status_pernikahan?.replace('_', ' ') || '-' }
          ].map((item) => (
            <div key={item.label} className="flex justify-between py-1.5 border-b border-slate-50 last:border-0">
              <span className="text-sm text-slate-500">{item.label}</span>
              <span className="text-sm font-semibold text-slate-800">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Foto Rumah */}
      {profileData.foto_rumah && profileData.foto_rumah.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-orange-50 rounded-xl">
              <Home className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="font-bold text-slate-800">Foto Rumah</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {profileData.foto_rumah.map((foto) => (
              <div
                key={foto.id}
                className="rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <img src={foto.url_foto} alt={foto.jenis_foto} className="w-full h-32 object-cover" />
                <div className="p-2 bg-slate-50">
                  <p className="text-xs font-semibold text-slate-700 capitalize">{foto.jenis_foto?.replace('_', ' ')}</p>
                  <p className="text-xs text-slate-500 line-clamp-2">{foto.keterangan}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
