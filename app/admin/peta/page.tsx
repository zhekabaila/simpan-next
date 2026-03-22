'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, Loader2, Check, Clock } from 'lucide-react'
import useAuthStore from '@/app/_stores/useAuthStore'
import { adminService } from '@/services/admin'
import { LocationViewer, type LocationMarker } from '@/components/core/location-viewer'
import { toast } from 'sonner'

type Recipient = LocationMarker

export default function MonitoringPetaPage() {
  const { token } = useAuthStore()
  const [markers, setMarkers] = useState<LocationMarker[]>([])
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [periodeList, setPeriodeList] = useState<any[]>([])
  const [selectedPeriode, setSelectedPeriode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filterStatus, setFilterStatus] = useState<'semua' | 'sudah_menerima' | 'belum_menerima'>('semua')
  const [apiStatistics, setApiStatistics] = useState<any>(null)

  // Fetch periods on mount
  useEffect(() => {
    if (!token) return

    const fetchPeriodes = async () => {
      try {
        const result = await adminService.getDaftarPeriode(token, 1, 50)
        if (result.data && result.data.length > 0) {
          setPeriodeList(result.data)
          setSelectedPeriode(result.data[0].id)
        }
      } catch (err: any) {
        setError(err.message)
        toast.error('Gagal mengambil daftar periode', { description: err.message })
      }
    }

    fetchPeriodes()
  }, [token])

  // Fetch map data when period changes
  useEffect(() => {
    if (!token || !selectedPeriode) return

    const fetchMapData = async () => {
      setLoading(true)
      setError('')
      try {
        const result = await adminService.getPetaSebaran(token, selectedPeriode)
        if (result.data && Array.isArray(result.data)) {
          // Transform API data to marker format
          const transformedMarkers: LocationMarker[] = result.data
            .filter((item: any) => item.latitude && item.longitude) // Filter valid coordinates
            .map((item: any, idx: number) => ({
              id: item.profil_masyarakat_id || `marker-${idx}`,
              nama: item.nama || 'N/A',
              status: item.status_penerimaan === 'sudah_menerima' ? 'sudah_menerima' : 'belum_menerima',
              latitude: parseFloat(String(item.latitude)),
              longitude: parseFloat(String(item.longitude)),
              diterima_pada: item.diterima_pada
            }))

          setMarkers(transformedMarkers)
          setRecipients(transformedMarkers)

          // Set statistics from API
          if (result.statistik) {
            setApiStatistics(result.statistik)
          }
        }
      } catch (err: any) {
        const errorMsg = err.message || 'Gagal mengambil data peta sebaran'
        setError(errorMsg)
        toast.error('Gagal mengambil data peta', { description: errorMsg })
      } finally {
        setLoading(false)
      }
    }

    fetchMapData()
  }, [token, selectedPeriode])

  // Filter recipients based on status
  const filteredRecipients = recipients.filter((r) => {
    return filterStatus === 'semua' || (r.status as string) === filterStatus
  })

  // Use stats from API if available, otherwise calculate from recipients
  const stats = apiStatistics
    ? {
        total: apiStatistics.total_penerima || 0,
        sudah_menerima: apiStatistics.sudah_terima || 0,
        belum_menerima: apiStatistics.belum_terima || 0,
        progress: apiStatistics.progress_distribusi || '0%'
      }
    : {
        total: recipients.length,
        sudah_menerima: recipients.filter((r) => r.status === 'sudah_menerima').length,
        belum_menerima: recipients.filter((r) => r.status === 'belum_menerima').length,
        progress: '0%'
      }

  const getStatusIcon = (status: string) => {
    return status === 'sudah_menerima' ? (
      <Check className="w-4 h-4 text-green-600" />
    ) : (
      <Clock className="w-4 h-4 text-orange-600" />
    )
  }

  const getStatusLabel = (status: string) => {
    return status === 'sudah_menerima' ? 'Sudah Menerima' : 'Belum Menerima'
  }

  const getStatusBg = (status: string) => {
    return status === 'sudah_menerima' ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'
  }

  const getStatusTextColor = (status: string) => {
    return status === 'sudah_menerima' ? 'text-green-700' : 'text-orange-700'
  }

  if (error && !loading) {
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

  return (
    <div className="space-y-5">
      {/* Header Section */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 mb-1">Peta Sebaran Penerima Bantuan</h1>
        <p className="text-sm text-slate-500">Monitor distribusi bantuan sosial per periode</p>
      </div>

      {/* Periode Selector */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-2">Pilih Periode</label>
        <select
          value={selectedPeriode}
          onChange={(e) => {
            setSelectedPeriode(e.target.value)
            setFilterStatus('semua')
          }}
          className="w-full md:w-80 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white font-medium">
          {periodeList.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nama_periode} - {p.jenis_bantuan}
            </option>
          ))}
        </select>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-sm text-slate-500 mb-2">Total Penerima</p>
          <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
          <p className="text-xs text-slate-400 mt-1">masyarakat terdaftar</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 border-l-4 border-l-green-500">
          <p className="text-sm text-slate-500 mb-2">Sudah Menerima</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-green-600">{stats.sudah_menerima}</p>
            {stats.total > 0 && (
              <p className="text-xs text-green-600 font-semibold">
                ({apiStatistics ? stats.progress : Math.round((stats.sudah_menerima / stats.total) * 100) + '%'})
              </p>
            )}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 border-l-4 border-l-orange-500">
          <p className="text-sm text-slate-500 mb-2">Belum Menerima</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-orange-600">{stats.belum_menerima}</p>
            {stats.total > 0 && (
              <p className="text-xs text-orange-600 font-semibold">
                (
                {apiStatistics
                  ? `${100 - parseInt(stats.progress)}%`
                  : Math.round((stats.belum_menerima / stats.total) * 100) + '%'}
                )
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Map Container */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex items-center justify-center min-h-[500px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-slate-600">Memuat peta sebaran...</p>
          </div>
        </div>
      ) : markers.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <LocationViewer markers={markers} />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex items-center justify-center min-h-[500px]">
          <p className="text-slate-600">Tidak ada data koordinat untuk periode ini</p>
        </div>
      )}

      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <label className="text-sm font-semibold text-slate-800">Filter Status:</label>
        <div className="flex gap-2">
          {[
            { label: 'Semua', value: 'semua' },
            { label: 'Sudah Menerima', value: 'sudah_menerima' },
            { label: 'Belum Menerima', value: 'belum_menerima' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilterStatus(option.value as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === option.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recipients List Section */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4">Daftar Penerima ({filteredRecipients.length})</h2>

        {filteredRecipients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredRecipients.map((recipient) => (
              <div
                key={recipient.id}
                className={`rounded-xl border p-4 transition-shadow hover:shadow-md ${getStatusBg(recipient.status)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0 mt-0.5">{getStatusIcon(recipient.status)}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 truncate">{recipient.nama}</h3>
                      <p className={`text-sm font-medium ${getStatusTextColor(recipient.status)}`}>
                        {getStatusLabel(recipient.status)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Coordinate Info */}
                <div className="space-y-2 text-xs mb-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Latitude:</span>
                    <span className="font-mono text-slate-700">{recipient.latitude.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Longitude:</span>
                    <span className="font-mono text-slate-700">{recipient.longitude.toFixed(6)}</span>
                  </div>
                  {recipient.diterima_pada && (
                    <div className="flex justify-between border-t border-slate-200 pt-2">
                      <span className="text-slate-600">Diterima:</span>
                      <span className="text-slate-700">
                        {new Date(recipient.diterima_pada).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-8 text-center">
            <p className="text-slate-600">
              Tidak ada penerima dengan status {filterStatus === 'semua' ? 'apapun' : filterStatus}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
