// Services untuk Petugas
import { API } from './index'

export interface Penugasan {
  id: string
  petugas_nama: string
  periode_bansos: string
  deskripsi_wilayah: string
  status: string
  total_penerima: number
  penerima_terdistribusi: number
  progress: number
}

export interface RiwayatDistribusi {
  id: string
  penerima_nama: string
  nik: string
  periode: string
  status: string
  latitude: number
  longitude: number
  tanggal_distribusi: string
}

export const petugasService = {
  async getProfil(token: string): Promise<any> {
    try {
      const response = await API.get('/petugas/profil', {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get profil')
    }
  },

  async updateProfil(
    token: string,
    data: { nomor_telepon?: string; alamat?: string; latitude?: number; longitude?: number }
  ): Promise<any> {
    try {
      const response = await API.post('/petugas/profil', data, {
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

  async getDaftarPenugasan(token: string, page: number = 1, limit: number = 10): Promise<any> {
    try {
      const response = await API.get('/petugas/penugasan', {
        params: { page, limit },
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get penugasan')
    }
  },

  async getDetailPenugasan(token: string, id: string): Promise<any> {
    try {
      const response = await API.get(`/petugas/penugasan/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get penugasan detail')
    }
  },

  async scanQRCode(
    token: string,
    data: {
      token_qr: string
      periode_bansos_id: string
      latitude_scan: number
      longitude_scan: number
    }
  ): Promise<any> {
    try {
      const response = await API.post('/petugas/scan-qr', data, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to scan QR code')
    }
  },

  async getRiwayatDistribusi(
    token: string,
    page: number = 1,
    limit: number = 20,
    status?: string,
    tanggal?: string,
    periode_bansos_id?: string
  ): Promise<any> {
    try {
      const response = await API.get('/petugas/riwayat-distribusi', {
        params: { page, limit, status, tanggal, periode_bansos_id },
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get riwayat distribusi')
    }
  },

  async getListMasyarakat(token: string, periode_id: string, page: number = 1, limit: number = 20): Promise<any> {
    try {
      const response = await API.get(`/petugas/list-masyarakat/${periode_id}`, {
        params: { page, limit },
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get list masyarakat')
    }
  },

  async resetPassword(token: string, userId: string, password: string): Promise<any> {
    try {
      const response = await API.patch(
        `/pengguna/${userId}/reset-password`,
        { password },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Gagal mereset password')
    }
  },

  async uploadDokumentasi(
    token: string,
    periode_bansos_id: string,
    jenis_dokumentasi: 'foto' | 'catatan',
    file: File | null,
    keterangan: string
  ): Promise<any> {
    try {
      const formData = new FormData()
      formData.append('periode_bansos_id', periode_bansos_id)
      formData.append('jenis_dokumentasi', jenis_dokumentasi)
      if (file) {
        formData.append('foto', file)
      }
      if (keterangan) {
        formData.append('keterangan', keterangan)
      }

      const response = await API.post('/petugas/dokumentasi', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Gagal mengupload dokumentasi'
      const errorData = error.response?.data?.errors || {}

      const err = new Error(errorMessage)
      ;(err as any).errors = errorData
      throw err
    }
  },

  async getDokumentasi(token: string, id: string): Promise<any> {
    try {
      const response = await API.get(`/petugas/dokumentasi/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get dokumentasi')
    }
  },

  async getDokumentasiByPeriode(token: string, periode_id: string, page: number = 1, limit: number = 15): Promise<any> {
    try {
      const response = await API.get(`/petugas/dokumentasi-periode/${periode_id}`, {
        params: { page, limit },
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get dokumentasi')
    }
  },

  async deleteDokumentasi(token: string, id: string): Promise<any> {
    try {
      const response = await API.delete(`/petugas/dokumentasi/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Gagal menghapus dokumentasi')
    }
  }
}
