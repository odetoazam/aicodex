'use client'

import { useEffect, useState } from 'react'

// Thin bar fixed at the top of the viewport that fills as the user scrolls.
// Visual only — no DB writes.
export default function ScrollProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    function onScroll() {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      setPct(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      height: '3px', zIndex: 200, pointerEvents: 'none',
    }}>
      <div style={{
        height: '100%',
        width: `${pct}%`,
        background: 'var(--accent)',
        transition: 'width 60ms linear',
      }} />
    </div>
  )
}
