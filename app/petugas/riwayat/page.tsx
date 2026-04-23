'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, AlertCircle, Users, CheckCircle2, Clock } from 'lucide-react'
import useAuthStore from '@/app/_stores/useAuthStore'
import { petugasService } from '@/services/petugas'
import { toast } from 'sonner'

export default function RiwayatPenugasanPage() {
  const router = useRouter()
  const { token } = useAuthStore()
  const [penugasanList, setPenugasanList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (!token) return

    const fetchPenugasan = async () => {
      try {
        const result = await petugasService.getDaftarPenugasan(token, page, 10)
        if (result.data) {
          setPenugasanList(result.data)
        }
        if (result.pages) {
          setTotalPages(result.pages)
        }
      } catch (err: any) {
        const errorMsg = err?.message || 'Gagal memuat penugasan'
        setError(errorMsg)
        toast.error(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    setLoading(true)
    fetchPenugasan()
  }, [token, page])

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4 py-5">
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
      <div className="max-w-2xl mx-auto p-4 py-5">
        <div className="space-y-4">
          <div className="h-16 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4 py-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Riwayat Penugasan</h1>
          <p className="text-sm text-slate-500">
            Halaman {page} dari {totalPages}
          </p>
        </div>
      </div>

      {/* List Penugasan */}
      <div className="space-y-3">
        {penugasanList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
            <p className="text-slate-400 text-sm font-semibold">Belum ada penugasan</p>
          </div>
        ) : (
          penugasanList.map((penugasan) => (
            <button
              key={penugasan.id}
              onClick={() => router.push(`/petugas/riwayat/${penugasan.id}`)}
              className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all p-4 text-left">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800">{penugasan.periode_bansos}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{penugasan.deskripsi_wilayah}</p>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ml-2 ${
                    penugasan.periode.status === 'aktif'
                      ? 'bg-green-100 text-green-900'
                      : penugasan.periode.status === 'akan_datang'
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-slate-100 text-slate-900'
                  }`}>
                  {penugasan.periode.status === 'aktif'
                    ? 'Aktif'
                    : penugasan.periode.status === 'akan_datang'
                      ? 'Akan Datang'
                      : 'Selesai'}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-3 py-3 border-y border-slate-100">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <p className="font-bold text-slate-800">{penugasan.statistik.total_penerima}</p>
                  </div>
                  <p className="text-xs text-slate-500">Total</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    <p className="font-bold text-green-600">{penugasan.statistik.sudah_terima}</p>
                  </div>
                  <p className="text-xs text-slate-500">Terdistribusi</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <p className="font-bold text-amber-600">{penugasan.statistik.belum_terima}</p>
                  </div>
                  <p className="text-xs text-slate-500">Pending</p>
                </div>
              </div>

              {/* Progress */}
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-500 font-medium">Progress</p>
                <p className="text-xs font-bold text-blue-600">{penugasan.statistik.progress_distribusi}</p>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                  style={{ width: penugasan.statistik.progress_distribusi }}
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end mt-3">
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </button>
          ))
        )}
      </div>

      {/* Pagination */}
      {penugasanList.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Sebelumnya
          </button>
          <span className="text-sm text-slate-600">
            Halaman {page} dari {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Selanjutnya
          </button>
        </div>
      )}
    </div>
  )
}
