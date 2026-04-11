'use client'

import { useState, useMemo } from 'react'
import type { Metadata } from 'next'

// Claude API pricing (per million tokens) — verify at anthropic.com/pricing
const MODELS = [
  {
    id: 'claude-opus-4',
    name: 'Claude Opus 4',
    description: 'Most capable — complex reasoning, research, advanced coding',
    inputPPM: 15,
    outputPPM: 75,
    cacheWritePPM: 18.75,
    cacheReadPPM: 1.5,
    color: '#7B8FD4',
  },
  {
    id: 'claude-sonnet-4',
    name: 'Claude Sonnet 4',
    description: 'Best balance — production workloads, most common choice',
    inputPPM: 3,
    outputPPM: 15,
    cacheWritePPM: 3.75,
    cacheReadPPM: 0.3,
    color: '#D4845A',
  },
  {
    id: 'claude-haiku-4',
    name: 'Claude Haiku 4',
    description: 'Fastest & cheapest — high-volume, latency-sensitive tasks',
    inputPPM: 0.8,
    outputPPM: 4,
    cacheWritePPM: 1,
    cacheReadPPM: 0.08,
    color: '#4CAF7D',
  },
]

function fmt(n: number): string {
  if (n < 0.01) return `$${n.toFixed(4)}`
  if (n < 1) return `$${n.toFixed(3)}`
  if (n < 1000) return `$${n.toFixed(2)}`
  if (n < 100000) return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  return `$${(n / 1000).toFixed(1)}k`
}

export default function CostCalculatorPage() {
  const [modelId, setModelId] = useState('claude-sonnet-4')
  const [messagesPerDay, setMessagesPerDay] = useState(1000)
  const [avgInputTokens, setAvgInputTokens] = useState(500)
  const [avgOutputTokens, setAvgOutputTokens] = useState(300)
  const [useCaching, setUseCaching] = useState(false)
  const [cachedPercent, setCachedPercent] = useState(60)

  const model = MODELS.find(m => m.id === modelId)!

  const costs = useMemo(() => {
    const messagesPerMonth = messagesPerDay * 30

    let inputCostPerMsg: number
    let outputCostPerMsg: number

    if (useCaching) {
      const cachedTokens = avgInputTokens * (cachedPercent / 100)
      const freshTokens = avgInputTokens * (1 - cachedPercent / 100)
      const cacheWriteCost = (cachedTokens / 1_000_000) * model.cacheWritePPM
      const cacheReadCost = (cachedTokens / 1_000_000) * model.cacheReadPPM
      const freshCost = (freshTokens / 1_000_000) * model.inputPPM
      // First call writes cache, subsequent reads it — approximate as read after 1st call
      inputCostPerMsg = freshCost + cacheReadCost + (cacheWriteCost / messagesPerDay)
    } else {
      inputCostPerMsg = (avgInputTokens / 1_000_000) * model.inputPPM
    }

    outputCostPerMsg = (avgOutputTokens / 1_000_000) * model.outputPPM

    const costPerMsg = inputCostPerMsg + outputCostPerMsg
    const dailyCost = costPerMsg * messagesPerDay
    const monthlyCost = costPerMsg * messagesPerMonth
    const yearlyCost = monthlyCost * 12
    const costPer1k = costPerMsg * 1000

    const baseMonthly = (avgInputTokens / 1_000_000) * model.inputPPM * messagesPerMonth
      + (avgOutputTokens / 1_000_000) * model.outputPPM * messagesPerMonth
    const savings = useCaching ? Math.max(0, baseMonthly - monthlyCost) : 0

    return { costPerMsg, dailyCost, monthlyCost, yearlyCost, costPer1k, savings }
  }, [modelId, messagesPerDay, avgInputTokens, avgOutputTokens, useCaching, cachedPercent, model])

  const inputStyle = {
    width: '100%',
    background: 'var(--bg-subtle)',
    border: '1px solid var(--border-base)',
    borderRadius: '8px',
    padding: '10px 14px',
    fontFamily: 'var(--font-sans)',
    fontSize: '15px',
    color: 'var(--text-primary)',
    outline: 'none',
    boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    fontFamily: 'var(--font-sans)',
    fontSize: '13px',
    fontWeight: 500 as const,
    color: 'var(--text-secondary)',
    display: 'block',
    marginBottom: '6px',
  }

  const hintStyle = {
    fontFamily: 'var(--font-sans)',
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginTop: '4px',
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
          Claude API Cost Calculator
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-base)',
          color: 'var(--text-muted)',
          maxWidth: '52ch',
          lineHeight: 1.65,
        }}>
          Estimate your monthly Claude API spend before you commit. Enter your usage pattern and see daily, monthly, and per-message costs — with and without prompt caching.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }} className="calc-grid">

        {/* ── Inputs ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Model selector */}
          <div>
            <span style={labelStyle}>Model</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {MODELS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setModelId(m.id)}
                  style={{
                    textAlign: 'left',
                    padding: '14px 16px',
                    borderRadius: '8px',
                    border: `1px solid ${modelId === m.id ? m.color : 'var(--border-base)'}`,
                    background: modelId === m.id ? `${m.color}10` : 'var(--bg-subtle)',
                    cursor: 'pointer',
                    transition: 'border-color 150ms ease, background 150ms ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{
                      fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600,
                      color: modelId === m.id ? m.color : 'var(--text-primary)',
                    }}>
                      {m.name}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                      ${m.inputPPM}/${m.outputPPM} per MTok
                    </span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                    {m.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Usage inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Messages / day</label>
              <input
                type="number"
                min={1}
                value={messagesPerDay}
                onChange={e => setMessagesPerDay(Math.max(1, Number(e.target.value)))}
                style={inputStyle}
              />
              <p style={hintStyle}>API calls your app makes per day</p>
            </div>
            <div>
              <label style={labelStyle}>Avg input tokens</label>
              <input
                type="number"
                min={1}
                value={avgInputTokens}
                onChange={e => setAvgInputTokens(Math.max(1, Number(e.target.value)))}
                style={inputStyle}
              />
              <p style={hintStyle}>System prompt + user message. ~750 tokens ≈ 1 page</p>
            </div>
            <div>
              <label style={labelStyle}>Avg output tokens</label>
              <input
                type="number"
                min={1}
                value={avgOutputTokens}
                onChange={e => setAvgOutputTokens(Math.max(1, Number(e.target.value)))}
                style={inputStyle}
              />
              <p style={hintStyle}>Claude's response length per message</p>
            </div>
          </div>

          {/* Prompt caching toggle */}
          <div style={{
            padding: '16px',
            borderRadius: '8px',
            border: `1px solid ${useCaching ? 'rgba(76,175,125,0.4)' : 'var(--border-base)'}`,
            background: useCaching ? 'rgba(76,175,125,0.06)' : 'var(--bg-subtle)',
            transition: 'border-color 150ms ease, background 150ms ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: useCaching ? '16px' : 0 }}>
              <div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px' }}>
                  Prompt caching
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                  Cache your system prompt — pay 90% less on repeated tokens
                </p>
              </div>
              <button
                onClick={() => setUseCaching(!useCaching)}
                style={{
                  width: '40px', height: '22px', borderRadius: '11px',
                  background: useCaching ? '#4CAF7D' : 'var(--border-base)',
                  border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0,
                  transition: 'background 150ms ease',
                }}
              >
                <span style={{
                  position: 'absolute', top: '3px',
                  left: useCaching ? '21px' : '3px',
                  width: '16px', height: '16px', borderRadius: '50%',
                  background: 'white',
                  transition: 'left 150ms ease',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                }} />
              </button>
            </div>

            {useCaching && (
              <div>
                <label style={labelStyle}>% of input tokens that are cached</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="range"
                    min={0} max={100} step={5}
                    value={cachedPercent}
                    onChange={e => setCachedPercent(Number(e.target.value))}
                    style={{ flex: 1, accentColor: '#4CAF7D' }}
                  />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: '#4CAF7D', fontWeight: 600, minWidth: '40px' }}>
                    {cachedPercent}%
                  </span>
                </div>
                <p style={hintStyle}>Your system prompt as % of total input. Most apps: 40–80%</p>
              </div>
            )}
          </div>

          {/* Token reference */}
          <div style={{ padding: '14px 16px', borderRadius: '8px', background: 'var(--bg-subtle)', border: '1px solid var(--border-muted)' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Token reference
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px' }}>
              {[
                ['Short tweet', '~20 tokens'],
                ['1 paragraph', '~100 tokens'],
                ['1 page', '~750 tokens'],
                ['Long system prompt', '~500–2000 tokens'],
                ['Short answer', '~100–300 tokens'],
                ['Full document', '~2000+ tokens'],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Results ── */}
        <div style={{ position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            borderRadius: '12px',
            border: `2px solid ${model.color}40`,
            background: `${model.color}08`,
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: `1px solid ${model.color}20`,
              background: `${model.color}10`,
            }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: model.color, margin: '0 0 4px' }}>
                Estimated cost
              </p>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                {fmt(costs.monthlyCost)}
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', fontWeight: 400, color: 'var(--text-muted)' }}> /month</span>
              </p>
            </div>

            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                ['Per message', fmt(costs.costPerMsg)],
                ['Per 1,000 messages', fmt(costs.costPer1k)],
                ['Daily', fmt(costs.dailyCost)],
                ['Monthly', fmt(costs.monthlyCost)],
                ['Yearly', fmt(costs.yearlyCost)],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Caching savings */}
          {useCaching && costs.savings > 0 && (
            <div style={{
              padding: '16px 20px',
              borderRadius: '10px',
              background: 'rgba(76,175,125,0.08)',
              border: '1px solid rgba(76,175,125,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: '#4CAF7D', margin: '0 0 2px' }}>
                  Estimated caching savings
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                  vs. not caching at all
                </p>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, color: '#4CAF7D' }}>
                {fmt(costs.savings)}/mo
              </span>
            </div>
          )}

          {/* Model breakdown */}
          <div style={{ padding: '16px 20px', borderRadius: '10px', background: 'var(--bg-surface)', border: '1px solid var(--border-base)' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>
              Compare across models (same usage)
            </p>
            {MODELS.map(m => {
              const inputCost = (avgInputTokens / 1_000_000) * m.inputPPM * messagesPerDay * 30
              const outputCost = (avgOutputTokens / 1_000_000) * m.outputPPM * messagesPerDay * 30
              const total = inputCost + outputCost
              const max = MODELS.reduce((acc, mm) => {
                const i2 = (avgInputTokens / 1_000_000) * mm.inputPPM * messagesPerDay * 30
                const o2 = (avgOutputTokens / 1_000_000) * mm.outputPPM * messagesPerDay * 30
                return Math.max(acc, i2 + o2)
              }, 1)
              return (
                <div key={m.id} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: m.id === modelId ? m.color : 'var(--text-muted)', fontWeight: m.id === modelId ? 600 : 400 }}>
                      {m.name}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>{fmt(total)}/mo</span>
                  </div>
                  <div style={{ height: '4px', borderRadius: '2px', background: 'var(--bg-subtle)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(total / max) * 100}%`, borderRadius: '2px', background: m.color, transition: 'width 300ms ease' }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Assumption note */}
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Estimates only. Verify current pricing at anthropic.com/pricing. Does not include Anthropic API platform fees or enterprise pricing.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .calc-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
