/**
 * Current frontier model landscape — the single source of truth for every
 * comparison page and any article quoting a price.
 *
 * Update this file, not the pages. `VERIFIED` drives the "last verified"
 * stamp rendered on comparison pages, so a stale file is visible to readers
 * rather than silently wrong.
 *
 * Claude prices: platform.claude.com/docs/en/about-claude/pricing (official).
 * OpenAI prices: openai.com/index/advancing-the-price-performance-frontier-with-gpt-5-6/
 * Google prices: ai.google.dev/gemini-api/docs/changelog
 */

export const VERIFIED = 'August 21, 2026'

export type ModelRow = {
  vendor: 'Anthropic' | 'OpenAI' | 'Google'
  name: string
  tier: 'frontier' | 'balanced' | 'fast'
  /** USD per million input tokens */
  input: number
  /** USD per million output tokens */
  output: number
  /** USD per million tokens, 5-minute cache write (1.25x input). Anthropic only. */
  cacheWrite?: number
  /** USD per million tokens, cache hit (0.1x input). Anthropic only. */
  cacheRead?: number
  note: string
}

export const MODELS: ModelRow[] = [
  // Anthropic
  { vendor: 'Anthropic', name: 'Claude Fable 5',  tier: 'frontier', input: 10, output: 50, cacheWrite: 12.5, cacheRead: 1, note: 'The frontier model. Twice the price of Opus 5 for the hardest work.' },
  { vendor: 'Anthropic', name: 'Claude Opus 5',   tier: 'frontier', input: 5,  output: 25, cacheWrite: 6.25, cacheRead: 0.5, note: 'The default flagship. Thinking on by default. Fast mode available at $10/$50.' },
  { vendor: 'Anthropic', name: 'Claude Sonnet 5', tier: 'balanced', input: 2,  output: 10, cacheWrite: 2.5, cacheRead: 0.2, note: 'What most production agent fleets run on. The September 2026 increase to $3/$15 was cancelled.' },
  { vendor: 'Anthropic', name: 'Claude Haiku 4.5', tier: 'fast',    input: 1,  output: 5,  cacheWrite: 1.25, cacheRead: 0.1,  note: 'High-volume and latency-sensitive work.' },

  // OpenAI
  { vendor: 'OpenAI', name: 'GPT-5.6 Sol',   tier: 'frontier', input: 5,    output: 30,   note: 'The flagship tier. Long-context requests meter at $10/$45.' },
  { vendor: 'OpenAI', name: 'GPT-5.6 Terra', tier: 'balanced', input: 2,    output: 12,   note: 'The everyday tier, cut to this rate on July 30, 2026. Long-context meters at $4/$18.' },
  { vendor: 'OpenAI', name: 'GPT-5.6 Luna',  tier: 'fast',     input: 0.20, output: 1.20, note: 'The cheapest frontier-family option on the market. Long-context meters at $0.40/$1.80.' },

  // Google
  { vendor: 'Google', name: 'Gemini 3.7 Flash',      tier: 'balanced', input: 0.75, output: 3.75, note: 'GA August 13, 2026, positioned for coding and agents. Introductory rate through December 31, 2026 — it doubles to $1.50/$7.50 in 2027.' },
  { vendor: 'Google', name: 'Gemini 3.6 Flash',      tier: 'balanced', input: 0.75, output: 3.75, note: 'GA July 21, 2026. Same introductory rate and the same 2027 increase.' },
  { vendor: 'Google', name: 'Gemini 3.5 Flash',      tier: 'balanced', input: 1.50, output: 9.00, note: 'The previous generation, at standard pricing. Adds Computer Use.' },
  { vendor: 'Google', name: 'Gemini 3.5 Flash-Lite', tier: 'fast',     input: 0.30, output: 2.50, note: 'Low-latency subagent tier for high-volume automation.' },
]

/**
 * The three things that make a sticker-price comparison misleading. Every
 * comparison page renders these, because a per-token table on its own is the
 * single most common way people get their cost model wrong.
 */
export const PRICING_CAVEATS = [
  {
    title: 'Anthropic changed tokenizers at Claude 4.7',
    body: 'Claude 4.7 and later — including Opus 5, Sonnet 5, and Fable 5 — use a newer tokenizer that produces roughly 30% more tokens for the same text than Sonnet 4.6 and earlier. A $2/MTok model on the new tokenizer is not directly comparable to a $2/MTok model on an older one, or to another vendor. Compare cost per task, not cost per token.',
  },
  {
    title: 'OpenAI meters long context separately',
    body: 'GPT-5.6 publishes a second, higher rate for long-context requests: Sol goes from $5/$30 to $10/$45, Terra from $2/$12 to $4/$18, Luna from $0.20/$1.20 to $0.40/$1.80. Anthropic includes the full 1M-token window at standard pricing on Claude 4.6 and later — a 900k-token request costs the same per token as a 9k one. If your workload is context-heavy, that difference is larger than the headline gap.',
  },
  {
    title: 'Two of Google\u2019s current rates are introductory',
    body: 'Gemini 3.7 Flash and 3.6 Flash are priced at $0.75/$3.75 only through December 31, 2026. Both double to $1.50/$7.50 in 2027. If you are building a twelve-month cost model on Gemini Flash, model the 2027 number, not the one on the page today.',
  },
  {
    title: 'Caching and batching move the number more than model choice',
    body: 'A Claude cache hit costs 10% of the standard input price, and the Batch API takes 50% off both directions; the two stack. A workload that reuses a large system prompt can land below a nominally cheaper model that you are calling uncached. Model selection is usually the third-largest lever, after caching and after not sending the context at all.',
  },
]

export const fmt = (n: number) => (n === 0 ? '—' : n < 1 ? `$${n.toFixed(2)}` : `$${n}`)

/**
 * Anthropic models in the shape the cost calculator wants, with a colour and a
 * one-line positioning note. Derived from MODELS so prices cannot drift apart.
 */
const CALC_META: Record<string, { id: string; description: string; color: string }> = {
  'Claude Fable 5':   { id: 'claude-fable-5',  description: 'Frontier — long-running agents and the hardest reasoning', color: '#C05A8A' },
  'Claude Opus 5':    { id: 'claude-opus-5',   description: 'Flagship — complex agentic coding and enterprise work',    color: '#7B8FD4' },
  'Claude Sonnet 5':  { id: 'claude-sonnet-5', description: 'Best balance — what most production workloads run on',     color: '#D4845A' },
  'Claude Haiku 4.5': { id: 'claude-haiku-4-5', description: 'Fastest and cheapest — high-volume, latency-sensitive',   color: '#4CAF7D' },
}

export const CALCULATOR_MODELS = MODELS
  .filter(m => m.vendor === 'Anthropic' && CALC_META[m.name])
  .map(m => ({
    id: CALC_META[m.name].id,
    name: m.name,
    description: CALC_META[m.name].description,
    inputPPM: m.input,
    outputPPM: m.output,
    cacheWritePPM: m.cacheWrite ?? m.input * 1.25,
    cacheReadPPM: m.cacheRead ?? m.input * 0.1,
    color: CALC_META[m.name].color,
  }))
