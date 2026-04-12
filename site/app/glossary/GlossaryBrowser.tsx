'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { CLUSTERS, CLUSTER_MAP } from '@/lib/clusters'
import type { Term, Cluster } from '@/lib/types'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function ClusterTag({ cluster }: { cluster: string }) {
  const config = CLUSTER_MAP[cluster]
  if (!config) return null
  const short = cluster.split(' ')[0]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.04em',
        textTransform: 'uppercase' as const,
        color: config.color,
        background: config.bg,
        whiteSpace: 'nowrap' as const,
        fontFamily: 'var(--font-sans)',
      }}
    >
      {short}
    </span>
  )
}

function TermRow({ term }: { term: Term }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={`/glossary/${term.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '130px 1fr auto',
        alignItems: 'center',
        gap: '16px',
        padding: '13px 16px',
        borderRadius: '8px',
        textDecoration: 'none',
        background: hovered ? 'var(--bg-surface)' : 'transparent',
        borderLeft: hovered ? '2px solid rgba(212,132,90,0.5)' : '2px solid transparent',
        transition: 'all 120ms ease-out',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ClusterTag cluster={term.cluster} />
      </div>

      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '17px',
              color: 'var(--text-primary)',
              fontWeight: 600,
            }}
          >
            {term.name}
          </span>
          {term.claude_specific && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                padding: '1px 6px',
                borderRadius: '3px',
                fontSize: '10px',
                fontWeight: 500,
                color: 'var(--accent)',
                background: 'var(--accent-muted)',
                border: '1px solid rgba(212,132,90,0.2)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <span style={{ fontSize: '8px' }}>◆</span> Claude
            </span>
          )}
        </div>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            color: 'var(--text-muted)',
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap' as const,
          }}
        >
          {term.definition}
        </p>
      </div>

      <span
        style={{
          fontSize: '16px',
          color: hovered ? 'var(--accent)' : 'var(--border-base)',
          transition: 'color 120ms ease-out',
          flexShrink: 0,
        }}
      >
        →
      </span>
    </Link>
  )
}

export default function GlossaryBrowser({ terms }: { terms: Term[] }) {
  const [search, setSearch] = useState('')
  const [activeCluster, setActiveCluster] = useState<Cluster | null>(null)
  const [activeLetter, setActiveLetter] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let result = terms
    if (search.trim()) {
      const q = search.toLowerCase()
      const nameMatches = result.filter(
        t =>
          t.name.toLowerCase().includes(q) ||
          t.aliases.some(a => a.toLowerCase().includes(q))
      )
      result = nameMatches.length > 0
        ? nameMatches
        : result.filter(t => t.definition.toLowerCase().includes(q))
    }
    if (activeCluster) result = result.filter(t => t.cluster === activeCluster)
    if (activeLetter) result = result.filter(t => t.name[0].toUpperCase() === activeLetter)
    return result.sort((a, b) => a.name.localeCompare(b.name))
  }, [terms, search, activeCluster, activeLetter])

  const byLetter = useMemo(() => {
    const groups: Record<string, Term[]> = {}
    filtered.forEach(t => {
      const letter = t.name[0].toUpperCase()
      if (!groups[letter]) groups[letter] = []
      groups[letter].push(t)
    })
    return groups
  }, [filtered])

  const availableLetters = useMemo(
    () => new Set(terms.map(t => t.name[0].toUpperCase())),
    [terms]
  )

  const clusterCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    terms.forEach(t => { counts[t.cluster] = (counts[t.cluster] || 0) + 1 })
    return counts
  }, [terms])

  const hasFilters = search || activeCluster || activeLetter
  const resetFilters = () => { setSearch(''); setActiveCluster(null); setActiveLetter(null) }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Page header */}
      <div
        style={{
          width: 'var(--container)',
          margin: '0 auto',
          padding: 'clamp(48px, 8vw, 96px) 0 40px',
        }}
      >
        <p className="eyebrow" style={{ marginBottom: '16px' }}>Knowledge Graph</p>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-3xl)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: '16px',
          }}
        >
          AI Glossary
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-base)',
            color: 'var(--text-muted)',
            maxWidth: '50ch',
            lineHeight: 1.6,
            marginBottom: '40px',
          }}
        >
          {terms.length} terms across 8 clusters. Every concept mapped to the decisions it informs.
        </p>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '480px' }}>
          <span
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              fontSize: '16px',
              pointerEvents: 'none',
            }}
          >
            ⌕
          </span>
          <input
            type="text"
            placeholder="Search terms, concepts, definitions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-base)',
              borderRadius: '8px',
              padding: '12px 16px 12px 42px',
              fontFamily: 'var(--font-sans)',
              fontSize: '15px',
              color: 'var(--text-primary)',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 120ms ease',
            }}
            onFocus={e => { e.target.style.borderColor = 'rgba(212,132,90,0.5)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--border-base)' }}
          />
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          width: 'var(--container)',
          margin: '0 auto',
        }}
      >
        {/* Cluster pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px', marginBottom: '16px' }}>
          <button
            onClick={() => setActiveCluster(null)}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: `1px solid ${!activeCluster ? 'rgba(212,132,90,0.5)' : 'var(--border-base)'}`,
              background: !activeCluster ? 'var(--accent-muted)' : 'transparent',
              color: !activeCluster ? 'var(--accent)' : 'var(--text-muted)',
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 120ms ease',
            }}
          >
            All ({terms.length})
          </button>
          {CLUSTERS.map(c => (
            <button
              key={c.name}
              onClick={() => setActiveCluster(activeCluster === c.name ? null : c.name)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: `1px solid ${activeCluster === c.name ? c.color + '80' : 'var(--border-base)'}`,
                background: activeCluster === c.name ? c.bg : 'transparent',
                color: activeCluster === c.name ? c.color : 'var(--text-muted)',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 120ms ease',
                whiteSpace: 'nowrap' as const,
              }}
            >
              {c.name.split(' ')[0]} ({clusterCounts[c.name] || 0})
            </button>
          ))}
        </div>

        {/* A–Z strip */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap' as const,
            gap: '4px',
            paddingBottom: '28px',
            borderBottom: '1px solid var(--border-muted)',
          }}
        >
          {ALPHABET.map(letter => {
            const available = availableLetters.has(letter)
            const active = activeLetter === letter
            return (
              <button
                key={letter}
                onClick={() => available && setActiveLetter(active ? null : letter)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '4px',
                  border: active ? '1px solid rgba(212,132,90,0.5)' : '1px solid transparent',
                  background: active ? 'var(--accent-muted)' : 'transparent',
                  color: active ? 'var(--accent)' : available ? 'var(--text-secondary)' : 'var(--border-base)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: available ? 'pointer' : 'default',
                  transition: 'all 120ms ease',
                }}
              >
                {letter}
              </button>
            )
          })}
        </div>
      </div>

      {/* Results */}
      <div
        style={{
          width: 'var(--container)',
          margin: '0 auto',
          paddingBottom: '96px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '20px 0 4px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              color: 'var(--text-muted)',
            }}
          >
            {filtered.length} {filtered.length === 1 ? 'term' : 'terms'}
          </span>
          {hasFilters && (
            <button
              onClick={resetFilters}
              style={{
                marginLeft: '12px',
                background: 'none',
                border: 'none',
                color: 'var(--accent)',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 0',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-sans)',
              fontSize: '15px',
            }}
          >
            No terms found
          </div>
        ) : (
          Object.entries(byLetter).map(([letter, letterTerms]) => (
            <div key={letter} id={`letter-${letter}`}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '24px 16px 6px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                    minWidth: '14px',
                  }}
                >
                  {letter}
                </span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-muted)' }} />
              </div>
              <div>
                {letterTerms.map(term => <TermRow key={term.slug} term={term} />)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
