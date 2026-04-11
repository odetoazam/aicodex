import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Claude vs GPT-4 for Coding — AI Codex',
  description: 'A practical comparison of Claude and GPT-4 for coding tasks. Code generation quality, context handling, debugging, and what developers actually experience in production.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Claude vs GPT-4 for Coding',
  description: 'A practical comparison of Claude and GPT-4 for coding tasks. Code generation quality, context handling, debugging, and what developers actually experience in production.',
  author: { '@type': 'Organization', name: 'AI Codex', url: 'https://www.aicodex.to' },
  publisher: { '@type': 'Organization', name: 'AI Codex', url: 'https://www.aicodex.to' },
  url: 'https://www.aicodex.to/compare/claude-vs-gpt4-coding',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.aicodex.to/compare/claude-vs-gpt4-coding' },
}

const ACCENT_CLAUDE = '#D4845A'
const ACCENT_GPT = '#5B8DD9'

interface CompareRow {
  dimension: string
  claude: { verdict: 'better' | 'similar' | 'worse'; text: string }
  gpt4: { verdict: 'better' | 'similar' | 'worse'; text: string }
}

const ROWS: CompareRow[] = [
  {
    dimension: 'Code generation quality',
    claude: { verdict: 'better', text: 'Produces clean, well-structured code with consistent style. Strong at understanding intent and writing idiomatic code — not just code that works.' },
    gpt4: { verdict: 'similar', text: 'Excellent code generation. GPT-4o is competitive with Claude on most standard coding tasks.' },
  },
  {
    dimension: 'Handling large codebases',
    claude: { verdict: 'better', text: 'Large context window + strong coherence at the extreme end. Can reason about an entire file or module without losing the thread. Claude Code is built on this.' },
    gpt4: { verdict: 'similar', text: 'GPT-4o has 128k context but degrades faster than Claude on tasks requiring synthesis across a very long codebase.' },
  },
  {
    dimension: 'Debugging & root cause analysis',
    claude: { verdict: 'better', text: 'Unusually good at "here\'s the stack trace and relevant code — what\'s wrong?" tasks. Surfaces non-obvious root causes rather than just suggesting the obvious fix.' },
    gpt4: { verdict: 'similar', text: 'Strong debugging capability, especially when given full context. Less likely than Claude to catch subtle logic errors vs. syntax issues.' },
  },
  {
    dimension: 'Explanation & documentation',
    claude: { verdict: 'better', text: 'Exceptional at explaining what code does and why — at the right level of detail for the question asked. Less likely to over-explain obvious things.' },
    gpt4: { verdict: 'similar', text: 'Clear explanations but occasionally verbose. May pad with generic programming advice when a precise answer is what\'s needed.' },
  },
  {
    dimension: 'Following strict output formats',
    claude: { verdict: 'better', text: 'More reliably follows instructions like "output only the code block, no explanation" — important for programmatic use.' },
    gpt4: { verdict: 'worse', text: 'Tends to add commentary and explanation even when instructed not to. Requires more prompt engineering to get clean output for automation.' },
  },
  {
    dimension: 'Agentic / multi-step coding',
    claude: { verdict: 'better', text: 'Claude\'s extended thinking and careful step-by-step reasoning makes it better at complex, multi-step refactors and architecture decisions.' },
    gpt4: { verdict: 'similar', text: 'GPT-4 with code interpreter is strong for multi-step tasks. Less reliable for architectural reasoning across large scopes.' },
  },
  {
    dimension: 'Speed (for quick lookups)',
    claude: { verdict: 'similar', text: 'Claude Haiku is fast and capable for simple coding questions. Sonnet is the right model for serious work.' },
    gpt4: { verdict: 'better', text: 'GPT-3.5 Turbo is very fast and cheap for simple tasks. For quick autocomplete-style queries, OpenAI has more infrastructure breadth.' },
  },
  {
    dimension: 'Tool / plugin ecosystem',
    claude: { verdict: 'worse', text: 'Fewer third-party integrations. Claude Code (Anthropic\'s CLI) is excellent but the broader plugin ecosystem is smaller.' },
    gpt4: { verdict: 'better', text: 'Much larger ecosystem: GitHub Copilot, Cursor, Continue, and hundreds of integrations. If you want IDE integration, GPT-4 options are more mature.' },
  },
  {
    dimension: 'API cost for coding tasks',
    claude: { verdict: 'better', text: 'Claude Sonnet is well-priced for production coding tasks. The quality-to-cost ratio is strong, especially with prompt caching for shared context.' },
    gpt4: { verdict: 'similar', text: 'GPT-4o pricing is competitive. GPT-3.5 is cheaper but quality degrades significantly on complex tasks.' },
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

export default function CompareGPT4CodingPage() {
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
          Claude vs GPT-4 for Coding
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
          maxWidth: '22ch',
        }}>
          Claude vs GPT-4 for Coding
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-base)',
          color: 'var(--text-muted)',
          maxWidth: '54ch',
          lineHeight: 1.65,
        }}>
          From one-shot code generation to complex refactors and agentic workflows. What developers actually experience when they build with each model in production.
        </p>
      </div>

      {/* TL;DR */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '56px' }} className="tldr-grid">
        <div style={{ padding: '24px', borderRadius: '10px', border: `2px solid ${ACCENT_CLAUDE}30`, background: `${ACCENT_CLAUDE}06` }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: ACCENT_CLAUDE, marginBottom: '10px' }}>
            Claude — Best for
          </p>
          <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              'Large codebase refactors requiring deep context',
              'Debugging complex, non-obvious issues',
              'Agentic coding tasks (multi-step, sequential)',
              'Programmatic output where clean format matters',
              'Code explanation and documentation generation',
            ].map(item => (
              <li key={item} style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item}</li>
            ))}
          </ul>
        </div>
        <div style={{ padding: '24px', borderRadius: '10px', border: `2px solid ${ACCENT_GPT}30`, background: `${ACCENT_GPT}06` }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: ACCENT_GPT, marginBottom: '10px' }}>
            GPT-4 — Best for
          </p>
          <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              'IDE integrations (Copilot, Cursor, Continue)',
              'Simple, fast coding lookups (GPT-3.5)',
              'Teams already using OpenAI infrastructure',
              'Plugin ecosystem and third-party tooling',
            ].map(item => (
              <li key={item} style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Table */}
      <div style={{ marginBottom: '56px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px' }}>
          Dimension-by-dimension breakdown
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 1fr', borderRadius: '10px 10px 0 0', background: 'var(--bg-subtle)', border: '1px solid var(--border-base)', borderBottom: 'none' }} className="compare-header">
          <div style={{ padding: '12px 16px' }}><span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Dimension</span></div>
          <div style={{ padding: '12px 16px', borderLeft: '1px solid var(--border-muted)' }}><span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 700, color: ACCENT_CLAUDE }}>Claude</span></div>
          <div style={{ padding: '12px 16px', borderLeft: '1px solid var(--border-muted)' }}><span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 700, color: ACCENT_GPT }}>GPT-4</span></div>
        </div>

        {ROWS.map((row, i) => (
          <div key={row.dimension} style={{ display: 'grid', gridTemplateColumns: '200px 1fr 1fr', border: '1px solid var(--border-base)', borderTop: 'none', borderRadius: i === ROWS.length - 1 ? '0 0 10px 10px' : '0', background: i % 2 === 0 ? 'var(--bg-surface)' : 'transparent' }} className="compare-row">
            <div style={{ padding: '16px' }}><span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>{row.dimension}</span></div>
            <div style={{ padding: '16px', borderLeft: '1px solid var(--border-muted)' }}>
              <VerdictBadge verdict={row.claude.verdict} />
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55, margin: '6px 0 0' }}>{row.claude.text}</p>
            </div>
            <div style={{ padding: '16px', borderLeft: '1px solid var(--border-muted)' }}>
              <VerdictBadge verdict={row.gpt4.verdict} />
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55, margin: '6px 0 0' }}>{row.gpt4.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom line */}
      <div style={{ padding: '32px', borderRadius: '12px', border: '1px solid var(--border-base)', background: 'var(--bg-surface)', marginBottom: '40px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
          The bottom line
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
          For raw coding quality on complex tasks, <strong>Claude edges ahead</strong> — particularly for large-context refactors, debugging non-obvious issues, and anything requiring clean, structured output for programmatic use. The difference is most visible on tasks that push the boundaries of what a model can hold in mind.
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          The practical counterargument: if you use VS Code or JetBrains and want native IDE integration, the GPT-4 ecosystem (Copilot, Cursor, Continue) is more mature. Claude Code CLI is excellent but it&apos;s a different workflow. Don&apos;t switch models just for quality if the tooling friction is real for your team.
        </p>
      </div>

      {/* Related */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Link href="/articles/your-first-claude-api-call" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', padding: '8px 16px', border: '1px solid var(--accent)', borderRadius: '6px' }}>
          Build with the Claude API →
        </Link>
        <Link href="/compare" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', padding: '8px 16px', border: '1px solid var(--border-base)', borderRadius: '6px' }}>
          All comparisons
        </Link>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .tldr-grid { grid-template-columns: 1fr !important; }
          .compare-header { grid-template-columns: 1fr !important; }
          .compare-row { grid-template-columns: 1fr !important; }
          .compare-header > div:not(:first-child) { border-left: none !important; border-top: 1px solid var(--border-muted); }
          .compare-row > div:not(:first-child) { border-left: none !important; border-top: 1px solid var(--border-muted); }
        }
      `}</style>
    </div>
  )
}
