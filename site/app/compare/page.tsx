import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Model Comparisons — AI Codex',
  description: 'Practical comparisons of AI models for real use cases. Claude vs GPT-4, Haiku vs Sonnet, and more — written for operators making real decisions.',
}

const COMPARISONS = [
  {
    href: '/compare/claude-vs-gpt4-customer-support',
    title: 'Claude vs GPT-4 for Customer Support',
    description: 'Tone, refusal rates, policy adherence, and what actually matters when customers are frustrated. The practical comparison for support automation teams.',
    tags: ['Claude', 'GPT-4', 'Customer Support'],
    readTime: '6 min',
    accent: '#D4845A',
  },
  {
    href: '/compare/claude-vs-gpt4-coding',
    title: 'Claude vs GPT-4 for Coding',
    description: 'From one-shot code generation to complex refactors. What developers actually experience when building with each model in production.',
    tags: ['Claude', 'GPT-4', 'Coding'],
    readTime: '5 min',
    accent: '#7B8FD4',
  },
  {
    href: '/compare/claude-vs-gpt4-writing',
    title: 'Claude vs GPT-4 for Writing',
    description: 'Brand voice, long-form prose, editing, and style-guide compliance. Where AI-sounding output is a failure mode and which model avoids it better.',
    tags: ['Claude', 'GPT-4', 'Writing'],
    readTime: '6 min',
    accent: '#D4C45A',
  },
  {
    href: '/compare/claude-vs-gpt4-document-analysis',
    title: 'Claude vs GPT-4 for Document Analysis',
    description: 'Contracts, financial reports, multi-document synthesis. Where context window size, retrieval coherence, and hallucination rates actually matter.',
    tags: ['Claude', 'GPT-4', 'Documents'],
    readTime: '6 min',
    accent: '#4CAF7D',
  },
  {
    href: '/compare/claude-haiku-vs-sonnet',
    title: 'Claude Haiku vs Sonnet — When to use which',
    description: 'The cost-quality tradeoff in practice. A decision framework for the most common model choice developers face, with task-by-task guidance.',
    tags: ['Haiku', 'Sonnet', 'Model Selection'],
    readTime: '5 min',
    accent: '#9B7BD4',
  },
  {
    href: '/compare/claude-vs-openai-for-enterprise',
    title: 'Claude vs OpenAI for Enterprise',
    description: 'The comparison decision-makers search for. Data privacy, admin controls, context window, compliance, and what actually determines the vendor decision at scale.',
    tags: ['Claude', 'OpenAI', 'Enterprise'],
    readTime: '7 min',
    accent: '#4CAF7D',
  },
  {
    href: '/compare/claude-vs-gemini-for-business',
    title: 'Claude vs Gemini for Business',
    description: "Anthropic's Claude vs Google Gemini — instruction following, writing quality, Workspace integration, video understanding, and which one wins for your team's actual use case.",
    tags: ['Claude', 'Gemini', 'Google'],
    readTime: '7 min',
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
          These are written from real implementation experience. Where Claude has a genuine weakness, we say so. Where GPT-4 is better for a specific task, we say so too. The goal is to help you pick the right tool.
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
