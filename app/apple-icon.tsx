import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = {
  width: 180,
  height: 180
}
export const contentType = 'image/png'

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 100,
          background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: 'white'
        }}>
        S
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
