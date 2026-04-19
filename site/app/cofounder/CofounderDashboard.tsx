'use client'

import { useState } from 'react'
import {
  PHASES,
  MILESTONES,
  WINS,
  FOCUS_NOW,
  type Milestone,
  type Phase,
} from '@/lib/cofounder/data'

type Stats = {
  articlesPublished: number
  articlesThisWeek: number
  glossaryTerms: number
  newsletterSubs: number
  subsThisWeek: number
  authUsers: number | null
  progressRows: number
  favoritesRows: number
}

const STATUS_COLOR: Record<Milestone['status'] | Phase['status'], { label: string; color: string; bg: string }> = {
  'locked':    { label: 'Locked',    color: '#5C5A56', bg: 'rgba(92,90,86,0.15)' },
  'in-flight': { label: 'In flight', color: '#D4C45A', bg: 'rgba(212,196,90,0.12)' },
  'close':     { label: 'Close',     color: '#D4845A', bg: 'rgba(212,132,90,0.12)' },
  'hit':       { label: 'Hit',       color: '#4CAF7D', bg: 'rgba(76,175,125,0.15)' },
  'shipped':   { label: 'Shipped',   color: '#4CAF7D', bg: 'rgba(76,175,125,0.15)' },
  'active':    { label: 'Active',    color: '#D4845A', bg: 'rgba(212,132,90,0.15)' },
  'next':      { label: 'Next',      color: '#5AAFD4', bg: 'rgba(90,175,212,0.12)' },
  'later':     { label: 'Later',     color: '#5C5A56', bg: 'rgba(92,90,86,0.15)' },
}

type TabId = 'now' | 'path' | 'log'

export default function CofounderDashboard({ stats }: { stats: Stats }) {
  const [tab, setTab] = useState<TabId>('now')

  // Phase progression math — how many shipped vs total
  const shippedCount = PHASES.filter(p => p.status === 'shipped').length
  const activePhase = PHASES.find(p => p.status === 'active')
  const activePhaseIndex = activePhase ? PHASES.indexOf(activePhase) : shippedCount

  // Active milestones (not hit, not locked) — sorted by % progress desc so momentum is visible
  const activeMilestones = MILESTONES
    .filter(m => m.status === 'in-flight' || m.status === 'close')
    .map(m => {
      let current = m.current
      if (m.id === 'newsletter-subs') current = stats.newsletterSubs
      const pct = (current !== null && m.targetValue !== null)
        ? (current / m.targetValue) * 100
        : -1  // unknown/qualitative sort last
      return { m, pct }
    })
    .sort((a, b) => b.pct - a.pct)
    .map(x => x.m)

  // Phase health — how many of the current phase's milestones have been hit/closed.
  // Since milestones aren't tagged to phases in data.ts, approximate: count all non-locked milestones.
  const totalActive = MILESTONES.filter(m => m.status !== 'locked').length
  const hitCount = MILESTONES.filter(m => m.status === 'hit').length

  return (
    <main style={{ background: 'var(--bg-base)', minHeight: '100vh', padding: '40px 24px 80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* ── Compact hero + phase bar ──────────────────────── */}
        <header style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--accent)', margin: 0,
            }}>
              / Cofounder
            </p>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--text-muted)', margin: 0,
            }}>
              {new Date().toISOString().slice(0, 10)}
            </p>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(20px, 2.4vw, 26px)',
            fontWeight: 500,
            color: 'var(--text-primary)',
            lineHeight: 1.2,
            margin: 0,
            letterSpacing: '-0.01em',
          }}>
            Where we are.
          </h1>
        </header>

        {/* ── Phase progression card ────────────────────────── */}
        <section style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-base)',
          borderRadius: '12px',
          padding: '18px 20px',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.12em',
                textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 3px',
              }}>
                Phase {activePhaseIndex + 1} / {PHASES.length}
              </p>
              <p style={{
                fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 500,
                color: 'var(--text-primary)', margin: 0, lineHeight: 1.2,
              }}>
                {activePhase?.label ?? 'Done'}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.12em',
                textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 3px',
              }}>
                Milestones
              </p>
              <p style={{
                fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 500,
                color: 'var(--text-primary)', margin: 0, lineHeight: 1.2,
              }}>
                <span style={{ color: '#4CAF7D' }}>{hitCount}</span>
                <span style={{ color: 'var(--text-muted)' }}> / {totalActive} active</span>
              </p>
            </div>
          </div>
          <PhaseBar phases={PHASES} />
        </section>

        {/* ── Tabs ──────────────────────────────────────────── */}
        <nav style={{
          display: 'flex', gap: '4px', marginBottom: '20px',
          borderBottom: '1px solid var(--border-base)',
        }}>
          {([
            { id: 'now',  label: 'Now' },
            { id: 'path', label: 'Path' },
            { id: 'log',  label: 'Log' },
          ] as { id: TabId; label: string }[]).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500,
                padding: '10px 16px',
                color: tab === t.id ? 'var(--text-primary)' : 'var(--text-muted)',
                borderBottom: tab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
                marginBottom: '-1px',
                transition: 'color 120ms ease',
              }}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* ── Tab: Now ──────────────────────────────────────── */}
        {tab === 'now' && (
          <>
            {/* Stats row — compact, dense */}
            <StatsStrip stats={stats} />

            {/* Two-column: What remains + Focus now */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
              gap: '20px',
              marginTop: '28px',
            }}>
              {/* What remains — active milestones */}
              <section>
                <SectionLabel>What remains</SectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                  {activeMilestones.map(m => (
                    <MilestoneRow key={m.id} m={m} liveSubs={stats.newsletterSubs} />
                  ))}
                </div>
                <p style={{
                  fontFamily: 'var(--font-mono)', fontSize: '10px',
                  color: 'var(--text-muted)', marginTop: '14px', letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>
                  + {MILESTONES.filter(m => m.status === 'locked').length} locked · see Path tab
                </p>
              </section>

              {/* Focus now */}
              <section>
                <SectionLabel>Focus now</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {FOCUS_NOW.map((f, i) => {
                    const blockedOnYou = !!f.blockedBy && /azam/i.test(f.blockedBy)
                    const borderColor = blockedOnYou ? '#D45A7B' : 'var(--accent)'
                    return (
                      <div key={i} style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-base)',
                        borderLeft: `2px solid ${borderColor}`,
                        borderRadius: '8px',
                        padding: '14px 16px',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                          <p style={{
                            fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500,
                            color: 'var(--text-primary)', margin: 0,
                          }}>
                            {f.title}
                          </p>
                          {blockedOnYou && (
                            <span style={{
                              fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.08em',
                              textTransform: 'uppercase', color: '#D45A7B',
                              background: 'rgba(212,90,123,0.1)',
                              padding: '2px 6px', borderRadius: '99px', whiteSpace: 'nowrap',
                            }}>
                              On you
                            </span>
                          )}
                        </div>
                        <p style={{
                          fontFamily: 'var(--font-sans)', fontSize: '12px',
                          color: 'var(--text-secondary)', margin: '0 0 6px', lineHeight: 1.5,
                        }}>
                          {f.why}
                        </p>
                        {f.blockedBy && (
                          <p style={{
                            fontFamily: 'var(--font-mono)', fontSize: '10px',
                            color: blockedOnYou ? '#D45A7B' : '#D4C45A', margin: 0, letterSpacing: '0.04em',
                          }}>
                            ⏸ {f.blockedBy}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            </div>
          </>
        )}

        {/* ── Tab: Path ─────────────────────────────────────── */}
        {tab === 'path' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {PHASES.map((phase, i) => {
              const meta = STATUS_COLOR[phase.status]
              return (
                <div key={phase.id} style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-base)',
                  borderLeft: `3px solid ${meta.color}`,
                  borderRadius: '8px',
                  padding: '16px 20px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <h3 style={{
                      fontFamily: 'var(--font-serif)', fontSize: '17px', fontWeight: 500,
                      color: 'var(--text-primary)', margin: 0,
                    }}>
                      <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '12px', marginRight: '10px' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {phase.label}
                    </h3>
                    <StatusPill meta={meta} />
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-sans)', fontSize: '13px',
                    color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0,
                  }}>
                    {phase.description}
                  </p>
                </div>
              )
            })}
          </div>
        )}

        {/* ── Tab: Log ──────────────────────────────────────── */}
        {tab === 'log' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {WINS.map((w, i) => (
              <div key={i} style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-base)',
                borderRadius: '6px',
                padding: '12px 16px',
                display: 'grid',
                gridTemplateColumns: '96px 1fr',
                gap: '14px',
                alignItems: 'baseline',
              }}>
                <p style={{
                  fontFamily: 'var(--font-mono)', fontSize: '11px',
                  color: 'var(--text-muted)', margin: 0, whiteSpace: 'nowrap',
                }}>
                  {w.date}
                </p>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500,
                    color: 'var(--text-primary)', margin: '0 0 2px',
                  }}>
                    {w.headline}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-sans)', fontSize: '12px',
                    color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5,
                  }}>
                    {w.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '10px',
          color: 'var(--text-muted)', marginTop: '40px', textAlign: 'center',
        }}>
          Live data: Supabase · Phase / milestone data: <code>lib/cofounder/data.ts</code> · Updated by the /cofounder skill
        </p>
      </div>
    </main>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em',
      textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 12px',
    }}>
      {children}
    </p>
  )
}

function StatusPill({ meta }: { meta: { label: string; color: string; bg: string } }) {
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.08em',
      textTransform: 'uppercase', color: meta.color, background: meta.bg,
      padding: '3px 8px', borderRadius: '99px', whiteSpace: 'nowrap',
    }}>
      {meta.label}
    </span>
  )
}

function PhaseBar({ phases }: { phases: Phase[] }) {
  return (
    <div>
      {/* Colored segment row */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${phases.length}, 1fr)`, gap: '4px', marginBottom: '8px' }}>
        {phases.map(p => {
          const meta = STATUS_COLOR[p.status]
          const isActive = p.status === 'active'
          return (
            <div key={p.id}
              title={`${p.label} — ${meta.label}`}
              style={{
                height: '8px',
                borderRadius: '99px',
                background: meta.color,
                opacity: p.status === 'shipped' ? 0.9 : p.status === 'active' ? 1 : p.status === 'next' ? 0.5 : 0.25,
                boxShadow: isActive ? `0 0 0 2px ${meta.bg}, 0 0 12px ${meta.color}55` : 'none',
                transition: 'all 200ms ease',
              }}
            />
          )
        })}
      </div>
      {/* Label row — short names, compact */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${phases.length}, 1fr)`, gap: '4px' }}>
        {phases.map(p => {
          const meta = STATUS_COLOR[p.status]
          const shortLabel = p.label.split(' ')[0] // first word — keeps labels short
          return (
            <p key={p.id}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.06em',
                textTransform: 'uppercase', color: meta.color, margin: 0,
                textAlign: 'center', opacity: 0.7,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}
              title={p.label}
            >
              {shortLabel}
            </p>
          )
        })}
      </div>
    </div>
  )
}

function StatsStrip({ stats }: { stats: Stats }) {
  type Card = { label: string; value: number | string; delta?: number }
  const cards: Card[] = [
    { label: 'Articles',       value: stats.articlesPublished, delta: stats.articlesThisWeek },
    { label: 'Glossary',       value: stats.glossaryTerms },
    { label: 'Subscribers',    value: stats.newsletterSubs, delta: stats.subsThisWeek },
    { label: 'Users',          value: stats.authUsers ?? '—' },
    { label: 'Path progress',  value: stats.progressRows },
    { label: 'Saves',          value: stats.favoritesRows },
  ]
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
      gap: '8px',
    }}>
      {cards.map(c => (
        <div key={c.label} style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-base)',
          borderRadius: '8px',
          padding: '14px 16px',
          position: 'relative',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 6px',
          }}>
            {c.label}
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <p style={{
              fontFamily: 'var(--font-serif)', fontSize: '26px', fontWeight: 500,
              color: 'var(--text-primary)', margin: 0, lineHeight: 1, letterSpacing: '-0.01em',
            }}>
              {typeof c.value === 'number' ? c.value.toLocaleString() : c.value}
            </p>
            {c.delta !== undefined && c.delta > 0 && (
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500,
                color: '#4CAF7D', margin: 0, letterSpacing: '0.02em',
              }}>
                +{c.delta} 7d
              </p>
            )}
            {c.delta !== undefined && c.delta === 0 && (
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px',
                color: 'var(--text-muted)', margin: 0, letterSpacing: '0.02em',
              }}>
                — 7d
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function MilestoneRow({ m, liveSubs }: { m: Milestone; liveSubs: number }) {
  const meta = STATUS_COLOR[m.status]

  let current = m.current
  if (m.id === 'newsletter-subs') current = liveSubs

  const hasProgress = current !== null && m.targetValue !== null
  const pct = hasProgress ? Math.min(100, Math.round((current! / m.targetValue!) * 100)) : null

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-base)',
      borderRadius: '8px',
      padding: '14px 16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', marginBottom: '4px' }}>
        <p style={{
          fontFamily: 'var(--font-serif)', fontSize: '15px', fontWeight: 500,
          color: 'var(--text-primary)', margin: 0,
        }}>
          {m.title}
        </p>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '11px',
          color: meta.color, whiteSpace: 'nowrap',
        }}>
          {hasProgress ? `${pct}%` : meta.label}
        </span>
      </div>

      {hasProgress && (
        <div style={{
          height: '4px', background: 'var(--bg-subtle)', borderRadius: '99px',
          overflow: 'hidden', marginBottom: '8px',
        }}>
          <div style={{
            height: '100%', width: `${pct}%`, background: meta.color,
            transition: 'width 300ms ease',
          }} />
        </div>
      )}

      <p style={{
        fontFamily: 'var(--font-sans)', fontSize: '12px',
        color: 'var(--text-muted)', margin: 0, lineHeight: 1.5,
      }}>
        {hasProgress && (
          <span style={{ color: 'var(--text-secondary)', marginRight: '8px' }}>
            {current!.toLocaleString()} / {m.targetValue!.toLocaleString()} {m.unit}
          </span>
        )}
        {m.unlocks}
      </p>
    </div>
  )
}
