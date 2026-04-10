'use client'

import { useState, useMemo } from 'react'

// --- Types ---

type Cluster =
  | 'Foundation Models & LLMs'
  | 'Agents & Orchestration'
  | 'Retrieval & Knowledge'
  | 'Prompt Engineering'
  | 'Infrastructure & Deployment'
  | 'Evaluation & Safety'
  | 'Business Strategy & ROI'
  | 'Tools & Ecosystem'

type Term = {
  slug: string
  name: string
  cluster: Cluster
  definition: string
  claude_specific: boolean
  audience: string[]
  tier: number
}

// --- Cluster Config ---

const CLUSTERS: { name: Cluster; color: string; bg: string; count?: number }[] = [
  { name: 'Foundation Models & LLMs', color: '#7B8FD4', bg: 'rgba(123,143,212,0.12)' },
  { name: 'Agents & Orchestration',   color: '#D4845A', bg: 'rgba(212,132,90,0.12)' },
  { name: 'Retrieval & Knowledge',    color: '#4CAF7D', bg: 'rgba(76,175,125,0.12)' },
  { name: 'Prompt Engineering',       color: '#D4C45A', bg: 'rgba(212,196,90,0.12)' },
  { name: 'Infrastructure & Deployment', color: '#9B7BD4', bg: 'rgba(155,123,212,0.12)' },
  { name: 'Evaluation & Safety',      color: '#D45A7B', bg: 'rgba(212,90,123,0.12)' },
  { name: 'Business Strategy & ROI',  color: '#5AAFD4', bg: 'rgba(90,175,212,0.12)' },
  { name: 'Tools & Ecosystem',        color: '#D4A45A', bg: 'rgba(212,164,90,0.12)' },
]

const CLUSTER_MAP = Object.fromEntries(CLUSTERS.map(c => [c.name, c]))

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

// --- Sub-components ---

function ClusterTag({ cluster }: { cluster: Cluster }) {
  const config = CLUSTER_MAP[cluster]
  if (!config) return null
  const short = cluster.split(' ')[0] // "Foundation", "Agents", etc.
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
        textTransform: 'uppercase',
        color: config.color,
        background: config.bg,
        whiteSpace: 'nowrap',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {short}
    </span>
  )
}

function ClaudeBadge() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 7px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.03em',
        color: '#D4845A',
        background: 'rgba(212,132,90,0.1)',
        border: '1px solid rgba(212,132,90,0.2)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <span style={{ fontSize: '9px' }}>◆</span> Claude
    </span>
  )
}

function TermRow({ term }: { term: Term }) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={`/glossary/${term.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '140px 1fr auto',
        alignItems: 'center',
        gap: '16px',
        padding: '14px 20px',
        borderRadius: '8px',
        textDecoration: 'none',
        background: hovered ? '#141413' : 'transparent',
        borderLeft: hovered ? '2px solid rgba(212,132,90,0.5)' : '2px solid transparent',
        transition: 'all 120ms ease-out',
        cursor: 'pointer',
      }}
    >
      {/* Cluster tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <ClusterTag cluster={term.cluster} />
      </div>

      {/* Name + definition */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
          <span
            style={{
              fontFamily: 'Instrument Serif, Georgia, serif',
              fontSize: '17px',
              color: '#E8E6E1',
              fontWeight: 400,
            }}
          >
            {term.name}
          </span>
          {term.claude_specific && <ClaudeBadge />}
        </div>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            color: '#6B6864',
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {term.definition}
        </p>
      </div>

      {/* Arrow */}
      <span
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '16px',
          color: hovered ? '#D4845A' : '#3A3836',
          transition: 'color 120ms ease-out',
        }}
      >
        →
      </span>
    </a>
  )
}

// --- Main Component ---

export default function GlossaryPage({ terms }: { terms: Term[] }) {
  const [search, setSearch] = useState('')
  const [activeCluster, setActiveCluster] = useState<Cluster | null>(null)
  const [activeLetter, setActiveLetter] = useState<string | null>(null)

  // Filter terms
  const filtered = useMemo(() => {
    let result = terms

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        t =>
          t.name.toLowerCase().includes(q) ||
          t.definition.toLowerCase().includes(q)
      )
    }

    if (activeCluster) {
      result = result.filter(t => t.cluster === activeCluster)
    }

    if (activeLetter) {
      result = result.filter(t => t.name[0].toUpperCase() === activeLetter)
    }

    return result.sort((a, b) => a.name.localeCompare(b.name))
  }, [terms, search, activeCluster, activeLetter])

  // Group by letter for A-Z view
  const byLetter = useMemo(() => {
    const groups: Record<string, Term[]> = {}
    filtered.forEach(t => {
      const letter = t.name[0].toUpperCase()
      if (!groups[letter]) groups[letter] = []
      groups[letter].push(t)
    })
    return groups
  }, [filtered])

  // Available letters
  const availableLetters = useMemo(
    () => new Set(terms.map(t => t.name[0].toUpperCase())),
    [terms]
  )

  const clusterCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    terms.forEach(t => {
      counts[t.cluster] = (counts[t.cluster] || 0) + 1
    })
    return counts
  }, [terms])

  const resetFilters = () => {
    setSearch('')
    setActiveCluster(null)
    setActiveLetter(null)
  }

  const hasFilters = search || activeCluster || activeLetter

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0C0C0B',
        color: '#E8E6E1',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Page Header */}
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: 'clamp(48px, 8vw, 96px) clamp(20px, 5vw, 48px) 48px',
        }}
      >
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#D4845A',
            marginBottom: '16px',
          }}
        >
          Knowledge Graph
        </p>
        <h1
          style={{
            fontFamily: 'Instrument Serif, Georgia, serif',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 400,
            color: '#E8E6E1',
            margin: '0 0 16px',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
          }}
        >
          AI Glossary
        </h1>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            color: '#6B6864',
            margin: '0 0 40px',
            maxWidth: '520px',
            lineHeight: 1.6,
          }}
        >
          {terms.length} terms across 8 clusters — from foundation models to business strategy.
          Every concept mapped to the decisions it informs.
        </p>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '480px' }}>
          <span
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#4A4846',
              fontSize: '15px',
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
              background: '#141413',
              border: '1px solid #262624',
              borderRadius: '8px',
              padding: '12px 16px 12px 40px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              color: '#E8E6E1',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 120ms ease',
            }}
            onFocus={e => { e.target.style.borderColor = 'rgba(212,132,90,0.5)' }}
            onBlur={e => { e.target.style.borderColor = '#262624' }}
          />
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 clamp(20px, 5vw, 48px)',
        }}
      >
        {/* Cluster filters */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '16px',
          }}
        >
          <button
            onClick={() => setActiveCluster(null)}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: `1px solid ${!activeCluster ? 'rgba(212,132,90,0.5)' : '#262624'}`,
              background: !activeCluster ? 'rgba(212,132,90,0.08)' : 'transparent',
              color: !activeCluster ? '#D4845A' : '#6B6864',
              fontFamily: 'Inter, sans-serif',
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
                border: `1px solid ${activeCluster === c.name ? c.color + '80' : '#262624'}`,
                background: activeCluster === c.name ? c.bg : 'transparent',
                color: activeCluster === c.name ? c.color : '#6B6864',
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 120ms ease',
                whiteSpace: 'nowrap',
              }}
            >
              {c.name.split(' ')[0]} ({clusterCounts[c.name] || 0})
            </button>
          ))}
        </div>

        {/* A-Z strip */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            paddingBottom: '32px',
            borderBottom: '1px solid #1C1C1A',
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
                  background: active ? 'rgba(212,132,90,0.1)' : 'transparent',
                  color: active ? '#D4845A' : available ? '#9A9891' : '#2A2826',
                  fontFamily: 'Inter, sans-serif',
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
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 clamp(20px, 5vw, 48px) 96px',
        }}
      >
        {/* Results header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 0 8px',
          }}
        >
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#4A4846' }}>
            {filtered.length} {filtered.length === 1 ? 'term' : 'terms'}
            {hasFilters && (
              <button
                onClick={resetFilters}
                style={{
                  marginLeft: '12px',
                  background: 'none',
                  border: 'none',
                  color: '#D4845A',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Clear filters
              </button>
            )}
          </span>
        </div>

        {/* Term list — grouped by letter */}
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '64px 0',
              color: '#4A4846',
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
            }}
          >
            No terms found
          </div>
        ) : (
          Object.entries(byLetter).map(([letter, letterTerms]) => (
            <div key={letter} id={`letter-${letter}`}>
              {/* Letter divider */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '24px 20px 8px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Instrument Serif, Georgia, serif',
                    fontSize: '13px',
                    color: '#3A3836',
                    minWidth: '16px',
                  }}
                >
                  {letter}
                </span>
                <div style={{ flex: 1, height: '1px', background: '#1C1C1A' }} />
              </div>

              {/* Terms */}
              <div>
                {letterTerms.map(term => (
                  <TermRow key={term.slug} term={term} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
