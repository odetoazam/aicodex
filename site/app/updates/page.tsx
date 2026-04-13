import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Updates — AI Codex',
  description: 'Claude updates explained in plain English — what changed, who it affects, and what to do about it. We read the release notes so you don\'t have to.',
}

type Update = {
  date: string
  tag: 'New' | 'Content' | 'Feature' | 'Fix'
  title: string
  description: string
  links?: { label: string; href: string }[]
}

const UPDATES: Update[] = [
  {
    date: 'April 2026',
    tag: 'Content',
    title: 'Production deployment guides (batch 22)',
    description: 'Four articles completing the developer production path: deploying to production (secrets, rate limits, cost controls, observability checklist), production error handling (API error taxonomy, output format resilience, hallucination detection, user-facing errors), end-to-end Next.js + Claude chatbot (streaming SSE, Vercel deploy, conversation history), and what to actually build with Claude as a first product (the 2x2, structural advantages, the test before you build).',
    links: [
      { label: 'Deploying to production →', href: '/articles/deploying-claude-app-production' },
      { label: 'Error handling →', href: '/articles/claude-production-error-handling' },
      { label: 'Next.js chatbot tutorial →', href: '/articles/nextjs-chatbot-claude-full-tutorial' },
    ],
  },
  {
    date: 'April 2026',
    tag: 'Content',
    title: 'Cost & memory developer guides (batch 21)',
    description: 'Four new articles: prompt caching implementation (cache_control, multi-block caching, verifying hits, 80% cost reduction patterns), cutting Claude API costs (model routing, batch API, output length control, context management), building a chatbot with persistent memory (user facts, session summaries, extraction patterns), and using Claude for note-taking and knowledge management (Projects, capture workflows, retrieval patterns).',
    links: [
      { label: 'Prompt caching →', href: '/articles/prompt-caching-implementation' },
      { label: 'Cost optimization →', href: '/articles/claude-cost-optimization' },
      { label: 'Persistent memory chatbot →', href: '/articles/chatbot-with-persistent-memory' },
    ],
  },
  {
    date: 'April 2026',
    tag: 'Content',
    title: 'Advanced developer guides (batch 20)',
    description: 'Four articles completing the developer and founder content: tool use implementation deep dive (defining tools, parsing responses, parallel tool calls, production failure modes), multi-agent orchestration basics (orchestrator + subagents, parallelism, state management, checkpoints), customer discovery with Claude (interview simulation, assumption mapping, synthesis), and meeting prep patterns.',
    links: [
      { label: 'Tool use deep dive →', href: '/articles/tool-use-implementation-deep-dive' },
      { label: 'Multi-agent orchestration →', href: '/articles/multi-agent-orchestration-basics' },
      { label: 'Customer discovery →', href: '/articles/customer-discovery-with-claude' },
    ],
  },
  {
    date: 'April 2026',
    tag: 'New',
    title: 'Developer learning path — Building with the Claude API',
    description: 'An 8-step implementation path for developers: API basics, streaming, RAG pipelines, tool use, evals in CI, prompt caching, and agentic loops. Assumes you can code — no business-case framing. Visually distinct from the operator paths.',
    links: [
      { label: 'Building with the Claude API →', href: '/learn/developers' },
    ],
  },
  {
    date: 'April 2026',
    tag: 'Content',
    title: 'Developer implementation guides (batch 19)',
    description: 'Four technical articles: your first Claude API call (auth, streaming, structured output, errors), building a RAG pipeline from scratch (chunking strategy, hybrid retrieval, reranking, evals), writing evals that catch regressions (test case structure, LLM-as-judge, CI integration), and streaming implementation patterns (SSE to browser, error handling, UX).',
    links: [
      { label: 'First API call →', href: '/articles/your-first-claude-api-call' },
      { label: 'RAG pipeline →', href: '/articles/building-a-rag-pipeline-from-scratch' },
      { label: 'Evals in CI →', href: '/articles/writing-evals-that-catch-regressions' },
    ],
  },
  {
    date: 'April 2026',
    tag: 'New',
    title: 'Building with AI learning path',
    description: 'A 7-step path for solo founders and early-stage builders: validate your idea, choose the right stack, avoid the failure modes, price your product, get your first ten customers, and pitch to investors. No ML background required.',
    links: [
      { label: 'Building your first AI product →', href: '/learn/build-with-ai' },
    ],
  },
  {
    date: 'April 2026',
    tag: 'Content',
    title: 'Solo founder content (batches 16–17)',
    description: 'Seven new articles targeting the zero-person startup: the solo founder operating system, idea validation without fooling yourself, build/buy/prompt stack decisions, AI product failure modes, investor pitch narrative, pricing your AI product, and getting your first ten customers.',
    links: [
      { label: 'Solo founder OS →', href: '/articles/solo-founder-operating-system' },
      { label: 'Validating your idea →', href: '/articles/validating-startup-idea-with-claude' },
      { label: 'Pitching to investors →', href: '/articles/pitching-ai-product-to-investors' },
    ],
  },
  {
    date: 'April 2026',
    tag: 'Content',
    title: 'Connectors best practices + everyday AI productivity (batch 18)',
    description: 'Four new articles: how to give Claude precise connector instructions (the difference between "find that doc" and an instruction that reliably works), managing email with Claude, the 20-minute weekly review, and using Claude to declutter your digital life.',
    links: [
      { label: 'Precise connector instructions →', href: '/articles/how-to-write-precise-connector-instructions' },
      { label: 'Managing email →', href: '/articles/managing-email-with-claude' },
      { label: 'Weekly review →', href: '/articles/weekly-review-with-claude' },
    ],
  },
  {
    date: 'April 2026',
    tag: 'New',
    title: 'Admin learning path',
    description: 'A 10-step path for IT leads and administrators: from evaluating Claude to running it across an organisation. Three stages — evaluation, deployment, ongoing management — each with dedicated articles.',
    links: [
      { label: 'Setting up Claude for your company →', href: '/learn/claude-for-admins' },
    ],
  },
  {
    date: 'April 2026',
    tag: 'New',
    title: 'Claude feature map',
    description: '20 Claude features grouped by capability area — core interface, skills & connections, automation & agents, research & intelligence, admin & scale. Each with a definition and a guide.',
    links: [
      { label: 'Claude feature map →', href: '/glossary/claude-features' },
    ],
  },
  {
    date: 'April 2026',
    tag: 'Content',
    title: '25+ new articles — admin, role-type, and practical guides',
    description: 'A full batch of operator-focused articles covering: admin setup, plan selection, org-wide Projects architecture, usage policy, system prompt writing, role-type field notes (finance, product, legal, data, engineering, executives), change management, token control, security, and more.',
    links: [
      { label: 'Browse all articles →', href: '/articles' },
    ],
  },
  {
    date: 'April 2026',
    tag: 'Content',
    title: 'Role-type field notes: CS, HR, Finance, Product, Legal, Data',
    description: 'Practical, role-specific articles covering what AI actually looks like for each function — what works, what doesn\'t, and how to set up Claude for that team.',
    links: [
      { label: 'CS: QBR and renewal prep →', href: '/articles/cs-qbr-and-renewal-prep-with-claude' },
      { label: 'Finance teams →', href: '/articles/claude-for-finance-teams' },
      { label: 'Product teams →', href: '/articles/claude-for-product-teams' },
      { label: 'Legal teams →', href: '/articles/claude-for-legal-teams' },
    ],
  },
  {
    date: 'March 2026',
    tag: 'New',
    title: 'Learning paths for founders and department heads',
    description: 'Two structured paths: "Figuring out AI for your company" for founders and ops leaders, and "Getting your team actually using AI" for department heads. Each walks through the key decisions in order.',
    links: [
      { label: 'All learning paths →', href: '/learn' },
    ],
  },
  {
    date: 'March 2026',
    tag: 'Content',
    title: 'Claude ecosystem terms',
    description: 'Glossary terms for all major Claude features: Projects, Skills, Connectors, Artifacts, Memory, Cowork, Dispatch, Deep Research, Computer Use, Managed Agents, Claude Plans, Claude Code, MCP, and more.',
    links: [
      { label: 'Browse the glossary →', href: '/glossary' },
    ],
  },
  {
    date: 'March 2026',
    tag: 'Feature',
    title: 'Site launched',
    description: 'AI Codex launched with a glossary, articles, and the first learning path. Built for operators and admins implementing Claude at work — plain-English explanations, practical guides, no hype.',
    links: [
      { label: 'About →', href: '/about' },
    ],
  },
]

const TAG_STYLES: Record<Update['tag'], { bg: string; color: string }> = {
  New: { bg: 'rgba(91,141,217,0.1)', color: '#5B8DD9' },
  Content: { bg: 'rgba(76,175,125,0.1)', color: '#4CAF7D' },
  Feature: { bg: 'rgba(212,132,90,0.1)', color: '#D4845A' },
  Fix: { bg: 'rgba(123,143,212,0.1)', color: '#7B8FD4' },
}

export default function UpdatesPage() {
  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>

      {/* Header */}
      <div style={{ marginBottom: '56px' }}>
        <p className="eyebrow" style={{ marginBottom: '16px' }}>Updates</p>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          marginBottom: '16px',
          maxWidth: '28ch',
        }}>
          What changed and why it matters to you
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-base)',
          color: 'var(--text-muted)',
          maxWidth: '56ch',
          lineHeight: 1.65,
        }}>
          Claude ships updates constantly. We read the release notes, changelogs, and announcements so you don&apos;t have to — then explain what actually changed and how it affects your work, in plain English.
        </p>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute',
          left: '19px',
          top: '12px',
          bottom: '12px',
          width: '1px',
          background: 'var(--border-base)',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {UPDATES.map((update, i) => {
            const tagStyle = TAG_STYLES[update.tag]
            return (
              <div
                key={i}
                style={{
                  paddingLeft: '52px',
                  paddingBottom: i === UPDATES.length - 1 ? '0' : '4px',
                }}
              >
                <div style={{
                  position: 'relative',
                  padding: '20px 24px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-base)',
                  background: 'var(--bg-surface)',
                }}>
                  {/* Dot */}
                  <div style={{
                    position: 'absolute',
                    left: '-33px',
                    top: '22px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: tagStyle.color,
                    border: '2px solid var(--bg-base)',
                    flexShrink: 0,
                  }} />

                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 500,
                        fontFamily: 'var(--font-sans)',
                        background: tagStyle.bg,
                        color: tagStyle.color,
                      }}>
                        {update.tag}
                      </span>
                      <p style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'var(--text-base)',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        margin: 0,
                        lineHeight: 1.3,
                      }}>
                        {update.title}
                      </p>
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      flexShrink: 0,
                      paddingTop: '2px',
                    }}>
                      {update.date}
                    </span>
                  </div>

                  <p style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '14px',
                    color: 'var(--text-muted)',
                    lineHeight: 1.6,
                    margin: '0 0 12px',
                  }}>
                    {update.description}
                  </p>

                  {update.links && update.links.length > 0 && (
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' as const }}>
                      {update.links.map(link => (
                        <Link
                          key={link.href}
                          href={link.href}
                          style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: '13px',
                            color: 'var(--accent)',
                            textDecoration: 'none',
                            fontWeight: 500,
                          }}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div style={{
        marginTop: '64px',
        padding: '32px',
        borderRadius: '12px',
        border: '1px solid var(--border-base)',
        background: 'var(--bg-surface)',
        borderLeft: '3px solid var(--accent)',
      }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--accent)', marginBottom: '10px' }}>
          Skip the changelog
        </p>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
          We read the release notes so you don&apos;t have to
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.6 }}>
          When Anthropic ships something new, we break down what it is, who it affects, and what you should actually do about it. No jargon, no hype.
        </p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' as const }}>
          <Link
            href="/articles"
            style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}
          >
            Browse articles →
          </Link>
          <Link
            href="/glossary"
            style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'none' }}
          >
            Glossary →
          </Link>
        </div>
      </div>
    </div>
  )
}
