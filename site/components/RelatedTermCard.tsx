'use client'

import Link from 'next/link'
import { CLUSTER_MAP } from '@/lib/clusters'
import type { Term } from '@/lib/types'

export default function RelatedTermCard({ term }: { term: Pick<Term, 'slug' | 'name' | 'cluster'> }) {
  const config = CLUSTER_MAP[term.cluster]
  return (
    <Link
      href={`/glossary/${term.slug}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        borderRadius: '6px',
        border: '1px solid var(--border-base)',
        background: 'var(--bg-surface)',
        textDecoration: 'none',
        transition: 'border-color 120ms ease',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = (config?.color ?? '#D4845A') + '50' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-base)' }}
    >
      <span style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', color: 'var(--text-primary)' }}>
        {term.name}
      </span>
      <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>→</span>
    </Link>
  )
}
