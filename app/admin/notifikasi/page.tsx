'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Bell, CheckCircle2, QrCode, Calendar, MessageSquare, AlertCircle, X } from 'lucide-react'
import useAuthStore from '@/app/_stores/useAuthStore'
import { adminService } from '@/services/admin'
import { Pagination } from '@/components/shared/pagination'
import { getPaginationLabel } from '@/lib/utils'

type NotifType = 'semua' | 'status_pengajuan' | 'jadwal_distribusi' | 'qr_siap' | 'umum'

const typeConfig: Record<string, { icon: typeof Bell; bg: string; color: string; label: string }> = {
  status_pengajuan: {
    icon: CheckCircle2,
    bg: 'bg-green-50',
    color: 'text-green-600',
    label: 'Status Pengajuan'
  },
  jadwal_distribusi: {
    icon: Calendar,
    bg: 'bg-blue-50',
    color: 'text-blue-600',
    label: 'Jadwal Distribusi'
  },
  qr_siap: {
    icon: QrCode,
    bg: 'bg-purple-50',
    color: 'text-purple-600',
    label: 'QR Siap'
  },
  umum: {
    icon: MessageSquare,
    bg: 'bg-slate-50',
    color: 'text-slate-600',
    label: 'Umum'
  }
}

export default function NotifikasiPage() {
  const { token } = useAuthStore()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Parse URL parameters
  const pageParam = searchParams.get('page')
  const limitParam = searchParams.get('limit')
  const typeParam = searchParams.get('type') as NotifType | null

  const parsedPage = pageParam ? parseInt(pageParam, 10) || 1 : 1
  const parsedLimit = limitParam ? parseInt(limitParam, 10) || 10 : 10
  const parsedType = typeParam || 'semua'

  const [notifs, setNotifs] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    user_id: '',
    judul: '',
    pesan: ''
  })
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    if (!token) return

    const fetchNotifs = async () => {
      try {
        const result = await adminService.getDaftarNotifikasi(
          token,
          parsedPage,
          parsedLimit,
          parsedType !== 'semua' ? parsedType : undefined
        )
        if (result.data) {
          setNotifs(result.data)
        }
        if (result.pages) {
          setTotalPages(result.pages)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    setLoading(true)
    fetchNotifs()
  }, [token, parsedPage, parsedLimit, parsedType])

  useEffect(() => {
    if (!token || !showModal) return

    const fetchUsers = async () => {
      try {
        const result = await adminService.getDaftarPengguna(token, 1, 100)
        if (result.data) setUsers(result.data)
      } catch (err: any) {
        setError(err.message)
      }
    }

    fetchUsers()
  }, [token, showModal])

  // Handler untuk update filter type
  const handleFilterChange = (type: NotifType) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('type', type)
    params.set('page', '1') // Reset ke halaman pertama
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  // Handler untuk update halaman
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  const handleSendNotif = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    try {
      await adminService.sendNotifikasi(token, formData.user_id, formData.judul, formData.pesan)
      setFormData({ user_id: '', judul: '', pesan: '' })
      setShowModal(false)
      // Refresh list
      const result = await adminService.getDaftarNotifikasi(
        token,
        parsedPage,
        parsedLimit,
        parsedType !== 'semua' ? parsedType : undefined
      )
      if (result.data) {
        setNotifs(result.data)
        if (result.pages) {
          setTotalPages(result.pages)
        }
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (error) {
    return (
      <div className="space-y-5">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Notifikasi & Log</h1>
          <p className="text-sm text-slate-500">Riwayat notifikasi yang dikirim ke pengguna</p>
        </div>
        {/* <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm shadow-md shadow-blue-200">
          <Send className="w-4 h-4" />
          Kirim Notifikasi
        </button> */}
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(
          [
            { value: 'semua' as NotifType, label: 'Semua' },
            {
              value: 'status_pengajuan' as NotifType,
              label: 'Status Pengajuan'
            },
            {
              value: 'jadwal_distribusi' as NotifType,
              label: 'Jadwal Distribusi'
            },
            { value: 'qr_siap' as NotifType, label: 'QR Siap' },
            { value: 'umum' as NotifType, label: 'Umum' }
          ] as const
        ).map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleFilterChange(tab.value)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${
              parsedType === tab.value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Logs */}
      <div className="space-y-2.5">
        {notifs.length > 0 ? (
          notifs.map((notif) => {
            const cfg = typeConfig[notif.jenis] || typeConfig.umum
            const Icon = cfg.icon
            const waktu = notif.created_at ? new Date(notif.created_at).toLocaleString('id-ID') : 'N/A'
            return (
              <div key={notif.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl flex-shrink-0 ${cfg.bg}`}>
                    <Icon className={`w-4 h-4 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{notif.judul}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${cfg.bg} ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mt-1.5 line-clamp-2">{notif.pesan}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-slate-400">Ke: {notif.nama_penerima || 'N/A'}</p>
                      <p className="text-xs text-slate-300">{waktu}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-8 text-slate-500 text-sm">Tidak ada notifikasi ditemukan</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && notifs.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            {getPaginationLabel({
              page: parsedPage,
              limit: parsedLimit,
              size: notifs.length
            })}
          </p>
          <Pagination page={parsedPage} pages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}

      {/* Modal Kirim Notifikasi */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Kirim Notifikasi</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSendNotif} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1">Penerima</label>
                <select
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required>
                  <option value="">Pilih Penerima</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nama} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1">Judul</label>
                <input
                  type="text"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan judul notifikasi"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1">Pesan</label>
                <textarea
                  value={formData.pesan}
                  onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan pesan notifikasi"
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                  Kirim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
