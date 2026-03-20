'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useAuthStore from '@/app/_stores/useAuthStore'
import { masyarakatService } from '@/services/masyarakat'

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

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              i + 1 === current
                ? 'bg-blue-600 text-white'
                : i + 1 < current
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-100 text-slate-400'
            }`}>
            {i + 1 < current ? '✓' : i + 1}
          </div>
          {i < total - 1 && <div className={`h-0.5 w-8 ${i + 1 < current ? 'bg-green-500' : 'bg-slate-100'}`} />}
        </div>
      ))}
      <span className="ml-2 text-sm text-slate-500">
        Langkah {current} dari {total}
      </span>
    </div>
  )
}

export function ProfilStepForm() {
  const router = useRouter()
  const { token } = useAuthStore()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [moreErrors, setMoreErrors] = useState<Record<string, string[]>>({})
  const [formData, setFormData] = useState<Partial<FormData>>({
    jumlah_tanggungan: 0,
    penghasilan_bulanan: 0,
    luas_rumah: 0,
    latitude: 0,
    longitude: 0
  })

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

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveStep = async () => {
    if (!token) return

    try {
      setLoading(true)
      setError('')
      setMoreErrors({})
      await masyarakatService.updateProfil(token, formData)

      if (step < 3) {
        setStep(step + 1)
      } else {
        alert('Profil berhasil disimpan! Lanjut ke pengajuan.')
        router.push('/masyarakat/pengajuan')
      }
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan profil')
      setMoreErrors(err.errors || {})
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h2 className="font-bold text-slate-800 mb-4">Data Diri</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                    NIK (16 digit) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    value={formData.nik || ''}
                    onChange={(e) => handleInputChange('nik', e.target.value)}
                    placeholder="Masukkan 16 digit NIK"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                    Tanggal Lahir <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.tanggal_lahir || ''}
                    onChange={(e) => handleInputChange('tanggal_lahir', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                    Jenis Kelamin <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.jenis_kelamin || ''}
                    onChange={(e) => handleInputChange('jenis_kelamin', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                    <option value="">Pilih</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                    Status Pernikahan <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status_pernikahan || ''}
                    onChange={(e) => handleInputChange('status_pernikahan', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                    <option value="">Pilih</option>
                    <option value="belum_menikah">Belum Menikah</option>
                    <option value="menikah">Menikah</option>
                    <option value="cerai_hidup">Cerai Hidup</option>
                    <option value="cerai_mati">Cerai Mati</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                    Jumlah Tanggungan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.jumlah_tanggungan || 0}
                    onChange={(e) => handleInputChange('jumlah_tanggungan', parseInt(e.target.value))}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                    Nomor Telepon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    min={0}
                    value={formData.nomor_telepon || 0}
                    onChange={(e) => handleInputChange('nomor_telepon', parseInt(e.target.value))}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h2 className="font-bold text-slate-800 mb-4">Kondisi Ekonomi</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                    Status Pekerjaan <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status_pekerjaan || ''}
                    onChange={(e) => handleInputChange('status_pekerjaan', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                    <option value="">Pilih</option>
                    <option value="bekerja">Bekerja</option>
                    <option value="tidak_bekerja">Tidak Bekerja</option>
                    <option value="wiraswasta">Wiraswasta</option>
                    <option value="pensiun">Pensiun</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                    Penghasilan Bulanan (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.penghasilan_bulanan || 0}
                    onChange={(e) => handleInputChange('penghasilan_bulanan', parseInt(e.target.value))}
                    placeholder="Contoh: 1500000"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                    Status Kepemilikan Rumah <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status_kepemilikan_rumah || ''}
                    onChange={(e) => handleInputChange('status_kepemilikan_rumah', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                    <option value="">Pilih</option>
                    <option value="milik_sendiri">Milik Sendiri</option>
                    <option value="kontrak">Kontrak / Sewa</option>
                    <option value="numpang">Menumpang</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h2 className="font-bold text-slate-800 mb-4">Alamat Tempat Tinggal</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                    Alamat Lengkap <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={formData.alamat || ''}
                    onChange={(e) => handleInputChange('alamat', e.target.value)}
                    placeholder="Jl. Contoh No. 12"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">RT</label>
                  <input
                    type="text"
                    value={formData.rt || ''}
                    onChange={(e) => handleInputChange('rt', e.target.value)}
                    placeholder="001"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">RW</label>
                  <input
                    type="text"
                    value={formData.rw || ''}
                    onChange={(e) => handleInputChange('rw', e.target.value)}
                    placeholder="002"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                    Kelurahan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.kelurahan || ''}
                    onChange={(e) => handleInputChange('kelurahan', e.target.value)}
                    placeholder="Nama kelurahan"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                    Kecamatan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.kecamatan || ''}
                    onChange={(e) => handleInputChange('kecamatan', e.target.value)}
                    placeholder="Nama kecamatan"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                    Kota/Kabupaten <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.kota || ''}
                    onChange={(e) => handleInputChange('kota', e.target.value)}
                    placeholder="Nama kota"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                    Provinsi <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.provinsi || ''}
                    onChange={(e) => handleInputChange('provinsi', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                    <option value="">Pilih Provinsi</option>
                    <option value="Jawa Barat">Jawa Barat</option>
                    <option value="Jawa Tengah">Jawa Tengah</option>
                    <option value="Jawa Timur">Jawa Timur</option>
                    <option value="DKI Jakarta">DKI Jakarta</option>
                    <option value="Banten">Banten</option>
                    <option value="Sumatera Utara">Sumatera Utara</option>
                    <option value="Sulawesi Selatan">Sulawesi Selatan</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h2 className="font-bold text-slate-800 mb-1">Luas Rumah</h2>
              <p className="text-sm text-slate-400 mb-3">Masukkan perkiraan luas rumah Anda dalam meter persegi</p>
              <input
                type="number"
                value={formData.luas_rumah || 0}
                onChange={(e) => handleInputChange('luas_rumah', parseInt(e.target.value))}
                placeholder="50"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <p className="text-xs text-slate-400 mt-2">m²</p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h2 className="font-bold text-slate-800 mb-4">Koordinat Lokasi</h2>
              <p className="text-sm text-slate-400 mb-4">
                Masukkan koordinat GPS lokasi rumah Anda untuk verifikasi lapangan
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                    Lintang (Latitude) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.latitude || 0}
                    onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value))}
                    placeholder="-6.2088"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                    Bujur (Longitude) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.longitude || 0}
                    onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value))}
                    placeholder="106.8456"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-xl flex gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">
                  Anda dapat menemukan koordinat di Google Maps atau aplikasi Maps lainnya
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h2 className="font-bold text-slate-800 mb-3">Ringkasan Data</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">NIK</span>
                  <span className="font-semibold text-slate-800">
                    {formData.nik?.slice(0, 4)}***{formData.nik?.slice(-4)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Alamat</span>
                  <span className="font-semibold text-slate-800">{formData.alamat?.substring(0, 20)}...</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600">Provinsi</span>
                  <span className="font-semibold text-slate-800">{formData.provinsi}</span>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto p-4 py-6">
        <Link
          href="/masyarakat/dashboard"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Kembali</span>
        </Link>

        <h1 className="text-xl font-bold text-slate-800 mb-1">Lengkapi Data Profil</h1>
        <p className="text-sm text-slate-500 mb-4">Data Anda diperlukan untuk verifikasi kelayakan bantuan sosial.</p>

        <StepIndicator current={step} total={3} />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div className="flex flex-col gap-2">
              <div>
                <p className="text-sm font-semibold text-red-800">Gagal menyimpan profil</p>
                <p className="text-xs text-red-600">{error}</p>
              </div>
              <ol className="list-decimal list-inside text-sm font-semibold text-red-800 space-y-4 mt-2 capitalize">
                {Object.entries(moreErrors).map(([field, msg]) => (
                  <li key={field}>
                    {field.replaceAll('_', ' ')}
                    <ul className="list-disc list-inside text-xs text-red-600">
                      {msg.map((msg, i) => (
                        <li key={i}>{msg}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {renderStep()}

        {/* Navigation */}
        <div className="mt-6 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3.5 border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Sebelumnya
            </button>
          )}
          <button
            onClick={handleSaveStep}
            disabled={loading}
            className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? 'Menyimpan...' : step === 3 ? 'Selesaikan' : 'Lanjut'}
            {step < 3 && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
