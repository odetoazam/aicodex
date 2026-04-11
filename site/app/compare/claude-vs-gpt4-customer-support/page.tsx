import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Claude vs GPT-4 for Customer Support — AI Codex',
  description: 'A practical comparison of Claude and GPT-4 for customer support use cases. Refusal rates, tone, safety handling, and what actually matters in production.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Claude vs GPT-4 for Customer Support',
  description: 'A practical comparison of Claude and GPT-4 for customer support use cases. Refusal rates, tone, safety handling, and what actually matters in production.',
  author: { '@type': 'Organization', name: 'AI Codex', url: 'https://www.aicodex.to' },
  publisher: { '@type': 'Organization', name: 'AI Codex', url: 'https://www.aicodex.to' },
  url: 'https://www.aicodex.to/compare/claude-vs-gpt4-customer-support',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.aicodex.to/compare/claude-vs-gpt4-customer-support' },
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
    dimension: 'Tone & empathy',
    claude: { verdict: 'better', text: 'Consistently warm without being sycophantic. Naturally matches the emotional register of the user\'s message.' },
    gpt4: { verdict: 'similar', text: 'Capable of warmth but occasionally overshoots into hollow phrases like "Great question!" — especially with default system prompts.' },
  },
  {
    dimension: 'Refusal rate',
    claude: { verdict: 'worse', text: 'More conservative by default. Can refuse edge-case questions that are legitimate customer queries without careful prompt tuning.' },
    gpt4: { verdict: 'better', text: 'Slightly more permissive on ambiguous cases. Less likely to refuse routine customer queries, which reduces support friction.' },
  },
  {
    dimension: 'Following complex instructions',
    claude: { verdict: 'better', text: 'Reliably follows multi-step system prompt instructions. If you say "always start with an apology for delayed orders," it does.' },
    gpt4: { verdict: 'similar', text: 'Generally follows instructions but degrades with very long or contradictory system prompts.' },
  },
  {
    dimension: 'Context window',
    claude: { verdict: 'better', text: 'Large context window handles long conversation histories, full policy documents, and product catalogs without truncation.' },
    gpt4: { verdict: 'similar', text: 'GPT-4o has a 128k context window. Functional but Claude tends to maintain coherence better at the extreme end.' },
  },
  {
    dimension: 'Handling angry customers',
    claude: { verdict: 'better', text: 'Reliably de-escalates without matching the user\'s tone. Rare for Claude to become defensive or lecture users.' },
    gpt4: { verdict: 'similar', text: 'Handles escalation well in most cases but can occasionally mirror frustration or become overly formal under pressure.' },
  },
  {
    dimension: 'Policy adherence',
    claude: { verdict: 'better', text: 'Strong at deferring to provided policy text. If your system prompt includes return policy language, Claude applies it correctly.' },
    gpt4: { verdict: 'similar', text: 'Generally follows policy instructions but may extrapolate beyond the provided policy in ambiguous cases.' },
  },
  {
    dimension: 'Multilingual support',
    claude: { verdict: 'similar', text: 'Strong multilingual performance, responds in the user\'s language by default.' },
    gpt4: { verdict: 'similar', text: 'Strong multilingual performance. GPT-4 tends to have slightly broader language coverage for rare languages.' },
  },
  {
    dimension: 'API cost',
    claude: { verdict: 'better', text: 'Claude Haiku is substantially cheaper than GPT-3.5 Turbo for high-volume support at similar quality. Sonnet is competitive with GPT-4o.' },
    gpt4: { verdict: 'worse', text: 'GPT-4o pricing is competitive, but for high-volume support, cost adds up. GPT-3.5 Turbo is cheaper but quality gap is significant.' },
  },
  {
    dimension: 'Latency',
    claude: { verdict: 'similar', text: 'Claude Haiku is fast — competitive with GPT-3.5. Sonnet is comparable to GPT-4o. Both are acceptable for chat interfaces.' },
    gpt4: { verdict: 'similar', text: 'GPT-4o is faster than earlier GPT-4 versions. GPT-3.5 Turbo remains the lowest-latency option in the OpenAI lineup.' },
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

export default function CompareCustomerSupportPage() {
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
          Claude vs GPT-4 for Customer Support
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
          Claude vs GPT-4 for Customer Support
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-base)',
          color: 'var(--text-muted)',
          maxWidth: '56ch',
          lineHeight: 1.65,
        }}>
          A practical comparison for teams building support automation. Not benchmarks — actual behavior that matters when customers are frustrated and your system prompt has to hold the line.
        </p>
      </div>

      {/* TL;DR */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px',
        marginBottom: '56px',
      }} className="tldr-grid">
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
              'Complex policy adherence (returns, refunds, edge cases)',
              'Emotionally sensitive conversations',
              'Long conversation histories with full context',
              'High-volume support with Haiku for cost efficiency',
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
          border: `2px solid ${ACCENT_GPT}30`,
          background: `${ACCENT_GPT}06`,
        }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: ACCENT_GPT, marginBottom: '10px' }}>
            GPT-4 — Best for
          </p>
          <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              'Permissive handling of borderline requests',
              'Teams already deep in the OpenAI ecosystem',
              'Very high volume at lowest cost (GPT-3.5)',
              'Broader language coverage for rare languages',
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
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 700, color: ACCENT_GPT }}>GPT-4</span>
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
              <VerdictBadge verdict={row.gpt4.verdict} />
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55, margin: '6px 0 0' }}>
                {row.gpt4.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom line */}
      <div style={{
        padding: '32px',
        borderRadius: '12px',
        border: '1px solid var(--border-base)',
        background: 'var(--bg-surface)',
        marginBottom: '40px',
      }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
          The bottom line
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
          For most B2B and B2C customer support use cases, <strong>Claude is the stronger default choice</strong>. Its instruction-following is tighter, its tone is more naturally calibrated, and its handling of emotionally charged conversations is reliably better. The refusal rate is the main caveat — you&apos;ll need to tune your system prompt to reduce over-refusals on legitimate queries.
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '0' }}>
          The exception: if you&apos;re already deep in the OpenAI ecosystem (Assistants API, fine-tuning, existing integrations), the migration cost may outweigh the quality gain. Evaluate both against your real transcripts — not synthetic tests.
        </p>
      </div>

      {/* Related */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Link href="/articles/claude-for-customer-support" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', padding: '8px 16px', border: '1px solid var(--accent)', borderRadius: '6px' }}>
          Claude for customer support →
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
