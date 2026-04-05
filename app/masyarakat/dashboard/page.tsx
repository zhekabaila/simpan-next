'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Bell, QrCode, FileText, ChevronRight, CheckCircle2, Clock, Download, Plus, AlertCircle, Upload } from 'lucide-react'
import useAuthStore from '@/app/_stores/useAuthStore'
import { formatUTCDate } from '@/lib/utils'
import { masyarakatService } from '@/services/masyarakat'
import { StatusBadge } from '@/components/core/StatusBadge'
import ImageViewer from '@/components/core/image-viewer'
import { downloadFile } from '@/lib/utils'
import Link from 'next/link'

export default function MasyarakatDashboardPage() {
  const router = useRouter()
  const { user, token } = useAuthStore()

  const [pengajuanStatus, setPengajuanStatus] = useState<any>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [qrCode, setQRCode] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return

    const fetchData = async () => {
      try {
        setLoading(true)
        setError('')

        // Fetch pengajuan status
        const statusResult = await masyarakatService.getPengajuanStatus(token)
        setPengajuanStatus(statusResult)

        // Fetch notifications
        const notifResult = await masyarakatService.getNotifikasi(token, 1, 5)
        setNotifications(notifResult.data || [])

        // Try to fetch QR code if approved
        if (statusResult?.status === 'disetujui') {
          try {
            const qrResult = await masyarakatService.getQRCode(token)
            setQRCode(qrResult.data)
          } catch (err) {
            // QR code not yet available, ignore
          }
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  const status = pengajuanStatus?.status || 'menunggu'
  const isApproved = status === 'disetujui'
  const unreadCount = notifications.filter((n) => !n.sudah_dibaca).length

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 py-5">
        <div className="space-y-4">
          <div className="h-10 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-24 bg-slate-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4 py-5">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-800">Gagal memuat data</p>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Greeting */}
      <div className="mb-5">
        <p className="text-slate-500 text-sm">Selamat datang,</p>
        <h1 className="text-xl font-extrabold text-slate-800">{user?.nama || 'Pengguna'} 👋</h1>
      </div>

      {/* Status Card */}
      {pengajuanStatus ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-slate-400 font-medium">Status Pengajuan</p>
              <p className="text-lg font-extrabold text-slate-800 tracking-wider">
                {pengajuanStatus.nomor_pengajuan || 'N/A'}
              </p>
            </div>
            <StatusBadge status={status} />
          </div>
          <div className="h-px bg-slate-100 my-3" />
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock className="w-4 h-4" />
            <span>Dikirim: {formatUTCDate(pengajuanStatus.diajukan_pada, 'date')}</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {pengajuanStatus.catatan_admin || 'Pengajuan Anda sedang dalam proses. Kami akan memberitahu Anda segera.'}
          </p>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-800">Belum Ada Pengajuan</p>
              <p className="text-xs text-blue-600">Ajukan bantuan sosial untuk memulai</p>
            </div>
          </div>
          <div>
            <Link
              href="/masyarakat/profil/1"
              className="flex items-center gap-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded-md">
              <Upload className="w-3 h-3" />
              Buat Pengajuan
            </Link>
          </div>
        </div>
      )}

      {/* QR Card (show when approved) */}
      {isApproved ? (
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 mb-4 text-white">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5" />
            <p className="font-bold">Pengajuan Disetujui!</p>
          </div>
          <p className="text-sm text-green-100 mb-4">Tunjukkan QR Code ini kepada petugas saat distribusi bantuan.</p>
          {qrCode ? (
            <div className="bg-white rounded-xl p-4 flex flex-col items-center gap-3">
              {/* QR Code Image */}
              <ImageViewer hideOverlay fileName={qrCode.token_qr} src={qrCode.url_gambar_qr} alt={qrCode.token_qr} />
              <p className="text-xs text-slate-500 font-mono">{qrCode.token_qr}</p>
              <button
                onClick={() => {
                  downloadFile(qrCode.url_gambar_qr, `${qrCode.token_qr}.svg`)
                }}
                className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700">
                <Download className="w-4 h-4" />
                Unduh QR Code
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-4 text-center text-slate-600">
              <p className="text-sm">QR Code sedang diproses...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <QrCode className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-800">QR Code Belum Tersedia</p>
              <p className="text-xs text-blue-600">QR Code akan tersedia setelah pengajuan disetujui oleh admin.</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => router.push('/masyarakat/pengajuan')}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col items-start gap-2 hover:border-blue-200 hover:shadow-md transition-all">
          <div className="p-2 bg-blue-50 rounded-xl">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Lihat Pengajuan</p>
          <p className="text-xs text-slate-400">Status dan detail</p>
        </button>
        <button
          onClick={() => router.push('/masyarakat/qrcode')}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col items-start gap-2 hover:border-blue-200 hover:shadow-md transition-all">
          <div className="p-2 bg-purple-50 rounded-xl">
            <QrCode className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-sm font-semibold text-slate-800">QR Code Saya</p>
          <p className="text-xs text-slate-400">Untuk distribusi</p>
        </button>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-600" />
            <h2 className="font-bold text-slate-800">Notifikasi</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </div>
          <button
            onClick={() => router.push('/masyarakat/notifikasi')}
            className="text-sm text-blue-600 font-semibold hover:underline">
            Lihat semua
          </button>
        </div>
        <div className="space-y-0">
          {notifications.length > 0 ? (
            notifications.map((notif, idx) => (
              <div
                key={notif.id}
                className={`flex items-start gap-3 py-3 ${idx < notifications.length - 1 ? 'border-b border-slate-50' : ''}`}>
                <div
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notif.sudah_dibaca ? 'bg-blue-500' : 'bg-transparent'}`}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm ${!notif.sudah_dibaca ? 'font-semibold text-slate-800' : 'font-medium text-slate-600'}`}>
                    {notif.judul}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{notif.pesan}</p>
                  <p className="text-xs text-slate-300 mt-0.5">{formatUTCDate(notif.created_at, 'date')}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 mt-1" />
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-slate-400 py-4">Tidak ada notifikasi</p>
          )}
        </div>
      </div>
    </div>
  )
}
