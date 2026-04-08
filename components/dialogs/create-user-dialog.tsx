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
import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface FormData {
  nama: string
  email: string
  password: string
  nik: string
  nomor_telepon: string
  tanggal_lahir: string
  jenis_kelamin: string
  alamat: string
  rt: string
  rw: string
  kelurahan: string
  kecamatan: string
  kota: string
  provinsi: string
  status_pernikahan: string
  jumlah_tanggungan: number
  status_pekerjaan: string
  penghasilan_bulanan: number
  status_kepemilikan_rumah: string
  latitude: number
  longitude: number
}

interface CreateUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FormData | PetugasFormData, role: 'masyarakat' | 'petugas') => Promise<void>
}

interface PetugasFormData {
  nama: string
  email: string
  password: string
  nomor_telepon: string
  alamat?: string
  latitude?: number
  longitude?: number
}

export function CreateUserDialog({ open, onOpenChange, onSubmit }: CreateUserDialogProps) {
  const [selectedRole, setSelectedRole] = useState<'masyarakat' | 'petugas'>('masyarakat')

  // Format phone number to start with country code 62
  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '')

    // If starts with 0, replace with 62
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.slice(1)
    }
    // If doesn't start with 62, add it
    else if (!cleaned.startsWith('62')) {
      cleaned = '62' + cleaned
    }

    return cleaned
  }

  const handlePhoneNumberChange = (field: 'masyarakat' | 'petugas', value: string) => {
    const formatted = formatPhoneNumber(value)
    if (field === 'masyarakat') {
      setFormData((prev) => ({
        ...prev,
        nomor_telepon: formatted
      }))
    } else {
      setPetugasFormData((prev) => ({
        ...prev,
        nomor_telepon: formatted
      }))
    }
  }

  const [formData, setFormData] = useState<FormData>({
    nama: '',
    email: '',
    password: '',
    nik: '',
    nomor_telepon: '',
    tanggal_lahir: '',
    jenis_kelamin: '',
    alamat: '',
    rt: '',
    rw: '',
    kelurahan: '',
    kecamatan: '',
    kota: '',
    provinsi: '',
    status_pernikahan: '',
    jumlah_tanggungan: 0,
    status_pekerjaan: '',
    penghasilan_bulanan: 0,
    status_kepemilikan_rumah: '',
    latitude: 0,
    longitude: 0
  })
  const [petugasFormData, setPetugasFormData] = useState<PetugasFormData>({
    nama: '',
    email: '',
    password: '',
    nomor_telepon: '',
    alamat: '',
    latitude: 0,
    longitude: 0
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    // Validate based on role
    if (selectedRole === 'petugas') {
      if (!petugasFormData.nama || !petugasFormData.email || !petugasFormData.password) {
        const errorMsg = 'Mohon lengkapi semua field yang diperlukan (*)'
        setError(errorMsg)
        toast.error(errorMsg)
        return
      }
    } else {
      if (!formData.nama || !formData.email || !formData.password || !formData.nik) {
        const errorMsg = 'Mohon lengkapi semua field yang diperlukan (*)'
        setError(errorMsg)
        toast.error(errorMsg)
        return
      }
    }

    setIsSubmitting(true)
    setError('')
    try {
      await onSubmit(selectedRole === 'petugas' ? petugasFormData : formData, selectedRole)
      // Reset form after success
      setFormData({
        nama: '',
        email: '',
        password: '',
        nik: '',
        nomor_telepon: '',
        tanggal_lahir: '',
        jenis_kelamin: '',
        alamat: '',
        rt: '',
        rw: '',
        kelurahan: '',
        kecamatan: '',
        kota: '',
        provinsi: '',
        status_pernikahan: '',
        jumlah_tanggungan: 0,
        status_pekerjaan: '',
        penghasilan_bulanan: 0,
        status_kepemilikan_rumah: '',
        latitude: 0,
        longitude: 0
      })
      setPetugasFormData({
        nama: '',
        email: '',
        password: '',
        nomor_telepon: '',
        alamat: '',
        latitude: 0,
        longitude: 0
      })
      setError('')
      setSelectedRole('masyarakat')
      // Auto-close after success
      setTimeout(() => {
        onOpenChange(false)
      }, 1500)
    } catch (err: any) {
      const errorMsg = err?.message || 'Gagal menambah pengguna'
      setError(errorMsg)
      toast.error(errorMsg)
      // Stay open so user can see error
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    // Always allow user to cancel with Batal button
    setFormData({
      nama: '',
      email: '',
      password: '',
      nik: '',
      nomor_telepon: '',
      tanggal_lahir: '',
      jenis_kelamin: '',
      alamat: '',
      rt: '',
      rw: '',
      kelurahan: '',
      kecamatan: '',
      kota: '',
      provinsi: '',
      status_pernikahan: '',
      jumlah_tanggungan: 0,
      status_pekerjaan: '',
      penghasilan_bulanan: 0,
      status_kepemilikan_rumah: '',
      latitude: 0,
      longitude: 0
    })
    setPetugasFormData({
      nama: '',
      email: '',
      password: '',
      nomor_telepon: '',
      alamat: '',
      latitude: 0,
      longitude: 0
    })
    setError('')
    setSelectedRole('masyarakat')
    onOpenChange(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    // Prevent closing if there's an error displayed (from outside clicks, not from Batal button)
    if (newOpen === false && error) {
      return
    }
    onOpenChange(newOpen)
  }

  const handleLocationChange = (value: { lat: number; long: number; address: string }) => {
    setFormData((prev) => ({
      ...prev,
      latitude: value.lat,
      longitude: value.long,
      alamat: value.address
    }))
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Tambah Pengguna Baru</AlertDialogTitle>
          <AlertDialogDescription>
            {selectedRole === 'masyarakat'
              ? 'Daftarkan masyarakat baru ke sistem untuk mendapatkan bantuan sosial'
              : 'Daftarkan petugas baru untuk mendistribusikan bantuan sosial'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Role Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedRole('masyarakat')
              setError('')
            }}
            disabled={isSubmitting}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-colors ${
              selectedRole === 'masyarakat'
                ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                : 'bg-slate-100 text-slate-600 border-2 border-slate-200 hover:bg-slate-200'
            } disabled:opacity-50 disabled:cursor-not-allowed`}>
            Masyarakat
          </button>
          <button
            onClick={() => {
              setSelectedRole('petugas')
              setError('')
            }}
            disabled={isSubmitting}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-colors ${
              selectedRole === 'petugas'
                ? 'bg-amber-100 text-amber-700 border-2 border-amber-500'
                : 'bg-slate-100 text-slate-600 border-2 border-slate-200 hover:bg-slate-200'
            } disabled:opacity-50 disabled:cursor-not-allowed`}>
            Petugas
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-4 py-4 max-h-[calc(90vh-300px)] overflow-y-auto">
          {selectedRole === 'petugas' ? (
            // Form Petugas (Simple)
            <>
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Informasi Akun Petugas</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={petugasFormData.nama}
                      onChange={(e) => setPetugasFormData({ ...petugasFormData, nama: e.target.value })}
                      placeholder="Nama lengkap petugas"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={petugasFormData.email}
                      onChange={(e) => setPetugasFormData({ ...petugasFormData, email: e.target.value })}
                      placeholder="email@example.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={petugasFormData.password}
                      onChange={(e) => setPetugasFormData({ ...petugasFormData, password: e.target.value })}
                      placeholder="Minimal 8 karakter"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      Nomor Telepon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={petugasFormData.nomor_telepon || ''}
                      onChange={(e) => handlePhoneNumberChange('petugas', e.target.value)}
                      placeholder="628xx xxxx xxxx"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-slate-400 mt-1">Format: dimulai dengan 62 (contoh: 62899189822)</p>
                  </div>
                </div>
              </div>

              {/* Lokasi Section */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Lokasi Kerja (Opsional)</h3>
                <div className="space-y-3">
                  <LocationPicker
                    value={{
                      lat: petugasFormData.latitude || 0,
                      long: petugasFormData.longitude || 0,
                      address: petugasFormData.alamat || ''
                    }}
                    onChange={(value) => {
                      setPetugasFormData((prev) => ({
                        ...prev,
                        latitude: value.lat,
                        longitude: value.long,
                        alamat: value.address
                      }))
                    }}
                    className="max-h-[300px]"
                    addressPlaceholder="Cari alamat lokasi kerja..."
                  />
                </div>
              </div>
            </>
          ) : (
            // Form Masyarakat (Full)
            <>
              {/* Authentication Section */}
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Informasi Akun</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Minimal 8 karakter"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Personal Data Section */}
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Data Diri</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      placeholder="Nama lengkap"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      NIK (16 digit) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={16}
                      value={formData.nik}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value === '' || /^\d*$/.test(value)) {
                          setFormData({ ...formData, nik: value })
                        }
                      }}
                      placeholder="3201234567890123"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Tanggal Lahir</label>
                      <input
                        type="date"
                        value={formData.tanggal_lahir}
                        onChange={(e) => setFormData({ ...formData, tanggal_lahir: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Jenis Kelamin</label>
                      <select
                        value={formData.jenis_kelamin}
                        onChange={(e) => setFormData({ ...formData, jenis_kelamin: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isSubmitting}>
                        <option value="">Pilih</option>
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Status Pernikahan</label>
                      <select
                        value={formData.status_pernikahan}
                        onChange={(e) => setFormData({ ...formData, status_pernikahan: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isSubmitting}>
                        <option value="">Pilih</option>
                        <option value="belum_menikah">Belum Menikah</option>
                        <option value="menikah">Menikah</option>
                        <option value="cerai_hidup">Cerai Hidup</option>
                        <option value="cerai_mati">Cerai Mati</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Jumlah Tanggungan</label>
                      <input
                        type="text"
                        value={formData.jumlah_tanggungan || ''}
                        onChange={(e) => {
                          const value = e.target.value
                          if (value === '' || /^\d*$/.test(value)) {
                            setFormData({ ...formData, jumlah_tanggungan: value === '' ? 0 : parseInt(value, 10) })
                          }
                        }}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Nomor Telepon</label>
                    <input
                      type="text"
                      value={formData.nomor_telepon}
                      onChange={(e) => handlePhoneNumberChange('masyarakat', e.target.value)}
                      placeholder="628xx xxxx xxxx"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-slate-400 mt-1">Format: dimulai dengan 62 (contoh: 62899189822)</p>
                  </div>
                </div>
              </div>

              {/* Economic Section */}
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Kondisi Ekonomi</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Status Pekerjaan</label>
                    <select
                      value={formData.status_pekerjaan}
                      onChange={(e) => setFormData({ ...formData, status_pekerjaan: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}>
                      <option value="">Pilih</option>
                      <option value="tidak_bekerja">Tidak Bekerja</option>
                      <option value="petani">Petani</option>
                      <option value="pedagang">Pedagang</option>
                      <option value="karyawan_swasta">Karyawan Swasta</option>
                      <option value="karyawan_negeri">Karyawan Negeri</option>
                      <option value="pekerja_lepas">Pekerja Lepas</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Penghasilan Bulanan</label>
                    <input
                      type="text"
                      value={formData.penghasilan_bulanan || ''}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value === '' || /^\d*$/.test(value)) {
                          setFormData({ ...formData, penghasilan_bulanan: value === '' ? 0 : parseInt(value, 10) })
                        }
                      }}
                      placeholder="Contoh: 1500000"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Status Kepemilikan Rumah</label>
                    <select
                      value={formData.status_kepemilikan_rumah}
                      onChange={(e) => setFormData({ ...formData, status_kepemilikan_rumah: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}>
                      <option value="">Pilih</option>
                      <option value="milik_sendiri">Milik Sendiri</option>
                      <option value="kontrak_sewa">Kontrak/Sewa</option>
                      <option value="milik_orang_tua">Milik Orang Tua</option>
                      <option value="menumpang">Menumpang</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Lokasi Rumah</h3>
                <div className="space-y-3">
                  <LocationPicker
                    value={{
                      lat: formData.latitude,
                      long: formData.longitude,
                      address: formData.alamat
                    }}
                    onChange={handleLocationChange}
                    addressPlaceholder="Cari alamat rumah..."
                    className="max-h-[300px]"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">RT</label>
                      <input
                        type="text"
                        value={formData.rt}
                        onChange={(e) => {
                          const value = e.target.value
                          if (value === '' || /^\d*$/.test(value)) {
                            setFormData({ ...formData, rt: value })
                          }
                        }}
                        placeholder="02"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">RW</label>
                      <input
                        type="text"
                        value={formData.rw}
                        onChange={(e) => {
                          const value = e.target.value
                          if (value === '' || /^\d*$/.test(value)) {
                            setFormData({ ...formData, rw: value })
                          }
                        }}
                        placeholder="05"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Kelurahan</label>
                    <input
                      type="text"
                      value={formData.kelurahan}
                      onChange={(e) => setFormData({ ...formData, kelurahan: e.target.value })}
                      placeholder="Kebon Jeruk"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Kecamatan</label>
                    <input
                      type="text"
                      value={formData.kecamatan}
                      onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                      placeholder="Kebon Jeruk"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Kota/Kabupaten</label>
                      <input
                        type="text"
                        value={formData.kota}
                        onChange={(e) => setFormData({ ...formData, kota: e.target.value })}
                        placeholder="Jakarta Barat"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Provinsi</label>
                      <input
                        type="text"
                        value={formData.provinsi}
                        onChange={(e) => setFormData({ ...formData, provinsi: e.target.value })}
                        placeholder="DKI Jakarta"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
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
            {isSubmitting ? 'Menyimpan...' : 'Tambah Pengguna'}
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
