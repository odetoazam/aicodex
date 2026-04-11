import type { Metadata } from 'next'
import IntegrationsView from '@/components/IntegrationsView'

export const metadata: Metadata = {
  title: 'Claude Integrations — AI Codex',
  description: 'Every Claude connector, skill, and integration explained plainly — what it does, how you\'d actually use it, and whether it\'s worth setting up for your role.',
}

export default function IntegrationsPage() {
  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>
      <div style={{ marginBottom: '56px' }}>
        <p className="eyebrow" style={{ marginBottom: '16px' }}>Integrations</p>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'var(--text-3xl)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          marginBottom: '16px',
          maxWidth: '26ch',
        }}>
          What to actually set up — by role.
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-base)',
          color: 'var(--text-muted)',
          maxWidth: '54ch',
          lineHeight: 1.65,
        }}>
          Anthropic has a full directory. This is the opinionated version — what to set up first, what order, and what's genuinely worth your time for your specific situation.
        </p>
      </div>

      <IntegrationsView />
    </div>
  )
}
