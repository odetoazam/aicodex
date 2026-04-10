import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Getting your team actually using AI — AI Codex',
  description: 'A practical path for department heads: how to set up Claude for your team, write prompts that work consistently, and measure whether it\'s making a difference.',
}

const STEPS = [
  {
    number: 1,
    concept: 'System Prompt',
    conceptSlug: 'system-prompt',
    articleSlug: 'system-prompt-role',
    label: 'Set it up properly from day one',
    takeaway: 'Why the system prompt is the most important decision you make — and how to write one that produces consistent, on-brand outputs for everyone on your team.',
    time: '6 min',
  },
  {
    number: 2,
    concept: 'Claude Projects',
    conceptSlug: 'claude-projects',
    articleSlug: 'claude-projects-role',
    label: 'Give your team a shared starting point',
    takeaway: 'How Projects turn Claude from a personal assistant into a team resource — so outputs don\'t vary wildly based on who wrote the prompt.',
    time: '5 min',
  },
  {
    number: 3,
    concept: 'Skills & Connectors',
    conceptSlug: 'connector',
    articleSlug: 'connectors-skills-role',
    label: 'Connect Claude to your actual work',
    takeaway: 'Which Skills and Connectors are actually worth enabling — and how to give Claude access to your documents without making your team copy-paste everything.',
    time: '4 min',
  },
  {
    number: 4,
    concept: 'Hallucination',
    conceptSlug: 'hallucination',
    articleSlug: 'hallucination-failure',
    label: 'What to tell your team about trust',
    takeaway: 'The specific failure patterns your team needs to know — so they can catch the ones that matter without second-guessing everything Claude produces.',
    time: '5 min',
  },
  {
    number: 5,
    concept: 'RAG',
    conceptSlug: 'rag',
    articleSlug: 'rag-role',
    label: 'When to give Claude your knowledge base',
    takeaway: 'Whether you actually need to connect Claude to your documents — and what changes when you do.',
    time: '5 min',
  },
  {
    number: 6,
    concept: 'Evals',
    conceptSlug: 'evals',
    articleSlug: 'evals-role',
    label: 'Knowing if it\'s actually working',
    takeaway: 'How to measure whether the rollout is delivering — beyond "people seem to like it."',
    time: '5 min',
  },
]

const ACCENT = '#4CAF7D'
const ACCENT_BG = 'rgba(76,175,125,0.1)'

export default function LearnTeamStartedPage() {
  const totalTime = STEPS.reduce((sum, s) => sum + parseInt(s.time), 0)

  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)' }}>
        <Link href="/learn" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Learn</Link>
        <span>›</span>
        <span style={{ color: 'var(--text-secondary)' }}>Getting your team actually using AI</span>
      </nav>

      {/* Header */}
      <div style={{ marginBottom: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <p className="eyebrow">For department heads</p>
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
          Getting your team actually using AI
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-muted)', maxWidth: '56ch', lineHeight: 1.65 }}>
          Six steps from setup to measuring impact. Whether you're in customer success,
          operations, or marketing — the principles are the same. Get the foundations right
          and the rest follows.
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
          See how other operators are doing it
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.6 }}>
          Read field notes and decision guides from operators implementing AI across different functions.
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
