'use client'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { useState, useEffect } from 'react'
import { AlertCircle, Loader2, User, Briefcase, Calendar } from 'lucide-react'
import { formatUTCDate } from '@/lib/utils'
import { adminService } from '@/services/admin'

interface UserDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  token: string
}

export function UserDetailDialog({ open, onOpenChange, userId, token }: UserDetailDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userDetail, setUserDetail] = useState<any>(null)

  useEffect(() => {
    if (!open || !userId || !token) return

    const fetchUserDetail = async () => {
      setLoading(true)
      setError('')
      try {
        const result = await adminService.getDetailPengguna(token, userId)
        if (result.data) {
          setUserDetail(result.data)
        }
      } catch (err: any) {
        setError(err.message || 'Gagal memuat detail pengguna')
      } finally {
        setLoading(false)
      }
    }

    fetchUserDetail()
  }, [open, userId, token])

  // Cleanup when dialog closes
  useEffect(() => {
    if (!open) {
      setUserDetail(null)
      setError('')
    }
  }, [open])

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Clear data BEFORE closing dialog
      setUserDetail(null)
      setError('')
    }
    // Call parent's onOpenChange to update state
    onOpenChange(newOpen)
  }

  const user = userDetail?.user
  const profile = user?.profil
  const summary = userDetail?.summary
  const stats = summary?.stats

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Detail Pengguna</AlertDialogTitle>
          <AlertDialogDescription>Informasi lengkap tentang pengguna</AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : user ? (
          <div className="space-y-4 py-4 max-h-[calc(90vh-300px)] overflow-y-auto">
            {/* User Profile Section */}
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Informasi Akun
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Nama</span>
                  <span className="text-sm font-semibold text-slate-800">{user.nama}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Email</span>
                  <span className="text-sm font-semibold text-slate-800">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">ID Pengguna</span>
                  <span className="text-sm font-mono text-slate-600">{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Peran</span>
                  <span className="text-sm font-semibold capitalize text-slate-800">{user.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Status</span>
                  <span
                    className={`text-sm font-semibold px-2.5 py-1 rounded-full ${
                      user.aktif ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                    {user.aktif ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Bergabung</span>
                  <span className="text-sm font-semibold text-slate-800">{formatUTCDate(user.created_at, 'date')}</span>
                </div>
              </div>
            </div>

            {/* Profile Data Section */}
            {profile ? (
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Data Profil
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">NIK</span>
                    <span className="text-sm font-semibold text-slate-800">{profile.nik}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Alamat</span>
                    <span className="text-sm font-semibold text-slate-800 text-right max-w-xs">{profile.alamat || '-'}</span>
                  </div>
                  {profile.rt_rw && (
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">RT/RW</span>
                      <span className="text-sm font-semibold text-slate-800">{profile.rt_rw}</span>
                    </div>
                  )}
                  {profile.jumlah_anggota_keluarga && (
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Jumlah Anggota Keluarga</span>
                      <span className="text-sm font-semibold text-slate-800">{profile.jumlah_anggota_keluarga} orang</span>
                    </div>
                  )}
                  {profile.penghasilan_bulanan && (
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Penghasilan Bulanan</span>
                      <span className="text-sm font-semibold text-slate-800">
                        Rp{profile.penghasilan_bulanan.toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}
                  {profile.status_rumah && (
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Status Rumah</span>
                      <span className="text-sm font-semibold text-slate-800">{profile.status_rumah}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Summary & Statistics */}
            {summary ? (
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Ringkasan & Statistik
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Profil Lengkap</span>
                    <span className={`text-sm font-semibold ${summary.has_profile ? 'text-green-600' : 'text-amber-600'}`}>
                      {summary.has_profile ? 'Ya' : 'Belum'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Total Notifikasi</span>
                    <span className="text-sm font-semibold text-slate-800">{summary.total_notifications}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Notifikasi Belum Dibaca</span>
                    <span className="text-sm font-semibold text-slate-800">{summary.unread_notifications}</span>
                  </div>

                  {stats && (
                    <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-100">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-xs text-slate-600">Total Pengajuan</p>
                        <p className="text-lg font-bold text-blue-600">{stats.total_pengajuan}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-xs text-slate-600">Disetujui</p>
                        <p className="text-lg font-bold text-green-600">{stats.pengajuan_disetujui}</p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3">
                        <p className="text-xs text-slate-600">Ditolak</p>
                        <p className="text-lg font-bold text-red-600">{stats.pengajuan_ditolak}</p>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-3">
                        <p className="text-xs text-slate-600">Menunggu</p>
                        <p className="text-lg font-bold text-amber-600">{stats.pengajuan_menunggu}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3">
                        <p className="text-xs text-slate-600">Foto Rumah</p>
                        <p className="text-lg font-bold text-purple-600">{stats.total_foto_rumah}</p>
                      </div>
                      <div className="bg-cyan-50 rounded-lg p-3">
                        <p className="text-xs text-slate-600">Distribusi Diterima</p>
                        <p className="text-lg font-bold text-cyan-600">{stats.total_distribusi_diterima}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        <AlertDialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
            Tutup
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
