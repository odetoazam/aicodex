import Link from 'next/link'
import ModelPricingTable from '@/components/ModelPricingTable'
import { VERIFIED } from '@/lib/models'

const ACCENT_CLAUDE = '#D4845A'

export type SpecRow = { label: string; claude: string; other: string }

export type ClaimBlock = {
  source: string
  items: string[]
  caveat: string
}

export type BottomLineBlock = { heading: string; body: React.ReactNode }

export type RelatedLink = { href: string; label: string; sub: string }

export type ComparisonPageProps = {
  title: string
  /** Column header for the non-Claude side, e.g. 'GPT-5.6' */
  otherLabel: string
  otherAccent: string
  /** Vendors to show in the pricing table */
  pricingVendors: string[]
  /** 1–3 paragraphs. The last one gets emphasis treatment. */
  intro: React.ReactNode[]
  specs: SpecRow[]
  claims: ClaimBlock[]
  /** Heading for the "run it yourself" section */
  evalHeading: string
  evalIntro: React.ReactNode
  evalSteps: { bold: string; rest: string }[]
  evalFooter?: React.ReactNode
  bottomLine: BottomLineBlock[]
  related: RelatedLink[]
  jsonLd: object
  breadcrumbLd: object
}

/**
 * Shared layout for every /compare page.
 *
 * The structure is deliberate: verified specs first, then pricing with its
 * caveats, then performance claims *with attribution*, then a method for the
 * reader to settle it themselves, and only then an opinion. Vendor marketing
 * inverts that order; unsourced verdict tables are what we are replacing.
 *
 * Model facts live in lib/models.ts — update there, not here.
 */
export default function ComparisonPage(p: ComparisonPageProps) {
  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(p.jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(p.breadcrumbLd) }} />

      {/* Breadcrumb */}
      <div style={{ marginBottom: '32px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Link href="/compare" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>Compare</Link>
        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>→</span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)' }}>{p.title}</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '48px', maxWidth: '760px' }}>
        <p className="eyebrow" style={{ marginBottom: '16px' }}>Comparison · verified {VERIFIED}</p>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', fontWeight: 600,
          color: 'var(--text-primary)', lineHeight: 1.15, letterSpacing: '-0.02em',
          marginBottom: '20px', maxWidth: '24ch',
        }}>
          {p.title}
        </h1>
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)',
          color: 'var(--text-secondary)', lineHeight: 1.75,
          display: 'flex', flexDirection: 'column', gap: '18px',
        }}>
          {p.intro.map((para, i) => (
            <div key={i} style={i === p.intro.length - 1 ? { color: 'var(--text-primary)', fontWeight: 500 } : undefined}>
              {para}
            </div>
          ))}
        </div>
      </div>

      {/* Specs */}
      <section>
        <h2 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', fontWeight: 600,
          color: 'var(--text-primary)', marginBottom: '20px', letterSpacing: '-0.01em',
        }}>
          The verified differences
        </h2>
        <div style={{ border: '1px solid var(--border-base)', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'minmax(150px, 0.8fr) 1fr 1fr',
            background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-base)',
          }} className="cmp-row">
            <div style={{ padding: '12px 18px' }} />
            <div style={{ padding: '12px 18px', borderLeft: '1px solid var(--border-base)' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, color: ACCENT_CLAUDE, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Claude</span>
            </div>
            <div style={{ padding: '12px 18px', borderLeft: '1px solid var(--border-base)' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, color: p.otherAccent, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{p.otherLabel}</span>
            </div>
          </div>
          {p.specs.map((row, i) => (
            <div key={row.label} style={{
              display: 'grid', gridTemplateColumns: 'minmax(150px, 0.8fr) 1fr 1fr',
              borderTop: i === 0 ? 'none' : '1px solid var(--border-base)',
            }} className="cmp-row">
              <div style={{ padding: '16px 18px' }}>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.45 }}>{row.label}</p>
              </div>
              <div style={{ padding: '16px 18px', borderLeft: '1px solid var(--border-base)' }}>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{row.claude}</p>
              </div>
              <div style={{ padding: '16px 18px', borderLeft: '1px solid var(--border-base)' }}>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{row.other}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <ModelPricingTable vendors={p.pricingVendors} />

      {/* Claims */}
      {p.claims.length > 0 && (
        <section style={{ marginTop: '64px' }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', fontWeight: 600,
            color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '-0.01em',
          }}>
            What the evidence says, and who is saying it
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-secondary)',
            lineHeight: 1.7, maxWidth: '68ch', marginBottom: '28px',
          }}>
            Almost every performance number in public circulation traces back to a vendor running
            its own harness. That does not make the numbers useless, but the attribution belongs
            next to the claim.
          </p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {p.claims.map(c => (
              <div key={c.source} style={{
                border: '1px solid var(--border-base)', borderRadius: '10px',
                padding: '22px 24px', background: 'var(--bg-surface)',
              }}>
                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                  color: 'var(--text-muted)', margin: '0 0 12px',
                }}>{c.source}</p>
                <ul style={{ margin: '0 0 14px', paddingLeft: '18px' }}>
                  {c.items.map(it => (
                    <li key={it} style={{
                      fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)',
                      lineHeight: 1.65, marginBottom: '6px',
                    }}>{it}</li>
                  ))}
                </ul>
                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)',
                  lineHeight: 1.6, margin: 0, fontStyle: 'italic', maxWidth: '76ch',
                }}>{c.caveat}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Decide for yourself */}
      <section style={{ marginTop: '64px' }}>
        <h2 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', fontWeight: 600,
          color: 'var(--text-primary)', marginBottom: '20px', letterSpacing: '-0.01em',
        }}>
          {p.evalHeading}
        </h2>
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)',
          color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: '68ch',
          display: 'flex', flexDirection: 'column', gap: '18px',
        }}>
          <div>{p.evalIntro}</div>
          <ol style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {p.evalSteps.map(s => (
              <li key={s.bold}>
                <strong style={{ color: 'var(--text-primary)' }}>{s.bold}</strong> {s.rest}
              </li>
            ))}
          </ol>
          {p.evalFooter && <div>{p.evalFooter}</div>}
        </div>
      </section>

      {/* Bottom line */}
      <section style={{ marginTop: '64px' }}>
        <div style={{
          border: '1px solid var(--border-base)', borderLeft: `3px solid ${ACCENT_CLAUDE}`,
          borderRadius: '10px', padding: 'clamp(24px, 3.5vw, 34px)', background: 'var(--bg-subtle)',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', fontWeight: 600,
            color: 'var(--text-primary)', margin: '0 0 16px',
          }}>
            The honest bottom line
          </h2>
          <div style={{
            fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)',
            color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: '70ch',
            display: 'flex', flexDirection: 'column', gap: '16px',
          }}>
            {p.bottomLine.map(b => (
              <p key={b.heading} style={{ margin: 0 }}>
                <strong style={{ color: 'var(--text-primary)' }}>{b.heading}</strong> {b.body}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      <section style={{ marginTop: '56px' }}>
        <h2 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', fontWeight: 600,
          color: 'var(--text-primary)', marginBottom: '18px',
        }}>
          Related
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          {p.related.map(r => (
            <Link key={r.href} href={r.href} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '18px', borderRadius: '10px', border: '1px solid var(--border-base)',
                background: 'var(--bg-surface)', height: '100%', boxSizing: 'border-box',
              }}>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 5px' }}>{r.label}</p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.55 }}>{r.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <style>{`
        @media (max-width: 760px) {
          .cmp-row { grid-template-columns: 1fr !important; }
          .cmp-row > div { border-left: none !important; }
        }
      `}</style>
    </div>
  )
}

/** Build the two JSON-LD blobs a comparison page needs. */
export function comparisonLd(title: string, desc: string, slug: string) {
  const url = `https://www.aicodex.to/compare/${slug}`
  return {
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: desc,
      dateModified: '2026-08-21',
      author: { '@type': 'Organization', name: 'AI Codex', url: 'https://www.aicodex.to' },
      publisher: { '@type': 'Organization', name: 'AI Codex', url: 'https://www.aicodex.to' },
      url,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', 'h2'] },
    },
    breadcrumbLd: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Compare', item: 'https://www.aicodex.to/compare' },
        { '@type': 'ListItem', position: 2, name: title, item: url },
      ],
    },
  }
}
