import Link from 'next/link'
import NewsletterCTA from '@/components/NewsletterCTA'
import ArticleCard from '@/components/ArticleCard'
import { CLUSTERS } from '@/lib/clusters'
import { getFeaturedArticles, getFieldNotes, getClusterCounts } from '@/lib/db'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'AI Codex — Learn to operate with AI',
}

export default async function HomePage() {
  const [featuredArticles, fieldNotes, clusterCounts] = await Promise.all([
    getFeaturedArticles(3),
    getFieldNotes(1),
    getClusterCounts(),
  ])

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        style={{
          width: 'var(--container)',
          margin: '0 auto',
          padding: 'clamp(72px, 12vw, 140px) 0 clamp(64px, 10vw, 112px)',
        }}
      >
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
          Learn to operate<br />
          <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>with</em> AI.
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-lg)',
            color: 'var(--text-muted)',
            maxWidth: '48ch',
            lineHeight: 1.65,
            marginBottom: '40px',
          }}
        >
          Clear explanations of every AI concept that matters —
          and what each one actually means for your work.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link
            href="/glossary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--accent)',
              color: 'var(--text-inverse)',
              textDecoration: 'none',
              padding: '13px 24px',
              borderRadius: '8px',
              fontFamily: 'var(--font-sans)',
              fontSize: '15px',
              fontWeight: 500,
            }}
          >
            Browse the glossary →
          </Link>
          <Link
            href="/articles"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid var(--border-base)',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontFamily: 'var(--font-sans)',
              fontSize: '15px',
            }}
          >
            Read articles
          </Link>
        </div>
      </section>

      {/* ── Browse by Topic ───────────────────────────────── */}
      <section style={{ width: 'var(--container)', margin: '0 auto', paddingBottom: 'var(--section-y)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Browse by topic
          </p>
          <Link href="/glossary" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--accent)', textDecoration: 'none' }}>
            View all →
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

      {/* ── Featured Articles ─────────────────────────────── */}
      <section style={{ width: 'var(--container)', margin: '0 auto', paddingBottom: 'var(--section-y)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: '8px' }}>Deep Dives</p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', color: 'var(--text-primary)' }}>
              Where the real value is
            </h2>
          </div>
          <Link href="/articles" style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--accent)', textDecoration: 'none' }}>
            All articles →
          </Link>
        </div>

        {featuredArticles.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
            {featuredArticles.map(article => <ArticleCard key={article.slug} article={article} />)}
          </div>
        ) : (
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-muted)' }}>
            Articles coming soon.
          </p>
        )}
      </section>

      {/* ── From the Field ────────────────────────────────── */}
      <section style={{ width: 'var(--container)', margin: '0 auto', paddingBottom: 'var(--section-y)' }}>
        <div style={{ marginBottom: '32px' }}>
          <p className="eyebrow" style={{ marginBottom: '8px' }}>From the Field</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', color: 'var(--text-primary)' }}>
            Operator dispatches
          </h2>
        </div>

        {fieldNotes[0] ? (
          <div
            style={{
              padding: '28px 32px',
              borderRadius: '10px',
              border: '1px solid var(--border-base)',
              background: 'var(--bg-surface)',
              borderLeft: '3px solid var(--accent)',
            }}
          >
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {new Date(fieldNotes[0].created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} · {fieldNotes[0].read_time} min read
            </p>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '16px' }}>
              {fieldNotes[0].title}
            </h3>
            <Link href={`/articles/${fieldNotes[0].slug}`} style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--accent)', textDecoration: 'none' }}>
              Read dispatch →
            </Link>
          </div>
        ) : (
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-muted)' }}>
            First dispatch coming soon.
          </p>
        )}
      </section>

      {/* ── Newsletter ────────────────────────────────────── */}
      <section style={{ width: 'var(--container)', margin: '0 auto', paddingBottom: 'var(--section-y)' }}>
        <NewsletterCTA variant="section" />
      </section>
    </div>
  )
}


