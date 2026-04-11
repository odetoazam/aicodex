'use client'

import { useState } from 'react'
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
  'chatbot-with-persistent-memory',
  'deploying-claude-app-production',
  'claude-production-error-handling',
  'nextjs-chatbot-claude-full-tutorial',
  'rate-limiting-claude-api',
  'nextauth-claude-integration',
  'supabase-conversation-history',
  'claude-vs-custom-model',
  'claude-plus-linear',
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
])

const AGENCIES_SLUGS = new Set([
  'claude-for-agencies',
  'client-handoff-with-claude',
  'building-claude-powered-deliverable',
  'what-to-tell-clients-about-ai',
])

// Pinned for each persona view
const PINNED_ALL       = ['how-to-write-a-good-prompt', 'claude-common-mistakes', 'claude-operator-habits', 'running-your-first-ai-pilot', 'your-first-claude-api-call']
const PINNED_OPERATOR  = ['claude-plus-slack-for-teams', 'claude-plus-zapier', 'claude-common-mistakes', 'how-to-write-a-good-prompt', 'running-your-first-ai-pilot']
const PINNED_FOUNDER   = ['solo-founder-operating-system', 'validating-startup-idea-with-claude', 'ai-product-failure-modes-founders', 'first-ten-customers-ai-product']
const PINNED_DEV       = ['your-first-claude-api-call', 'building-a-rag-pipeline-from-scratch', 'prompt-caching-implementation', 'claude-cost-optimization']
const PINNED_PROD      = ['claude-plus-notion', 'claude-plus-airtable', 'claude-plus-figma', 'claude-for-writing-and-editing']
const PINNED_AGENCIES  = ['claude-for-agencies', 'what-to-tell-clients-about-ai', 'client-handoff-with-claude', 'building-claude-powered-deliverable']

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

export default function ArticlesFilteredView({ articles }: { articles: Article[] }) {
  const [active, setActive] = useState<Tab>('all')

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

  return (
    <div>
      {/* ── Filter tabs ─────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{
          display: 'flex', gap: '6px', flexWrap: 'wrap' as const,
          borderBottom: '1px solid var(--border-muted)', paddingBottom: '1px',
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
                  transition: 'color 0.15s, border-color 0.15s',
                  letterSpacing: t.id === 'developer' ? '0.02em' : undefined,
                }}
              >
                {t.id === 'developer' ? '{ dev }' : t.label}
              </button>
            )
          })}
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
