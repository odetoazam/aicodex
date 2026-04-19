'use client'

import { useState } from 'react'
import GuidedStart from './GuidedStart'

interface Props {
  /** 'hero' renders as a proper bordered button; 'subtle' is the original muted text link; 'strip' is a full-width band */
  variant?: 'hero' | 'subtle' | 'strip'
}

export default function GuidedStartTrigger({ variant = 'subtle' }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {variant === 'strip' ? (
        <div style={{
          marginTop: '20px',
          padding: '18px 24px',
          borderRadius: '10px',
          border: '1px solid var(--border-base)',
          background: 'var(--bg-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap' as const,
        }}>
          <div>
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500,
              color: 'var(--text-primary)', margin: '0 0 2px',
            }}>
              Not sure which one fits you?
            </p>
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '13px',
              color: 'var(--text-muted)', margin: 0,
            }}>
              Answer 2 questions and we'll point you to the right path.
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: '1.5px solid var(--border-base)',
              borderRadius: '8px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              whiteSpace: 'nowrap' as const,
              transition: 'border-color 0.15s ease, color 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent)'
              e.currentTarget.style.color = 'var(--accent)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-base)'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
          >
            Find my path →
          </button>
        </div>
      ) : variant === 'hero' ? (
        <button
          onClick={() => setOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: '1.5px solid var(--border-base)',
            borderRadius: '8px',
            padding: '13px 24px',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            fontSize: '15px',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            transition: 'border-color 0.15s ease, color 0.15s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--accent)'
            e.currentTarget.style.color = 'var(--accent)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border-base)'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}
        >
          Not sure where to start? →
        </button>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button
            onClick={() => setOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              color: 'var(--text-muted)',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <span style={{
              width: '20px', height: '20px', borderRadius: '50%',
              border: '1.5px solid currentColor',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', lineHeight: 1, flexShrink: 0,
            }}>
              ?
            </span>
            Not sure which path is right for you? Answer 2 questions →
          </button>
        </div>
      )}

      {open && <GuidedStart onClose={() => setOpen(false)} />}
    </>
  )
}
