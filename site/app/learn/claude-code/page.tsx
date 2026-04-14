import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Setting up Claude Code for your team — AI Codex',
  description: 'How to configure the .claude folder properly: CLAUDE.md, permissions, hooks, and the team coordination decisions that make Claude Code actually reliable.',
}

const ACCENT = '#5DA698'
const ACCENT_BG = 'rgba(93,166,152,0.1)'

const STEPS = [
  {
    number: 1,
    articleSlug: 'claude-code-project-setup',
    label: 'The five layers — in order of leverage',
    takeaway: 'CLAUDE.md, settings.json, hooks, rules/, skills and agents. What each one does, which ones most teams actually need, and the order to set them up so you are not configuring things before you understand why.',
    time: '9 min',
  },
  {
    number: 2,
    articleSlug: 'claude-md-vs-hooks',
    label: 'Instructions Claude follows vs. rules it cannot break',
    takeaway: 'CLAUDE.md is a suggestion. Hooks are a guarantee. This distinction is the mental model the whole system is built on — and the reason most Claude Code setups have gaps in them.',
    time: '6 min',
  },
  {
    number: 3,
    articleSlug: 'claude-md-templates',
    label: 'What to actually write in CLAUDE.md',
    takeaway: 'Four starting templates — solo project, team backend, agency client repo, and non-code ops setup — with annotations explaining what each section does and why. The answer to the question every setup article skips.',
    time: '8 min',
  },
  {
    number: 4,
    articleSlug: 'claude-code-for-your-team',
    label: 'The five decisions your team makes together',
    takeaway: 'Who owns CLAUDE.md. What the deny list blocks. How to write hooks that work on every machine. The split between personal and shared config. And when to graduate to rules/ — which is later than most people think.',
    time: '7 min',
  },
  {
    number: 5,
    articleSlug: 'claude-md-maintenance',
    label: 'Keeping CLAUDE.md accurate over time',
    takeaway: 'CLAUDE.md decays quietly: it gets too long, instructions contradict each other, the architecture changes but the file does not. The four failure modes and the one maintenance habit that prevents all of them.',
    time: '6 min',
  },
  {
    number: 6,
    articleSlug: 'ai-agent-harness-explained',
    label: 'Beyond config: the agent layer',
    takeaway: 'Once your .claude folder is set up, this is what comes next. What Managed Agents are, how the hosted agent loop works, and how it compares to building your own agent harness. For teams ready to go further than configuration.',
    time: '8 min',
  },
]

export default function LearnClaudeCodePage() {
  const totalTime = STEPS.reduce((sum, s) => sum + parseInt(s.time), 0)

  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)' }}>
        <Link href="/learn" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Learn</Link>
        <span>›</span>
        <span style={{ color: 'var(--text-secondary)' }}>Setting up Claude Code for your team</span>
      </nav>

      {/* Header */}
      <div style={{ marginBottom: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <span style={{
            padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600,
            fontFamily: 'var(--font-sans)', letterSpacing: '0.04em',
            background: ACCENT_BG, color: ACCENT,
          }}>
            for teams using Claude Code
          </span>
          <span style={{
            padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 500,
            background: 'var(--bg-subtle)', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)',
          }}>
            {STEPS.length} guides · ~{totalTime} min
          </span>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(22px, 3vw, 30px)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            marginBottom: '16px',
          }}
        >
          Setting up Claude Code for your team
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)',
          color: 'var(--text-muted)', maxWidth: '56ch', lineHeight: 1.65,
        }}>
          The .claude folder is a team agreement, not a developer configuration file.
          These guides cover what to set up, what to actually write in CLAUDE.md,
          which decisions to make together as a team, how to keep it accurate as the
          project evolves, and what the agent layer looks like when you are ready for it.
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
            <div key={step.number} style={{ paddingLeft: '52px', paddingBottom: i === STEPS.length - 1 ? '0' : '4px' }}>
              <Link href={`/articles/${step.articleSlug}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div
                  style={{
                    position: 'relative',
                    padding: '20px 24px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-base)',
                    background: 'var(--bg-surface)',
                    borderLeft: `3px solid ${ACCENT}40`,
                    transition: 'border-left-color 150ms ease, background 150ms ease',
                  }}
                  className="cc-step-card"
                >
                  {/* Step number bubble */}
                  <div style={{
                    position: 'absolute',
                    left: '-34px',
                    top: '20px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '4px',
                    background: 'var(--bg-base)',
                    border: '1px solid var(--border-base)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
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
        .cc-step-card:hover {
          background: var(--bg-subtle) !important;
          border-left-color: ${ACCENT} !important;
        }
      `}</style>
    </div>
  )
}
