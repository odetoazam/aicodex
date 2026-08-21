import Link from 'next/link'
import AcademyTrackCallout from '@/components/AcademyTrackCallout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Becoming an AI Agent Manager — AI Codex',
  description: 'The operational playbook for the AI Agent Manager (a.k.a. AI Ops Manager / Agent Operator): the person responsible for running AI agents inside their own company. First 90 days, wiring systems, evals without code, fixing what breaks, change management, cost control, and reporting ROI.',
}

const ACCENT = '#C28A3E'
const ACCENT_BG = 'rgba(194,138,62,0.12)'

const STEPS = [
  {
    number: 1,
    articleSlug: 'what-is-an-agent-operator',
    label: 'The role: who owns AI agents inside a company',
    takeaway: 'Aaron Levie predicts 500,000 to 1 million companies will hire someone to run their AI agents internally. The market is still arguing over the title — AI Agent Manager, AI Ops Manager, Agent Operator — but the job is real and most companies already have this person. What the role actually involves.',
    time: '9 min',
  },
  {
    number: 2,
    articleSlug: 'agent-operator-first-90-days',
    label: 'Your first 90 days — what to build, in what order',
    takeaway: 'The sequence that avoids the most common failure: trying to automate everything at once. Which workflow to map first, how to ship one reliable agent before touching the next, and the milestones that prove the function is working by day 90.',
    time: '10 min',
  },
  {
    number: 3,
    articleSlug: 'wiring-internal-systems-to-agents',
    label: 'Wiring your internal systems — without an engineer',
    takeaway: 'What connecting Claude to your CRM, ERP, or ticketing system actually involves — what you can do yourself with connectors and what genuinely needs an engineer. The honest line between "configure it this afternoon" and "open a ticket with IT."',
    time: '9 min',
  },
  {
    number: 4,
    articleSlug: 'how-to-evaluate-your-agents',
    label: 'Evals without being a developer',
    takeaway: 'The most-tested skill in agent-management interviews, and the one most operators skip. A no-code path to knowing whether your agent is actually reliable before someone in the company finds out it isn’t. How to build a test set you trust.',
    time: '9 min',
  },
  {
    number: 5,
    articleSlug: 'when-agents-break',
    label: 'When your agent breaks — diagnose and fix',
    takeaway: 'Agents fail differently than software. When the contract-review agent starts hallucinating clause details, where do you even look? A diagnostic process you can follow without reading code, and the fixes that actually hold.',
    time: '8 min',
  },
  {
    number: 6,
    articleSlug: 'agent-change-management',
    label: 'Getting a resistant team to actually use it',
    takeaway: 'The change-management problem nobody warned you about: the warehouse team routes around the agent, the finance team loves it. Why adoption stalls, and how to handle the employee who keeps going around the system because they don’t trust it.',
    time: '8 min',
  },
  {
    number: 7,
    articleSlug: 'agent-operator-cost-control',
    label: 'Keeping costs under control as you scale',
    takeaway: 'The monthly bill that starts small and quietly compounds. Where agent token costs actually come from, the threshold where you need to care, and the levers that cut spend without cutting capability.',
    time: '7 min',
  },
  {
    number: 8,
    articleSlug: 'agent-operator-roi-reporting',
    label: 'Showing ROI to your CEO',
    takeaway: 'What to measure and how to report it so the AI initiative survives the next budget review. The monthly update format that justifies your roadmap — and your own title and compensation review along with it.',
    time: '7 min',
  },
]

export default function LearnAgentManagerPage() {
  const totalTime = STEPS.reduce((sum, s) => sum + parseInt(s.time), 0)

  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)' }}>
        <Link href="/learn" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Learn</Link>
        <span>›</span>
        <span style={{ color: 'var(--text-secondary)' }}>Becoming an AI Agent Manager</span>
      </nav>

      {/* Header */}
      <div style={{ marginBottom: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <span style={{
            padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600,
            fontFamily: 'var(--font-sans)', letterSpacing: '0.04em',
            background: ACCENT_BG, color: ACCENT,
          }}>
            for the person who owns AI internally
          </span>
          <span style={{
            padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 500,
            background: 'var(--bg-subtle)', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)',
          }}>
            {STEPS.length} guides · ~{totalTime} min
          </span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(22px, 3vw, 30px)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          marginBottom: '16px',
        }}>
          Becoming an AI Agent Manager
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)',
          color: 'var(--text-muted)', maxWidth: '58ch', lineHeight: 1.65,
        }}>
          Someone at your company is now responsible for making AI agents actually work — mapping workflows, wiring
          systems, writing evals, handling the team that won&apos;t adopt it, and proving ROI to the CEO. The title is
          still settling (AI Agent Manager, AI Ops Manager, Agent Operator all describe it), and most people doing the
          job were handed it with no playbook. This is that playbook: eight guides, in the order you actually hit them,
          written for someone doing it largely alone and not necessarily a developer.
        </p>
      </div>

      {/* Steps */}
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', left: '19px', top: '40px', bottom: '40px',
          width: '1px', background: 'var(--border-base)',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {STEPS.map((step, i) => (
            <div key={step.number} style={{ paddingLeft: '52px', paddingBottom: i === STEPS.length - 1 ? '0' : '4px' }}>
              <Link href={`/articles/${step.articleSlug}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div
                  style={{
                    position: 'relative', padding: '20px 24px', borderRadius: '8px',
                    border: '1px solid var(--border-base)', background: 'var(--bg-surface)',
                    borderLeft: `3px solid ${ACCENT}40`,
                    transition: 'border-left-color 150ms ease, background 150ms ease',
                  }}
                  className="agm-step-card"
                >
                  <div style={{
                    position: 'absolute', left: '-34px', top: '20px',
                    width: '28px', height: '28px', borderRadius: '4px',
                    background: 'var(--bg-base)', border: '1px solid var(--border-base)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)',
                  }}>
                    {String(step.number).padStart(2, '0')}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600,
                        color: 'var(--text-primary)', margin: '0 0 6px', lineHeight: 1.3,
                      }}>
                        {step.label}
                      </p>
                      <p style={{
                        fontFamily: 'var(--font-sans)', fontSize: '13px',
                        color: 'var(--text-muted)', margin: 0, lineHeight: 1.6,
                      }}>
                        {step.takeaway}
                      </p>
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)',
                      flexShrink: 0, paddingTop: '2px',
                    }}>
                      {step.time}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .agm-step-card:hover {
          background: var(--bg-subtle) !important;
          border-left-color: ${ACCENT} !important;
        }
      `}</style>
      <AcademyTrackCallout trackId="agent-manager" />

    </div>
  )
}
