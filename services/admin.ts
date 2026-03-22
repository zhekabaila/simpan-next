// Services untuk Admin
import { API } from './index'

export interface PengajuanItem {
  id: string
  no_pengajuan: string
  nama_penerima: string
  nik: string
  tanggal_pengajuan: string
  status: string
}

export interface PeriodeBansos {
  id: string
  nama_periode: string
  jenis_bantuan: string
  tanggal_mulai: string
  tanggal_selesai: string
  status: string
  total_penerima: number
  penerima_terdistribusi: number
}

export const adminService = {
  // Pengajuan
  async getDaftarPengajuan(
    token: string,
    page: number = 1,
    limit: number = 20,
    status?: string,
    search?: string
  ): Promise<any> {
    try {
      const response = await API.get('/admin/pengajuan', {
        params: { page, limit, status, search },
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get pengajuan')
    }
  },

  async getDetailPengajuan(token: string, id: string): Promise<any> {
    try {
      const response = await API.get(`/admin/pengajuan/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get pengajuan detail')
    }
  },

  async approvePengajuan(token: string, id: string): Promise<any> {
    try {
      const response = await API.patch(
        `/admin/pengajuan/${id}/setujui`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to approve pengajuan')
    }
  },

  async tinjauPengajuan(token: string, id: string): Promise<any> {
    try {
      const response = await API.patch(
        `/admin/pengajuan/${id}/tinjau`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to approve pengajuan')
    }
  },

  async rejectPengajuan(token: string, id: string, catatan_admin: string): Promise<any> {
    try {
      const response = await API.patch(
        `/admin/pengajuan/${id}/tolak`,
        { catatan_admin },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reject pengajuan')
    }
  },

  // Periode Bansos
  async getDaftarPeriode(token: string, page: number = 1, limit: number = 10): Promise<any> {
    try {
      const response = await API.get('/admin/periode-bansos', {
        params: { page, limit },
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get periode')
    }
  },

  async createPeriode(
    token: string,
    data: {
      nama_periode: string
      jenis_bantuan: string
    }
  ): Promise<any> {
    try {
      const response = await API.post('/admin/periode-bansos', data, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create periode')
    }
  },

  async getDetailPeriode(token: string, id: string): Promise<any> {
    try {
      const response = await API.get(`/admin/periode-bansos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get periode detail')
    }
  },

  async updatePeriode(token: string, id: string, data: any): Promise<any> {
    try {
      const response = await API.patch(`/admin/periode-bansos/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update periode')
    }
  },

  async deletePeriode(token: string, id: string): Promise<any> {
    try {
      const response = await API.delete(`/admin/periode-bansos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete periode')
    }
  },

  // Penugasan
  async getDaftarPenugasan(
    token: string,
    page: number = 1,
    limit: number = 10,
    periode_id?: string,
    petugas_id?: string
  ): Promise<any> {
    try {
      const response = await API.get('/admin/penugasan', {
        params: { page, limit, periode_id, petugas_id },
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get penugasan')
    }
  },

  async createPenugasan(
    token: string,
    data: {
      petugas_id: string
      periode_bansos_id: string
      deskripsi_wilayah: string
      latitude_wilayah: number
      longitude_wilayah: number
    }
  ): Promise<any> {
    try {
      const response = await API.post('/admin/penugasan', data, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create penugasan')
    }
  },

  async getDetailPenugasan(token: string, id: string): Promise<any> {
    try {
      const response = await API.get(`/admin/penugasan/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get penugasan detail')
    }
  },

  async updatePenugasan(token: string, id: string, data: any): Promise<any> {
    try {
      const response = await API.patch(`/admin/penugasan/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update penugasan')
    }
  },

  async deletePenugasan(token: string, id: string): Promise<any> {
    try {
      const response = await API.delete(`/admin/penugasan/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete penugasan')
    }
  },

  // Monitoring
  async getStatistik(token: string): Promise<any> {
    try {
      const response = await API.get('/admin/monitoring/statistik', {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get statistik')
    }
  },

  async getDistribusiByPeriode(
    token: string,
    periode_id: string,
    page: number = 1,
    limit: number = 20,
    status?: string,
    kota?: string,
    kecamatan?: string
  ): Promise<any> {
    try {
      const response = await API.get(`/admin/monitoring/distribusi/${periode_id}`, {
        params: { page, limit, status, kota, kecamatan },
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get distribusi data')
    }
  },

  async getPetaSebaran(token: string, periode_id: string): Promise<any> {
    try {
      const response = await API.get(`/admin/monitoring/peta/${periode_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get peta data')
    }
  },

  async getDistribusiByDate(token: string, startDate: string, endDate: string): Promise<any> {
    try {
      const response = await API.get(`/admin/monitoring/distribusi-by-date`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          start_date: startDate,
          end_date: endDate
        }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get peta data')
    }
  },

  // Notifikasi
  async getDaftarNotifikasi(
    token: string,
    page: number = 1,
    limit: number = 20,
    jenis?: string,
    user_id?: string
  ): Promise<any> {
    try {
      const response = await API.get('/admin/notifikasi', {
        params: { page, limit, jenis, user_id },
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get notifikasi')
    }
  },

  async sendNotifikasi(token: string, user_id: string, judul: string, pesan: string): Promise<any> {
    try {
      const response = await API.post(
        '/admin/notifikasi/kirim',
        { user_id, judul, pesan },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send notifikasi')
    }
  },

  // Pengguna
  async getDaftarPengguna(
    token: string,
    page: number = 1,
    limit: number = 20,
    role?: string,
    aktif?: boolean
  ): Promise<any> {
    try {
      const response = await API.get('/admin/pengguna', {
        params: {
          page,
          limit,
          ...(role && { role }),
          ...(aktif !== undefined && { aktif })
        },
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get pengguna')
    }
  },

  async getDetailPengguna(token: string, id: string): Promise<any> {
    try {
      const response = await API.get(`/admin/pengguna/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get pengguna detail')
    }
  },

  async toggleStatusPengguna(token: string, id: string): Promise<any> {
    try {
      const response = await API.patch(
        `/admin/pengguna/${id}/toggle-aktif`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to toggle pengguna status')
    }
  },

  async registerUserByAdmin(
    token: string,
    data: {
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
  ): Promise<any> {
    try {
      const response = await API.post('/admin/pengguna/registrasi-by-admin', data, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to registrasi-by-admin')
    }
  }
}
