import { ImageResponse } from 'next/og'
import { getTerm } from '@/lib/db'
import { CLUSTER_MAP } from '@/lib/clusters'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const term = await getTerm(params.slug)
  const name = term?.name ?? 'AI Glossary'
  const cluster = term?.cluster ?? ''
  const clusterConfig = cluster ? CLUSTER_MAP[cluster] : null
  const clusterColor = clusterConfig?.color ?? '#888888'

  const defSnippet = term?.definition
    ? term.definition.length > 160
      ? term.definition.slice(0, 160).replace(/\s+\S*$/, '') + '…'
      : term.definition
    : ''

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: '#0A0A0A',
          padding: '60px 64px',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#D4845A', fontSize: '22px', fontWeight: 700, letterSpacing: '-0.01em' }}>
            AI Codex · Glossary
          </span>
          {cluster && (
            <span style={{ color: clusterColor, fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {cluster}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', paddingTop: '24px', paddingBottom: '24px' }}>
          <h1 style={{
            color: '#E8E6E0',
            fontSize: '64px',
            fontWeight: 700,
            lineHeight: 1.15,
            margin: '0 0 20px',
          }}>
            {name}
          </h1>
          {defSnippet && (
            <p style={{
              color: '#888888',
              fontSize: '24px',
              margin: 0,
              lineHeight: 1.45,
              maxWidth: '880px',
            }}>
              {defSnippet}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ color: '#444444', fontSize: '18px' }}>aicodex.to</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
