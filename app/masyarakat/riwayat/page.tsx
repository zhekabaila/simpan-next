'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, Calendar, MapPin, User } from 'lucide-react'
import useAuthStore from '@/app/_stores/useAuthStore'
import { masyarakatService } from '@/services/masyarakat'
import { StatusBadge } from '@/components/core/StatusBadge'
import { toast } from 'sonner'

interface DistribusiItem {
  id: string
  periode_bansos_id: string
  profil_masyarakat_id: string
  petugas_id: string
  penugasan_id: string | null
  token_qr_dipindai: string
  status: 'diterima' | 'gagal' | 'duplikat'
  alasan_gagal: string | null
  latitude_scan: string
  longitude_scan: string
  diterima_pada: string
  petugas: {
    id: string
    nama: string
  }
}

export default function RiwayatDistribusiPage() {
  const { token } = useAuthStore()
  const [distribusi, setDistribusi] = useState<DistribusiItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalSize, setTotalSize] = useState(0)
  const limit = 15

  useEffect(() => {
    if (!token) return

    const fetchDistribusi = async () => {
      setLoading(true)
      setError('')
      try {
        const result = await masyarakatService.getDistribusi(token, currentPage, limit)
        if (result.data) {
          setDistribusi(result.data)
          setTotalPages(result.pages || 1)
          setTotalSize(result.size || 0)
        }
      } catch (err: any) {
        console.error('Failed to fetch distribusi:', err)
        const errorMsg = err?.message || 'Gagal memuat riwayat distribusi'
        setError(errorMsg)
        toast.error(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    fetchDistribusi()
  }, [token, currentPage])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'diterima':
        return 'Diterima'
      case 'gagal':
        return 'Gagal'
      case 'duplikat':
        return 'Duplikat'
      default:
        return status
    }
  }

  if (error && distribusi.length === 0) {
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
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4 py-5">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-extrabold text-slate-800">Riwayat Distribusi</h1>
        <p className="text-slate-500 text-sm mt-1">Pantau status penerimaan bantuan Anda</p>
      </div>

      {/* Content */}
      {distribusi.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
          <p className="text-slate-600 font-semibold">Belum Ada Riwayat Distribusi</p>
          <p className="text-slate-400 text-sm mt-1">Anda belum menerima bantuan apapun</p>
        </div>
      ) : (
        <>
          {/* List */}
          <div className="space-y-3">
            {distribusi.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                {/* Status & Date */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-slate-500">
                      <Calendar className="w-3.5 h-3.5 inline mr-1" />
                      {formatDate(item.diterima_pada)}
                    </p>
                  </div>
                  <StatusBadge
                    status={item.status === 'diterima' ? 'diterima' : item.status === 'gagal' ? 'gagal' : 'duplikat'}
                    label={getStatusLabel(item.status)}
                  />
                </div>

                {/* Petugas */}
                <div className="mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700 font-medium">{item.petugas.nama}</span>
                </div>

                {/* Location */}
                <div className="flex items-start gap-2 text-xs text-slate-500">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>
                    Lokasi: {Number(item.latitude_scan).toFixed(4)}, {Number(item.longitude_scan).toFixed(4)}
                  </span>
                </div>

                {/* Alasan Gagal (if any) */}
                {item.alasan_gagal && (
                  <div className="mt-3 bg-red-50 border border-red-100 rounded-lg p-2">
                    <p className="text-xs text-red-700">
                      <span className="font-semibold">Alasan: </span>
                      {item.alasan_gagal}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white rounded-2xl border border-slate-100">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Sebelumnya
              </button>

              <span className="text-sm text-slate-600 font-medium">
                Halaman {currentPage} dari {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Berikutnya
              </button>
            </div>
          )}

          {/* Summary */}
          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <p className="text-sm text-blue-700">
              <span className="font-semibold">Total riwayat:</span> {totalSize} kali distribusi tercatat
            </p>
          </div>
        </>
      )}
    </div>
  )
}
