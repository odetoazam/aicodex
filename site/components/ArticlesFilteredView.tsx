'use client'

import { useState } from 'react'
import Link from 'next/link'
import ArticleRow from '@/components/ArticleRow'
import type { Article } from '@/lib/types'

// ── Persona slug maps ────────────────────────────────────────────────────────

const DEV_SLUGS = new Set([
  'your-first-claude-api-call',
  'streaming-claude-responses-implementation',
  'building-a-rag-pipeline-from-scratch',
  'writing-evals-that-catch-regressions',
  'prompt-caching-implementation',
  'claude-cost-optimization',
  'tool-use-implementation-deep-dive',
  'multi-agent-orchestration-basics',
  'evaluating-multi-agent-systems',
  'chatbot-with-persistent-memory',
  'deploying-claude-app-production',
  'monitoring-your-claude-app',
  'claude-production-error-handling',
  'nextjs-chatbot-claude-full-tutorial',
  'rate-limiting-claude-api',
  'nextauth-claude-integration',
  'supabase-conversation-history',
  'claude-vs-custom-model',
  'claude-plus-linear',
  'claude-plus-jira',
  'claude-code-project-setup',
  'claude-code-vs-web-app',
  'ai-agent-harness-explained',
  'claude-advisor-tool',
  'claude-managed-agents',
  'claude-plus-confluence',
  'securing-your-claude-app',
  'claude-streaming-decision',
  'multi-agent-failure-handling',
  'auditing-your-eval-suite',
  'ant-cli',
])

const FOUNDER_SLUGS = new Set([
  'solo-founder-operating-system',
  'validating-startup-idea-with-claude',
  'build-buy-prompt-early-stage',
  'ai-product-failure-modes-founders',
  'pitching-ai-product-to-investors',
  'pricing-your-ai-product',
  'first-ten-customers-ai-product',
  'customer-discovery-with-claude',
  'what-to-build-with-claude',
  'founder-ai-workflow',
  'solo-founder-project-setup',
])

const PRODUCTIVITY_SLUGS = new Set([
  'managing-email-with-claude',
  'weekly-review-with-claude',
  'meeting-prep-with-claude',
  'note-taking-knowledge-management-claude',
  'claude-for-writing-and-editing',
  'using-claude-for-research',
  'claude-plus-notion',
  'claude-plus-google-sheets',
  'claude-plus-google-docs',
  'claude-plus-airtable',
  'claude-plus-asana',
  'claude-plus-figma',
  'claude-plus-webflow',
  'claude-plus-intercom',
  'claude-plus-confluence',
  'claude-for-word',
])

const AGENCIES_SLUGS = new Set([
  'claude-for-agencies',
  'client-handoff-with-claude',
  'building-claude-powered-deliverable',
  'what-to-tell-clients-about-ai',
  'claude-code-client-setup',
  'pricing-claude-consulting-work',
])

// Pinned for each persona view
const PINNED_ALL       = ['new-to-ai-start-here', 'what-to-share-with-claude', 'how-to-write-a-good-prompt', 'claude-common-mistakes', 'claude-code-vs-web-app', 'claude-operator-habits', 'running-your-first-ai-pilot', 'your-first-claude-api-call', 'building-a-business-case-for-claude']
const PINNED_OPERATOR  = ['what-to-share-with-claude', 'how-to-convince-skeptical-teammate', 'first-week-with-claude', 'after-your-manager-approves-claude', 'building-a-business-case-for-claude', 'getting-it-approval-for-claude', 'setting-up-claude-for-your-team', 'ai-usage-policy-template', 'why-claude-feels-inconsistent', 'measuring-ai-roi', 'claude-adoption-plateau', 'cs-manager-ai-workflow', 'ops-manager-ai-workflow']
const PINNED_FOUNDER   = ['founder-ai-workflow', 'solo-founder-project-setup', 'solo-founder-operating-system', 'validating-startup-idea-with-claude']
const PINNED_DEV       = ['your-first-claude-api-call', 'securing-your-claude-app', 'building-a-rag-pipeline-from-scratch', 'auditing-your-eval-suite', 'prompt-caching-implementation']
const PINNED_PROD      = ['claude-plus-notion', 'claude-plus-airtable', 'claude-plus-figma', 'claude-for-writing-and-editing']
const PINNED_AGENCIES  = ['claude-for-agencies', 'pricing-claude-consulting-work', 'what-to-tell-clients-about-ai', 'claude-code-client-setup', 'client-handoff-with-claude']

type Tab = 'all' | 'operator' | 'founder' | 'developer' | 'productivity' | 'agencies'

const TABS: { id: Tab; label: string; description: string }[] = [
  { id: 'all',          label: 'All',          description: 'Everything published, by type.' },
  { id: 'operator',     label: 'Operators',    description: 'For team leads, admins, and anyone rolling out AI at work.' },
  { id: 'founder',      label: 'Founders',     description: 'For solo builders, early-stage startups, and zero-person product teams.' },
  { id: 'developer',    label: 'Developers',   description: 'Implementation guides. Assumes you can code — focused on production quality.' },
  { id: 'productivity', label: 'Productivity', description: 'Personal workflows: email, meetings, notes, and your weekly brain dump.' },
  { id: 'agencies',     label: 'Agencies',     description: 'Using Claude for client work — deliverables, handoffs, and what to tell clients about AI.' },
]

function persona(a: Article): Tab {
  if (DEV_SLUGS.has(a.slug))          return 'developer'
  if (FOUNDER_SLUGS.has(a.slug))      return 'founder'
  if (PRODUCTIVITY_SLUGS.has(a.slug)) return 'productivity'
  if (AGENCIES_SLUGS.has(a.slug))     return 'agencies'
  return 'operator'
}

const ANGLE_LABEL: Record<string, string> = {
  def: 'Concept', process: 'How it works', failure: 'What goes wrong',
  role: 'Decision guide', 'field-note': 'In practice',
  cross: 'Cross-concept', absence: "What's missing", history: 'History',
}

export default function ArticlesFilteredView({ articles }: { articles: Article[] }) {
  const [active, setActive] = useState<Tab>('all')
  const [query, setQuery] = useState('')

  const bySlug = Object.fromEntries(articles.map(a => [a.slug, a]))
  const tab = TABS.find(t => t.id === active)!

  // ── Compute visible articles for current tab ─────────────────────────────

  let pinnedSlugs: string[]
  let pool: Article[]

  if (active === 'all') {
    pinnedSlugs = PINNED_ALL
    pool = articles
  } else if (active === 'developer') {
    pinnedSlugs = PINNED_DEV
    pool = articles.filter(a => persona(a) === 'developer')
  } else if (active === 'founder') {
    pinnedSlugs = PINNED_FOUNDER
    pool = articles.filter(a => persona(a) === 'founder')
  } else if (active === 'productivity') {
    pinnedSlugs = PINNED_PROD
    pool = articles.filter(a => persona(a) === 'productivity')
  } else if (active === 'agencies') {
    pinnedSlugs = PINNED_AGENCIES
    pool = articles.filter(a => persona(a) === 'agencies')
  } else {
    // operator
    pinnedSlugs = PINNED_OPERATOR
    pool = articles.filter(a => persona(a) === 'operator')
  }

  const pinnedSet  = new Set(pinnedSlugs)
  const pinned     = pinnedSlugs.map(s => bySlug[s]).filter(Boolean) as Article[]
  const remaining  = pool.filter(a => !pinnedSet.has(a.slug))

  // ── Sub-sections for "all" view ──────────────────────────────────────────
  const devArticles  = active === 'all' ? Array.from(DEV_SLUGS).map(s => bySlug[s]).filter(Boolean) as Article[] : []
  const excluded     = active === 'all' ? new Set([...PINNED_ALL, ...Array.from(DEV_SLUGS)]) : pinnedSet
  const role         = active === 'all' ? articles.filter(a => a.angle === 'role'       && !excluded.has(a.slug) && persona(a) === 'operator') : []
  const failure      = active === 'all' ? articles.filter(a => a.angle === 'failure'    && !excluded.has(a.slug)) : []
  const field        = active === 'all' ? articles.filter(a => a.angle === 'field-note' && !excluded.has(a.slug)) : []
  const concepts     = active === 'all' ? articles.filter(a =>
    ['def', 'process', 'history', 'cross', 'absence'].includes(a.angle) && !excluded.has(a.slug) && persona(a) === 'operator'
  ) : []

  // ── For non-all tabs: sub-section by angle ───────────────────────────────
  const guides      = active !== 'all' ? remaining.filter(a => ['process', 'role'].includes(a.angle))       : []
  const problems    = active !== 'all' ? remaining.filter(a => a.angle === 'failure')                        : []
  const conceptsTab = active !== 'all' ? remaining.filter(a => ['def', 'cross', 'history', 'absence'].includes(a.angle)) : []

  // ── Search ────────────────────────────────────────────────────────────────
  const q = query.trim().toLowerCase()
  const searchResults = q.length >= 2
    ? articles.filter(a =>
        a.title.toLowerCase().includes(q) ||
        (a.excerpt ?? '').toLowerCase().includes(q) ||
        a.slug.replace(/-/g, ' ').includes(q) ||
        a.cluster.toLowerCase().includes(q)
      )
    : []

  return (
    <div>
      {/* ── Search ──────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '32px', position: 'relative', maxWidth: '480px' }}>
        <input
          type="search"
          placeholder="Search 148 articles…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            width: '100%',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-base)',
            borderRadius: '8px',
            padding: '11px 40px 11px 16px',
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            color: 'var(--text-primary)',
            outline: 'none',
            boxSizing: 'border-box' as const,
          }}
          onFocus={e => { e.target.style.borderColor = 'rgba(212,132,90,0.5)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--border-base)' }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            style={{
              position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', fontSize: '16px', lineHeight: 1, padding: '2px',
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* ── Search results ───────────────────────────────────────────────── */}
      {q.length >= 2 ? (
        <div>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '13px',
            color: 'var(--text-muted)', marginBottom: '24px',
          }}>
            {searchResults.length === 0
              ? `No articles found for "${query}"`
              : `${searchResults.length} article${searchResults.length === 1 ? '' : 's'} matching "${query}"`
            }
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {searchResults.map(a => (
              <div key={a.slug} style={{ position: 'relative' }}>
                <ArticleRow article={a} />
                <span style={{
                  position: 'absolute', top: '18px', right: '48px',
                  fontFamily: 'var(--font-sans)', fontSize: '11px',
                  color: 'var(--text-muted)',
                  background: 'var(--bg-subtle)',
                  padding: '2px 7px', borderRadius: '4px',
                }}>
                  {ANGLE_LABEL[a.angle] ?? a.angle}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
      {/* ── Filter tabs ─────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '48px' }}>
        {/* Scroll wrapper — horizontal scroll on mobile, no scrollbar shown */}
        <div
          className="tabs-scroll"
          style={{
            overflowX: 'auto' as const,
            WebkitOverflowScrolling: 'touch' as const,
            borderBottom: '1px solid var(--border-muted)',
            paddingBottom: '1px',
          }}
        >
          <div style={{
            display: 'flex', gap: '4px', flexWrap: 'nowrap' as const,
            minWidth: 'max-content',
          }}>
            {TABS.map(t => {
              const isActive = t.id === active
              return (
                <button
                  key={t.id}
                  onClick={() => setActive(t.id)}
                  style={{
                    fontFamily: t.id === 'developer' ? 'var(--font-mono)' : 'var(--font-sans)',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                    background: 'none',
                    border: 'none',
                    borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                    marginBottom: '-1px',
                    padding: '8px 14px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap' as const,
                    transition: 'color 0.15s, border-color 0.15s',
                    letterSpacing: t.id === 'developer' ? '0.02em' : undefined,
                  }}
                >
                  {t.id === 'developer' ? '{ dev }' : t.label}
                </button>
              )
            })}
          </div>
        </div>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: '13px',
          color: 'var(--text-muted)', marginTop: '12px', lineHeight: 1.5,
        }}>
          {tab.description}
        </p>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}

      {active === 'all' ? (
        <>
          {pinned.length > 0 && (
            <Section label="Start here" description="If you're new, read these first." accent="#D4845A" accentBg="rgba(212,132,90,0.1)">
              {pinned.map(a => <ArticleRow key={a.slug} article={a} featured />)}
            </Section>
          )}
          <SeriesBanner />
          {devArticles.length > 0 && (
            <Section label="for developers" description="Implementation guides. Production-focused, code included." accent="#7B8FD4" accentBg="rgba(123,143,212,0.1)" mono>
              {devArticles.map(a => <ArticleRow key={a.slug} article={a} />)}
            </Section>
          )}
          {role.length > 0 && (
            <Section label="Making the call" description="Decision guides for the questions that actually matter." accent="#5AAFD4" accentBg="rgba(90,175,212,0.1)">
              {role.map(a => <ArticleRow key={a.slug} article={a} />)}
            </Section>
          )}
          {failure.length > 0 && (
            <Section label="What goes wrong" description="The failure patterns that catch most teams off guard." accent="#D45A7B" accentBg="rgba(212,90,123,0.1)">
              {failure.map(a => <ArticleRow key={a.slug} article={a} />)}
            </Section>
          )}
          {field.length > 0 && (
            <Section label="In practice" description="What it actually looks like when teams implement AI." accent="#4CAF7D" accentBg="rgba(76,175,125,0.1)">
              {field.map(a => <ArticleRow key={a.slug} article={a} />)}
            </Section>
          )}
          {concepts.length > 0 && (
            <Section label="The concepts" description="Clear explanations of the ideas behind the tools." accent="var(--text-muted)" accentBg="var(--bg-subtle)" muted>
              {concepts.map(a => <ArticleRow key={a.slug} article={a} />)}
            </Section>
          )}
        </>
      ) : (
        <>
          {pinned.length > 0 && (
            <Section
              label={active === 'developer' ? 'start here' : 'Start here'}
              description={
                active === 'developer'    ? 'The fundamentals before you go deeper.' :
                active === 'founder'      ? 'The questions every early-stage builder hits first.' :
                active === 'productivity' ? 'The workflows that actually stick.' :
                active === 'agencies'     ? 'Start with these — they cover the full picture of using Claude for client work.' :
                'If you\'re new to implementing AI at your company, read these first.'
              }
              accent={
                active === 'developer'    ? '#7B8FD4' :
                active === 'founder'      ? '#4CAF7D' :
                active === 'productivity' ? '#D4845A' :
                active === 'agencies'     ? '#D4A45A' :
                '#D4845A'
              }
              accentBg={
                active === 'developer'    ? 'rgba(123,143,212,0.1)' :
                active === 'founder'      ? 'rgba(76,175,125,0.1)' :
                active === 'productivity' ? 'rgba(212,132,90,0.1)' :
                active === 'agencies'     ? 'rgba(212,164,90,0.1)' :
                'rgba(212,132,90,0.1)'
              }
              mono={active === 'developer'}
            >
              {pinned.map(a => <ArticleRow key={a.slug} article={a} featured />)}
            </Section>
          )}
          {active === 'productivity' && <SeriesBanner />}
          {guides.length > 0 && (
            <Section
              label={active === 'developer' ? 'implementation guides' : 'Guides'}
              description={active === 'developer' ? 'Patterns for production systems.' : 'How-to guides and implementation patterns.'}
              accent={active === 'developer' ? '#7B8FD4' : active === 'founder' ? '#4CAF7D' : '#5AAFD4'}
              accentBg={active === 'developer' ? 'rgba(123,143,212,0.1)' : active === 'founder' ? 'rgba(76,175,125,0.1)' : 'rgba(90,175,212,0.1)'}
              mono={active === 'developer'}
            >
              {guides.map(a => <ArticleRow key={a.slug} article={a} />)}
            </Section>
          )}
          {problems.length > 0 && (
            <Section label="What goes wrong" description="The failure patterns worth knowing before they hit you." accent="#D45A7B" accentBg="rgba(212,90,123,0.1)">
              {problems.map(a => <ArticleRow key={a.slug} article={a} />)}
            </Section>
          )}
          {conceptsTab.length > 0 && (
            <Section label="The concepts" description="Deeper context on the ideas behind the tools." accent="var(--text-muted)" accentBg="var(--bg-subtle)" muted>
              {conceptsTab.map(a => <ArticleRow key={a.slug} article={a} />)}
            </Section>
          )}
        </>
      )}
        </>
      )}
      <style>{`
        .tabs-scroll { scrollbar-width: none; }
        .tabs-scroll::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}

function SeriesBanner() {
  return (
    <div style={{ marginBottom: '56px' }}>
      <Link
        href="/articles/claude-plus"
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <div style={{
          padding: '20px 24px',
          borderRadius: '10px',
          border: '1px solid var(--border-base)',
          borderLeft: '3px solid #D4845A',
          background: 'rgba(212,132,90,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap' as const,
          transition: 'border-color 150ms ease',
        }}
          className="series-banner"
        >
          <div>
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.06em', textTransform: 'uppercase' as const,
              color: '#D4845A', margin: '0 0 6px',
            }}>
              Series
            </p>
            <p style={{
              fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: 600,
              color: 'var(--text-primary)', margin: '0 0 4px', lineHeight: 1.3,
            }}>
              Claude + Tool guides
            </p>
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '13px',
              color: 'var(--text-muted)', margin: 0,
            }}>
              Using Claude alongside Notion, Slack, HubSpot, Jira, Confluence, Salesforce, and more.
            </p>
          </div>
          <span style={{
            fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500,
            color: '#D4845A', whiteSpace: 'nowrap' as const,
          }}>
            See all 15 guides →
          </span>
        </div>
      </Link>
      <style>{`.series-banner:hover { border-color: rgba(212,132,90,0.4) !important; }`}</style>
    </div>
  )
}

function Section({
  label, description, accent, accentBg, muted = false, mono = false, children,
}: {
  label: string
  description: string
  accent: string
  accentBg: string
  muted?: boolean
  mono?: boolean
  children: React.ReactNode
}) {
  return (
    <section style={{ marginBottom: '72px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <span style={{
          padding: '3px 10px', borderRadius: '4px', fontSize: '11px',
          fontWeight: mono ? 600 : 500,
          letterSpacing: mono ? '0.04em' : '0.05em',
          textTransform: mono ? undefined : 'uppercase' as const,
          color: accent, background: accentBg,
          fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
        }}>
          {mono ? `// ${label}` : label}
        </span>
      </div>
      <p style={{
        fontFamily: 'var(--font-sans)', fontSize: '13px',
        color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.5,
      }}>
        {description}
      </p>
      <div style={{
        borderLeft: muted ? '1px solid var(--border-muted)' : `2px solid ${accentBg}`,
        paddingLeft: '0',
        display: 'flex', flexDirection: 'column', gap: '2px',
      }}>
        {children}
      </div>
    </section>
  )
}
