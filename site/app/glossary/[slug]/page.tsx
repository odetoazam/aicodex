import Link from 'next/link'
import type { Metadata } from 'next'
import { CLUSTER_MAP, AUDIENCE_LABELS, ANGLE_LABELS } from '@/lib/clusters'
import RelatedTermCard from '@/components/RelatedTermCard'
import { getTerm, getRelatedTerms } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const term = await getTerm(params.slug)
  if (!term) return { title: 'Term not found' }
  return {
    title: `${term.name} — AI Codex`,
    description: term.definition,
  }
}

function ClusterTag({ cluster }: { cluster: string }) {
  const config = CLUSTER_MAP[cluster]
  if (!config) return null
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: '4px',
        fontSize: '12px', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' as const,
        color: config.color, background: config.bg, fontFamily: 'var(--font-sans)',
      }}
    >
      {cluster}
    </span>
  )
}

function AudienceTag({ label }: { label: string }) {
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: '4px',
        fontSize: '12px', fontWeight: 400, color: 'var(--text-muted)', background: 'var(--bg-subtle)',
        border: '1px solid var(--border-base)', fontFamily: 'var(--font-sans)',
      }}
    >
      {label}
    </span>
  )
}

export default async function TermPage({ params }: { params: { slug: string } }) {
  const term = await getTerm(params.slug)

  if (!term) {
    return (
      <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(64px, 10vw, 120px) 0', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', color: 'var(--text-primary)', marginBottom: '16px' }}>
          Term not found
        </h1>
        <Link href="/glossary" style={{ color: 'var(--accent)', fontFamily: 'var(--font-sans)', fontSize: '15px' }}>
          ← Back to glossary
        </Link>
      </div>
    )
  }

  const relatedTerms = await getRelatedTerms(term.related_terms)
  const clusterConfig = CLUSTER_MAP[term.cluster]

  return (
    <div style={{ width: 'var(--container-wide)', margin: '0 auto', padding: 'clamp(40px, 6vw, 72px) 0 var(--section-y)' }}>

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)' }}>
        <Link href="/glossary" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Glossary</Link>
        <span>›</span>
        <span style={{ color: clusterConfig?.color }}>{term.cluster}</span>
        <span>›</span>
        <span style={{ color: 'var(--text-secondary)' }}>{term.name}</span>
      </nav>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '64px', alignItems: 'start' }} className="term-layout">

        {/* Main content */}
        <article>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px', marginBottom: '20px' }}>
              <ClusterTag cluster={term.cluster} />
              {term.claude_specific && (
                <span
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px',
                    borderRadius: '4px', fontSize: '12px', fontWeight: 500, color: 'var(--accent)',
                    background: 'var(--accent-muted)', border: '1px solid rgba(212,132,90,0.2)', fontFamily: 'var(--font-sans)',
                  }}
                >
                  <span style={{ fontSize: '9px' }}>◆</span> Claude
                </span>
              )}
              {term.audience.filter(a => a !== 'all').map(a => (
                <AudienceTag key={a} label={AUDIENCE_LABELS[a] ?? a} />
              ))}
            </div>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-3xl)', fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '24px' }}>
              {term.name}
            </h1>

            {term.aliases.length > 0 && (
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                Also: {term.aliases.join(', ')}
              </p>
            )}
          </div>

          {/* Definition */}
          <div
            style={{
              padding: '24px 28px', borderRadius: '10px', background: 'var(--bg-surface)',
              border: '1px solid var(--border-base)', borderLeft: `3px solid ${clusterConfig?.color ?? 'var(--accent)'}`,
              marginBottom: '48px',
            }}
          >
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-lg)', color: 'var(--text-primary)', lineHeight: 1.7, margin: 0 }}>
              {term.definition}
            </p>
          </div>

          {/* Articles per angle */}
          {term.angles.filter(a => a !== 'def').map(angle => (
            <section key={angle} style={{ marginBottom: '48px' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', color: 'var(--text-primary)',
                  marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border-muted)',
                }}
              >
                {ANGLE_LABELS[angle] ?? angle}
              </h2>
              <div style={{ padding: '24px', borderRadius: '8px', border: '1px dashed var(--border-base)', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontSize: '14px', textAlign: 'center' as const }}>
                Article coming soon
              </div>
            </section>
          ))}
        </article>

        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: '80px' }}>
          {/* Cluster */}
          <div style={{ padding: '20px', borderRadius: '8px', border: '1px solid var(--border-base)', background: 'var(--bg-surface)', marginBottom: '16px' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', marginBottom: '10px' }}>
              Cluster
            </p>
            <Link
              href={`/glossary?cluster=${encodeURIComponent(term.cluster)}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
            >
              <span style={{ fontSize: '16px', color: clusterConfig?.color }}>{clusterConfig?.icon}</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: clusterConfig?.color ?? 'var(--accent)' }}>
                {term.cluster}
              </span>
            </Link>
          </div>

          {/* Related terms */}
          {relatedTerms.length > 0 && (
            <div style={{ padding: '20px', borderRadius: '8px', border: '1px solid var(--border-base)', background: 'var(--bg-surface)', marginBottom: '16px' }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', marginBottom: '12px' }}>
                Related terms
              </p>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
                {relatedTerms.map(t => <RelatedTermCard key={t.slug} term={t} />)}
              </div>
            </div>
          )}

          {/* Explore cluster */}
          <div style={{ padding: '20px', borderRadius: '8px', border: '1px solid var(--border-base)', background: 'var(--bg-surface)' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', marginBottom: '12px' }}>
              Explore cluster
            </p>
            <Link
              href={`/glossary?cluster=${encodeURIComponent(term.cluster)}`}
              style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--accent)', textDecoration: 'none' }}
            >
              All {term.cluster.split(' ')[0]} terms →
            </Link>
          </div>
        </aside>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .term-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
