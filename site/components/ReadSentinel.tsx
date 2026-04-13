'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  slug: string
}

// Invisible sentinel placed at the bottom of an article.
// When it enters the viewport, marks the article as read and fires a custom event
// so ArticleActions can update its "✓ Read" indicator without a page reload.
export default function ReadSentinel({ slug }: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const markedRef = useRef(false)
  const supabase = createClient()

  useEffect(() => {
    if (!sentinelRef.current) return

    const observer = new IntersectionObserver(
      async (entries) => {
        if (!entries[0].isIntersecting || markedRef.current) return

        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        markedRef.current = true

        const res = await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug }),
        })

        if (res.ok) {
          // Notify ArticleActions so it can show "✓ Read" without a reload
          window.dispatchEvent(new CustomEvent('article:read', { detail: { slug } }))
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [slug])

  return <div ref={sentinelRef} style={{ height: '4px', marginTop: '8px' }} aria-hidden="true" />
}
