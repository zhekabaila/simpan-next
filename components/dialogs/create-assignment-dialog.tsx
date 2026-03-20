'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { useState } from 'react'

interface FormData {
  petugas_id: string
  periode_bansos_id: string
}

interface CreateAssignmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FormData) => Promise<void>
  petugasList: Array<{ id: string; nama: string }>
  periodeList: Array<{ id: string; nama_periode: string }>
}

export function CreateAssignmentDialog({
  open,
  onOpenChange,
  onSubmit,
  petugasList,
  periodeList
}: CreateAssignmentDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    petugas_id: '',
    periode_bansos_id: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!formData.petugas_id || !formData.periode_bansos_id) {
      alert('Mohon lengkapi semua field yang diperlukan')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      // Reset form after success
      setFormData({
        petugas_id: '',
        periode_bansos_id: ''
      })
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      onOpenChange(newOpen)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Tugaskan Petugas</AlertDialogTitle>
          <AlertDialogDescription>
            Pilih lokasi wilayah di peta, kemudian lengkapi data petugas dan periode.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {/* Form Fields */}
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1">Petugas</label>
            <select
              value={formData.petugas_id}
              onChange={(e) => setFormData({ ...formData, petugas_id: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}>
              <option value="">Pilih Petugas</option>
              {petugasList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1">Periode</label>
            <select
              value={formData.periode_bansos_id}
              onChange={(e) => setFormData({ ...formData, periode_bansos_id: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}>
              <option value="">Pilih Periode</option>
              {periodeList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama_periode}
                </option>
              ))}
            </select>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? 'Menyimpan...' : 'Tugaskan'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
