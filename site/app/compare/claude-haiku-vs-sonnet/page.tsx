import Link from 'next/link'
import type { Metadata } from 'next'
import ComparisonPage, { comparisonLd, type SpecRow } from '@/components/ComparisonPage'

const TITLE = 'Claude Haiku vs Sonnet — the gap closed in 2026'
const DESC =
  'Haiku 4.5 costs $1/$5 and Sonnet 5 costs $2/$10 — a 2× gap, down from 3.75× a year ago. That change, plus an 11-month difference in knowledge cutoff and a 5× difference in context window, has quietly inverted the standard advice about when to reach for Haiku.'

export const metadata: Metadata = { title: `${TITLE} — AI Codex`, description: DESC }

const SPECS: SpecRow[] = [
  {
    label: 'Price (input / output per MTok)',
    claude: 'Claude Haiku 4.5 — $1 / $5',
    other: 'Claude Sonnet 5 — $2 / $10',
  },
  {
    label: 'The ratio, and how it changed',
    claude: 'Haiku 4.5 replaced Haiku 3.5 at $0.80 / $4 — so Haiku got slightly more expensive.',
    other: 'Sonnet 5 replaced Sonnet 4.6, which ran at $3 / $15 — so Sonnet got a third cheaper. The rise back to $3 / $15 scheduled for September 2026 was cancelled on August 10. Sonnet is now 2× Haiku; a year ago it was 3.75×.',
  },
  {
    label: 'Context window',
    claude: '200k tokens.',
    other: '1M tokens — five times as much, billed at standard rates across the whole window.',
  },
  {
    label: 'Max output',
    claude: '64k tokens.',
    other: '128k tokens, or up to 300k through the Batch API with the `output-300k-2026-03-24` beta header.',
  },
  {
    label: 'Knowledge cutoff',
    claude: 'February 2025 reliable, July 2025 training data. Haiku 4.5 shipped in October 2025 and has not been refreshed since.',
    other: 'January 2026. Eleven months newer, which is the difference between knowing a framework version and not.',
  },
  {
    label: 'Reasoning mode',
    claude: 'Extended thinking (`thinking.type: "enabled"`). No adaptive thinking.',
    other: 'Adaptive thinking, with `effort` defaulting to `high` on the API and in Claude Code.',
  },
  {
    label: 'Tokenizer',
    claude: 'The older tokenizer.',
    other: 'The Claude 4.7-generation tokenizer — roughly 30% more tokens for the same text. So the effective price gap on real text is wider than 2×, closer to 2.6×.',
  },
  {
    label: 'Latency',
    claude: 'Fastest model in the family. The reason to choose it.',
    other: 'Fast, but a step behind Haiku. Streaming hides most of the difference in a chat interface and none of it in a batch pipeline.',
  },
]

export default function Page() {
  const ld = comparisonLd(TITLE, DESC, 'claude-haiku-vs-sonnet')
  return (
    <ComparisonPage
      title={TITLE}
      otherLabel="Sonnet 5"
      otherAccent="#D4845A"
      pricingVendors={['Anthropic']}
      intro={[
        <p key="1">
          The standard advice — Haiku for volume, Sonnet for quality — was built on a price gap that
          no longer exists. When Sonnet cost $3 / $15 and Haiku cost $0.80 / $4, moving a
          classification pipeline down a tier cut the bill by nearly three quarters. That arithmetic
          drove a lot of architecture.
        </p>,
        <p key="2">
          Today Sonnet 5 is $2 / $10 against Haiku 4.5 at $1 / $5. Factor in the newer tokenizer and
          the real gap is roughly 2.6×, not 3.75×. Meanwhile Sonnet 5 has five times the context, an
          eleven-month newer knowledge cutoff, and adaptive thinking. If you last made this decision
          in 2025, it is worth making again.
        </p>,
      ]}
      specs={SPECS}
      claims={[
        {
          source: 'Verifiable from Anthropic’s published model and pricing pages',
          items: [
            'Haiku 4.5: $1 / $5, 200k context, 64k max output, reliable knowledge cutoff February 2025.',
            'Sonnet 5: $2 / $10, 1M context, 128k max output, reliable knowledge cutoff January 2026.',
            'Sonnet 5’s introductory pricing became permanent on August 10, 2026 — the scheduled increase to $3 / $15 was cancelled.',
            'Claude 4.7-generation models produce roughly 30% more tokens for the same text than earlier ones.',
          ],
          caveat: 'All of the above is documented product fact rather than benchmark interpretation. The quality difference between the two tiers is real but not something either of us can put a number on for your workload.',
        },
      ]}
      evalHeading="How to actually pick, in about an hour"
      evalIntro={
        <p>
          The tier question is unusually cheap to answer empirically, because you can run both
          against the same inputs for a few dollars. Do that instead of reasoning about it.
        </p>
      }
      evalSteps={[
        { bold: 'Take 100 real inputs from the workload in question.', rest: 'Not synthetic examples. The distribution of weird cases is the whole point, and you cannot invent it.' },
        { bold: 'Run both tiers and diff the outputs.', rest: 'For classification and extraction, count exact disagreements. If Haiku matches Sonnet on 98 of 100, the tier question is settled and you should stop reading.' },
        { bold: 'Look only at the disagreements.', rest: 'On each one, decide which answer was right. Sometimes Haiku is. What matters is the rate at which Sonnet is right and Haiku is wrong, and what that costs you per occurrence.' },
        { bold: 'Check whether your prompt fits Haiku’s window.', rest: '200k versus 1M is the constraint that ends the discussion outright for document work and long agent sessions. Measure your real prompt, including retrieved context, not the version in your head.' },
        { bold: 'Check the knowledge cutoff against your domain.', rest: 'If your work touches libraries, products, or events after February 2025, Haiku 4.5 does not know about them. This is the failure mode people misdiagnose as "Haiku is dumber" — it is not reasoning, it is recency.' },
        { bold: 'Price both with caching on.', rest: 'A cache hit costs 10% of input on either tier. If your prompt is mostly a stable system prompt, caching compresses the gap between tiers far more than the tier choice itself does.' },
      ]}
      evalFooter={
        <p>
          <Link href="/articles/choosing-the-right-claude-model" style={{ color: 'var(--accent)' }}>Choosing the right Claude model</Link> covers
          the wider family, and <Link href="/articles/claude-cost-optimization" style={{ color: 'var(--accent)' }}>cost optimization</Link> covers
          the levers that outrank tier selection.
        </p>
      }
      bottomLine={[
        {
          heading: 'Use Haiku 4.5',
          body: <>when latency is the product — real-time chat, autocomplete, inline suggestions — or at genuinely high volume where a 2.6× effective difference still amounts to real money. It remains the right call for well-defined classification and extraction with a clear rubric, short prompts, and content that does not depend on anything after February 2025.</>,
        },
        {
          heading: 'Use Sonnet 5',
          body: <>for most other things, and more often than the old advice suggests. At 2× the price with 5× the context, an eleven-month newer cutoff, adaptive thinking, and double the output ceiling, the case for reaching down a tier is much weaker than it was. A lot of pipelines are on Haiku because someone did this arithmetic in 2025 and never revisited it.</>,
        },
        {
          heading: 'The mistake to avoid',
          body: <>treating tier selection as your cost strategy. Caching cuts input by 90% and batching cuts everything by 50%, and the two stack — both of which move the bill more than dropping a tier does, without costing you any quality. See <Link href="/articles/prompt-caching-implementation" style={{ color: 'var(--accent)' }}>prompt caching</Link> before you downgrade a model.</>,
        },
      ]}
      related={[
        { href: '/articles/choosing-the-right-claude-model', label: 'Choosing the right Claude model', sub: 'The whole family, including Opus 5 and Fable 5.' },
        { href: '/articles/prompt-caching-implementation', label: 'Prompt caching', sub: 'The 90% lever that beats tier selection.' },
        { href: '/articles/claude-session-economics', label: 'Session economics', sub: 'Where agent spend actually goes.' },
        { href: '/tools/cost-calculator', label: 'Cost calculator', sub: 'Model both tiers against your real volume.' },
      ]}
      {...ld}
    />
  )
}
