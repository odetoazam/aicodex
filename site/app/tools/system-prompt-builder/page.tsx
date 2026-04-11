'use client'

import { useState, useMemo } from 'react'

// ── Data ─────────────────────────────────────────────────────

const USE_CASES = [
  { id: 'customer-support', label: 'Customer support', icon: '◈' },
  { id: 'coding-assistant', label: 'Coding assistant', icon: '⌥' },
  { id: 'document-analysis', label: 'Document analysis', icon: '◇' },
  { id: 'writing-assistant', label: 'Writing assistant', icon: '◐' },
  { id: 'research', label: 'Research & synthesis', icon: '◫' },
  { id: 'data-extraction', label: 'Data extraction', icon: '◬' },
  { id: 'internal-tool', label: 'Internal team tool', icon: '◈' },
  { id: 'sales-assistant', label: 'Sales assistant', icon: '◉' },
]

const TONES = [
  { id: 'professional', label: 'Professional', description: 'Formal, precise, business-appropriate' },
  { id: 'conversational', label: 'Conversational', description: 'Warm, natural, approachable' },
  { id: 'technical', label: 'Technical', description: 'Detailed, accurate, assumes expertise' },
]

const OUTPUT_FORMATS = [
  { id: 'freeform', label: 'Free text', description: 'Natural prose, no enforced structure' },
  { id: 'markdown', label: 'Markdown', description: 'Headers, bullets, code blocks' },
  { id: 'json', label: 'Structured JSON', description: 'Machine-readable, consistent schema' },
  { id: 'bullets', label: 'Bullet list', description: 'Scannable, key points only' },
  { id: 'step-by-step', label: 'Step-by-step', description: 'Numbered instructions or process' },
]

const LENGTH_LIMITS = [
  { id: 'concise', label: 'Concise', description: 'Short, direct answers. 1–2 sentences when possible.' },
  { id: 'balanced', label: 'Balanced', description: 'As long as needed, no longer. Default.' },
  { id: 'thorough', label: 'Thorough', description: 'Comprehensive — cover edge cases, include context.' },
]

const AUDIENCE_TYPES = [
  { id: 'general', label: 'General public', description: 'No assumed expertise' },
  { id: 'business', label: 'Business users', description: 'Professionals, assumes domain knowledge' },
  { id: 'technical', label: 'Technical users', description: 'Engineers, developers, data teams' },
  { id: 'executives', label: 'Executives', description: 'Decision-makers, prefer summaries over detail' },
]

const CONSTRAINTS: { id: string; label: string }[] = [
  { id: 'no-hallucinate', label: 'Never fabricate facts — say "I don\'t know" when uncertain' },
  { id: 'no-opinions', label: 'Avoid opinions or speculation' },
  { id: 'cite-uncertainty', label: 'Flag when confidence is low' },
  { id: 'human-handoff', label: 'Escalate to a human when outside scope' },
  { id: 'no-pii', label: 'Do not retain, repeat, or log personal information' },
  { id: 'stay-in-scope', label: 'Decline off-topic requests politely' },
  { id: 'no-markdown', label: 'Plain text only — no markdown formatting' },
  { id: 'short-responses', label: 'Keep responses under 200 words' },
]

// ── Prompt generator ─────────────────────────────────────────

function buildPrompt(state: State): string {
  const useCase = USE_CASES.find(u => u.id === state.useCaseId)
  const tone = TONES.find(t => t.id === state.toneId)
  const outputFormat = OUTPUT_FORMATS.find(o => o.id === state.outputFormatId)
  const length = LENGTH_LIMITS.find(l => l.id === state.lengthId)
  const audience = AUDIENCE_TYPES.find(a => a.id === state.audienceId)

  const lines: string[] = []

  // Role line
  const roleMap: Record<string, string> = {
    'customer-support': 'You are a helpful customer support assistant.',
    'coding-assistant': 'You are an expert coding assistant.',
    'document-analysis': 'You are a precise document analysis assistant.',
    'writing-assistant': 'You are a skilled writing assistant.',
    'research': 'You are a thorough research and synthesis assistant.',
    'data-extraction': 'You are a structured data extraction assistant.',
    'internal-tool': 'You are an internal assistant for team use.',
    'sales-assistant': 'You are a knowledgeable sales assistant.',
  }
  lines.push(roleMap[state.useCaseId] || 'You are a helpful AI assistant.')

  // Company/product context
  if (state.companyContext.trim()) {
    lines.push('')
    lines.push(`Context: ${state.companyContext.trim()}`)
  }

  // Tone
  if (tone) {
    const toneMap: Record<string, string> = {
      professional: 'Maintain a professional, formal tone throughout all responses.',
      conversational: 'Use a warm, conversational tone — natural and approachable, not robotic.',
      technical: 'Use precise technical language. You can assume domain expertise in your audience.',
    }
    lines.push('')
    lines.push(toneMap[state.toneId])
  }

  // Audience
  if (audience) {
    const audienceMap: Record<string, string> = {
      general: 'Your users are members of the general public with no assumed domain expertise. Define jargon. Avoid acronyms without explanation.',
      business: 'Your users are business professionals. Assume familiarity with standard business concepts.',
      technical: 'Your users are engineers and technical practitioners. You can use technical terminology freely.',
      executives: 'Your users are senior executives and decision-makers. Lead with the key point. Keep context tight. Avoid unnecessary detail.',
    }
    lines.push('')
    lines.push(audienceMap[state.audienceId])
  }

  // Output format
  if (outputFormat) {
    lines.push('')
    const formatMap: Record<string, string> = {
      freeform: 'Write in natural prose. No enforced structure.',
      markdown: 'Format responses using Markdown — use headers, bullet points, and code blocks where appropriate.',
      json: 'Always respond with valid JSON. Use consistent key names. Never include commentary outside the JSON object.',
      bullets: 'Respond using bullet points. One key point per bullet. Keep each point to one sentence.',
      'step-by-step': 'Structure responses as numbered steps. Each step should be a single, clear action.',
    }
    lines.push(formatMap[state.outputFormatId])
  }

  // Length
  if (length) {
    lines.push('')
    const lengthMap: Record<string, string> = {
      concise: 'Be concise. Prefer short, direct answers. Only elaborate when the complexity of the question demands it.',
      balanced: 'Be as thorough as necessary — no more, no less. Do not pad responses.',
      thorough: 'Be comprehensive. Cover relevant edge cases, assumptions, and caveats. Completeness is valued over brevity.',
    }
    lines.push(lengthMap[state.lengthId])
  }

  // Constraints
  if (state.constraintIds.length > 0) {
    lines.push('')
    lines.push('Important rules:')
    const constraintTexts: Record<string, string> = {
      'no-hallucinate': '- Never fabricate facts, statistics, or citations. If you do not know something, say so clearly.',
      'no-opinions': '- Do not offer opinions, speculation, or personal recommendations.',
      'cite-uncertainty': '- When your confidence is low, explicitly flag it: "I\'m not certain, but..."',
      'human-handoff': '- If a request falls outside your scope or requires judgment beyond your capability, say so and recommend the user contact a human.',
      'no-pii': '- Do not repeat, store, or reference personal information from the conversation beyond what is necessary to answer the immediate question.',
      'stay-in-scope': '- If a user asks about topics outside your purpose, politely decline and redirect.',
      'no-markdown': '- Do not use Markdown formatting. Respond in plain text only.',
      'short-responses': '- Keep every response under 200 words.',
    }
    state.constraintIds.forEach(id => {
      if (constraintTexts[id]) lines.push(constraintTexts[id])
    })
  }

  // Custom instruction
  if (state.customInstruction.trim()) {
    lines.push('')
    lines.push(state.customInstruction.trim())
  }

  return lines.join('\n')
}

// ── State type ───────────────────────────────────────────────

interface State {
  useCaseId: string
  toneId: string
  outputFormatId: string
  lengthId: string
  audienceId: string
  constraintIds: string[]
  companyContext: string
  customInstruction: string
}

// ── Component ────────────────────────────────────────────────

export default function SystemPromptBuilderPage() {
  const [state, setState] = useState<State>({
    useCaseId: 'customer-support',
    toneId: 'professional',
    outputFormatId: 'freeform',
    lengthId: 'balanced',
    audienceId: 'general',
    constraintIds: ['no-hallucinate', 'human-handoff'],
    companyContext: '',
    customInstruction: '',
  })
  const [copied, setCopied] = useState(false)

  const prompt = useMemo(() => buildPrompt(state), [state])

  function toggleConstraint(id: string) {
    setState(s => ({
      ...s,
      constraintIds: s.constraintIds.includes(id)
        ? s.constraintIds.filter(c => c !== id)
        : [...s.constraintIds, id],
    }))
  }

  function copyPrompt() {
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sectionLabel = {
    fontFamily: 'var(--font-sans)',
    fontSize: '13px',
    fontWeight: 600 as const,
    color: 'var(--text-secondary)',
    marginBottom: '10px',
    display: 'block',
  }

  const pillBase = {
    cursor: 'pointer',
    border: '1px solid var(--border-base)',
    borderRadius: '6px',
    padding: '8px 14px',
    fontFamily: 'var(--font-sans)',
    fontSize: '13px',
    transition: 'border-color 150ms ease, background 150ms ease',
    background: 'var(--bg-subtle)',
    color: 'var(--text-secondary)',
  }

  const pillActive = {
    ...pillBase,
    border: '1px solid var(--accent)',
    background: 'rgba(212,132,90,0.08)',
    color: 'var(--accent)',
    fontWeight: 600 as const,
  }

  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>

      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <p className="eyebrow" style={{ marginBottom: '16px' }}>Tools</p>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          marginBottom: '16px',
          maxWidth: '22ch',
        }}>
          System Prompt Builder
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-base)',
          color: 'var(--text-muted)',
          maxWidth: '52ch',
          lineHeight: 1.65,
        }}>
          Answer a few questions about your use case and get a production-ready system prompt — structured, specific, and ready to paste into your app.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }} className="builder-grid">

        {/* ── Left: configuration ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

          {/* Use case */}
          <div>
            <span style={sectionLabel}>What is Claude doing?</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {USE_CASES.map(u => (
                <button
                  key={u.id}
                  onClick={() => setState(s => ({ ...s, useCaseId: u.id }))}
                  style={state.useCaseId === u.id ? pillActive : pillBase}
                >
                  {u.icon} {u.label}
                </button>
              ))}
            </div>
          </div>

          {/* Company context */}
          <div>
            <span style={sectionLabel}>Company / product context <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span></span>
            <textarea
              rows={2}
              placeholder="e.g. We're a B2B SaaS company that sells project management software to construction teams."
              value={state.companyContext}
              onChange={e => setState(s => ({ ...s, companyContext: e.target.value }))}
              style={{
                width: '100%',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-base)',
                borderRadius: '8px',
                padding: '10px 14px',
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                color: 'var(--text-primary)',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
                lineHeight: 1.5,
              }}
            />
          </div>

          {/* Tone */}
          <div>
            <span style={sectionLabel}>Tone</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {TONES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setState(s => ({ ...s, toneId: t.id }))}
                  style={{
                    textAlign: 'left',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${state.toneId === t.id ? 'var(--accent)' : 'var(--border-base)'}`,
                    background: state.toneId === t.id ? 'rgba(212,132,90,0.08)' : 'var(--bg-subtle)',
                    cursor: 'pointer',
                    transition: 'border-color 150ms ease, background 150ms ease',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: state.toneId === t.id ? 'var(--accent)' : 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>
                    {t.label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {t.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Output format */}
          <div>
            <span style={sectionLabel}>Output format</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {OUTPUT_FORMATS.map(o => (
                <button
                  key={o.id}
                  onClick={() => setState(s => ({ ...s, outputFormatId: o.id }))}
                  style={{
                    textAlign: 'left',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${state.outputFormatId === o.id ? 'var(--accent)' : 'var(--border-base)'}`,
                    background: state.outputFormatId === o.id ? 'rgba(212,132,90,0.08)' : 'var(--bg-subtle)',
                    cursor: 'pointer',
                    transition: 'border-color 150ms ease, background 150ms ease',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: state.outputFormatId === o.id ? 600 : 400, color: state.outputFormatId === o.id ? 'var(--accent)' : 'var(--text-primary)' }}>
                    {o.label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {o.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Length */}
          <div>
            <span style={sectionLabel}>Response length</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {LENGTH_LIMITS.map(l => (
                <button
                  key={l.id}
                  onClick={() => setState(s => ({ ...s, lengthId: l.id }))}
                  style={{
                    textAlign: 'center',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${state.lengthId === l.id ? 'var(--accent)' : 'var(--border-base)'}`,
                    background: state.lengthId === l.id ? 'rgba(212,132,90,0.08)' : 'var(--bg-subtle)',
                    cursor: 'pointer',
                    transition: 'border-color 150ms ease, background 150ms ease',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: state.lengthId === l.id ? 600 : 400, color: state.lengthId === l.id ? 'var(--accent)' : 'var(--text-primary)', display: 'block', marginBottom: '3px' }}>
                    {l.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Audience */}
          <div>
            <span style={sectionLabel}>Who are your users?</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {AUDIENCE_TYPES.map(a => (
                <button
                  key={a.id}
                  onClick={() => setState(s => ({ ...s, audienceId: a.id }))}
                  style={{
                    textAlign: 'left',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${state.audienceId === a.id ? 'var(--accent)' : 'var(--border-base)'}`,
                    background: state.audienceId === a.id ? 'rgba(212,132,90,0.08)' : 'var(--bg-subtle)',
                    cursor: 'pointer',
                    transition: 'border-color 150ms ease, background 150ms ease',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: state.audienceId === a.id ? 600 : 400, color: state.audienceId === a.id ? 'var(--accent)' : 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>
                    {a.label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    {a.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Constraints */}
          <div>
            <span style={sectionLabel}>Safety &amp; constraints <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(select all that apply)</span></span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {CONSTRAINTS.map(c => (
                <label
                  key={c.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${state.constraintIds.includes(c.id) ? 'var(--accent)' : 'var(--border-muted)'}`,
                    background: state.constraintIds.includes(c.id) ? 'rgba(212,132,90,0.06)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'border-color 150ms ease, background 150ms ease',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={state.constraintIds.includes(c.id)}
                    onChange={() => toggleConstraint(c.id)}
                    style={{ accentColor: 'var(--accent)', width: '14px', height: '14px', flexShrink: 0 }}
                  />
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {c.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom instruction */}
          <div>
            <span style={sectionLabel}>Custom instruction <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span></span>
            <textarea
              rows={3}
              placeholder="Add anything specific to your use case that isn't covered above..."
              value={state.customInstruction}
              onChange={e => setState(s => ({ ...s, customInstruction: e.target.value }))}
              style={{
                width: '100%',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-base)',
                borderRadius: '8px',
                padding: '10px 14px',
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                color: 'var(--text-primary)',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
                lineHeight: 1.5,
              }}
            />
          </div>
        </div>

        {/* ── Right: output ── */}
        <div style={{ position: 'sticky', top: '80px' }}>
          <div style={{
            borderRadius: '12px',
            border: '1px solid var(--border-base)',
            background: 'var(--bg-surface)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '14px 20px',
              borderBottom: '1px solid var(--border-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-subtle)',
            }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['#FF5F57', '#FEBC2E', '#28C840'].map(c => (
                  <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
                ))}
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>system_prompt.txt</span>
              <button
                onClick={copyPrompt}
                style={{
                  background: copied ? 'rgba(76,175,125,0.15)' : 'var(--bg-surface)',
                  border: `1px solid ${copied ? 'rgba(76,175,125,0.4)' : 'var(--border-base)'}`,
                  borderRadius: '5px',
                  padding: '4px 10px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '12px',
                  color: copied ? '#4CAF7D' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  fontWeight: copied ? 600 : 400,
                }}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>

            <pre style={{
              margin: 0,
              padding: '20px',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              maxHeight: '560px',
              overflowY: 'auto',
            }}>
              {prompt}
            </pre>
          </div>

          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px', lineHeight: 1.5 }}>
            This is a starting point. Refine it with your actual production context and test with real inputs. Read the{' '}
            <a href="/articles/writing-system-prompts-that-work" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
              system prompt guide
            </a> for more depth.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .builder-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
