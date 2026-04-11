import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Learn — AI Codex',
  description: 'Structured learning paths for operators, founders, and teams implementing AI at work.',
}

const PATHS = [
  {
    href: '/learn/claude',
    eyebrow: 'New to AI or Claude',
    title: 'How Claude actually works',
    description: 'Start here if you\'re new. How Claude thinks, why it responds the way it does, how to give it better instructions, and when to trust what it says. No technical background needed.',
    accent: '#D4845A',
    accentBg: 'rgba(212,132,90,0.1)',
    icon: '◈',
    steps: 8,
    time: '~40 min',
    tag: 'Start here',
    disabled: false,
  },
  {
    href: '/learn/ai-for-your-company',
    eyebrow: 'For founders & ops leaders',
    title: 'Figuring out AI for your company',
    description: 'Is AI right for you right now? Where to start, how to run a pilot, what most teams get wrong, and how to build the internal case — without needing a technical co-founder to explain it.',
    accent: '#5AAFD4',
    accentBg: 'rgba(90,175,212,0.1)',
    icon: '◐',
    steps: 7,
    time: '~35 min',
    tag: 'Available now',
    disabled: false,
  },
  {
    href: '/learn/getting-your-team-started',
    eyebrow: 'For department heads',
    title: 'Getting your team actually using AI',
    description: "Setting up Claude for your team, writing prompts that work consistently, the most valuable use cases for CS, ops, and marketing — and what to do when it doesn't go as planned.",
    accent: '#4CAF7D',
    accentBg: 'rgba(76,175,125,0.1)',
    icon: '⬡',
    steps: 6,
    time: '~30 min',
    tag: 'Available now',
    disabled: false,
  },
  {
    href: '/learn/claude-for-admins',
    eyebrow: 'For administrators & IT leads',
    title: 'Setting up Claude for your company',
    description: "You've been asked to get Claude working for the whole organization. Three stages — evaluation, deployment, ongoing management — with the exact decisions you need to make at each step.",
    accent: '#5B8DD9',
    accentBg: 'rgba(91,141,217,0.1)',
    icon: '◫',
    steps: 10,
    time: '~54 min',
    tag: 'Available now',
    disabled: false,
  },
  {
    href: '/learn/build-with-ai',
    eyebrow: 'For founders & builders',
    title: 'Building your first AI product',
    description: 'From deciding what to build to shipping it — validate your idea, choose the right stack, avoid the failure modes that catch founders off guard, deploy, and handle production errors.',
    accent: '#4CAF7D',
    accentBg: 'rgba(76,175,125,0.1)',
    icon: '◬',
    steps: 10,
    time: '~61 min',
    tag: 'Available now',
    disabled: false,
  },
  {
    href: '/learn/developers',
    eyebrow: 'For developers',
    title: 'Building with the Claude API',
    description: 'Implementation guides that assume you can code. The messages array, streaming, RAG, evals, tool use, prompt caching, cost optimization, persistent memory, auth, and rate limiting. No business-case framing.',
    accent: '#7B8FD4',
    accentBg: 'rgba(123,143,212,0.1)',
    icon: '⌥',
    steps: 17,
    time: '~121 min',
    tag: 'Technical',
    disabled: false,
  },
]

export default function LearnPage() {
  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>

      <div style={{ marginBottom: '64px' }}>
        <p className="eyebrow" style={{ marginBottom: '16px' }}>Learning Paths</p>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-3xl)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: '16px',
            maxWidth: '22ch',
          }}
        >
          6 structured paths. Pick the one that fits.
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-muted)', maxWidth: '52ch', lineHeight: 1.65 }}>
          Each path is a sequenced set of articles built around where you actually are — not a topic, not a product. Start at step 1 and follow it through, or jump to wherever you're stuck.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {PATHS.map(path => (
          <PathCard key={path.href} path={path} />
        ))}
      </div>

      <style>{`
        .path-card:hover {
          background: var(--bg-subtle) !important;
          border-left-color: currentColor;
        }
      `}</style>
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
        borderLeft: `3px solid ${path.disabled ? 'var(--border-muted)' : path.accent}`,
        background: 'var(--bg-surface)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '24px',
        opacity: path.disabled ? 0.55 : 1,
        transition: 'background 150ms ease',
      }}
      className={path.disabled ? '' : 'path-card'}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500,
            letterSpacing: '0.06em', textTransform: 'uppercase' as const,
            color: path.disabled ? 'var(--text-muted)' : path.accent, margin: 0,
          }}>
            {path.eyebrow}
          </p>
          {path.tag && (
            <span style={{
              padding: '2px 8px', borderRadius: '4px',
              fontSize: path.tag === 'Technical' ? '10px' : '11px',
              fontWeight: path.tag === 'Technical' ? 600 : 500,
              letterSpacing: path.tag === 'Technical' ? '0.04em' : undefined,
              background: path.disabled ? 'var(--bg-subtle)' : path.accentBg,
              color: path.disabled ? 'var(--text-muted)' : path.accent,
              fontFamily: path.tag === 'Technical' ? 'var(--font-mono)' : 'var(--font-sans)',
            }}>
              {path.tag === 'Technical' ? '{ }' : path.tag}
            </span>
          )}
        </div>
        <h2 style={{
          fontFamily: path.tag === 'Technical' ? 'var(--font-mono)' : 'var(--font-serif)',
          fontSize: path.tag === 'Technical' ? 'var(--text-lg)' : 'var(--text-xl)',
          fontWeight: 600,
          color: 'var(--text-primary)', marginBottom: '10px', lineHeight: 1.2,
        }}>
          {path.title}
        </h2>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-muted)',
          lineHeight: 1.6, margin: 0, maxWidth: '56ch',
        }}>
          {path.description}
        </p>
      </div>

      <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: '24px',
          color: path.disabled ? 'var(--text-muted)' : path.accent,
          marginBottom: '8px', lineHeight: 1,
        }}>
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
