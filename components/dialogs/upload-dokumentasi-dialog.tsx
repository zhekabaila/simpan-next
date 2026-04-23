'use client'

import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Upload, FileText, Image as ImageIcon, AlertCircle, Loader2 } from 'lucide-react'

interface UploadDokumentasiDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (jenis_dokumentasi: 'foto' | 'catatan', file: File | null, keterangan: string) => Promise<void>
  isLoading: boolean
}

export function UploadDokumentasiDialog({ open, onOpenChange, onSubmit, isLoading }: UploadDokumentasiDialogProps) {
  const [jenis, setJenis] = useState<'foto' | 'catatan'>('foto')
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState('')
  const [keterangan, setKeterangan] = useState('')
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) {
      setFile(null)
      setFileName('')
      return
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!validTypes.includes(selectedFile.type)) {
      setError('Format gambar harus JPEG, PNG, atau GIF')
      setFile(null)
      setFileName('')
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (selectedFile.size > maxSize) {
      setError('Ukuran gambar tidak boleh lebih dari 5MB')
      setFile(null)
      setFileName('')
      return
    }

    setFile(selectedFile)
    setFileName(selectedFile.name)
    setError('')
  }

  const handleSubmit = async () => {
    // Validate
    if (jenis === 'foto' && !file) {
      setError('Foto harus diupload jika jenis dokumentasi adalah foto')
      return
    }

    if (keterangan.length > 500) {
      setError('Keterangan maksimal 500 karakter')
      return
    }

    try {
      await onSubmit(jenis, file, keterangan)
      // Reset form
      setJenis('foto')
      setFile(null)
      setFileName('')
      setKeterangan('')
      setError('')
      onOpenChange(false)
    } catch (err: any) {
      const errorMsg = err?.message || 'Gagal mengupload dokumentasi'
      setError(errorMsg)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Upload Dokumentasi</AlertDialogTitle>
          <AlertDialogDescription>Upload foto atau catatan dokumentasi distribusi bansos Anda</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {/* Jenis Dokumentasi */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Jenis Dokumentasi</label>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setJenis('foto')
                  setError('')
                }}
                className={`flex-1 flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all ${
                  jenis === 'foto'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}>
                <ImageIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Foto</span>
              </button>
              <button
                onClick={() => {
                  setJenis('catatan')
                  setFile(null)
                  setFileName('')
                  setError('')
                }}
                className={`flex-1 flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all ${
                  jenis === 'catatan'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}>
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Catatan</span>
              </button>
            </div>
          </div>

          {/* File Upload (if Foto selected) */}
          {jenis === 'foto' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Foto <span className="text-red-500">*</span>
              </label>
              <label className="block">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  {fileName ? (
                    <div className="space-y-1">
                      <ImageIcon className="w-6 h-6 text-blue-500 mx-auto" />
                      <p className="text-sm font-medium text-slate-700">{fileName}</p>
                      <p className="text-xs text-slate-500">Klik untuk ubah foto</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                      <p className="text-sm font-medium text-slate-700">Pilih foto</p>
                      <p className="text-xs text-slate-500">Max 5MB • JPEG, PNG, GIF</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                </div>
              </label>
            </div>
          )}

          {/* Keterangan */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Keterangan <span className="text-slate-400 text-xs">(Opsional, max 500 karakter)</span>
            </label>
            <textarea
              value={keterangan}
              onChange={(e) => {
                setKeterangan(e.target.value)
                setError('')
              }}
              placeholder="Tambahkan catatan tentang dokumentasi ini..."
              disabled={isLoading}
              maxLength={500}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50"
              rows={3}
            />
            <p className="text-xs text-slate-500 mt-1">{keterangan.length}/500 karakter</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Mengupload...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </>
            )}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
