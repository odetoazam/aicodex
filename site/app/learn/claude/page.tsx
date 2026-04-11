import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Getting more out of Claude — AI Codex',
  description: 'How Claude actually thinks, how to direct it precisely, and the features most people never discover.',
}

// Each step: concept name, slug, article slug (if exists), what you learn
const STEPS = [
  {
    number: 1,
    concept: 'Large Language Model',
    conceptSlug: 'large-language-model',
    articleSlug: 'large-language-model-def',
    label: 'The foundation',
    takeaway: 'What Claude actually is under the hood — and why that changes how you interact with it.',
    time: '5 min',
  },
  {
    number: 2,
    concept: 'Context Window',
    conceptSlug: 'context-window',
    articleSlug: 'context-window-def',
    label: 'How Claude\'s memory works',
    takeaway: 'The whiteboard metaphor: why Claude remembers everything in a conversation but nothing between them.',
    time: '5 min',
  },
  {
    number: 3,
    concept: 'Token',
    conceptSlug: 'token',
    articleSlug: 'token-def',
    label: 'The unit of everything',
    takeaway: 'What tokens are, why they matter for cost, and how to think about Claude\'s limits in practical terms.',
    time: '4 min',
  },
  {
    number: 4,
    concept: 'System Prompt',
    conceptSlug: 'system-prompt',
    articleSlug: 'system-prompt-def',
    label: 'How to brief Claude',
    takeaway: 'The most important concept for anyone building with Claude — how to shape its behavior before the conversation starts.',
    time: '4 min',
  },
  {
    number: 5,
    concept: 'Constitutional AI',
    conceptSlug: 'constitutional-ai',
    articleSlug: 'constitutional-ai-def',
    label: 'Why Claude behaves the way it does',
    takeaway: 'The training method that gave Claude values instead of rules — and why that makes it more useful, not less.',
    time: '5 min',
  },
  {
    number: 6,
    concept: 'Hallucination',
    conceptSlug: 'hallucination',
    articleSlug: 'hallucination-def',
    label: 'When to trust the output',
    takeaway: 'Why Claude sometimes gets confident things wrong — and how to design around it rather than be caught off guard.',
    time: '5 min',
  },
  {
    number: 7,
    concept: 'RAG',
    conceptSlug: 'rag',
    articleSlug: 'rag-def',
    label: 'Giving Claude your knowledge',
    takeaway: 'How to connect Claude to your own documents, data, and information — so answers are grounded in your reality.',
    time: '5 min',
  },
  {
    number: 8,
    concept: 'AI Agent',
    conceptSlug: 'ai-agent',
    articleSlug: 'ai-agent-def',
    label: 'When Claude does the work',
    takeaway: 'The shift from Claude answering questions to Claude completing tasks — what changes and what to watch for.',
    time: '5 min',
  },
]

const ACCENT = '#D4845A'
const ACCENT_BG = 'rgba(212,132,90,0.1)'

export default function LearnClaudePage() {
  const totalTime = STEPS.reduce((sum, s) => sum + parseInt(s.time), 0)

  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)' }}>
        <Link href="/learn" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Learn</Link>
        <span>›</span>
        <span style={{ color: 'var(--text-secondary)' }}>Getting more out of Claude</span>
      </nav>

      {/* Header */}
      <div style={{ marginBottom: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <p className="eyebrow">For daily Claude users</p>
          <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 500, background: ACCENT_BG, color: ACCENT, fontFamily: 'var(--font-sans)' }}>
            {STEPS.length} concepts · ~{totalTime} min
          </span>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: '16px',
            maxWidth: '24ch',
          }}
        >
          Getting more out of Claude
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-muted)', maxWidth: '56ch', lineHeight: 1.65 }}>
          Eight concepts, in the right order. Each one builds on the last.
          By the end you'll understand how Claude actually works — and you'll
          get noticeably better results from it.
        </p>
      </div>

      {/* Steps */}
      <div style={{ position: 'relative' }}>
        {/* Connecting line */}
        <div style={{
          position: 'absolute',
          left: '19px',
          top: '40px',
          bottom: '40px',
          width: '1px',
          background: 'var(--border-base)',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {STEPS.map((step, i) => (
            <StepCard key={step.number} step={step} isLast={i === STEPS.length - 1} />
          ))}
        </div>
      </div>

      {/* Anthropic Academy callout */}
      <div style={{
        marginTop: '48px',
        padding: '20px 24px',
        borderRadius: '10px',
        border: '1px solid var(--border-base)',
        background: 'var(--bg-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        flexWrap: 'wrap' as const,
      }}>
        <div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', marginBottom: '4px' }}>
            Official course from Anthropic
          </p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            Prefer video with a certificate? Anthropic offers a free <strong>Claude 101</strong> course — covers the basics with video lessons and a completion certificate.
          </p>
        </div>
        <a
          href="https://anthropic.skilljar.com/page/claude-101"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            whiteSpace: 'nowrap' as const,
            flexShrink: 0,
          }}
        >
          Anthropic Academy ↗
        </a>
      </div>

      {/* Footer CTA */}
      <div style={{
        marginTop: '24px',
        padding: '32px',
        borderRadius: '12px',
        border: '1px solid var(--border-base)',
        background: 'var(--bg-surface)',
        borderLeft: `3px solid ${ACCENT}`,
      }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: ACCENT, marginBottom: '10px' }}>
          After this path
        </p>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Go deeper on what matters to you
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px', maxWidth: '52ch' }}>
          The glossary has every term. The articles go deeper on the ones that matter most.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const }}>
          <Link href="/glossary?claude=true" style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: ACCENT, textDecoration: 'none' }}>
            Claude-specific terms →
          </Link>
          <Link href="/articles" style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'none' }}>
            All articles →
          </Link>
        </div>
      </div>

      <style>{`
        .step-card:hover .step-title { color: ${ACCENT} !important; }
        @media (max-width: 600px) {
          .step-inner { flex-direction: column !important; gap: 12px !important; }
          .step-time { align-self: flex-start; }
        }
      `}</style>
    </div>
  )
}

function StepCard({ step, isLast }: { step: typeof STEPS[0]; isLast: boolean }) {
  const hasArticle = !!step.articleSlug
  const href = hasArticle ? `/articles/${step.articleSlug}` : `/glossary/${step.conceptSlug}`

  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block', position: 'relative', paddingLeft: '52px' }} className="step-card">
      {/* Step number bubble */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: '24px',
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-sans)',
        fontSize: '13px',
        fontWeight: 500,
        color: 'var(--text-muted)',
        zIndex: 1,
        transition: 'border-color 150ms ease, color 150ms ease',
      }}>
        {step.number}
      </div>

      {/* Card */}
      <div
        style={{
          padding: '20px 24px',
          borderRadius: '10px',
          border: '1px solid var(--border-muted)',
          background: 'var(--bg-surface)',
          margin: '8px 0',
          transition: 'border-color 150ms ease',
        }}
      >
        <div className="step-inner" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', marginBottom: '4px' }}>
              {step.label}
            </p>
            <h3
              className="step-title"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--text-lg)',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '6px',
                lineHeight: 1.2,
                transition: 'color 150ms ease',
              }}
            >
              {step.concept}
            </h3>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
              {step.takeaway}
            </p>
          </div>
          <div className="step-time" style={{ flexShrink: 0, textAlign: 'right' as const }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', margin: 0, whiteSpace: 'nowrap' as const }}>
              {step.time}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
