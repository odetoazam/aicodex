'use client'

import Link from 'next/link'
import { CLUSTERS } from '@/lib/clusters'
import type { Article } from '@/lib/types'

export default function ArticleCard({ article }: { article: Article }) {
  const clusterConfig = CLUSTERS.find(c => c.name === article.cluster)
  const tierLabel = article.tier === 5 ? 'Absence' : article.tier === 3 ? 'Cross-Concept' : 'Deep Dive'

  return (
    <Link
      href={`/articles/${article.slug}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '24px',
        borderRadius: '10px',
        border: '1px solid var(--border-base)',
        background: 'var(--bg-surface)',
        textDecoration: 'none',
        transition: 'border-color 150ms ease',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,132,90,0.3)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-base)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {clusterConfig && (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.04em',
              textTransform: 'uppercase' as const,
              color: clusterConfig.color,
              background: clusterConfig.bg,
              fontFamily: 'var(--font-sans)',
            }}
          >
            {article.cluster.split(' ')[0]}
          </span>
        )}
        <span
          style={{
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.04em',
            textTransform: 'uppercase' as const,
            color: article.tier === 5 ? '#D45A7B' : 'var(--text-muted)',
            background: article.tier === 5 ? 'rgba(212,90,123,0.1)' : 'var(--bg-subtle)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {tierLabel}
        </span>
      </div>
      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
        {article.title}
      </h3>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0, flex: 1 }}>
        {article.excerpt ?? ''}
      </p>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
        {article.read_time} min read
      </p>
    </Link>
  )
}
