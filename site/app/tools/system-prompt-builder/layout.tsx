import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'System Prompt Builder — AI Codex',
  description: 'Build a production-ready Claude system prompt in minutes. Choose your use case, tone, output format, and constraints — get a copy-ready prompt tailored to your app.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'System Prompt Builder',
  description: 'Generate a production-ready Claude system prompt by selecting your use case, tone, output format, audience, and safety constraints.',
  url: 'https://www.aicodex.to/tools/system-prompt-builder',
  applicationCategory: 'DeveloperApplication',
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
