import type { Metadata } from 'next'
import { getAllArticles } from '@/lib/db'
import ArticlesFilteredView from '@/components/ArticlesFilteredView'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Articles — AI Codex',
  description: 'Decision guides, implementation patterns, and what building with AI actually looks like. For operators, founders, and developers.',
}

export default async function ArticlesPage() {
  const articles = await getAllArticles()

  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>

      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <p className="eyebrow" style={{ marginBottom: '16px' }}>Articles</p>
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
          Practical AI, by persona.
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)',
          color: 'var(--text-muted)', maxWidth: '52ch', lineHeight: 1.65,
        }}>
          Decision guides, implementation patterns, and what building with AI actually looks like.
          Pick your context — the reading list adjusts.
        </p>
      </div>

      {articles.length === 0 ? (
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-muted)' }}>
          Articles coming soon.
        </p>
      ) : (
        <ArticlesFilteredView articles={articles} />
      )}

    </div>
  )
}
