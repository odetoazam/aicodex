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
  title: 'AI Codex — The practitioner\'s guide to AI deployment',
  description: 'Free guides for Forward Deployed Engineers and Agent Operators — the two roles defining enterprise AI. Technical playbooks, career paths, and the operational detail that vendor docs skip.',
}

// Four primary intent buckets — each may have 1 or 2 specific paths
const PRIMARY_PATHS = [
  {
    id: 'fde-operator',
    title: 'Deploying AI for companies?',
    description: 'Two roles are defining enterprise AI right now. Agent Operators run AI systems inside their own company. Forward Deployed Engineers build them for clients. Technical guides and career paths for both.',
    accent: '#4A7BA7',
    accentBg: 'rgba(74,123,167,0.07)',
    paths: [
      { cta: 'Agent Operator guide', href: '/articles/what-is-an-agent-operator', meta: '8 guides' },
      { cta: 'FDE career path', href: '/articles/what-is-a-forward-deployed-engineer', meta: '4 guides' },
    ],
  },
  {
    id: 'individual',
    title: 'Using Claude at work?',
    description: 'Better prompting, workflows that stick, and the habits that separate people who get consistent value from Claude from those who don\'t.',
    accent: '#D4845A',
    accentBg: 'rgba(212,132,90,0.07)',
    paths: [
      { cta: 'Start the path', href: '/learn/claude', meta: '8 steps · ~40 min' },
    ],
  },
  {
    id: 'builder',
    title: 'Building with Claude?',
    description: 'From your first API call to production deployment. Or from a product idea to real users — two paths depending on whether you\'re a developer or a founder.',
    accent: '#7B8FD4',
    accentBg: 'rgba(123,143,212,0.07)',
    paths: [
      { cta: 'Developer path', href: '/learn/developers', meta: '20 guides · ~144 min' },
      { cta: 'Founder / builder path', href: '/learn/build-with-ai', meta: '10 steps · ~64 min' },
    ],
  },
  {
    id: 'team',
    title: 'Rolling out to your team?',
    description: 'Whether you\'re a team lead doing a department rollout or IT handling org-wide deployment — structured paths with the decisions you need to make, in order.',
    accent: '#4CAF7D',
    accentBg: 'rgba(76,175,125,0.07)',
    paths: [
      { cta: 'Team lead path', href: '/learn/for-your-team', meta: '8 steps · ~41 min' },
      { cta: 'IT / admin path', href: '/learn/claude-for-admins', meta: '15 steps · ~85 min' },
    ],
  },
]

// Lightweight secondary destinations below the fold
const SECONDARY_LINKS = [
  {
    label: 'Glossary',
    sub: '150+ AI terms in plain English',
    href: '/glossary',
    accent: '#7B8FD4',
    cta: 'Browse →',
  },
  {
    label: 'Free tools',
    sub: 'Cost calculator, system prompt builder, AI maturity scorecard',
    href: '/tools',
    accent: '#D4845A',
    cta: 'Open →',
  },
]

export default async function HomePage() {
  const [featuredArticlesRaw, supabase] = await Promise.all([
    getFeaturedArticles(4),
    createClient(),
  ])
  const featuredArticles = featuredArticlesRaw.filter(
    a => a.slug !== 'ai-impact-on-knowledge-work'
  ).slice(0, 3)

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
            maxWidth: '16ch',
            marginBottom: '24px',
          }}
        >
          The practitioner&apos;s guide to{' '}
          <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>deploying</em> AI.
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-lg)',
            color: 'var(--text-muted)',
            maxWidth: '52ch',
            lineHeight: 1.65,
            marginBottom: '40px',
          }}
        >
          Forward Deployed Engineers build AI systems inside companies.
          Agent Operators run them. Both roles are exploding — and neither
          has a good free resource yet. This is it.
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

      {/* ── What are you here to do? ──────────────────────── */}
      <section style={{ width: 'var(--container)', margin: '0 auto', paddingBottom: 'var(--section-y)' }}>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500,
          letterSpacing: '0.06em', textTransform: 'uppercase' as const,
          color: 'var(--text-muted)', marginBottom: '20px',
        }}>
          Where do you want to start?
        </p>

        {/* 4 primary intent cards — 2x2 grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }} className="entry-grid">
          {PRIMARY_PATHS.map(pp => (
            <div
              key={pp.id}
              style={{
                padding: '28px 26px',
                borderRadius: '10px',
                border: '1px solid var(--border-base)',
                borderTop: `3px solid ${pp.accent}`,
                background: pp.accentBg,
                boxSizing: 'border-box' as const,
                display: 'flex',
                flexDirection: 'column' as const,
              }}
            >
              <h2 style={{
                fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', fontWeight: 600,
                color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '12px',
              }}>
                {pp.title}
              </h2>

              <p style={{
                fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)',
                lineHeight: 1.65, margin: '0 0 24px', flex: 1,
              }}>
                {pp.description}
              </p>

              {/* One or two path CTAs */}
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
                {pp.paths.map(path => (
                  <Link
                    key={path.href}
                    href={path.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 16px',
                      borderRadius: '7px',
                      border: `1.5px solid ${pp.accent}`,
                      background: 'var(--bg-surface)',
                      textDecoration: 'none',
                      transition: 'background 150ms ease',
                    }}
                    className="path-link"
                  >
                    <span style={{
                      fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500,
                      color: pp.accent,
                    }}>
                      {path.cta} →
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-sans)', fontSize: '11px',
                      color: 'var(--text-muted)',
                    }}>
                      {path.meta}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Prominent guided start strip */}
        <GuidedStartTrigger variant="strip" />

        {/* Secondary: glossary + tools */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '12px' }} className="secondary-grid">
          {SECONDARY_LINKS.map(sl => (
            <Link
              key={sl.href}
              href={sl.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderRadius: '8px',
                border: '1px solid var(--border-base)',
                background: 'var(--bg-surface)',
                textDecoration: 'none',
                transition: 'border-color 150ms ease',
              }}
              className="secondary-link"
            >
              <div>
                <span style={{
                  fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500,
                  color: 'var(--text-primary)', display: 'block', marginBottom: '2px',
                }}>
                  {sl.label}
                </span>
                <span style={{
                  fontFamily: 'var(--font-sans)', fontSize: '13px',
                  color: 'var(--text-muted)',
                }}>
                  {sl.sub}
                </span>
              </div>
              <span style={{
                fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500,
                color: sl.accent, whiteSpace: 'nowrap' as const,
              }}>
                {sl.cta}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FDE + Agent Operator callout ─────────────────── */}
      <section style={{ width: 'var(--container)', margin: '0 auto', paddingBottom: 'var(--section-y)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="callout-grid">
          <Link
            href="/articles/what-is-a-forward-deployed-engineer"
            style={{
              display: 'flex',
              flexDirection: 'column' as const,
              gap: '10px',
              padding: '28px 32px',
              borderRadius: '10px',
              border: '1px solid var(--border-base)',
              borderLeft: '4px solid #4A7BA7',
              background: 'rgba(74,123,167,0.04)',
              textDecoration: 'none',
            }}
            className="career-callout"
          >
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase' as const,
              color: '#4A7BA7', margin: 0,
            }}>
              New role · exploding fast
            </p>
            <h2 style={{
              fontFamily: 'var(--font-serif)', fontSize: 'var(--text-lg)', fontWeight: 600,
              color: 'var(--text-primary)', lineHeight: 1.2, margin: 0,
            }}>
              What is a Forward Deployed Engineer?
            </h2>
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '14px',
              color: 'var(--text-muted)', lineHeight: 1.65, margin: 0,
            }}>
              Anthropic and OpenAI both launched billion-dollar deployment companies in the same week. Both built around the same type of engineer. Here&apos;s what they do, what they earn, and how to become one.
            </p>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#4A7BA7', fontWeight: 500 }}>
              Read the guide →
            </span>
          </Link>

          <Link
            href="/articles/what-is-an-agent-operator"
            style={{
              display: 'flex',
              flexDirection: 'column' as const,
              gap: '10px',
              padding: '28px 32px',
              borderRadius: '10px',
              border: '1px solid var(--border-base)',
              borderLeft: '4px solid #4CAF7D',
              background: 'rgba(76,175,125,0.04)',
              textDecoration: 'none',
            }}
            className="career-callout"
          >
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase' as const,
              color: '#4CAF7D', margin: 0,
            }}>
              500K–1M new jobs predicted
            </p>
            <h2 style={{
              fontFamily: 'var(--font-serif)', fontSize: 'var(--text-lg)', fontWeight: 600,
              color: 'var(--text-primary)', lineHeight: 1.2, margin: 0,
            }}>
              What is an Agent Operator?
            </h2>
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '14px',
              color: 'var(--text-muted)', lineHeight: 1.65, margin: 0,
            }}>
              Aaron Levie predicts 500,000 to 1 million companies will hire someone to own their AI agents internally. Most already have this person — they just don&apos;t have a name for what they&apos;re doing yet.
            </p>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#4CAF7D', fontWeight: 500 }}>
              Read the guide →
            </span>
          </Link>
        </div>

        {/* Keep the original career impact article below, smaller */}
        <Link
          href="/articles/ai-impact-on-knowledge-work"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '32px',
            padding: '20px 28px',
            borderRadius: '10px',
            border: '1px solid var(--border-base)',
            background: 'var(--bg-subtle)',
            textDecoration: 'none',
            marginTop: '12px',
          }}
          className="career-callout"
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase' as const,
              color: 'var(--text-muted)', marginBottom: '6px',
            }}>
              Context
            </p>
            <h2 style={{
              fontFamily: 'var(--font-serif)', fontSize: 'var(--text-base)', fontWeight: 600,
              color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '0',
            }}>
              What AI Is Actually Doing to Your Job
            </h2>
          </div>
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--accent)',
            whiteSpace: 'nowrap' as const,
            flexShrink: 0,
          }}>
            Read →
          </span>
        </Link>
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
          .secondary-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          .entry-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        .path-link:hover {
          background: var(--bg-subtle) !important;
        }
        .secondary-link:hover {
          border-color: var(--accent) !important;
        }
        .cluster-pill:hover {
          border-color: var(--border-base) !important;
          color: var(--text-primary) !important;
        }
        .career-callout:hover {
          background: var(--bg-surface) !important;
          border-left-color: var(--accent) !important;
        }
      `}</style>
    </div>
  )
}
