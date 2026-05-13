'use client'

import { useState } from 'react'
import type { TimelineEvent, TimelineOrg, TimelineAudience } from '@/lib/types'

const AUDIENCE_META: Record<TimelineAudience, { label: string; color: string }> = {
  'for-you':      { label: 'For you',      color: '#5DA698' },
  'for-admins':   { label: 'For admins',   color: '#D4845A' },
  'for-builders': { label: 'For builders', color: '#7A5AD4' },
}

const ORG_COLORS: Record<TimelineOrg, string> = {
  Anthropic: '#D4845A',
  OpenAI:    '#10A37F',
  Google:    '#4285F4',
  Meta:      '#0467DF',
  Microsoft: '#00A4EF',
  Industry:  '#7B8FD4',
}

const SIGNIFICANCE_LABEL: Record<TimelineEvent['significance'], string> = {
  major:   'Major launch',
  notable: 'Notable',
  context: 'Context',
}

const ALL_ORGS: TimelineOrg[] = ['Anthropic', 'OpenAI', 'Google', 'Meta', 'Microsoft', 'Industry']

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function TimelineView({ events }: { events: TimelineEvent[] }) {
  const [activeOrg, setActiveOrg] = useState<TimelineOrg | 'All'>('All')

  const filtered = activeOrg === 'All' ? events : events.filter(e => e.org === activeOrg)

  // Group by year (newest first within each group — already sorted by event_date desc from DB)
  const byYear: Record<string, TimelineEvent[]> = {}
  filtered.forEach(e => {
    const year = e.event_date.split('-')[0]
    if (!byYear[year]) byYear[year] = []
    byYear[year].push(e)
  })

  return (
    <>
      {/* Org filter */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const, borderBottom: '1px solid var(--border-muted)', paddingBottom: '1px', marginBottom: '12px' }}>
          {(['All', ...ALL_ORGS] as (TimelineOrg | 'All')[]).map(org => {
            const isActive = org === activeOrg
            const color = org === 'All' ? 'var(--text-muted)' : ORG_COLORS[org as TimelineOrg]
            return (
              <button
                key={org}
                onClick={() => setActiveOrg(org)}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? (org === 'All' ? 'var(--text-primary)' : color) : 'var(--text-muted)',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? `2px solid ${org === 'All' ? 'var(--accent)' : color}` : '2px solid transparent',
                  marginBottom: '-1px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  transition: 'color 0.15s, border-color 0.15s',
                }}
              >
                {org}
              </button>
            )
          })}
        </div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)' }}>
          {filtered.length} events{activeOrg !== 'All' ? ` · ${activeOrg} only` : ''}
        </p>
      </div>

      {/* Timeline by year — newest first */}
      {Object.entries(byYear).sort(([a], [b]) => Number(b) - Number(a)).map(([year, yearEvents]) => (
        <div key={year} style={{ marginBottom: '56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--text-primary)' }}>
              {year}
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-base)' }} />
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', left: '19px', top: '24px', bottom: '24px',
              width: '1px', background: 'var(--border-muted)',
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {yearEvents.map((event, i) => {
                const orgColor = ORG_COLORS[event.org]
                return (
                  <div key={event.id} style={{ paddingLeft: '52px', paddingBottom: i === yearEvents.length - 1 ? '0' : '4px' }}>
                    <div style={{
                      position: 'relative',
                      padding: '18px 22px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-base)',
                      background: 'var(--bg-surface)',
                      borderLeft: event.significance === 'major' ? `3px solid ${orgColor}` : '1px solid var(--border-base)',
                      opacity: event.significance === 'context' ? 0.75 : 1,
                    }}>
                      {/* Dot */}
                      <div style={{
                        position: 'absolute',
                        left: event.significance === 'major' ? '-34px' : '-32px',
                        top: '20px',
                        width: event.significance === 'major' ? '12px' : '8px',
                        height: event.significance === 'major' ? '12px' : '8px',
                        borderRadius: '50%',
                        background: orgColor,
                        border: '2px solid var(--bg-base)',
                      }} />

                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' as const }}>
                          <span style={{
                            padding: '2px 8px', borderRadius: '4px',
                            fontSize: '11px', fontWeight: 600,
                            fontFamily: 'var(--font-sans)',
                            color: orgColor, background: `${orgColor}15`,
                            whiteSpace: 'nowrap' as const,
                          }}>
                            {event.org}
                          </span>
                          {event.significance === 'major' && (
                            <span style={{
                              padding: '2px 8px', borderRadius: '4px',
                              fontSize: '10px', fontWeight: 500,
                              fontFamily: 'var(--font-sans)',
                              color: 'var(--text-muted)', background: 'var(--bg-subtle)',
                              border: '1px solid var(--border-muted)',
                              textTransform: 'uppercase' as const, letterSpacing: '0.04em',
                            }}>
                              {SIGNIFICANCE_LABEL[event.significance]}
                            </span>
                          )}
                          {event.audience?.map(aud => (
                            <span key={aud} style={{
                              padding: '2px 8px', borderRadius: '4px',
                              fontSize: '10px', fontWeight: 500,
                              fontFamily: 'var(--font-sans)',
                              color: AUDIENCE_META[aud].color,
                              background: `${AUDIENCE_META[aud].color}15`,
                              whiteSpace: 'nowrap' as const,
                            }}>
                              {AUDIENCE_META[aud].label}
                            </span>
                          ))}
                          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>
                            {event.title}
                          </p>
                        </div>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0, paddingTop: '2px', whiteSpace: 'nowrap' as const }}>
                          {formatDate(event.event_date)}
                        </span>
                      </div>

                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                        {event.description}
                      </p>

                      {(event.href || event.glossary_slug || event.article_slug) && (
                        <div style={{ marginTop: '10px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                          {event.article_slug && (
                            <a href={`/articles/${event.article_slug}`} style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--accent)', fontWeight: 500, textDecoration: 'none' }}>
                              Read the guide →
                            </a>
                          )}
                          {event.href && (
                            <a href={event.href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: event.article_slug ? 'var(--text-muted)' : 'var(--accent)', textDecoration: 'none' }}>
                              Read announcement →
                            </a>
                          )}
                          {event.glossary_slug && (
                            <a href={`/glossary/${event.glossary_slug}`} style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'none' }}>
                              Glossary entry →
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ))}

      {/* Footer note */}
      <div style={{ padding: '24px 28px', borderRadius: '10px', border: '1px solid var(--border-muted)', background: 'var(--bg-surface)' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
          This timeline covers launches relevant to operators, founders, and teams building with AI — not an exhaustive record of every model release or research paper. Focus is on things that changed what was practically possible. Updated as things ship.
        </p>
      </div>
    </>
  )
}
