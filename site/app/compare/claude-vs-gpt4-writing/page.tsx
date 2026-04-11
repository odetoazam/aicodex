import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Claude vs GPT-4 for Writing — AI Codex',
  description: 'A practical comparison of Claude and GPT-4 for writing tasks. Long-form quality, tone control, editing, and what operators actually experience using each model for content work.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Claude vs GPT-4 for Writing',
  description: 'A practical comparison of Claude and GPT-4 for writing tasks. Long-form quality, tone control, editing, and what operators actually experience using each model for content work.',
  author: { '@type': 'Organization', name: 'AI Codex', url: 'https://www.aicodex.to' },
  publisher: { '@type': 'Organization', name: 'AI Codex', url: 'https://www.aicodex.to' },
  url: 'https://www.aicodex.to/compare/claude-vs-gpt4-writing',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.aicodex.to/compare/claude-vs-gpt4-writing' },
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
    dimension: 'Long-form prose quality',
    claude: { verdict: 'better', text: 'Produces more natural, less patterned prose. Sentences vary in length and rhythm. Avoids the "list of bullet points dressed as paragraphs" failure mode that plagues most AI writing.' },
    gpt4: { verdict: 'similar', text: 'Capable long-form writer, but defaults to structured formats even when plain prose is better. Requires explicit instruction to write naturally rather than academically.' },
  },
  {
    dimension: 'Tone control and brand voice',
    claude: { verdict: 'better', text: 'Follows detailed tone instructions with high fidelity. Distinguishes between "confident but not arrogant," "conversational but not casual," and similar nuanced distinctions. Responds well to example-based voice training.' },
    gpt4: { verdict: 'similar', text: 'Handles tone instructions adequately. Less reliable on subtle distinctions — tends to collapse nuanced tone requirements into a generic "professional" voice when instructions get complex.' },
  },
  {
    dimension: 'Editing and rewriting existing copy',
    claude: { verdict: 'better', text: 'Excellent at editing with a specific lens: "tighten this," "make this more direct," "cut the hedge phrases." Preserves the author\'s voice rather than rewriting in Claude\'s own style.' },
    gpt4: { verdict: 'similar', text: 'Solid editor but tends to homogenize voice — edited copy often sounds like GPT-4 rather than the original author. Requires extra instruction to edit surgically.' },
  },
  {
    dimension: 'Following complex style guides',
    claude: { verdict: 'better', text: 'Handles multi-rule style guides well — "never use passive voice, always spell out numbers under ten, avoid jargon X, prefer phrasing Y" — without losing the thread of earlier rules when given new ones.' },
    gpt4: { verdict: 'similar', text: 'Can follow style guides but compliance degrades as rules accumulate. May follow the last-mentioned rule while forgetting earlier constraints.' },
  },
  {
    dimension: 'Creative writing and originality',
    claude: { verdict: 'similar', text: 'Strong creative writing capability. Better at maintaining a specific narrative voice over long fiction. More likely to take genuine creative risks when given latitude.' },
    gpt4: { verdict: 'similar', text: 'Also strong creatively. GPT-4 has broader cultural reference breadth which helps with allusions and pastiche. Less reliable at sustaining a specific voice over very long output.' },
  },
  {
    dimension: 'Short-form copy (ads, subject lines, CTAs)',
    claude: { verdict: 'similar', text: 'Produces clean, punchy short-form copy. Generates strong option variety when asked for alternatives.' },
    gpt4: { verdict: 'similar', text: 'Equally capable for short-form. GPT-4o is fast, which matters when you\'re iterating on 50 subject line options.' },
  },
  {
    dimension: 'Avoiding generic AI phrasing',
    claude: { verdict: 'better', text: 'Significantly less likely to produce "delve into," "it\'s important to note," "in today\'s rapidly evolving landscape," and other patterns that immediately signal AI-generated text.' },
    gpt4: { verdict: 'worse', text: 'More prone to filler phrases and generic transitions that mark text as AI-generated. Requires explicit negative instructions ("never use these phrases") to suppress reliably.' },
  },
  {
    dimension: 'SEO content production',
    claude: { verdict: 'similar', text: 'Solid for SEO content when given keyword targets and structure requirements. Less likely to keyword-stuff unnaturally.' },
    gpt4: { verdict: 'similar', text: 'Equally capable for SEO content. Larger plugin ecosystem for SEO tools (SurferSEO, etc.) if you want workflow integrations.' },
  },
  {
    dimension: 'Cost for content production at scale',
    claude: { verdict: 'better', text: 'Claude Haiku handles lighter writing tasks cheaply. Sonnet is well-priced for quality long-form. Prompt caching helps significantly when you\'re using a shared system prompt (style guide, brand context).' },
    gpt4: { verdict: 'similar', text: 'GPT-4o pricing is competitive for production workloads. GPT-3.5 Turbo is cheaper but writing quality drops notably on nuanced or long-form tasks.' },
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

export default function CompareGPT4WritingPage() {
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
          Claude vs GPT-4 for Writing
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
          Claude vs GPT-4 for Writing
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-base)',
          color: 'var(--text-muted)',
          maxWidth: '54ch',
          lineHeight: 1.65,
        }}>
          From brand voice copy to long-form content, editing, and style-guide compliance. What writers, marketers, and operators actually experience when they push each model through real content workflows.
        </p>
      </div>

      {/* TL;DR */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '56px' }} className="tldr-grid">
        <div style={{ padding: '24px', borderRadius: '10px', border: `2px solid ${ACCENT_CLAUDE}30`, background: `${ACCENT_CLAUDE}06` }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: ACCENT_CLAUDE, marginBottom: '10px' }}>
            Claude — Best for
          </p>
          <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
            {[
              'Long-form content that needs to sound human',
              'Brand voice work with detailed style guides',
              'Editing and rewriting without losing author voice',
              'Content production at scale with prompt caching',
              'Any writing where "AI-sounding" output is a failure mode',
            ].map(item => (
              <li key={item} style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item}</li>
            ))}
          </ul>
        </div>
        <div style={{ padding: '24px', borderRadius: '10px', border: `2px solid ${ACCENT_GPT}30`, background: `${ACCENT_GPT}06` }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: ACCENT_GPT, marginBottom: '10px' }}>
            GPT-4 — Best for
          </p>
          <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
            {[
              'SEO tools with OpenAI integrations (SurferSEO, etc.)',
              'Fast iteration on short-form copy at high volume',
              'Teams already in the ChatGPT / OpenAI workflow',
              'Broad cultural and reference breadth for creative allusions',
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
          For writing quality that needs to pass as human — whether that&apos;s long-form editorial content, brand voice copy, or editorial editing — <strong>Claude is the stronger choice</strong>. The gap is most visible in three places: natural prose rhythm, adherence to nuanced style guides, and the suppression of AI-sounding filler phrases.
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          GPT-4 is competitive for short-form volume tasks and benefits from a larger tool ecosystem. If your content team is already using ChatGPT and the workflow is working, the quality delta on short-form work may not justify switching. Where it does justify switching is anywhere the output ends up in front of a reader who can tell the difference.
        </p>
      </div>

      {/* Related */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const }}>
        <Link href="/articles/claude-for-agencies" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', padding: '8px 16px', border: '1px solid var(--accent)', borderRadius: '6px' }}>
          Claude for agencies →
        </Link>
        <Link href="/tools/system-prompt-builder" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', padding: '8px 16px', border: '1px solid var(--accent)', borderRadius: '6px' }}>
          Build a writing system prompt →
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
