'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { QrCode, MapPin, Users, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { StatusBadge } from '@/components/core/StatusBadge'
import useAuthStore from '@/app/_stores/useAuthStore'
import { petugasService } from '@/services/petugas'

export default function PetugasDashboardPage() {
  const router = useRouter()
  const { user, token } = useAuthStore()
  const [assignment, setAssignment] = useState<any>(null)
  const [recentScans, setRecentScans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return

    const fetchData = async () => {
      try {
        // Fetch assignments
        const assignmentResult = await petugasService.getDaftarPenugasan(token, 1, 1)
        if (assignmentResult.data && assignmentResult.data.length > 0) {
          setAssignment(assignmentResult.data[0])
        }

        // Fetch recent scans for this assignment
        const scansResult = await petugasService.getRiwayatDistribusi(token, 1, 4)
        if (scansResult.data) {
          setRecentScans(scansResult.data)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

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
          <div className="h-40 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="max-w-2xl mx-auto p-4 py-5">
        <div className="text-center py-12">
          <p className="text-slate-600 font-semibold">Tidak Ada Penugasan</p>
          <p className="text-slate-400 text-sm mt-1">Hubungi admin untuk mendapatkan penugasan</p>
        </div>
      </div>
    )
  }

  const progress =
    assignment.total_penerima > 0 ? Math.round((assignment.penerima_terdistribusi / assignment.total_penerima) * 100) : 0
  const remaining = assignment.total_penerima - assignment.penerima_terdistribusi

  return (
    <div className="max-w-2xl mx-auto p-4 py-5">
      {/* Header */}
      <div className="mb-5">
        <p className="text-slate-500 text-sm">Selamat datang,</p>
        <h1 className="text-xl font-extrabold text-slate-800">{user?.nama} 👋</h1>
        <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-500">
          <MapPin className="w-3.5 h-3.5 text-blue-500" />
          <span>Wilayah: {assignment.deskripsi_wilayah}</span>
        </div>
      </div>

      {/* Active Assignment */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 mb-4 text-white">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-blue-100 text-xs font-semibold mb-1">PENUGASAN AKTIF</p>
            <h2 className="font-bold text-lg">{assignment.periode_bansos}</h2>
            <p className="text-blue-100 text-sm">{assignment.deskripsi_wilayah}</p>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              assignment.periode.status === 'akan_datang'
                ? 'bg-blue-100 text-blue-900'
                : assignment.periode.status === 'aktif'
                  ? 'bg-green-400 text-green-900'
                  : assignment.periode.status === 'selesai'
                    ? 'bg-slate-400 text-slate-900'
                    : 'bg-slate-200 text-slate-900'
            }`}>
            {assignment.periode.status === 'akan_datang'
              ? 'Akan Datang'
              : assignment.periode.status === 'aktif'
                ? 'Aktif'
                : assignment.periode.status === 'selesai'
                  ? 'Selesai'
                  : 'Tidak Diketahui'}
          </span>
        </div>
        <div className="h-px bg-white/20 my-3" />
        <div className="flex items-center gap-4 text-sm text-blue-100">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>{assignment.statistik.total_penerima} Penerima</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{assignment.statistik.sudah_terima} Terdistribusi</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
          <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Users className="w-4.5 h-4.5 text-blue-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-800">{assignment.statistik.total_penerima}</p>
          <p className="text-xs text-slate-400 mt-0.5">Total Penerima</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
          <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-4.5 h-4.5 text-green-600" />
          </div>
          <p className="text-xl font-extrabold text-green-600">{assignment.statistik.sudah_terima}</p>
          <p className="text-xs text-slate-400 mt-0.5">Sudah Terima</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
          <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Clock className="w-4.5 h-4.5 text-amber-600" />
          </div>
          <p className="text-xl font-extrabold text-amber-600">{assignment.statistik.belum_terima}</p>
          <p className="text-xs text-slate-400 mt-0.5">Belum Terima</p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-slate-700">Progress Distribusi</p>
          <p className="text-sm font-bold text-blue-600">{assignment.statistik.progress_distribusi}</p>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
            style={{ width: assignment.statistik.progress_distribusi }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {assignment.statistik.sudah_terima} dari {assignment.statistik.total_penerima} penerima telah menerima bantuan
        </p>
      </div>

      {/* Scan Button */}
      <button
        onClick={() => router.push('/petugas/scan')}
        disabled={assignment.periode.status !== 'aktif' || assignment.statistik.progress_distribusi === '100%'}
        className="w-full py-4 bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-200 mb-4">
        <QrCode className="w-6 h-6" />
        <span className="text-base">Mulai Scan QR Code</span>
      </button>

      {/* Recent Scans */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-800">Scan Terakhir</h2>
          <button
            onClick={() => router.push('/petugas/riwayat')}
            className="text-sm text-blue-600 font-semibold hover:underline">
            Lihat semua
          </button>
        </div>
        {recentScans.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-slate-400 text-sm">Belum ada scan</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentScans.map((scan, i) => {
              const scanTime = new Date(scan.diterima_pada).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
              })
              return (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                  <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-sm font-bold text-slate-600 flex-shrink-0">
                    {scan.profil_masyarakat.nama.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{scan.profil_masyarakat.nama}</p>
                    <p className="text-xs text-slate-400">
                      {scan.profil_masyarakat.nik} · {scanTime}
                    </p>
                  </div>
                  <StatusBadge status={scan.status} />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
