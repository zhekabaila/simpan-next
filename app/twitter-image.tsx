import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = {
  width: 1200,
  height: 630
}
export const contentType = 'image/png'

export default async function TwitterImage() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 100,
        background: 'linear-gradient(135deg, #1e40af 0%, #0f172a 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: 40,
        gap: 20
      }}>
      <div
        style={{
          fontSize: 72,
          fontWeight: 'bold',
          color: '#fff',
          background: 'rgba(255,255,255,0.1)',
          padding: '20px 40px',
          borderRadius: 12,
          textAlign: 'center'
        }}>
        SIMPAN
      </div>
      <div
        style={{
          fontSize: 36,
          color: '#e0e7ff',
          textAlign: 'center'
        }}>
        Penyaluran Bantuan Sosial Digital
      </div>
      <div
        style={{
          fontSize: 28,
          color: '#c7d2fe',
          textAlign: 'center'
        }}>
        QR Code • Verifikasi Real-time • Transparansi Penuh
      </div>
    </div>,
    {
      ...size,
      headers: {
        'Cache-Control': 'public, s-maxage=31536000, immutable'
      }
    }
  )
}
