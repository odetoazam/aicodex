'use client'

import { useState } from 'react'

type Props = {
  variant?: 'inline' | 'section'
}

export default function NewsletterCTA({ variant = 'section' }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    // Wire to Beehiiv or your newsletter provider
    await new Promise(r => setTimeout(r, 800))
    setStatus('success')
  }

  if (variant === 'inline') {
    return (
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          gap: '8px',
          maxWidth: '420px',
        }}
      >
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={status === 'success'}
          style={{
            flex: 1,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-base)',
            borderRadius: '6px',
            padding: '10px 14px',
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            color: 'var(--text-primary)',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          style={{
            background: status === 'success' ? 'var(--bg-subtle)' : 'var(--accent)',
            color: status === 'success' ? 'var(--text-muted)' : 'var(--text-inverse)',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            transition: 'background var(--duration-fast) ease',
          }}
        >
          {status === 'success' ? '✓ Subscribed' : status === 'loading' ? '...' : 'Subscribe'}
        </button>
      </form>
    )
  }

  return (
    <section
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-base)',
        borderRadius: '12px',
        padding: 'clamp(32px, 5vw, 56px)',
        textAlign: 'center',
      }}
    >
      <p className="eyebrow" style={{ marginBottom: '16px' }}>Newsletter</p>
      <h2
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'var(--text-2xl)',
          color: 'var(--text-primary)',
          marginBottom: '12px',
        }}
      >
        From the field, weekly.
      </h2>
      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-base)',
          color: 'var(--text-muted)',
          maxWidth: '440px',
          margin: '0 auto 32px',
          lineHeight: 1.6,
        }}
      >
        New glossary terms, cross-entity articles, and operator dispatches — what it actually looks like to build with AI inside a real company.
      </p>

      {status === 'success' ? (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '8px',
            background: 'rgba(76,175,125,0.12)',
            color: '#4CAF7D',
            fontFamily: 'var(--font-sans)',
            fontSize: '15px',
            fontWeight: 500,
          }}
        >
          ✓ You&rsquo;re in
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            gap: '8px',
            maxWidth: '400px',
            margin: '0 auto',
          }}
        >
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              flex: 1,
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-base)',
              borderRadius: '8px',
              padding: '12px 16px',
              fontFamily: 'var(--font-sans)',
              fontSize: '15px',
              color: 'var(--text-primary)',
              outline: 'none',
            }}
            onFocus={e => { e.target.style.borderColor = 'rgba(212,132,90,0.5)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--border-base)' }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              background: 'var(--accent)',
              color: 'var(--text-inverse)',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontFamily: 'var(--font-sans)',
              fontSize: '15px',
              fontWeight: 500,
              transition: 'background var(--duration-fast) ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent-hover)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent)' }}
          >
            {status === 'loading' ? '...' : 'Subscribe'}
          </button>
        </form>
      )}

      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '12px',
          color: 'var(--text-muted)',
          marginTop: '16px',
        }}
      >
        No spam. Unsubscribe anytime.
      </p>
    </section>
  )
}
