import type { Metadata } from 'next'
import { Suspense } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { PHProvider } from './providers'
import { PostHogPageView } from './PostHogPageView'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'AI Codex — Learn to operate with AI',
    template: '%s',
  },
  description:
    'Structured learning paths, practical guides, and free tools for building and operating with Claude. For developers, founders, and teams putting AI to work.',
  metadataBase: new URL('https://www.aicodex.to'),
  openGraph: {
    type: 'website',
    siteName: 'AI Codex',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.aicodex.to/#organization',
      name: 'AI Codex',
      url: 'https://www.aicodex.to',
      logo: 'https://www.aicodex.to/icon.svg',
      description: 'Structured learning paths, practical guides, and tools for building and operating with Claude AI at work.',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.aicodex.to/#website',
      name: 'AI Codex',
      url: 'https://www.aicodex.to',
      publisher: { '@id': 'https://www.aicodex.to/#organization' },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://www.aicodex.to/articles?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var t = localStorage.getItem('theme');
              document.documentElement.setAttribute('data-theme', t === 'light' ? 'light' : 'dark');
            } catch(e) {}
          })();
        `}} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <PHProvider>
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
          <Nav />
          <main>{children}</main>
          <Footer />
        </PHProvider>
      </body>
    </html>
  )
}
