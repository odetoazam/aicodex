import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Claude vs Gemini for Business — AI Codex',
  description: 'A practical comparison of Claude and Google Gemini for business use. Instruction following, context window, Google Workspace integration, safety defaults, and what actually determines the choice for teams.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Claude vs Gemini for Business',
  description: 'A practical comparison of Claude and Google Gemini for business use. Instruction following, context window, Google Workspace integration, safety defaults, and what actually determines the choice for teams.',
  author: { '@type': 'Organization', name: 'AI Codex', url: 'https://www.aicodex.to' },
  publisher: { '@type': 'Organization', name: 'AI Codex', url: 'https://www.aicodex.to' },
  url: 'https://www.aicodex.to/compare/claude-vs-gemini-for-business',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.aicodex.to/compare/claude-vs-gemini-for-business' },
}

const ACCENT_CLAUDE = '#D4845A'
const ACCENT_GEMINI = '#4285F4'

interface CompareRow {
  dimension: string
  claude: { verdict: 'better' | 'similar' | 'worse'; text: string }
  gemini: { verdict: 'better' | 'similar' | 'worse'; text: string }
}

const ROWS: CompareRow[] = [
  {
    dimension: 'Instruction following',
    claude: { verdict: 'better', text: 'Reliably follows complex multi-step system prompts. Behavioral consistency is a documented strength — what you get in testing tends to hold at production scale, across thousands of requests.' },
    gemini: { verdict: 'similar', text: 'Gemini 1.5 Pro follows instructions well in most cases. Some enterprise teams report more variability on long or constraint-heavy system prompts compared to Claude, though the gap has narrowed with recent model updates.' },
  },
  {
    dimension: 'Context window',
    claude: { verdict: 'similar', text: '200k token context window on Claude 3 and above. Handles large document sets, full codebases, or long conversation histories without chunking.' },
    gemini: { verdict: 'similar', text: 'Gemini 1.5 Pro supports up to 1 million token context — the largest available. In practice, quality on very long contexts can degrade, but for teams with genuine long-context needs, Gemini has the advantage on raw window size.' },
  },
  {
    dimension: 'Google Workspace integration',
    claude: { verdict: 'worse', text: 'Claude has a Google Drive connector for Teams/Enterprise users, but no native integration with Gmail, Docs, Sheets, or Google Meet. Workspace users need manual copy-paste or Zapier.' },
    gemini: { verdict: 'better', text: 'Gemini is built into Google Workspace. If your organization runs on Google — Gmail, Docs, Sheets, Meet, Drive — Gemini is embedded directly in those tools. For Workspace-heavy teams, this is a decisive integration advantage.' },
  },
  {
    dimension: 'Writing quality and tone',
    claude: { verdict: 'better', text: 'Widely regarded as producing higher-quality long-form prose. Less "AI voice" in drafts, better at matching a specified tone, and more likely to produce copy that sounds like it was written by a person.' },
    gemini: { verdict: 'worse', text: 'Gemini produces competent writing but tends toward a more generic, AI-smooth style on longer content. Teams doing significant content work (reports, proposals, client communications) typically prefer Claude for prose quality.' },
  },
  {
    dimension: 'Coding assistance',
    claude: { verdict: 'similar', text: 'Strong across languages. Claude Code is Anthropic\'s dedicated coding tool. Good at understanding large codebases, explaining unfamiliar code, and multi-file refactors. Instruction-following in code contexts is a noted strength.' },
    gemini: { verdict: 'similar', text: 'Gemini Code Assist integrates directly into VS Code, JetBrains, and other IDEs. For developers already in the Google ecosystem (Cloud, Firebase, Android), the native IDE integration is a workflow advantage over Claude Code\'s terminal-based approach.' },
  },
  {
    dimension: 'Multimodal (images, video)',
    claude: { verdict: 'worse', text: 'Claude can read and analyze images (screenshots, documents, diagrams). Does not support video natively. Good for image-based tasks; limited if video understanding is a requirement.' },
    gemini: { verdict: 'better', text: 'Native video understanding is a genuine Gemini differentiator. Gemini 1.5 Pro can process hours of video content in a single request. If your use case involves video analysis, meeting recordings, or multimodal workflows, Gemini has a meaningful lead.' },
  },
  {
    dimension: 'Safety defaults and refusals',
    claude: { verdict: 'worse', text: 'More conservative refusal defaults. Enterprise teams occasionally need to tune system prompts to prevent over-refusals on legitimate edge cases — legal language, medical content, security research.' },
    gemini: { verdict: 'better', text: 'Somewhat more permissive defaults for business queries. Less likely to refuse ambiguous professional requests. For teams that have run into Claude\'s conservative safety rails, Gemini may require less prompt tuning.' },
  },
  {
    dimension: 'Enterprise admin and compliance',
    claude: { verdict: 'similar', text: 'Claude Enterprise includes admin console, user management, SSO via SAML 2.0, audit logs, and SOC 2 Type II certification. HIPAA BAA available for eligible plans. No on-premise option.' },
    gemini: { verdict: 'better', text: 'Gemini for Google Workspace inherits Google\'s enterprise compliance posture — SOC 2, HIPAA, ISO 27001, GDPR. For organizations already using Google Workspace for Business or Enterprise, there is no new procurement or compliance review required.' },
  },
  {
    dimension: 'Pricing and cost structure',
    claude: { verdict: 'similar', text: 'API: Haiku (cheap/fast) → Sonnet (balanced) → Opus/Claude 4 (highest quality). Claude for Teams is $30/user/month. Enterprise is negotiated. Haiku is among the cheapest models for high-volume processing.' },
    gemini: { verdict: 'similar', text: 'Gemini for Workspace is bundled with Business and Enterprise Google Workspace plans — if you already pay for those, Gemini costs nothing additional in the base tier. API pricing via Google Cloud AI is competitive. Bundled pricing is a real advantage for Workspace shops.' },
  },
  {
    dimension: 'Ecosystem and third-party support',
    claude: { verdict: 'worse', text: 'Growing ecosystem, but smaller than Google\'s. Most third-party AI integrations defaulted to OpenAI first, then added Claude. Check your specific tool stack before assuming Claude is supported.' },
    gemini: { verdict: 'better', text: 'Google\'s ecosystem advantage is significant. Android, Chrome, Search, Maps, Cloud — Gemini is being embedded across Google\'s entire product surface. For teams using Google Cloud infrastructure or Android development, the integration depth is unmatched.' },
  },
]

function VerdictBadge({ verdict }: { verdict: 'better' | 'similar' | 'worse' }) {
  const map = {
    better:  { label: 'Stronger',  bg: 'rgba(76,175,125,0.12)',  color: '#4CAF7D' },
    similar: { label: 'Similar',   bg: 'var(--bg-subtle)',       color: 'var(--text-muted)' },
    worse:   { label: 'Weaker',    bg: 'rgba(91,141,217,0.1)',   color: '#5B8DD9' },
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

export default function ClaudeVsGeminiPage() {
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
          Claude vs Gemini for Business
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
          maxWidth: '26ch',
        }}>
          Claude vs Gemini for Business
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-base)',
          color: 'var(--text-muted)',
          maxWidth: '56ch',
          lineHeight: 1.65,
        }}>
          Claude and Gemini are the two main alternatives to OpenAI for business use. This covers the dimensions that actually determine which one fits your team.
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
              'Writing quality and long-form prose',
              'Complex instruction following at production scale',
              'Document analysis and knowledge work',
              'Teams that want an alternative to Google\'s ecosystem',
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
          border: `2px solid ${ACCENT_GEMINI}30`,
          background: `${ACCENT_GEMINI}06`,
        }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: ACCENT_GEMINI, marginBottom: '10px' }}>
            Gemini — Best for
          </p>
          <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              'Google Workspace-heavy organizations',
              'Video understanding and multimodal workflows',
              'Teams already paying for Google Workspace Business/Enterprise',
              'Android or Google Cloud development',
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
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 700, color: ACCENT_GEMINI }}>Gemini</span>
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
              <VerdictBadge verdict={row.gemini.verdict} />
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55, margin: '6px 0 0' }}>
                {row.gemini.text}
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
          <strong>If your organization runs on Google Workspace and has not committed to a separate AI vendor, Gemini is the path of least resistance.</strong> It is already embedded in the tools your team uses every day — Gmail, Docs, Sheets — and if you are on a Business or Enterprise Workspace plan, you may already be paying for it. The integration advantage is real and difficult for Claude to match without a lot of tooling.
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
          For teams where the tool stack does not center on Google — or where writing quality, instruction-following consistency, and complex document work are the primary use cases — Claude is typically the better choice. The prose quality difference is meaningful for any team doing significant writing work. And Claude&apos;s behavioral consistency in production is a real advantage for operators building workflows where reliability matters.
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '0' }}>
          The video understanding gap is worth noting: if your use case involves analyzing video content — meeting recordings, training videos, customer demos — Gemini currently has a meaningful lead. This is the one area where Gemini has a clear capability advantage that is not about ecosystem fit.
        </p>
      </div>

      {/* Caveat */}
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
          Both Claude and Gemini are updated frequently. Model capabilities, pricing, and enterprise features change with each release. Gemini&apos;s model naming (Ultra, Pro, Flash, Nano) and product surface (Gemini app vs Workspace vs Vertex AI) is complex — the version you test may not be the version your team deploys. Always validate current pricing, availability, and compliance certifications directly with Anthropic or Google before making a procurement decision.
        </p>
      </div>

      {/* Related */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Link href="/compare/claude-vs-openai-for-enterprise" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', padding: '8px 16px', border: '1px solid var(--accent)', borderRadius: '6px' }}>
          Claude vs OpenAI for Enterprise →
        </Link>
        <Link href="/articles/choosing-the-right-claude-model" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', padding: '8px 16px', border: '1px solid var(--accent)', borderRadius: '6px' }}>
          Choosing the right Claude model →
        </Link>
        <Link href="/compare" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', padding: '8px 16px', border: '1px solid var(--border-base)', borderRadius: '6px' }}>
          All comparisons
        </Link>
      </div>

    </div>
  )
}
