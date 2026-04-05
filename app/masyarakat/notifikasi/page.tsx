'use client'

import { useEffect, useState } from 'react'
import { Bell, CheckCircle2, Info, AlertTriangle, Calendar, AlertCircle } from 'lucide-react'
import useAuthStore from '@/app/_stores/useAuthStore'
import { formatUTCDate } from '@/lib/utils'
import { masyarakatService } from '@/services/masyarakat'

const iconMap = {
  success: { icon: CheckCircle2, bg: 'bg-green-100', color: 'text-green-600' },
  info: { icon: Info, bg: 'bg-blue-100', color: 'text-blue-600' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-100', color: 'text-amber-600' },
  calendar: { icon: Calendar, bg: 'bg-purple-100', color: 'text-purple-600' }
}

export default function MasyarakatNotifikasiPage() {
  const { token } = useAuthStore()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [markingAllRead, setMarkingAllRead] = useState(false)

  useEffect(() => {
    if (!token) return

    const fetchNotifications = async () => {
      try {
        setLoading(true)
        setError('')
        const result = await masyarakatService.getNotifikasi(token, page, 10)
        setNotifications(result.data || [])
        setTotalPages(result.pagination?.total || 1)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [token, page])

  const handleMarkAsRead = async (id: string) => {
    if (!token) return
    try {
      await masyarakatService.markNotifikasiRead(token, id)
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, sudah_dibaca: true } : n)))
    } catch (err: any) {
      console.error('Failed to mark as read:', err.message)
    }
  }

  const handleMarkAllAsRead = async () => {
    if (!token) return
    try {
      setMarkingAllRead(true)
      await masyarakatService.markAllNotifikasiRead(token)
      setNotifications(notifications.map((n) => ({ ...n, sudah_dibaca: true })))
    } catch (err: any) {
      console.error('Failed to mark all as read:', err.message)
    } finally {
      setMarkingAllRead(false)
    }
  }

  const unreadCount = notifications.filter((n) => !n.sudah_dibaca).length

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 py-6">
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4 py-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-800">Gagal memuat notifikasi</p>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Notifikasi</h1>
          <p className="text-sm text-slate-500">{unreadCount} belum dibaca</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={markingAllRead}
            className="text-sm text-blue-600 font-semibold hover:underline disabled:opacity-50">
            Tandai semua dibaca
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-slate-300" />
          </div>
          <h2 className="font-bold text-slate-700 mb-2">Tidak Ada Notifikasi</h2>
          <p className="text-sm text-slate-400">Anda akan menerima notifikasi penting di sini.</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {notifications.map((notif) => {
              const typeKey = (notif.jenis || 'info') as keyof typeof iconMap
              const cfg = iconMap[typeKey] || iconMap.info
              const Icon = cfg.icon
              return (
                <div
                  key={notif.id}
                  className={`bg-white rounded-2xl border p-4 transition-all cursor-pointer hover:shadow-md ${
                    !notif.sudah_dibaca ? 'border-blue-200 shadow-sm shadow-blue-50' : 'border-slate-100'
                  }`}
                  onClick={() => handleMarkAsRead(notif.id)}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl flex-shrink-0 ${cfg.bg}`}>
                      <Icon className={`w-4 h-4 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm ${!notif.sudah_dibaca ? 'font-bold text-slate-800' : 'font-semibold text-slate-700'}`}>
                          {notif.judul}
                        </p>
                        {!notif.sudah_dibaca && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.pesan}</p>
                      <p className="text-xs text-slate-300 mt-1.5">{formatUTCDate(notif.created_at, 'datetime')}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold disabled:opacity-50">
                Sebelumnya
              </button>
              <span className="text-sm text-slate-600">
                Halaman {page} dari {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold disabled:opacity-50">
                Selanjutnya
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
