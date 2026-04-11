import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Implementation Maturity Scorecard — AI Codex',
  description: '10 questions to find out where your Claude implementation actually stands. Get a maturity level, a gap analysis, and specific articles to close each gap.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AI Implementation Maturity Scorecard',
  description: 'A 10-question assessment that scores your Claude implementation maturity across foundation, reliability, cost, security, and architecture.',
  url: 'https://www.aicodex.to/tools/scorecard',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  publisher: { '@type': 'Organization', name: 'AI Codex', url: 'https://www.aicodex.to' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
