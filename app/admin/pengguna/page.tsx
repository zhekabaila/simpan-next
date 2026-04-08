'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, UserPlus, MoreVertical, Shield, HardHat, Users, AlertCircle } from 'lucide-react'
import { Pagination } from '@/components/shared/pagination'
import useAuthStore from '@/app/_stores/useAuthStore'
import { adminService } from '@/services/admin'
import { getPaginationLabel, formatUTCDate } from '@/lib/utils'
import { CreateUserDialog } from '@/components/dialogs/create-user-dialog'
import { UserDetailDialog } from '@/components/dialogs/user-detail-dialog'
import { toast } from 'sonner'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

type Role = 'semua' | 'masyarakat' | 'petugas' | 'admin'

const roleConfig = {
  masyarakat: {
    icon: Users,
    label: 'Masyarakat',
    bg: 'bg-blue-50',
    color: 'text-blue-600'
  },
  petugas: {
    icon: HardHat,
    label: 'Petugas',
    bg: 'bg-amber-50',
    color: 'text-amber-600'
  },
  admin: {
    icon: Shield,
    label: 'Admin',
    bg: 'bg-purple-50',
    color: 'text-purple-600'
  }
}

export default function PenggunaPage() {
  const { token } = useAuthStore()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Parse URL parameters
  const pageParam = searchParams.get('page')
  const limitParam = searchParams.get('limit')
  const qParam = searchParams.get('q') || ''
  const roleParam = searchParams.get('role') as Role | null

  const parsedPage = pageParam ? parseInt(pageParam, 10) || 1 : 1
  const parsedLimit = limitParam ? parseInt(limitParam, 10) || 10 : 10
  const parsedRole = roleParam || 'semua'

  const [users, setUsers] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedUserIdForDetail, setSelectedUserIdForDetail] = useState('')

  // Fetch users
  useEffect(() => {
    if (!token) return

    const fetchUsers = async () => {
      try {
        const result = await adminService.getDaftarPengguna(
          token,
          parsedPage,
          parsedLimit,
          parsedRole !== 'semua' ? parsedRole : undefined
          // qParam || undefined
        )
        if (result.data) {
          setUsers(result.data)
        }
        if (result.pages) {
          setTotalPages(result.pages)
        }
      } catch (err: any) {
        const errorMsg = err?.message || 'Gagal memuat data pengguna'
        setError(errorMsg)
        toast.error(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    setLoading(true)
    fetchUsers()
  }, [token, parsedPage, parsedLimit, parsedRole, qParam])

  // Handler untuk update filter role
  const handleFilterChange = (role: Role) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('role', role)
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

  const handleToggleStatus = async (userId: string) => {
    if (!token) return
    try {
      await adminService.toggleStatusPengguna(token, userId)
      // Refresh list
      const result = await adminService.getDaftarPengguna(
        token,
        parsedPage,
        parsedLimit,
        parsedRole !== 'semua' ? parsedRole : undefined
        // qParam || undefined
      )
      if (result.data) setUsers(result.data)
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengubah status')
    }
  }

  const handleCreateUser = async (data: any, role: 'masyarakat' | 'petugas') => {
    if (!token) return
    try {
      if (role === 'petugas') {
        // Call petugas endpoint with optional fields
        await adminService.registerPetugasByAdmin(token, {
          nama: data.nama,
          email: data.email,
          password: data.password,
          nomor_telepon: data.nomor_telepon,
          alamat: data.alamat,
          latitude: data.latitude,
          longitude: data.longitude
        })
      } else {
        // Call masyarakat endpoint
        await adminService.registerUserByAdmin(token, {
          ...data,
          role: 'masyarakat'
        })
      }
      toast.success('Pengguna berhasil ditambahkan')
      // Refresh list
      const result = await adminService.getDaftarPengguna(
        token,
        parsedPage,
        parsedLimit,
        parsedRole !== 'semua' ? parsedRole : undefined
      )
      if (result.data) setUsers(result.data)
    } catch (err: any) {
      toast.error(err.message || 'Gagal menambah pengguna')
      throw err
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
        <div className="space-y-3">
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
          <h1 className="text-xl font-bold text-slate-800">Manajemen Pengguna</h1>
          <p className="text-sm text-slate-500">Kelola akun Masyarakat, Petugas, dan Admin</p>
        </div>
        <button
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors">
          <UserPlus className="w-4 h-4" />
          Tambah Pengguna
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['semua', 'masyarakat', 'petugas', 'admin'] as Role[]).map((r) => (
          <button
            key={r}
            onClick={() => handleFilterChange(r)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${
              parsedRole === r
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}>
            <span className="capitalize">
              {r === 'semua'
                ? 'Semua'
                : (roleConfig[r as keyof typeof roleConfig] as (typeof roleConfig)[keyof typeof roleConfig])?.label}
            </span>
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
          placeholder="Cari nama atau email..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500">
                <th className="text-left py-3 px-4 font-semibold">Nama</th>
                <th className="text-left py-3 px-4 font-semibold">Email</th>
                <th className="text-left py-3 px-4 font-semibold">Peran</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Bergabung</th>
                <th className="text-left py-3 px-4 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.length > 0 ? (
                users.map((user) => {
                  const roleCfg = roleConfig[user.role as keyof typeof roleConfig]
                  const RoleIcon = roleCfg.icon
                  const bergabung = user.created_at ? formatUTCDate(user.created_at, 'date') : 'N/A'
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {user.nama.charAt(0)}
                          </div>
                          <span className="text-sm font-semibold text-slate-800">{user.nama}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-slate-500">{user.email}</td>
                      <td className="py-3.5 px-4">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${roleCfg.bg} ${roleCfg.color}`}>
                          <RoleIcon className="w-3 h-3" />
                          {roleCfg.label}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                            user.aktif
                              ? 'bg-green-50 text-green-700 hover:bg-green-100'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.aktif ? 'bg-green-500' : 'bg-slate-400'}`} />
                          {user.aktif ? 'Aktif' : 'Nonaktif'}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-slate-500">{bergabung}</td>
                      <td className="py-3.5 px-4">
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                              <MoreVertical className="w-4 h-4 text-slate-500" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent align="end" className="w-48 p-2">
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => {
                                  setSelectedUserIdForDetail(user.id)
                                  setIsDetailDialogOpen(true)
                                }}
                                className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
                                Detail
                              </button>
                              {/* <button
                                disabled
                                className="w-full text-left px-3 py-2 text-sm font-medium text-slate-400 cursor-not-allowed">
                                Edit (Segera Hadir)
                              </button>
                              <button
                                disabled
                                className="w-full text-left px-3 py-2 text-sm font-medium text-slate-400 cursor-not-allowed">
                                Hapus (Segera Hadir)
                              </button> */}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 px-4 text-center text-slate-500 text-sm">
                    Tidak ada pengguna ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && users.length > 0 && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-slate-500 whitespace-nowrap">
            {getPaginationLabel({
              page: parsedPage,
              limit: parsedLimit,
              size: users.length
            })}
          </p>
          <Pagination page={parsedPage} pages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}

      <CreateUserDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} onSubmit={handleCreateUser} />
      <UserDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        userId={selectedUserIdForDetail}
        token={token || ''}
      />
    </div>
  )
}
