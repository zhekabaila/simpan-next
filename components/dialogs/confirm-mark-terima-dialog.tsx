'use client'

import { MapPin, AlertCircle } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'

interface MasyarakatItem {
  profil_masyarakat_id: string
  nama: string
  latitude: number
  longitude: number
  status_penerimaan: 'sudah_menerima' | 'gagal' | 'duplikat' | 'belum_menerima'
}

interface ConfirmMarkTerimaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: MasyarakatItem | null
  onConfirm: () => Promise<void>
  isLoading: boolean
}

export function ConfirmMarkTerimaDialog({ open, onOpenChange, item, onConfirm, isLoading }: ConfirmMarkTerimaDialogProps) {
  if (!item) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            Konfirmasi Penerimaan Bantuan
          </AlertDialogTitle>
          <AlertDialogDescription>Tandai penerima bantuan berikut sebagai sudah menerima?</AlertDialogDescription>
        </AlertDialogHeader>

        {/* Item Details */}
        <div className="space-y-3 py-4">
          {/* Name */}
          <div>
            <p className="text-xs text-slate-500 mb-1">Nama Penerima</p>
            <p className="font-semibold text-slate-800">{item.nama}</p>
          </div>

          {/* Location */}
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-slate-600">Lokasi Penerima</p>
                <p className="text-slate-800 font-mono text-xs mt-0.5">
                  {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                </p>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
            <p className="text-xs text-amber-700">
              ⚠️ Pastikan lokasi scan sesuai dengan lokasi penerima sebelum mengkonfirmasi.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
            {isLoading ? 'Memproses...' : 'Konfirmasi'}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
