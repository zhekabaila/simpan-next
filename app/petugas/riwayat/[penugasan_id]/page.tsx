'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Search, Filter, AlertCircle, MapPin } from 'lucide-react'
import { StatusBadge } from '@/components/core/StatusBadge'
import ImageViewer from '@/components/core/image-viewer'
import { formatUTCDate } from '@/lib/utils'
import useAuthStore from '@/app/_stores/useAuthStore'
import { petugasService } from '@/services/petugas'
import { toast } from 'sonner'

type FilterStatus = 'semua' | 'diterima' | 'duplikat' | 'gagal'

export default function DetailPenugasanPage() {
  const router = useRouter()
  const params = useParams()
  const penugasanId = params.penugasan_id as string
  const { token } = useAuthStore()

  // Detail penugasan
  const [penugasan, setPenugasan] = useState<any>(null)

  // Riwayat distribusi
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('semua')
  const [riwayatPage, setRiwayatPage] = useState(1)
  const [riwayatData, setRiwayatData] = useState<any[]>([])
  const [periodeBansosId, setPeriodeBansosId] = useState<string | null>(null)
  const [riwayatStatistik, setRiwayatStatistik] = useState<{
    total: number
    total_diterima: number
    total_duplikat: number
    total_gagal: number
  }>({
    total: 0,
    total_diterima: 0,
    total_duplikat: 0,
    total_gagal: 0
  })
  const [riwayatTotalPages, setRiwayatTotalPages] = useState(1)

  // Dokumentasi
  const [dokumentasi, setDokumentasi] = useState<any[]>([])

  // Loading states
  const [loading, setLoading] = useState(true)
  const [riwayatLoading, setRiwayatLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch detail penugasan
  useEffect(() => {
    if (!token || !penugasanId) return

    const fetchDetail = async () => {
      try {
        const result = await petugasService.getDetailPenugasan(token, penugasanId)
        if (result.data?.penugasan) {
          setPenugasan(result.data.penugasan)

          // Fetch riwayat distribusi with penugasan_id
          const riwayatResult = await petugasService.getRiwayatDistribusi(
            token,
            1,
            10,
            undefined,
            undefined,
            result.data.penugasan.periode_bansos_id
          )
          if (riwayatResult.data) {
            setRiwayatData(riwayatResult.data)
          }
          if (riwayatResult.statistik) {
            setRiwayatStatistik(riwayatResult.statistik)
          }
          if (riwayatResult.pages) {
            setRiwayatTotalPages(riwayatResult.pages)
          }

          // Fetch dokumentasi by periode
          if (result.data.penugasan.periode_bansos_id) {
            const dokResult = await petugasService.getDokumentasiByPeriode(
              token,
              result.data.penugasan.periode_bansos_id,
              1,
              10
            )
            setPeriodeBansosId(result.data.penugasan.periode_bansos_id)
            if (dokResult.data) {
              setDokumentasi(dokResult.data)
            }
          }
        }
      } catch (err: any) {
        const errorMsg = err?.message || 'Gagal memuat detail penugasan'
        setError(errorMsg)
        toast.error(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [token, penugasanId])

  // Fetch riwayat dengan filter
  useEffect(() => {
    if (!token || !periodeBansosId || loading) return

    const fetchRiwayat = async () => {
      setRiwayatLoading(true)
      try {
        const result = await petugasService.getRiwayatDistribusi(
          token,
          riwayatPage,
          10,
          filterStatus !== 'semua' ? filterStatus : undefined,
          undefined,
          periodeBansosId
        )
        if (result.data) {
          setRiwayatData(result.data)
        }
        if (result.statistik) {
          setRiwayatStatistik(result.statistik)
        }
        if (result.pages) {
          setRiwayatTotalPages(result.pages)
        }
      } catch (err: any) {
        toast.error(err?.message || 'Gagal memuat riwayat')
      } finally {
        setRiwayatLoading(false)
      }
    }

    fetchRiwayat()
  }, [token, periodeBansosId, riwayatPage, filterStatus, loading])

  const filtered = riwayatData.filter((r) => {
    const matchSearch = r.profil_masyarakat.nama.toLowerCase().includes(search.toLowerCase())
    return matchSearch
  })

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4 py-5">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 font-semibold mb-5 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>
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
          <div className="h-12 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="h-40 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="h-60 bg-slate-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    )
  }

  if (!penugasan) {
    return (
      <div className="max-w-2xl mx-auto p-4 py-5">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 font-semibold mb-5 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>
        <div className="text-center py-12">
          <p className="text-slate-600 font-semibold">Penugasan tidak ditemukan</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4 py-5">
      {/* Header */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-blue-600 font-semibold mb-5 hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </button>

      {/* Detail Penugasan */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 mb-4 text-white">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="font-bold text-lg">{penugasan.periode.nama_periode}</h2>
            <div className="flex items-center gap-1.5 mt-1.5 text-blue-100">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-sm">{penugasan.deskripsi_wilayah || 'Wilayah tidak tersedia'}</span>
            </div>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
              penugasan.periode.status === 'aktif'
                ? 'bg-green-400 text-green-900'
                : penugasan.periode.status === 'akan_datang'
                  ? 'bg-blue-100 text-blue-900'
                  : 'bg-slate-400 text-slate-900'
            }`}>
            {penugasan.periode.status === 'aktif'
              ? 'Aktif'
              : penugasan.periode.status === 'akan_datang'
                ? 'Akan Datang'
                : 'Selesai'}
          </span>
        </div>
        <div className="h-px bg-white/20 my-3" />
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-blue-100">Total Penerima</p>
            <p className="text-xl font-bold mt-1">{penugasan.statistik.total_penerima}</p>
          </div>
          <div>
            <p className="text-xs text-blue-100">Terdistribusi</p>
            <p className="text-xl font-bold mt-1">{penugasan.statistik.sudah_terima}</p>
          </div>
          <div>
            <p className="text-xs text-blue-100">Pending</p>
            <p className="text-xl font-bold mt-1">{penugasan.statistik.belum_terima}</p>
          </div>
        </div>
      </div>

      {/* Riwayat Distribusi Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: 'Total', value: riwayatStatistik.total, color: 'text-slate-800', bg: 'bg-slate-50' },
          { label: 'Diterima', value: riwayatStatistik.total_diterima, color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Duplikat', value: riwayatStatistik.total_duplikat, color: 'text-amber-700', bg: 'bg-amber-50' },
          { label: 'Gagal', value: riwayatStatistik.total_gagal, color: 'text-red-700', bg: 'bg-red-50' }
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
            <p className={`text-lg font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Riwayat Distribusi */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-800">Riwayat Distribusi</h2>
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
        <div className={`divide-y divide-slate-50 ${riwayatLoading ? 'opacity-50' : ''}`}>
          {filtered.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-400 text-sm font-semibold">Tidak ada data</p>
            </div>
          ) : (
            filtered.map((item) => {
              const scanTime = formatUTCDate(item.diterima_pada, 'datetime')
              return (
                <div key={item.id} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
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
        {riwayatData.length > 0 && riwayatTotalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => setRiwayatPage(Math.max(1, riwayatPage - 1))}
              disabled={riwayatPage === 1 || riwayatLoading}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Sebelumnya
            </button>
            <span className="text-sm text-slate-600">
              Halaman {riwayatPage} dari {riwayatTotalPages}
            </span>
            <button
              onClick={() => setRiwayatPage(Math.min(riwayatTotalPages, riwayatPage + 1))}
              disabled={riwayatPage === riwayatTotalPages || riwayatLoading}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Selanjutnya
            </button>
          </div>
        )}
      </div>

      {/* Dokumentasi */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-800">Dokumentasi</h2>
        </div>

        {dokumentasi.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-400 text-sm font-semibold">Belum ada dokumentasi</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dokumentasi.map((dok, i) => {
              const dokTime = new Date(dok.diunggah_pada).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
              })
              const dokDate = new Date(dok.diunggah_pada).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short'
              })
              const isFoto = dok.jenis_dokumentasi === 'foto' && dok.path_dokumentasi

              return (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                  {isFoto ? (
                    <ImageViewer
                      src={dok.path_dokumentasi}
                      alt={`Dokumentasi ${dokDate}`}
                      fileName={`dokumentasi-${dok.id}.jpg`}
                      className="w-12 h-12 rounded-xl flex-shrink-0"
                      hideOverlay={true}>
                      <div className="w-12 h-12 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
                        <img
                          src={dok.path_dokumentasi}
                          alt={`Dokumentasi ${dokDate}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </ImageViewer>
                  ) : (
                    <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center text-sm font-bold text-green-600 flex-shrink-0">
                      📝
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 capitalize">{dok.jenis_dokumentasi}</p>
                    <p className="text-xs text-slate-400">
                      {dokDate} · {dokTime}
                    </p>
                  </div>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium whitespace-nowrap">
                    {dok.jenis_dokumentasi === 'foto' ? 'Foto' : 'Catatan'}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
