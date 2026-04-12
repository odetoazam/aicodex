import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Claude for Customer Success — AI Codex',
  description: 'An 8-step learning path for CS managers and CS leads: how to use Claude to handle volume, prep for renewals, build team consistency, and reclaim time for the work that actually requires you.',
}

const STEPS = [
  {
    number: 1,
    concept: 'Customer Success Overview',
    conceptSlug: 'claude-projects',
    articleSlug: 'ai-for-customer-success',
    label: 'Start with what CS teams actually get from Claude',
    takeaway: 'The specific ways CS teams use Claude — ticket volume, renewal prep, QBR writing — and why CS is one of the functions where AI ROI is fastest to realise.',
    time: '5 min',
  },
  {
    number: 2,
    concept: 'Day in the Life',
    conceptSlug: 'claude-projects',
    articleSlug: 'cs-manager-ai-workflow',
    label: 'What it looks like in practice',
    takeaway: "A CS manager's real workflow with Claude — morning inbox, escalation drafting, QBR prep — including what Claude changes and what it doesn't touch.",
    time: '8 min',
  },
  {
    number: 3,
    concept: 'Claude Projects',
    conceptSlug: 'claude-projects',
    articleSlug: 'claude-projects-org-structure',
    label: 'Build the shared foundation for your team',
    takeaway: 'How to structure a CS Project so every rep starts from the same baseline — the naming convention, what documents to upload, and how to assign ownership.',
    time: '7 min',
  },
  {
    number: 4,
    concept: 'System Prompt',
    conceptSlug: 'system-prompt',
    articleSlug: 'writing-system-prompts-that-work',
    label: 'Write the prompt that defines your team standard',
    takeaway: 'How to write a CS system prompt that encodes your best rep\'s voice and judgment — so outputs are consistent regardless of who is using it.',
    time: '7 min',
  },
  {
    number: 5,
    concept: 'QBR & Renewal Prep',
    conceptSlug: 'claude-projects',
    articleSlug: 'cs-qbr-and-renewal-prep-with-claude',
    label: 'Cut QBR prep time in half',
    takeaway: 'The specific workflow for using Claude to build QBR narratives and renewal cases — what to paste in, what prompts to use, and where to add the human judgment.',
    time: '6 min',
  },
  {
    number: 6,
    concept: 'Connector',
    conceptSlug: 'connector',
    articleSlug: 'claude-plus-intercom',
    label: 'Connect Claude to your CS tools',
    takeaway: 'How to connect Claude to Intercom and your helpdesk so reps are not copy-pasting — and what changes when Claude can see the ticket directly.',
    time: '6 min',
  },
  {
    number: 7,
    concept: 'Team Playbook',
    conceptSlug: 'claude-projects',
    articleSlug: 'claude-cs-team-playbook',
    label: 'Build the infrastructure that scales your whole team',
    takeaway: "The CS leader's job: shared Project setup, prompt library, new rep training with Claude, and how to measure whether the team's floor is actually rising.",
    time: '8 min',
  },
  {
    number: 8,
    concept: 'Measuring ROI',
    conceptSlug: 'claude-plans',
    articleSlug: 'measuring-ai-roi',
    label: 'Know if it is actually working',
    takeaway: 'How to measure the time savings, quality improvement, and new capabilities that Claude delivers for CS — without needing a data team to do it.',
    time: '6 min',
  },
]

const ACCENT = '#C45E8A'
const ACCENT_BG = 'rgba(196,94,138,0.1)'

export default function LearnClaudeForCSPage() {
  const totalTime = STEPS.reduce((sum, s) => sum + parseInt(s.time), 0)

  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)' }}>
        <Link href="/learn" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Learn</Link>
        <span>›</span>
        <span style={{ color: 'var(--text-secondary)' }}>Claude for Customer Success</span>
      </nav>

      {/* Header */}
      <div style={{ marginBottom: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <p className="eyebrow">For CS managers & CS leads</p>
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
          Claude for Customer Success
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-muted)', maxWidth: '56ch', lineHeight: 1.65 }}>
          Eight steps from individual workflows to team-level infrastructure. Start with how
          Claude shows up in a CS manager's real day, build the shared Project your team runs
          on, and finish with how to measure whether it's actually working.
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
          Also worth reading
        </p>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
          CS is not the only team with high-volume text work
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.6 }}>
          HR, finance, legal, and product teams all have role-specific guides. Read how other functions are approaching the same problems.
        </p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' as const }}>
          <Link
            href="/articles/claude-for-hr-teams"
            style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: ACCENT, textDecoration: 'none', fontWeight: 500 }}
          >
            Claude for HR teams →
          </Link>
          <Link
            href="/articles/claude-for-finance-teams"
            style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'none' }}
          >
            Claude for finance teams →
          </Link>
          <Link
            href="/articles"
            style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'none' }}
          >
            All articles →
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
