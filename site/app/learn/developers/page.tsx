import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Building with the Claude API — AI Codex',
  description: 'Implementation guides for developers: API basics, RAG pipelines, evals, streaming, and tool use. Assumes you can code.',
}

const STEPS = [
  {
    number: 1,
    concept: 'API',
    conceptSlug: 'api',
    articleSlug: 'your-first-claude-api-call',
    label: 'GET /messages',
    takeaway: 'Auth, the messages array, streaming, token limits, structured output, and the errors you will hit in week one. Everything else you can look up later.',
    time: '7 min',
    tag: 'Foundation',
  },
  {
    number: 2,
    concept: 'System Prompt',
    conceptSlug: 'system-prompt',
    articleSlug: 'system-prompt-failure',
    label: 'SYSTEM_PROMPT=your_product',
    takeaway: 'The system prompt is the highest-leverage thing you control. What breaks when you get it wrong, and the patterns that hold up in production.',
    time: '5 min',
    tag: 'Foundation',
  },
  {
    number: 3,
    concept: 'Streaming',
    conceptSlug: 'streaming',
    articleSlug: 'streaming-claude-responses-implementation',
    label: 'stream=True',
    takeaway: 'When to stream, SSE to the browser, error handling mid-stream, and the UX patterns that stop your interface from feeling broken.',
    time: '6 min',
    tag: 'Implementation',
  },
  {
    number: 4,
    concept: 'RAG',
    conceptSlug: 'rag',
    articleSlug: 'building-a-rag-pipeline-from-scratch',
    label: 'retrieve → augment → generate',
    takeaway: 'Chunking strategy, embedding choice, hybrid retrieval, reranking, and how to measure whether the pipeline is actually working.',
    time: '9 min',
    tag: 'Implementation',
  },
  {
    number: 5,
    concept: 'Tool Use',
    conceptSlug: 'tool-use',
    articleSlug: 'tool-use-process',
    label: 'tools=[...]',
    takeaway: 'How Claude calls functions you define. The tool definition format, parsing tool-use responses, handling multi-step tool calls, and the failure modes.',
    time: '6 min',
    tag: 'Implementation',
  },
  {
    number: 6,
    concept: 'Evals',
    conceptSlug: 'evals',
    articleSlug: 'writing-evals-that-catch-regressions',
    label: 'assert pass_rate >= 0.9',
    takeaway: 'Test case structure, deterministic vs. LLM-as-judge assertions, running evals in CI, and the number to track over time.',
    time: '7 min',
    tag: 'Quality',
  },
  {
    number: 7,
    concept: 'Prompt Caching',
    conceptSlug: 'prompt-caching',
    articleSlug: 'prompt-caching-implementation',
    label: 'cache_control: ephemeral',
    takeaway: 'One parameter change that cuts cost 80%+ on workloads with repeated context. Multi-block caching, conversation history caching, verifying hits in usage data, and the gotchas that eat your savings.',
    time: '6 min',
    tag: 'Optimization',
  },
  {
    number: 8,
    concept: 'Cost Optimization',
    conceptSlug: 'total-cost-of-ownership',
    articleSlug: 'claude-cost-optimization',
    label: 'token_budget.optimize()',
    takeaway: 'Measurement first. Then: model routing by task complexity, batch API for async workloads, output length control, and context window management. Most apps find 40-60% savings in the first audit.',
    time: '7 min',
    tag: 'Optimization',
  },
  {
    number: 9,
    concept: 'Tool Use',
    conceptSlug: 'tool-use',
    articleSlug: 'tool-use-implementation-deep-dive',
    label: 'tools=[{name, schema}]',
    takeaway: 'Defining tools that Claude calls correctly, handling multi-turn and parallel tool calls, returning errors cleanly, and the failure modes that will bite you in production.',
    time: '8 min',
    tag: 'Advanced',
  },
  {
    number: 10,
    concept: 'Multi-agent System',
    conceptSlug: 'multi-agent-system',
    articleSlug: 'multi-agent-orchestration-basics',
    label: 'orchestrate(subtasks)',
    takeaway: 'Orchestrator + subagent patterns, parallelism with ThreadPoolExecutor, state management across agents, checkpoints, and the patterns that look good until production.',
    time: '8 min',
    tag: 'Advanced',
  },
  {
    number: 11,
    concept: 'Persistent Memory',
    conceptSlug: 'context-window',
    articleSlug: 'chatbot-with-persistent-memory',
    label: 'memory.persist(session)',
    takeaway: 'User facts, session summaries, entity notes. How to extract, store, and inject memory without token bloat — and the difference between what is worth remembering and what is not.',
    time: '8 min',
    tag: 'Advanced',
  },
  {
    number: 12,
    concept: 'Production Deployment',
    conceptSlug: 'api',
    articleSlug: 'deploying-claude-app-production',
    label: 'git push → production',
    takeaway: 'Secrets management, rate limit handling, cost controls, observability, and the pre-launch checklist. What separates a localhost demo from a production app.',
    time: '7 min',
    tag: 'Implementation',
  },
  {
    number: 13,
    concept: 'Error Handling',
    conceptSlug: 'hallucination',
    articleSlug: 'claude-production-error-handling',
    label: 'try { } catch (err) { }',
    takeaway: 'API error taxonomy, output format resilience, hallucination detection, context overflow guards, and user-facing error patterns. The full error surface of a Claude app.',
    time: '6 min',
    tag: 'Implementation',
  },
  {
    number: 14,
    concept: 'Authentication',
    conceptSlug: 'api',
    articleSlug: 'nextauth-claude-integration',
    label: 'getServerSession()',
    takeaway: 'NextAuth setup, protecting API routes with middleware, passing user identity into Claude calls, and the session provider pattern for App Router.',
    time: '9 min',
    tag: 'Implementation',
  },
  {
    number: 15,
    concept: 'Conversation Persistence',
    conceptSlug: 'context-window',
    articleSlug: 'supabase-conversation-history',
    label: 'db.messages.insert(turn)',
    takeaway: 'Schema design, loading history server-side, pruning context intelligently, and the URL-based conversation pattern that makes chats resumable and debuggable.',
    time: '8 min',
    tag: 'Implementation',
  },
  {
    number: 16,
    concept: 'Rate Limiting',
    conceptSlug: 'api',
    articleSlug: 'rate-limiting-claude-api',
    label: 'perUser.limit(20).per(hour)',
    takeaway: 'Token budgeting, per-user application-layer rate limiting, request queuing for burst scenarios, and graceful degradation patterns.',
    time: '8 min',
    tag: 'Implementation',
  },
  {
    number: 17,
    concept: 'Full-Stack Chatbot',
    conceptSlug: 'api',
    articleSlug: 'nextjs-chatbot-claude-full-tutorial',
    label: '// build this tonight',
    takeaway: 'Everything in this path combined: Next.js App Router, Claude API with streaming, NextAuth authentication, Supabase message persistence, and deployment to Vercel. Zero to shipped.',
    time: '14 min',
    tag: 'Capstone',
  },
]

const ACCENT = '#7B8FD4'
const ACCENT_BG = 'rgba(123,143,212,0.1)'

const TAG_COLORS: Record<string, { color: string; bg: string }> = {
  Foundation:     { color: '#D4845A', bg: 'rgba(212,132,90,0.12)' },
  Implementation: { color: '#5AAFD4', bg: 'rgba(90,175,212,0.12)' },
  Quality:        { color: '#4CAF7D', bg: 'rgba(76,175,125,0.12)' },
  Optimization:   { color: '#7B8FD4', bg: 'rgba(123,143,212,0.12)' },
  Advanced:       { color: '#D45A7B', bg: 'rgba(212,90,123,0.12)' },
  Capstone:       { color: '#D4B45A', bg: 'rgba(212,180,90,0.15)' },
}

export default function LearnDevelopersPage() {
  const totalTime = STEPS.reduce((sum, s) => sum + parseInt(s.time), 0)

  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)' }}>
        <Link href="/learn" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Learn</Link>
        <span>›</span>
        <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>Building with the Claude API</span>
      </nav>

      {/* Header */}
      <div style={{ marginBottom: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <span style={{
            padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600,
            fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
            background: ACCENT_BG, color: ACCENT,
          }}>
            for developers
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
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(22px, 3vw, 30px)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            marginBottom: '16px',
          }}
        >
          Building with the Claude API
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)',
          color: 'var(--text-muted)', maxWidth: '56ch', lineHeight: 1.65,
          marginBottom: '20px',
        }}>
          Implementation guides for developers. Assumes you can code — not going to explain
          what an API is. Focused on the decisions that affect production quality,
          not getting something running in five minutes.
        </p>

        {/* Tag legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
          {Object.entries(TAG_COLORS).map(([tag, style]) => (
            <span key={tag} style={{
              padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 500,
              fontFamily: 'var(--font-sans)', color: style.color, background: style.bg,
            }}>
              {tag}
            </span>
          ))}
        </div>
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
          {STEPS.map((step, i) => {
            const tagStyle = TAG_COLORS[step.tag] ?? { color: ACCENT, bg: ACCENT_BG }
            const href = step.articleSlug
              ? `/articles/${step.articleSlug}`
              : `/glossary/${step.conceptSlug}`

            return (
              <div key={step.number} style={{ paddingLeft: '52px', paddingBottom: i === STEPS.length - 1 ? '0' : '4px' }}>
                <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
                  <div
                    style={{
                      position: 'relative',
                      padding: '20px 24px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-base)',
                      background: 'var(--bg-surface)',
                      borderLeft: `3px solid ${tagStyle.color}40`,
                      transition: 'border-left-color 150ms ease, background 150ms ease',
                    }}
                    className="dev-step-card"
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
                      border: `1px solid var(--border-base)`,
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
                        {/* Row: tag + mono label */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' as const }}>
                          <span style={{
                            padding: '1px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: 500,
                            fontFamily: 'var(--font-sans)', color: tagStyle.color, background: tagStyle.bg,
                          }}>
                            {step.tag}
                          </span>
                          <code style={{
                            fontFamily: 'var(--font-mono)', fontSize: '12px',
                            color: 'var(--text-secondary)', background: 'var(--bg-subtle)',
                            padding: '1px 6px', borderRadius: '3px',
                            border: '1px solid var(--border-muted)',
                          }}>
                            {step.label}
                          </code>
                        </div>

                        <p style={{
                          fontFamily: 'var(--font-serif)', fontSize: 'var(--text-lg)',
                          fontWeight: 600, color: 'var(--text-primary)',
                          lineHeight: 1.25, marginBottom: '6px',
                        }}>
                          {step.concept}
                        </p>
                        <p style={{
                          fontFamily: 'var(--font-sans)', fontSize: '14px',
                          color: 'var(--text-muted)', lineHeight: 1.55, margin: 0,
                        }}>
                          {step.takeaway}
                        </p>
                      </div>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '11px',
                        color: 'var(--text-muted)', flexShrink: 0, paddingTop: '2px',
                      }}>
                        {step.time}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {/* Anthropic Academy callout */}
      <div style={{
        marginTop: '48px',
        padding: '20px 24px',
        borderRadius: '10px',
        border: '1px solid var(--border-base)',
        background: 'var(--bg-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        flexWrap: 'wrap' as const,
      }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', marginBottom: '4px' }}>
            Official course from Anthropic
          </p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            Anthropic's official <strong>Building with the Claude API</strong> course (84 video lectures, free) covers the API in depth. Use it alongside this path — they teach the product, we focus on the production decisions.
          </p>
        </div>
        <a
          href="https://anthropic.skilljar.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            whiteSpace: 'nowrap' as const,
            flexShrink: 0,
          }}
        >
          Anthropic Academy ↗
        </a>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '24px',
        padding: '28px 32px',
        borderRadius: '8px',
        border: '1px solid var(--border-base)',
        background: 'var(--bg-surface)',
        borderLeft: `3px solid ${ACCENT}`,
      }}>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600,
          letterSpacing: '0.04em', color: ACCENT, marginBottom: '10px',
        }}>
          $ what_next
        </p>
        <p style={{
          fontFamily: 'var(--font-serif)', fontSize: 'var(--text-lg)',
          fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px',
        }}>
          More implementation depth
        </p>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: '14px',
          color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.6,
        }}>
          The glossary has technical definitions for every term in this path.
          Infrastructure & Deployment and Evaluation & Safety clusters are most relevant.
        </p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' as const }}>
          <Link href="/glossary?cluster=Infrastructure%20%26%20Deployment"
            style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: ACCENT, textDecoration: 'none', fontWeight: 500 }}>
            Infrastructure & Deployment →
          </Link>
          <Link href="/glossary?cluster=Evaluation%20%26%20Safety"
            style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'none' }}>
            Evaluation & Safety →
          </Link>
          <Link href="/glossary?cluster=Retrieval%20%26%20Knowledge"
            style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'none' }}>
            Retrieval & Knowledge →
          </Link>
        </div>
      </div>

      <style>{`
        .dev-step-card:hover {
          border-left-color: rgba(123,143,212,0.6) !important;
          background: var(--bg-subtle) !important;
        }
      `}</style>
    </div>
  )
}
