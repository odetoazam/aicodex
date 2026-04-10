import Link from 'next/link'
import NewsletterCTA from '@/components/NewsletterCTA'
import ArticleCard from '@/components/ArticleCard'
import { CLUSTERS } from '@/lib/clusters'
import { getFeaturedArticles } from '@/lib/db'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'AI Codex — Learn to operate with AI',
  description: 'The organizing layer for AI at work. Plain-English explanations, structured learning paths, and practical guides for operators.',
}

const ENTRY_POINTS = [
  {
    eyebrow: 'Start here',
    title: 'Just getting started?',
    description: 'A guided path through everything you need to know to use Claude effectively — how it thinks, how to direct it, and when to trust it.',
    cta: 'Begin the learning path',
    href: '/learn/claude',
    accent: '#D4845A',
    accentBg: 'rgba(212,132,90,0.08)',
    icon: '◈',
    meta: '8 concepts · ~40 min',
  },
  {
    eyebrow: 'Going deeper',
    title: 'Already using AI at work?',
    description: 'Decision guides and failure patterns for operators past the basics — when to build vs. buy, what actually goes wrong, and what good looks like.',
    cta: 'Read the articles',
    href: '/articles',
    accent: '#5AAFD4',
    accentBg: 'rgba(90,175,212,0.08)',
    icon: '◐',
    meta: '20+ articles',
  },
  {
    eyebrow: 'Reference',
    title: 'Looking something up?',
    description: 'Every AI term defined in plain English — what it means, why it matters, and how it connects to everything else.',
    cta: 'Browse the glossary',
    href: '/glossary',
    accent: '#7B8FD4',
    accentBg: 'rgba(123,143,212,0.08)',
    icon: '◇',
    meta: '150+ terms',
  },
]

export default async function HomePage() {
  const featuredArticles = await getFeaturedArticles(3)

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        style={{
          width: 'var(--container)',
          margin: '0 auto',
          padding: 'clamp(72px, 12vw, 140px) 0 clamp(56px, 8vw, 96px)',
        }}
      >
        <p className="eyebrow" style={{ marginBottom: '20px' }}>AI Codex</p>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-4xl)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            maxWidth: '14ch',
            marginBottom: '24px',
          }}
        >
          Learn to operate{' '}
          <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>with</em> AI.
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-lg)',
            color: 'var(--text-muted)',
            maxWidth: '50ch',
            lineHeight: 1.65,
            marginBottom: '40px',
          }}
        >
          The plain-English layer on top of AI — so you can make confident decisions,
          understand what you're working with, and actually implement it at your company.
        </p>

        <Link
          href="/learn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--accent)',
            color: 'var(--text-inverse)',
            textDecoration: 'none',
            padding: '14px 28px',
            borderRadius: '8px',
            fontFamily: 'var(--font-sans)',
            fontSize: '15px',
            fontWeight: 500,
          }}
        >
          Start learning →
        </Link>
      </section>

      {/* ── Where do you want to start? ───────────────────── */}
      <section style={{ width: 'var(--container)', margin: '0 auto', paddingBottom: 'var(--section-y)' }}>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500,
          letterSpacing: '0.06em', textTransform: 'uppercase' as const,
          color: 'var(--text-muted)', marginBottom: '20px',
        }}>
          Where do you want to start?
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }} className="entry-grid">
          {ENTRY_POINTS.map(ep => (
            <Link
              key={ep.href}
              href={ep.href}
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <div
                style={{
                  padding: '24px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-base)',
                  borderTop: `3px solid ${ep.accent}`,
                  background: ep.accentBg,
                  height: '100%',
                  boxSizing: 'border-box' as const,
                  transition: 'border-color 150ms ease, background 150ms ease',
                }}
                className="entry-card"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <p style={{
                    fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500,
                    letterSpacing: '0.06em', textTransform: 'uppercase' as const,
                    color: ep.accent, margin: 0,
                  }}>
                    {ep.eyebrow}
                  </p>
                  <span style={{ fontSize: '18px', color: ep.accent, opacity: 0.7 }}>{ep.icon}</span>
                </div>

                <h2 style={{
                  fontFamily: 'var(--font-serif)', fontSize: 'var(--text-lg)', fontWeight: 600,
                  color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '10px',
                }}>
                  {ep.title}
                </h2>

                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)',
                  lineHeight: 1.6, margin: '0 0 16px',
                }}>
                  {ep.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: ep.accent, fontWeight: 500 }}>
                    {ep.cta} →
                  </span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    {ep.meta}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Articles ─────────────────────────────── */}
      {featuredArticles.length > 0 && (
        <section style={{ width: 'var(--container)', margin: '0 auto', paddingBottom: 'var(--section-y)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '28px' }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: '8px' }}>Worth reading</p>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', fontWeight: 600, color: 'var(--text-primary)' }}>
                For operators doing the work
              </h2>
            </div>
            <Link href="/articles" style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--accent)', textDecoration: 'none', whiteSpace: 'nowrap' as const }}>
              All articles →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
            {featuredArticles.map(article => <ArticleCard key={article.slug} article={article} />)}
          </div>
        </section>
      )}

      {/* ── Browse by topic ───────────────────────────────── */}
      <section style={{ width: 'var(--container)', margin: '0 auto', paddingBottom: 'var(--section-y)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500,
            letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--text-muted)',
          }}>
            Or browse by topic
          </p>
          <Link href="/glossary" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--accent)', textDecoration: 'none' }}>
            Full glossary →
          </Link>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {CLUSTERS.map(cluster => (
            <Link
              key={cluster.name}
              href={`/glossary?cluster=${encodeURIComponent(cluster.name)}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '6px',
                border: '1px solid var(--border-base)',
                background: 'var(--bg-surface)',
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                transition: 'border-color 150ms ease, color 150ms ease',
              }}
              className="cluster-pill"
            >
              <span style={{ color: cluster.color, fontSize: '12px' }}>{cluster.icon}</span>
              {cluster.name}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────── */}
      <section style={{ width: 'var(--container)', margin: '0 auto', paddingBottom: 'var(--section-y)' }}>
        <NewsletterCTA variant="section" />
      </section>

      <style>{`
        @media (max-width: 768px) {
          .entry-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .entry-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        .entry-card:hover {
          background: var(--bg-surface) !important;
        }
        .cluster-pill:hover {
          border-color: var(--border-base) !important;
          color: var(--text-primary) !important;
        }
      `}</style>
    </div>
  )
}
