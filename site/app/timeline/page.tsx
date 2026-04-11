import type { Metadata } from 'next'
import TimelineView from '@/components/TimelineView'

export const metadata: Metadata = {
  title: 'AI Timeline — AI Codex',
  description: 'Major launches, model releases, and product updates across the AI landscape. What shipped, when, and why it matters.',
}

export default function TimelinePage() {
  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>

      {/* Header */}
      <div style={{ marginBottom: '56px' }}>
        <p className="eyebrow" style={{ marginBottom: '16px' }}>AI Timeline</p>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          marginBottom: '16px',
          maxWidth: '24ch',
        }}>
          What shipped, when, and why it mattered.
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-base)',
          color: 'var(--text-muted)',
          maxWidth: '52ch',
          lineHeight: 1.65,
        }}>
          Major launches, model releases, and product announcements across the AI landscape — from ChatGPT going mainstream to the rise of autonomous agents. Filter by org or read it all.
        </p>
      </div>

      <TimelineView />
    </div>
  )
}
