'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

const NAV_LINKS = [
  { label: 'Learn', href: '/learn' },
  { label: 'Glossary', href: '/glossary' },
  { label: 'Articles', href: '/articles' },
  { label: 'About', href: '/about' },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid var(--border-muted)',
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div
        style={{
          width: 'var(--container-wide)',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '56px',
        }}
      >
        {/* Wordmark */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
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
              fontFamily: 'var(--font-sans)',
              flexShrink: 0,
            }}
          >
            ◈
          </span>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '17px',
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
            }}
          >
            AI Codex
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
          className="desktop-nav"
        >
          {NAV_LINKS.map(link => {
            const active = pathname === link.href || pathname.startsWith(link.href + '/')
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                  textDecoration: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: active ? 'var(--bg-subtle)' : 'transparent',
                  transition: 'color var(--duration-fast) ease, background var(--duration-fast) ease',
                }}
                onMouseEnter={e => {
                  if (!active) (e.target as HTMLElement).style.color = 'var(--text-secondary)'
                }}
                onMouseLeave={e => {
                  if (!active) (e.target as HTMLElement).style.color = 'var(--text-muted)'
                }}
              >
                {link.label}
              </Link>
            )
          })}

          <ThemeToggle />

          <Link
            href="/newsletter"
            style={{
              marginLeft: '8px',
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--text-inverse)',
              textDecoration: 'none',
              padding: '7px 16px',
              borderRadius: '6px',
              background: 'var(--accent)',
              transition: 'background var(--duration-fast) ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent-hover)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent)' }}
          >
            Subscribe
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '20px',
            padding: '8px',
          }}
          className="mobile-menu-btn"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            borderTop: '1px solid var(--border-muted)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '16px',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                padding: '12px 16px',
                borderRadius: '8px',
                background: pathname === link.href ? 'var(--bg-subtle)' : 'transparent',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  )
}
