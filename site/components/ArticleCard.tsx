'use client'

import Link from 'next/link'
import { CLUSTERS } from '@/lib/clusters'
import type { Article } from '@/lib/types'

const ANGLE_META: Record<string, { label: string; color: string; bg: string }> = {
  failure:     { label: 'What goes wrong',  color: '#D45A7B', bg: 'rgba(212,90,123,0.1)' },
  process:     { label: 'How it works',     color: '#5AAFD4', bg: 'rgba(90,175,212,0.1)' },
  role:        { label: 'Decision guide',   color: '#D4845A', bg: 'rgba(212,132,90,0.1)' },
  'field-note':{ label: 'In practice',      color: '#4CAF7D', bg: 'rgba(76,175,125,0.1)' },
  def:         { label: 'Concept',          color: '#7B8FD4', bg: 'rgba(123,143,212,0.1)' },
  cross:       { label: 'Cross-concept',    color: '#9B8FC4', bg: 'rgba(155,143,196,0.1)' },
  absence:     { label: "What's missing",   color: 'var(--text-muted)', bg: 'var(--bg-subtle)' },
  history:     { label: 'History',          color: 'var(--text-muted)', bg: 'var(--bg-subtle)' },
  update:      { label: 'Feature update',   color: '#7A5AD4', bg: 'rgba(122,90,212,0.1)' },
}

export default function ArticleCard({ article }: { article: Article }) {
  const clusterConfig = CLUSTERS.find(c => c.name === article.cluster)
  const angleMeta = ANGLE_META[article.angle] ?? { label: article.angle, color: 'var(--text-muted)', bg: 'var(--bg-subtle)' }

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
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' as const }}>
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
            color: angleMeta.color,
            background: angleMeta.bg,
            fontFamily: 'var(--font-sans)',
          }}
        >
          {angleMeta.label}
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
