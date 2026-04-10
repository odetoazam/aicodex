import Link from 'next/link'
import type { Metadata } from 'next'
import { CLUSTERS, CLUSTER_MAP } from '@/lib/clusters'

export const metadata: Metadata = {
  title: 'Articles — AI Codex',
  description: 'Cross-concept deep dives, operator dispatches, and the questions nobody else is asking about AI.',
}

const TIER_CONFIG = {
  3: { label: 'Cross-Concept', color: '#5AAFD4', bg: 'rgba(90,175,212,0.1)' },
  4: { label: 'Journey', color: '#9B7BD4', bg: 'rgba(155,123,212,0.1)' },
  5: { label: 'Absence', color: '#D45A7B', bg: 'rgba(212,90,123,0.1)' },
  'field': { label: 'From the Field', color: '#D4845A', bg: 'rgba(212,132,90,0.1)' },
}

// Mock articles — replace with Supabase query
const ARTICLES = [
  {
    slug: 'why-rag-fails-when-you-need-a-knowledge-graph',
    title: 'Why RAG Fails When You Need a Knowledge Graph',
    cluster: 'Retrieval & Knowledge',
    tier: 3,
    read_time: 6,
    date: 'Apr 2026',
    excerpt: 'Vector similarity is powerful but blind to structure. Here\'s when the architecture decision matters more than the model.',
  },
  {
    slug: 'the-real-cost-of-ai-that-nobody-measures',
    title: 'The Real Cost of AI That Nobody Measures',
    cluster: 'Business Strategy & ROI',
    tier: 5,
    read_time: 5,
    date: 'Apr 2026',
    excerpt: 'API costs are 20% of it. The other 80% — engineering time, eval overhead, change management — is what kills AI projects.',
  },
  {
    slug: 'agent-memory-the-architecture-decision-that-determines-everything',
    title: 'Agent Memory: The Architecture Decision That Determines Everything',
    cluster: 'Agents & Orchestration',
    tier: 3,
    read_time: 7,
    date: 'Mar 2026',
    excerpt: 'Most agent failures aren\'t reasoning failures. They\'re memory failures. Here\'s how to design for it.',
  },
  {
    slug: 'nobody-measures-ai-roi-correctly',
    title: 'Why Nobody Measures AI ROI Correctly — And What to Track Instead',
    cluster: 'Business Strategy & ROI',
    tier: 5,
    read_time: 6,
    date: 'Mar 2026',
    excerpt: 'The standard ROI frameworks weren\'t built for probabilistic, continuously-improving systems. Here\'s what actually matters.',
  },
  {
    slug: 'prompt-governance-the-missing-layer',
    title: 'Prompt Governance: The Missing Layer in Every Enterprise AI Deployment',
    cluster: 'Prompt Engineering',
    tier: 5,
    read_time: 5,
    date: 'Feb 2026',
    excerpt: 'Everyone has a prompt. Nobody has a process for managing, versioning, and auditing them. This gap will hurt you.',
  },
  {
    slug: 'building-ai-in-a-regulated-industry',
    title: 'What Building AI in a Regulated Industry Teaches You About Production AI',
    cluster: 'Business Strategy & ROI',
    tier: 'field' as const,
    read_time: 4,
    date: 'Apr 2026',
    excerpt: 'When hallucinations have compliance consequences, you learn to design AI systems differently. Here\'s what that looks like.',
  },
]

export default function ArticlesPage() {
  const absence = ARTICLES.filter(a => a.tier === 5)
  const crossConcept = ARTICLES.filter(a => a.tier === 3)
  const field = ARTICLES.filter(a => a.tier === 'field')

  return (
    <div
      style={{
        width: 'var(--container)',
        margin: '0 auto',
        padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '64px' }}>
        <p className="eyebrow" style={{ marginBottom: '16px' }}>Articles</p>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-3xl)',
            fontWeight: 400,
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: '16px',
            maxWidth: '16ch',
          }}
        >
          Beyond the definition
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-base)',
            color: 'var(--text-muted)',
            maxWidth: '52ch',
            lineHeight: 1.65,
          }}
        >
          Cross-concept deep dives, operator dispatches, and the questions nobody else is asking. This is where the glossary becomes judgment.
        </p>
      </div>

      {/* Absence Articles — flagship section */}
      {absence.length > 0 && (
        <section style={{ marginBottom: '72px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <span
              style={{
                padding: '3px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase' as const,
                color: '#D45A7B',
                background: 'rgba(212,90,123,0.1)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Absence
            </span>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                color: 'var(--text-muted)',
              }}
            >
              What the AI industry doesn&rsquo;t measure or say
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '2px' }}>
            {absence.map(article => <ArticleRow key={article.slug} article={article} />)}
          </div>
        </section>
      )}

      {/* Cross-Concept */}
      {crossConcept.length > 0 && (
        <section style={{ marginBottom: '72px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <span
              style={{
                padding: '3px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase' as const,
                color: '#5AAFD4',
                background: 'rgba(90,175,212,0.1)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Cross-Concept
            </span>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                color: 'var(--text-muted)',
              }}
            >
              Where two concepts meet and something new emerges
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '2px' }}>
            {crossConcept.map(article => <ArticleRow key={article.slug} article={article} />)}
          </div>
        </section>
      )}

      {/* From the Field */}
      {field.length > 0 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <span
              style={{
                padding: '3px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase' as const,
                color: 'var(--accent)',
                background: 'var(--accent-muted)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              From the Field
            </span>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                color: 'var(--text-muted)',
              }}
            >
              Operator dispatches — what it actually looks like to build with AI
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '2px' }}>
            {field.map(article => <ArticleRow key={article.slug} article={article} />)}
          </div>
        </section>
      )}
    </div>
  )
}

function ArticleRow({ article }: { article: typeof ARTICLES[0] }) {
  const clusterConfig = CLUSTER_MAP[article.cluster]
  const tierConfig = TIER_CONFIG[article.tier as keyof typeof TIER_CONFIG]

  return (
    <Link
      href={`/articles/${article.slug}`}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center',
        gap: '24px',
        padding: '20px',
        borderRadius: '8px',
        textDecoration: 'none',
        transition: 'background 120ms ease',
        borderLeft: '2px solid transparent',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.background = 'var(--bg-surface)'
        el.style.borderLeftColor = (clusterConfig?.color ?? '#D4845A') + '60'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.background = 'transparent'
        el.style.borderLeftColor = 'transparent'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' as const }}>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.04em',
              textTransform: 'uppercase' as const,
              color: clusterConfig?.color,
              background: clusterConfig?.bg,
              fontFamily: 'var(--font-sans)',
            }}
          >
            {article.cluster.split(' ')[0]}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              color: 'var(--text-muted)',
            }}
          >
            {article.date} · {article.read_time} min
          </span>
        </div>
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-lg)',
            fontWeight: 400,
            color: 'var(--text-primary)',
            lineHeight: 1.3,
            marginBottom: '8px',
          }}
        >
          {article.title}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {article.excerpt}
        </p>
      </div>
      <span style={{ color: 'var(--text-muted)', fontSize: '18px', flexShrink: 0 }}>→</span>
    </Link>
  )
}
