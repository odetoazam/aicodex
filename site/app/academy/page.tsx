import Link from 'next/link'
import type { Metadata } from 'next'
import { ACADEMY_TRACKS, ACADEMY_BASE, url } from '@/lib/academy'

export const metadata: Metadata = {
  title: 'Claude Academy + AI Codex — what to use for what',
  description:
    "Anthropic launched Claude Academy on August 20, 2026: 22 free courses, 119 tutorials, and 148 use cases. Here's an honest map of what to take, in what order, for your role — and the operating problems no vendor course will ever cover for you.",
}

const ACCENT = '#4A7BA7'

// What Academy owns vs what we cover. Kept honest — if Academy does it better,
// this page says so and links there.
const SPLIT = [
  {
    topic: 'AI fundamentals — how models work, where they fail',
    academy: 'Best free material available. AI Capabilities and Limitations is 3.5 hours and genuinely good.',
    us: 'We assume you have it. Start there, not here.',
    winner: 'academy' as const,
  },
  {
    topic: 'Using the products — claude.ai, Cowork, Code, Tag, the API',
    academy: 'Official, current, maintained by the people who build it. 22 courses.',
    us: 'We cover new features the week they ship, before a course exists.',
    winner: 'academy' as const,
  },
  {
    topic: 'Task recipes by role — sales, finance, legal, HR, marketing',
    academy: '148 use cases. Well-produced, and free.',
    us: 'Overlapping, and we will keep pruning ours where theirs is better.',
    winner: 'academy' as const,
  },
  {
    topic: 'Choosing between vendors',
    academy: 'Structurally cannot. Every course assumes the answer is Claude.',
    us: 'Side-by-side comparisons, and the cases where the answer is not Claude.',
    winner: 'us' as const,
  },
  {
    topic: 'What breaks in production',
    academy: 'Courses teach the path that works. That is the correct thing for a course to do.',
    us: 'Failure modes, dead skill libraries, adoption plateaus, silent tool errors.',
    winner: 'us' as const,
  },
  {
    topic: 'The organisation around the deployment',
    academy: 'Not covered. Budget, procurement, and internal politics are outside the remit.',
    us: 'Business cases, security sign-off, skeptical stakeholders, renewal season.',
    winner: 'us' as const,
  },
  {
    topic: 'Model deprecations and migrations',
    academy: 'Anthropic announces retirements. They do not teach you how to survive one.',
    us: 'Migration guides and what to do when a model you depend on disappears.',
    winner: 'us' as const,
  },
  {
    topic: 'The industry record',
    academy: 'Anthropic news only.',
    us: 'A dated timeline of what every major lab shipped, going back to 2022.',
    winner: 'us' as const,
  },
  {
    topic: 'The career itself',
    academy: 'Certifications exist. Job-market guidance does not.',
    us: 'What Forward Deployed Engineers and AI Agent Managers actually get hired for.',
    winner: 'us' as const,
  },
]

const CATALOG_STATS = [
  { n: '22', label: 'courses' },
  { n: '119', label: 'tutorials' },
  { n: '148', label: 'use cases' },
  { n: '$0', label: 'to enrol' },
]

export default function AcademyPage() {
  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>

      {/* ── Header ─────────────────────────────────────── */}
      <div style={{ maxWidth: '760px', marginBottom: '56px' }}>
        <p className="eyebrow" style={{ marginBottom: '20px' }}>Claude Academy</p>

        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'var(--text-3xl)', fontWeight: 600,
          color: 'var(--text-primary)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '28px',
        }}>
          Anthropic teaches the product.<br />
          <em style={{ fontStyle: 'italic', color: ACCENT }}>We cover the job.</em>
        </h1>

        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)',
          color: 'var(--text-secondary)', lineHeight: 1.75,
          display: 'flex', flexDirection: 'column', gap: '20px',
        }}>
          <p>
            On August 20, 2026, Anthropic launched{' '}
            <a href={ACADEMY_BASE} target="_blank" rel="noopener noreferrer" style={{ color: ACCENT }}>
              Claude Academy
            </a>{' '}
            — 355 free resources: 22 courses, 119 tutorials, 148 role use cases, plus live webinars,
            badges, and a completion record.
            It is the best product training any AI company has published, and if you use Claude
            for work you should go take it.
          </p>
          <p>
            That raises a fair question about a site like this one. Here is the honest answer:
            a vendor course can teach you a product. It cannot tell you when to use a competitor,
            what breaks at month six, how to get budget approved, or what happens to your job when
            the model you built on gets retired. Those are the problems that actually consume an
            AI deployment, and no one is incentivised to write them down except someone doing it.
          </p>
          <p style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
            So: take the courses. Then come back for the parts that follow.
          </p>
        </div>
      </div>

      {/* ── Catalog stats ──────────────────────────────── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1px',
        background: 'var(--border-base)', border: '1px solid var(--border-base)',
        borderRadius: '12px', overflow: 'hidden', marginBottom: '72px',
      }}>
        {CATALOG_STATS.map(s => (
          <div key={s.label} style={{ background: 'var(--bg-surface)', padding: '24px 20px' }}>
            <p style={{
              fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 600,
              color: 'var(--text-primary)', margin: 0, lineHeight: 1,
            }}>{s.n}</p>
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)',
              margin: '8px 0 0',
            }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── The split ──────────────────────────────────── */}
      <section style={{ marginBottom: '80px' }}>
        <h2 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', fontWeight: 600,
          color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '-0.01em',
        }}>
          Where to go for what
        </h2>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-secondary)',
          lineHeight: 1.7, maxWidth: '68ch', marginBottom: '32px',
        }}>
          The first three rows are theirs, and it is not close. Product training is Anthropic&rsquo;s
          job and they are better resourced at it than we will ever be. The other six are the
          ones a vendor cannot write, for reasons that have nothing to do with effort.
        </p>

        <div style={{ border: '1px solid var(--border-base)', borderRadius: '12px', overflow: 'hidden' }}>
          {SPLIT.map((row, i) => (
            <div key={row.topic} style={{
              display: 'grid', gridTemplateColumns: 'minmax(180px, 1.1fr) 1fr 1fr',
              borderTop: i === 0 ? 'none' : '1px solid var(--border-base)',
              background: 'var(--bg-surface)',
            }} className="academy-split-row">
              <div style={{ padding: '20px', borderRight: '1px solid var(--border-base)' }}>
                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600,
                  color: 'var(--text-primary)', margin: 0, lineHeight: 1.45,
                }}>{row.topic}</p>
              </div>
              <div style={{
                padding: '20px', borderRight: '1px solid var(--border-base)',
                background: row.winner === 'academy' ? 'var(--bg-subtle)' : 'transparent',
              }}>
                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  color: row.winner === 'academy' ? ACCENT : 'var(--text-muted)', margin: '0 0 8px',
                }}>Claude Academy</p>
                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)',
                  margin: 0, lineHeight: 1.6,
                }}>{row.academy}</p>
              </div>
              <div style={{
                padding: '20px',
                background: row.winner === 'us' ? 'var(--bg-subtle)' : 'transparent',
              }}>
                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  color: row.winner === 'us' ? 'var(--accent)' : 'var(--text-muted)', margin: '0 0 8px',
                }}>AI Codex</p>
                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)',
                  margin: 0, lineHeight: 1.6,
                }}>{row.us}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tracks ─────────────────────────────────────── */}
      <section style={{ marginBottom: '80px' }}>
        <h2 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', fontWeight: 600,
          color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '-0.01em',
        }}>
          Which courses to take, by role
        </h2>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-secondary)',
          lineHeight: 1.7, maxWidth: '68ch', marginBottom: '40px',
        }}>
          355 resources is more than anyone will work through. These are the six that matter
          for each role, in the order we would take them — and what each track leaves out.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {ACADEMY_TRACKS.map(track => (
            <div key={track.id} style={{
              border: '1px solid var(--border-base)', borderRadius: '12px',
              padding: '28px 28px 24px', background: 'var(--bg-surface)',
            }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{
                  fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', fontWeight: 600,
                  color: 'var(--text-primary)', margin: '0 0 8px',
                }}>{track.role}</h3>
                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)',
                  margin: 0, lineHeight: 1.65, maxWidth: '72ch',
                }}>{track.blurb}</p>
              </div>

              <ol style={{ listStyle: 'none', padding: 0, margin: '0 0 20px' }}>
                {track.steps.map((step, i) => (
                  <li key={step.resource.path} style={{
                    display: 'flex', gap: '14px', padding: '12px 0',
                    borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle, var(--border-base))',
                  }}>
                    <span style={{
                      flexShrink: 0, width: '22px', height: '22px', borderRadius: '50%',
                      background: 'var(--bg-subtle)', color: 'var(--text-muted)',
                      fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px',
                    }}>{i + 1}</span>
                    <div style={{ minWidth: 0 }}>
                      <a
                        href={url(step.resource)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600,
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
                      <p style={{
                        fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)',
                        margin: '4px 0 0', lineHeight: 1.6,
                      }}>{step.why}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div style={{
                padding: '16px 18px', borderRadius: '8px',
                background: 'var(--bg-subtle)', border: '1px solid var(--border-base)',
              }}>
                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  color: 'var(--text-muted)', margin: '0 0 8px',
                }}>What the track leaves out</p>
                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)',
                  margin: 0, lineHeight: 1.65,
                }}>{track.gap}</p>
                {track.ourPath && (
                  <Link href={track.ourPath.href} style={{
                    display: 'inline-block', marginTop: '12px',
                    fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500,
                    color: 'var(--accent)', textDecoration: 'none',
                  }}>
                    {track.ourPath.label} →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Further reading ────────────────────────────── */}
      <section>
        <h2 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', fontWeight: 600,
          color: 'var(--text-primary)', marginBottom: '24px', letterSpacing: '-0.01em',
        }}>
          Read next
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {[
            { href: '/articles/claude-academy-guide', title: 'Which Claude Academy courses are worth your time', sub: 'The 355-resource catalog, triaged. What to take, what to skip, and the two courses almost everyone should start with.' },
            { href: '/articles/what-claude-academy-doesnt-teach', title: "What Claude Academy doesn't teach you", sub: 'Nine things a vendor course structurally cannot cover, and where they cost you.' },
            { href: '/articles/claude-certifications-guide', title: 'The four Claude certifications, explained', sub: 'Who can actually sit them, what they test, and whether the credential is worth the prep time.' },
            { href: '/timeline', title: 'The AI timeline', sub: 'Every significant release from Anthropic, OpenAI, Google, Meta, and Microsoft — dated, sourced, going back to 2022.' },
          ].map(c => (
            <Link key={c.href} href={c.href} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '20px', borderRadius: '10px', border: '1px solid var(--border-base)',
                background: 'var(--bg-surface)', height: '100%', boxSizing: 'border-box',
              }}>
                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600,
                  color: 'var(--text-primary)', margin: '0 0 6px', lineHeight: 1.4,
                }}>{c.title}</p>
                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)',
                  margin: 0, lineHeight: 1.6,
                }}>{c.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <style>{`
        @media (max-width: 720px) {
          .academy-split-row { grid-template-columns: 1fr !important; }
          .academy-split-row > div { border-right: none !important; }
        }
      `}</style>
    </div>
  )
}
