import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Setting up Claude for your company — AI Codex',
  description: 'A practical path for administrators and IT leads: how to evaluate, deploy, and manage Claude for your organization — from choosing the right plan to knowing if it\'s working.',
}

const ACCENT = '#5B8DD9'
const ACCENT_BG = 'rgba(91,141,217,0.1)'

const STAGES = [
  {
    number: 1,
    label: 'Before you start',
    subtitle: 'Evaluation',
    steps: [
      {
        number: 1,
        concept: 'Where to start',
        conceptSlug: 'claude-plans',
        articleSlug: 'claude-admin-zero-to-one',
        label: 'You\'ve been handed this job',
        takeaway: 'What the first two weeks actually look like — the four things to figure out before you configure anything, how to find the right Project owners, and what good looks like at 30 days.',
        time: '6 min',
      },
      {
        number: 2,
        concept: 'Claude Plans',
        conceptSlug: 'claude-plans',
        articleSlug: 'choosing-your-claude-plan',
        label: 'Which plan is right for your company?',
        takeaway: 'Free, Pro, Team, and Enterprise — what you actually get at each tier, the decision framework for choosing, and why most admins get this wrong in one of two predictable directions.',
        time: '6 min',
      },
    ],
  },
  {
    number: 2,
    label: 'Setting it up',
    subtitle: 'Initial deployment',
    steps: [
      {
        number: 3,
        concept: 'Admin Setup',
        conceptSlug: 'claude-plans',
        articleSlug: 'claude-admin-setup',
        label: 'Your first 30 minutes as a Claude admin',
        takeaway: 'The exact sequence: provisioning accounts, setting org-level defaults, and the decisions you need to make before anyone on your team logs in for the first time.',
        time: '7 min',
      },
      {
        number: 4,
        concept: 'Claude Projects',
        conceptSlug: 'claude-projects',
        articleSlug: 'claude-projects-org-structure',
        label: 'Structuring Projects across the whole org',
        takeaway: 'How to architect Projects at an org level — naming conventions, who owns what, system prompt governance, and what to upload. One focused Project per team beats ten generic ones.',
        time: '7 min',
      },
      {
        number: 5,
        concept: 'Skills',
        conceptSlug: 'skill',
        articleSlug: 'skills-setup-guide',
        label: 'Which Skills to enable where',
        takeaway: 'Not every Skill makes sense for every team. How to decide what to turn on, what to leave off, and how to avoid giving access to things your team isn\'t ready for.',
        time: '5 min',
      },
      {
        number: 6,
        concept: 'Connectors',
        conceptSlug: 'connector',
        articleSlug: 'connectors-best-practices',
        label: 'What to connect — and what to leave off',
        takeaway: 'The framework for deciding which data sources to give Claude access to. Not everything should be connected — here\'s how to evaluate each integration before enabling it.',
        time: '5 min',
      },
      {
        number: 7,
        concept: 'Tokens',
        conceptSlug: 'token',
        articleSlug: 'minimising-token-usage',
        label: 'Controlling costs from day one',
        takeaway: 'How token usage translates to spend, where most teams leak budget without realizing it, and the configuration choices that keep costs predictable as usage grows.',
        time: '5 min',
      },
    ],
  },
  {
    number: 3,
    label: 'Running it well',
    subtitle: 'Ongoing management',
    steps: [
      {
        number: 8,
        concept: 'Evals',
        conceptSlug: 'evals',
        articleSlug: 'evals-role',
        label: 'Is it actually working?',
        takeaway: 'How to measure whether your rollout is delivering — beyond adoption metrics. The lightweight evaluation process any admin can run, even without a data team.',
        time: '5 min',
      },
      {
        number: 9,
        concept: 'Cowork & Dispatch',
        conceptSlug: 'claude-cowork',
        articleSlug: 'cowork-dispatch-guide',
        label: 'Rolling out the new stuff responsibly',
        takeaway: 'Cowork and Dispatch are powerful and easy to misuse. How to introduce agentic features to your team in stages — so they extend capability without creating chaos.',
        time: '6 min',
      },
      {
        number: 10,
        concept: 'Managed Agents',
        conceptSlug: 'managed-agents',
        articleSlug: 'managed-agents-for-your-org',
        label: 'Staying current as Claude evolves',
        takeaway: 'Claude ships major capability updates every few months. How to keep your organization\'s setup current without constant fire drills — and how to evaluate new features before rolling them out.',
        time: '5 min',
      },
    ],
  },
]

export default function LearnClaudeForAdminsPage() {
  const totalSteps = STAGES.reduce((sum, s) => sum + s.steps.length, 0)
  const totalTime = STAGES.reduce((sum, s) =>
    sum + s.steps.reduce((ss, step) => ss + parseInt(step.time), 0), 0
  )

  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)' }}>
        <Link href="/learn" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Learn</Link>
        <span>›</span>
        <span style={{ color: 'var(--text-secondary)' }}>Setting up Claude for your company</span>
      </nav>

      {/* Header */}
      <div style={{ marginBottom: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <p className="eyebrow">For administrators & IT leads</p>
          <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 500, background: ACCENT_BG, color: ACCENT, fontFamily: 'var(--font-sans)' }}>
            {totalSteps} concepts · ~{totalTime} min
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
          Setting up Claude for your company
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-muted)', maxWidth: '56ch', lineHeight: 1.65 }}>
          Three stages, in the right order. Whether you&apos;re doing this on top of your other job
          or it&apos;s your whole role — this path takes you from evaluation to running Claude
          confidently across your whole organization.
        </p>
      </div>

      {/* Staged Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {STAGES.map((stage) => (
          <div key={stage.number}>
            {/* Stage header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
              paddingLeft: '0',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '22px',
                  height: '22px',
                  borderRadius: '4px',
                  background: ACCENT_BG,
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: ACCENT,
                  flexShrink: 0,
                }}>
                  {stage.number}
                </span>
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: 0,
                }}>
                  {stage.label}
                </p>
                <span style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  margin: 0,
                }}>
                  — {stage.subtitle}
                </span>
              </div>
            </div>

            {/* Steps in this stage */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '19px',
                top: '14px',
                bottom: '14px',
                width: '1px',
                background: 'var(--border-base)',
              }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {stage.steps.map((step, i) => (
                  <StepCard
                    key={step.number}
                    step={step}
                    isLast={i === stage.steps.length - 1}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
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
          See everything Claude can do
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.6 }}>
          A full map of Claude&apos;s features — organized by capability group — for admins doing due diligence or planning what to roll out next.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const }}>
          <Link
            href="/glossary/claude-features"
            style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: ACCENT, textDecoration: 'none', fontWeight: 500 }}
          >
            Claude feature map →
          </Link>
          <Link
            href="/articles"
            style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'none' }}
          >
            All articles →
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

type Step = {
  number: number
  concept: string
  conceptSlug: string
  articleSlug: string
  label: string
  takeaway: string
  time: string
}

function StepCard({ step, isLast }: { step: Step; isLast: boolean }) {
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
        className="admin-step-card"
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
        .admin-step-card:hover {
          border-color: ${ACCENT}40 !important;
          background: var(--bg-subtle) !important;
        }
      `}</style>
    </Link>
  )
}
