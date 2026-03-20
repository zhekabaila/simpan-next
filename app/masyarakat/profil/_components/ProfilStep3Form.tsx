'use client'

import { ArrowLeft, CheckCircle2, User, MapPin, Camera, Send, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/app/_stores/useAuthStore'
import { masyarakatService } from '@/services/masyarakat'
import { StepIndicator } from './StepIndicator'
import { formatDateForDisplay } from '@/lib/date-utils'

interface FormData {
  nik: string
  tanggal_lahir: string
  jenis_kelamin: string
  status_pernikahan: string
  jumlah_tanggungan: number
  status_pekerjaan: string
  penghasilan_bulanan: number
  status_kepemilikan_rumah: string
  luas_rumah: number
  alamat: string
  nomor_telepon: string
  rt: string
  rw: string
  kelurahan: string
  kecamatan: string
  kota: string
  provinsi: string
  latitude: number
  longitude: number
}

const photosStatus = [
  'Tampak Depan Rumah',
  'Ruang Tamu',
  'Kamar Tidur',
  'Kamar Mandi',
  'Dapur',
  'Kondisi Atap & Dinding',
  'Sumber Air',
  'Jamban / Toilet'
]

export function ProfilStep3Form() {
  const router = useRouter()
  const { token } = useAuthStore()
  const [agree, setAgree] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<FormData>>({})
  const [error, setError] = useState('')

  useEffect(() => {
    // Load existing profil if available
    if (token) {
      const fetchProfil = async () => {
        try {
          const result = await masyarakatService.getProfil(token)
          if (result.data) {
            setFormData(result.data)
          }
        } catch (err) {
          // New profile, continue with empty form
        }
      }
      fetchProfil()
    }
  }, [token])

  const handleSubmit = async () => {
    if (!agree || !token) return

    try {
      setLoading(true)
      setError('')
      await masyarakatService.updateProfil(token, formData)
      await masyarakatService.submitPengajuan(token)
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Gagal menyelesaikan profil')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Profil Berhasil Disimpan!</h2>
          <p className="text-slate-500 mb-6">Data Anda telah disimpan dan siap untuk pengajuan bantuan sosial.</p>
          <Link
            href="/masyarakat/dashboard"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors block">
            Ke Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto p-4 py-6">
        <Link
          href="/masyarakat/profil/2"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Kembali</span>
        </Link>

        <h1 className="text-xl font-bold text-slate-800 mb-1">Review & Selesaikan Profil</h1>
        <p className="text-sm text-slate-500 mb-4">Periksa kembali data sebelum menyelesaikan pengisian profil.</p>

        <StepIndicator current={3} total={3} />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Data Summary */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-50 rounded-xl">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="font-bold text-slate-800">Data Diri & Ekonomi</h2>
            <Link href="/masyarakat/profil/1" className="ml-auto text-xs text-blue-600 hover:underline font-semibold">
              Edit
            </Link>
          </div>
          <div className="space-y-2.5">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
              <span className="text-sm text-slate-500">NIK</span>
              <span className="text-sm font-semibold text-slate-800">
                {formData.nik ? `${formData.nik?.slice(0, 4)}***${formData.nik?.slice(-4)}` : 'Belum diisi'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
              <span className="text-sm text-slate-500">Tanggal Lahir</span>
              <span className="text-sm font-semibold text-slate-800">{formatDateForDisplay(formData.tanggal_lahir)}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
              <span className="text-sm text-slate-500">Jenis Kelamin</span>
              <span className="text-sm font-semibold text-slate-800">
                {formData.jenis_kelamin === 'L' ? 'Laki-laki' : formData.jenis_kelamin === 'P' ? 'Perempuan' : 'Belum diisi'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
              <span className="text-sm text-slate-500">Status Pernikahan</span>
              <span className="text-sm font-semibold text-slate-800">{formData.status_pernikahan || 'Belum diisi'}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
              <span className="text-sm text-slate-500">Jumlah Tanggungan</span>
              <span className="text-sm font-semibold text-slate-800">{formData.jumlah_tanggungan || 0} orang</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
              <span className="text-sm text-slate-500">Status Pekerjaan</span>
              <span className="text-sm font-semibold text-slate-800">{formData.status_pekerjaan || 'Belum diisi'}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
              <span className="text-sm text-slate-500">Penghasilan Bulanan</span>
              <span className="text-sm font-semibold text-slate-800">
                Rp {(formData.penghasilan_bulanan || 0).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-sm text-slate-500">Status Kepemilikan Rumah</span>
              <span className="text-sm font-semibold text-slate-800">
                {formData.status_kepemilikan_rumah || 'Belum diisi'}
              </span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-green-50 rounded-xl">
              <MapPin className="w-4 h-4 text-green-600" />
            </div>
            <h2 className="font-bold text-slate-800">Alamat</h2>
            <Link href="/masyarakat/profil/1" className="ml-auto text-xs text-blue-600 hover:underline font-semibold">
              Edit
            </Link>
          </div>
          <p className="text-sm text-slate-700">
            {formData.alamat
              ? `${formData.alamat}, RT ${formData.rt}/RW ${formData.rw}, Kel. ${formData.kelurahan}, Kec. ${formData.kecamatan}, ${formData.kota}, ${formData.provinsi}`
              : 'Belum diisi'}
          </p>
        </div>

        {/* Photos checklist */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-amber-50 rounded-xl">
              <Camera className="w-4 h-4 text-amber-600" />
            </div>
            <h2 className="font-bold text-slate-800">Foto Kondisi Rumah</h2>
            <Link href="/masyarakat/profil/2" className="ml-auto text-xs text-blue-600 hover:underline font-semibold">
              Edit
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {photosStatus.map((photo) => (
              <div key={photo} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-slate-600">{photo}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-1">Pernyataan Kebenaran Data</p>
              <p className="text-xs text-amber-700">
                Dengan menyelesaikan pengisian profil ini, saya menyatakan bahwa semua data yang diisi adalah benar dan dapat
                dipertanggungjawabkan. Data palsu dapat dikenai sanksi sesuai peraturan yang berlaku.
              </p>
            </div>
          </div>
        </div>

        {/* Agreement */}
        <label className="flex items-start gap-3 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-blue-600"
          />
          <span className="text-sm text-slate-700">
            Saya menyatakan bahwa data yang saya isi adalah benar dan saya bertanggung jawab atas keakuratan informasi
            tersebut.
          </span>
        </label>

        <button
          onClick={handleSubmit}
          disabled={!agree || loading}
          className={`w-full py-3.5 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
            agree
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}>
          <Send className="w-4 h-4" />
          {loading ? 'Menyimpan...' : 'Selesaikan Profil'}
        </button>
      </div>
    </div>
  )
}
