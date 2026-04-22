'use client'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { LocationPicker } from '@/components/core/location-picker'
import { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface ProfilData {
  id: string
  user_id: string
  nama: string
  email: string
  nomor_telepon: string
  alamat: string
  latitude: number
  longitude: number
  created_at: string
  updated_at: string
}

interface EditProfilPetugasDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profilData: ProfilData | null
  onSubmit: (data: { nomor_telepon: string; alamat: string; latitude: number; longitude: number }) => Promise<void>
}

export function EditProfilPetugasDialog({ open, onOpenChange, profilData, onSubmit }: EditProfilPetugasDialogProps) {
  const [formData, setFormData] = useState({
    nomor_telepon: '',
    alamat: '',
    latitude: 0,
    longitude: 0
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Initialize form data when dialog opens
  useEffect(() => {
    if (open && profilData) {
      setFormData({
        nomor_telepon: profilData.nomor_telepon || '',
        alamat: profilData.alamat || '',
        latitude: profilData.latitude || 0,
        longitude: profilData.longitude || 0
      })
      setError('')
    }
  }, [open, profilData])

  const formatPhoneNumber = (phone: string): string => {
    let cleaned = phone.replace(/\D/g, '')

    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.slice(1)
    } else if (!cleaned.startsWith('62')) {
      cleaned = '62' + cleaned
    }

    return cleaned
  }

  const handlePhoneNumberChange = (value: string) => {
    const formatted = formatPhoneNumber(value)
    setFormData((prev) => ({
      ...prev,
      nomor_telepon: formatted
    }))
  }

  const handleLocationChange = (value: { lat: number; long: number; address: string }) => {
    setFormData((prev) => ({
      ...prev,
      latitude: value.lat,
      longitude: value.long,
      alamat: value.address
    }))
  }

  const handleSubmit = async () => {
    setError('')

    if (!formData.nomor_telepon || !formData.alamat) {
      const errorMsg = 'Mohon lengkapi semua field yang diperlukan'
      setError(errorMsg)
      toast.error(errorMsg)
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      toast.success('Profil berhasil diperbarui')
      setTimeout(() => {
        onOpenChange(false)
      }, 1000)
    } catch (err: any) {
      const errorMsg = err?.message || 'Gagal memperbarui profil'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      nomor_telepon: '',
      alamat: '',
      latitude: 0,
      longitude: 0
    })
    setError('')
    onOpenChange(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen === false && error) {
      return
    }
    onOpenChange(newOpen)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Profil Petugas</AlertDialogTitle>
          <AlertDialogDescription>Perbarui informasi profil dan lokasi kerja Anda</AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-4 py-4 max-h-[calc(90vh-300px)] overflow-y-auto">
          {/* Informasi Akun Section */}
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Informasi Akun</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={profilData?.nama || ''}
                  disabled
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none bg-slate-100 text-slate-600 cursor-not-allowed"
                />
                <p className="text-xs text-slate-400 mt-1">Tidak dapat diubah</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Email</label>
                <input
                  type="email"
                  value={profilData?.email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none bg-slate-100 text-slate-600 cursor-not-allowed"
                />
                <p className="text-xs text-slate-400 mt-1">Tidak dapat diubah</p>
              </div>
            </div>
          </div>

          {/* Kontak & Lokasi Section */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Kontak & Lokasi Kerja</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Nomor Telepon <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nomor_telepon}
                  onChange={(e) => handlePhoneNumberChange(e.target.value)}
                  placeholder="628xx xxxx xxxx"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-slate-400 mt-1">Format: dimulai dengan 62 (contoh: 62899189822)</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-3">
                  Lokasi Kerja <span className="text-red-500">*</span>
                </label>
                <LocationPicker
                  value={{
                    lat: formData.latitude,
                    long: formData.longitude,
                    address: formData.alamat
                  }}
                  onChange={handleLocationChange}
                  addressPlaceholder="Cari alamat lokasi kerja..."
                  className="max-h-[300px]"
                />
              </div>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
