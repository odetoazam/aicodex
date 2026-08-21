import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Model Comparisons — AI Codex',
  description: 'Vendor-neutral model comparisons, verified against current pricing and specs. Claude vs GPT-5.6, Claude vs Gemini, Haiku vs Sonnet — with every performance claim attributed to whoever made it.',
}

const COMPARISONS = [
  {
    href: '/compare/claude-vs-gpt5-customer-support',
    title: 'Claude vs GPT-5.6 for Customer Support',
    description: 'Cost at real ticket volume, escalation behaviour, and citation guarantees — plus the shadow-mode test to run before either model answers a live customer.',
    tags: ['Claude', 'GPT-5.6', 'Customer Support'],
    readTime: '8 min',
    accent: '#D4845A',
  },
  {
    href: '/compare/claude-vs-gpt5-coding',
    title: 'Claude vs GPT-5.6 for Coding',
    description: 'Verified specs and pricing, where the published benchmarks disagree and who published them, and how to settle it on your own repository in an afternoon.',
    tags: ['Claude', 'GPT-5.6', 'Coding'],
    readTime: '8 min',
    accent: '#7B8FD4',
  },
  {
    href: '/compare/claude-vs-gpt5-writing',
    title: 'Claude vs GPT-5.6 for Writing',
    description: 'Output ceilings, long-document context, and encoding a house style — plus the blind test that settles a question no benchmark can answer.',
    tags: ['Claude', 'GPT-5.6', 'Writing'],
    readTime: '8 min',
    accent: '#D4C45A',
  },
  {
    href: '/compare/claude-vs-gpt5-document-analysis',
    title: 'Claude vs GPT-5.6 for Document Analysis',
    description: 'The one category where the two are not close, and the reason is billing rather than intelligence. Long-context economics, citations, and the “not present” test.',
    tags: ['Claude', 'GPT-5.6', 'Documents'],
    readTime: '8 min',
    accent: '#4CAF7D',
  },
  {
    href: '/compare/claude-haiku-vs-sonnet',
    title: 'Claude Haiku vs Sonnet — the gap closed in 2026',
    description: 'Sonnet 5 is now 2x Haiku 4.5, down from 3.75x a year ago. That, plus an 11-month cutoff gap and 5x the context, has inverted the standard advice.',
    tags: ['Haiku', 'Sonnet', 'Model Selection'],
    readTime: '8 min',
    accent: '#9B7BD4',
  },
  {
    href: '/compare/claude-vs-openai-for-enterprise',
    title: 'Claude vs OpenAI for Enterprise',
    description: 'Governance surfaces, audit access down to local sessions, deployment flexibility, and the six procurement questions that settle this before any benchmark does.',
    tags: ['Claude', 'OpenAI', 'Enterprise'],
    readTime: '9 min',
    accent: '#4CAF7D',
  },
  {
    href: '/compare/claude-vs-gemini-for-business',
    title: 'Claude vs Gemini for Business',
    description: 'The Workspace integration question, and the Gemini Flash price increase on January 1, 2027 that almost nobody is modelling into a twelve-month TCO.',
    tags: ['Claude', 'Gemini', 'Google'],
    readTime: '9 min',
    accent: '#4285F4',
  },
]

export default function ComparePage() {
  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>

      {/* Header */}
      <div style={{ marginBottom: '56px' }}>
        <p className="eyebrow" style={{ marginBottom: '16px' }}>Compare</p>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          marginBottom: '16px',
          maxWidth: '22ch',
        }}>
          AI model comparisons for real decisions
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-base)',
          color: 'var(--text-muted)',
          maxWidth: '52ch',
          lineHeight: 1.65,
        }}>
          Practical comparisons for people choosing a model for a real task — honest trade-offs based on implementation experience, not vendor marketing.
        </p>
      </div>

      {/* Comparison cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '56px' }}>
        {COMPARISONS.map(c => (
          <Link
            key={c.href}
            href={c.href}
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div style={{
              padding: '28px 32px',
              borderRadius: '10px',
              border: '1px solid var(--border-base)',
              borderLeft: `3px solid ${c.accent}`,
              background: 'var(--bg-surface)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '24px',
              transition: 'border-color 150ms ease, background 150ms ease',
            }}
              className="compare-card"
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  {c.tags.map(tag => (
                    <span key={tag} style={{
                      fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500,
                      padding: '2px 8px', borderRadius: '4px',
                      background: 'var(--bg-subtle)', color: 'var(--text-muted)',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  lineHeight: 1.25,
                  marginBottom: '10px',
                }}>
                  {c.title}
                </h2>
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                  margin: 0,
                  maxWidth: '56ch',
                }}>
                  {c.description}
                </p>
              </div>
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: c.accent, fontWeight: 500 }}>
                  Read →
                </span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)' }}>
                  {c.readTime} read
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Philosophy note */}
      <div style={{ padding: '24px 28px', borderRadius: '10px', background: 'var(--bg-subtle)', border: '1px solid var(--border-muted)' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
          How we write these comparisons
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>
          Every page here leads with verified specs and pricing, attributes each performance claim to whoever published it, and gives you a method to settle the question on your own workload. Where Claude is weaker, we say so. Where the honest answer is “these are close and the model is not your problem,” we say that too.
        </p>
      </div>

      <style>{`
        .compare-card:hover {
          border-color: var(--border-base) !important;
          background: var(--bg-subtle) !important;
        }
      `}</style>
    </div>
  )
}
