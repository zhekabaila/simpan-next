'use client'

import { useState, useEffect } from 'react'
import { Calendar, Plus, AlertCircle, Edit2, Trash2, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { StatusBadge } from '@/components/core/StatusBadge'
import useAuthStore from '@/app/_stores/useAuthStore'
import { adminService } from '@/services/admin'

export default function PeriodePage() {
  const { token } = useAuthStore()
  const [periods, setPeriods] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingStatus, setEditingStatus] = useState<string>('')
  const [formData, setFormData] = useState({
    nama_periode: '',
    jenis_bantuan: '',
    tanggal_mulai: '',
    tanggal_selesai: ''
  })

  useEffect(() => {
    if (!token) return

    const fetchPeriodes = async () => {
      try {
        const result = await adminService.getDaftarPeriode(token, 1, 50)
        if (result.data) {
          setPeriods(result.data)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPeriodes()
  }, [token])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    try {
      await adminService.createPeriode(token, formData)
      toast.success('Periode berhasil dibuat!', { duration: 2000 })
      setFormData({ nama_periode: '', jenis_bantuan: '', tanggal_mulai: '', tanggal_selesai: '' })
      setShowForm(false)
      // Refresh list
      const result = await adminService.getDaftarPeriode(token, 1, 50)
      if (result.data) setPeriods(result.data)
    } catch (err: any) {
      const errorMsg = err.message || 'Gagal membuat periode'
      setError(errorMsg)
      toast.error('Gagal membuat periode', { description: errorMsg, duration: 3000 })
    }
  }

  const handleUpdateStatus = async (data: any, newStatus: string) => {
    if (!token) return

    try {
      await adminService.updatePeriode(token, data.id, {
        nama_periode: data.nama_periode,
        jenis_bantuan: data.jenis_bantuan,
        tanggal_mulai: data.tanggal_mulai,
        tanggal_selesai: data.tanggal_selesai,
        status: newStatus
      })
      toast.success('Status periode berhasil diubah!', { duration: 2000 })
      setEditingId(null)
      setEditingStatus('')
      // Refresh list
      const result = await adminService.getDaftarPeriode(token, 1, 50)
      if (result.data) setPeriods(result.data)
    } catch (err: any) {
      const errorMsg = err.message || 'Gagal mengubah status'
      toast.error('Gagal mengubah status', { description: errorMsg, duration: 3000 })
    }
  }

  const handleDelete = async (id: string) => {
    if (!token) return
    if (!confirm('Apakah Anda yakin ingin menghapus periode ini?')) return

    try {
      await adminService.deletePeriode(token, id)
      toast.success('Periode berhasil dihapus!', { duration: 2000 })
      // Refresh list
      const result = await adminService.getDaftarPeriode(token, 1, 50)
      if (result.data) setPeriods(result.data)
    } catch (err: any) {
      const errorMsg = err.message || 'Gagal menghapus periode'
      toast.error('Gagal menghapus periode', { description: errorMsg, duration: 3000 })
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
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Periode Bansos</h1>
          <p className="text-sm text-slate-500">Kelola periode distribusi bantuan sosial</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm shadow-md shadow-blue-200">
          <Plus className="w-4 h-4" />
          Buat Periode Baru
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-bold text-slate-800 mb-4">Buat Periode Baru</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="text-sm font-semibold text-slate-700">Nama Periode</label>
              <input
                type="text"
                value={formData.nama_periode}
                onChange={(e) => setFormData({ ...formData, nama_periode: e.target.value })}
                placeholder="Contoh: Bansos Pangan Maret 2025"
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Jenis Bantuan</label>
              <select
                value={formData.jenis_bantuan}
                onChange={(e) => setFormData({ ...formData, jenis_bantuan: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required>
                <option value="">Pilih Jenis Bantuan</option>
                <option value="sembako">Sembako</option>
                <option value="tunai">Tunai</option>
                <option value="bpnt">BPNT</option>
                <option value="pkh">PKH</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-slate-700">Tanggal Mulai</label>
                <input
                  type="date"
                  value={formData.tanggal_mulai}
                  onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Tanggal Selesai</label>
                <input
                  type="date"
                  value={formData.tanggal_selesai}
                  onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 font-semibold rounded-lg hover:bg-slate-200 transition-colors text-sm">
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Periods List */}
      <div className="space-y-4">
        {periods.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">Belum ada periode</p>
          </div>
        ) : (
          periods.map((p) => {
            const mulai = new Date(p.tanggal_mulai).toLocaleDateString('id-ID')
            const selesai = new Date(p.tanggal_selesai).toLocaleDateString('id-ID')
            const progress =
              p.penerima_terdistribusi && p.total_penerima
                ? Math.round((p.penerima_terdistribusi / p.total_penerima) * 100)
                : 0

            return (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="font-bold text-slate-800 text-base">{p.nama_periode}</h2>
                      <StatusBadge status={p.status} />
                    </div>
                    <p className="text-sm text-slate-500">{p.jenis_bantuan}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <span>
                      {mulai} – {selesai}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">Progress Distribusi</span>
                    <span className="font-bold text-slate-800">
                      {p.statistik.sudah_terima}/{p.statistik.total_penerima} ({p.statistik.progress_distribusi})
                    </span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: p.statistik.progress_distribusi }}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  {editingId === p.id ? (
                    <>
                      <select
                        value={editingStatus}
                        onChange={(e) => setEditingStatus(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Pilih Status</option>
                        <option value="akan_datang">Akan Datang</option>
                        <option value="aktif">Aktif</option>
                        <option value="selesai">Selesai</option>
                      </select>
                      <button
                        onClick={() => handleUpdateStatus(p, editingStatus)}
                        disabled={!editingStatus}
                        className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null)
                          setEditingStatus('')
                        }}
                        className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-600 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(p.id)
                          setEditingStatus(p.status)
                        }}
                        className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 text-sm font-semibold rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5">
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit Status
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={p.status === 'aktif'}
                        className="flex-1 px-4 py-2 bg-slate-50 disabled:opacity-75 disabled:cursor-not-allowed text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5">
                        <Trash2 className="w-3.5 h-3.5" />
                        Hapus
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
