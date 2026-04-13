import Link from 'next/link'
import type { Metadata } from 'next'
import { marked } from 'marked'
import { CLUSTER_MAP, ANGLE_LABELS } from '@/lib/clusters'
import { ARTICLE_PATHS } from '@/lib/paths'
import { getArticle, getArticlesForTerm, getArticlesByCluster } from '@/lib/db'
import type { Article } from '@/lib/types'
import ArticleActions from '@/components/ArticleActions'

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

function ArticleCard({ article, label }: { article: Article; label?: string }) {
  const config = CLUSTER_MAP[article.cluster]
  const angleLabel = ANGLE_LABELS[article.angle] ?? article.angle
  return (
    <Link href={`/articles/${article.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{
          padding: '20px 22px',
          borderRadius: '8px',
          border: '1px solid var(--border-base)',
          background: 'var(--bg-surface)',
          borderTop: `3px solid ${config?.color ?? 'var(--accent)'}`,
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '10px' }}>
          {label && (
            <span style={{
              fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase' as const,
              color: config?.color ?? 'var(--accent)',
            }}>
              {label}
            </span>
          )}
          {label && <span style={{ color: 'var(--border-base)', fontSize: '10px' }}>·</span>}
          <span style={{
            fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 500,
            letterSpacing: '0.05em', textTransform: 'uppercase' as const, color: 'var(--text-muted)',
          }}>
            {angleLabel}
          </span>
          <span style={{ color: 'var(--border-base)', fontSize: '10px' }}>·</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-muted)' }}>
            {article.read_time} min
          </span>
        </div>
        <p style={{
          fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: 600,
          color: 'var(--text-primary)', lineHeight: 1.3, margin: '0 0 8px',
        }}>
          {article.title}
        </p>
        {article.excerpt && (
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)',
            lineHeight: 1.55, margin: 0,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
          }}>
            {article.excerpt}
          </p>
        )}
      </div>
    </Link>
  )
}

interface ToolCallout {
  label: string
  description: string
  href: string
  cta: string
}

const TOOL_CALLOUTS: Record<string, ToolCallout> = {
  calculator: {
    label: 'Claude API Cost Calculator',
    description: 'Estimate your monthly spend by model, message volume, and caching strategy.',
    href: '/tools/cost-calculator',
    cta: 'Calculate your cost →',
  },
  promptBuilder: {
    label: 'System Prompt Builder',
    description: 'Generate a production-ready Claude system prompt for your use case in minutes.',
    href: '/tools/system-prompt-builder',
    cta: 'Build your prompt →',
  },
  scorecard: {
    label: 'AI Maturity Scorecard',
    description: '10 questions to assess where your Claude implementation stands and what to improve.',
    href: '/tools/scorecard',
    cta: 'Check your score →',
  },
  compareGPT4: {
    label: 'Claude vs GPT-4',
    description: 'Side-by-side comparison across code quality, context, debugging, and cost.',
    href: '/compare/claude-vs-gpt4-coding',
    cta: 'See comparison →',
  },
  compareModels: {
    label: 'Haiku vs Sonnet',
    description: 'When to use each model — quality, speed, cost, and context tradeoffs.',
    href: '/compare/claude-haiku-vs-sonnet',
    cta: 'See comparison →',
  },
}

function getRelatedTools(article: Article): ToolCallout[] {
  const slug = article.slug.toLowerCase()
  const term = (article.term_slug ?? '').toLowerCase()
  const cluster = article.cluster.toLowerCase()
  const tools: ToolCallout[] = []

  const matches = (keywords: string[]) =>
    keywords.some(k => slug.includes(k) || term.includes(k) || cluster.includes(k))

  if (matches(['cost', 'pric', 'token', 'cach', 'billing', 'budget', 'spend'])) {
    tools.push(TOOL_CALLOUTS.calculator)
    tools.push(TOOL_CALLOUTS.compareModels)
  }
  if (matches(['system-prompt', 'system_prompt', 'prompting', 'prompt-design', 'instruction'])) {
    tools.push(TOOL_CALLOUTS.promptBuilder)
  }
  if (matches(['gpt', 'openai', 'vs-gpt', 'versus', 'compared', 'comparison'])) {
    tools.push(TOOL_CALLOUTS.compareGPT4)
  }
  if (matches(['haiku', 'sonnet', 'opus', 'model-selection', 'which-model', 'choose-model'])) {
    tools.push(TOOL_CALLOUTS.compareModels)
  }
  if (matches(['production', 'deploy', 'architect', 'scale', 'enterprise', 'maturity', 'readiness'])) {
    tools.push(TOOL_CALLOUTS.scorecard)
  }
  if (matches(['coding', 'code', 'developer', 'api', 'integration', 'claude-code'])) {
    tools.push(TOOL_CALLOUTS.compareGPT4)
    if (!tools.some(t => t.href === TOOL_CALLOUTS.calculator.href)) {
      tools.push(TOOL_CALLOUTS.calculator)
    }
  }

  // Deduplicate by href, take first 2
  const seen = new Set<string>()
  const unique: ToolCallout[] = []
  for (const t of tools) {
    if (!seen.has(t.href)) { seen.add(t.href); unique.push(t) }
    if (unique.length === 2) break
  }
  return unique
}

function stripLinksFromHeadings(html: string): string {
  return html.replace(
    /<(h[1-6])([^>]*)>([\s\S]*?)<\/\1>/g,
    (_, tag, attrs, content) => {
      const stripped = content.replace(/<a[^>]*>([\s\S]*?)<\/a>/g, '$1')
      return `<${tag}${attrs}>${stripped}</${tag}>`
    }
  )
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

  const [termArticles, clusterArticles] = await Promise.all([
    getArticlesForTerm(article.term_id),
    getArticlesByCluster(article.cluster, article.slug, 4),
  ])

  const otherTermArticles = termArticles.filter(a => a.slug !== article.slug)
  const clusterConfig = CLUSTER_MAP[article.cluster]
  const angleLabel = ANGLE_LABELS[article.angle] ?? article.angle

  const rawHtml = marked(article.body ?? '') as string
  const bodyHtml = stripLinksFromHeadings(rawHtml)
    .replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"')

  // Build "continue reading" cards: other angles on this term first, then cluster articles
  // Filter cluster articles to exclude ones already shown as same-term articles
  const termArticleSlugs = new Set(termArticles.map(a => a.slug))
  const freshClusterArticles = clusterArticles.filter(a => !termArticleSlugs.has(a.slug))

  // Up to 2 from same term, fill remaining with cluster
  const sameTermCards = otherTermArticles.slice(0, 2)
  const remaining = 3 - sameTermCards.length
  const clusterCards = freshClusterArticles.slice(0, remaining)
  const continueCards = [...sameTermCards, ...clusterCards]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt ?? undefined,
    author: { '@type': 'Organization', name: 'AI Codex', url: 'https://www.aicodex.to' },
    publisher: { '@type': 'Organization', name: 'AI Codex', url: 'https://www.aicodex.to' },
    url: `https://www.aicodex.to/articles/${article.slug}`,
    datePublished: article.created_at ?? undefined,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.aicodex.to/articles/${article.slug}` },
  }

  return (
    <div style={{ width: 'var(--container-wide)', margin: '0 auto', padding: 'clamp(40px, 6vw, 72px) 0 var(--section-y)' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)' }}>
        <Link href="/articles" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Articles</Link>
        <span>›</span>
        <span style={{ color: clusterConfig?.color }}>{article.cluster}</span>
        <span>›</span>
        <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '30ch' }}>
          {article.title}
        </span>
      </nav>

      {/* Learning path context banner */}
      {(() => {
        const pathInfo = ARTICLE_PATHS[article.slug]
        if (!pathInfo) return null
        return (
          <div style={{
            marginBottom: '32px',
            padding: '12px 18px',
            borderRadius: '8px',
            border: '1px solid var(--border-base)',
            background: 'var(--bg-surface)',
            borderLeft: `3px solid ${pathInfo.accent}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap' as const,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' as const }}>
              <Link href={pathInfo.pathHref} style={{ textDecoration: 'none' }}>
                <span style={{
                  fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600,
                  color: pathInfo.accent, letterSpacing: '0.02em',
                }}>
                  {pathInfo.pathName}
                </span>
              </Link>
              <span style={{
                fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)',
                padding: '1px 7px', borderRadius: '3px', background: 'var(--bg-subtle)',
                border: '1px solid var(--border-muted)',
              }}>
                Step {pathInfo.stepNumber} of {pathInfo.totalSteps}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {pathInfo.prevSlug ? (
                <Link href={`/articles/${pathInfo.prevSlug}`} style={{
                  fontFamily: 'var(--font-sans)', fontSize: '12px',
                  color: 'var(--text-muted)', textDecoration: 'none',
                }}>
                  ← Prev
                </Link>
              ) : (
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--border-base)' }}>← Prev</span>
              )}
              <span style={{ color: 'var(--border-base)', fontSize: '12px' }}>·</span>
              {pathInfo.nextSlug ? (
                <Link href={`/articles/${pathInfo.nextSlug}`} style={{
                  fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500,
                  color: pathInfo.accent, textDecoration: 'none',
                }}>
                  Next →
                </Link>
              ) : (
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--border-base)' }}>Next →</span>
              )}
            </div>
          </div>
        )
      })()}

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '64px', alignItems: 'start' }} className="article-layout">

        {/* Main content */}
        <article>
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px', marginBottom: '20px' }}>
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: '4px',
                  fontSize: '12px', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' as const,
                  color: clusterConfig?.color, background: clusterConfig?.bg, fontFamily: 'var(--font-sans)',
                }}
              >
                {article.cluster}
              </span>
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
          <div style={{ height: '1px', background: 'var(--border-base)', marginBottom: '32px' }} />

          {/* Save / read actions */}
          <ArticleActions slug={article.slug} />

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

          {/* Other angles on this term */}
          {otherTermArticles.length > 0 && (
            <div style={{ padding: '20px', borderRadius: '8px', border: '1px solid var(--border-base)', background: 'var(--bg-surface)', marginBottom: '16px' }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', marginBottom: '12px' }}>
                More on {article.term_name}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
                {otherTermArticles.map(a => (
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

          {/* Explore cluster */}
          <div style={{ padding: '20px', borderRadius: '8px', border: '1px solid var(--border-base)', background: 'var(--bg-surface)' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', marginBottom: '10px' }}>
              Explore
            </p>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
              <Link
                href={`/glossary/${article.term_slug}`}
                style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}
              >
                {article.term_name} definition →
              </Link>
              <Link
                href={`/glossary?cluster=${encodeURIComponent(article.cluster)}`}
                style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}
              >
                All {article.cluster.split(' ')[0]} terms →
              </Link>
              <Link
                href="/articles"
                style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}
              >
                All articles →
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Related tools callout */}
      {(() => {
        const tools = getRelatedTools(article)
        if (tools.length === 0) return null
        return (
          <div style={{ marginTop: '64px', padding: '24px 28px', borderRadius: '12px', border: '1px solid var(--border-base)', background: 'var(--bg-subtle)' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', marginBottom: '16px' }}>
              Related tools
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: tools.length === 1 ? '1fr' : '1fr 1fr', gap: '12px' }} className="tools-callout-grid">
              {tools.map(tool => (
                <Link key={tool.href} href={tool.href} style={{ textDecoration: 'none' }}>
                  <div style={{ padding: '16px', borderRadius: '8px', border: '1px solid var(--border-base)', background: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: '6px', height: '100%', boxSizing: 'border-box' as const }}>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{tool.label}</p>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0, flex: 1 }}>{tool.description}</p>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--accent)', margin: 0 }}>{tool.cta}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )
      })()}

      {/* Next in path / path complete */}
      {(() => {
        const pathInfo = ARTICLE_PATHS[article.slug]
        if (!pathInfo) return null

        if (pathInfo.nextSlug) {
          return (
            <div style={{
              marginTop: '64px',
              padding: '24px 28px',
              borderRadius: '12px',
              border: '1px solid var(--border-base)',
              background: 'var(--bg-surface)',
              borderLeft: `3px solid ${pathInfo.accent}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
              flexWrap: 'wrap' as const,
            }}>
              <div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: pathInfo.accent, marginBottom: '4px' }}>
                  Next in {pathInfo.pathName} · Step {pathInfo.stepNumber + 1} of {pathInfo.totalSteps}
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
                  Continue to the next article in the learning path
                </p>
              </div>
              <Link
                href={`/articles/${pathInfo.nextSlug}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: pathInfo.accent,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap' as const,
                  flexShrink: 0,
                }}
              >
                Next article →
              </Link>
            </div>
          )
        }

        // Last article in path — show completion CTA
        return (
          <div style={{
            marginTop: '64px',
            padding: '24px 28px',
            borderRadius: '12px',
            border: '1px solid var(--border-base)',
            background: 'var(--bg-surface)',
            borderLeft: `3px solid ${pathInfo.accent}`,
          }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: pathInfo.accent, marginBottom: '8px' }}>
              {pathInfo.pathName} · Complete
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
              You&apos;ve reached the end of this path.
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.55 }}>
              Go back to the path overview, or explore another learning path.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' as const }}>
              <Link
                href={pathInfo.pathHref}
                style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500, color: pathInfo.accent, textDecoration: 'none' }}
              >
                ← Back to {pathInfo.pathName}
              </Link>
              <Link
                href="/learn"
                style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'none' }}
              >
                All learning paths →
              </Link>
            </div>
          </div>
        )
      })()}

      {/* Continue reading */}
      {continueCards.length > 0 && (
        <div style={{ marginTop: '80px', paddingTop: '48px', borderTop: '1px solid var(--border-base)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '28px' }}>
            <h2 style={{
              fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', fontWeight: 600,
              color: 'var(--text-primary)', margin: 0,
            }}>
              Continue reading
            </h2>
            <Link href="/articles" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>
              All articles →
            </Link>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${continueCards.length}, 1fr)`,
              gap: '16px',
            }}
            className="continue-grid"
          >
            {continueCards.map(a => {
              const isSameTerm = a.term_id === article.term_id
              return (
                <ArticleCard
                  key={a.slug}
                  article={a}
                  label={isSameTerm ? a.term_name : undefined}
                />
              )
            })}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .article-layout { grid-template-columns: 1fr !important; }
          .continue-grid { grid-template-columns: 1fr !important; }
          .tools-callout-grid { grid-template-columns: 1fr !important; }
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
