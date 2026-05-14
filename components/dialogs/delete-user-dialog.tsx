'use client'

import { AlertCircle, Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'

interface DeleteUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: {
    id: string
    nama: string
    email: string
    role: 'masyarakat' | 'petugas' | 'admin'
  } | null
  onConfirm: () => Promise<void>
  isLoading: boolean
}

export function DeleteUserDialog({ open, onOpenChange, user, onConfirm, isLoading }: DeleteUserDialogProps) {
  if (!user) return null

  const roleLabel = {
    masyarakat: 'Masyarakat',
    petugas: 'Petugas',
    admin: 'Admin'
  }[user.role]

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            Hapus Pengguna?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-600">
            Pengguna yang dihapus tidak dapat dipulihkan. Tindakan ini bersifat permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* User Details */}
        <div className="space-y-3 py-4 bg-red-50 rounded-lg p-4 border border-red-100">
          <div>
            <p className="text-xs text-red-600 font-semibold mb-1">NAMA PENGGUNA</p>
            <p className="font-semibold text-slate-800">{user.nama}</p>
          </div>

          <div>
            <p className="text-xs text-red-600 font-semibold mb-1">EMAIL</p>
            <p className="text-sm text-slate-700 break-all">{user.email}</p>
          </div>

          <div>
            <p className="text-xs text-red-600 font-semibold mb-1">PERAN</p>
            <span className="inline-block px-2.5 py-1 bg-white rounded-full text-xs font-semibold text-slate-700 border border-red-200">
              {roleLabel}
            </span>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-red-50 rounded-lg p-3 border border-red-100">
          <p className="text-xs text-red-700">
            ⚠️ Pastikan Anda yakin ingin menghapus pengguna ini. Data yang dihapus tidak dapat dikembalikan.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menghapus...
              </>
            ) : (
              'Hapus Pengguna'
            )}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
