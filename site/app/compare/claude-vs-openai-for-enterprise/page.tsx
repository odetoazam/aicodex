import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Claude vs OpenAI for Enterprise — AI Codex',
  description: 'A practical comparison of Claude and OpenAI for enterprise deployments. Security, compliance, admin controls, instruction following, and what actually matters at scale.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Claude vs OpenAI for Enterprise',
  description: 'A practical comparison of Claude and OpenAI for enterprise deployments. Security, compliance, admin controls, instruction following, and what actually matters at scale.',
  author: { '@type': 'Organization', name: 'AI Codex', url: 'https://www.aicodex.to' },
  publisher: { '@type': 'Organization', name: 'AI Codex', url: 'https://www.aicodex.to' },
  url: 'https://www.aicodex.to/compare/claude-vs-openai-for-enterprise',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.aicodex.to/compare/claude-vs-openai-for-enterprise' },
}

const ACCENT_CLAUDE = '#D4845A'
const ACCENT_OAI = '#5B8DD9'

interface CompareRow {
  dimension: string
  claude: { verdict: 'better' | 'similar' | 'worse'; text: string }
  openai: { verdict: 'better' | 'similar' | 'worse'; text: string }
}

const ROWS: CompareRow[] = [
  {
    dimension: 'Data privacy defaults',
    claude: { verdict: 'better', text: 'Claude Enterprise does not use your data to train models by default. Clear data-processing agreements, SOC 2 Type II certified, HIPAA BAA available for eligible plans.' },
    openai: { verdict: 'similar', text: 'Enterprise tier also does not train on your data by default. SOC 2 Type II certified. HIPAA compliance available. Azure OpenAI adds additional compliance certifications if that matters to your legal team.' },
  },
  {
    dimension: 'Context window',
    claude: { verdict: 'better', text: '200k token context window. Handles a full contract stack, a large codebase, or a year of support tickets in a single request without chunking.' },
    openai: { verdict: 'worse', text: 'GPT-4o has a 128k context window. Functional for most tasks, but you will hit limits on very large document analysis or long agentic workflows.' },
  },
  {
    dimension: 'Instruction following',
    claude: { verdict: 'better', text: 'Reliably follows complex multi-step system prompts at production scale. Behavioral consistency — what you get in testing tends to hold in production across thousands of requests.' },
    openai: { verdict: 'similar', text: 'GPT-4o follows instructions well. Some teams report more drift on very long or contradictory system prompts compared to Claude. GPT-4 Turbo is more consistent than earlier versions.' },
  },
  {
    dimension: 'Safety defaults & refusals',
    claude: { verdict: 'worse', text: 'More conservative refusal defaults out of the box. Enterprise teams sometimes need to tune system prompts to stop Claude over-refusing on legitimate edge cases — legal, medical, security queries.' },
    openai: { verdict: 'better', text: 'Slightly more permissive defaults for enterprise use cases. Less likely to refuse ambiguous requests. Some security teams prefer this; others see it as a risk to manage.' },
  },
  {
    dimension: 'Admin controls',
    claude: { verdict: 'similar', text: 'Workspaces, admin console, user management, usage analytics. SSO via SAML 2.0 on Enterprise. Audit logs available. Domain verification for user provisioning.' },
    openai: { verdict: 'better', text: 'ChatGPT Enterprise and Azure OpenAI both have mature enterprise admin tooling. Azure adds enterprise-grade RBAC, private networking, and Microsoft 365 integration that many IT teams already know.' },
  },
  {
    dimension: 'On-premise / private cloud',
    claude: { verdict: 'worse', text: 'No on-premise option. Cloud-only (AWS-hosted). If your compliance requirements mandate that data never leaves your own infrastructure, Claude is not yet an option.' },
    openai: { verdict: 'better', text: 'Azure OpenAI Service provides a private deployment within your Azure tenant. Data stays in your cloud environment. This is the decisive factor for heavily regulated industries (finance, defence, healthcare).' },
  },
  {
    dimension: 'Model tiers for cost control',
    claude: { verdict: 'better', text: 'Haiku (fast, cheap) → Sonnet (balanced) → Opus (highest quality). Haiku is among the most cost-efficient models available for high-volume enterprise use cases like classification, extraction, and routing.' },
    openai: { verdict: 'similar', text: 'GPT-4o mini → GPT-4o. GPT-4o mini is competitive on cost for simpler tasks. The gap between tiers is well-documented, which helps with model routing decisions.' },
  },
  {
    dimension: 'Agentic workflows',
    claude: { verdict: 'better', text: 'Strong at multi-step agentic tasks. Claude tends to stay closer to instructions in long agent loops rather than drifting or improvising. The Agent SDK and MCP support are production-ready.' },
    openai: { verdict: 'similar', text: 'Assistants API, function calling, and Code Interpreter are mature. OpenAI has shipped more agentic product features earlier. If you want a fully managed agent layer rather than building your own, OpenAI has more options.' },
  },
  {
    dimension: 'Ecosystem & integrations',
    claude: { verdict: 'worse', text: 'Smaller ecosystem than OpenAI. Fewer third-party tools default to Claude. If your workflow depends on a specific integration (Zendesk, Salesforce native), check whether it supports Claude specifically.' },
    openai: { verdict: 'better', text: 'OpenAI has the largest third-party ecosystem. Most SaaS AI add-ons and integration platforms defaulted to OpenAI first. If ecosystem breadth and plug-and-play integrations matter, OpenAI has the advantage.' },
  },
  {
    dimension: 'Enterprise pricing',
    claude: { verdict: 'similar', text: 'Enterprise pricing is negotiated. Anthropic does not publish volume tiers publicly. Token-level API pricing is competitive. Teams report Claude is often cost-advantaged at high volume due to Haiku.' },
    openai: { verdict: 'similar', text: 'Enterprise pricing is also negotiated. Azure OpenAI pricing is published and predictable, which legal and finance teams prefer. Provisioned throughput options give guaranteed capacity.' },
  },
]

function VerdictBadge({ verdict }: { verdict: 'better' | 'similar' | 'worse' }) {
  const map = {
    better: { label: 'Stronger', bg: 'rgba(76,175,125,0.12)', color: '#4CAF7D' },
    similar: { label: 'Similar', bg: 'var(--bg-subtle)', color: 'var(--text-muted)' },
    worse: { label: 'Weaker', bg: 'rgba(91,141,217,0.1)', color: '#5B8DD9' },
  }
  const v = map[verdict]
  return (
    <span style={{
      display: 'inline-block',
      fontSize: '11px', fontFamily: 'var(--font-sans)', fontWeight: 500,
      padding: '2px 8px', borderRadius: '4px',
      background: v.bg, color: v.color,
    }}>
      {v.label}
    </span>
  )
}

export default function CompareEnterpriseCardPage() {
  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <div style={{ marginBottom: '32px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Link href="/compare" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>
          Compare
        </Link>
        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>→</span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Claude vs OpenAI for Enterprise
        </span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '56px' }}>
        <p className="eyebrow" style={{ marginBottom: '16px' }}>Comparison</p>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          marginBottom: '20px',
          maxWidth: '28ch',
        }}>
          Claude vs OpenAI for Enterprise
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-base)',
          color: 'var(--text-muted)',
          maxWidth: '56ch',
          lineHeight: 1.65,
        }}>
          A practical breakdown of what separates these two platforms when you're deploying at scale, negotiating a contract, or presenting a vendor recommendation to your security team.
        </p>
      </div>

      {/* TL;DR */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px',
        marginBottom: '56px',
      }} className="compare-tldr-grid">
        <div style={{
          padding: '24px',
          borderRadius: '10px',
          border: `2px solid ${ACCENT_CLAUDE}30`,
          background: `${ACCENT_CLAUDE}06`,
        }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: ACCENT_CLAUDE, marginBottom: '10px' }}>
            Claude — Best for
          </p>
          <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              'Document-heavy workflows (large context window)',
              'Agentic tasks that need consistent instruction following',
              'High-volume use cases where Haiku cuts cost dramatically',
              'Teams that want strong safety defaults without custom tuning',
            ].map(item => (
              <li key={item} style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div style={{
          padding: '24px',
          borderRadius: '10px',
          border: `2px solid ${ACCENT_OAI}30`,
          background: `${ACCENT_OAI}06`,
        }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: ACCENT_OAI, marginBottom: '10px' }}>
            OpenAI — Best for
          </p>
          <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              'Private cloud / on-premise via Azure OpenAI',
              'Teams already in the Microsoft ecosystem',
              'Maximum third-party integration breadth',
              'Regulated industries requiring data sovereignty guarantees',
            ].map(item => (
              <li key={item} style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Comparison table */}
      <div style={{ marginBottom: '56px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px' }}>
          Dimension-by-dimension breakdown
        </h2>

        {/* Table header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '200px 1fr 1fr', gap: '0',
          borderRadius: '10px 10px 0 0',
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border-base)',
          borderBottom: 'none',
        }} className="compare-header">
          <div style={{ padding: '12px 16px' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Dimension</span>
          </div>
          <div style={{ padding: '12px 16px', borderLeft: '1px solid var(--border-muted)' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 700, color: ACCENT_CLAUDE }}>Claude</span>
          </div>
          <div style={{ padding: '12px 16px', borderLeft: '1px solid var(--border-muted)' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 700, color: ACCENT_OAI }}>OpenAI</span>
          </div>
        </div>

        {ROWS.map((row, i) => (
          <div
            key={row.dimension}
            style={{
              display: 'grid', gridTemplateColumns: '200px 1fr 1fr',
              border: '1px solid var(--border-base)',
              borderTop: 'none',
              borderRadius: i === ROWS.length - 1 ? '0 0 10px 10px' : '0',
              background: i % 2 === 0 ? 'var(--bg-surface)' : 'transparent',
            }}
            className="compare-row"
          >
            <div style={{ padding: '16px', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {row.dimension}
              </span>
            </div>
            <div style={{ padding: '16px', borderLeft: '1px solid var(--border-muted)' }}>
              <VerdictBadge verdict={row.claude.verdict} />
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55, margin: '6px 0 0' }}>
                {row.claude.text}
              </p>
            </div>
            <div style={{ padding: '16px', borderLeft: '1px solid var(--border-muted)' }}>
              <VerdictBadge verdict={row.openai.verdict} />
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55, margin: '6px 0 0' }}>
                {row.openai.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* The deciding factor */}
      <div style={{
        padding: '32px',
        borderRadius: '12px',
        border: '1px solid var(--border-base)',
        background: 'var(--bg-surface)',
        marginBottom: '24px',
      }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
          The deciding factor
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
          <strong>If your IT or legal team requires data to stay in your own cloud infrastructure, OpenAI via Azure wins — full stop.</strong> Azure OpenAI gives you a private deployment in your Azure tenant, and no amount of Claude&apos;s other advantages changes that if it&apos;s a hard compliance requirement.
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
          For everyone else: Claude tends to be the stronger default for document-heavy, policy-bound, and agentic enterprise use cases. The 200k context window is a genuine advantage. Instruction-following consistency at scale reduces the &quot;it worked in testing, not in production&quot; problems that plague enterprise AI rollouts. And Haiku makes high-volume use cases significantly cheaper to operate.
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '0' }}>
          The places where OpenAI wins outside of Azure: ecosystem breadth (more plug-and-play integrations), slightly more permissive defaults for edge-case queries, and more mature managed agent tooling if you want Assistants API rather than building your own orchestration layer.
        </p>
      </div>

      {/* What the comparison misses */}
      <div style={{
        padding: '24px',
        borderRadius: '10px',
        border: '1px solid var(--border-muted)',
        background: 'var(--bg-subtle)',
        marginBottom: '40px',
      }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
          What this comparison misses
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
          Both platforms update their models, pricing, and enterprise features faster than any comparison page can track. Benchmark scores shift with each model release. Enterprise contract terms — data residency, BAA scope, SLA guarantees — are negotiated and may differ from published defaults. Verify specifics with your account team before making a procurement decision.
        </p>
      </div>

      {/* Related */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Link href="/articles/choosing-the-right-claude-model" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', padding: '8px 16px', border: '1px solid var(--accent)', borderRadius: '6px' }}>
          Choosing the right Claude model →
        </Link>
        <Link href="/articles/claude-admin-zero-to-one" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', padding: '8px 16px', border: '1px solid var(--accent)', borderRadius: '6px' }}>
          Claude admin setup guide →
        </Link>
        <Link href="/compare" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', padding: '8px 16px', border: '1px solid var(--border-base)', borderRadius: '6px' }}>
          All comparisons
        </Link>
      </div>

    </div>
  )
}
