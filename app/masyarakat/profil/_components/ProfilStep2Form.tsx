'use client'

import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Home,
  Sofa,
  BedDouble,
  Bath,
  UtensilsCrossed,
  Layers,
  Droplets,
  Toilet,
  CheckCircle2,
  AlertCircle,
  X,
  Edit2,
  Loader
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/app/_stores/useAuthStore'
import { masyarakatService } from '@/services/masyarakat'
import ImageViewer from '@/components/core/image-viewer'
import { StepIndicator } from './StepIndicator'
import { toast } from 'sonner'

interface UploadedPhoto {
  id: string
  jenis_foto: string
  url_foto: string
  keterangan: string | null
  diunggah_pada: string
}

interface PhotoSlot {
  id: number
  label: string
  icon: any
  keyphoto: string // untuk mapping dengan jenis_foto
}

const photoSlots: PhotoSlot[] = [
  { id: 1, label: 'Tampak Depan Rumah', icon: Home, keyphoto: 'tampak_depan' },
  { id: 2, label: 'Ruang Tamu', icon: Sofa, keyphoto: 'ruang_tamu' },
  { id: 3, label: 'Kamar Tidur', icon: BedDouble, keyphoto: 'kamar_tidur' },
  { id: 4, label: 'Kamar Mandi', icon: Bath, keyphoto: 'kamar_mandi' },
  { id: 5, label: 'Dapur', icon: UtensilsCrossed, keyphoto: 'dapur' },
  { id: 6, label: 'Kondisi Atap & Dinding', icon: Layers, keyphoto: 'atap_dinding' },
  { id: 7, label: 'Sumber Air', icon: Droplets, keyphoto: 'sumber_air' },
  { id: 8, label: 'Jamban / Toilet', icon: Toilet, keyphoto: 'jamban' }
]

interface PhotoState {
  file: File | null
  keterangan: string
  preview: string | null
  isUploading: boolean
}

type PhotoStates = Record<string, PhotoState>

export function ProfilStep2Form() {
  const router = useRouter()
  const { token } = useAuthStore()
  const [uploadedPhotos, setUploadedPhotos] = useState<Record<string, UploadedPhoto>>({})
  const [photoStates, setPhotoStates] = useState<PhotoStates>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  // Initialize photo states
  useEffect(() => {
    const initialStates: PhotoStates = {}
    photoSlots.forEach((slot) => {
      initialStates[slot.keyphoto] = {
        file: null,
        keterangan: '',
        preview: null,
        isUploading: false
      }
    })
    setPhotoStates(initialStates)

    // Load existing photos
    if (token) {
      const fetchPhotos = async () => {
        try {
          const result = await masyarakatService.getFotoRumah(token)
          if (result.data && Array.isArray(result.data)) {
            const photosMap: Record<string, UploadedPhoto> = {}
            result.data.forEach((photo: UploadedPhoto) => {
              photosMap[photo.jenis_foto] = photo
            })
            setUploadedPhotos(photosMap)
          }
        } catch (err) {
          // Continue, no photos yet
        }
      }
      fetchPhotos()
    }
  }, [token])

  const handleFileChange = (keyphoto: string, file: File) => {
    if (file.size > 2048 * 1024) {
      setError('Ukuran file tidak boleh lebih dari 2MB')
      toast.error('Ukuran file tidak boleh lebih dari 2MB')
      return
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Format file hanya boleh JPEG atau PNG')
      toast.error('Format file hanya boleh JPEG atau PNG')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setPhotoStates((prev) => ({
        ...prev,
        [keyphoto]: {
          ...prev[keyphoto],
          file,
          preview: e.target?.result as string
        }
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleKeteranganChange = (keyphoto: string, keterangan: string) => {
    setPhotoStates((prev) => ({
      ...prev,
      [keyphoto]: {
        ...prev[keyphoto],
        keterangan
      }
    }))
  }

  const handleUploadPhoto = async (keyphoto: string) => {
    if (!token || !photoStates[keyphoto].file) return

    try {
      setPhotoStates((prev) => ({
        ...prev,
        [keyphoto]: { ...prev[keyphoto], isUploading: true }
      }))

      await masyarakatService.uploadFotoRumah(token, keyphoto, photoStates[keyphoto].file!, photoStates[keyphoto].keterangan)

      // Refresh photos
      const result = await masyarakatService.getFotoRumah(token)
      if (result.data && Array.isArray(result.data)) {
        const photosMap: Record<string, UploadedPhoto> = {}
        result.data.forEach((photo: UploadedPhoto) => {
          photosMap[photo.jenis_foto] = photo
        })
        setUploadedPhotos(photosMap)
      }

      // Clear states
      setPhotoStates((prev) => ({
        ...prev,
        [keyphoto]: {
          file: null,
          keterangan: '',
          preview: null,
          isUploading: false
        }
      }))

      setError('')
      setEditingId(null)
    } catch (err: any) {
      setError(err.message || 'Gagal upload foto')
      setPhotoStates((prev) => ({
        ...prev,
        [keyphoto]: { ...prev[keyphoto], isUploading: false }
      }))
      toast.error(err.message || 'Gagal upload foto')
    }
  }

  const handleDeletePhoto = async (photoId: string, keyphoto: string) => {
    if (!token) return

    try {
      await masyarakatService.deleteFotoRumah(token, photoId)

      setUploadedPhotos((prev) => {
        const next = { ...prev }
        delete next[keyphoto]
        return next
      })

      setError('')
      setEditingId(null)
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus foto')
      toast.error(err.message || 'Gagal upload foto')
    }
  }

  const handleProceedToNextStep = async () => {
    const uploadedCount = Object.keys(uploadedPhotos).length
    if (uploadedCount < photoSlots.length) {
      setError(`Semua foto harus diunggah. ${uploadedCount}/${photoSlots.length} foto`)
      toast.error(`Semua foto harus diunggah. ${uploadedCount}/${photoSlots.length} foto`)
      return
    }

    try {
      setLoading(true)
      setError('')
      router.push('/masyarakat/profil/3')
    } catch (err: any) {
      setError(err.message || 'Gagal melanjutkan')
      toast.error('Terjadi kesalahan ketika mencoba menyimpan profil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-4 py-6">
        <Link
          href="/masyarakat/profil/1"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Kembali</span>
        </Link>

        <h1 className="text-xl font-bold text-slate-800 mb-1">Foto Kondisi Rumah</h1>
        <p className="text-sm text-slate-500 mb-4">Upload foto untuk semua bagian rumah. Semua foto wajib diunggah.</p>

        <StepIndicator current={2} total={3} />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Progress */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-700">Progress Upload</span>
            <span className="text-sm font-bold text-blue-600">
              {Object.keys(uploadedPhotos).length} / {photoSlots.length} foto
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${(Object.keys(uploadedPhotos).length / photoSlots.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {photoSlots.map((slot) => {
            const uploaded = uploadedPhotos[slot.keyphoto]
            const isEditing = editingId === slot.keyphoto
            const photoState = photoStates[slot.keyphoto]
            const Icon = slot.icon

            return (
              <div
                key={slot.keyphoto}
                className={`bg-white rounded-2xl border-2 p-5 transition-all ${
                  uploaded ? 'border-green-400 bg-green-50' : 'border-dashed border-slate-200'
                }`}>
                <div className="flex items-start gap-3 mb-4">
                  <div className={`p-2.5 rounded-xl flex-shrink-0 ${uploaded ? 'bg-green-100' : 'bg-slate-100'}`}>
                    <Icon className={`w-5 h-5 ${uploaded ? 'text-green-600' : 'text-slate-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-0.5">
                      <p className="text-sm font-semibold text-slate-700 truncate">{slot.label}</p>
                      <span className="text-red-500 text-sm">*</span>
                    </div>
                    <p className="text-xs text-slate-400">{uploaded ? 'Foto berhasil diunggah' : 'Belum ada foto'}</p>
                  </div>
                </div>

                {uploaded && !isEditing && (
                  <div className="mb-4">
                    <ImageViewer
                      src={uploaded.url_foto}
                      alt={slot.label}
                      fileName={`${slot.label}.jpg`}
                      className="w-full h-40 rounded-xl mb-3">
                      <img src={uploaded.url_foto} alt={slot.label} className="w-full h-40 object-cover rounded-xl" />
                    </ImageViewer>
                    {uploaded.keterangan && (
                      <p className="text-xs text-slate-600 mb-3 p-2 bg-slate-50 rounded-lg">
                        <span className="font-semibold">Keterangan:</span> {uploaded.keterangan}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(slot.keyphoto)}
                        className="flex-1 flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all">
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(uploaded.id, slot.keyphoto)}
                        className="flex-1 flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-all">
                        <X className="w-3.5 h-3.5" />
                        Hapus
                      </button>
                    </div>
                  </div>
                )}

                {!uploaded || isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Pilih Foto</label>
                      <input
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileChange(slot.keyphoto, e.target.files[0])
                          }
                        }}
                        className="block w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 file:font-semibold hover:file:bg-blue-100 cursor-pointer"
                      />
                      <p className="text-xs text-slate-400 mt-1">Format: JPG, PNG | Ukuran maksimal: 2MB</p>
                    </div>

                    {photoState?.preview && (
                      <div className="mb-3">
                        <ImageViewer
                          src={photoState.preview}
                          alt="Preview"
                          fileName="preview.jpg"
                          className="w-full h-40 rounded-xl">
                          <img src={photoState.preview} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
                        </ImageViewer>
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Keterangan (Opsional)</label>
                      <textarea
                        value={photoState?.keterangan || ''}
                        onChange={(e) => handleKeteranganChange(slot.keyphoto, e.target.value)}
                        placeholder="Tambahkan keterangan tentang foto ini..."
                        rows={2}
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleUploadPhoto(slot.keyphoto)}
                      disabled={!photoState?.file || photoState?.isUploading}
                      className={`w-full flex items-center justify-center gap-1.5 text-sm px-3 py-2.5 rounded-lg font-semibold transition-all ${
                        photoState?.file && !photoState?.isUploading
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}>
                      {photoState?.isUploading ? (
                        <>
                          <Loader className="w-3.5 h-3.5 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          Upload Foto
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    Terupload
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <Link
            href="/masyarakat/profil/1"
            className="flex-1 py-3.5 border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Sebelumnya
          </Link>
          <button
            onClick={handleProceedToNextStep}
            disabled={loading || Object.keys(uploadedPhotos).length < photoSlots.length}
            className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? 'Memproses...' : 'Lanjut'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
