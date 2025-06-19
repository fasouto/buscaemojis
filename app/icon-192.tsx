import { ImageResponse } from 'next/og'

export const size = {
  width: 192,
  height: 192,
}
export const contentType = 'image/png'

export default function Icon192() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          background: 'linear-gradient(135deg, #334155 0%, #475569 50%, #64748b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}
      >
        🔍
      </div>
    ),
    {
      ...size,
    }
  )
}