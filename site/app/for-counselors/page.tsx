import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'For career counselors & CS departments — AI Codex',
  description: 'A free, shareable resource for career advisors, CS departments, and bootcamp instructors. The two fastest-growing roles in enterprise AI — Forward Deployed Engineer and AI Agent Manager — explained, with structured paths you can send your students.',
}

const FDE_ACCENT = '#6E78D6'
const AGM_ACCENT = '#C28A3E'

const ROLES = [
  {
    accent: FDE_ACCENT,
    accentBg: 'rgba(110,120,214,0.1)',
    eyebrow: 'External · hired by AI companies',
    title: 'Forward Deployed Engineer',
    comp: '$205K–$486K · staff $630K+',
    who: 'For technically strong students — CS grads, junior–mid software engineers. Hired by Anthropic, OpenAI, Palantir, EY, and Accenture to embed inside client companies and make AI actually work in production.',
    signal: 'Postings up 800% in a year. The Palantir-style case interview is now the standard screen.',
    pathHref: '/learn/forward-deployed-engineer',
    pathLabel: 'The FDE path — 8 guides',
  },
  {
    accent: AGM_ACCENT,
    accentBg: 'rgba(194,138,62,0.12)',
    eyebrow: 'Internal · hired by the company itself',
    title: 'AI Agent Manager',
    comp: '$95K–$200K+ · internal salary bands',
    who: 'For students with domain or operations strength more than deep coding — business, IT, ops, analytics backgrounds. The employee who owns a company’s AI agents: mapping workflows, wiring systems, evals, adoption, ROI.',
    signal: 'Aaron Levie predicts 500K–1M of these jobs. HBR formalized the title in early 2026. Domain expertise matters more than AI expertise.',
    pathHref: '/learn/agent-manager',
    pathLabel: 'The AI Agent Manager path — 8 guides',
  },
]

export default function ForCounselorsPage() {
  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>

      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <p className="eyebrow" style={{ marginBottom: '16px' }}>For Career Counselors &amp; CS Departments</p>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'var(--text-3xl)', fontWeight: 600,
          color: 'var(--text-primary)', lineHeight: 1.12, letterSpacing: '-0.02em',
          marginBottom: '18px', maxWidth: '20ch',
        }}>
          Two of the best jobs in tech, and almost no free guidance
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: 'var(--text-lg)', color: 'var(--text-muted)',
          maxWidth: '60ch', lineHeight: 1.65,
        }}>
          Two roles are absorbing a huge share of enterprise-AI hiring right now — and the existing
          career resources stop at the job description or sit behind $10K bootcamp paywalls. This page
          is built to be forwarded. Everything below is free, requires no signup, and is structured as a
          path a student can actually follow.
        </p>
      </div>

      {/* The two roles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '56px' }}>
        {ROLES.map((role) => (
          <div
            key={role.title}
            style={{
              padding: '28px 32px', borderRadius: '12px',
              border: '1px solid var(--border-base)',
              borderLeft: `3px solid ${role.accent}`,
              background: 'var(--bg-surface)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' as const }}>
              <span style={{
                padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600,
                fontFamily: 'var(--font-sans)', letterSpacing: '0.04em',
                background: role.accentBg, color: role.accent,
              }}>
                {role.eyebrow}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                {role.comp}
              </span>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', fontWeight: 600,
              color: 'var(--text-primary)', marginBottom: '10px', lineHeight: 1.2,
            }}>
              {role.title}
            </h2>
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-secondary)',
              lineHeight: 1.6, margin: '0 0 10px', maxWidth: '64ch',
            }}>
              {role.who}
            </p>
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)',
              lineHeight: 1.6, margin: '0 0 18px', maxWidth: '64ch',
            }}>
              {role.signal}
            </p>
            <Link href={role.pathHref} style={{
              fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600,
              color: role.accent, textDecoration: 'none',
            }}>
              {role.pathLabel} →
            </Link>
          </div>
        ))}
      </div>

      {/* Which to point a student toward */}
      <div style={{ marginBottom: '56px' }}>
        <h2 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', fontWeight: 600,
          color: 'var(--text-primary)', marginBottom: '16px',
        }}>
          Which one fits the student in front of you?
        </h2>
        <ul style={{
          fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-secondary)',
          lineHeight: 1.7, margin: 0, paddingLeft: '20px', maxWidth: '64ch',
        }}>
          <li><strong>Strong coder, wants the highest ceiling, comfortable with ambiguity and client-facing work</strong> → Forward Deployed Engineer.</li>
          <li><strong>Understands a business function deeply, organized, not necessarily a developer</strong> → AI Agent Manager. Domain expertise is the scarce asset here.</li>
          <li><strong>Already employed and quietly doing this work under an old title (IT, ops)</strong> → AI Agent Manager. The path doubles as evidence for a title and pay conversation.</li>
          <li><strong>Confused by the title soup (Agent Operator? AI Ops Manager?)</strong> → send them the <Link href="/articles/ai-agent-manager-vs-agent-operator" style={{ color: AGM_ACCENT, textDecoration: 'none', fontWeight: 600 }}>title disambiguation guide</Link> first.</li>
        </ul>
      </div>

      {/* Deeper guide for advisors */}
      <div style={{
        padding: '24px 28px', borderRadius: '12px',
        border: '1px solid var(--border-muted)', background: 'var(--bg-subtle)',
        marginBottom: '56px',
      }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 6px', letterSpacing: '0.04em', textTransform: 'uppercase' as const, fontWeight: 600 }}>
          For you, the advisor
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 12px', maxWidth: '64ch' }}>
          A longer briefing on how to advise students toward these roles — what the hiring bar actually is, what
          a portfolio needs to show, and the questions students should be asking.
        </p>
        <Link href="/articles/fde-for-career-counselors" style={{
          fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600,
          color: 'var(--text-primary)', textDecoration: 'underline',
        }}>
          Read the advisor&apos;s guide →
        </Link>
      </div>

      {/* Copy-paste block */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'var(--text-lg)', fontWeight: 600,
          color: 'var(--text-primary)', marginBottom: '12px',
        }}>
          Ready to send to a student
        </h2>
        <div style={{
          padding: '20px 24px', borderRadius: '10px',
          border: '1px dashed var(--border-base)', background: 'var(--bg-surface)',
          fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)',
          lineHeight: 1.7, whiteSpace: 'pre-wrap' as const, maxWidth: '70ch',
        }}>
{`Two of the fastest-growing, best-paid roles in AI right now are the Forward Deployed Engineer (you build AI systems inside client companies) and the AI Agent Manager (you run AI agents inside your own company). Here are two free, structured paths — no signup:

• Forward Deployed Engineer: https://aicodex.to/learn/forward-deployed-engineer
• AI Agent Manager: https://aicodex.to/learn/agent-manager

Not sure which fits you? Start here: https://aicodex.to/articles/ai-agent-manager-vs-agent-operator`}
        </div>
      </div>

      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
        Everything on AI Codex is free and open. Share it freely with your students and colleagues.
      </p>

    </div>
  )
}
