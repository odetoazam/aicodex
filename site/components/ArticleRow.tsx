'use client'

import Link from 'next/link'
import { CLUSTER_MAP } from '@/lib/clusters'
import type { Article } from '@/lib/types'

const TIER_CONFIG: Record<string | number, { label: string; color: string; bg: string }> = {
  3: { label: 'Cross-Concept', color: '#5AAFD4', bg: 'rgba(90,175,212,0.1)' },
  4: { label: 'Journey', color: '#9B7BD4', bg: 'rgba(155,123,212,0.1)' },
  5: { label: 'Absence', color: '#D45A7B', bg: 'rgba(212,90,123,0.1)' },
  'field-note': { label: 'From the Field', color: '#D4845A', bg: 'rgba(212,132,90,0.1)' },
}

export default function ArticleRow({ article }: { article: Article }) {
  const clusterConfig = CLUSTER_MAP[article.cluster]
  const tierKey = article.angle === 'field-note' ? 'field-note' : article.tier
  const tierConfig = TIER_CONFIG[tierKey] ?? { label: 'Article', color: 'var(--text-muted)', bg: 'var(--bg-subtle)' }

  return (
    <Link
      href={`/articles/${article.slug}`}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center',
        gap: '24px',
        padding: '20px',
        borderRadius: '8px',
        textDecoration: 'none',
        transition: 'background 120ms ease',
        borderLeft: '2px solid transparent',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.background = 'var(--bg-surface)'
        el.style.borderLeftColor = (clusterConfig?.color ?? '#D4845A') + '60'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.background = 'transparent'
        el.style.borderLeftColor = 'transparent'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          {clusterConfig && (
            <span
              style={{
                padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 500,
                letterSpacing: '0.04em', textTransform: 'uppercase' as const,
                color: clusterConfig.color, background: clusterConfig.bg, fontFamily: 'var(--font-sans)',
              }}
            >
              {article.cluster.split(' ')[0]}
            </span>
          )}
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)' }}>
            {new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} · {article.read_time} min
          </span>
        </div>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-lg)', fontWeight: 400, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '8px' }}>
          {article.title}
        </h3>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
          {article.excerpt ?? ''}
        </p>
      </div>
      <span style={{ color: 'var(--text-muted)', fontSize: '18px', flexShrink: 0 }}>→</span>
    </Link>
  )
}
