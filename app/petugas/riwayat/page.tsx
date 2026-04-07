'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, QrCode, AlertCircle } from 'lucide-react'
import { StatusBadge } from '@/components/core/StatusBadge'
import { formatUTCDate } from '@/lib/utils'
import Link from 'next/link'
import useAuthStore from '@/app/_stores/useAuthStore'
import { petugasService } from '@/services/petugas'
import { toast } from 'sonner'

type FilterStatus = 'semua' | 'diterima' | 'duplikat' | 'gagal'

export default function RiwayatPage() {
  const { token } = useAuthStore()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('semua')
  const [page, setPage] = useState(1)
  const [riwayatData, setRiwayatData] = useState<any[]>([])
  const [statistik, setStatistik] = useState<{
    total: number
    total_diterima: number
    total_gagal: number
    total_duplikat: number
  }>({
    total: 0,
    total_diterima: 0,
    total_gagal: 0,
    total_duplikat: 0
  })

  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return

    const fetchRiwayat = async () => {
      try {
        const result = await petugasService.getRiwayatDistribusi(
          token,
          page,
          10,
          filterStatus !== 'semua' ? filterStatus : undefined
        )

        if (result.data) {
          setRiwayatData(result.data)
        }

        if (result.statistik) {
          setStatistik(result.statistik)
        }

        if (result.pages) {
          setTotalPages(result.pages)
        }
      } catch (err: any) {
        const errorMsg = err?.message || 'Gagal memuat riwayat'
        setError(errorMsg)
        toast.error(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    setLoading(true)
    fetchRiwayat()
  }, [token, page, filterStatus])

  const filtered = riwayatData.filter((r) => {
    const matchSearch = r.profil_masyarakat.nama.toLowerCase().includes(search.toLowerCase())
    return matchSearch
  })

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
          <div className="h-20 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 bg-slate-200 rounded-2xl animate-pulse" />
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
          <h1 className="text-xl font-bold text-slate-800">Riwayat Distribusi</h1>
          <p className="text-sm text-slate-500">
            Halaman {page} dari {totalPages}
          </p>
        </div>
        <Link
          href="/petugas/scan"
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
          <QrCode className="w-4 h-4" />
          Scan
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: 'Total', value: statistik.total, color: 'text-slate-800', bg: 'bg-slate-50' },
          { label: 'Diterima', value: statistik.total_diterima, color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Duplikat', value: statistik.total_duplikat, color: 'text-amber-700', bg: 'bg-amber-50' },
          { label: 'Gagal', value: statistik.total_gagal, color: 'text-red-700', bg: 'bg-red-50' }
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
            <p className={`text-lg font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama penerima..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="pl-3 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
            <option value="semua">Semua</option>
            <option value="diterima">Diterima</option>
            <option value="duplikat">Duplikat</option>
            <option value="gagal">Gagal</option>
          </select>
          <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
        {filtered.length === 0 ? (
          <div className="p-12 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
              <Search className="w-7 h-7 text-slate-300" />
            </div>
            <p className="font-semibold text-slate-700">Tidak Ditemukan</p>
            <p className="text-sm text-slate-400 mt-1">Coba ubah pencarian atau filter</p>
          </div>
        ) : (
          filtered.map((item) => {
            const scanTime = formatUTCDate(item.diterima_pada, 'datetime')
            return (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3.5">
                <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-sm font-bold text-slate-600 flex-shrink-0">
                  {item.profil_masyarakat.nama.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{item.profil_masyarakat.nama}</p>
                  <p className="text-xs text-slate-400">
                    {item.profil_masyarakat.nik} · {scanTime}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            )
          })
        )}
      </div>

      {/* Pagination */}
      {riwayatData.length > 0 && (
        <div className="flex items-center justify-between mt-4">
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
