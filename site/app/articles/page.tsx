import Link from 'next/link'
import type { Metadata } from 'next'
import ArticleRow from '@/components/ArticleRow'
import { getAllArticles } from '@/lib/db'
import type { Article } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Articles — AI Codex',
  description: 'Decision guides, failure patterns, and what implementing AI actually looks like. Written for operators, not engineers.',
}

// Pinned slugs — always surface these first
const PINNED = ['claude-operator-habits', 'running-your-first-ai-pilot']

export default async function ArticlesPage() {
  const articles = await getAllArticles()

  const bySlug = Object.fromEntries(articles.map(a => [a.slug, a]))

  const pinned   = PINNED.map(s => bySlug[s]).filter(Boolean) as Article[]
  const role     = articles.filter(a => a.angle === 'role'      && !PINNED.includes(a.slug))
  const failure  = articles.filter(a => a.angle === 'failure'   && !PINNED.includes(a.slug))
  const field    = articles.filter(a => a.angle === 'field-note'&& !PINNED.includes(a.slug))
  const concepts = articles.filter(a =>
    ['def', 'process', 'history', 'cross', 'absence'].includes(a.angle) && !PINNED.includes(a.slug)
  )

  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>

      {/* Header */}
      <div style={{ marginBottom: '64px' }}>
        <p className="eyebrow" style={{ marginBottom: '16px' }}>Articles</p>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-3xl)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: '16px',
            maxWidth: '18ch',
          }}
        >
          Practical AI for operators.
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-muted)', maxWidth: '52ch', lineHeight: 1.65 }}>
          Decision guides, failure patterns, and what implementing AI actually looks like.
          Written for people doing the work, not people writing about it.
        </p>
      </div>

      {articles.length === 0 && (
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-muted)' }}>
          Articles coming soon.
        </p>
      )}

      {/* Start here */}
      {pinned.length > 0 && (
        <Section
          label="Start here"
          description="If you're new to implementing AI at your company, read these first."
          accent="#D4845A"
          accentBg="rgba(212,132,90,0.1)"
        >
          {pinned.map(a => <ArticleRow key={a.slug} article={a} featured />)}
        </Section>
      )}

      {/* Making the call */}
      {role.length > 0 && (
        <Section
          label="Making the call"
          description="Decision guides for the questions that actually matter."
          accent="#5AAFD4"
          accentBg="rgba(90,175,212,0.1)"
        >
          {role.map(a => <ArticleRow key={a.slug} article={a} />)}
        </Section>
      )}

      {/* What goes wrong */}
      {failure.length > 0 && (
        <Section
          label="What goes wrong"
          description="The failure patterns that catch most teams off guard."
          accent="#D45A7B"
          accentBg="rgba(212,90,123,0.1)"
        >
          {failure.map(a => <ArticleRow key={a.slug} article={a} />)}
        </Section>
      )}

      {/* In practice */}
      {field.length > 0 && (
        <Section
          label="In practice"
          description="What it actually looks like when teams implement AI."
          accent="#4CAF7D"
          accentBg="rgba(76,175,125,0.1)"
        >
          {field.map(a => <ArticleRow key={a.slug} article={a} />)}
        </Section>
      )}

      {/* The concepts */}
      {concepts.length > 0 && (
        <Section
          label="The concepts"
          description="Clear explanations of the ideas behind the tools."
          accent="var(--text-muted)"
          accentBg="var(--bg-subtle)"
          muted
        >
          {concepts.map(a => <ArticleRow key={a.slug} article={a} />)}
        </Section>
      )}

    </div>
  )
}

function Section({
  label, description, accent, accentBg, muted = false, children,
}: {
  label: string
  description: string
  accent: string
  accentBg: string
  muted?: boolean
  children: React.ReactNode
}) {
  return (
    <section style={{ marginBottom: '72px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <span style={{
          padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 500,
          letterSpacing: '0.05em', textTransform: 'uppercase' as const,
          color: accent, background: accentBg, fontFamily: 'var(--font-sans)',
        }}>
          {label}
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
