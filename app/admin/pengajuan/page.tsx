'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Download, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import { StatusBadge } from '@/components/core/StatusBadge'
import useAuthStore from '@/app/_stores/useAuthStore'
import { adminService } from '@/services/admin'
import { toast } from 'sonner'

type FilterStatus = 'semua' | 'menunggu' | 'ditinjau' | 'disetujui' | 'ditolak'

export default function DaftarPengajuanPage() {
  const router = useRouter()
  const { token } = useAuthStore()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('semua')
  const [currentPage, setCurrentPage] = useState(1)
  const [pengajuanData, setPengajuanData] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pengajuanCount, setPengajuanCount] = useState({
    semua: 0,
    menunggu: 0,
    ditinjau: 0,
    disetujui: 0,
    ditolak: 0
  })
  const itemsPerPage = 10

  useEffect(() => {
    if (!token) return

    const fetchPengajuan = async () => {
      try {
        const result = await adminService.getDaftarPengajuan(
          token,
          currentPage,
          itemsPerPage,
          filterStatus !== 'semua' ? filterStatus : undefined,
          search || undefined
        )

        if (result.data) {
          setPengajuanData(result.data)
        }

        if (result.pagination) {
          setTotalPages(Math.ceil(result.pagination.total / itemsPerPage))
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    setLoading(true)
    fetchPengajuan()
  }, [token, currentPage, filterStatus, search])

  useEffect(() => {
    if (!token) return

    const fetchAllPengajuanCounts = async () => {
      try {
        const statuses = ['semua', 'menunggu', 'ditinjau', 'disetujui', 'ditolak'] as const
        const countPromises = statuses.map((status) =>
          adminService
            .getDaftarPengajuan(token, 1, 100, status !== 'semua' ? (status as FilterStatus) : undefined)
            .then((result) => {
              setPengajuanCount((prev) => ({
                ...prev,
                [status]: result.pagination?.total || result.data?.length || 0
              }))
            })
            .catch((err) => {
              console.error(`Failed to fetch count for ${status}:`, err)
            })
        )

        await Promise.all(countPromises)
      } catch (err: any) {
        console.error('Failed to fetch pengajuan counts:', err.message)
      }
    }

    fetchAllPengajuanCounts()
  }, [token])

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

  const filtered = pengajuanData.filter((item) => {
    const matchSearch =
      item.nomor_pengajuan?.toLowerCase().includes(search.toLowerCase()) ||
      item.profil?.nik?.includes(search) ||
      item.profil?.nama?.toLowerCase().includes(search.toLowerCase())
    return matchSearch
  })

  const handleTinjau = async (id: any) => {
    if (!token) return
    try {
      await adminService.tinjauPengajuan(token, id)
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleViewDetail = async (id: string, currentStatus: string) => {
    if (currentStatus === 'menunggu') {
      await handleTinjau(id)
    }
    router.push(`/admin/pengajuan/${id}`)
  }

  if (loading && pengajuanData.length === 0) {
    return (
      <div className="space-y-5">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Daftar Pengajuan</h1>
          <p className="text-sm text-slate-500">Kelola dan tinjau pengajuan bantuan sosial</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm shadow-md shadow-blue-200">
          <Download className="w-4 h-4" />
          Ekspor
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(
          [
            { value: 'semua' as FilterStatus, label: 'Semua' },
            { value: 'menunggu' as FilterStatus, label: 'Menunggu' },
            { value: 'ditinjau' as FilterStatus, label: 'Ditinjau' },
            { value: 'disetujui' as FilterStatus, label: 'Disetujui' },
            { value: 'ditolak' as FilterStatus, label: 'Ditolak' }
          ] as const
        ).map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setFilterStatus(tab.value)
              setCurrentPage(1)
            }}
            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${
              filterStatus === tab.value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}>
            {tab.label}
            <span
              className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-bold ${
                filterStatus === tab.value ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
              {pengajuanCount?.[tab.value]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setCurrentPage(1)
          }}
          placeholder="Cari nama, NIK, atau no. pengajuan..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500">
                <th className="text-left py-3 px-4 font-semibold">No. Pengajuan</th>
                <th className="text-left py-3 px-4 font-semibold">Nama</th>
                <th className="text-left py-3 px-4 font-semibold">NIK</th>
                <th className="text-left py-3 px-4 font-semibold">Tanggal Ajuan</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <p className="text-slate-500">Tidak ada data pengajuan</p>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const tanggal = new Date(item.diajukan_pada).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 text-sm font-semibold text-slate-700">{item.nomor_pengajuan}</td>
                      <td className="py-3.5 px-4 text-sm font-semibold text-slate-800">
                        {item.profil?.nama || 'Masyarakat'}
                      </td>
                      <td className="py-3.5 px-4 text-sm text-slate-600">{item.profil?.nik}</td>
                      <td className="py-3.5 px-4 text-sm text-slate-500">{tanggal}</td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleViewDetail(item.id, item.status)}
                          className="px-3.5 py-1.5 bg-blue-50 text-blue-600 text-sm font-semibold rounded-lg hover:bg-blue-100 transition-colors">
                          Tinjau
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && pengajuanData.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Halaman {currentPage} dari {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
