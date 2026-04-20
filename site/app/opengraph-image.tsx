import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: '#0A0A0A',
          padding: '64px',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ color: '#D4845A', fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em' }}>
            AI Codex
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1 style={{
            color: '#E8E6E0',
            fontSize: '62px',
            fontWeight: 700,
            lineHeight: 1.15,
            margin: '0 0 20px',
            maxWidth: '820px',
          }}>
            Learn to operate with AI
          </h1>
          <p style={{
            color: '#888888',
            fontSize: '26px',
            margin: 0,
            maxWidth: '680px',
            lineHeight: 1.4,
          }}>
            Practical guides for teams putting Claude to work
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ color: '#444444', fontSize: '20px' }}>aicodex.to</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
