import Link from 'next/link'
import NewsletterCTA from '@/components/NewsletterCTA'
import ClusterCard from '@/components/ClusterCard'
import ArticleCard from '@/components/ArticleCard'
import { CLUSTERS } from '@/lib/clusters'
import { getFeaturedArticles, getFieldNotes, getClusterCounts } from '@/lib/db'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'AI Codex — The knowledge graph for building with AI',
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
        <p className="eyebrow" style={{ marginBottom: '24px' }}>Knowledge Graph</p>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-4xl)',
            fontWeight: 400,
            color: 'var(--text-primary)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            maxWidth: '14ch',
            marginBottom: '24px',
          }}
        >
          Learn to build<br />
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
          A structured knowledge graph mapping AI concepts to business decisions.
          No hype — just what you actually need to know, and how it connects.
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
            Browse the glossary <span>→</span>
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

        <div
          style={{
            display: 'flex',
            gap: '32px',
            marginTop: '56px',
            paddingTop: '40px',
            borderTop: '1px solid var(--border-muted)',
            flexWrap: 'wrap',
          }}
        >
          {[
            { value: '150+', label: 'Terms mapped' },
            { value: '8', label: 'Clusters' },
            { value: 'Claude', label: 'First' },
          ].map(stat => (
            <div key={stat.label}>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {stat.value}
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Browse by Cluster ─────────────────────────────── */}
      <section style={{ width: 'var(--container)', margin: '0 auto', paddingBottom: 'var(--section-y)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', color: 'var(--text-primary)' }}>
            Browse by cluster
          </h2>
          <Link href="/glossary" style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--accent)', textDecoration: 'none' }}>
            View all →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
          {CLUSTERS.map(cluster => (
            <ClusterCard key={cluster.name} cluster={cluster} count={clusterCounts[cluster.name] ?? 0} />
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
