import Link from 'next/link'
import NewsletterCTA from '@/components/NewsletterCTA'
import ArticleCard from '@/components/ArticleCard'
import GuidedStartTrigger from '@/components/GuidedStartTrigger'
import { CLUSTERS } from '@/lib/clusters'
import { getFeaturedArticles } from '@/lib/db'
import { createClient } from '@/lib/supabase/server'
import { ARTICLE_PATHS } from '@/lib/paths'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'AI Codex — Learn to operate with AI',
  description: 'The organizing layer for AI at work. Plain-English explanations, structured learning paths, and practical guides for operators.',
}

const ENTRY_POINTS = [
  {
    eyebrow: 'For individuals',
    title: 'Using Claude for your own work?',
    description: 'How to prompt well, what Claude is actually good at, the mistakes everyone makes first, and how to build a workflow that sticks. No technical background required.',
    cta: 'Start the path',
    href: '/learn/claude',
    accent: '#D4845A',
    accentBg: 'rgba(212,132,90,0.08)',
    icon: '◈',
    meta: '8 steps · ~40 min',
  },
  {
    eyebrow: 'For managers & department heads',
    title: 'Rolling out Claude to your team?',
    description: 'From deciding where to start, to setting up Projects and system prompts, to knowing whether the rollout is actually working. Works for any function.',
    cta: 'See the path',
    href: '/learn/for-your-team',
    accent: '#4CAF7D',
    accentBg: 'rgba(76,175,125,0.08)',
    icon: '⬡',
    meta: '8 steps · ~41 min',
  },
  {
    eyebrow: 'For IT & operations leads',
    title: 'Deploying Claude org-wide?',
    description: "Evaluation, plan selection, provisioning, governance, and ongoing management — three stages in the right order, for whoever's been handed this job.",
    cta: 'See the path',
    href: '/learn/claude-for-admins',
    accent: '#5B8DD9',
    accentBg: 'rgba(91,141,217,0.08)',
    icon: '◫',
    meta: '10 steps · ~57 min',
  },
  {
    eyebrow: 'For developers',
    title: 'Building with the API?',
    description: 'Implementation guides that assume you can code. API basics, RAG, evals, streaming, tool use, auth, rate limiting, and deployment. No business-case framing.',
    cta: 'Open the dev path',
    href: '/learn/developers',
    accent: '#7B8FD4',
    accentBg: 'rgba(123,143,212,0.08)',
    icon: '⌥',
    meta: '17 guides · ~121 min',
  },
  {
    eyebrow: 'For builders',
    title: 'Building an AI product?',
    description: 'Validate your idea, pick the right stack, avoid the failure modes that catch most AI founders off guard — and deploy it to real users. Written for solo builders.',
    cta: 'Start the path',
    href: '/learn/build-with-ai',
    accent: '#4CAF7D',
    accentBg: 'rgba(76,175,125,0.08)',
    icon: '◬',
    meta: '10 steps · ~64 min',
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
  {
    eyebrow: 'Free tools',
    title: 'Need to make a decision?',
    description: 'Cost calculator, system prompt builder, and AI maturity scorecard — interactive tools for the decisions operators and developers actually face.',
    cta: 'Open the tools',
    href: '/tools',
    accent: '#D4845A',
    accentBg: 'rgba(212,132,90,0.06)',
    icon: '◈',
    meta: '4 tools · free',
  },
  {
    eyebrow: 'Integrations',
    title: 'Which Claude integrations are worth it?',
    description: 'Every connector, skill, and platform integration explained plainly — what it does, how you\'d use it in a real workday, and whether it\'s worth the setup time.',
    cta: 'Browse integrations',
    href: '/integrations',
    accent: '#4CAF7D',
    accentBg: 'rgba(76,175,125,0.06)',
    icon: '◎',
    meta: '17 integrations',
  },
]

export default async function HomePage() {
  const [featuredArticles, supabase] = await Promise.all([
    getFeaturedArticles(3),
    createClient(),
  ])

  // Check if the user is logged in and has path progress
  const { data: { user } } = await supabase.auth.getUser()

  type ResumeInfo = {
    pathName: string
    pathHref: string
    stepNumber: number
    totalSteps: number
    accent: string
    nextSlug: string | null
  }
  let resumeInfo: ResumeInfo | null = null

  if (user) {
    const { data: progress } = await supabase
      .from('user_progress')
      .select('article_slug, read_at')
      .eq('user_id', user.id)
      .order('read_at', { ascending: false })
      .limit(60)

    if (progress?.length) {
      for (const row of progress) {
        const membership = ARTICLE_PATHS[row.article_slug]
        if (membership) {
          resumeInfo = {
            pathName: membership.pathName,
            pathHref: membership.pathHref,
            stepNumber: membership.stepNumber,
            totalSteps: membership.totalSteps,
            accent: membership.accent,
            nextSlug: membership.nextSlug,
          }
          break
        }
      }
    }
  }

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
          understand what you're working with, and actually ship something.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' as const }}>
          {resumeInfo ? (
            <Link
              href={resumeInfo.nextSlug ? `/articles/${resumeInfo.nextSlug}` : resumeInfo.pathHref}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: resumeInfo.accent,
                color: '#fff',
                textDecoration: 'none',
                padding: '14px 28px',
                borderRadius: '8px',
                fontFamily: 'var(--font-sans)',
                fontSize: '15px',
                fontWeight: 500,
              }}
            >
              Resume: {resumeInfo.pathName} · Step {resumeInfo.stepNumber} of {resumeInfo.totalSteps} →
            </Link>
          ) : (
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
          )}
          <GuidedStartTrigger variant="hero" />
        </div>
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }} className="entry-grid">
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

        {/* Guided start trigger */}
        <GuidedStartTrigger />
      </section>

      {/* ── Featured Articles ─────────────────────────────── */}
      {featuredArticles.length > 0 && (
        <section style={{ width: 'var(--container)', margin: '0 auto', paddingBottom: 'var(--section-y)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '28px' }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: '8px' }}>Worth reading</p>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', fontWeight: 600, color: 'var(--text-primary)' }}>
                Worth reading this week
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
        @media (max-width: 640px) {
          .entry-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          .entry-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 901px) and (max-width: 1280px) {
          .entry-grid { grid-template-columns: repeat(3, 1fr) !important; }
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
