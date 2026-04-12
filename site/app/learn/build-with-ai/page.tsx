import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Building your first AI product — AI Codex',
  description: 'A structured path for solo founders and early-stage builders: validate your idea, choose your stack, avoid the failure modes, and ship something real.',
}

const STEPS = [
  {
    number: 0,
    concept: 'What to Build',
    conceptSlug: 'ai-use-case-discovery',
    articleSlug: 'what-to-build-with-claude',
    label: 'Start here before you write a line of code',
    takeaway: 'Not every idea is a good AI product, and not every AI product needs the API. The four filters that separate durable use cases from expensive demos — before you commit to a stack.',
    time: '6 min',
    tag: 'Start here',
  },
  {
    number: 1,
    concept: 'AI Augmentation',
    conceptSlug: 'ai-augmentation',
    articleSlug: 'solo-founder-operating-system',
    label: 'Set up your founder operating system',
    takeaway: 'Before you build for customers, get your own house in order. How to configure Claude as a structured OS for a one-person company — not just another tab you open.',
    time: '8 min',
  },
  {
    number: 2,
    concept: 'AI Use Case Discovery',
    conceptSlug: 'ai-use-case-discovery',
    articleSlug: 'validating-startup-idea-with-claude',
    label: 'Validate before you build',
    takeaway: 'Claude will cheerfully validate a terrible idea if you ask it the wrong way. The discipline required to use it as a genuine stress-test — not a mirror.',
    time: '7 min',
  },
  {
    number: 3,
    concept: 'System Prompt',
    conceptSlug: 'system-prompt',
    articleSlug: 'system-prompt-failure',
    label: 'Your system prompt is your product',
    takeaway: 'The highest-leverage technical decision in an AI product is not the model — it is the system prompt. What goes wrong when founders get this wrong.',
    time: '5 min',
  },
  {
    number: 4,
    concept: 'Build vs. Buy',
    conceptSlug: 'build-vs-buy',
    articleSlug: 'build-buy-prompt-early-stage',
    label: 'Choose the right stack for your stage',
    takeaway: 'Claude.ai, the API, or a fine-tuned model? Most early-stage founders overcomplicate this. The decision framework, and why fine-tuning is almost never the right first move.',
    time: '6 min',
  },
  {
    number: 5,
    concept: 'Hallucination',
    conceptSlug: 'hallucination',
    articleSlug: 'ai-product-failure-modes-founders',
    label: 'What goes wrong (and why)',
    takeaway: 'The demo gap, hallucination in production, scope creep, the retention cliff — the specific failure modes that catch AI founders off guard, and how to design around them.',
    time: '7 min',
  },
  {
    number: 6,
    concept: 'Evals',
    conceptSlug: 'evals',
    articleSlug: 'evals-role',
    label: 'Know if it\'s actually working',
    takeaway: 'You cannot improve what you have not defined. How to build a lightweight eval system that tells you whether your product is getting better or quietly degrading.',
    time: '5 min',
  },
  {
    number: 7,
    concept: 'Deployment',
    conceptSlug: 'api',
    articleSlug: 'deploying-claude-app-production',
    label: 'Ship it to real users',
    takeaway: 'Vercel, Railway, or a VPS — the tradeoffs, the env var discipline, the logging setup, and the first 48 hours after launch. What to watch and what can wait.',
    time: '7 min',
  },
  {
    number: 8,
    concept: 'Error Handling',
    conceptSlug: 'hallucination',
    articleSlug: 'claude-production-error-handling',
    label: 'When things break in production',
    takeaway: 'Rate limits, overloaded errors, context window exceeded, unexpected refusals — the specific failures your first real users will trigger, and how to handle them gracefully.',
    time: '6 min',
  },
  {
    number: 9,
    concept: 'AI Strategy',
    conceptSlug: 'ai-strategy',
    articleSlug: 'pitching-ai-product-to-investors',
    label: 'Tell a story investors believe',
    takeaway: 'What investors actually want to hear when you pitch an AI product — and why most AI pitches get the narrative wrong by leading with the technology.',
    time: '7 min',
  },
]

const ACCENT = '#4CAF7D'
const ACCENT_BG = 'rgba(76,175,125,0.1)'

export default function LearnBuildWithAIPage() {
  const totalTime = STEPS.reduce((sum, s) => sum + parseInt(s.time), 0)

  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)' }}>
        <Link href="/learn" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Learn</Link>
        <span>›</span>
        <span style={{ color: 'var(--text-secondary)' }}>Building your first AI product</span>
      </nav>

      {/* Header */}
      <div style={{ marginBottom: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <p className="eyebrow">For founders & builders</p>
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
            maxWidth: '28ch',
          }}
        >
          Building your first AI product
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-muted)', maxWidth: '56ch', lineHeight: 1.65 }}>
          From deciding what to build all the way to deploying it to real users and handling
          production failures — in the right order. Written for solo founders and small teams
          building with AI for the first time. No ML background required.
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

      {/* Footer CTA */}
      <div style={{
        marginTop: '64px',
        padding: '32px',
        borderRadius: '12px',
        border: '1px solid var(--border-base)',
        background: 'var(--bg-surface)',
        borderLeft: `3px solid ${ACCENT}`,
      }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: ACCENT, marginBottom: '10px' }}>
          Keep exploring
        </p>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Ready to go deeper?
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.6 }}>
          Browse all articles, or explore terms like Build vs. Buy, Evals, and System Prompt in the glossary.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const }}>
          <Link
            href="/articles"
            style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: ACCENT, textDecoration: 'none', fontWeight: 500 }}
          >
            All articles →
          </Link>
          <Link
            href="/learn/for-your-team"
            style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'none' }}
          >
            Rolling out to your team →
          </Link>
          <Link
            href="/glossary"
            style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'none' }}
          >
            Full glossary →
          </Link>
        </div>
      </div>
    </div>
  )
}

type Step = typeof STEPS[0] & { comingSoon?: boolean; tag?: string }

function StepCard({ step, isLast }: { step: Step; isLast: boolean }) {
  const href = step.articleSlug
    ? `/articles/${step.articleSlug}`
    : `/glossary/${step.conceptSlug}`

  const inner = (
    <div
      style={{
        position: 'relative',
        padding: '20px 24px',
        borderRadius: '10px',
        border: '1px solid var(--border-base)',
        background: step.comingSoon ? 'transparent' : 'var(--bg-surface)',
        opacity: step.comingSoon ? 0.5 : 1,
        transition: 'border-color 150ms ease, background 150ms ease',
      }}
      className={step.comingSoon ? '' : 'step-card'}
    >
      {/* Step number bubble */}
      <div style={{
        position: 'absolute',
        left: '-33px',
        top: '20px',
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        background: 'var(--bg-base)',
        border: `2px solid ${step.comingSoon ? 'var(--border-base)' : ACCENT}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-sans)',
        fontSize: '11px',
        fontWeight: 600,
        color: step.comingSoon ? 'var(--text-muted)' : ACCENT,
        flexShrink: 0,
      }}>
        {step.number}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' as const, color: step.comingSoon ? 'var(--text-muted)' : ACCENT, margin: 0 }}>
              {step.label}
            </p>
            {step.tag && (
              <span style={{ padding: '2px 7px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, background: ACCENT_BG, color: ACCENT, fontFamily: 'var(--font-sans)', letterSpacing: '0.03em' }}>
                {step.tag}
              </span>
            )}
          </div>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: '8px' }}>
            {step.concept}
          </p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
            {step.takeaway}
          </p>
        </div>
        <span style={{
          fontFamily: 'var(--font-sans)', fontSize: '12px',
          color: step.comingSoon ? 'var(--text-muted)' : 'var(--text-muted)',
          flexShrink: 0, paddingTop: '2px',
          fontStyle: step.comingSoon ? 'italic' : 'normal',
        }}>
          {step.time}
        </span>
      </div>
    </div>
  )

  return (
    <div style={{ paddingLeft: '52px', paddingBottom: isLast ? '0' : '4px' }}>
      {step.comingSoon ? (
        inner
      ) : (
        <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
          {inner}
        </Link>
      )}
      <style>{`
        .step-card:hover {
          border-color: ${ACCENT}40 !important;
          background: var(--bg-subtle) !important;
        }
      `}</style>
    </div>
  )
}
