import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { marked } from 'marked'
import { CLUSTER_MAP, ANGLE_LABELS } from '@/lib/clusters'
import { ARTICLE_PATHS } from '@/lib/paths'
import { NEXT_READS } from '@/lib/next-reads'
import { getArticle, getArticlesForTerm, getArticlesByCluster, getArticlesBySlugs, getTermSlugs, getAllArticles } from '@/lib/db'
import type { Article } from '@/lib/types'
import ArticleActions from '@/components/ArticleActions'
import ReadSentinel from '@/components/ReadSentinel'
import ScrollProgress from '@/components/ScrollProgress'
import NewsletterCTA from '@/components/NewsletterCTA'
import TableOfContents from '@/components/TableOfContents'

export const revalidate = 3600

export async function generateStaticParams() {
  const articles = await getAllArticles()
  return articles.map(a => ({ slug: a.slug }))
}

marked.setOptions({ breaks: true })

function metaDesc(text: string | null | undefined, max = 155): string | undefined {
  if (!text) return undefined
  if (text.length <= max) return text
  return text.substring(0, max).replace(/\s+\S*$/, '') + '...'
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticle(params.slug)
  if (!article) return { title: 'Article not found' }
  const url = `https://www.aicodex.to/articles/${article.slug}`
  const desc = metaDesc(article.excerpt)
  return {
    title: `${article.title} — AI Codex`,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: desc ?? undefined,
      url,
      type: 'article',
      publishedTime: article.created_at ?? undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: desc ?? undefined,
    },
  }
}

function ArticleCard({ article, label, reason }: { article: Article; label?: string; reason?: string }) {
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
        {reason ? (
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)',
            lineHeight: 1.55, margin: 0, fontStyle: 'italic',
          }}>
            {reason}
          </p>
        ) : article.excerpt ? (
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)',
            lineHeight: 1.55, margin: 0,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
          }}>
            {article.excerpt}
          </p>
        ) : null}
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
  const cluster = (article.cluster ?? '').toLowerCase()
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

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

interface TocEntry {
  id: string
  text: string
  level: 2 | 3
}

function extractHeadingsAndInjectIds(html: string): { html: string; toc: TocEntry[] } {
  const toc: TocEntry[] = []
  const idCount: Record<string, number> = {}

  const result = html.replace(
    /<(h[23])([^>]*)>([\s\S]*?)<\/\1>/g,
    (_, tag, attrs, content) => {
      const level = parseInt(tag[1]) as 2 | 3
      const plainText = content.replace(/<[^>]+>/g, '').trim()
      let id = slugifyHeading(plainText)
      // Deduplicate IDs
      if (idCount[id] !== undefined) {
        idCount[id]++
        id = `${id}-${idCount[id]}`
      } else {
        idCount[id] = 0
      }
      toc.push({ id, text: plainText, level })
      return `<${tag}${attrs} id="${id}">${content}</${tag}>`
    }
  )
  return { html: result, toc }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug)

  // notFound() so a missing slug returns a real 404. Rendering a "not found"
  // component inline would return HTTP 200, which search engines index as a
  // thin duplicate page rather than treating the URL as gone.
  if (!article) notFound()

  // Determine curated next-reads for this article
  const curatedNextReads = NEXT_READS[article.slug] ?? null
  const curatedSlugs = curatedNextReads?.map(r => r.slug) ?? []

  const [termArticles, clusterArticles, curatedArticles] = await Promise.all([
    getArticlesForTerm(article.term_id),
    article.cluster ? getArticlesByCluster(article.cluster, article.slug, 4) : Promise.resolve([]),
    curatedSlugs.length > 0 ? getArticlesBySlugs(curatedSlugs) : Promise.resolve([]),
  ])

  const otherTermArticles = termArticles.filter(a => a.slug !== article.slug)
  const clusterConfig = article.cluster ? CLUSTER_MAP[article.cluster] : undefined
  const angleLabel = ANGLE_LABELS[article.angle] ?? article.angle

  const rawHtml = marked(article.body ?? '') as string
  const strippedHtml = stripLinksFromHeadings(rawHtml)
  const { html: htmlWithIds, toc } = extractHeadingsAndInjectIds(strippedHtml)
  const bodyHtml = htmlWithIds
    .replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"')
  const showToc = toc.length >= 3

  // Build "what to read next" cards:
  // — If curated: use those articles with their reasons
  // — Else: fall back to same-term + cluster algorithm (existing behavior)
  type NextCard = { article: Article; reason?: string; label?: string }
  let nextCards: NextCard[]

  if (curatedArticles.length > 0) {
    // Map articles back to their reasons, preserving order
    nextCards = curatedArticles.map(a => {
      const entry = curatedNextReads?.find(r => r.slug === a.slug)
      return { article: a, reason: entry?.reason }
    })
  } else {
    const termArticleSlugs = new Set(termArticles.map(a => a.slug))
    const freshClusterArticles = clusterArticles.filter(a => !termArticleSlugs.has(a.slug))
    const sameTermCards = otherTermArticles.slice(0, 2)
    const remaining = 3 - sameTermCards.length
    const clusterCards = freshClusterArticles.slice(0, remaining)
    nextCards = [
      ...sameTermCards.map(a => ({ article: a, label: a.term_name })),
      ...clusterCards.map(a => ({ article: a })),
    ]
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt ?? undefined,
    author: { '@type': 'Organization', name: 'AI Codex', url: 'https://www.aicodex.to' },
    publisher: {
      '@type': 'Organization',
      name: 'AI Codex',
      url: 'https://www.aicodex.to',
      logo: { '@type': 'ImageObject', url: 'https://www.aicodex.to/icon.svg' },
    },
    url: `https://www.aicodex.to/articles/${article.slug}`,
    datePublished: article.created_at ?? undefined,
    dateModified: article.created_at ?? undefined,
    image: { '@type': 'ImageObject', url: `https://www.aicodex.to/articles/${article.slug}/opengraph-image`, width: 1200, height: 630 },
    articleSection: article.cluster ?? undefined,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.aicodex.to/articles/${article.slug}` },
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', 'h2'] },
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Articles', item: 'https://www.aicodex.to/articles' },
      ...(article.cluster ? [{ '@type': 'ListItem', position: 2, name: article.cluster, item: `https://www.aicodex.to/articles` }] : []),
      { '@type': 'ListItem', position: article.cluster ? 3 : 2, name: article.title, item: `https://www.aicodex.to/articles/${article.slug}` },
    ],
  }

  return (
    <div style={{ width: 'var(--container-wide)', margin: '0 auto', padding: 'clamp(40px, 6vw, 72px) 0 var(--section-y)' }}>
      <ScrollProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
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
        const pct = Math.round((pathInfo.stepNumber / pathInfo.totalSteps) * 100)
        return (
          <div style={{
            marginBottom: '32px',
            borderRadius: '8px',
            border: '1px solid var(--border-base)',
            background: 'var(--bg-surface)',
            borderLeft: `3px solid ${pathInfo.accent}`,
            overflow: 'hidden',
          }}>
            {/* Progress bar */}
            <div style={{ height: '3px', background: 'var(--bg-subtle)', position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${pct}%`,
                background: pathInfo.accent,
                opacity: 0.7,
                transition: 'width 300ms ease',
              }} />
            </div>
            <div style={{
              padding: '10px 18px',
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
              <div style={{
                margin: '20px 0 20px',
                padding: '14px 18px',
                borderRadius: '6px',
                borderLeft: `3px solid ${clusterConfig?.color ?? 'var(--accent)'}`,
                background: `${clusterConfig?.bg ?? 'var(--bg-subtle)'}`,
                maxWidth: '64ch',
              }}>
                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 600,
                  letterSpacing: '0.08em', textTransform: 'uppercase' as const,
                  color: clusterConfig?.color ?? 'var(--accent)', margin: '0 0 6px',
                }}>
                  In brief
                </p>
                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: '15px',
                  color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0,
                }}>
                  {article.excerpt}
                </p>
              </div>
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

          {/* Mobile-only Table of Contents */}
          {showToc && (
            <div className="article-toc-mobile" style={{ padding: '16px 20px', borderRadius: '8px', border: '1px solid var(--border-base)', background: 'var(--bg-surface)', marginBottom: '32px' }}>
              <TableOfContents toc={toc} accentColor={clusterConfig?.color ?? 'var(--accent)'} variant="mobile" />
            </div>
          )}

          {/* Save / read actions */}
          <ArticleActions slug={article.slug} />

          {/* Body */}
          <div
            className="article-prose"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />

          {/* Sentinel — fires when user reaches the end, marks article as read */}
          <ReadSentinel slug={article.slug} />
        </article>

        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: '80px' }}>

          {/* Table of Contents — desktop sidebar */}
          {showToc && (
            <div className="article-toc-sidebar" style={{ padding: '20px', borderRadius: '8px', border: '1px solid var(--border-base)', background: 'var(--bg-surface)', marginBottom: '16px', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
              <TableOfContents toc={toc} accentColor={clusterConfig?.color ?? 'var(--accent)'} variant="sidebar" />
            </div>
          )}

          {/* Term */}
          {article.term_slug && (
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
          )}

          {/* Cluster */}
          {article.cluster && (
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
          )}

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
              {article.term_slug && (
              <Link
                href={`/glossary/${article.term_slug}`}
                style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}
              >
                {article.term_name} definition →
              </Link>
              )}
              {article.cluster && (
              <Link
                href={`/glossary?cluster=${encodeURIComponent(article.cluster)}`}
                style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}
              >
                All {article.cluster.split(' ')[0]} terms →
              </Link>
              )}
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

      {/* Email capture */}
      <NewsletterCTA variant="article" />

      {/* What to read next */}
      {nextCards.length > 0 && (
        <div style={{ marginTop: '80px', paddingTop: '48px', borderTop: '1px solid var(--border-base)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '28px' }}>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', fontWeight: 600,
                color: 'var(--text-primary)', margin: '0 0 4px',
              }}>
                What to read next
              </h2>
              {curatedNextReads && (
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                  Picked for where you are now
                </p>
              )}
            </div>
            <Link href="/articles" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>
              All articles →
            </Link>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${nextCards.length}, 1fr)`,
              gap: '16px',
            }}
            className="continue-grid"
          >
            {nextCards.map(({ article: a, reason, label }) => (
              <ArticleCard
                key={a.slug}
                article={a}
                label={label}
                reason={reason}
              />
            ))}
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
