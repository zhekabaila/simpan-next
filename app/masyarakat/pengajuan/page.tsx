'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FileText, Plus, Calendar, AlertCircle, NotebookTabsIcon } from 'lucide-react'
import useAuthStore from '@/app/_stores/useAuthStore'
import { masyarakatService } from '@/services/masyarakat'
import { StatusBadge } from '@/components/core/StatusBadge'

export default function PengajuanPage() {
  const router = useRouter()
  const { token } = useAuthStore()
  const [pengajuanStatus, setPengajuanStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!token) return

    const fetchData = async () => {
      try {
        setLoading(true)
        setError('')
        const result = await masyarakatService.getPengajuanStatus(token)
        setPengajuanStatus(result)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  const handleSubmitPengajuan = async () => {
    if (!token) return

    try {
      setSubmitting(true)
      await masyarakatService.submitPengajuan(token)
      // Refresh pengajuan status
      const result = await masyarakatService.getPengajuanStatus(token)
      setPengajuanStatus(result)
      alert('Pengajuan berhasil disubmit!')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 py-6">
        <div className="space-y-4">
          <div className="h-10 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-24 bg-slate-200 rounded-2xl animate-pulse" />
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
            <p className="text-sm font-semibold text-red-800">Gagal memuat pengajuan</p>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Pengajuan Saya</h1>
          <p className="text-sm text-slate-500">Riwayat pengajuan bantuan sosial</p>
        </div>
        {!pengajuanStatus && (
          <button
            onClick={() => router.push('/masyarakat/profil/1')}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Baru
          </button>
        )}
      </div>

      {!pengajuanStatus ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-slate-300" />
          </div>
          <h2 className="font-bold text-slate-700 mb-2">Belum Ada Pengajuan</h2>
          <p className="text-sm text-slate-400 mb-5">Anda belum pernah mengajukan bantuan sosial.</p>
          <button
            onClick={() => router.push('/masyarakat/profil/1')}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm">
            <Plus className="w-4 h-4" />
            Ajukan Bantuan Sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-extrabold text-slate-800 tracking-wider text-base">{pengajuanStatus.nomor_pengajuan}</p>
                <p className="text-sm text-slate-500 mt-0.5">Pengajuan Bantuan Sosial</p>
              </div>
              <StatusBadge status={pengajuanStatus.status} />
            </div>
            <div className="h-px bg-slate-50 my-3" />
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(pengajuanStatus.diajukan_pada).toLocaleDateString('id-ID')}</span>
              </div>
            </div>
            {pengajuanStatus.catatan_admin && (
              <div className="mt-3 p-3 bg-amber-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <NotebookTabsIcon className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-xs text-amber-700 font-medium">{pengajuanStatus.catatan_admin}</span>
                </div>
              </div>
            )}
            <div className="mt-3">
              <div className="text-xs text-slate-400 mb-1.5">Tahapan:</div>
              <div className="flex items-center gap-2">
                {['Dikirim', 'Ditinjau', 'Diputuskan'].map((step, i) => {
                  const statusIndex =
                    pengajuanStatus.status === 'menunggu' ? 0 : pengajuanStatus.status === 'ditinjau' ? 1 : 2
                  return (
                    <div key={step} className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          i <= statusIndex ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                        }`}>
                        {i < statusIndex ? '✓' : i + 1}
                      </div>
                      <span className={`text-xs ${i <= statusIndex ? 'text-blue-600 font-semibold' : 'text-slate-400'}`}>
                        {step}
                      </span>
                      {i < 2 && <div className={`w-6 h-0.5 ${i < statusIndex ? 'bg-blue-400' : 'bg-slate-100'}`} />}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
