'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Home,
  Sofa,
  BedDouble,
  Bath,
  UtensilsCrossed,
  Layers,
  Droplets,
  Toilet,
  CheckCircle2,
  X,
  Loader2
} from 'lucide-react'
import { adminService } from '@/services/admin'
import { StatusBadge } from '@/components/core/StatusBadge'
import ImageViewer from '@/components/core/image-viewer'
import { LocationViewer } from '@/components/core/location-viewer'
import { formatDateForDisplay } from '@/lib/date-utils'
import { toast } from 'sonner'

interface DetailPengajuanType {
  id: string
  nomor_pengajuan: string
  status: 'menunggu' | 'ditinjau' | 'disetujui' | 'ditolak'
  diajukan_pada: string
  catatan_admin: string | null
  profil: {
    nik: string
    nomor_telepon: string
    tanggal_lahir: string
    jenis_kelamin: string
    status_pernikahan: string
    jumlah_tanggungan: number
    status_pekerjaan: string
    penghasilan_bulanan: number
    status_kepemilikan_rumah: string
    alamat: string
    rt: string | null
    rw: string | null
    kelurahan: string | null
    kecamatan: string | null
    kota: string | null
    provinsi: string | null
    latitude: string | number
    longitude: string | number
    foto_rumah: Array<{
      id: string
      jenis_foto: string
      url_foto: string
      keterangan: string | null
      diunggah_pada: string
    }>
    user?: {
      name: string
    }
  }
}

const photoTypeLabels: Record<string, { label: string; icon: any }> = {
  tampak_depan: { label: 'Tampak Depan', icon: Home },
  ruang_tamu: { label: 'Ruang Tamu', icon: Sofa },
  kamar_tidur: { label: 'Kamar Tidur', icon: BedDouble },
  kamar_mandi: { label: 'Kamar Mandi', icon: Bath },
  dapur: { label: 'Dapur', icon: UtensilsCrossed },
  atap_dinding: { label: 'Atap & Dinding', icon: Layers },
  sumber_air: { label: 'Sumber Air', icon: Droplets },
  jamban: { label: 'Jamban', icon: Toilet }
}

interface DetailPengajuanContentProps {
  id: string
  token: string
}

export default function DetailPengajuanContent({ id, token }: DetailPengajuanContentProps) {
  const router = useRouter()

  const [detail, setDetail] = useState<DetailPengajuanType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [decision, setDecision] = useState<'approved' | 'rejected' | null>(null)
  const [catatan, setCatatan] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Fetch detail pengajuan
  useEffect(() => {
    let isMounted = true

    const fetchDetail = async () => {
      if (!token) return
      try {
        setLoading(true)
        setError('')
        const result = await adminService.getDetailPengajuan(token, id)
        if (isMounted) {
          setDetail(result.data)
        }
      } catch (err: any) {
        if (isMounted) {
          const errorMsg = err?.message || 'Gagal memuat detail pengajuan'
          setError(errorMsg)
          toast.error(errorMsg)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchDetail()

    return () => {
      isMounted = false
    }
  }, [])

  const handleApprove = async () => {
    if (!token || !detail) return
    try {
      setSubmitting(true)
      await adminService.approvePengajuan(token, detail.id)
      setDecision('approved')
      setShowSuccess(true)
    } catch (err: any) {
      const errorMsg = err?.message || 'Gagal menyetujui pengajuan'
      setError(errorMsg)
      toast.error(errorMsg)
      setSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!token || !detail) return
    if (!catatan.trim()) {
      const errorMsg = 'Catatan penolakan tidak boleh kosong'
      setError(errorMsg)
      toast.error(errorMsg)
      return
    }
    try {
      setSubmitting(true)
      await adminService.rejectPengajuan(token, detail.id, catatan)
      setDecision('rejected')
      setShowSuccess(true)
    } catch (err: any) {
      const errorMsg = err?.message || 'Gagal menolak pengajuan'
      setError(errorMsg)
      toast.error(errorMsg)
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-slate-600">Memuat detail pengajuan...</p>
        </div>
      </div>
    )
  }

  if (!detail) {
    return (
      <div className="space-y-5">
        <button
          onClick={() => router.push('/admin/pengajuan')}
          className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <p className="text-red-700">{error || 'Detail pengajuan tidak ditemukan'}</p>
        </div>
      </div>
    )
  }

  if (decision === 'approved' && showSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <div className="text-center space-y-6 p-8 bg-white rounded-3xl shadow-lg max-w-md">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Pengajuan Disetujui!</h1>
            <p className="text-slate-600">
              Pengajuan dari {detail.profil.user?.name || 'Masyarakat'} telah berhasil disetujui. QR Code akan dikirim ke
              penerima melalui SMS.
            </p>
          </div>
          <button
            onClick={() => router.push('/admin/pengajuan')}
            className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors">
            Kembali ke Daftar
          </button>
        </div>
      </div>
    )
  }

  if (decision === 'rejected' && showSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center space-y-6 p-8 bg-white rounded-3xl shadow-lg max-w-md">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <X className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Pengajuan Ditolak</h1>
            <p className="text-slate-600">
              Pengajuan dari {detail.profil.user?.name || 'Masyarakat'} telah ditolak. Pemohon akan menerima notifikasi
              penolakan melalui aplikasi.
            </p>
          </div>
          <button
            onClick={() => router.push('/admin/pengajuan')}
            className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors">
            Kembali ke Daftar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <button
        onClick={() => router.push('/admin/pengajuan')}
        className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">{detail.profil.user?.name || 'Masyarakat'}</h1>
            <div className="flex items-center gap-3">
              <p className="text-slate-600">No. Pengajuan: {detail.nomor_pengajuan}</p>
              <StatusBadge status={detail.status} />
            </div>
            <p className="text-sm text-slate-500 mt-1">Tanggal Pengajuan: {formatDateForDisplay(detail.diajukan_pada)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Data Diri */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Data Diri</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Nama Lengkap</span>
                <span className="font-semibold text-slate-800">{detail.profil.user?.name || 'Masyarakat'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">NIK</span>
                <span className="font-semibold text-slate-800">{detail.profil.nik}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tanggal Lahir</span>
                <span className="font-semibold text-slate-800">{formatDateForDisplay(detail.profil.tanggal_lahir)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Jenis Kelamin</span>
                <span className="font-semibold text-slate-800">
                  {detail.profil.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status Pernikahan</span>
                <span className="font-semibold text-slate-800 capitalize">{detail.profil.status_pernikahan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">No. Telepon</span>
                <span className="font-semibold text-slate-800">{detail.profil.nomor_telepon}</span>
              </div>
            </div>
          </div>

          {/* Alamat */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Alamat</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-slate-500 block mb-1">Jalan</span>
                <span className="font-semibold text-slate-800">{detail.profil.alamat || '-'}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 block mb-1">RT</span>
                  <span className="font-semibold text-slate-800">{detail.profil.rt || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">RW</span>
                  <span className="font-semibold text-slate-800">{detail.profil.rw || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Kelurahan</span>
                  <span className="font-semibold text-slate-800">{detail.profil.kelurahan || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Kecamatan</span>
                  <span className="font-semibold text-slate-800">{detail.profil.kecamatan || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Kota</span>
                  <span className="font-semibold text-slate-800">{detail.profil.kota || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Provinsi</span>
                  <span className="font-semibold text-slate-800">{detail.profil.provinsi || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lokasi Rumah */}
          {detail.profil.latitude && detail.profil.longitude && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <LocationViewer
                lat={
                  typeof detail.profil.latitude === 'string' ? parseFloat(detail.profil.latitude) : detail.profil.latitude
                }
                long={
                  typeof detail.profil.longitude === 'string' ? parseFloat(detail.profil.longitude) : detail.profil.longitude
                }
                singleMarker={true}
              />
            </div>
          )}

          {/* Kondisi Ekonomi */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Kondisi Ekonomi</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Status Pekerjaan</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {detail.profil.status_pekerjaan.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Penghasilan Bulanan</span>
                <span className="font-semibold text-slate-800">
                  Rp {detail.profil.penghasilan_bulanan.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Jumlah Tanggungan</span>
                <span className="font-semibold text-slate-800">{detail.profil.jumlah_tanggungan} orang</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status Kepemilikan Rumah</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {detail.profil.status_kepemilikan_rumah.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Foto Kondisi Rumah */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Foto Kondisi Rumah</h2>
            <div className="space-y-4">
              {Object.entries(photoTypeLabels).map(([photoType, { label, icon: Icon }]) => {
                const photo = detail.profil.foto_rumah.find((f) => f.jenis_foto === photoType)
                return (
                  <div key={photoType} className="flex gap-3">
                    <div className="flex-shrink-0 w-20">
                      {photo ? (
                        <ImageViewer
                          src={photo.url_foto}
                          alt={label}
                          fileName={`${label}.jpg`}
                          className="w-full aspect-square rounded-lg border border-slate-200">
                          <div className="w-full aspect-square bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                            <img src={photo.url_foto} alt={label} className="w-full h-full object-cover" />
                          </div>
                        </ImageViewer>
                      ) : (
                        <div className="w-full aspect-square bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-slate-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800">{label}</p>
                      {photo ? (
                        <div className="mt-1 space-y-1 text-xs text-slate-600">
                          {photo.keterangan && (
                            <p>
                              Ket: <span className="font-medium">{photo.keterangan}</span>
                            </p>
                          )}
                          <p className="text-slate-500">Diunggah: {formatDateForDisplay(photo.diunggah_pada)}</p>
                        </div>
                      ) : (
                        <p className="mt-1 text-xs text-slate-400">Belum ada foto</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action Panel */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Keputusan</h2>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Catatan{' '}
                {['menunggu', 'ditinjau'].includes(detail.status)
                  ? '(Opsional untuk setujui, Wajib untuk tolak)'
                  : '(Hanya baca)'}
              </label>
              <textarea
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Masukkan catatan khusus jika diperlukan..."
                disabled={!['menunggu', 'ditinjau'].includes(detail.status)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none disabled:bg-slate-50 disabled:cursor-not-allowed"
                rows={3}
              />
            </div>
            {['menunggu', 'ditinjau'].includes(detail.status) && (
              <div className="space-y-2">
                <button
                  onClick={handleApprove}
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    'Setujui Pengajuan'
                  )}
                </button>
                <button
                  onClick={handleReject}
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    'Tolak Pengajuan'
                  )}
                </button>
              </div>
            )}
            {!['menunggu', 'ditinjau'].includes(detail.status) && (
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <p className="text-xs text-slate-600">
                  Status pengajuan: <span className="font-semibold capitalize">{detail.status}</span>
                </p>
                {detail.catatan_admin && (
                  <p className="text-xs text-slate-600 mt-2">
                    Catatan: <span className="font-semibold">{detail.catatan_admin}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
