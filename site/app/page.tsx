import Link from 'next/link'
import NewsletterCTA from '@/components/NewsletterCTA'
import { CLUSTERS } from '@/lib/clusters'
import { getFeaturedArticles, getFieldNotes, getClusterCounts } from '@/lib/db'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Codex — The knowledge graph for building with AI',
}

// ── Components ─────────────────────────────────────────────

function ClusterCard({ cluster, index, count }: { cluster: typeof CLUSTERS[0]; index: number; count: number }) {
  return (
    <Link
      href={`/glossary?cluster=${encodeURIComponent(cluster.name)}`}
      style={{
        display: 'block',
        padding: '24px',
        borderRadius: '10px',
        border: '1px solid var(--border-base)',
        background: 'var(--bg-surface)',
        textDecoration: 'none',
        transition: 'border-color 150ms ease, background 150ms ease',
        animationDelay: `${index * 40}ms`,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = cluster.color + '50'
        el.style.background = 'var(--bg-subtle)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'var(--border-base)'
        el.style.background = 'var(--bg-surface)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '18px', color: cluster.color }}>{cluster.icon}</span>
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            fontWeight: 400,
          }}
        >
          {count} terms
        </span>
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '16px',
          fontWeight: 400,
          color: 'var(--text-primary)',
          marginBottom: '8px',
          lineHeight: 1.3,
        }}
      >
        {cluster.name}
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '13px',
          color: 'var(--text-muted)',
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {cluster.description}
      </p>
    </Link>
  )
}

function ArticleCard({ article }: { article: typeof FEATURED_ARTICLES[0] }) {
  const clusterColor = CLUSTERS.find(c => c.name === article.cluster)?.color ?? 'var(--accent)'
  const clusterBg = CLUSTERS.find(c => c.name === article.cluster)?.bg ?? 'var(--accent-muted)'
  const tierLabel = article.tier === 5 ? 'Absence' : article.tier === 3 ? 'Cross-Concept' : 'Deep Dive'

  return (
    <Link
      href={`/articles/${article.slug}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '24px',
        borderRadius: '10px',
        border: '1px solid var(--border-base)',
        background: 'var(--bg-surface)',
        textDecoration: 'none',
        transition: 'border-color 150ms ease',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,132,90,0.3)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-base)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.04em',
            textTransform: 'uppercase' as const,
            color: clusterColor,
            background: clusterBg,
            fontFamily: 'var(--font-sans)',
          }}
        >
          {article.cluster.split(' ')[0]}
        </span>
        <span
          style={{
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.04em',
            textTransform: 'uppercase' as const,
            color: article.tier === 5 ? '#D45A7B' : 'var(--text-muted)',
            background: article.tier === 5 ? 'rgba(212,90,123,0.1)' : 'var(--bg-subtle)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {tierLabel}
        </span>
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'var(--text-lg)',
          fontWeight: 400,
          color: 'var(--text-primary)',
          lineHeight: 1.3,
        }}
      >
        {article.title}
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '14px',
          color: 'var(--text-muted)',
          lineHeight: 1.6,
          margin: 0,
          flex: 1,
        }}
      >
        {article.excerpt}
      </p>
      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '12px',
          color: 'var(--text-muted)',
          margin: 0,
        }}
      >
        {article.read_time} min read
      </p>
    </Link>
  )
}

// ── Page ───────────────────────────────────────────────────

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

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, alignItems: 'center' }}>
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
              transition: 'background var(--duration-fast) ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent-hover)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent)' }}
          >
            Browse the glossary
            <span style={{ fontSize: '16px' }}>→</span>
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
              fontWeight: 400,
              transition: 'border-color var(--duration-fast) ease, color var(--duration-fast) ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(212,132,90,0.4)'
              el.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--border-base)'
              el.style.color = 'var(--text-secondary)'
            }}
          >
            Read articles
          </Link>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: '32px',
            marginTop: '56px',
            paddingTop: '40px',
            borderTop: '1px solid var(--border-muted)',
            flexWrap: 'wrap' as const,
          }}
        >
          {[
            { value: '150+', label: 'Terms mapped' },
            { value: '8', label: 'Clusters' },
            { value: 'Claude', label: 'First' },
          ].map(stat => (
            <div key={stat.label}>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'var(--text-xl)',
                  color: 'var(--text-primary)',
                  marginBottom: '4px',
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  margin: 0,
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Browse by Cluster ─────────────────────────────── */}
      <section
        style={{
          width: 'var(--container)',
          margin: '0 auto',
          paddingBottom: 'var(--section-y)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: '32px',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--text-2xl)',
              color: 'var(--text-primary)',
            }}
          >
            Browse by cluster
          </h2>
          <Link
            href="/glossary"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              color: 'var(--accent)',
              textDecoration: 'none',
            }}
          >
            View all →
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '12px',
          }}
        >
          {CLUSTERS.map((cluster, i) => (
            <ClusterCard key={cluster.name} cluster={cluster} index={i} count={clusterCounts[cluster.name] ?? 0} />
          ))}
        </div>
      </section>

      {/* ── Featured Articles ─────────────────────────────── */}
      <section
        style={{
          width: 'var(--container)',
          margin: '0 auto',
          paddingBottom: 'var(--section-y)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: '32px',
          }}
        >
          <div>
            <p className="eyebrow" style={{ marginBottom: '8px' }}>Deep Dives</p>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--text-2xl)',
                color: 'var(--text-primary)',
              }}
            >
              Where the real value is
            </h2>
          </div>
          <Link
            href="/articles"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              color: 'var(--accent)',
              textDecoration: 'none',
            }}
          >
            All articles →
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '12px',
          }}
        >
          {featuredArticles.map(article => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      {/* ── From the Field ────────────────────────────────── */}
      <section
        style={{
          width: 'var(--container)',
          margin: '0 auto',
          paddingBottom: 'var(--section-y)',
        }}
      >
        <div style={{ marginBottom: '32px' }}>
          <p className="eyebrow" style={{ marginBottom: '8px' }}>From the Field</p>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--text-2xl)',
              color: 'var(--text-primary)',
            }}
          >
            Operator dispatches
          </h2>
        </div>

        {fieldNotes[0] && (
          <div
            style={{
              padding: '28px 32px',
              borderRadius: '10px',
              border: '1px solid var(--border-base)',
              background: 'var(--bg-surface)',
              borderLeft: '3px solid var(--accent)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                color: 'var(--text-muted)',
                marginBottom: '12px',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.06em',
              }}
            >
              {new Date(fieldNotes[0].created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} · {fieldNotes[0].read_time} min read
            </p>
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--text-xl)',
                color: 'var(--text-primary)',
                lineHeight: 1.3,
                marginBottom: '16px',
              }}
            >
              {fieldNotes[0].title}
            </h3>
            <Link
              href={`/articles/${fieldNotes[0].slug}`}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                color: 'var(--accent)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Read dispatch →
            </Link>
          </div>
        )}
      </section>

      {/* ── Newsletter ────────────────────────────────────── */}
      <section
        style={{
          width: 'var(--container)',
          margin: '0 auto',
          paddingBottom: 'var(--section-y)',
        }}
      >
        <NewsletterCTA variant="section" />
      </section>
    </div>
  )
}
