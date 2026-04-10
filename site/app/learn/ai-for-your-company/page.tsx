import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Figuring out AI for your company — AI Codex',
  description: 'A structured path for founders and ops leaders: how to decide if AI is right for you, where to start, and how to avoid the mistakes most teams make.',
}

const STEPS = [
  {
    number: 1,
    concept: 'ROI',
    conceptSlug: 'ai-roi',
    articleSlug: 'ai-roi-role',
    label: 'Is AI right for you right now?',
    takeaway: 'How to honestly assess whether AI will move your business forward — or just create distraction. Most companies should start; most should start smaller.',
    time: '5 min',
  },
  {
    number: 2,
    concept: 'Workflow Automation',
    conceptSlug: 'workflow-automation',
    articleSlug: 'what-to-automate-first',
    label: 'What to automate first',
    takeaway: 'The framework for identifying your highest-value starting point — not the flashiest use case, the one that actually ships.',
    time: '6 min',
  },
  {
    number: 3,
    concept: 'Evals',
    conceptSlug: 'evals',
    articleSlug: 'running-your-first-ai-pilot',
    label: 'How to run your first pilot',
    takeaway: 'What a real AI pilot looks like — how to scope it, how to know if it worked, and how to avoid the trap of pilots that never turn into products.',
    time: '6 min',
  },
  {
    number: 4,
    concept: 'Hallucination',
    conceptSlug: 'hallucination',
    articleSlug: 'ai-pilot-failure',
    label: 'What goes wrong (and why)',
    takeaway: 'The failure patterns that catch most teams off guard — and how to design your rollout so they don\'t catch you.',
    time: '5 min',
  },
  {
    number: 5,
    concept: 'System Prompt',
    conceptSlug: 'system-prompt',
    articleSlug: 'system-prompt-failure',
    label: 'Your most important decision',
    takeaway: 'Why the system prompt is the highest-leverage thing you control — and what happens when teams get it wrong.',
    time: '5 min',
  },
  {
    number: 6,
    concept: 'Claude Projects',
    conceptSlug: 'claude-projects',
    articleSlug: 'claude-projects-role',
    label: 'Setting it up for your team',
    takeaway: 'How to configure Claude so your whole team gets consistent, on-brand outputs — not whatever each person happens to type.',
    time: '5 min',
  },
  {
    number: 7,
    concept: 'Evals',
    conceptSlug: 'evals',
    articleSlug: 'evals-role',
    label: 'Knowing if it\'s actually working',
    takeaway: 'How to measure whether your AI rollout is delivering — beyond "the team seems to like it."',
    time: '5 min',
  },
]

const ACCENT = '#D4845A'
const ACCENT_BG = 'rgba(212,132,90,0.1)'

export default function LearnAIForYourCompanyPage() {
  const totalTime = STEPS.reduce((sum, s) => sum + parseInt(s.time), 0)

  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)' }}>
        <Link href="/learn" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Learn</Link>
        <span>›</span>
        <span style={{ color: 'var(--text-secondary)' }}>Figuring out AI for your company</span>
      </nav>

      {/* Header */}
      <div style={{ marginBottom: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <p className="eyebrow">For founders & ops leaders</p>
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
          Figuring out AI for your company
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-muted)', maxWidth: '56ch', lineHeight: 1.65 }}>
          Seven steps, in the right order. From deciding whether to start at all,
          to knowing if your rollout is actually working. No technical background required.
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
          Browse all operator-focused articles, or explore the full glossary when a specific term comes up.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const }}>
          <Link
            href="/articles"
            style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: ACCENT, textDecoration: 'none', fontWeight: 500 }}
          >
            All articles →
          </Link>
          <Link
            href="/glossary"
            style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'none' }}
          >
            Full glossary →
          </Link>
        </div>
      </div>
    </div>
  )
}

function StepCard({ step, isLast }: { step: typeof STEPS[0]; isLast: boolean }) {
  const href = step.articleSlug
    ? `/articles/${step.articleSlug}`
    : `/glossary/${step.conceptSlug}`

  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block', paddingLeft: '52px', paddingBottom: isLast ? '0' : '4px' }}>
      <div style={{
        position: 'relative',
        padding: '20px 24px',
        borderRadius: '10px',
        border: '1px solid var(--border-base)',
        background: 'var(--bg-surface)',
        transition: 'border-color 150ms ease, background 150ms ease',
      }}
        className="step-card"
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
          border: `2px solid ${ACCENT}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-sans)',
          fontSize: '11px',
          fontWeight: 600,
          color: ACCENT,
          flexShrink: 0,
        }}>
          {step.number}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' as const, color: ACCENT, marginBottom: '6px' }}>
              {step.label}
            </p>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: '8px' }}>
              {step.concept}
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
              {step.takeaway}
            </p>
          </div>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0, paddingTop: '2px' }}>
            {step.time}
          </span>
        </div>
      </div>

      <style>{`
        .step-card:hover {
          border-color: ${ACCENT}40 !important;
          background: var(--bg-subtle) !important;
        }
      `}</style>
    </Link>
  )
}
