import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tools — AI Codex',
  description: 'Free interactive tools for AI operators and developers. Prompt library, cost calculator, system prompt builder, and implementation maturity scorecard.',
}

const TOOLS = [
  {
    href: '/tools/prompt-library',
    icon: '◇',
    title: 'Prompt Library',
    description: 'Curated, copy-paste-ready prompts for everyday tasks — summarizing, drafting, researching, analyzing, extracting, reviewing, planning, comparing. Each one is tested, explained, and ready to use.',
    tags: ['Free', 'No signup'],
    accent: '#4CAF7D',
    cta: 'Browse prompts',
  },
  {
    href: '/tools/cost-calculator',
    icon: '◈',
    title: 'Claude API Cost Calculator',
    description: 'Estimate your monthly Claude API spend before you commit. Enter messages per day, token counts, and model — get daily, monthly, and yearly cost breakdowns with and without prompt caching.',
    tags: ['Free', 'No signup'],
    accent: '#D4845A',
    cta: 'Calculate cost',
  },
  {
    href: '/tools/system-prompt-builder',
    icon: '⌥',
    title: 'System Prompt Builder',
    description: 'Answer a few questions about your use case — tone, output format, audience, constraints — and get a production-ready system prompt you can copy and paste directly into your app.',
    tags: ['Free', 'No signup'],
    accent: '#7B8FD4',
    cta: 'Build a prompt',
  },
  {
    href: '/tools/scorecard',
    icon: '◬',
    title: 'AI Implementation Maturity Scorecard',
    description: '10 questions. Find out where you actually stand on your Claude implementation — evals, cost monitoring, error handling, security — and get a specific list of gaps to close.',
    tags: ['Free', 'No signup'],
    accent: '#4CAF7D',
    cta: 'Take the scorecard',
  },
]

export default function ToolsPage() {
  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>

      {/* Header */}
      <div style={{ marginBottom: '56px' }}>
        <p className="eyebrow" style={{ marginBottom: '16px' }}>Tools</p>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          marginBottom: '16px',
          maxWidth: '20ch',
        }}>
          Free tools for AI operators
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-base)',
          color: 'var(--text-muted)',
          maxWidth: '52ch',
          lineHeight: 1.65,
        }}>
          Interactive utilities built for the decisions you actually face when shipping AI in production. No signup, no paywalls.
        </p>
      </div>

      {/* Tool cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {TOOLS.map(tool => (
          <Link
            key={tool.href}
            href={tool.href}
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div
              style={{
                padding: '32px',
                borderRadius: '12px',
                border: '1px solid var(--border-base)',
                borderTop: `3px solid ${tool.accent}`,
                background: 'var(--bg-surface)',
                display: 'grid',
                gridTemplateColumns: '48px 1fr auto',
                gap: '20px',
                alignItems: 'flex-start',
                transition: 'background 150ms ease',
              }}
              className="tool-card"
            >
              {/* Icon */}
              <div style={{
                width: '48px', height: '48px', borderRadius: '10px',
                background: `${tool.accent}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', color: tool.accent, flexShrink: 0,
              }}>
                {tool.icon}
              </div>

              {/* Content */}
              <div>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                  {tool.tags.map(tag => (
                    <span key={tag} style={{
                      fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500,
                      padding: '2px 8px', borderRadius: '4px',
                      background: 'var(--bg-subtle)', color: 'var(--text-muted)',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  lineHeight: 1.2,
                  marginBottom: '10px',
                }}>
                  {tool.title}
                </h2>
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                  margin: 0,
                  maxWidth: '56ch',
                }}>
                  {tool.description}
                </p>
              </div>

              {/* CTA */}
              <div style={{ flexShrink: 0, paddingTop: '4px' }}>
                <span style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: tool.accent,
                  whiteSpace: 'nowrap',
                }}>
                  {tool.cta} →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .tool-card:hover {
          background: var(--bg-subtle) !important;
        }
        @media (max-width: 640px) {
          .tool-card { grid-template-columns: 1fr !important; }
          .tool-card > div:first-child { display: none !important; }
        }
      `}</style>
    </div>
  )
}
