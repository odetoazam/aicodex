'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface ProgressRow {
  article_slug: string
  read_at: string
}

interface FavoriteRow {
  article_slug: string
  favorited_at: string
}

function ArticleCard({ slug, title, badge }: { slug: string; title: string; badge?: string }) {
  return (
    <Link href={`/articles/${slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        padding: '14px 16px', borderRadius: '8px',
        border: '1px solid var(--border-base)', background: 'var(--bg-surface)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
        transition: 'border-color 120ms ease',
      }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
          {title}
        </span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {badge}
        </span>
      </div>
    </Link>
  )
}

function Section({ title, items, emptyText, renderBadge, titleMap }: {
  title: string
  items: { slug: string; date: string }[]
  emptyText: string
  renderBadge: (date: string) => string
  titleMap: Record<string, string>
}) {
  return (
    <div style={{ marginBottom: '48px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '20px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
          {title}
        </h2>
        {items.length > 0 && (
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)' }}>
            {items.length}
          </span>
        )}
      </div>
      {items.length === 0 ? (
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
          {emptyText}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {items.map(item => (
            <ArticleCard
              key={item.slug}
              slug={item.slug}
              title={titleMap[item.slug] ?? item.slug}
              badge={renderBadge(item.date)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [progress, setProgress] = useState<ProgressRow[]>([])
  const [favorites, setFavorites] = useState<FavoriteRow[]>([])
  const [titleMap, setTitleMap] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.replace('/auth/login?next=/profile'); return }
      setUser(session.user)

      const [progRes, favRes] = await Promise.all([
        supabase.from('user_progress').select('article_slug, read_at').eq('user_id', session.user.id).order('read_at', { ascending: false }),
        supabase.from('user_favorites').select('article_slug, favorited_at').eq('user_id', session.user.id).order('favorited_at', { ascending: false }),
      ])

      const prog = progRes.data ?? []
      const favs = favRes.data ?? []
      setProgress(prog)
      setFavorites(favs)

      // Fetch real titles for all slugs
      const allSlugs = [...new Set([...prog.map(p => p.article_slug), ...favs.map(f => f.article_slug)])]
      if (allSlugs.length > 0) {
        const { data: articles } = await supabase
          .from('articles')
          .select('slug, title')
          .in('slug', allSlugs)
        const map: Record<string, string> = {}
        for (const a of articles ?? []) map[a.slug] = a.title
        setTitleMap(map)
      }

      setLoading(false)
    }
    load()
  }, [])

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(64px, 10vw, 120px) 0', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    )
  }

  if (!user) return null

  const getInitials = () => {
    const name = user.user_metadata?.full_name as string | undefined
    if (name) {
      const parts = name.trim().split(' ')
      return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase()
    }
    return (user.email ?? 'U').slice(0, 2).toUpperCase()
  }

  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 80px) 0 var(--section-y)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '56px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: user.user_metadata?.avatar_url ? 'transparent' : 'var(--accent)',
            backgroundImage: user.user_metadata?.avatar_url ? `url(${user.user_metadata.avatar_url})` : undefined,
            backgroundSize: 'cover', backgroundPosition: 'center',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-inverse)', fontFamily: 'var(--font-sans)', fontSize: '18px', fontWeight: 700, flexShrink: 0,
          }}>
            {!user.user_metadata?.avatar_url && getInitials()}
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>
              {user.user_metadata?.full_name ?? 'My account'}
            </h1>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
              {user.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          style={{
            padding: '8px 16px', borderRadius: '7px',
            border: '1px solid var(--border-base)', background: 'var(--bg-subtle)',
            fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          Sign out
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '48px', maxWidth: '400px' }}>
        {[
          { label: 'Articles read', value: progress.length },
          { label: 'Saved', value: favorites.length },
        ].map(stat => (
          <div key={stat.label} style={{ padding: '20px', borderRadius: '10px', border: '1px solid var(--border-base)', background: 'var(--bg-surface)' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.03em' }}>
              {stat.value}
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Favorites */}
      <Section
        title="Saved"
        items={favorites.map(f => ({ slug: f.article_slug, date: f.favorited_at }))}
        emptyText="No saved articles yet. Hit the ♡ on any article to save it here."
        renderBadge={date => `Saved ${formatDate(date)}`}
        titleMap={titleMap}
      />

      {/* Reading history */}
      <Section
        title="Reading history"
        items={progress.map(p => ({ slug: p.article_slug, date: p.read_at }))}
        emptyText="No articles read yet. Articles you finish will appear here."
        renderBadge={date => `Read ${formatDate(date)}`}
        titleMap={titleMap}
      />
    </div>
  )
}
