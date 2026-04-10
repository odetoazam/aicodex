import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — AI Codex',
  description: 'The knowledge graph for building with AI — what this is and why it exists.',
}

export default function AboutPage() {
  return (
    <div
      style={{
        width: 'var(--container)',
        margin: '0 auto',
        padding: 'clamp(64px, 10vw, 120px) 0 var(--section-y)',
        maxWidth: '720px',
      }}
    >
      <p className="eyebrow" style={{ marginBottom: '24px' }}>About</p>

      <h1
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'var(--text-3xl)',
          fontWeight: 400,
          color: 'var(--text-primary)',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          marginBottom: '48px',
        }}
      >
        Built by an operator,<br />
        <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>for operators.</em>
      </h1>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column' as const,
          gap: '24px',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-base)',
          color: 'var(--text-secondary)',
          lineHeight: 1.75,
        }}
      >
        <p>
          Most AI content falls into one of two buckets: research papers nobody reads, or hype posts that age poorly. Neither helps you make a real decision about whether to use RAG or a knowledge graph, what fine-tuning actually costs in practice, or why your AI pilot worked in the demo and failed in production.
        </p>

        <p>
          AI Codex is something different. It&rsquo;s a structured knowledge graph — not a blog, not a newsletter, not a flat glossary. Every term connects to the decisions it informs. Every article names the failure modes, not just the capabilities.
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-xl)',
            color: 'var(--text-primary)',
            marginTop: '16px',
            marginBottom: '0',
          }}
        >
          The operator context
        </h2>

        <p>
          I&rsquo;m VP of AI at Distru — a cannabis ERP company. I build AI systems in an industry where hallucinations have compliance consequences, data is messy, and &ldquo;let&rsquo;s just run a pilot&rdquo; has real stakes. Not a research lab. Not a consultancy. An actual operating company.
        </p>

        <p>
          That context matters. When I write about RAG, I&rsquo;m writing about a system I&rsquo;ve debugged at 2am because a retrieval failure surfaced wrong compliance data. When I write about AI strategy, I&rsquo;m writing about decisions made under budget pressure with skeptical stakeholders. The knowledge here is earned, not summarized.
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-xl)',
            color: 'var(--text-primary)',
            marginTop: '16px',
            marginBottom: '0',
          }}
        >
          Why a knowledge graph?
        </h2>

        <p>
          The moat in AI education isn&rsquo;t knowing what RAG is. It&rsquo;s knowing how RAG relates to knowledge graphs, when you should use one versus the other, how retrieval architecture affects agent behavior, and what that means for your specific use case. That&rsquo;s not a definition — that&rsquo;s a connected understanding.
        </p>

        <p>
          A blog can&rsquo;t give you that. A flat glossary can&rsquo;t either. A knowledge graph can — because every term links to the concepts it depends on and the decisions it informs.
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-xl)',
            color: 'var(--text-primary)',
            marginTop: '16px',
            marginBottom: '0',
          }}
        >
          Why Claude-first?
        </h2>

        <p>
          Claude is what I build with. Not because it&rsquo;s the only tool — it isn&rsquo;t — but because deep expertise in one tool beats shallow coverage of ten. Anthropic&rsquo;s approach to safety (Constitutional AI), their investment in long context and agent infrastructure (MCP, Claude Agent SDK), and how they think about responsible deployment — these things matter and they&rsquo;re underexplained.
        </p>

        <p>
          This isn&rsquo;t a Claude marketing site. It&rsquo;s an honest account of what Claude is good at, where it falls short, and how to get the most out of it in production systems.
        </p>

        <hr className="divider" style={{ margin: '16px 0' }} />

        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
          Questions, corrections, or want to share what you&rsquo;re building?{' '}
          <Link href="/newsletter" className="link">
            Subscribe to the newsletter
          </Link>{' '}
          — I read every reply.
        </p>
      </div>

      {/* Stack note */}
      <div
        id="stack"
        style={{
          marginTop: '64px',
          padding: '24px 28px',
          borderRadius: '10px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-base)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
            color: 'var(--text-muted)',
            marginBottom: '16px',
          }}
        >
          How this is built
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '16px',
          }}
        >
          {[
            { label: 'Framework', value: 'Next.js 14' },
            { label: 'Database', value: 'Supabase' },
            { label: 'Hosting', value: 'Vercel' },
            { label: 'Content pipeline', value: 'Claude' },
            { label: 'Fonts', value: 'Instrument Serif + Inter' },
          ].map(item => (
            <div key={item.label}>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  marginBottom: '4px',
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  margin: 0,
                }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
