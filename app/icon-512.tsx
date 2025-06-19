import { ImageResponse } from 'next/og'

export const size = {
  width: 512,
  height: 512,
}
export const contentType = 'image/png'

export default function Icon512() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 320,
          background: 'linear-gradient(135deg, #334155 0%, #475569 30%, #64748b 70%, #94a3b8 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '64px',
          boxShadow: '0 16px 64px rgba(0,0,0,0.3)',
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