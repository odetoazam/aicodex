'use client'

import { useState, useEffect } from 'react'

export interface TocEntry {
  id: string
  text: string
  level: 2 | 3
}

interface Props {
  toc: TocEntry[]
  accentColor: string
  variant?: 'sidebar' | 'mobile'
}

export default function TableOfContents({ toc, accentColor, variant = 'sidebar' }: Props) {
  const [activeId, setActiveId] = useState<string>('')
  const [hoveredId, setHoveredId] = useState<string>('')

  useEffect(() => {
    if (typeof window === 'undefined' || toc.length === 0) return

    const headingEls = toc
      .map(item => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[]

    function onScroll() {
      const offset = 120 // account for sticky nav + some breathing room
      const scrollY = window.scrollY + offset

      let current = ''
      for (const el of headingEls) {
        if (el.offsetTop <= scrollY) current = el.id
        else break
      }
      setActiveId(current)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [toc])

  const isSidebar = variant === 'sidebar'

  return (
    <>
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        marginBottom: isSidebar ? '14px' : '12px',
      }}>
        Contents
      </p>
      <nav>
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: isSidebar ? '2px' : '8px' }}>
          {toc.map(item => {
            const isActive = activeId === item.id
            const isHovered = hoveredId === item.id

            const textColor = isActive
              ? accentColor
              : isHovered
                ? 'var(--text-primary)'
                : item.level === 3
                  ? 'var(--text-muted)'
                  : 'var(--text-secondary)'

            return (
              <li key={item.id} style={{ paddingLeft: item.level === 3 ? '10px' : '0' }}>
                <a
                  href={`#${item.id}`}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId('')}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: item.level === 3 ? '12px' : '13px',
                    color: textColor,
                    textDecoration: 'none',
                    lineHeight: 1.45,
                    display: 'block',
                    fontWeight: isActive ? 500 : 400,
                    transition: 'color 150ms ease, background 150ms ease',
                    padding: isSidebar ? '5px 8px' : '0',
                    borderRadius: isSidebar ? '4px' : '0',
                    background: isSidebar && isActive
                      ? `${accentColor}12`
                      : isSidebar && isHovered
                        ? 'var(--bg-subtle)'
                        : 'transparent',
                    borderLeft: isSidebar ? `2px solid ${isActive ? accentColor : 'transparent'}` : 'none',
                    marginLeft: isSidebar ? '-8px' : '0',
                    paddingLeft: isSidebar ? (item.level === 3 ? '18px' : '8px') : '0',
                  }}
                >
                  {!isSidebar && item.level === 3 && (
                    <span style={{ color: 'var(--border-base)', marginRight: '6px' }}>↳</span>
                  )}
                  {item.text}
                </a>
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
