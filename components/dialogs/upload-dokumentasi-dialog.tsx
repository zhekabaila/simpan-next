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
import { Upload, Image as ImageIcon, AlertCircle, Loader2 } from 'lucide-react'

interface UploadDokumentasiDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (jenis_dokumentasi: 'foto', file: File | null, keterangan: string) => Promise<void>
  isLoading: boolean
}

export function UploadDokumentasiDialog({ open, onOpenChange, onSubmit, isLoading }: UploadDokumentasiDialogProps) {
  const jenis = 'foto' // Only foto is allowed
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState('')
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [keterangan, setKeterangan] = useState('')
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) {
      setFile(null)
      setFileName('')
      setFilePreview(null)
      return
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!validTypes.includes(selectedFile.type)) {
      setError('Format gambar harus JPEG, PNG, atau GIF')
      setFile(null)
      setFileName('')
      setFilePreview(null)
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (selectedFile.size > maxSize) {
      setError('Ukuran gambar tidak boleh lebih dari 5MB')
      setFile(null)
      setFileName('')
      setFilePreview(null)
      return
    }

    setFile(selectedFile)
    setFileName(selectedFile.name)
    setFilePreview(URL.createObjectURL(selectedFile))
    setError('')
  }

  const handleSubmit = async () => {
    // Validate
    if (!file) {
      setError('Foto harus diupload')
      return
    }

    if (keterangan.length > 500) {
      setError('Keterangan maksimal 500 karakter')
      return
    }

    try {
      await onSubmit(jenis, file, keterangan)
      // Reset form
      setFile(null)
      setFileName('')
      setFilePreview(null)
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
          <AlertDialogDescription>Upload foto dokumentasi distribusi bansos Anda</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Foto <span className="text-red-500">*</span>
            </label>
            
            {/* Preview or Upload Area */}
            {filePreview ? (
              <div className="space-y-3">
                {/* Preview */}
                <div className="w-full bg-slate-100 rounded-lg overflow-hidden">
                  <img 
                    src={filePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover"
                  />
                </div>
                
                {/* File Info */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <p className="text-sm font-semibold text-blue-900">{fileName}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Klik tombol di bawah untuk ubah foto
                  </p>
                </div>

                {/* Hidden File Input for Change */}
                <label className="block">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.currentTarget.parentElement?.querySelector('input[type="file"]') as HTMLInputElement
                      input?.click()
                    }}
                    className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                    Ubah Foto
                  </button>
                </label>
              </div>
            ) : (
              <label className="block">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <div className="space-y-1">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                    <p className="text-sm font-medium text-slate-700">Pilih foto</p>
                    <p className="text-xs text-slate-500">Max 5MB • JPEG, PNG, GIF</p>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                </div>
              </label>
            )}
          </div>

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
