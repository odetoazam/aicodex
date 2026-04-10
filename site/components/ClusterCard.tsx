'use client'

import Link from 'next/link'
import type { ClusterConfig } from '@/lib/types'

export default function ClusterCard({
  cluster,
  count,
}: {
  cluster: ClusterConfig
  count: number
}) {
  return (
    <Link
      href={`/glossary?cluster=${encodeURIComponent(cluster.name)}`}
      style={{
        display: 'block',
        padding: '24px',
        borderRadius: '10px',
        border: '1px solid var(--border-base)',
        background: 'var(--bg-surface)',
        textDecoration: 'none',
        transition: 'border-color 150ms ease, background 150ms ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = cluster.color + '50'
        el.style.background = 'var(--bg-subtle)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'var(--border-base)'
        el.style.background = 'var(--bg-surface)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '18px', color: cluster.color }}>{cluster.icon}</span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-muted)' }}>
          {count} terms
        </span>
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '16px',
          fontWeight: 400,
          color: 'var(--text-primary)',
          marginBottom: '8px',
          lineHeight: 1.3,
        }}
      >
        {cluster.name}
      </h3>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
        {cluster.description}
      </p>
    </Link>
  )
}
