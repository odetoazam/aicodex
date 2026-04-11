import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Claude API Cost Calculator — AI Codex',
  description: 'Estimate your monthly Claude API spend. Enter messages per day, average token counts, and model — get daily, monthly, and yearly cost breakdowns with and without prompt caching.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Claude API Cost Calculator',
  description: 'Estimate your monthly Claude API spend by model, usage volume, and prompt caching configuration.',
  url: 'https://www.aicodex.to/tools/cost-calculator',
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
