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
    tanggal?: string
  ): Promise<any> {
    try {
      const response = await API.get('/petugas/riwayat-distribusi', {
        params: { page, limit, status, tanggal },
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get riwayat distribusi')
    }
  }
}
