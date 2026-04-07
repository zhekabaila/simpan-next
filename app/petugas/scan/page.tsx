'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Keyboard, ArrowLeft, AlertCircle, Loader2, Check, AlertTriangle } from 'lucide-react'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'
import useAuthStore from '@/app/_stores/useAuthStore'
import { petugasService } from '@/services/petugas'

// Dynamic import untuk menghindari SSR issues
const Scanner = dynamic(() => import('@yudiel/react-qr-scanner').then((mod) => mod.Scanner), { ssr: false })

export default function ScanQRPage() {
  const router = useRouter()
  const { token } = useAuthStore()
  const [showManual, setShowManual] = useState(false)
  const [qrToken, setQrToken] = useState('')
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [assignment, setAssignment] = useState<any>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [scannerMounted, setScannerMounted] = useState(false)

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
          setAssignment(result.data[0])
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

  const handleScanSuccess = async (detectedCodes: any[]) => {
    if (scanning || showManual || !detectedCodes || detectedCodes.length === 0) {
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
        setQrToken('')
      }, 2000)
    }
  }

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!qrToken.trim()) {
      toast.error('Token kosong', {
        description: 'Masukkan token QR code terlebih dahulu',
        duration: 2000
      })
      return
    }

    const tempToken = qrToken
    setQrToken('')
    await handleScanSubmit(tempToken)
  }

  const toggleManualInput = () => {
    if (showManual) {
      setQrToken('')
      setShowManual(false)
      setIsPaused(false)
    } else {
      setShowManual(true)
      setIsPaused(true)
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
    <div className="flex flex-col h-screen w-screen bg-black relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-4 bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={() => router.push('/petugas/dashboard')}
          className="p-2.5 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <p className="text-white font-bold">Scan QR Code</p>
          <p className="text-white/60 text-xs">Arahkan ke QR Code penerima</p>
        </div>
        <div className="w-10 h-10" /> {/* Spacer for alignment */}
      </div>

      {/* Scanner Container */}
      <div className="flex-1 relative overflow-hidden mt-16">
        {scannerMounted && !showManual && assignment ? (
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

        {!scannerMounted && !showManual && (
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

        <p className="text-center text-white/80 text-sm mb-4">
          {showManual ? 'Masukkan kode token QR Code' : 'Arahkan kamera ke QR Code penerima bantuan'}
        </p>

        <button
          onClick={toggleManualInput}
          disabled={scanning}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 disabled:opacity-50 transition-colors text-sm">
          <Keyboard className="w-4 h-4" />
          {showManual ? 'Gunakan Camera Scanner' : 'Masukkan Token Manual'}
        </button>

        {showManual && (
          <form onSubmit={handleManualSubmit} className="mt-3 flex gap-2">
            <input
              type="text"
              value={qrToken}
              onChange={(e) => setQrToken(e.target.value)}
              placeholder="Masukkan kode token"
              disabled={scanning}
              autoFocus
              className="flex-1 px-4 py-2.5 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={scanning}
              className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors text-sm disabled:opacity-50 flex items-center gap-2">
              {scanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                'Cari'
              )}
            </button>
          </form>
        )}

        {!showManual && (
          <p className="text-center text-white/60 text-xs mt-3">
            📍 Lokasi: {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Mendeteksi...'}
          </p>
        )}
      </div>
    </div>
  )
}
