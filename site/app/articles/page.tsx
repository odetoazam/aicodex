import Link from 'next/link'
import type { Metadata } from 'next'
import ArticleRow from '@/components/ArticleRow'
import { getAllArticles } from '@/lib/db'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Articles — AI Codex',
  description: 'Cross-concept deep dives, operator dispatches, and the questions nobody else is asking about AI.',
}

export default async function ArticlesPage() {
  const articles = await getAllArticles()

  const absence     = articles.filter(a => a.tier === 5)
  const crossConcept = articles.filter(a => a.tier === 3)
  const field       = articles.filter(a => a.angle === 'field-note')

  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>

      {/* Header */}
      <div style={{ marginBottom: '64px' }}>
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
            maxWidth: '16ch',
          }}
        >
          Beyond the definition
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-muted)', maxWidth: '52ch', lineHeight: 1.65 }}>
          Cross-concept deep dives, operator dispatches, and the questions nobody else is asking. This is where the glossary becomes judgment.
        </p>
      </div>

      {articles.length === 0 && (
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-muted)' }}>
          Articles coming soon.
        </p>
      )}

      {/* Absence — flagship */}
      {absence.length > 0 && (
        <section style={{ marginBottom: '72px' }}>
          <SectionHeader
            badge="Absence"
            badgeColor="#D45A7B"
            badgeBg="rgba(212,90,123,0.1)"
            description="What the AI industry doesn't measure or say"
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {absence.map(a => <ArticleRow key={a.slug} article={a} />)}
          </div>
        </section>
      )}

      {/* Cross-Concept */}
      {crossConcept.length > 0 && (
        <section style={{ marginBottom: '72px' }}>
          <SectionHeader
            badge="Cross-Concept"
            badgeColor="#5AAFD4"
            badgeBg="rgba(90,175,212,0.1)"
            description="Where two concepts meet and something new emerges"
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {crossConcept.map(a => <ArticleRow key={a.slug} article={a} />)}
          </div>
        </section>
      )}

      {/* From the Field */}
      {field.length > 0 && (
        <section>
          <SectionHeader
            badge="From the Field"
            badgeColor="var(--accent)"
            badgeBg="var(--accent-muted)"
            description="Operator dispatches — what it actually looks like to build with AI"
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {field.map(a => <ArticleRow key={a.slug} article={a} />)}
          </div>
        </section>
      )}
    </div>
  )
}

function SectionHeader({ badge, badgeColor, badgeBg, description }: {
  badge: string; badgeColor: string; badgeBg: string; description: string
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
      <span
        style={{
          padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 500,
          letterSpacing: '0.05em', textTransform: 'uppercase' as const,
          color: badgeColor, background: badgeBg, fontFamily: 'var(--font-sans)',
        }}
      >
        {badge}
      </span>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)' }}>
        {description}
      </p>
    </div>
  )
}
