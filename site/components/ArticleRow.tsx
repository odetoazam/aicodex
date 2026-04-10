'use client'

import Link from 'next/link'
import { CLUSTER_MAP } from '@/lib/clusters'
import type { Article } from '@/lib/types'

const ANGLE_LABEL: Record<string, string> = {
  def:         'Concept',
  process:     'How it works',
  failure:     'What goes wrong',
  role:        'Decision guide',
  'field-note':'In practice',
  cross:       'Cross-concept',
  absence:     'What\'s missing',
  history:     'History',
}

export default function ArticleRow({ article, featured = false }: { article: Article; featured?: boolean }) {
  const clusterConfig = CLUSTER_MAP[article.cluster]
  const angleLabel = ANGLE_LABEL[article.angle] ?? article.angle

  return (
    <Link
      href={`/articles/${article.slug}`}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center',
        gap: '24px',
        padding: featured ? '24px 20px' : '18px 20px',
        borderRadius: '8px',
        textDecoration: 'none',
        transition: 'background 120ms ease, border-left-color 120ms ease',
        borderLeft: featured ? `3px solid ${clusterConfig?.color ?? 'var(--accent)'}40` : '2px solid transparent',
        background: featured ? 'var(--bg-surface)' : 'transparent',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.background = 'var(--bg-surface)'
        el.style.borderLeftColor = (clusterConfig?.color ?? '#D4845A') + '60'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.background = featured ? 'var(--bg-surface)' : 'transparent'
        el.style.borderLeftColor = featured
          ? (clusterConfig?.color ?? '#D4845A') + '40'
          : 'transparent'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' as const }}>
          {clusterConfig && (
            <span style={{
              padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 500,
              letterSpacing: '0.04em', textTransform: 'uppercase' as const,
              color: clusterConfig.color, background: clusterConfig.bg, fontFamily: 'var(--font-sans)',
            }}>
              {article.cluster.split(' ')[0]}
            </span>
          )}
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)' }}>
            {angleLabel} · {article.read_time} min
          </span>
        </div>
        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: featured ? 'var(--text-xl)' : 'var(--text-lg)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.25,
          marginBottom: '6px',
        }}>
          {article.title}
        </h3>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
          {article.excerpt ?? ''}
        </p>
      </div>
      <span style={{ color: 'var(--text-muted)', fontSize: '18px', flexShrink: 0 }}>→</span>
    </Link>
  )
}
