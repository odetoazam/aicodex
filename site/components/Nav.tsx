'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const NAV_LINKS = [
  { label: 'Paths', href: '/learn' },
  { label: 'Articles', href: '/articles' },
  { label: 'Tools', href: '/tools' },
  { label: 'Glossary', href: '/glossary' },
  { label: 'Timeline', href: '/timeline' },
]

function getInitials(user: User): string {
  const name = user.user_metadata?.full_name as string | undefined
  if (name) {
    const parts = name.trim().split(' ')
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase()
  }
  return (user.email ?? 'U').slice(0, 2).toUpperCase()
}

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    setDropdownOpen(false)
    router.push('/')
    router.refresh()
  }

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

          {user ? (
            /* Logged-in: avatar + dropdown */
            <div ref={dropdownRef} style={{ position: 'relative', marginLeft: '8px' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                title={user.email}
                style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'var(--accent)', color: 'var(--text-inverse)',
                  fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 700,
                  border: 'none', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  backgroundImage: user.user_metadata?.avatar_url
                    ? `url(${user.user_metadata.avatar_url})`
                    : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {!user.user_metadata?.avatar_url && getInitials(user)}
              </button>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: 'var(--bg-surface)', border: '1px solid var(--border-base)',
                  borderRadius: '10px', padding: '6px', minWidth: '180px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100,
                }}>
                  <div style={{ padding: '8px 10px 10px', borderBottom: '1px solid var(--border-muted)', marginBottom: '4px' }}>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    style={{ display: 'block', padding: '8px 10px', borderRadius: '6px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}
                  >
                    My progress
                  </Link>
                  <button
                    onClick={handleSignOut}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '8px 10px', borderRadius: '6px',
                      fontFamily: 'var(--font-sans)', fontSize: '13px',
                      color: 'var(--text-muted)', background: 'none', border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Not logged in: Sign In link + Subscribe */
            <>
              <Link
                href="/auth/login"
                style={{
                  marginLeft: '4px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  padding: '7px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-base)',
                  transition: 'background var(--duration-fast) ease',
                }}
              >
                Sign in
              </Link>
              <Link
                href="/newsletter"
                style={{
                  marginLeft: '6px',
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
            </>
          )}
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
          {user ? (
            <>
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', color: 'var(--text-secondary)', textDecoration: 'none', padding: '12px 16px', borderRadius: '8px' }}
              >
                My progress
              </Link>
              <button
                onClick={() => { handleSignOut(); setMenuOpen(false) }}
                style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '12px 16px', textAlign: 'left', borderRadius: '8px' }}
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              onClick={() => setMenuOpen(false)}
              style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', color: 'var(--accent)', textDecoration: 'none', padding: '12px 16px', borderRadius: '8px' }}
            >
              Sign in
            </Link>
          )}
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
