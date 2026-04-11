'use client'

import { useState } from 'react'
import Link from 'next/link'

// ── Questions ─────────────────────────────────────────────────

interface Question {
  id: string
  category: string
  text: string
  hint: string
  articleSlug?: string
  articleLabel?: string
}

const QUESTIONS: Question[] = [
  {
    id: 'q1',
    category: 'Foundation',
    text: 'Have you moved beyond the Claude.ai interface to using the API directly?',
    hint: 'The API unlocks programmatic access, custom system prompts, and production deployments.',
    articleSlug: 'your-first-claude-api-call',
    articleLabel: 'Your first API call',
  },
  {
    id: 'q2',
    category: 'Foundation',
    text: 'Do you have a written system prompt in version control?',
    hint: 'Treating your system prompt like code — with commits and review — is a hallmark of a mature implementation.',
    articleSlug: 'writing-system-prompts-that-work',
    articleLabel: 'Writing system prompts that work',
  },
  {
    id: 'q3',
    category: 'Reliability',
    text: 'Do you have evals running to catch regressions when you change your prompts?',
    hint: 'Evals are the AI equivalent of unit tests. Without them, you find out about regressions from users.',
    articleSlug: 'writing-evals-that-catch-regressions',
    articleLabel: 'Writing evals that catch regressions',
  },
  {
    id: 'q4',
    category: 'Reliability',
    text: 'Do you have structured error handling for API failures and model refusals?',
    hint: 'Production apps need fallbacks, retry logic, and user-facing error messages that make sense.',
    articleSlug: 'claude-production-error-handling',
    articleLabel: 'Production error handling',
  },
  {
    id: 'q5',
    category: 'Cost & Performance',
    text: 'Are you actively monitoring your token usage and API costs?',
    hint: 'Cost surprises are common. Logging tokens per request from the start makes optimization possible later.',
    articleSlug: 'claude-cost-optimization',
    articleLabel: 'Cost optimization guide',
  },
  {
    id: 'q6',
    category: 'Cost & Performance',
    text: 'Are you using prompt caching for repeated context (system prompts, documents)?',
    hint: 'Prompt caching can cut costs by 60–90% on context that repeats across messages.',
    articleSlug: 'prompt-caching-implementation',
    articleLabel: 'Prompt caching implementation',
  },
  {
    id: 'q7',
    category: 'Security & Trust',
    text: 'Do you have a data handling policy for what goes into Claude\'s context window?',
    hint: 'Personal data, confidential documents, and PII all raise compliance questions. Know what you\'re sending.',
    articleSlug: 'claude-admin-security-privacy',
    articleLabel: 'Security & privacy guide',
  },
  {
    id: 'q8',
    category: 'Security & Trust',
    text: 'Do you have rate limiting in place on your Claude API endpoints?',
    hint: 'Without rate limits, a single aggressive user or bot can exhaust your API budget.',
    articleSlug: 'rate-limiting-claude-api',
    articleLabel: 'Rate limiting guide',
  },
  {
    id: 'q9',
    category: 'Scale & Architecture',
    text: 'Do you store conversation history in a database (not just in memory)?',
    hint: 'In-memory chat state disappears on refresh. Persistent history enables context-aware conversations.',
    articleSlug: 'supabase-conversation-history',
    articleLabel: 'Conversation persistence guide',
  },
  {
    id: 'q10',
    category: 'Scale & Architecture',
    text: 'Have you designed for the case where Claude\'s output is wrong or harmful?',
    hint: 'Human review checkpoints, confidence thresholds, and graceful degradation paths — not just happy path.',
    articleSlug: 'ai-product-failure-modes-founders',
    articleLabel: 'AI failure modes guide',
  },
]

// ── Level definitions ─────────────────────────────────────────

const LEVELS = [
  {
    score: [0, 2],
    level: 1,
    label: 'Exploring',
    color: '#5B8DD9',
    description: 'You\'re in the early stages — experimenting with Claude but not yet running it in production. That\'s fine. Most people start here.',
    nextStep: 'Get your first API call working with a real system prompt. Everything else builds from there.',
    priority: 'Start with the API basics and system prompt foundations.',
  },
  {
    score: [3, 4],
    level: 2,
    label: 'Building',
    color: '#7B8FD4',
    description: 'You\'ve got Claude working in an app but the foundations are still soft. You\'re one bad deploy or surprise bill away from a painful lesson.',
    nextStep: 'Add evals before you ship more features. One regression test suite is worth ten new prompts.',
    priority: 'Focus on reliability: evals, error handling, and cost monitoring.',
  },
  {
    score: [5, 6],
    level: 3,
    label: 'Shipping',
    color: '#D4845A',
    description: 'You\'re running Claude in production with real users. You have the basics in place. The gap now is operational maturity — what happens when things go wrong at scale.',
    nextStep: 'Harden your security posture and build persistent conversation storage if you haven\'t.',
    priority: 'Security, rate limiting, and data handling policies.',
  },
  {
    score: [7, 8],
    level: 4,
    label: 'Operating',
    color: '#4CAF7D',
    description: 'Strong foundation. You\'re thinking about Claude the way you think about any production dependency — monitored, cost-managed, and hardened against failure.',
    nextStep: 'Explore advanced patterns: multi-agent orchestration, tool use, or RAG pipelines.',
    priority: 'Push into advanced architecture: tool use, RAG, multi-agent workflows.',
  },
  {
    score: [9, 10],
    level: 5,
    label: 'Mastering',
    color: '#4CAF7D',
    description: 'You\'ve built a genuinely mature Claude implementation. You\'re not just using the API — you\'re operating it like a production system with real discipline.',
    nextStep: 'You\'re ahead of 95% of teams. Consider sharing what you\'ve learned — or going deeper into custom model evaluation.',
    priority: 'You\'re at the frontier. Consider contributing to your team\'s internal AI playbook.',
  },
]

function getLevel(score: number) {
  return LEVELS.find(l => score >= l.score[0] && score <= l.score[1]) ?? LEVELS[0]
}

// ── Component ─────────────────────────────────────────────────

type Answer = 'yes' | 'no' | 'partial' | null

export default function ScorecardPage() {
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [showResult, setShowResult] = useState(false)

  const answered = Object.keys(answers).length
  const score = Object.values(answers).reduce((acc, a) => acc + (a === 'yes' ? 1 : a === 'partial' ? 0.5 : 0), 0)
  const level = getLevel(Math.round(score))
  const categories = Array.from(new Set(QUESTIONS.map(q => q.category)))

  const allAnswered = answered === QUESTIONS.length

  function setAnswer(id: string, value: Answer) {
    setAnswers(prev => ({ ...prev, [id]: value }))
  }

  const gaps = QUESTIONS.filter(q => answers[q.id] === 'no' || answers[q.id] === 'partial')

  if (showResult) {
    return (
      <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>
        <div style={{ maxWidth: '680px' }}>

          {/* Level badge */}
          <div style={{ marginBottom: '40px' }}>
            <p className="eyebrow" style={{ marginBottom: '16px' }}>Your result</p>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '12px',
              padding: '8px 20px 8px 8px',
              borderRadius: '40px',
              border: `1px solid ${level.color}40`,
              background: `${level.color}10`,
              marginBottom: '24px',
            }}>
              <span style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '36px', height: '36px', borderRadius: '50%',
                background: level.color, color: 'white',
                fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 700,
              }}>
                L{level.level}
              </span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: level.color, fontWeight: 600 }}>
                {level.label}
              </span>
            </div>

            {/* Score bar */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)' }}>
                  Implementation score
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>
                  {score.toFixed(1)} / 10
                </span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', background: 'var(--bg-subtle)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${(score / 10) * 100}%`,
                  borderRadius: '4px',
                  background: level.color,
                  transition: 'width 800ms ease',
                }} />
              </div>
              {/* Level markers */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                {LEVELS.map(l => (
                  <span key={l.level} style={{
                    fontFamily: 'var(--font-sans)', fontSize: '11px',
                    color: l.level === level.level ? level.color : 'var(--text-muted)',
                    fontWeight: l.level === level.level ? 600 : 400,
                  }}>
                    {l.label}
                  </span>
                ))}
              </div>
            </div>

            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '16px' }}>
              {level.description}
            </p>

            <div style={{
              padding: '16px 20px',
              borderRadius: '8px',
              border: `1px solid ${level.color}30`,
              background: `${level.color}08`,
            }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: level.color, marginBottom: '6px' }}>
                Next step
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                {level.nextStep}
              </p>
            </div>
          </div>

          {/* Gaps */}
          {gaps.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '20px' }}>
                Your gaps
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {gaps.map(q => (
                  <div key={q.id} style={{
                    padding: '16px 20px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-base)',
                    background: 'var(--bg-surface)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '16px',
                  }}>
                    <div>
                      <span style={{
                        display: 'inline-block',
                        fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500,
                        color: answers[q.id] === 'partial' ? '#D4845A' : 'var(--text-muted)',
                        background: answers[q.id] === 'partial' ? 'rgba(212,132,90,0.1)' : 'var(--bg-subtle)',
                        padding: '2px 8px', borderRadius: '4px', marginBottom: '6px',
                      }}>
                        {answers[q.id] === 'partial' ? 'Partial' : 'Not done'} · {q.category}
                      </span>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                        {q.text}
                      </p>
                    </div>
                    {q.articleSlug && (
                      <Link
                        href={`/articles/${q.articleSlug}`}
                        style={{
                          flexShrink: 0,
                          fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500,
                          color: 'var(--accent)', textDecoration: 'none',
                          whiteSpace: 'nowrap',
                          padding: '6px 12px',
                          borderRadius: '5px',
                          border: '1px solid var(--accent)',
                          background: 'rgba(212,132,90,0.06)',
                        }}
                      >
                        Read guide →
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {gaps.length === 0 && (
            <div style={{ padding: '20px', borderRadius: '8px', background: 'rgba(76,175,125,0.08)', border: '1px solid rgba(76,175,125,0.3)', marginBottom: '40px' }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: '#4CAF7D', fontWeight: 600, margin: '0 0 4px' }}>
                No gaps found
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
                You&apos;ve checked every box. Seriously impressive — you&apos;re ahead of 95% of teams shipping AI products.
              </p>
            </div>
          )}

          <button
            onClick={() => { setShowResult(false); setAnswers({}) }}
            style={{
              fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)',
              background: 'none', border: '1px solid var(--border-base)',
              borderRadius: '6px', padding: '10px 20px', cursor: 'pointer',
            }}
          >
            ← Retake the scorecard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>
      <div style={{ maxWidth: '680px' }}>

        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <p className="eyebrow" style={{ marginBottom: '16px' }}>Tools</p>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: '16px',
            maxWidth: '26ch',
          }}>
            AI Implementation Maturity Scorecard
          </h1>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-base)',
            color: 'var(--text-muted)',
            maxWidth: '52ch',
            lineHeight: 1.65,
          }}>
            10 questions. Find out where you actually stand — and get a specific list of what to fix next.
          </p>

          {/* Progress */}
          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)' }}>
                {answered} of {QUESTIONS.length} answered
              </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)' }}>
                {Math.round((answered / QUESTIONS.length) * 100)}%
              </span>
            </div>
            <div style={{ height: '3px', borderRadius: '2px', background: 'var(--bg-subtle)' }}>
              <div style={{
                height: '100%',
                width: `${(answered / QUESTIONS.length) * 100}%`,
                borderRadius: '2px',
                background: 'var(--accent)',
                transition: 'width 300ms ease',
              }} />
            </div>
          </div>
        </div>

        {/* Questions by category */}
        {categories.map(cat => (
          <div key={cat} style={{ marginBottom: '40px' }}>
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              color: 'var(--text-muted)', marginBottom: '16px',
            }}>
              {cat}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {QUESTIONS.filter(q => q.category === cat).map(q => {
                const ans = answers[q.id]
                return (
                  <div
                    key={q.id}
                    style={{
                      padding: '20px',
                      borderRadius: '10px',
                      border: `1px solid ${ans ? 'var(--border-base)' : 'var(--border-muted)'}`,
                      background: ans ? 'var(--bg-surface)' : 'transparent',
                      transition: 'border-color 150ms ease, background 150ms ease',
                    }}
                  >
                    <p style={{
                      fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 500,
                      color: 'var(--text-primary)', lineHeight: 1.4,
                      margin: '0 0 6px',
                    }}>
                      {q.text}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)',
                      lineHeight: 1.5, margin: '0 0 16px',
                    }}>
                      {q.hint}
                    </p>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {(['yes', 'partial', 'no'] as const).map(opt => {
                        const labels = { yes: 'Yes', partial: 'Partially', no: 'Not yet' }
                        const colors = { yes: '#4CAF7D', partial: '#D4845A', no: '#5B8DD9' }
                        const active = ans === opt
                        return (
                          <button
                            key={opt}
                            onClick={() => setAnswer(q.id, opt)}
                            style={{
                              padding: '7px 16px',
                              borderRadius: '6px',
                              border: `1px solid ${active ? colors[opt] : 'var(--border-base)'}`,
                              background: active ? `${colors[opt]}15` : 'var(--bg-subtle)',
                              fontFamily: 'var(--font-sans)',
                              fontSize: '13px',
                              fontWeight: active ? 600 : 400,
                              color: active ? colors[opt] : 'var(--text-muted)',
                              cursor: 'pointer',
                              transition: 'all 150ms ease',
                            }}
                          >
                            {labels[opt]}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* CTA */}
        <button
          onClick={() => allAnswered && setShowResult(true)}
          disabled={!allAnswered}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '8px',
            background: allAnswered ? 'var(--accent)' : 'var(--bg-subtle)',
            border: 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: '15px',
            fontWeight: 600,
            color: allAnswered ? 'var(--text-inverse)' : 'var(--text-muted)',
            cursor: allAnswered ? 'pointer' : 'not-allowed',
            transition: 'background 150ms ease, color 150ms ease',
          }}
        >
          {allAnswered ? 'See my results →' : `Answer all ${QUESTIONS.length - answered} remaining questions to see results`}
        </button>
      </div>
    </div>
  )
}
