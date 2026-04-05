'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Pagination } from '@/components/shared/pagination'
import { StatusBadge } from '@/components/core/StatusBadge'
import useAuthStore from '@/app/_stores/useAuthStore'
import { adminService } from '@/services/admin'
import { getPaginationLabel, formatUTCDate } from '@/lib/utils'
import { toast } from 'sonner'

type FilterStatus = 'semua' | 'menunggu' | 'ditinjau' | 'disetujui' | 'ditolak'

export default function DaftarPengajuanPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { token } = useAuthStore()

  // Parse URL parameters
  const pageParam = searchParams.get('page')
  const limitParam = searchParams.get('limit')
  const qParam = searchParams.get('q') || ''
  const statusParam = searchParams.get('status') as FilterStatus | null

  const parsedPage = pageParam ? parseInt(pageParam, 10) || 1 : 1
  const parsedLimit = limitParam ? parseInt(limitParam, 10) || 10 : 10
  const parsedStatus = statusParam || 'semua'

  const [pengajuanData, setPengajuanData] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch pengajuan data
  useEffect(() => {
    if (!token) return

    const fetchPengajuan = async () => {
      try {
        const result = await adminService.getDaftarPengajuan(
          token,
          parsedPage,
          parsedLimit,
          parsedStatus !== 'semua' ? parsedStatus : undefined,
          qParam || undefined
        )

        if (result.data) {
          setPengajuanData(result.data)
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
    fetchPengajuan()
  }, [token, parsedPage, parsedLimit, parsedStatus, qParam])

  // Handler untuk update filter status
  const handleFilterChange = (status: FilterStatus) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('status', status)
    params.set('page', '1') // Reset ke halaman pertama
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  // Handler untuk update search
  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('q', value)
    } else {
      params.delete('q')
    }
    params.set('page', '1') // Reset ke halaman pertama
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  // Handler untuk update halaman
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.replace(`?${params.toString()}`, { scroll: false })
  }

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
        {/* <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm shadow-md shadow-blue-200">
          <Download className="w-4 h-4" />
          Ekspor
        </button> */}
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
            onClick={() => handleFilterChange(tab.value)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${
              parsedStatus === tab.value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={qParam}
          onChange={(e) => handleSearchChange(e.target.value)}
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
              {pengajuanData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <p className="text-slate-500">Tidak ada data pengajuan</p>
                  </td>
                </tr>
              ) : (
                pengajuanData.map((item) => {
                  const tanggal = formatUTCDate(item.diajukan_pada, 'date')
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
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            {getPaginationLabel({
              page: parsedPage,
              limit: parsedLimit,
              size: pengajuanData.length
            })}
          </p>
          <Pagination page={parsedPage} pages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  )
}
