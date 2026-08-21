import Link from 'next/link'
import { ACADEMY_TRACKS, url } from '@/lib/academy'

const ACCENT = '#4A7BA7'

/**
 * "Take these first" block for a learning path page.
 *
 * Anthropic's Claude Academy is free and covers the product better than we do.
 * Every path that has a matching Academy track links out to it up front, so a
 * reader arriving here without product training is sent to get it rather than
 * being walked past it.
 *
 * `trackId` matches an id in ACADEMY_TRACKS (lib/academy.ts).
 */
export default function AcademyTrackCallout({ trackId }: { trackId: string }) {
  const track = ACADEMY_TRACKS.find(t => t.id === trackId)
  if (!track) return null

  return (
    <div style={{
      marginTop: '64px',
      border: '1px solid var(--border-base)',
      borderLeft: `3px solid ${ACCENT}`,
      borderRadius: '10px',
      padding: 'clamp(24px, 3.5vw, 32px)',
      background: 'rgba(74,123,167,0.05)',
    }}>
      <p style={{
        fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
        letterSpacing: '0.06em', textTransform: 'uppercase' as const,
        color: ACCENT, margin: '0 0 12px',
      }}>
        Free official training
      </p>

      <h2 style={{
        fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', fontWeight: 600,
        color: 'var(--text-primary)', margin: '0 0 12px', lineHeight: 1.25,
      }}>
        Take these on Claude Academy first
      </h2>

      <p style={{
        fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)',
        lineHeight: 1.7, margin: '0 0 20px', maxWidth: '68ch',
      }}>
        Anthropic&rsquo;s <a href="https://academy.claude.com" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT }}>Claude Academy</a> teaches
        the product for free and does it better than we could. These are the ones that
        matter for this path. This path picks up where they stop.
      </p>

      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px' }}>
        {track.steps.slice(0, 4).map(step => (
          <li key={step.resource.path} style={{ marginBottom: '10px' }}>
            <a
              href={url(step.resource)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500,
                color: ACCENT, textDecoration: 'none',
              }}
            >
              {step.resource.title} ↗
            </a>
            {step.resource.meta && (
              <span style={{
                fontFamily: 'var(--font-sans)', fontSize: '12px',
                color: 'var(--text-muted)', marginLeft: '10px',
              }}>{step.resource.meta}</span>
            )}
          </li>
        ))}
      </ul>

      <p style={{
        fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)',
        lineHeight: 1.65, margin: '0 0 14px', maxWidth: '68ch',
      }}>
        <strong style={{ color: 'var(--text-primary)' }}>What they leave out:</strong> {track.gap}
      </p>

      <Link href="/academy" style={{
        fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500,
        color: 'var(--accent)', textDecoration: 'none',
      }}>
        Full Claude Academy course map →
      </Link>
    </div>
  )
}
