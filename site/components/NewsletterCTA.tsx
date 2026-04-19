'use client'

import { useState } from 'react'

type Props = {
  /**
   * section — full-width block, used on homepage
   * article — compact strip, placed after article content
   * inline  — just the form row, for embedding anywhere
   */
  variant?: 'section' | 'article' | 'inline'
}

export default function NewsletterCTA({ variant = 'section' }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus('error')
        setErrorMsg(data.error ?? 'Something went wrong. Try again.')
      } else {
        setStatus('success')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Try again.')
    }
  }

  const form = (inputSize: '14px' | '15px', buttonLabel: string) => (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', maxWidth: '420px' }}>
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        disabled={status === 'success'}
        required
        style={{
          flex: 1,
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border-base)',
          borderRadius: '7px',
          padding: inputSize === '15px' ? '12px 16px' : '10px 14px',
          fontFamily: 'var(--font-sans)',
          fontSize: inputSize,
          color: 'var(--text-primary)',
          outline: 'none',
        }}
        onFocus={e => { e.target.style.borderColor = 'rgba(212,132,90,0.5)' }}
        onBlur={e => { e.target.style.borderColor = 'var(--border-base)' }}
      />
      <button
        type="submit"
        disabled={status === 'loading' || status === 'success'}
        style={{
          background: status === 'success' ? 'transparent' : 'var(--accent)',
          color: status === 'success' ? '#4CAF7D' : 'var(--text-inverse)',
          border: status === 'success' ? '1px solid rgba(76,175,125,0.4)' : 'none',
          borderRadius: '7px',
          padding: inputSize === '15px' ? '12px 24px' : '10px 20px',
          fontFamily: 'var(--font-sans)',
          fontSize: inputSize,
          fontWeight: 500,
          whiteSpace: 'nowrap' as const,
          cursor: status === 'loading' ? 'wait' : 'pointer',
          transition: 'background 120ms ease',
        }}
      >
        {status === 'success' ? '✓ You\'re in' : status === 'loading' ? '...' : buttonLabel}
      </button>
    </form>
  )

  if (variant === 'inline') {
    return form('14px', 'Subscribe')
  }

  if (variant === 'article') {
    return (
      <div style={{
        marginTop: '56px',
        padding: '28px 32px',
        borderRadius: '10px',
        border: '1px solid var(--border-base)',
        background: 'var(--bg-surface)',
        borderLeft: '3px solid var(--accent)',
      }}>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
          letterSpacing: '0.07em', textTransform: 'uppercase' as const,
          color: 'var(--accent)', margin: '0 0 8px',
        }}>
          Weekly brief
        </p>
        <p style={{
          fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600,
          color: 'var(--text-primary)', lineHeight: 1.3, margin: '0 0 6px',
        }}>
          For people actually using Claude at work.
        </p>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: '14px',
          color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 20px',
        }}>
          Each week: one thing Claude can do in your work that most people haven't figured out yet — plus the failure modes to avoid. No tutorials. No hype.
        </p>
        {status === 'error' && (
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#e05d5d', margin: '0 0 12px' }}>
            {errorMsg}
          </p>
        )}
        {form('14px', 'Send it weekly')}
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: '12px',
          color: 'var(--text-muted)', marginTop: '12px',
        }}>
          No spam. Unsubscribe anytime.
        </p>
      </div>
    )
  }

  // section variant — homepage
  return (
    <section style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-base)',
      borderRadius: '12px',
      padding: 'clamp(32px, 5vw, 56px)',
      textAlign: 'center' as const,
    }}>
      <p style={{
        fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
        letterSpacing: '0.07em', textTransform: 'uppercase' as const,
        color: 'var(--accent)', margin: '0 0 16px',
      }}>
        Weekly brief
      </p>
      <h2 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'var(--text-2xl)',
        color: 'var(--text-primary)',
        lineHeight: 1.2,
        margin: '0 0 12px',
      }}>
        For people actually using Claude at work.
      </h2>
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-base)',
        color: 'var(--text-muted)',
        maxWidth: '440px',
        margin: '0 auto 32px',
        lineHeight: 1.6,
      }}>
        Each week: one thing Claude can do in your work that most people haven't figured out yet — plus the failure modes to avoid. No tutorials. No hype.
      </p>

      {status === 'error' && (
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#e05d5d', marginBottom: '12px' }}>
          {errorMsg}
        </p>
      )}

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {form('15px', 'Send it weekly')}
      </div>

      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '12px',
        color: 'var(--text-muted)',
        marginTop: '16px',
      }}>
        No spam. Unsubscribe anytime.
      </p>
    </section>
  )
}
