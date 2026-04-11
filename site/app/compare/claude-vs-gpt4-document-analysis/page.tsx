import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Claude vs GPT-4 for Document Analysis — AI Codex',
  description: 'A practical comparison of Claude and GPT-4 for document analysis. Contract review, PDF processing, large-context synthesis, and what operators actually need when working with long documents.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Claude vs GPT-4 for Document Analysis',
  description: 'A practical comparison of Claude and GPT-4 for document analysis. Contract review, PDF processing, large-context synthesis, and what operators actually need when working with long documents.',
  author: { '@type': 'Organization', name: 'AI Codex', url: 'https://www.aicodex.to' },
  publisher: { '@type': 'Organization', name: 'AI Codex', url: 'https://www.aicodex.to' },
  url: 'https://www.aicodex.to/compare/claude-vs-gpt4-document-analysis',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.aicodex.to/compare/claude-vs-gpt4-document-analysis' },
}

const ACCENT_CLAUDE = '#D4845A'
const ACCENT_GPT = '#5B8DD9'

interface CompareRow {
  dimension: string
  claude: { verdict: 'better' | 'similar' | 'worse'; text: string }
  gpt4: { verdict: 'better' | 'similar' | 'worse'; text: string }
}

const ROWS: CompareRow[] = [
  {
    dimension: 'Context window for long documents',
    claude: { verdict: 'better', text: 'Claude 3.5 Sonnet supports 200k tokens — roughly 500 pages of text. More importantly, retrieval quality degrades more slowly at the extremes. Claude maintains coherence across the full context in a way GPT-4 does not reliably match.' },
    gpt4: { verdict: 'similar', text: 'GPT-4o supports 128k context. Sufficient for many document analysis tasks, but performance on very long documents degrades faster — information from the middle of the context is more likely to be missed or deprioritized.' },
  },
  {
    dimension: 'Contract and legal document review',
    claude: { verdict: 'better', text: 'Strong at finding specific clauses, summarizing obligations, flagging unusual terms, and comparing contract versions. The large context window means full contracts fit without chunking, which avoids clause-boundary errors.' },
    gpt4: { verdict: 'similar', text: 'Capable contract reviewer, especially with GPT-4o. Context limit means very long contracts may require chunking, which creates risk of missing cross-clause dependencies.' },
  },
  {
    dimension: 'Multi-document synthesis',
    claude: { verdict: 'better', text: 'Excellent at tasks like "here are five analyst reports — what are the points of consensus and where do they diverge?" Maintains distinct source attribution across a long context without blending sources incorrectly.' },
    gpt4: { verdict: 'similar', text: 'Can handle multi-document synthesis but is more prone to blending sources without attribution. Works better with explicit instructions to cite source numbers when drawing conclusions.' },
  },
  {
    dimension: 'Structured data extraction',
    claude: { verdict: 'similar', text: 'Reliable at extracting structured data from unstructured documents — pulling table data, lists, dates, names, and financial figures into JSON or CSV format. Strong at following exact schema requirements.' },
    gpt4: { verdict: 'similar', text: 'Equally capable for structured extraction. GPT-4\'s function calling / structured output mode is mature and well-documented for developers building extraction pipelines.' },
  },
  {
    dimension: 'Financial document analysis',
    claude: { verdict: 'better', text: 'Handles annual reports, 10-Ks, earnings transcripts, and financial statements well. Good at connecting narrative discussion in MD&A sections with actual financial figures — not just summarizing tables.' },
    gpt4: { verdict: 'similar', text: 'Solid for financial document analysis. Code interpreter integration (in ChatGPT) adds value for running calculations on extracted figures, which Claude lacks in chat mode.' },
  },
  {
    dimension: 'Accuracy on factual extraction',
    claude: { verdict: 'better', text: 'Lower hallucination rate on factual extraction tasks — less likely to invent a number or clause that wasn\'t in the source document. Still requires verification on high-stakes outputs, but the baseline reliability is higher.' },
    gpt4: { verdict: 'similar', text: 'Generally accurate on factual extraction but hallucination risk increases on long documents where source material is sparse. Should be verified on any legally or financially significant output.' },
  },
  {
    dimension: 'PDF / file upload handling',
    claude: { verdict: 'similar', text: 'Handles PDF uploads natively in Claude.ai and via the API (base64 encoded). Good OCR-equivalent accuracy on well-formatted documents.' },
    gpt4: { verdict: 'similar', text: 'GPT-4o handles PDF uploads in ChatGPT. API file handling is less flexible than Claude\'s base64 approach for complex document pipelines.' },
  },
  {
    dimension: 'Speed on large documents',
    claude: { verdict: 'similar', text: 'Claude Sonnet processes large documents quickly. Initial latency on very long contexts is noticeable but within acceptable range for non-interactive workflows.' },
    gpt4: { verdict: 'similar', text: 'Comparable speed. For interactive document Q&A where response latency matters, both models are similar in practice.' },
  },
  {
    dimension: 'Cost for document-heavy workloads',
    claude: { verdict: 'better', text: 'Prompt caching is a major cost advantage for document analysis at scale: if you\'re running many queries against the same document, cache the document and pay 90% less on input tokens. Meaningful for high-volume analysis pipelines.' },
    gpt4: { verdict: 'similar', text: 'OpenAI has prompt caching too, but implementation details differ. For one-off analysis, costs are comparable. For repeat-query workflows against the same document, compare caching behavior directly for your use case.' },
  },
]

function VerdictBadge({ verdict }: { verdict: 'better' | 'similar' | 'worse' }) {
  const map = {
    better: { label: 'Stronger', bg: 'rgba(76,175,125,0.12)', color: '#4CAF7D' },
    similar: { label: 'Similar', bg: 'var(--bg-subtle)', color: 'var(--text-muted)' },
    worse: { label: 'Weaker', bg: 'rgba(91,141,217,0.1)', color: '#5B8DD9' },
  }
  const v = map[verdict]
  return (
    <span style={{
      display: 'inline-block',
      fontSize: '11px', fontFamily: 'var(--font-sans)', fontWeight: 500,
      padding: '2px 8px', borderRadius: '4px',
      background: v.bg, color: v.color,
    }}>
      {v.label}
    </span>
  )
}

export default function CompareGPT4DocumentPage() {
  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <div style={{ marginBottom: '32px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Link href="/compare" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>
          Compare
        </Link>
        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>→</span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Claude vs GPT-4 for Document Analysis
        </span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '56px' }}>
        <p className="eyebrow" style={{ marginBottom: '16px' }}>Comparison</p>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          marginBottom: '20px',
          maxWidth: '26ch',
        }}>
          Claude vs GPT-4 for Document Analysis
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-base)',
          color: 'var(--text-muted)',
          maxWidth: '54ch',
          lineHeight: 1.65,
        }}>
          Contracts, financial reports, research papers, multi-document synthesis. Where context window size, retrieval quality, and hallucination rate matter most — and which model handles the edge cases better.
        </p>
      </div>

      {/* Context window callout */}
      <div style={{ padding: '20px 24px', borderRadius: '10px', border: '1px solid var(--border-base)', background: 'var(--bg-subtle)', marginBottom: '40px', display: 'flex', gap: '24px', flexWrap: 'wrap' as const }}>
        <div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: ACCENT_CLAUDE, marginBottom: '4px' }}>Claude 3.5 Sonnet</p>
          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>200k tokens</p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0' }}>≈ 500 pages</p>
        </div>
        <div style={{ width: '1px', background: 'var(--border-base)', alignSelf: 'stretch' }} />
        <div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: ACCENT_GPT, marginBottom: '4px' }}>GPT-4o</p>
          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>128k tokens</p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0' }}>≈ 320 pages</p>
        </div>
        <div style={{ alignSelf: 'center', maxWidth: '36ch' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
            Context window size matters, but retrieval quality at the extremes matters more. Claude maintains coherence across 200k tokens more reliably than GPT-4o at 128k.
          </p>
        </div>
      </div>

      {/* TL;DR */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '56px' }} className="tldr-grid">
        <div style={{ padding: '24px', borderRadius: '10px', border: `2px solid ${ACCENT_CLAUDE}30`, background: `${ACCENT_CLAUDE}06` }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: ACCENT_CLAUDE, marginBottom: '10px' }}>
            Claude — Best for
          </p>
          <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
            {[
              'Very long documents (100k+ tokens / 250+ pages)',
              'Contracts and legal review where full-doc coherence matters',
              'Multi-document synthesis with source attribution',
              'High-volume analysis pipelines using prompt caching',
              'Financial docs requiring narrative + numbers synthesis',
            ].map(item => (
              <li key={item} style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item}</li>
            ))}
          </ul>
        </div>
        <div style={{ padding: '24px', borderRadius: '10px', border: `2px solid ${ACCENT_GPT}30`, background: `${ACCENT_GPT}06` }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: ACCENT_GPT, marginBottom: '10px' }}>
            GPT-4 — Best for
          </p>
          <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
            {[
              'Structured data extraction with function calling',
              'Interactive document Q&A via ChatGPT',
              'Shorter documents where 128k is sufficient',
              'Financial analysis with Code Interpreter calculations',
              'Teams already in the OpenAI / ChatGPT workflow',
            ].map(item => (
              <li key={item} style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Table */}
      <div style={{ marginBottom: '56px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px' }}>
          Dimension-by-dimension breakdown
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 1fr', borderRadius: '10px 10px 0 0', background: 'var(--bg-subtle)', border: '1px solid var(--border-base)', borderBottom: 'none' }} className="compare-header">
          <div style={{ padding: '12px 16px' }}><span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Dimension</span></div>
          <div style={{ padding: '12px 16px', borderLeft: '1px solid var(--border-muted)' }}><span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 700, color: ACCENT_CLAUDE }}>Claude</span></div>
          <div style={{ padding: '12px 16px', borderLeft: '1px solid var(--border-muted)' }}><span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 700, color: ACCENT_GPT }}>GPT-4</span></div>
        </div>

        {ROWS.map((row, i) => (
          <div key={row.dimension} style={{ display: 'grid', gridTemplateColumns: '200px 1fr 1fr', border: '1px solid var(--border-base)', borderTop: 'none', borderRadius: i === ROWS.length - 1 ? '0 0 10px 10px' : '0', background: i % 2 === 0 ? 'var(--bg-surface)' : 'transparent' }} className="compare-row">
            <div style={{ padding: '16px' }}><span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>{row.dimension}</span></div>
            <div style={{ padding: '16px', borderLeft: '1px solid var(--border-muted)' }}>
              <VerdictBadge verdict={row.claude.verdict} />
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55, margin: '6px 0 0' }}>{row.claude.text}</p>
            </div>
            <div style={{ padding: '16px', borderLeft: '1px solid var(--border-muted)' }}>
              <VerdictBadge verdict={row.gpt4.verdict} />
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55, margin: '6px 0 0' }}>{row.gpt4.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom line */}
      <div style={{ padding: '32px', borderRadius: '12px', border: '1px solid var(--border-base)', background: 'var(--bg-surface)', marginBottom: '40px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
          The bottom line
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
          For serious document analysis work — contracts, financial reports, research synthesis, anything requiring coherent reasoning across a large volume of text — <strong>Claude is the stronger choice</strong>. The combination of a 200k context window, better retrieval quality at the extremes, and lower hallucination rates on factual extraction makes a meaningful practical difference.
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          The prompt caching advantage is worth calling out separately: if you are running a high-volume document analysis pipeline — the same long document with many different queries — Claude&apos;s caching reduces your input token cost by 90% on cached content. At scale, that is not a minor detail.
        </p>
      </div>

      {/* Related */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const }}>
        <Link href="/articles/building-a-rag-pipeline-from-scratch" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', padding: '8px 16px', border: '1px solid var(--accent)', borderRadius: '6px' }}>
          Build a RAG pipeline →
        </Link>
        <Link href="/articles/prompt-caching-implementation" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', padding: '8px 16px', border: '1px solid var(--accent)', borderRadius: '6px' }}>
          Implement prompt caching →
        </Link>
        <Link href="/compare" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', padding: '8px 16px', border: '1px solid var(--border-base)', borderRadius: '6px' }}>
          All comparisons
        </Link>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .tldr-grid { grid-template-columns: 1fr !important; }
          .compare-header { grid-template-columns: 1fr !important; }
          .compare-row { grid-template-columns: 1fr !important; }
          .compare-header > div:not(:first-child) { border-left: none !important; border-top: 1px solid var(--border-muted); }
          .compare-row > div:not(:first-child) { border-left: none !important; border-top: 1px solid var(--border-muted); }
        }
      `}</style>
    </div>
  )
}
