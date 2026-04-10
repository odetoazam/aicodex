import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Learn — AI Codex',
  description: 'Structured paths for understanding and using AI — no prior technical knowledge required.',
}

const PATHS = [
  {
    href: '/learn/claude',
    eyebrow: 'Start here',
    title: 'Using Claude',
    description: 'Everything you need to get real work done with Claude — how it thinks, how to direct it, and how to trust its output.',
    accent: '#D4845A',
    accentBg: 'rgba(212,132,90,0.1)',
    icon: '◈',
    steps: 8,
    time: '~40 min',
    tag: 'Most popular',
  },
  {
    href: '/learn/agents',
    eyebrow: 'Going deeper',
    title: 'AI Agents',
    description: 'What it means when AI stops answering questions and starts taking actions — and how to build workflows that actually work.',
    accent: '#7B8FD4',
    accentBg: 'rgba(123,143,212,0.1)',
    icon: '⬡',
    steps: 6,
    time: '~30 min',
    tag: 'Coming soon',
    disabled: true,
  },
  {
    href: '/learn/for-operators',
    eyebrow: 'Non-technical',
    title: 'AI for Operators',
    description: 'How to think about AI adoption for your team — where it helps, where it fails, and how to make confident decisions without a technical background.',
    accent: '#5AAFD4',
    accentBg: 'rgba(90,175,212,0.1)',
    icon: '◐',
    steps: 7,
    time: '~35 min',
    tag: 'Coming soon',
    disabled: true,
  },
]

export default function LearnPage() {
  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>

      <div style={{ marginBottom: '64px' }}>
        <p className="eyebrow" style={{ marginBottom: '16px' }}>Learn</p>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-3xl)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: '16px',
            maxWidth: '18ch',
          }}
        >
          Start where it matters.
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-muted)', maxWidth: '52ch', lineHeight: 1.65 }}>
          Structured paths through the concepts that actually change how you work with AI.
          Each one builds understanding step by step — no jargon, no assumed knowledge.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {PATHS.map(path => (
          <PathCard key={path.href} path={path} />
        ))}
      </div>
    </div>
  )
}

function PathCard({ path }: { path: typeof PATHS[0] }) {
  const inner = (
    <div
      style={{
        padding: '28px 32px',
        borderRadius: '12px',
        border: `1px solid var(--border-base)`,
        borderLeft: `3px solid ${path.disabled ? 'var(--border-base)' : path.accent}`,
        background: 'var(--bg-surface)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '24px',
        opacity: path.disabled ? 0.5 : 1,
        transition: 'border-color 150ms ease, background 150ms ease',
      }}
      className={path.disabled ? '' : 'path-card'}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: path.disabled ? 'var(--text-muted)' : path.accent, margin: 0 }}>
            {path.eyebrow}
          </p>
          {path.tag && (
            <span style={{
              padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 500,
              background: path.disabled ? 'var(--bg-subtle)' : path.accentBg,
              color: path.disabled ? 'var(--text-muted)' : path.accent,
              fontFamily: 'var(--font-sans)',
            }}>
              {path.tag}
            </span>
          )}
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px', lineHeight: 1.2 }}>
          {path.title}
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0, maxWidth: '56ch' }}>
          {path.description}
        </p>
      </div>

      <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '24px', color: path.disabled ? 'var(--text-muted)' : path.accent, marginBottom: '8px', lineHeight: 1 }}>
          {path.icon}
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 2px' }}>
          {path.steps} concepts
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
          {path.time}
        </p>
      </div>
    </div>
  )

  if (path.disabled) return <div key={path.href}>{inner}</div>

  return (
    <Link href={path.href} style={{ textDecoration: 'none', display: 'block' }}>
      {inner}
    </Link>
  )
}
