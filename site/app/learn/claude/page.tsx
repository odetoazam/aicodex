import Link from 'next/link'
import AcademyTrackCallout from '@/components/AcademyTrackCallout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Claude for your work — AI Codex',
  description: 'Eight practical steps for anyone using Claude personally: how to prompt well, what Claude is actually good at, the mistakes everyone makes, and how to build a workflow that sticks.',
}

const STEPS = [
  {
    number: 1,
    concept: 'What is safe to share',
    conceptSlug: 'ai-governance',
    articleSlug: 'what-to-share-with-claude',
    label: 'Before anything else: what can you actually paste in?',
    takeaway: 'The question that quietly stops most people using Claude for real work. What Anthropic does with your data, the vendor test to apply, and the three-line rule to write for your own job so you stop re-deciding every time.',
    time: '7 min',
  },
  {
    number: 2,
    concept: 'Prompting that works',
    conceptSlug: 'prompt-engineering',
    articleSlug: 'how-to-write-a-good-prompt',
    label: 'The skill that changes everything',
    takeaway: 'Most people get mediocre results because they write prompts the way they\'d text a friend. The specific techniques that consistently produce better output — with examples you can steal.',
    time: '6 min',
  },
  {
    number: 3,
    concept: 'What Claude is actually good at',
    conceptSlug: 'ai-augmentation',
    articleSlug: 'what-ai-cant-do',
    label: 'Know the real limits before they surprise you',
    takeaway: 'Claude is excellent at some things and genuinely bad at others. Knowing the difference before you need it saves you from making decisions on bad output without realising it.',
    time: '5 min',
  },
  {
    number: 4,
    concept: 'The mistakes everyone makes first',
    conceptSlug: 'hallucination',
    articleSlug: 'claude-common-mistakes',
    label: 'Skip the predictable failures',
    takeaway: 'The patterns that trip up almost every new Claude user — being too vague, accepting the first output, not giving context. Knowing them in advance puts you months ahead.',
    time: '5 min',
  },
  {
    number: 5,
    concept: 'Writing and editing with Claude',
    conceptSlug: 'ai-augmentation',
    articleSlug: 'claude-for-writing-and-editing',
    label: 'The use case most people start with',
    takeaway: 'What actually works for drafts, rewrites, tone adjustments, and editing — and what doesn\'t. How to direct Claude without losing your own voice in the output.',
    time: '5 min',
  },
  {
    number: 6,
    concept: 'Research with Claude',
    conceptSlug: 'rag',
    articleSlug: 'using-claude-for-research',
    label: 'When to use it and when not to',
    takeaway: 'Claude is fast and useful for research — and also capable of sounding completely authoritative while being wrong. How to get the value without getting burned.',
    time: '5 min',
  },
  {
    number: 7,
    concept: 'Projects: Claude that remembers your context',
    conceptSlug: 'claude-projects',
    articleSlug: 'claude-projects-role',
    label: 'Stop re-explaining yourself every conversation',
    takeaway: 'Projects let you give Claude standing instructions and shared context so you don\'t start from zero every time. How to set one up and what to put in it.',
    time: '5 min',
  },
  {
    number: 8,
    concept: 'When to trust the output — and when not to',
    conceptSlug: 'hallucination',
    articleSlug: 'hallucination-failure',
    label: 'Build the right instincts',
    takeaway: 'The specific failure patterns you need to know — not to be paranoid about every output, but to catch the ones that actually matter before they become a problem.',
    time: '5 min',
  },
  {
    number: 9,
    concept: 'When something goes wrong: fix the prompt',
    conceptSlug: 'prompt-engineering',
    articleSlug: 'claude-prompt-debugging',
    label: 'Diagnose before you give up',
    takeaway: 'When Claude misses, most people either accept the bad output or give up. The third option: a quick diagnostic process that tells you exactly what to change.',
    time: '5 min',
  },
  {
    number: 10,
    concept: 'A workflow that sticks',
    conceptSlug: 'workflow-automation',
    articleSlug: 'managing-email-with-claude',
    label: 'Turn it into a habit on something you do daily',
    takeaway: 'Capability without a recurring workflow fades in about three weeks. Email is the one everybody has — the triage and drafting pattern that survives contact with a real inbox.',
    time: '7 min',
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
        <span style={{ color: 'var(--text-secondary)' }}>Claude for your work</span>
      </nav>

      {/* Header */}
      <div style={{ marginBottom: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <p className="eyebrow">For individuals</p>
          <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 500, background: ACCENT_BG, color: ACCENT, fontFamily: 'var(--font-sans)' }}>
            {STEPS.length} steps · ~{totalTime} min
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
          Claude for your work
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-muted)', maxWidth: '56ch', lineHeight: 1.65 }}>
          Eight practical steps, in the right order. No technical background needed —
          just the skills that separate people who get real value from Claude
          and people who give up after a week.
        </p>
      </div>

      {/* Steps */}
      <div style={{ position: 'relative' }}>
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
            Prefer video with a certificate? Anthropic offers a free <strong>Claude 101</strong> course — basics with video lessons and a completion certificate.
          </p>
        </div>
        <a
          href="https://anthropic.skilljar.com/claude-101"
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
          Where to go next
        </p>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Getting your team on board?
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px', maxWidth: '52ch' }}>
          Once you're getting real value personally, the next move is usually figuring out
          how to bring your team along. That's a different set of decisions.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const }}>
          <Link href="/learn/for-your-team" style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: ACCENT, textDecoration: 'none', fontWeight: 500 }}>
            Rolling out Claude to your team →
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
      <AcademyTrackCallout trackId="individual" />
    </div>
  )
}

function StepCard({ step, isLast }: { step: typeof STEPS[0]; isLast: boolean }) {
  const href = step.articleSlug ? `/articles/${step.articleSlug}` : `/glossary/${step.conceptSlug}`

  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block', position: 'relative', paddingLeft: '52px' }} className="step-card">
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
