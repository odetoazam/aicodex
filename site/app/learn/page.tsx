import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Learn — AI Codex',
  description: 'Structured learning paths for individuals, managers, and teams implementing Claude at work.',
}

const TRACKS = [
  {
    href: '/learn/claude',
    eyebrow: 'For individuals',
    title: 'Claude for your work',
    description: 'For anyone using Claude personally who wants to get noticeably better at it. How to prompt well, what Claude is actually good at, the mistakes everyone makes first, and how to build a workflow that sticks.',
    accent: '#D4845A',
    accentBg: 'rgba(212,132,90,0.1)',
    icon: '◈',
    steps: 8,
    time: '~40 min',
  },
  {
    href: '/learn/for-your-team',
    eyebrow: 'For managers & department heads',
    title: 'Rolling out Claude to your team',
    description: 'For the person responsible for getting their team actually using Claude. From deciding where to start, to setting up Projects and system prompts, to knowing whether it\'s making a real difference.',
    accent: '#4CAF7D',
    accentBg: 'rgba(76,175,125,0.1)',
    icon: '⬡',
    steps: 8,
    time: '~41 min',
  },
  {
    href: '/learn/claude-for-admins',
    eyebrow: 'For IT & operations leads',
    title: 'Setting up Claude for your company',
    description: 'For the person asked to deploy Claude org-wide. Three stages — evaluation, deployment, ongoing management — with the exact decisions you need to make at each step.',
    accent: '#5B8DD9',
    accentBg: 'rgba(91,141,217,0.1)',
    icon: '◫',
    steps: 12,
    time: '~69 min',
  },
]

const CLAUDE_CODE_PATH = {
  href: '/learn/claude-code',
  eyebrow: 'For teams using Claude Code',
  title: 'Setting up Claude Code for your team',
  description: 'Six guides on the .claude folder: what to configure, what to write in CLAUDE.md, which decisions to make as a team, how to keep it accurate, and what the agent layer looks like when you are ready for it.',
  accent: '#5DA698',
  accentBg: 'rgba(93,166,152,0.1)',
  steps: 6,
  time: '~44 min',
}

const BWAI_PATH = {
  href: '/learn/build-with-ai',
  eyebrow: 'Going further',
  title: 'Building AI tools for your team',
  description: 'Once you know what your team needs — and what you\'d build if you could — this path covers the practical side: what to build, how to build it, the mistakes that kill early AI products, and how to deploy something that lasts.',
  accent: '#4CAF7D',
  accentBg: 'rgba(76,175,125,0.1)',
  steps: 10,
  time: '~64 min',
}

const DEV_PATH = {
  href: '/learn/developers',
  title: 'Building with the Claude API',
  description: 'Implementation guides that assume you can code. The messages array, streaming, RAG, evals, tool use, prompt caching, cost optimization, persistent memory, auth, and rate limiting.',
  accent: '#7B8FD4',
  accentBg: 'rgba(123,143,212,0.1)',
  steps: 20,
  time: '~144 min',
}


export default function LearnPage() {
  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>

      {/* Header */}
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
          Which of these is you?
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-muted)', maxWidth: '52ch', lineHeight: 1.65 }}>
          Pick the path that fits where you actually are — not a topic, not a product.
          Each one is sequenced to build on itself. Start at step 1, or jump to wherever you're stuck.
        </p>
      </div>

      {/* New-user nudge */}
      <div style={{
        padding: '14px 20px',
        borderRadius: '8px',
        background: 'rgba(212,132,90,0.06)',
        border: '1px solid rgba(212,132,90,0.2)',
        marginBottom: '28px',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' as const }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Used AI before but new to Claude?</span>
            {' '}Path 1 is the right starting point.
          </p>
          <Link href="/learn/claude" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, color: '#D4845A', textDecoration: 'none', whiteSpace: 'nowrap' as const }}>
            Start path 1 →
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' as const }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Never used AI before?</span>
            {' '}Read this first — it takes 8 minutes.
          </p>
          <Link href="/articles/new-to-ai-start-here" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, color: '#D4845A', textDecoration: 'none', whiteSpace: 'nowrap' as const }}>
            Start here →
          </Link>
        </div>
      </div>

      {/* 3 main tracks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '56px' }}>
        {TRACKS.map((track, i) => (
          <Link key={track.href} href={track.href} style={{ textDecoration: 'none', display: 'block' }}>
            <div
              className="track-card"
              style={{
                padding: '28px 32px',
                borderRadius: '12px',
                border: `1px solid var(--border-base)`,
                borderLeft: `3px solid ${track.accent}`,
                background: 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '24px',
                transition: 'background 150ms ease',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: track.accentBg,
                    fontFamily: 'var(--font-sans)',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: track.accent,
                    flexShrink: 0,
                  }}>
                    {i + 1}
                  </span>
                  <p style={{
                    fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500,
                    letterSpacing: '0.06em', textTransform: 'uppercase' as const,
                    color: track.accent, margin: 0,
                  }}>
                    {track.eyebrow}
                  </p>
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'var(--text-xl)',
                  fontWeight: 600,
                  color: 'var(--text-primary)', marginBottom: '10px', lineHeight: 1.2,
                }}>
                  {track.title}
                </h2>
                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-muted)',
                  lineHeight: 1.6, margin: 0, maxWidth: '56ch',
                }}>
                  {track.description}
                </p>
              </div>

              <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: '24px',
                  color: track.accent, marginBottom: '8px', lineHeight: 1,
                }}>
                  {track.icon}
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 2px' }}>
                  {track.steps} steps
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                  {track.time}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Build with AI — sub-path within the you/team/company framework */}
      <div style={{ marginBottom: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ height: '1px', flex: 1, background: 'var(--border-muted)' }} />
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', color: 'var(--text-muted)', flexShrink: 0 }}>
            WHEN YOU'RE READY TO BUILD
          </p>
          <div style={{ height: '1px', flex: 1, background: 'var(--border-muted)' }} />
        </div>
        <Link href={BWAI_PATH.href} style={{ textDecoration: 'none', display: 'block' }}>
          <div
            className="track-card"
            style={{
              padding: '24px 28px',
              borderRadius: '12px',
              border: `1px solid var(--border-muted)`,
              borderLeft: `3px solid ${BWAI_PATH.accent}`,
              background: 'var(--bg-subtle)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '24px',
              transition: 'background 150ms ease',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500,
                letterSpacing: '0.06em', textTransform: 'uppercase' as const,
                color: BWAI_PATH.accent, margin: '0 0 8px',
              }}>
                {BWAI_PATH.eyebrow}
              </p>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--text-lg)',
                fontWeight: 600,
                color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.2,
              }}>
                {BWAI_PATH.title}
              </h2>
              <p style={{
                fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)',
                lineHeight: 1.6, margin: 0, maxWidth: '58ch',
              }}>
                {BWAI_PATH.description}
              </p>
            </div>
            <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 2px' }}>
                {BWAI_PATH.steps} steps
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                {BWAI_PATH.time}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Claude Code path */}
      <div style={{ marginBottom: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ height: '1px', flex: 1, background: 'var(--border-muted)' }} />
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', color: 'var(--text-muted)', flexShrink: 0 }}>
            FOR CLAUDE CODE USERS
          </p>
          <div style={{ height: '1px', flex: 1, background: 'var(--border-muted)' }} />
        </div>
        <Link href={CLAUDE_CODE_PATH.href} style={{ textDecoration: 'none', display: 'block' }}>
          <div
            className="track-card"
            style={{
              padding: '24px 28px',
              borderRadius: '12px',
              border: `1px solid var(--border-muted)`,
              borderLeft: `3px solid ${CLAUDE_CODE_PATH.accent}`,
              background: 'var(--bg-subtle)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '24px',
              transition: 'background 150ms ease',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500,
                letterSpacing: '0.06em', textTransform: 'uppercase' as const,
                color: CLAUDE_CODE_PATH.accent, margin: '0 0 8px',
              }}>
                {CLAUDE_CODE_PATH.eyebrow}
              </p>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--text-lg)',
                fontWeight: 600,
                color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.2,
              }}>
                {CLAUDE_CODE_PATH.title}
              </h2>
              <p style={{
                fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)',
                lineHeight: 1.6, margin: 0, maxWidth: '58ch',
              }}>
                {CLAUDE_CODE_PATH.description}
              </p>
            </div>
            <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 2px' }}>
                {CLAUDE_CODE_PATH.steps} steps
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                {CLAUDE_CODE_PATH.time}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Divider with label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-base)' }} />
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.06em', flexShrink: 0 }}>
          FOR DEVELOPERS
        </p>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-base)' }} />
      </div>

      {/* Developer path */}
      <Link href={DEV_PATH.href} style={{ textDecoration: 'none', display: 'block', marginBottom: '0' }}>
        <div
          className="track-card"
          style={{
            padding: '24px 28px',
            borderRadius: '12px',
            border: `1px solid var(--border-base)`,
            borderLeft: `3px solid ${DEV_PATH.accent}`,
            background: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            transition: 'background 150ms ease',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{
                padding: '2px 8px', borderRadius: '4px',
                fontSize: '10px', fontWeight: 600, letterSpacing: '0.04em',
                background: DEV_PATH.accentBg, color: DEV_PATH.accent,
                fontFamily: 'var(--font-mono)',
              }}>
                {'{ }'}
              </span>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '11px',
                color: DEV_PATH.accent, margin: 0, letterSpacing: '0.03em',
              }}>
                // technical
              </p>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-lg)',
              fontWeight: 600,
              color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.2,
            }}>
              {DEV_PATH.title}
            </h2>
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)',
              lineHeight: 1.6, margin: 0, maxWidth: '60ch',
            }}>
              {DEV_PATH.description}
            </p>
          </div>
          <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 2px' }}>
              {DEV_PATH.steps} steps
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
              {DEV_PATH.time}
            </p>
          </div>
        </div>
      </Link>

      <style>{`
        .track-card:hover {
          background: var(--bg-subtle) !important;
        }
      `}</style>
    </div>
  )
}
