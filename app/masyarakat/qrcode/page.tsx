'use client'

import { useEffect, useState } from 'react'
import { Download, Share2, QrCode, Clock, Info, AlertCircle } from 'lucide-react'
import useAuthStore from '@/app/_stores/useAuthStore'
import { masyarakatService } from '@/services/masyarakat'
import { StatusBadge } from '@/components/core/StatusBadge'
import ImageViewer from '@/components/core/image-viewer'
import { downloadFile } from '@/lib/utils'

export default function QRCodePage() {
  const { token } = useAuthStore()
  const [qrCode, setQRCode] = useState<any>(null)
  const [pengajuanStatus, setPengajuanStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sharing, setSharing] = useState(false)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (!token) return

    const fetchData = async () => {
      try {
        setLoading(true)
        setError('')

        // Fetch pengajuan status
        const statusResult = await masyarakatService.getPengajuanStatus(token)
        setPengajuanStatus(statusResult)

        // Try to fetch QR code
        if (statusResult.status === 'disetujui') {
          try {
            const qrResult = await masyarakatService.getQRCode(token)
            setQRCode(qrResult.data)
          } catch (err) {
            setError('QR Code belum tersedia. Silakan coba kembali nanti.')
          }
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  const isApproved = pengajuanStatus?.status === 'disetujui'

  const handleDownload = async () => {
    if (!qrCode?.url_gambar_qr) return

    setDownloading(true)
    try {
      // Fetch the image as a blob
      const response = await fetch(qrCode.url_gambar_qr)
      const blob = await response.blob()

      // Create a blob URL and trigger download
      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `QR-${qrCode.token_qr}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Cleanup the blob URL
      URL.revokeObjectURL(blobUrl)
    } catch (err) {
      console.error('Download failed:', err)
      alert('Gagal mengunduh QR Code')
    } finally {
      setDownloading(false)
    }
  }

  const handleShare = async () => {
    if (!qrCode) return

    setSharing(true)
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'QR Code Pengajuan Bantuan Sosial',
          text: `Token: ${qrCode.token_qr}`,
          url: window.location.href
        })
      } else {
        // Fallback: copy to clipboard
        const text = `QR Code Token: ${qrCode.token_qr}\nPeriode: ${qrCode.periode_bansos}`
        await navigator.clipboard.writeText(text)
        alert('QR Code disalin ke clipboard')
      }
    } catch (err) {
      console.error('Share failed:', err)
    } finally {
      setSharing(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 py-6">
        <div className="h-12 bg-slate-200 rounded-xl animate-pulse mb-4" />
        <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4 py-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-800">Error</p>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        </div>
      )}

      <h1 className="text-xl font-bold text-slate-800 mb-1">QR Code Saya</h1>
      <p className="text-sm text-slate-500 mb-5">Gunakan QR Code ini saat pengambilan bantuan sosial.</p>

      {/* Status */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-700">Status Pengajuan</span>
          <StatusBadge status={pengajuanStatus?.status || 'menunggu'} />
        </div>
        <p className="text-sm text-slate-500">
          Nomor: <span className="font-semibold text-slate-700">{pengajuanStatus?.nomor_pengajuan || '-'}</span>
        </p>
      </div>

      {isApproved && qrCode ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex flex-col items-center">
            {/* QR Code Image */}
            <div className="mb-4">
              <ImageViewer
                hideOverlay
                fileName={qrCode.url_gambar_qr}
                src={qrCode.url_gambar_qr}
                alt={qrCode.url_gambar_qr}
              />
            </div>
            <p className="text-sm font-bold text-slate-800 tracking-widest mb-1">{qrCode.token_qr}</p>
            <p className="text-xs text-slate-400 mb-5 text-center">
              Periode: {qrCode.periode_bansos}
              <br />
              Tunjukkan QR Code ini kepada petugas saat distribusi bantuan sosial
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => {
                  downloadFile(qrCode.url_gambar_qr, `${qrCode.token_qr}.svg`)
                }}
                disabled={downloading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed">
                <Download className="w-4 h-4" />
                {downloading ? 'Mengunduh...' : 'Unduh'}
              </button>
              <button
                onClick={handleShare}
                disabled={sharing}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors disabled:opacity-50">
                <Share2 className="w-4 h-4" />
                Bagikan
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <QrCode className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-base font-bold text-slate-700 mb-2">QR Code Belum Tersedia</h2>
          <p className="text-sm text-slate-400 mb-4">
            QR Code akan diterbitkan setelah pengajuan Anda disetujui oleh admin.
          </p>
          <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-3 rounded-xl text-sm w-full justify-center">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>Status: {pengajuanStatus?.status === 'ditinjau' ? 'Sedang ditinjau' : 'Menunggu'}</span>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-4 bg-blue-50 rounded-2xl p-4">
        <div className="flex gap-3">
          <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-800 mb-1">Informasi Penting</p>
            <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
              <li>QR Code bersifat unik dan tidak dapat dipindahtangankan</li>
              <li>Setiap QR Code hanya dapat digunakan sekali per periode</li>
              <li>Simpan QR Code dengan aman</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
