import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = {
  width: 1200,
  height: 630
}
export const contentType = 'image/png'

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: 40
        }}>
        <div
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 20,
            textAlign: 'center'
          }}>
          SIMPAN
        </div>
        <div
          style={{
            fontSize: 40,
            color: '#e0e7ff',
            textAlign: 'center',
            marginBottom: 30
          }}>
          Sistem Informasi Penyaluran Bantuan
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#c7d2fe',
            textAlign: 'center',
            maxWidth: 800
          }}>
          Platform Digital Terintegrasi untuk Bantuan Sosial Tepat Sasaran
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        'Cache-Control': 'public, s-maxage=31536000, immutable'
      }
    }
  )
}
