import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Claude Haiku vs Sonnet — When to use which — AI Codex',
  description: 'When to use Claude Haiku vs Sonnet. Practical guidance on the cost-quality tradeoff, latency differences, and which tasks each model handles best in production.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Claude Haiku vs Sonnet — When to use which',
  description: 'Practical guidance on the cost-quality tradeoff between Claude Haiku and Sonnet, with task-by-task recommendations for production use.',
  author: { '@type': 'Organization', name: 'AI Codex', url: 'https://www.aicodex.to' },
  publisher: { '@type': 'Organization', name: 'AI Codex', url: 'https://www.aicodex.to' },
  url: 'https://www.aicodex.to/compare/claude-haiku-vs-sonnet',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.aicodex.to/compare/claude-haiku-vs-sonnet' },
}

const ACCENT_HAIKU = '#4CAF7D'
const ACCENT_SONNET = '#D4845A'

const ROWS = [
  {
    dimension: 'Response quality',
    haiku: { verdict: 'worse' as const, text: 'Excellent for structured tasks, simple Q&A, classification, and extraction. Noticeably weaker on nuanced reasoning or multi-step logic.' },
    sonnet: { verdict: 'better' as const, text: 'Handles complex reasoning, nuanced writing, and ambiguous instructions reliably. The workhorse model for production apps that need real quality.' },
  },
  {
    dimension: 'Speed',
    haiku: { verdict: 'better' as const, text: 'Fastest Claude model. Noticeably snappier in chat interfaces. Best for latency-sensitive use cases where you want <1s first-token.' },
    sonnet: { verdict: 'similar' as const, text: 'Fast enough for most production use cases. Streaming masks latency well. Noticeably slower than Haiku on high-volume tasks.' },
  },
  {
    dimension: 'Cost',
    haiku: { verdict: 'better' as const, text: 'Substantially cheaper per million tokens. For high-volume use cases (support, classification, pipelines), Haiku can cut costs by 70–90% vs Sonnet.' },
    sonnet: { verdict: 'worse' as const, text: 'More expensive, but the cost is justified for tasks that actually need the quality. Wrong choice for bulk classification or simple data extraction.' },
  },
  {
    dimension: 'Instruction following',
    haiku: { verdict: 'worse' as const, text: 'Follows clear, simple instructions well. Degrades with very long or contradictory system prompts. Needs tighter, simpler prompts to perform consistently.' },
    sonnet: { verdict: 'better' as const, text: 'Reliable with complex, multi-part system prompts. Handles edge cases in instructions better. More forgiving of prompt imprecision.' },
  },
  {
    dimension: 'Coding tasks',
    haiku: { verdict: 'worse' as const, text: 'Handles simple code generation and explanation well. Misses edge cases and writes less idiomatic code on complex tasks. Not for production code review.' },
    sonnet: { verdict: 'better' as const, text: 'Strong coding model. Use for code generation, debugging, and refactoring. Close to Opus for most everyday coding tasks at a fraction of the cost.' },
  },
  {
    dimension: 'Document analysis',
    haiku: { verdict: 'similar' as const, text: 'Good at extraction, summarization, and classification from documents when the task is well-defined. Less reliable for synthesis across multiple sources.' },
    sonnet: { verdict: 'better' as const, text: 'Better at synthesis, inference, and nuanced interpretation. Use when the analysis requires judgment, not just pattern-matching.' },
  },
  {
    dimension: 'Classification / routing',
    haiku: { verdict: 'better' as const, text: 'Excellent choice. Fast, cheap, reliable for binary or multi-class classification with a clear rubric. The right model for 95% of classification pipelines.' },
    sonnet: { verdict: 'worse' as const, text: 'Overkill for most classification. Unless your categories are genuinely ambiguous and need deep reasoning, Haiku is the better pick.' },
  },
  {
    dimension: 'Customer-facing chat',
    haiku: { verdict: 'worse' as const, text: 'Acceptable for simple FAQ-style support. Tone is slightly flatter. May stumble on edge cases that require nuanced judgment.' },
    sonnet: { verdict: 'better' as const, text: 'Better emotional calibration, more consistent adherence to complex policies. Worth the cost for any customer-facing use case where quality reflects on your brand.' },
  },
]

function VerdictBadge({ verdict }: { verdict: 'better' | 'similar' | 'worse' }) {
  const map = {
    better: { label: 'Stronger', bg: 'rgba(76,175,125,0.12)', color: '#4CAF7D' },
    similar: { label: 'Similar', bg: 'var(--bg-subtle)', color: 'var(--text-muted)' },
    worse: { label: 'Weaker', bg: 'rgba(212,132,90,0.1)', color: '#D4845A' },
  }
  const v = map[verdict]
  return (
    <span style={{ display: 'inline-block', fontSize: '11px', fontFamily: 'var(--font-sans)', fontWeight: 500, padding: '2px 8px', borderRadius: '4px', background: v.bg, color: v.color }}>
      {v.label}
    </span>
  )
}

export default function HaikuVsSonnetPage() {
  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <div style={{ marginBottom: '32px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Link href="/compare" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>Compare</Link>
        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>→</span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)' }}>Claude Haiku vs Sonnet</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '56px' }}>
        <p className="eyebrow" style={{ marginBottom: '16px' }}>Comparison</p>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '20px', maxWidth: '28ch' }}>
          Claude Haiku vs Sonnet — When to use which
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-muted)', maxWidth: '54ch', lineHeight: 1.65 }}>
          The most common model decision developers face. Haiku is fast and cheap. Sonnet is more capable. The right answer depends entirely on your task — here&apos;s how to think about it.
        </p>
      </div>

      {/* Cost snapshot */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }} className="tldr-grid">
        <div style={{ padding: '24px', borderRadius: '10px', border: `2px solid ${ACCENT_HAIKU}30`, background: `${ACCENT_HAIKU}06` }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: ACCENT_HAIKU, marginBottom: '10px' }}>
            Haiku — Use when
          </p>
          <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {['High volume, cost is a real constraint', 'Classification, routing, extraction tasks', 'Latency is critical (<500ms first token)', 'Simple, well-defined tasks with clear rubrics', 'You\'ve validated quality is acceptable'].map(item => (
              <li key={item} style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item}</li>
            ))}
          </ul>
        </div>
        <div style={{ padding: '24px', borderRadius: '10px', border: `2px solid ${ACCENT_SONNET}30`, background: `${ACCENT_SONNET}06` }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: ACCENT_SONNET, marginBottom: '10px' }}>
            Sonnet — Use when
          </p>
          <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {['Quality directly affects your product\'s reputation', 'Complex instructions or nuanced judgment required', 'Customer-facing chat or document analysis', 'Coding, debugging, and technical writing', 'Default production model for most apps'].map(item => (
              <li key={item} style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Cost comparison callout */}
      <div style={{ padding: '20px 24px', borderRadius: '10px', background: 'var(--bg-subtle)', border: '1px solid var(--border-base)', marginBottom: '48px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>Haiku (input / output per MTok)</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, color: ACCENT_HAIKU, margin: 0 }}>$0.80 / $4.00</p>
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>Sonnet (input / output per MTok)</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, color: ACCENT_SONNET, margin: 0 }}>$3.00 / $15.00</p>
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>Typical cost difference</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>3–4× cheaper</p>
        </div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-muted)', alignSelf: 'flex-end', margin: 0 }}>Verify at anthropic.com/pricing</p>
      </div>

      {/* Table */}
      <div style={{ marginBottom: '56px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px' }}>By task type</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 1fr', borderRadius: '10px 10px 0 0', background: 'var(--bg-subtle)', border: '1px solid var(--border-base)', borderBottom: 'none' }} className="compare-header">
          <div style={{ padding: '12px 16px' }}><span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Task</span></div>
          <div style={{ padding: '12px 16px', borderLeft: '1px solid var(--border-muted)' }}><span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 700, color: ACCENT_HAIKU }}>Haiku</span></div>
          <div style={{ padding: '12px 16px', borderLeft: '1px solid var(--border-muted)' }}><span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 700, color: ACCENT_SONNET }}>Sonnet</span></div>
        </div>
        {ROWS.map((row, i) => (
          <div key={row.dimension} style={{ display: 'grid', gridTemplateColumns: '200px 1fr 1fr', border: '1px solid var(--border-base)', borderTop: 'none', borderRadius: i === ROWS.length - 1 ? '0 0 10px 10px' : '0', background: i % 2 === 0 ? 'var(--bg-surface)' : 'transparent' }} className="compare-row">
            <div style={{ padding: '16px' }}><span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>{row.dimension}</span></div>
            <div style={{ padding: '16px', borderLeft: '1px solid var(--border-muted)' }}>
              <VerdictBadge verdict={row.haiku.verdict} />
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55, margin: '6px 0 0' }}>{row.haiku.text}</p>
            </div>
            <div style={{ padding: '16px', borderLeft: '1px solid var(--border-muted)' }}>
              <VerdictBadge verdict={row.sonnet.verdict} />
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55, margin: '6px 0 0' }}>{row.sonnet.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* The decision rule */}
      <div style={{ padding: '32px', borderRadius: '12px', border: '1px solid var(--border-base)', background: 'var(--bg-surface)', marginBottom: '40px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>The decision rule</h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
          Start with Sonnet. Test with Haiku once your prompts are stable. If Haiku passes your evals on a representative sample of real inputs — use Haiku in production. If it fails, you now have evidence for why Sonnet is worth the cost.
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '0' }}>
          The mistake most teams make: choosing Haiku up front because it&apos;s cheap, then debugging quality issues in production. The model switch has real cost — in prompt re-tuning, in user trust, in engineering time. Earn the cost savings by validating first.
        </p>
      </div>

      {/* Related */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Link href="/articles/claude-cost-optimization" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', padding: '8px 16px', border: '1px solid var(--accent)', borderRadius: '6px' }}>
          Cost optimization guide →
        </Link>
        <Link href="/tools/cost-calculator" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', padding: '8px 16px', border: '1px solid var(--accent)', borderRadius: '6px' }}>
          Cost calculator →
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
