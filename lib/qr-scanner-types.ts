// Type definitions for html5-qrcode library
export interface Html5QrcodeConfig {
  fps?: number
  qrbox?:
    | { width: number; height: number }
    | ((containerWidth: number, containerHeight: number) => { width: number; height: number })
  aspectRatio?: number
  disableFlip?: boolean
  rememberLastCamera?: boolean
  supportedScanTypes?: string[]
  videoConstraints?: MediaStreamConstraints['video']
  useBarCodeDetectorIfAvailable?: boolean
}

export interface ScanQRCodeRequest {
  token_qr: string
  periode_bansos_id: string | number
  latitude_scan: number
  longitude_scan: number
}

export interface ScanQRCodeResponse {
  success: boolean
  data?: {
    status: 'success' | 'duplicate' | 'failed'
    message?: string
  }
  message?: string
}
