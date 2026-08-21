import Link from 'next/link'
import type { Metadata } from 'next'
import ComparisonPage, { comparisonLd, type SpecRow } from '@/components/ComparisonPage'

const TITLE = 'Claude vs GPT-5.6 for Coding'
const DESC =
  'Claude Opus 5 and Sonnet 5 against GPT-5.6 Sol, Terra, and Luna for coding work. Verified specs and pricing, what each vendor actually claims, where the benchmarks disagree, and how to run the only comparison that settles it — your own.'

export const metadata: Metadata = { title: `${TITLE} — AI Codex`, description: DESC }

const SPECS: SpecRow[] = [
  {
    label: 'Flagship for coding',
    claude: 'Claude Opus 5 — Anthropic’s stated recommendation for complex agentic coding. Claude Fable 5 sits above it for the hardest work at $10 / $50.',
    other: 'GPT-5.6 Sol — the flagship tier. Terra is the balanced everyday model, Luna the fast one.',
  },
  {
    label: 'Price (input / output per MTok)',
    claude: 'Opus 5 $5 / $25 · Sonnet 5 $2 / $10 · Haiku 4.5 $1 / $5',
    other: 'Sol $5 / $30 · Terra $2 / $12 · Luna $0.20 / $1.20',
  },
  {
    label: 'Long-context billing',
    claude: 'Full 1M-token window at standard pricing on Claude 4.6 and later. A 900k-token request costs the same per token as a 9k one.',
    other: 'A separate, higher long-context meter: Sol $10 / $45, Terra $4 / $18, Luna $0.40 / $1.80 — roughly double the headline input rate.',
  },
  {
    label: 'Context window',
    claude: '1M tokens on Fable 5, Opus 5, and Sonnet 5. 200k on Haiku 4.5.',
    other: 'Long-context tiers available across the GPT-5.6 family, metered separately as above.',
  },
  {
    label: 'Max output',
    claude: '128k tokens on the Messages API; up to 300k through the Batch API with the `output-300k-2026-03-24` beta header.',
    other: 'Varies by tier — check OpenAI’s current model page before assuming parity on long generations.',
  },
  {
    label: 'Knowledge cutoff',
    claude: 'Opus 5 reaches May 2026 — the most recent of any Claude model, ahead of even Fable 5 (Jan 2026). Sonnet 5 is Jan 2026.',
    other: 'Check OpenAI’s published cutoff per tier. For library and framework work this matters more than most benchmark deltas.',
  },
  {
    label: 'Reasoning control',
    claude: 'Adaptive thinking, with `effort` defaulting to `high` on Opus 5 and Sonnet 5 across the API and Claude Code. Set it explicitly to trade quality against latency and spend.',
    other: 'Thinking modes are configurable per request.',
  },
  {
    label: 'Tokenizer',
    claude: 'Claude 4.7 and later use a newer tokenizer producing roughly 30% more tokens for the same text than Sonnet 4.6 and earlier. Per-token prices are not comparable across that boundary.',
    other: 'Unchanged across the 5.6 family.',
  },
  {
    label: 'Terminal / agentic coding tool',
    claude: 'Claude Code — terminal, IDE, and browser, with subagents, Skills, hooks, and self-hosted environments. Auto mode became the default on Pro, Max, and Team on August 14, 2026.',
    other: 'Codex — generally available on AWS Bedrock since June 2026, with role-specific updates and read-only chat snapshots.',
  },
  {
    label: 'Where you can deploy it',
    claude: 'Claude API, Amazon Bedrock, Claude Platform on AWS, Google Cloud Vertex AI, Microsoft Foundry.',
    other: 'OpenAI API, Azure, and AWS Bedrock (Codex).',
  },
]

export default function Page() {
  const ld = comparisonLd(TITLE, DESC, 'claude-vs-gpt5-coding')
  return (
    <ComparisonPage
      title={TITLE}
      otherLabel="GPT-5.6"
      otherAccent="#5B8DD9"
      pricingVendors={['Anthropic', 'OpenAI']}
      intro={[
        <p key="1">
          Both families are close enough on coding that the model is rarely what decides your
          outcome. Published benchmarks split — Opus 5 leads on repository-level fixes and abstract
          reasoning, Sol leads on long-horizon task completion — and neither vendor runs the
          other’s harness.
        </p>,
        <p key="2">
          So this page does something more useful than declaring a winner. It gives you the verified
          specs, labels every performance claim with who made it, names the billing details that
          move your bill more than model choice does, and shows you how to run the only comparison
          that settles the question for your codebase.
        </p>,
      ]}
      specs={SPECS}
      claims={[
        {
          source: 'Anthropic, Claude Opus 5 announcement (July 24, 2026)',
          items: [
            'Frontier-Bench v0.1 — surpasses all other models, and more than doubles Opus 4.8.',
            'CursorBench 3.2 — within 0.5% of Fable 5’s peak score at half the cost per task.',
            'ARC-AGI 3 — roughly three times the next-best model.',
            'OSWorld 2.0 — beats Fable 5’s best result at just over a third of the cost.',
            'Zapier AutomationBench — 1.5× the next-best model at the same cost.',
          ],
          caveat: 'Anthropic publishes these as relative claims rather than absolute percentages, and the announcement contains no GPT-5.6 comparison at all. "Next-best model" is doing unspecified work in several of them.',
        },
        {
          source: 'Third-party comparisons drawing on both vendors’ system cards',
          items: [
            'SWE-bench Pro — Opus 5 reported well ahead of GPT-5.6 Sol on repository-level bug fixing.',
            'DeepSWE v1.1 — GPT-5.6 Sol reported ahead of Opus 5 by a few points.',
            'Sol reported stronger on long-horizon task completion and terminal coding speed.',
          ],
          caveat: 'These figures come from secondary write-ups citing each vendor’s own system card. We have not independently verified them, and the two vendors do not run identical harnesses. Treat the direction as informative and the magnitude as unverified.',
        },
      ]}
      evalHeading="Run the comparison that actually decides it"
      evalIntro={
        <p>
          A benchmark measures performance on someone else’s repository. Yours has its own
          conventions, its own dependency graph, and its own particular way of being confusing. An
          afternoon of measurement beats a month of reading comparisons.
        </p>
      }
      evalSteps={[
        { bold: 'Pull 20 real tasks from your own history.', rest: 'Closed bug tickets with a known correct fix are ideal, because the answer already exists and you did not write it for the test.' },
        { bold: 'Fix the harness and vary only the model.', rest: 'Same prompt, same context, same tools. Most published comparisons fail here, which is a large part of why they disagree.' },
        { bold: 'Score on your bar, not a leaderboard’s.', rest: 'Did it pass review? Did it need a second round? Would you have merged it?' },
        { bold: 'Record cost per completed task, not per token.', rest: 'With the tokenizer difference and the long-context meter, per-token price tells you very little about the bill.' },
        { bold: 'Re-run it when either vendor ships.', rest: 'Both families moved three times in the first eight months of 2026. A result from March is a historical note.' },
      ]}
      evalFooter={
        <p>
          <Link href="/articles/how-to-evaluate-your-agents" style={{ color: 'var(--accent)' }}>How to evaluate your agents</Link> covers
          the test-set design, and <Link href="/articles/auditing-your-eval-suite" style={{ color: 'var(--accent)' }}>auditing your eval suite</Link> covers
          what to do when the suite stops catching things.
        </p>
      }
      bottomLine={[
        {
          heading: 'Pick Claude',
          body: <>if your work is repository-scale — large refactors, reasoning across many files, long agentic sessions where a 1M-token window at flat pricing changes what is affordable. Claude Code is the more developed terminal agent, and Opus 5’s May 2026 knowledge cutoff is the most recent of any model here, which shows up on recent framework versions.</>,
        },
        {
          heading: 'Pick GPT-5.6',
          body: <>if you are already inside the OpenAI ecosystem, if Luna’s $0.20 / $1.20 makes a high-volume classification or triage workload viable that nothing else does, or if your work is long-horizon single-track rather than broad across a repository.</>,
        },
        {
          heading: 'Use both',
          body: <>if you are running anything at scale. Routing cheap classification to Luna or Haiku 4.5 and hard reasoning to Opus 5 or Sol costs less than standardising on one flagship, and the two APIs are similar enough that the abstraction is about a day of work. Vendor lock-in on a model that may be retired within a year is a risk you can decline — <Link href="/articles/when-your-ai-model-disappears" style={{ color: 'var(--accent)' }}>three Claude models were retired or suspended in the first half of 2026 alone</Link>.</>,
        },
      ]}
      related={[
        { href: '/compare/claude-haiku-vs-sonnet', label: 'Haiku vs Sonnet', sub: 'Which Claude tier for which job.' },
        { href: '/articles/claude-code-august-2026-updates', label: 'Claude Code in August 2026', sub: 'Auto mode is now the default. What that changes.' },
        { href: '/articles/claude-cost-optimization', label: 'Cutting Claude API cost', sub: 'Caching and batching move the bill more than model choice.' },
        { href: '/tools/cost-calculator', label: 'Cost calculator', sub: 'Model your monthly spend by volume and caching strategy.' },
      ]}
      {...ld}
    />
  )
}
