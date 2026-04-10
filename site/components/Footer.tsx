import Link from 'next/link'

const FOOTER_LINKS = {
  'Knowledge': [
    { label: 'Glossary', href: '/glossary' },
    { label: 'Articles', href: '/articles' },
    { label: 'Clusters', href: '/glossary#clusters' },
  ],
  'Learn': [
    { label: 'Newsletter', href: '/newsletter' },
    { label: 'Courses', href: '/courses' },
    { label: 'From the Field', href: '/articles?type=field-notes' },
  ],
  'About': [
    { label: 'About', href: '/about' },
    { label: 'Built with Claude', href: '/about#stack' },
  ],
}

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-muted)',
        marginTop: 'var(--section-y)',
      }}
    >
      <div
        style={{
          width: 'var(--container-wide)',
          margin: '0 auto',
          padding: 'clamp(48px, 8vw, 80px) 0 clamp(32px, 5vw, 48px)',
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr repeat(3, auto)',
            gap: 'clamp(32px, 6vw, 80px)',
            marginBottom: '48px',
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              <span
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '4px',
                  background: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  color: 'var(--text-inverse)',
                  fontWeight: 600,
                }}
              >
                ◈
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '17px',
                  color: 'var(--text-primary)',
                }}
              >
                AI Codex
              </span>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                color: 'var(--text-muted)',
                maxWidth: '240px',
                lineHeight: 1.6,
              }}
            >
              The knowledge graph for building with AI. No hype, no fluff — just structured understanding.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: '16px',
                }}
              >
                {group}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {links.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '14px',
                      color: 'var(--text-muted)',
                      textDecoration: 'none',
                      transition: 'color var(--duration-fast) ease',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '24px',
            borderTop: '1px solid var(--border-muted)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              color: 'var(--text-muted)',
            }}
          >
            © {new Date().getFullYear()} AI Codex
          </p>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              color: 'var(--text-muted)',
            }}
          >
            Built with{' '}
            <span style={{ color: 'var(--accent)' }}>Claude</span>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}
