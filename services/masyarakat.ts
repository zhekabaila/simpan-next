// Services untuk Masyarakat
import { API } from './index'

export interface ProfilData {
  nik: string
  nomor_telepon: string
  alamat: string
  tanggal_lahir: string
  jenis_kelamin: string
  rt: string
  rw: string
  kelurahan: string
  kecamatan: string
  kota: string
  provinsi: string
  latitude: number
  longitude: number
  status_pernikahan: string
  jumlah_tanggungan: number
  status_pekerjaan: string
  penghasilan_bulanan: number
  status_kepemilikan_rumah: string
  luas_rumah: number
}

export interface FotoRumah {
  id: string
  jenis_foto: string
  url: string
  keterangan: string
  created_at: string
}

export interface PengajuanStatus {
  id: string
  status: 'menunggu' | 'ditinjau' | 'disetujui' | 'ditolak'
  tanggal_pengajuan: string
  catatan_admin?: string
}

export interface QRCodeResponse {
  success: boolean
  data: {
    token_qr: string
    qr_image_url: string
    periode_bansos: string
  }
}

export const masyarakatService = {
  async getProfil(token: string): Promise<any> {
    try {
      const response = await API.get('/masyarakat/profil', {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get profil')
    }
  },

  async updateProfil(token: string, data: Partial<ProfilData>): Promise<any> {
    try {
      const response = await API.post('/masyarakat/profil', data, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Gagal menyimpan profil'
      const errorData = error.response?.data?.errors || {}

      const err = new Error(errorMessage)
      ;(err as any).errors = errorData
      throw err
    }
  },

  async uploadFotoRumah(token: string, jenis_foto: string, file: File, keterangan: string): Promise<any> {
    try {
      const formData = new FormData()
      formData.append('jenis_foto', jenis_foto)
      formData.append('foto', file)
      formData.append('keterangan', keterangan)

      const response = await API.post('/masyarakat/profil/foto-rumah', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to upload foto')
    }
  },

  async getFotoRumah(token: string): Promise<any> {
    try {
      const response = await API.get('/masyarakat/profil/foto-rumah', {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get foto rumah')
    }
  },

  async deleteFotoRumah(token: string, id: string): Promise<any> {
    try {
      const response = await API.delete(`/masyarakat/profil/foto-rumah/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete foto')
    }
  },

  async submitPengajuan(token: string): Promise<any> {
    try {
      const response = await API.post('/masyarakat/pengajuan', {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to submit pengajuan')
    }
  },

  async getPengajuanStatus(token: string): Promise<PengajuanStatus> {
    try {
      const response = await API.get('/masyarakat/pengajuan', {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get pengajuan status')
    }
  },

  async getQRCode(token: string): Promise<QRCodeResponse> {
    try {
      const response = await API.get('/masyarakat/qrcode', {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get QR code')
    }
  },

  async getNotifikasi(token: string, page: number = 1, limit: number = 10): Promise<any> {
    try {
      const response = await API.get('/masyarakat/notifikasi', {
        params: { page, limit },
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get notifikasi')
    }
  },

  async markNotifikasiRead(token: string, id: string): Promise<any> {
    try {
      const response = await API.patch(`/masyarakat/notifikasi/${id}/baca`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to mark as read')
    }
  },

  async markAllNotifikasiRead(token: string): Promise<any> {
    try {
      const response = await API.patch('/masyarakat/notifikasi/baca-semua', {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to mark all as read')
    }
  }
}
