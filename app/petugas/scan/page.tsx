'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, AlertCircle, Loader2, Check, AlertTriangle, QrCode, Users } from 'lucide-react'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'
import useAuthStore from '@/app/_stores/useAuthStore'
import { petugasService } from '@/services/petugas'
import { StatusBadge } from '@/components/core/StatusBadge'
import { ConfirmMarkTerimaDialog } from '@/components/dialogs/confirm-mark-terima-dialog'

// Dynamic import untuk menghindari SSR issues
const Scanner = dynamic(() => import('@yudiel/react-qr-scanner').then((mod) => mod.Scanner), { ssr: false })

interface MasyarakatItem {
  profil_masyarakat_id: string
  nama: string
  token_qr: string
  latitude: number
  longitude: number
  status_penerimaan: 'sudah_menerima' | 'gagal' | 'duplikat' | 'belum_menerima'
  diterima_pada: string | null
}

export default function ScanQRPage() {
  const router = useRouter()
  const { token } = useAuthStore()
  const [entryMethod, setEntryMethod] = useState<'scanner' | 'manual' | null>(null)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [assignment, setAssignment] = useState<any>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [scannerMounted, setScannerMounted] = useState(false)
  const [masyarakatList, setMasyarakatList] = useState<MasyarakatItem[]>([])
  const [loadingList, setLoadingList] = useState(false)
  const [markingId, setMarkingId] = useState<string | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [confirmItem, setConfirmItem] = useState<MasyarakatItem | null>(null)

  // Get user location on mount
  useEffect(() => {
    setScannerMounted(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          console.log('Location obtained:', position.coords)
        },
        (error) => {
          console.warn('Geolocation error:', error.message)
          // Fallback location if geolocation fails
          setLocation({ lat: -6.2088, lng: 106.8456 })
        },
        { enableHighAccuracy: false, timeout: 10000 }
      )
    }
  }, [])

  // Fetch current assignment for periode_id
  useEffect(() => {
    if (!token) return

    const fetchAssignment = async () => {
      try {
        const result = await petugasService.getDaftarPenugasan(token, 1, 1)
        if (result.data && result.data.length > 0) {
          setAssignment(result.data.find((e: any) => e?.periode?.status === 'aktif'))
        }
      } catch (err: any) {
        console.error('Failed to fetch assignment:', err)
        const errorMsg = 'Gagal memuat penugasan'
        setError(errorMsg)
        toast.error(errorMsg)
      }
    }

    fetchAssignment()
  }, [token])

  // Fetch masyarakat list ketika user pilih manual entry
  useEffect(() => {
    if (entryMethod !== 'manual' || !token || !assignment) return

    const fetchMasyarakatList = async () => {
      setLoadingList(true)
      setError('')
      try {
        const result = await petugasService.getListMasyarakat(token, assignment.periode_bansos_id, 1, 100)
        if (result.data) {
          setMasyarakatList(result.data)
        }
      } catch (err: any) {
        console.error('Failed to fetch masyarakat list:', err)
        const errorMsg = err?.message || 'Gagal memuat daftar penerima'
        setError(errorMsg)
        toast.error(errorMsg)
      } finally {
        setLoadingList(false)
      }
    }

    fetchMasyarakatList()
  }, [entryMethod, token, assignment])

  const handleScanSuccess = async (detectedCodes: any[]) => {
    if (scanning || entryMethod !== 'scanner' || !detectedCodes || detectedCodes.length === 0) {
      return
    }

    try {
      // Ambil nilai dari barcode pertama yang terdeteksi
      const detectedCode = detectedCodes[0]
      const token_qr = detectedCode?.rawValue

      if (!token_qr || !token_qr.trim()) {
        console.warn('Invalid QR value detected')
        return
      }

      console.log('QR Code detected:', token_qr)

      // Pause scanner untuk mencegah multiple scans
      setIsPaused(true)
      await handleScanSubmit(token_qr)
    } catch (error) {
      console.error('Error processing scan:', error)
      setIsPaused(false)
    }
  }

  const handleMarkTerima = async (item: MasyarakatItem) => {
    if (!token || !location) {
      const errorMsg = 'Data tidak lengkap'
      setError(errorMsg)
      toast.error(errorMsg)
      return
    }

    setMarkingId(item.profil_masyarakat_id)
    try {
      const result = await petugasService.scanQRCode(token, {
        token_qr: item.token_qr,
        periode_bansos_id: assignment.periode_bansos_id,
        latitude_scan: location.lat,
        longitude_scan: location.lng
      })

      // Handle response and show notification
      if (result.data?.status === 'duplicate') {
        toast.warning('QR Code sudah pernah discan!', {
          description: `${item.nama}`,
          icon: <AlertTriangle className="w-5 h-5" />,
          duration: 3000
        })
      } else if (result.data?.status === 'success' || result.success) {
        toast.success('Berhasil ditandai!', {
          description: `${item.nama} sudah menerima bantuan`,
          icon: <Check className="w-5 h-5" />,
          duration: 2000
        })
        // Update list item status
        setMasyarakatList((prev) =>
          prev.map((m) =>
            m.profil_masyarakat_id === item.profil_masyarakat_id
              ? { ...m, status_penerimaan: 'sudah_menerima' as const, diterima_pada: new Date().toISOString() }
              : m
          )
        )
      } else {
        toast.error('Gagal ditandai', {
          description: result.data?.message || 'Data tidak valid',
          duration: 3000
        })
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'Gagal ditandai'
      toast.error('Error', {
        description: errorMsg,
        duration: 3000
      })
      setError(errorMsg)
    } finally {
      setMarkingId(null)
    }
  }

  const handleScanSubmit = async (token_qr: string) => {
    if (!token || !location || !assignment) {
      const errorMsg = 'Data tidak lengkap'
      setError(errorMsg)
      toast.error(errorMsg)
      setIsPaused(false)
      return
    }

    if (!token_qr.trim()) {
      const errorMsg = 'Masukkan token QR code'
      setError(errorMsg)
      toast.error(errorMsg)
      setIsPaused(false)
      return
    }

    setScanning(true)
    setError('')

    try {
      const result = await petugasService.scanQRCode(token, {
        token_qr,
        periode_bansos_id: assignment.periode_bansos_id,
        latitude_scan: location.lat,
        longitude_scan: location.lng
      })

      // Handle response and show notification
      if (result.data?.status === 'duplicate') {
        toast.warning('QR Code sudah pernah discan!', {
          description: `Token: ${token_qr}`,
          icon: <AlertTriangle className="w-5 h-5" />,
          duration: 3000
        })
      } else if (result.data?.status === 'success' || result.success) {
        toast.success('Scan berhasil!', {
          description: `Penerima bantuan berhasil dicatat`,
          icon: <Check className="w-5 h-5" />,
          duration: 2000
        })
      } else {
        toast.error('Scan gagal', {
          description: result.data?.message || 'Data tidak valid',
          duration: 3000
        })
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'Scan gagal'
      toast.error('Error', {
        description: errorMsg,
        duration: 3000
      })
      setError(errorMsg)
    } finally {
      // Reset scanner state setelah 2 detik untuk allow next scan
      setTimeout(() => {
        setScanning(false)
        setIsPaused(false)
      }, 2000)
    }
  }

  const highlightCodeOnCanvas = (detectedCodes: any, ctx: any) => {
    detectedCodes.forEach((detectedCode: any) => {
      const { boundingBox, cornerPoints } = detectedCode

      // Draw bounding box
      ctx.strokeStyle = '#00FF00'
      ctx.lineWidth = 4
      ctx.strokeRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height)

      // Draw corner points
      ctx.fillStyle = '#FF0000'
      cornerPoints.forEach((point: any) => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI)
        ctx.fill()
      })
    })
  }

  return (
    <>
      {/* Choice Modal - Show initially when entryMethod is null */}
      {entryMethod === null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-6 animate-in slide-in-from-bottom">
            <h2 className="text-xl font-extrabold text-slate-800 mb-2">Pilih Metode Pencatatan</h2>
            <p className="text-sm text-slate-600 mb-6">Silakan pilih cara Anda untuk mencatat penerimaan bantuan</p>

            {!assignment || assignment.periode.status !== 'aktif' ? (
              // No active assignment state
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900">Tidak Ada Penugasan Aktif</p>
                    <p className="text-sm text-amber-700 mt-1">
                      Saat ini tidak terdapat penugasan aktif. Hubungi admin untuk mendapatkan penugasan distribusi bantuan.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Active assignment - show options
              <div className="space-y-3">
                {/* Option 1: Scan QR Code */}
                <button
                  onClick={() => setEntryMethod('scanner')}
                  className="w-full flex items-start gap-4 p-4 border-2 border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <QrCode className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">Scan QR Code</p>
                    <p className="text-sm text-slate-500 mt-0.5">Arahkan kamera ke QR Code penerima bantuan</p>
                  </div>
                </button>

                {/* Option 2: Tap Manual */}
                <button
                  onClick={() => setEntryMethod('manual')}
                  className="w-full flex items-start gap-4 p-4 border-2 border-slate-200 rounded-2xl hover:border-green-500 hover:bg-green-50 transition-all text-left">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">Tap Manual</p>
                    <p className="text-sm text-slate-500 mt-0.5">Pilih dari daftar penerima bantuan</p>
                  </div>
                </button>
              </div>
            )}

            <button
              onClick={() => router.push('/petugas/dashboard')}
              className="w-full mt-4 py-3 text-slate-600 font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
              Kembali
            </button>
          </div>
        </div>
      )}

      {/* Scanner Mode */}
      {entryMethod === 'scanner' && (
        <div className="flex flex-col h-screen w-screen bg-black relative">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-4 bg-gradient-to-b from-black/80 to-transparent">
            <button
              onClick={() => setEntryMethod(null)}
              className="p-2.5 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <p className="text-white font-bold">Scan QR Code</p>
              <p className="text-white/60 text-xs">Arahkan ke QR Code penerima</p>
            </div>
            <div className="w-10 h-10" />
          </div>

          {/* Scanner Container */}
          <div className="flex-1 relative overflow-hidden mt-16">
            {scannerMounted && assignment ? (
              <Scanner
                onScan={handleScanSuccess}
                onError={(error: any) => {
                  console.error('Camera/Scanner error:', error)
                  setError('Kamera tidak dapat diakses. Periksa permissions.')
                }}
                paused={isPaused}
                constraints={{
                  facingMode: { ideal: 'environment' },
                  width: { ideal: 1280 },
                  height: { ideal: 720 }
                }}
                formats={['qr_code']}
                components={{
                  onOff: true,
                  torch: true,
                  zoom: false,
                  finder: true,
                  tracker: highlightCodeOnCanvas
                }}
                sound={false}
                allowMultiple={false}
                scanDelay={500}
                styles={{
                  container: {
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#000'
                  }
                }}
              />
            ) : null}

            {!scannerMounted && (
              <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
                <div className="text-center space-y-4">
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
                  <p className="text-white text-sm">Inisialisasi kamera...</p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom panel */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-black/60 px-4 pb-8 pt-8">
            {error && (
              <div className="flex items-start gap-2 mb-4 bg-red-500/20 border border-red-500/50 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <p className="text-center text-white/80 text-sm mb-4">Arahkan kamera ke QR Code penerima bantuan</p>

            {!scanning && (
              <p className="text-center text-white/60 text-xs">
                📍 Lokasi: {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Mendeteksi...'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Manual List Mode */}
      {entryMethod === 'manual' && (
        <div className="flex flex-col h-screen w-screen bg-white">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-slate-200">
            <button onClick={() => setEntryMethod(null)} className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-800" />
            </button>
            <div className="text-center flex-1">
              <p className="font-bold text-slate-800">Daftar Penerima</p>
              <p className="text-slate-500 text-xs mt-0.5">Tap untuk tandai sudah menerima</p>
            </div>
            <div className="w-10 h-10" />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loadingList ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
                  <p className="text-slate-600 text-sm">Memuat daftar penerima...</p>
                </div>
              </div>
            ) : error && masyarakatList.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="max-w-sm mx-auto text-center space-y-4 p-4">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
                  <p className="font-semibold text-slate-800">Gagal memuat daftar</p>
                  <p className="text-sm text-slate-600">{error}</p>
                  <button
                    onClick={() => setEntryMethod(null)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Kembali
                  </button>
                </div>
              </div>
            ) : masyarakatList.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-3 p-4">
                  <Users className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-slate-600">Belum ada daftar penerima</p>
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {masyarakatList.map((item) => (
                  <button
                    key={item.profil_masyarakat_id}
                    onClick={() => {
                      setConfirmItem(item)
                      setConfirmDialogOpen(true)
                    }}
                    disabled={item.status_penerimaan === 'sudah_menerima' || markingId === item.profil_masyarakat_id}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                      item.status_penerimaan === 'sudah_menerima'
                        ? 'bg-green-50 border-green-200 opacity-60 cursor-not-allowed'
                        : markingId === item.profil_masyarakat_id
                          ? 'bg-blue-50 border-blue-300'
                          : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50 active:bg-blue-100'
                    }`}>
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center text-sm font-bold text-slate-700 flex-shrink-0">
                      {item.nama.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800">{item.nama}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        📍 {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                      </p>
                    </div>

                    {/* Status & Loading */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {markingId === item.profil_masyarakat_id ? (
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                      ) : item.status_penerimaan === 'sudah_menerima' ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <StatusBadge
                          status={
                            item.status_penerimaan === 'belum_menerima'
                              ? 'menunggu'
                              : (item.status_penerimaan as 'gagal' | 'duplikat')
                          }
                        />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          {masyarakatList.length > 0 && !loadingList && (
            <div className="border-t border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-green-600">
                  {masyarakatList.filter((m) => m.status_penerimaan === 'sudah_menerima').length}
                </span>
                {' dari '}
                <span className="font-semibold">{masyarakatList.length}</span>
                {' penerima sudah mencatat'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmMarkTerimaDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        item={confirmItem}
        onConfirm={async () => {
          if (confirmItem) {
            await handleMarkTerima(confirmItem)
            setConfirmDialogOpen(false)
            setConfirmItem(null)
          }
        }}
        isLoading={markingId !== null}
      />
    </>
  )
}
