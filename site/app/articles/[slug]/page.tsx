import Link from 'next/link'
import type { Metadata } from 'next'
import { marked } from 'marked'
import { CLUSTER_MAP, ANGLE_LABELS } from '@/lib/clusters'
import { getArticle, getArticlesForTerm } from '@/lib/db'

export const dynamic = 'force-dynamic'

marked.setOptions({ breaks: true })

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticle(params.slug)
  if (!article) return { title: 'Article not found' }
  return {
    title: `${article.title} — AI Codex`,
    description: article.excerpt ?? undefined,
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug)

  if (!article) {
    return (
      <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(64px, 10vw, 120px) 0', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', color: 'var(--text-primary)', marginBottom: '16px' }}>
          Article not found
        </h1>
        <Link href="/articles" style={{ color: 'var(--accent)', fontFamily: 'var(--font-sans)', fontSize: '15px' }}>
          ← Back to articles
        </Link>
      </div>
    )
  }

  const [relatedArticles] = await Promise.all([
    getArticlesForTerm(article.term_id),
  ])

  const otherArticles = relatedArticles.filter(a => a.slug !== article.slug)
  const clusterConfig = CLUSTER_MAP[article.cluster]
  const angleLabel = ANGLE_LABELS[article.angle] ?? article.angle
  const rawHtml = marked(article.body ?? '') as string
  // Open external links in new tab
  const bodyHtml = rawHtml.replace(
    /<a href="(https?:\/\/[^"]+)"/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer"'
  )

  return (
    <div style={{ width: 'var(--container-wide)', margin: '0 auto', padding: 'clamp(40px, 6vw, 72px) 0 var(--section-y)' }}>

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)' }}>
        <Link href="/articles" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Articles</Link>
        <span>›</span>
        <span style={{ color: clusterConfig?.color }}>{article.cluster}</span>
        <span>›</span>
        <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '30ch' }}>
          {article.title}
        </span>
      </nav>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '64px', alignItems: 'start' }} className="article-layout">

        {/* Main content */}
        <article>
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px', marginBottom: '20px' }}>
              {/* Cluster tag */}
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: '4px',
                  fontSize: '12px', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' as const,
                  color: clusterConfig?.color, background: clusterConfig?.bg, fontFamily: 'var(--font-sans)',
                }}
              >
                {article.cluster}
              </span>
              {/* Angle tag */}
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: '4px',
                  fontSize: '12px', fontWeight: 400, color: 'var(--text-muted)', background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-base)', fontFamily: 'var(--font-sans)',
                }}
              >
                {angleLabel}
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--text-2xl)',
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                marginBottom: '16px',
              }}
            >
              {article.title}
            </h1>

            {article.excerpt && (
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-lg)', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '16px', maxWidth: '60ch' }}>
                {article.excerpt}
              </p>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)' }}>
              <span>{article.read_time} min read</span>
              <span>·</span>
              <Link
                href={`/glossary/${article.term_slug}`}
                style={{ color: clusterConfig?.color ?? 'var(--accent)', textDecoration: 'none', borderBottom: `1px solid ${clusterConfig?.color ?? 'var(--accent)'}33` }}
              >
                {article.term_name}
              </Link>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'var(--border-base)', marginBottom: '48px' }} />

          {/* Body */}
          <div
            className="article-prose"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        </article>

        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: '80px' }}>

          {/* Term */}
          <div style={{ padding: '20px', borderRadius: '8px', border: '1px solid var(--border-base)', background: 'var(--bg-surface)', marginBottom: '16px' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', marginBottom: '10px' }}>
              Term
            </p>
            <Link
              href={`/glossary/${article.term_slug}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
            >
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', fontWeight: 600, color: clusterConfig?.color ?? 'var(--accent)' }}>
                {article.term_name}
              </span>
            </Link>
          </div>

          {/* Cluster */}
          <div style={{ padding: '20px', borderRadius: '8px', border: '1px solid var(--border-base)', background: 'var(--bg-surface)', marginBottom: '16px' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', marginBottom: '10px' }}>
              Cluster
            </p>
            <Link
              href={`/glossary?cluster=${encodeURIComponent(article.cluster)}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
            >
              <span style={{ fontSize: '16px', color: clusterConfig?.color }}>{clusterConfig?.icon}</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: clusterConfig?.color ?? 'var(--accent)' }}>
                {article.cluster}
              </span>
            </Link>
          </div>

          {/* More on this term */}
          {otherArticles.length > 0 && (
            <div style={{ padding: '20px', borderRadius: '8px', border: '1px solid var(--border-base)', background: 'var(--bg-surface)', marginBottom: '16px' }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', marginBottom: '12px' }}>
                More on {article.term_name}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
                {otherArticles.map(a => (
                  <Link
                    key={a.slug}
                    href={`/articles/${a.slug}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-muted)', background: 'var(--bg-subtle)' }}>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px', textTransform: 'uppercase' as const, letterSpacing: '0.04em' }}>
                        {ANGLE_LABELS[a.angle] ?? a.angle}
                      </p>
                      <p style={{ fontFamily: 'var(--font-serif)', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.35, margin: 0 }}>
                        {a.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back links */}
          <div style={{ padding: '20px', borderRadius: '8px', border: '1px solid var(--border-base)', background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
              <Link
                href={`/glossary/${article.term_slug}`}
                style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}
              >
                ← {article.term_name} definition
              </Link>
              <Link
                href="/articles"
                style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}
              >
                ← All articles
              </Link>
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .article-layout { grid-template-columns: 1fr !important; }
        }

        /* ── Prose styles for markdown body ─────────────── */
        .article-prose {
          font-family: var(--font-sans);
          font-size: var(--text-base);
          line-height: 1.8;
          color: var(--text-secondary);
        }
        .article-prose h2 {
          font-family: var(--font-serif);
          font-size: var(--text-xl);
          font-weight: 600;
          color: var(--text-primary);
          margin: 48px 0 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-muted);
        }
        .article-prose h3 {
          font-family: var(--font-serif);
          font-size: var(--text-lg);
          font-weight: 600;
          color: var(--text-primary);
          margin: 36px 0 12px;
        }
        .article-prose h4 {
          font-family: var(--font-sans);
          font-size: var(--text-base);
          font-weight: 600;
          color: var(--text-primary);
          margin: 28px 0 8px;
          letter-spacing: 0.01em;
        }
        .article-prose p {
          margin-bottom: 20px;
          color: var(--text-secondary);
        }
        .article-prose p:last-child { margin-bottom: 0; }
        .article-prose strong {
          color: var(--text-primary);
          font-weight: 600;
        }
        .article-prose em { font-style: italic; }
        .article-prose a {
          color: var(--accent);
          text-decoration: none;
          border-bottom: 1px solid rgba(212,132,90,0.3);
          transition: border-color 120ms ease;
        }
        .article-prose a:hover { border-bottom-color: var(--accent); }
        .article-prose ul,
        .article-prose ol {
          padding-left: 24px;
          margin-bottom: 20px;
        }
        .article-prose li {
          margin-bottom: 8px;
          color: var(--text-secondary);
        }
        .article-prose li::marker { color: var(--text-muted); }
        .article-prose blockquote {
          border-left: 3px solid var(--accent);
          padding: 4px 0 4px 20px;
          margin: 32px 0;
          font-style: italic;
          color: var(--text-muted);
        }
        .article-prose blockquote p { margin-bottom: 0; color: var(--text-muted); }
        .article-prose code {
          font-family: var(--font-mono);
          font-size: 0.875em;
          background: var(--bg-surface);
          border: 1px solid var(--border-base);
          border-radius: 4px;
          padding: 2px 6px;
          color: var(--text-primary);
        }
        .article-prose pre {
          background: var(--bg-surface);
          border: 1px solid var(--border-base);
          border-radius: 8px;
          padding: 20px 24px;
          overflow-x: auto;
          margin-bottom: 24px;
        }
        .article-prose pre code {
          background: none;
          border: none;
          padding: 0;
          font-size: 0.875em;
          color: var(--text-secondary);
        }
        .article-prose hr {
          border: none;
          border-top: 1px solid var(--border-base);
          margin: 40px 0;
        }
      `}</style>
    </div>
  )
}
