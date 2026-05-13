import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Building Your Internal AI Stack — AI Codex',
  description: 'Eight guides on the data layer your AI agents need: MCP server architecture, token economics, caching, access control, warehouse choices, and the skills layer.',
}

const ACCENT = '#4A7BA7'
const ACCENT_BG = 'rgba(74,123,167,0.1)'

const STEPS = [
  {
    number: 1,
    articleSlug: 'internal-mcp-server-explained',
    label: 'The concept: one routing layer for all your data',
    takeaway: 'Why connecting Claude directly to each tool (CRM, billing, support, comms) breaks at scale — and how an internal MCP server solves it with a single interface, shaped responses, and access control baked in.',
    time: '9 min',
  },
  {
    number: 2,
    articleSlug: 'ai-data-access-token-economics',
    label: 'Why how you fetch data costs more than your model choice',
    takeaway: 'The three tiers: warehouse SQL (cheapest), internal MCP live API (middle), native connectors (10-50x more expensive). A morning routine skill can consume 400,000 tokens before a user asks a single question. Here\'s how that happens and how to prevent it.',
    time: '10 min',
  },
  {
    number: 3,
    articleSlug: 'live-api-vs-etl-for-ai',
    label: 'Which data goes in a warehouse vs. stays live',
    takeaway: 'The decision framework: freshness under one hour means live API, aggregate or cross-system queries mean warehouse. The key is routing both through the same internal MCP so the caller never needs to know which path was taken.',
    time: '8 min',
  },
  {
    number: 4,
    articleSlug: 'ai-agent-cold-start-caching',
    label: 'Eliminating the expensive moment at session start',
    takeaway: 'A cron job at 3–4 AM that pre-fetches and caches context shifts token cost from user sessions to a background API key. What to cache, what to keep live, and why this single change can reduce cold-start cost by 95%.',
    time: '8 min',
  },
  {
    number: 5,
    articleSlug: 'data-warehouse-for-ai-agents',
    label: 'BigQuery vs StarRocks for agent workloads',
    takeaway: 'BigQuery\'s per-query pricing made sense for analysts running a few large queries a day. AI agents make many small queries all day. StarRocks at ~$200/month flat with sub-second latency is a better fit — here\'s when to switch.',
    time: '9 min',
  },
  {
    number: 6,
    articleSlug: 'ai-agent-access-control',
    label: 'Access control: why prompts are not enough',
    takeaway: 'When you give AI access to company data, "everyone gets everything" is not acceptable. Tool-level permissions enforced in middleware — not by the model — are the only reliable solution. How to build it.',
    time: '9 min',
  },
  {
    number: 7,
    articleSlug: 'building-ai-skills-for-your-team',
    label: 'Turning repeated workflows into reusable tools',
    takeaway: 'A skill is a markdown file that encodes a multi-step AI workflow: which system to query, which fields matter, how to format output. Once written, any team member can invoke it by name. How to identify, build, and publish them.',
    time: '10 min',
  },
  {
    number: 8,
    articleSlug: 'internal-ai-stack-architecture',
    label: 'What it looks like when you build it properly',
    takeaway: 'The five-layer stack: UI, skills, internal MCP, live API + warehouse, pre-fetch cache. The target metrics: cold-start under 10k tokens, queries under 2s, zero permission violations, 80%+ of weekly repeated workflows automated.',
    time: '11 min',
  },
]

export default function LearnInternalAIStackPage() {
  const totalTime = STEPS.reduce((sum, s) => sum + parseInt(s.time), 0)

  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)' }}>
        <Link href="/learn" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Learn</Link>
        <span>›</span>
        <span style={{ color: 'var(--text-secondary)' }}>Building your internal AI stack</span>
      </nav>

      {/* Header */}
      <div style={{ marginBottom: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <span style={{
            padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600,
            fontFamily: 'var(--font-sans)', letterSpacing: '0.04em',
            background: ACCENT_BG, color: ACCENT,
          }}>
            for engineering leads &amp; ops teams
          </span>
          <span style={{
            padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 500,
            background: 'var(--bg-subtle)', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)',
          }}>
            {STEPS.length} guides · ~{totalTime} min
          </span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(22px, 3vw, 30px)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          marginBottom: '16px',
        }}>
          Building your internal AI stack
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)',
          color: 'var(--text-muted)', maxWidth: '56ch', lineHeight: 1.65,
        }}>
          Most teams connect Claude to their tools one connector at a time and wonder why it&apos;s slow and expensive.
          These eight guides cover the architecture that fixes it: a single internal MCP server, the right data access
          patterns, caching that eliminates cold start, access control that actually works, and the skills layer that
          turns repeated workflows into one-command automation.
        </p>
      </div>

      {/* Steps */}
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', left: '19px', top: '40px', bottom: '40px',
          width: '1px', background: 'var(--border-base)',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {STEPS.map((step, i) => (
            <div key={step.number} style={{ paddingLeft: '52px', paddingBottom: i === STEPS.length - 1 ? '0' : '4px' }}>
              <Link href={`/articles/${step.articleSlug}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div
                  style={{
                    position: 'relative', padding: '20px 24px', borderRadius: '8px',
                    border: '1px solid var(--border-base)', background: 'var(--bg-surface)',
                    borderLeft: `3px solid ${ACCENT}40`,
                    transition: 'border-left-color 150ms ease, background 150ms ease',
                  }}
                  className="ias-step-card"
                >
                  <div style={{
                    position: 'absolute', left: '-34px', top: '20px',
                    width: '28px', height: '28px', borderRadius: '4px',
                    background: 'var(--bg-base)', border: '1px solid var(--border-base)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)',
                  }}>
                    {String(step.number).padStart(2, '0')}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600,
                        color: 'var(--text-primary)', margin: '0 0 6px', lineHeight: 1.3,
                      }}>
                        {step.label}
                      </p>
                      <p style={{
                        fontFamily: 'var(--font-sans)', fontSize: '13px',
                        color: 'var(--text-muted)', margin: 0, lineHeight: 1.6,
                      }}>
                        {step.takeaway}
                      </p>
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)',
                      flexShrink: 0, paddingTop: '2px',
                    }}>
                      {step.time}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .ias-step-card:hover {
          background: var(--bg-subtle) !important;
          border-left-color: ${ACCENT} !important;
        }
      `}</style>
    </div>
  )
}
