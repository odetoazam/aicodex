import Link from 'next/link'
import AcademyTrackCallout from '@/components/AcademyTrackCallout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Becoming a Forward Deployed Engineer — AI Codex',
  description: 'The free path to a Forward Deployed Engineer career: what the role is, why every AI company is hiring for it, how to make the jump, the portfolio that signals readiness, and the technical playbook FDEs actually build on the job.',
}

const ACCENT = '#6E78D6'
const ACCENT_BG = 'rgba(110,120,214,0.1)'

const STEPS = [
  {
    number: 1,
    articleSlug: 'what-is-a-forward-deployed-engineer',
    label: 'The role: part engineer, part operator, part account owner',
    takeaway: 'What an FDE actually does — embedded inside a customer’s org to make an AI product work in a real business, not just demo it. Why the role exists, what separates it from a solutions engineer or consultant, and the compensation that comes with it ($205K–$486K, staff clearing $630K+).',
    time: '11 min',
  },
  {
    number: 2,
    articleSlug: 'why-anthropic-openai-copied-palantir',
    label: 'Why every AI lab copied Palantir in the same week',
    takeaway: 'Anthropic ($1.5B) and OpenAI ($10B) both launched deployment ventures within days of each other. The template is Palantir’s FDE model. Understanding why the labs are betting on this go-to-market tells you the role is structural, not a trend — and where the hiring is heading.',
    time: '8 min',
  },
  {
    number: 3,
    articleSlug: 'how-to-become-forward-deployed-engineer',
    label: 'The actual path from where you are now',
    takeaway: 'The honest route from SWE, data, or consulting into an FDE seat. What transfers, what you have to build, the 60–120 day prep timeline, and the Palantir-style case interview that 60% of candidates fail. Written for someone who isn’t already at an AI company.',
    time: '10 min',
  },
  {
    number: 4,
    articleSlug: 'fde-portfolio-projects',
    label: 'The 5 portfolio projects that signal readiness',
    takeaway: 'Interviews want proof you can build against a client’s messy data and ambiguous problem. These five projects show exactly that — what to build, what to include, and what NOT to do. The differentiator most candidates miss.',
    time: '9 min',
  },
  {
    number: 5,
    articleSlug: 'internal-mcp-server-explained',
    label: 'The core deliverable: one routing layer for all the data',
    takeaway: 'An MCP server is named explicitly in the Anthropic FDE job listing. This is the thing you build on day one at a client: a single interface that connects Claude to their CRM, billing, support, and comms — with shaped responses and access control baked in.',
    time: '9 min',
  },
  {
    number: 6,
    articleSlug: 'mcp-production-agents',
    label: 'Connecting agents to real production systems',
    takeaway: 'Moving from a notebook demo to an agent that touches a client’s live systems. The patterns for safe writes, auth, and the failure handling that separates a pilot from something that survives contact with production.',
    time: '9 min',
  },
  {
    number: 7,
    articleSlug: 'ai-agent-access-control',
    label: 'Access control: the enterprise non-negotiable',
    takeaway: 'When you wire AI into a client’s data, "everyone gets everything" gets you fired. Tool-level permissions enforced in middleware — not by the model — are the only reliable solution, and the thing every enterprise security review will probe. How to build it right.',
    time: '9 min',
  },
  {
    number: 8,
    articleSlug: 'internal-ai-stack-architecture',
    label: 'The full deliverable, end to end',
    takeaway: 'What the system you hand off actually looks like: the five-layer stack, the target metrics, and what separates a deployment that lasts after you leave from one that quietly dies in month three. The architecture an FDE is ultimately accountable for.',
    time: '11 min',
  },
  {
    number: 9,
    articleSlug: 'fde-scoping-an-engagement',
    label: 'Scoping: the first week decides the next three months',
    takeaway: 'Every engagement that goes wrong was scoped wrong in week one. The five-day discovery structure, the three queries to run on day one, how to get a measurable definition of "working" out of the person who controls the budget, and the sizing multiplier that is actually real.',
    time: '12 min',
  },
  {
    number: 10,
    articleSlug: 'fde-when-client-data-is-bad',
    label: 'When the data is worse than they said',
    takeaway: 'Not an edge case — the default. Six checks that turn "the data is messy" into numbers you can act on, the framing that delivers the bad news without detonating the engagement, and what you can still ship when a third of a critical field is null.',
    time: '12 min',
  },
  {
    number: 11,
    articleSlug: 'fde-handoff-that-survives',
    label: 'The handoff that survives your departure',
    takeaway: 'The measure of the work is what still runs in month six, after a model deprecation, a schema change, and the departure of the one person who understood it. The four things that actually kill delivered systems, and the symptom-first runbook that prevents three of them.',
    time: '12 min',
  },
]

export default function LearnFDEPage() {
  const totalTime = STEPS.reduce((sum, s) => sum + parseInt(s.time), 0)

  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)' }}>
        <Link href="/learn" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Learn</Link>
        <span>›</span>
        <span style={{ color: 'var(--text-secondary)' }}>Becoming a Forward Deployed Engineer</span>
      </nav>

      {/* Header */}
      <div style={{ marginBottom: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <span style={{
            padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600,
            fontFamily: 'var(--font-sans)', letterSpacing: '0.04em',
            background: ACCENT_BG, color: ACCENT,
          }}>
            for aspiring &amp; working FDEs
          </span>
          <span style={{
            padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 500,
            background: 'var(--bg-subtle)', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)',
          }}>
            {STEPS.length} guides · ~{totalTime} min
          </span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(22px, 3vw, 30px)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          marginBottom: '16px',
        }}>
          Becoming a Forward Deployed Engineer
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)',
          color: 'var(--text-muted)', maxWidth: '56ch', lineHeight: 1.65,
        }}>
          FDE job postings grew more than 800% in a year, and the comp is the highest in applied AI — but
          almost every guide stops at the job description. This path goes further: the role and the market,
          the honest route in, the portfolio that gets you past the screen, and then the technical playbook of
          what FDEs actually build once they&apos;re embedded. The career blogs can&apos;t teach the last four steps. We can.
        </p>
      </div>

      {/* Steps */}
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', left: '19px', top: '40px', bottom: '40px',
          width: '1px', background: 'var(--border-base)',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {STEPS.map((step, i) => (
            <div key={step.number} style={{ paddingLeft: '52px', paddingBottom: i === STEPS.length - 1 ? '0' : '4px' }}>
              <Link href={`/articles/${step.articleSlug}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div
                  style={{
                    position: 'relative', padding: '20px 24px', borderRadius: '8px',
                    border: '1px solid var(--border-base)', background: 'var(--bg-surface)',
                    borderLeft: `3px solid ${ACCENT}40`,
                    transition: 'border-left-color 150ms ease, background 150ms ease',
                  }}
                  className="fde-step-card"
                >
                  <div style={{
                    position: 'absolute', left: '-34px', top: '20px',
                    width: '28px', height: '28px', borderRadius: '4px',
                    background: 'var(--bg-base)', border: '1px solid var(--border-base)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)',
                  }}>
                    {String(step.number).padStart(2, '0')}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600,
                        color: 'var(--text-primary)', margin: '0 0 6px', lineHeight: 1.3,
                      }}>
                        {step.label}
                      </p>
                      <p style={{
                        fontFamily: 'var(--font-sans)', fontSize: '13px',
                        color: 'var(--text-muted)', margin: 0, lineHeight: 1.6,
                      }}>
                        {step.takeaway}
                      </p>
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)',
                      flexShrink: 0, paddingTop: '2px',
                    }}>
                      {step.time}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .fde-step-card:hover {
          background: var(--bg-subtle) !important;
          border-left-color: ${ACCENT} !important;
        }
      `}</style>
      <AcademyTrackCallout trackId="fde" />

    </div>
  )
}
