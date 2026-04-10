import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'AI Codex — Learn to operate with AI',
    template: '%s | AI Codex',
  },
  description:
    'Clear explanations of every AI concept that matters, and what each one means for your work. Built for operators, founders, and teams putting AI to use.',
  metadataBase: new URL('https://aicodex.to'),
  openGraph: {
    type: 'website',
    siteName: 'AI Codex',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
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
      </head>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
