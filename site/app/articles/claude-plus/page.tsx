import Link from 'next/link'
import type { Metadata } from 'next'
import { getArticlesBySlugs } from '@/lib/db'
import { CLUSTER_MAP, ANGLE_LABELS } from '@/lib/clusters'
import type { Article } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Claude + Tool guides — AI Codex',
  description: 'Practical guides for using Claude alongside the tools your team already uses — Notion, Slack, HubSpot, Jira, Salesforce, and more. 15+ guides, one collection.',
}

// All Claude + Tool guides, in display order
// Each tool has a name and the matching slug
const CLAUDE_PLUS_GUIDES: { tool: string; slug: string; description: string }[] = [
  {
    tool: 'Notion',
    slug: 'claude-plus-notion',
    description: 'Using Claude as a thinking partner inside your workspace — for docs, meeting notes, and project planning.',
  },
  {
    tool: 'Google Docs',
    slug: 'claude-plus-google-docs',
    description: 'Drafting, editing, and restructuring documents without leaving the editor.',
  },
  {
    tool: 'Google Sheets',
    slug: 'claude-plus-google-sheets',
    description: 'Writing formulas, analyzing data, and automating repetitive spreadsheet work.',
  },
  {
    tool: 'Slack',
    slug: 'claude-plus-slack-for-teams',
    description: 'Triaging messages, drafting team updates, and making Slack less of a context-switching trap.',
  },
  {
    tool: 'HubSpot',
    slug: 'claude-plus-hubspot',
    description: 'Prospecting research, CRM notes, and follow-up sequences — without leaving your pipeline.',
  },
  {
    tool: 'Salesforce',
    slug: 'claude-plus-salesforce',
    description: 'Deal research, account summaries, and meeting prep for sales teams on Salesforce.',
  },
  {
    tool: 'Jira',
    slug: 'claude-plus-jira',
    description: 'Writing tickets, summarizing sprints, and keeping your backlog from becoming a graveyard.',
  },
  {
    tool: 'Confluence',
    slug: 'claude-plus-confluence',
    description: 'Keeping documentation current — writing pages from meetings, updating runbooks after incidents, capturing institutional knowledge before it walks out the door.',
  },
  {
    tool: 'Intercom',
    slug: 'claude-plus-intercom',
    description: 'Drafting customer responses, summarizing support history, and reducing time-to-resolution.',
  },
  {
    tool: 'Zapier',
    slug: 'claude-plus-zapier',
    description: 'Building Claude into automated workflows — without writing code.',
  },
  {
    tool: 'Airtable',
    slug: 'claude-plus-airtable',
    description: 'Structuring messy data, generating views, and using Claude to query your bases in plain English.',
  },
  {
    tool: 'Figma',
    slug: 'claude-plus-figma',
    description: 'Writing copy, summarizing design feedback, and bridging the design–engineering handoff.',
  },
  {
    tool: 'Asana',
    slug: 'claude-plus-asana',
    description: 'Creating tasks from meeting notes, summarizing project status, and writing project briefs.',
  },
  {
    tool: 'Webflow',
    slug: 'claude-plus-webflow',
    description: 'Writing and editing site copy, generating structured content, and maintaining consistency at scale.',
  },
  {
    tool: 'Linear',
    slug: 'claude-plus-linear',
    description: 'Writing engineering issues, release notes, and keeping your Linear setup clean.',
  },
]

function GuideCard({ article, tool, description }: { article: Article | undefined; tool: string; description: string }) {
  const config = article ? CLUSTER_MAP[article.cluster] : undefined

  if (!article) {
    // Not yet published — show a placeholder
    return (
      <div style={{
        padding: '20px 22px',
        borderRadius: '8px',
        border: '1px solid var(--border-muted)',
        background: 'var(--bg-subtle)',
        opacity: 0.6,
      }}>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
          letterSpacing: '0.06em', textTransform: 'uppercase' as const,
          color: 'var(--text-muted)', margin: '0 0 8px',
        }}>
          Claude + {tool}
        </p>
        <p style={{
          fontFamily: 'var(--font-serif)', fontSize: '15px', fontWeight: 600,
          color: 'var(--text-muted)', lineHeight: 1.3, margin: '0 0 8px',
        }}>
          Coming soon
        </p>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: '13px',
          color: 'var(--text-muted)', lineHeight: 1.55, margin: 0,
        }}>
          {description}
        </p>
      </div>
    )
  }

  return (
    <Link href={`/articles/${article.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        padding: '20px 22px',
        borderRadius: '8px',
        border: '1px solid var(--border-base)',
        background: 'var(--bg-surface)',
        borderTop: `3px solid ${config?.color ?? 'var(--accent)'}`,
        height: '100%',
        boxSizing: 'border-box' as const,
        transition: 'border-color 150ms ease',
      }}
        className="guide-card"
      >
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
          letterSpacing: '0.06em', textTransform: 'uppercase' as const,
          color: config?.color ?? 'var(--accent)', margin: '0 0 10px',
        }}>
          Claude + {tool}
        </p>
        <p style={{
          fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: 600,
          color: 'var(--text-primary)', lineHeight: 1.3, margin: '0 0 8px',
        }}>
          {article.title}
        </p>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: '13px',
          color: 'var(--text-muted)', lineHeight: 1.55, margin: '0 0 16px',
          display: '-webkit-box' as const, WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
        }}>
          {description}
        </p>
        <span style={{
          fontFamily: 'var(--font-sans)', fontSize: '13px',
          color: config?.color ?? 'var(--accent)',
        }}>
          {article.read_time} min read →
        </span>
      </div>
    </Link>
  )
}

export default async function ClaudePlusPage() {
  const slugs = CLAUDE_PLUS_GUIDES.map(g => g.slug)
  const articles = await getArticlesBySlugs(slugs)
  const bySlug = new Map(articles.map(a => [a.slug, a]))

  const publishedCount = articles.length

  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)' }}>
        <Link href="/articles" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Articles</Link>
        <span>›</span>
        <span style={{ color: 'var(--accent)' }}>Claude + Tool guides</span>
      </nav>

      {/* Header */}
      <div style={{ marginBottom: '64px', maxWidth: '60ch' }}>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
          letterSpacing: '0.07em', textTransform: 'uppercase' as const,
          color: 'var(--accent)', margin: '0 0 16px',
        }}>
          Series
        </p>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'var(--text-3xl)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          marginBottom: '20px',
        }}>
          Claude + Tool
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)',
          color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '16px',
        }}>
          Practical guides for using Claude alongside the tools your team already uses.
          Not AI in general — Claude specifically, paired with the tool you're already in.
          What works, what doesn't, and the workflows that actually stick.
        </p>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: '13px',
          color: 'var(--text-muted)',
        }}>
          {publishedCount} guide{publishedCount === 1 ? '' : 's'} published · more in progress
        </p>
      </div>

      {/* Guide grid */}
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}
        className="guides-grid"
      >
        {CLAUDE_PLUS_GUIDES.map(({ tool, slug, description }) => (
          <GuideCard
            key={slug}
            article={bySlug.get(slug)}
            tool={tool}
            description={description}
          />
        ))}
      </div>

      {/* Bottom CTA */}
      <div style={{
        marginTop: '80px',
        paddingTop: '48px',
        borderTop: '1px solid var(--border-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap' as const,
        gap: '16px',
      }}>
        <div>
          <p style={{
            fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)',
            fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px',
          }}>
            Don't see your tool?
          </p>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '14px',
            color: 'var(--text-muted)', lineHeight: 1.6,
          }}>
            Most of the same principles apply. The integration guides in the{' '}
            <Link href="/integrations" style={{ color: 'var(--accent)', textDecoration: 'none' }}>integrations section</Link>
            {' '}cover the connector layer. For personal workflow guides, see the{' '}
            <Link href="/articles?tab=productivity" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Productivity tab</Link>.
          </p>
        </div>
        <Link
          href="/articles"
          style={{
            fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500,
            color: 'var(--accent)', textDecoration: 'none', whiteSpace: 'nowrap' as const,
          }}
        >
          All articles →
        </Link>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .guides-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          .guides-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        .guide-card:hover {
          border-color: rgba(212,132,90,0.4) !important;
        }
      `}</style>
    </div>
  )
}
