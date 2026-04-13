'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Props {
  slug: string
}

export default function ArticleActions({ slug }: Props) {
  const [loggedIn, setLoggedIn] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isRead, setIsRead] = useState(false)
  const [favLoading, setFavLoading] = useState(false)
  const supabase = createClient()

  // Load auth + state
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      setLoggedIn(true)

      // Load favorites + progress in parallel
      const [favRes, progRes] = await Promise.all([
        supabase.from('user_favorites').select('id').eq('user_id', session.user.id).eq('article_slug', slug).maybeSingle(),
        supabase.from('user_progress').select('id').eq('user_id', session.user.id).eq('article_slug', slug).maybeSingle(),
      ])
      setIsFavorited(!!favRes.data)
      setIsRead(!!progRes.data)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session)
    })

    // Listen for ReadSentinel firing at the bottom of the article
    const onRead = (e: Event) => {
      if ((e as CustomEvent).detail?.slug === slug) setIsRead(true)
    }
    window.addEventListener('article:read', onRead)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('article:read', onRead)
    }
  }, [slug])

  async function toggleFavorite() {
    if (!loggedIn) return
    setFavLoading(true)
    const method = isFavorited ? 'DELETE' : 'POST'
    const res = await fetch('/api/favorites', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })
    if (res.ok) setIsFavorited(!isFavorited)
    setFavLoading(false)
  }

  return (
    <>
      {/* Action bar — shown above article or in header area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
        {loggedIn ? (
          <>
            {/* Favorite toggle */}
            <button
              onClick={toggleFavorite}
              disabled={favLoading}
              title={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px', borderRadius: '6px',
                border: `1px solid ${isFavorited ? 'var(--accent)' : 'var(--border-base)'}`,
                background: isFavorited ? 'var(--accent)' + '18' : 'var(--bg-subtle)',
                color: isFavorited ? 'var(--accent)' : 'var(--text-muted)',
                fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500,
                cursor: 'pointer', transition: 'all 120ms ease',
                opacity: favLoading ? 0.6 : 1,
              }}
            >
              <span style={{ fontSize: '14px' }}>{isFavorited ? '♥' : '♡'}</span>
              {isFavorited ? 'Saved' : 'Save'}
            </button>

            {/* Read indicator */}
            {isRead && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 10px', borderRadius: '6px',
                background: 'var(--bg-subtle)', border: '1px solid var(--border-muted)',
                fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)',
              }}>
                <span style={{ color: '#4caf7d' }}>✓</span> Read
              </span>
            )}
          </>
        ) : (
          /* Not logged in — show subtle prompt */
          <Link
            href={`/auth/login?next=/articles/${slug}`}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 12px', borderRadius: '6px',
              border: '1px solid var(--border-muted)', background: 'var(--bg-subtle)',
              fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)',
              textDecoration: 'none',
            }}
          >
            <span style={{ fontSize: '14px' }}>♡</span>
            Sign in to save
          </Link>
        )}
      </div>

    </>
  )
}
