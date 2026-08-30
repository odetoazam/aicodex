import Link from 'next/link'

export const metadata = {
  title: 'Page not found — AI Codex',
}

const linkStyle = {
  color: 'var(--accent)',
  fontFamily: 'var(--font-sans)',
  fontSize: '15px',
  textDecoration: 'none',
}

export default function NotFound() {
  return (
    <div
      style={{
        width: 'var(--container)',
        margin: '0 auto',
        padding: 'clamp(64px, 10vw, 120px) 0',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'var(--text-2xl)',
          color: 'var(--text-primary)',
          marginBottom: '12px',
        }}
      >
        Page not found
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '15px',
          color: 'var(--text-secondary)',
          marginBottom: '24px',
        }}
      >
        That page does not exist, or it moved.
      </p>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/articles" style={linkStyle}>
          Browse articles
        </Link>
        <Link href="/glossary" style={linkStyle}>
          Browse the glossary
        </Link>
        <Link href="/" style={linkStyle}>
          Home
        </Link>
      </div>
    </div>
  )
}
