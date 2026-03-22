'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'
import useAuthStore from '@/app/_stores/useAuthStore'
import { adminService } from '@/services/admin'
import { Pagination } from '@/components/shared/pagination'
import { CreateAssignmentDialog } from '@/components/dialogs/create-assignment-dialog'
import { StatusBadge } from '@/components/core/StatusBadge'
import { getPaginationLabel } from '@/lib/utils'
import { toast } from 'sonner'

export default function PenugasanPage() {
  const { token } = useAuthStore()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Parse URL parameters
  const pageParam = searchParams.get('page')
  const limitParam = searchParams.get('limit')

  const parsedPage = pageParam ? parseInt(pageParam, 10) || 1 : 1
  const parsedLimit = limitParam ? parseInt(limitParam, 10) || 10 : 10

  const [assignments, setAssignments] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [petugasList, setPetugasList] = useState<any[]>([])
  const [periodeList, setPeriodeList] = useState<any[]>([])

  useEffect(() => {
    if (!token) return

    const fetchAssignments = async () => {
      try {
        const result = await adminService.getDaftarPenugasan(token, parsedPage, parsedLimit)
        if (result.data) {
          setAssignments(result.data)
        }
        if (result.pages) {
          setTotalPages(result.pages)
        }
      } catch (err: any) {
        toast.error(err.message)
      } finally {
        setLoading(false)
      }
    }

    setLoading(true)
    fetchAssignments()
  }, [token, parsedPage, parsedLimit])

  useEffect(() => {
    if (!token || !showDialog) return

    const fetchData = async () => {
      try {
        const [petugasRes, periodeRes] = await Promise.all([
          adminService.getDaftarPengguna(token, 1, 100, 'petugas'),
          adminService.getDaftarPeriode(token, 1, 100)
        ])
        if (petugasRes.data) setPetugasList(petugasRes.data)
        if (periodeRes.data) setPeriodeList(periodeRes.data)
      } catch (err: any) {
        toast.error(err.message)
      }
    }

    fetchData()
  }, [token, showDialog])

  // Handler untuk update halaman
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  const handleCreateAssignment = async (data: any) => {
    if (!token) return
    try {
      await adminService.createPenugasan(token, data)

      // Refresh list
      const result = await adminService.getDaftarPenugasan(token, parsedPage, parsedLimit)
      if (result.data) {
        setAssignments(result.data)
        if (result.pages) {
          setTotalPages(result.pages)
        }
      }
    } catch (err: any) {
      toast.error(err.message)
      throw err
    }
  }

  const handleDeleteAssignment = async (id: string) => {
    if (!token) return
    if (!confirm('Apakah Anda yakin ingin menghapus penugasan ini?')) return

    try {
      await adminService.deletePenugasan(token, id)
      toast.success('Penugasan berhasil dihapus!', { duration: 2000 })
      // Refresh list
      const result = await adminService.getDaftarPenugasan(token, parsedPage, parsedLimit)
      if (result.data) {
        setAssignments(result.data)
        if (result.pages) {
          setTotalPages(result.pages)
        }
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Gagal menghapus penugasan'
      toast.error('Gagal menghapus penugasan', { description: errorMsg, duration: 3000 })
    }
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Penugasan Petugas</h1>
          <p className="text-sm text-slate-500">Kelola penugasan petugas lapangan per wilayah</p>
        </div>
        <button
          onClick={() => setShowDialog(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm shadow-md shadow-blue-200">
          <Plus className="w-4 h-4" />
          Tugaskan Petugas
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500">
                <th className="text-left py-3 px-4 font-semibold">Petugas</th>
                <th className="text-left py-3 px-4 font-semibold">Periode</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Progress</th>
                <th className="text-left py-3 px-4 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {assignments.length > 0 ? (
                assignments.map((a) => {
                  const progress = a.total_penerima ? Math.round((a.penerima_diterima / a.total_penerima) * 100) : 0
                  return (
                    <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center text-sm font-bold text-blue-600">
                            {a.petugas.nama ? a.petugas.nama.charAt(0) : 'P'}
                          </div>
                          <span className="text-sm font-semibold text-slate-800">{a.petugas.nama || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-slate-500 max-w-[200px]">
                        <span className="truncate block">{a.periode.nama_periode || 'N/A'}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={a.periode.status} />
                      </td>
                      <td className="py-3.5 px-4 min-w-[140px]">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-500">
                              {a.statistik.sudah_terima || 0}/{a.statistik.total_penerima || 0}
                            </span>
                            <span className="font-bold text-slate-700">{a.statistik.progress_distribusi}</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                a.statistik.progress_distribusi === '100%' ? 'bg-green-500' : 'bg-blue-500'
                              }`}
                              style={{ width: a.statistik.progress_distribusi }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleDeleteAssignment(a.id)}
                          className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5">
                          <Trash2 className="w-3.5 h-3.5" />
                          Hapus
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 px-4 text-center text-slate-500 text-sm">
                    Tidak ada penugasan ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && assignments.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            {getPaginationLabel({
              page: parsedPage,
              limit: parsedLimit,
              size: assignments.length
            })}
          </p>
          <Pagination page={parsedPage} pages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}

      {/* Create Assignment Dialog */}
      <CreateAssignmentDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onSubmit={handleCreateAssignment}
        petugasList={petugasList}
        periodeList={periodeList}
      />
    </div>
  )
}
