'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { FileText, CheckCircle2, Package, Clock, Bell, BarChart3, AlertCircle, Loader2 } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import useAuthStore from '@/app/_stores/useAuthStore'
import { formatUTCDate } from '@/lib/utils'
import { adminService } from '@/services/admin'
import { StatCard } from '@/components/core/StatCard'
import { StatusBadge } from '@/components/core/StatusBadge'
import { DateRangePicker } from '@/components/core/date-range-picker'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { format } from 'date-fns'

export default function AdminDashboardPage() {
  const router = useRouter()
  const { token } = useAuthStore()
  const [stats, setStats] = useState<any>(null)
  const [pengajuan, setPengajuan] = useState<any[]>([])
  const [periode, setPeriode] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [chartLoading, setChartLoading] = useState(false)
  const [error, setError] = useState('')
  const [chartData, setChartData] = useState<any[]>([])
  const [chartSummary, setChartSummary] = useState<any>(null)

  // Date range state - default to last 30 days
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  })

  const today = format(new Date(), 'EEEE, dd MMMM yyyy')

  // Format date to YYYY-MM-DD format
  const formatDateForAPI = (date: Date | undefined): string => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Fetch chart data with date range
  const fetchChartData = async (range: DateRange) => {
    if (!token || !range.from || !range.to) return

    setChartLoading(true)
    try {
      const startDate = formatDateForAPI(range.from)
      const endDate = formatDateForAPI(range.to)

      const result = await adminService.getDistribusiByDate(token, startDate, endDate)

      if (result.data && Array.isArray(result.data)) {
        // Transform API response to chart format
        const transformedData = result.data.map((item: any) => ({
          label: item.label || '',
          distribusi: item.value || 0
        }))
        setChartData(transformedData)
        setChartSummary(result.summary)
      }
    } catch (err: any) {
      console.error('Failed to fetch chart data:', err)
      // Optionally show error toast here
    } finally {
      setChartLoading(false)
    }
  }

  // Fetch initial data
  useEffect(() => {
    if (!token) return

    const fetchData = async () => {
      try {
        const [statsRes, pengajuanRes] = await Promise.all([
          adminService.getStatistik(token),
          adminService.getDaftarPengajuan(token, 1, 5)
        ])

        if (statsRes.data) {
          setStats(statsRes.data)

          // Set periode aktif from stats
          if (statsRes.data.periode_aktif) {
            setPeriode(statsRes.data.periode_aktif)
          }
        }

        if (pengajuanRes.data) {
          setPengajuan(pengajuanRes.data)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  // Fetch chart data when date range changes
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      fetchChartData(dateRange)
    }
  }, [dateRange, token])

  const handleDateChange = (newRange: DateRange | undefined) => {
    if (newRange) {
      setDateRange(newRange)
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    )
  }
  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Dashboard Admin</h1>
          <p className="text-sm text-slate-500">{today}</p>
        </div>
        <button
          onClick={() => router.push('/admin/notifikasi')}
          className="relative p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={<FileText className="w-full h-full" />}
          label="Total Pengajuan Masuk"
          value={stats?.pengajuan?.total?.toString() || '0'}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={<CheckCircle2 className="w-full h-full" />}
          label="Pengajuan Disetujui"
          value={stats?.pengajuan?.disetujui?.toString() || '0'}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />
        <StatCard
          icon={<Package className="w-full h-full" />}
          label="Sudah Menerima"
          value={stats?.distribusi?.sudah_diterima?.toString() || '0'}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatCard
          icon={<Clock className="w-full h-full" />}
          label="Belum Menerima"
          value={stats?.distribusi?.belum_diterima?.toString() || '0'}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* Active Period Banner */}
      {periode && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5 text-white">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-blue-100 text-xs font-semibold mb-1">PERIODE AKTIF</p>
              <h2 className="font-bold text-lg">{periode.nama_periode}</h2>
              <p className="text-blue-200 text-sm">
                {formatUTCDate(periode.tanggal_mulai, 'date')} – {formatUTCDate(periode.tanggal_selesai, 'date')}
              </p>
            </div>
            <span className="bg-green-400 text-green-900 text-xs font-bold px-2.5 py-1 rounded-full">
              {periode.status === 'aktif' ? 'Berlangsung' : 'Selesai'}
            </span>
          </div>
          <button
            onClick={() => router.push('/admin/periode')}
            className="w-full py-2 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors text-sm">
            Kelola Periode
          </button>
        </div>
      )}

      {/* Chart Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="space-y-4">
          {/* Chart Header and Date Filter */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-800 text-lg">Grafik Distribusi</h2>
              <BarChart3 className="w-5 h-5 text-slate-400" />
            </div>
            <div className="w-full md:w-auto">
              <DateRangePicker
                selected={dateRange}
                onDateChange={handleDateChange}
                disableFutureDate={true}
                inputclassName="text-sm"
              />
            </div>
          </div>

          {/* Chart Summary Info */}
          {chartSummary && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-blue-700 font-semibold">Total Distribusi</p>
                  <p className="text-2xl font-bold text-blue-900">{chartSummary.total_distribusi || 0}</p>
                </div>
                <div>
                  <p className="text-blue-700 font-semibold">Tanggal Mulai</p>
                  <p className="text-slate-600">{chartSummary.tanggal_mulai || '-'}</p>
                </div>
                <div>
                  <p className="text-blue-700 font-semibold">Tanggal Akhir</p>
                  <p className="text-slate-600">{chartSummary.tanggal_akhir || '-'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Chart */}
          {chartLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-slate-600 text-sm">Memuat data grafik...</p>
              </div>
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="label"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={Math.floor(chartData.length / 7)}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  formatter={(value) => [`${value} orang`, 'Distribusi']}
                />
                <Bar dataKey="distribusi" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Distribusi" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-slate-600">Tidak ada data untuk periode yang dipilih</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-800">Pengajuan Terbaru</h2>
          <button
            onClick={() => router.push('/admin/pengajuan')}
            className="text-sm text-blue-600 font-semibold hover:underline">
            Lihat semua
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2 px-2 text-xs font-semibold text-slate-600">No. Pengajuan</th>
                <th className="text-left py-2 px-2 text-xs font-semibold text-slate-600">Nama</th>
                <th className="text-left py-2 px-2 text-xs font-semibold text-slate-600">Diajukan</th>
                <th className="text-left py-2 px-2 text-xs font-semibold text-slate-600">Reviewer</th>
                <th className="text-left py-2 px-2 text-xs font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {pengajuan.length > 0 ? (
                pengajuan.map((app: any) => (
                  <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-3 px-2 font-mono text-xs text-slate-600">{app.nomor_pengajuan || 'N/A'}</td>
                    <td className="py-3 px-2 text-slate-800 font-medium">
                      {app.profil?.nama || app.nama_penerima || app.nama || 'N/A'}
                    </td>
                    <td className="py-3 px-2 text-slate-500 text-xs">
                      {app.diajukan_pada ? formatUTCDate(app.diajukan_pada, 'date') : 'N/A'}
                    </td>
                    <td className="py-3 px-2 text-slate-600 text-xs">
                      {app.reviewer?.nama || (app.ditinjau_pada ? 'Ditinjau' : '-')}
                    </td>
                    <td className="py-3 px-2">
                      <StatusBadge status={app.status || 'menunggu'} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 px-2 text-center text-slate-500 text-sm">
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
