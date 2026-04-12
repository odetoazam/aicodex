import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rolling out Claude to your team — AI Codex',
  description: 'A practical path for managers and department heads: from deciding where to start, to setting up Projects and system prompts, to knowing whether your rollout is actually working.',
}

const STEPS = [
  {
    number: 1,
    concept: 'Is AI worth it for your team right now?',
    conceptSlug: 'ai-roi',
    articleSlug: 'ai-roi-role',
    label: 'Start with an honest assessment',
    takeaway: 'Most teams should start with AI. Most teams should start smaller than they think. How to honestly evaluate where the real value is — and avoid the distraction of the flashy use case.',
    time: '5 min',
  },
  {
    number: 2,
    concept: 'What to automate first',
    conceptSlug: 'workflow-automation',
    articleSlug: 'what-to-automate-first',
    label: 'Pick the right starting point',
    takeaway: 'Not the most impressive use case — the one that actually ships and delivers results in the first 30 days. The framework for finding it in your specific team.',
    time: '6 min',
  },
  {
    number: 3,
    concept: 'Running your first pilot',
    conceptSlug: 'evals',
    articleSlug: 'running-your-first-ai-pilot',
    label: 'Scope it so it can succeed',
    takeaway: 'What a real pilot looks like — how to scope it, who to include, what success means, and how to avoid the trap of pilots that never turn into real change.',
    time: '6 min',
  },
  {
    number: 4,
    concept: 'The system prompt: your most important decision',
    conceptSlug: 'system-prompt',
    articleSlug: 'system-prompt-role',
    label: 'Set it up properly from day one',
    takeaway: 'The system prompt is what turns Claude from a generic assistant into something that produces consistent, on-brand outputs for your whole team. How to write one that actually holds up.',
    time: '6 min',
  },
  {
    number: 5,
    concept: 'Projects: giving your team a shared foundation',
    conceptSlug: 'claude-projects',
    articleSlug: 'claude-projects-role',
    label: 'Stop letting outputs vary by who wrote the prompt',
    takeaway: 'How Projects turn Claude from a personal tool into a team resource — so every rep starts from the same baseline instead of reinventing the wheel every time.',
    time: '5 min',
  },
  {
    number: 6,
    concept: 'Skills and connectors: what to actually enable',
    conceptSlug: 'connector',
    articleSlug: 'connectors-skills-role',
    label: 'Connect Claude to your actual work',
    takeaway: 'Which Skills and Connectors are worth turning on — and which to leave off until your team is ready. How to give Claude access to your documents without creating new problems.',
    time: '4 min',
  },
  {
    number: 7,
    concept: 'What to tell your team about trust',
    conceptSlug: 'hallucination',
    articleSlug: 'hallucination-failure',
    label: 'Build the right habits before they matter',
    takeaway: 'The failure patterns your team needs to know — not to be paranoid, but to catch the ones that actually matter. What to tell people in their first week.',
    time: '5 min',
  },
  {
    number: 8,
    concept: 'Knowing if it\'s actually working',
    conceptSlug: 'evals',
    articleSlug: 'evals-role',
    label: 'Measure what matters',
    takeaway: 'Beyond "the team seems to like it." How to measure whether the rollout is delivering real time savings, better outputs, and new capabilities — without needing a data team.',
    time: '5 min',
  },
]

const ACCENT = '#4CAF7D'
const ACCENT_BG = 'rgba(76,175,125,0.1)'

export default function LearnForYourTeamPage() {
  const totalTime = STEPS.reduce((sum, s) => sum + parseInt(s.time), 0)

  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)' }}>
        <Link href="/learn" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Learn</Link>
        <span>›</span>
        <span style={{ color: 'var(--text-secondary)' }}>Rolling out Claude to your team</span>
      </nav>

      {/* Header */}
      <div style={{ marginBottom: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <p className="eyebrow">For managers & department heads</p>
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
            maxWidth: '28ch',
          }}
        >
          Rolling out Claude to your team
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-muted)', maxWidth: '56ch', lineHeight: 1.65 }}>
          Eight steps from deciding where to start, to knowing if it's working.
          Works for any function — CS, ops, marketing, HR. The fundamentals are the same.
          No technical background required.
        </p>

        {/* Cross-track note */}
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', marginTop: '16px', lineHeight: 1.5 }}>
          Also need to provision accounts or choose a plan?{' '}
          <Link href="/learn/claude-for-admins" style={{ color: ACCENT, textDecoration: 'none' }}>
            Setting up Claude for your company →
          </Link>
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
          Where to go next
        </p>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Deploying this org-wide?
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px', maxWidth: '52ch' }}>
          If you're the person responsible for Claude across the whole company — plan selection,
          provisioning, governance — that's a different set of decisions covered in the admin path.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const }}>
          <Link href="/learn/claude-for-admins" style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: ACCENT, textDecoration: 'none', fontWeight: 500 }}>
            Setting up Claude for your company →
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
