'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

// ── Types ────────────────────────────────────────────────────────────────────

type Q1 = 'operator' | 'founder' | 'developer' | 'curious'
type Persona = { id: Q1; headline: string; subtext: string; accent: string }
type Q2Option = { id: string; label: string; sub: string }
type ResultArticle = { slug: string; title: string; time: number; excerpt: string }
type Result = {
  headline: string
  sub: string
  articles: ResultArticle[]
  path: { label: string; href: string }
  /** If set, overrides the default "Start with the first article →" primary button */
  primaryCta?: { label: string; href: string }
}

// ── Content ──────────────────────────────────────────────────────────────────

const PERSONAS: Persona[] = [
  {
    id: 'operator',
    headline: "I'm rolling out AI at my company.",
    subtext: 'I want to know what works, what doesn\'t, and how to get my team actually using it.',
    accent: '#5AAFD4',
  },
  {
    id: 'founder',
    headline: "I'm building a product with Claude.",
    subtext: 'Early stage. Trying to figure out what to build, whether it\'ll work, and how to ship it.',
    accent: '#4CAF7D',
  },
  {
    id: 'developer',
    headline: "I'm a developer integrating the API.",
    subtext: 'I can code. I want production-quality patterns, not hello-world examples.',
    accent: '#7B8FD4',
  },
  {
    id: 'curious',
    headline: "I'm just exploring.",
    subtext: 'Curious about where AI is heading and what it actually means for how work gets done.',
    accent: '#D4845A',
  },
]

const Q2_OPTIONS: Record<Q1, Q2Option[]> = {
  operator: [
    { id: 'start',    label: "We haven't really started yet.",  sub: 'Still evaluating, or just ran a first pilot.' },
    { id: 'adoption', label: "People aren't using it the way I hoped.", sub: 'The tool is there. Adoption is slower than expected.' },
    { id: 'deep',     label: "We're using it — I want to find what we're missing.", sub: 'Feels like we\'re only getting 20% of the value.' },
    { id: 'unsure',   label: "Honestly, I'm not sure where we're at.", sub: 'Not sure if what we\'re doing is good, bad, or average.' },
  ],
  founder: [
    { id: 'idea',  label: "I'm still validating my idea.",     sub: 'Not sure if this is worth building. Testing the hypothesis.' },
    { id: 'build', label: "I'm building it now.",               sub: 'Stacks, prompts, architecture. In the middle of it.' },
    { id: 'users', label: "I have early users.",                sub: 'Real feedback coming in. Trying to grow and not break things.' },
  ],
  developer: [
    { id: 'first',      label: "First Claude integration.",          sub: 'Haven\'t shipped anything yet. Starting from scratch.' },
    { id: 'production', label: "Building for production.",           sub: 'Streaming, tool use, evals, error handling. The real stuff.' },
    { id: 'scale',      label: "Scaling an existing app.",           sub: 'Costs, caching, orchestration. Already working, want it better.' },
  ],
  curious: [
    { id: 'how',   label: "How does this actually work?",       sub: 'LLMs, context windows, prompting — the underlying mechanics.' },
    { id: 'teams', label: "What are companies doing with AI?",  sub: 'Real implementations, real use cases, real results.' },
    { id: 'where', label: "Where is AI heading?",               sub: 'The landscape, who\'s building what, what\'s changing fast.' },
  ],
}

const RESULTS: Record<Q1, Record<string, Result>> = {
  operator: {
    start: {
      headline: 'Start here — your first 30 days.',
      sub: 'Three reads that will shape how you think about this before you commit to anything.',
      articles: [
        { slug: 'running-your-first-ai-pilot', title: 'Running your first AI pilot', time: 6, excerpt: 'The structure that separates pilots that lead to rollout from ones that fade out.' },
        { slug: 'what-to-automate-first', title: 'What to automate first', time: 5, excerpt: 'Not everything is worth automating. How to pick the right first use case.' },
        { slug: 'claude-operator-habits', title: 'The habits of effective Claude operators', time: 7, excerpt: 'What separates the people who get real value from Claude from the ones who don\'t.' },
      ],
      path: { label: 'Full learning path — Getting started with Claude →', href: '/learn/claude' },
    },
    adoption: {
      headline: 'The adoption gap is a system problem.',
      sub: 'It\'s not that people don\'t like AI — it\'s that the system didn\'t support the behavior change.',
      articles: [
        { slug: 'ai-change-management', title: 'AI change management', time: 6, excerpt: 'Why adoption stalls and the organizational levers that actually move it.' },
        { slug: 'writing-system-prompts-that-work', title: 'Writing system prompts that work', time: 5, excerpt: 'The prompts teams actually use vs. the ones they think they need.' },
        { slug: 'measuring-ai-roi', title: 'Measuring AI ROI', time: 6, excerpt: 'What to measure, when to measure it, and what the numbers mean.' },
      ],
      path: { label: 'Team rollout path →', href: '/learn/getting-your-team-started' },
    },
    deep: {
      headline: 'Going deeper — the underused patterns.',
      sub: 'Most teams find 20% of what Claude can do for them. These cover the other 80%.',
      articles: [
        { slug: 'deep-research-guide', title: 'Deep research with Claude', time: 7, excerpt: 'How to use Claude for substantive research that actually changes how you think.' },
        { slug: 'managing-email-with-claude', title: 'Managing email with Claude', time: 5, excerpt: 'The exact workflow for getting to inbox zero without losing context.' },
        { slug: 'claude-projects-role', title: 'Using Claude Projects', time: 5, excerpt: 'Persistent context, custom instructions, and knowledge bases per workspace.' },
      ],
      path: { label: 'All operator articles →', href: '/articles' },
    },
    unsure: {
      headline: 'Find out exactly where you stand.',
      sub: 'Ten questions that tell you what your team is doing well, what\'s missing, and what to focus on next. Takes 3 minutes.',
      articles: [
        { slug: 'claude-operator-habits', title: 'The habits of effective Claude operators', time: 7, excerpt: 'What separates teams getting real value from Claude from the ones who aren\'t — and why the gap is usually small.' },
        { slug: 'measuring-ai-roi', title: 'Measuring AI ROI', time: 6, excerpt: 'What to measure, when to measure it, and what the numbers mean.' },
        { slug: 'what-to-automate-first', title: 'What to automate first', time: 5, excerpt: 'Not everything is worth automating. How to pick the right first use case.' },
      ],
      primaryCta: { label: 'Take the AI maturity scorecard →', href: '/tools/scorecard' },
      path: { label: 'Or read the operator articles →', href: '/articles' },
    },
  },
  founder: {
    idea: {
      headline: 'Validate before you build.',
      sub: 'The cheapest mistakes are the ones you catch before writing a line of code.',
      articles: [
        { slug: 'what-to-build-with-claude', title: 'What to actually build with Claude', time: 6, excerpt: 'How to filter the options, spot structural advantages, and choose the problem worth building for.' },
        { slug: 'validating-startup-idea-with-claude', title: 'Validating your startup idea with Claude', time: 6, excerpt: 'How to pressure-test your assumptions before you commit to building.' },
        { slug: 'customer-discovery-with-claude', title: 'Customer discovery with Claude', time: 6, excerpt: 'Using Claude to simulate interviews, map assumptions, and synthesize what you\'re hearing.' },
      ],
      path: { label: 'Building with AI — full path →', href: '/learn/build-with-ai' },
    },
    build: {
      headline: 'You\'re building. Here\'s what bites people.',
      sub: 'The failure modes are predictable. The architecture decisions that look good until production.',
      articles: [
        { slug: 'build-buy-prompt-early-stage', title: 'Build, buy, or just prompt?', time: 6, excerpt: 'The stack decision that early-stage founders get wrong most often.' },
        { slug: 'ai-product-failure-modes-founders', title: 'AI product failure modes', time: 7, excerpt: 'Eight ways AI products fail in the first six months, and what to do about each.' },
        { slug: 'deploying-claude-app-production', title: 'Deploying to production', time: 7, excerpt: 'Secrets, rate limits, cost controls, observability — the pre-launch checklist.' },
      ],
      path: { label: 'Building with AI — full path →', href: '/learn/build-with-ai' },
    },
    users: {
      headline: 'You have users. Now grow without breaking.',
      sub: 'Pricing, acquisition, and pitching. The business layer on top of the product.',
      articles: [
        { slug: 'pricing-your-ai-product', title: 'Pricing your AI product', time: 6, excerpt: 'The frameworks that work for AI-powered products and the ones that don\'t.' },
        { slug: 'first-ten-customers-ai-product', title: 'Getting your first ten customers', time: 6, excerpt: 'The channels and tactics that actually work for early-stage AI products.' },
        { slug: 'pitching-ai-product-to-investors', title: 'Pitching an AI product to investors', time: 6, excerpt: 'What investors want to hear — and the narrative that makes the difference.' },
      ],
      path: { label: 'Building with AI — full path →', href: '/learn/build-with-ai' },
    },
  },
  developer: {
    first: {
      headline: 'Your first integration, done right.',
      sub: 'Start with the real patterns — not the ones you\'ll have to rewrite in three weeks.',
      articles: [
        { slug: 'your-first-claude-api-call', title: 'Your first Claude API call', time: 7, excerpt: 'Auth, the messages array, streaming, structured output, and error handling — in one guide.' },
        { slug: 'streaming-claude-responses-implementation', title: 'Streaming Claude responses', time: 6, excerpt: 'SSE to the browser, chunk handling, error recovery, and UX patterns.' },
        { slug: 'nextjs-chatbot-claude-full-tutorial', title: 'Build a streaming chatbot in Next.js', time: 10, excerpt: 'End-to-end: API route, SSE, React state, conversation history, Vercel deploy.' },
      ],
      path: { label: 'Full developer path — 13 steps →', href: '/learn/developers' },
    },
    production: {
      headline: 'Production patterns that actually hold up.',
      sub: 'The gap between "it works on localhost" and "it works under real load."',
      articles: [
        { slug: 'deploying-claude-app-production', title: 'Deploying to production', time: 7, excerpt: 'Secrets management, rate limit handling, cost controls, observability, pre-launch checklist.' },
        { slug: 'claude-production-error-handling', title: 'Production error handling', time: 6, excerpt: 'API error taxonomy, output format resilience, hallucination detection, user-facing errors.' },
        { slug: 'prompt-caching-implementation', title: 'Prompt caching implementation', time: 6, excerpt: 'One parameter change that cuts costs 80%+ on workloads with repeated context.' },
      ],
      path: { label: 'Full developer path — 13 steps →', href: '/learn/developers' },
    },
    scale: {
      headline: 'Scaling — the cost and reliability layer.',
      sub: 'What changes when 100 users becomes 10,000 users.',
      articles: [
        { slug: 'claude-cost-optimization', title: 'Cutting Claude API costs', time: 7, excerpt: 'Model routing, batch API, output length control, context management. Most apps find 40-60% savings.' },
        { slug: 'tool-use-implementation-deep-dive', title: 'Tool use in production', time: 8, excerpt: 'Parallel tool calls, multi-turn handling, error surfaces, and the failure modes that bite.' },
        { slug: 'multi-agent-orchestration-basics', title: 'Multi-agent orchestration', time: 8, excerpt: 'Orchestrator + subagents, state management, checkpoints. When one Claude isn\'t enough.' },
      ],
      path: { label: 'Full developer path — 13 steps →', href: '/learn/developers' },
    },
  },
  curious: {
    how: {
      headline: 'The mechanics, not the marketing.',
      sub: 'How it actually works — context windows, tokens, what the model can and can\'t do.',
      articles: [
        { slug: 'context-window-practical', title: 'Context windows in practice', time: 5, excerpt: 'What the context window is, how it runs out, and what to do when it does.' },
        { slug: 'large-language-model-def', title: 'What is a large language model?', time: 4, excerpt: 'The clearest explanation of what LLMs actually are and how they work.' },
        { slug: 'hallucination-role', title: 'Understanding hallucination', time: 5, excerpt: 'Why models confidently say wrong things and what to do about it.' },
      ],
      path: { label: 'Start with the fundamentals →', href: '/learn/claude' },
    },
    teams: {
      headline: 'What real teams are actually doing.',
      sub: 'Not the press releases — the patterns that actually made a difference.',
      articles: [
        { slug: 'claude-operator-habits', title: 'The habits of effective Claude operators', time: 7, excerpt: 'What the people getting real value from Claude are doing differently.' },
        { slug: 'ai-for-customer-success', title: 'AI for customer success', time: 5, excerpt: 'How CS teams are using AI without losing the relationship quality that matters.' },
        { slug: 'claude-for-product-teams', title: 'Claude for product teams', time: 5, excerpt: 'Spec writing, user research synthesis, roadmap analysis — the product team use cases that hold up.' },
      ],
      path: { label: 'Browse all articles →', href: '/articles' },
    },
    where: {
      headline: 'The landscape, right now.',
      sub: 'Where things stand, who\'s building what, and what\'s moving fast.',
      articles: [
        { slug: 'ai-agent-field-note', title: 'AI agents in the field', time: 6, excerpt: 'What it actually looks like when agents run in production. The real picture.' },
        { slug: 'mcp-role', title: 'What is MCP and why does it matter?', time: 5, excerpt: 'Anthropic\'s open protocol for tool use — and what it changes about how AI connects to everything.' },
        { slug: 'extended-thinking-role', title: 'Extended thinking', time: 5, excerpt: 'Claude reasoning step by step before answering — and when that actually matters.' },
      ],
      path: { label: 'See the AI timeline →', href: '/timeline' },
    },
  },
}

// ── Component ─────────────────────────────────────────────────────────────────

type AnimDir = 'forward' | 'back' | 'none'

export default function GuidedStart({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'q1' | 'q2' | 'result'>('q1')
  const [q1, setQ1] = useState<Q1 | null>(null)
  const [q2, setQ2] = useState<string | null>(null)
  const [animDir, setAnimDir] = useState<AnimDir>('none')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Mount with a tiny delay so the animation triggers
    const t = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  const close = useCallback(() => {
    setVisible(false)
    setTimeout(onClose, 250)
  }, [onClose])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [close])

  function animate(dir: AnimDir, fn: () => void) {
    setAnimDir(dir)
    setTimeout(() => {
      fn()
      setAnimDir('none')
    }, 180)
  }

  function pickQ1(id: Q1) {
    animate('forward', () => { setQ1(id); setStep('q2') })
  }

  function pickQ2(id: string) {
    animate('forward', () => { setQ2(id); setStep('result') })
  }

  function goBack() {
    if (step === 'q2') animate('back', () => { setStep('q1'); setQ1(null) })
    if (step === 'result') animate('back', () => { setStep('q2'); setQ2(null) })
  }

  const result = q1 && q2 ? RESULTS[q1][q2] : null
  const q2Options = q1 ? Q2_OPTIONS[q1] : []
  const activePersona = q1 ? PERSONAS.find(p => p.id === q1) : null
  const progress = step === 'q1' ? 0 : step === 'q2' ? 50 : 100

  const slideStyle: React.CSSProperties = {
    opacity: animDir === 'none' ? 1 : 0,
    transform: animDir === 'forward' ? 'translateX(-18px)' : animDir === 'back' ? 'translateX(18px)' : 'translateX(0)',
    transition: 'opacity 0.18s ease, transform 0.18s ease',
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        style={{
          position: 'fixed', inset: 0, zIndex: 998,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(3px)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: `translate(-50%, ${visible ? '-50%' : '-46%'})`,
          zIndex: 999,
          width: 'min(560px, calc(100vw - 32px))',
          maxHeight: 'calc(100vh - 64px)',
          overflowY: 'auto',
          background: 'var(--bg-base)',
          borderRadius: '16px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.06)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease',
        }}
      >
        {/* Progress bar */}
        <div style={{ height: '2px', background: 'var(--border-muted)', borderRadius: '2px 2px 0 0', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: activePersona?.accent ?? 'var(--accent)',
            transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease',
          }} />
        </div>

        {/* Content */}
        <div style={{ padding: '32px 36px 36px' }}>

          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
            <div>
              {step !== 'q1' && (
                <button
                  onClick={goBack}
                  style={{
                    fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: '0',
                    letterSpacing: '0.02em',
                  }}
                >
                  ← back
                </button>
              )}
              {step === 'q1' && (
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Find your path
                </span>
              )}
            </div>
            <button
              onClick={close}
              style={{
                fontFamily: 'var(--font-sans)', fontSize: '18px', color: 'var(--text-muted)',
                background: 'none', border: 'none', cursor: 'pointer',
                lineHeight: 1, padding: '0 0 0 16px',
              }}
            >
              ×
            </button>
          </div>

          {/* Animated content area */}
          <div style={slideStyle}>

            {/* ── Q1 ─────────────────────────────────────────────────── */}
            {step === 'q1' && (
              <>
                <h2 style={{
                  fontFamily: 'var(--font-serif)', fontSize: 'clamp(20px, 3.5vw, 26px)',
                  fontWeight: 600, color: 'var(--text-primary)',
                  lineHeight: 1.2, letterSpacing: '-0.015em',
                  marginBottom: '24px',
                }}>
                  What describes you right now?
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {PERSONAS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => pickQ1(p.id)}
                      style={{
                        background: 'none',
                        border: `1px solid var(--border-base)`,
                        borderRadius: '10px',
                        padding: '16px 20px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'border-color 0.12s ease, background 0.12s ease',
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget
                        el.style.borderColor = p.accent
                        el.style.background = p.accent + '08'
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget
                        el.style.borderColor = 'var(--border-base)'
                        el.style.background = 'none'
                      }}
                    >
                      <p style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px', lineHeight: 1.3 }}>
                        {p.headline}
                      </p>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                        {p.subtext}
                      </p>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* ── Q2 ─────────────────────────────────────────────────── */}
            {step === 'q2' && activePersona && (
              <>
                {/* Echo of Q1 answer */}
                <div style={{
                  padding: '10px 14px', borderRadius: '8px',
                  background: activePersona.accent + '12',
                  borderLeft: `2px solid ${activePersona.accent}`,
                  marginBottom: '24px',
                }}>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: '14px', color: activePersona.accent, margin: 0 }}>
                    {activePersona.headline}
                  </p>
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-serif)', fontSize: 'clamp(18px, 3vw, 22px)',
                  fontWeight: 600, color: 'var(--text-primary)',
                  lineHeight: 1.25, letterSpacing: '-0.015em',
                  marginBottom: '20px',
                }}>
                  {q1 === 'operator'  && "What's your biggest challenge right now?"}
                  {q1 === 'founder'   && 'Where are you in the build?'}
                  {q1 === 'developer' && 'What are you working on?'}
                  {q1 === 'curious'   && 'What do you want to understand?'}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {q2Options.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => pickQ2(opt.id)}
                      style={{
                        background: 'none', border: `1px solid var(--border-base)`,
                        borderRadius: '10px', padding: '14px 18px',
                        cursor: 'pointer', textAlign: 'left',
                        transition: 'border-color 0.12s ease, background 0.12s ease',
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget
                        el.style.borderColor = activePersona.accent
                        el.style.background = activePersona.accent + '08'
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget
                        el.style.borderColor = 'var(--border-base)'
                        el.style.background = 'none'
                      }}
                    >
                      <p style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 3px', lineHeight: 1.3 }}>
                        {opt.label}
                      </p>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                        {opt.sub}
                      </p>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* ── Result ──────────────────────────────────────────────── */}
            {step === 'result' && result && activePersona && (
              <>
                {/* Result headline */}
                <div style={{ marginBottom: '28px' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '4px 10px', borderRadius: '4px', marginBottom: '14px',
                    background: activePersona.accent + '15',
                    fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
                    color: activePersona.accent, letterSpacing: '0.05em', textTransform: 'uppercase',
                  }}>
                    Your reading list
                  </div>
                  <h2 style={{
                    fontFamily: 'var(--font-serif)', fontSize: 'clamp(18px, 3vw, 22px)',
                    fontWeight: 600, color: 'var(--text-primary)',
                    lineHeight: 1.2, letterSpacing: '-0.015em', margin: '0 0 8px',
                  }}>
                    {result.headline}
                  </h2>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.55 }}>
                    {result.sub}
                  </p>
                </div>

                {/* Articles */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '24px' }}>
                  {result.articles.map((a, i) => (
                    <Link
                      key={a.slug}
                      href={`/articles/${a.slug}`}
                      onClick={close}
                      style={{ textDecoration: 'none', display: 'block' }}
                    >
                      <div style={{
                        padding: '14px 16px', borderRadius: '8px',
                        border: `1px solid ${i === 0 ? activePersona.accent + '40' : 'var(--border-base)'}`,
                        background: i === 0 ? activePersona.accent + '06' : 'var(--bg-surface)',
                        display: 'flex', gap: '12px', alignItems: 'flex-start',
                        transition: 'border-color 0.12s ease',
                      }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: '11px',
                          color: i === 0 ? activePersona.accent : 'var(--text-muted)',
                          fontWeight: 600, flexShrink: 0, paddingTop: '2px',
                        }}>
                          0{i + 1}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            fontFamily: 'var(--font-serif)', fontSize: '14px', fontWeight: 600,
                            color: 'var(--text-primary)', margin: '0 0 3px', lineHeight: 1.3,
                          }}>
                            {a.title}
                          </p>
                          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                            {a.excerpt}
                          </p>
                        </div>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-muted)', flexShrink: 0, paddingTop: '2px' }}>
                          {a.time}m
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Primary CTA + secondary path link */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link
                    href={result.primaryCta ? result.primaryCta.href : `/articles/${result.articles[0].slug}`}
                    onClick={close}
                    style={{
                      display: 'block', textAlign: 'center',
                      padding: '12px 20px', borderRadius: '8px',
                      background: activePersona.accent, color: '#fff',
                      fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'opacity 0.12s ease',
                    }}
                  >
                    {result.primaryCta ? result.primaryCta.label : 'Start with the first article →'}
                  </Link>
                  <Link
                    href={result.path.href}
                    onClick={close}
                    style={{
                      display: 'block', textAlign: 'center',
                      padding: '10px 20px', borderRadius: '8px',
                      border: '1px solid var(--border-base)',
                      fontFamily: 'var(--font-sans)', fontSize: '13px',
                      color: 'var(--text-muted)', textDecoration: 'none',
                    }}
                  >
                    {result.path.label}
                  </Link>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  )
}
