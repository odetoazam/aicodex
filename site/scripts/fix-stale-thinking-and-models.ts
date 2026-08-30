/**
 * Tier 1 currency fix — batch 3 of 3: thinking controls and model selection.
 *
 * Three articles teach extended thinking as a mode you toggle on. That is no
 * longer how it works: on Claude Opus 5, Sonnet 5 and Fable 5 thinking is on
 * by default and adaptive, and the `thinking: {type: "enabled", budget_tokens}`
 * configuration is not accepted. Depth is steered with the `effort` parameter
 * (low / medium / high / xhigh / max, default high).
 *
 * A fourth, choosing-the-right-claude-model, carries Claude 3-era pricing
 * ($3/$15 Sonnet, $15/$75 Opus) and a three-model lineup. Current lineup is
 * four models: Haiku 4.5 $1/$5, Sonnet 5 $2/$10, Opus 5 $5/$25, Fable 5 $10/$50.
 *
 * Verified against docs on 2026-08-30:
 *   https://platform.claude.com/docs/en/build-with-claude/thinking
 *   https://platform.claude.com/docs/en/build-with-claude/effort
 *   https://platform.claude.com/docs/en/about-claude/models/overview
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/fix-stale-thinking-and-models.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const EFFORT_PRACTICAL = `Claude thinks before it answers. On Claude Opus 5, Claude Sonnet 5 and Claude Fable 5, that is not a mode you switch on — it is on by default, and the model decides for itself how much reasoning a given request deserves. This is adaptive thinking, and it replaced the older arrangement where you enabled "extended thinking" and handed the model a token budget.

If you learned this feature in its earlier form, the important correction is this: **the manual configuration is gone on current models.** \`thinking: {type: "enabled", budget_tokens: N}\` is not accepted on Claude Opus 5, Sonnet 5 or Fable 5. What you control now is \`effort\`.

## The control that replaced the toggle

\`effort\` takes five values — \`low\`, \`medium\`, \`high\`, \`xhigh\`, \`max\` — and defaults to \`high\`. It does not turn thinking on or off. It tells Claude how much of everything to spend: reasoning, tool calls, and response tokens alike.

\`\`\`python
response = client.messages.create(
    model="claude-opus-5",
    max_tokens=8192,
    messages=[{"role": "user", "content": "..."}],
    output_config={"effort": "medium"},
)
\`\`\`

That last point is the one people miss. Effort is not a thinking dial, it is a total-spend dial. At low effort Claude makes fewer tool calls, combines operations, and skips the preamble. At high effort it explores more, calls more tools, and explains its plan. On agentic work this matters far more than the reasoning depth on any single turn.

Setting \`effort: "high"\` is identical to omitting the parameter.

## When to raise effort above the default

**Multi-step reasoning.** Problems where you have to get step 3 right to get step 5 right — financial models, legal analysis, proofs, anything that chains dependencies.

**Problems with many valid approaches.** When you want Claude to weigh options against each other rather than commit to the first plausible one. Strategic decisions, architectural choices, competing interpretations.

**Tasks where systematic coverage matters.** Reviewing a contract for risk, auditing a plan for gaps, checking an argument for logical flaws — where missing something has a cost.

**Long-horizon agentic and coding work.** This is what \`xhigh\` exists for: tasks running over thirty minutes with token budgets in the millions, repeated tool calling, detailed search. On Opus 5 and Sonnet 5, \`xhigh\` is the recommended starting point for demanding coding work, not \`max\`.

**\`max\` is narrower than it sounds.** Reserve it for genuinely frontier problems. On most workloads it adds significant cost for small quality gains, and on structured-output tasks it can lead to overthinking.

## When to lower it

**High-volume or latency-sensitive work.** Classification, extraction, routing, chat. \`low\` is the single most effective cost lever available on the current models, and on Fable 5 low effort still outperforms \`xhigh\` on earlier generations.

**Subagents.** A subagent doing one scoped mechanical job does not need the orchestrator's effort level. This is where teams leave the most money on the table.

**Simple retrieval and reformatting.** If the answer does not require reasoning, effort spent on reasoning is latency you are paying for and not using.

**Creative and generative writing.** More deliberation tends to make output more systematic and less fluent. For open-ended creative work, the reasoning process is as much a constraint as a capability.

## The practical test

Run the same task at \`medium\` and at \`high\` against your actual inputs and compare. For work that genuinely benefits, the difference is obvious. For work that doesn't, you have just found a permanent cost reduction.

Do this per workload, not once. Effort levels do not transfer cleanly between models — if you carried settings over from an earlier model, run a fresh sweep rather than reusing them.

## Two things that will bite you

**Changing effort mid-conversation invalidates your prompt cache.** Effort shapes the rendered prompt, so switching levels between requests means cached prefixes from earlier turns do not hit. Pick a level at the start of a session that relies on caching and hold it. Vary effort across workloads, not within one conversation.

**Thinking cannot always be disabled.** On Claude Opus 5, \`thinking: {type: "disabled"}\` works at \`high\` effort or below, but returns a 400 error at \`xhigh\` or \`max\`. Claude Fable 5 rejects it outright. Do not build a code path that assumes you can always turn thinking off.

## Where the old configuration still applies

If you are calling an older model that supports only extended thinking, \`type: "enabled"\` with \`budget_tokens\` is still how you configure it — see the [extended thinking documentation](https://platform.claude.com/docs/en/build-with-claude/extended-thinking) and the [per-model configuration table](https://platform.claude.com/docs/en/build-with-claude/thinking-troubleshooting#supported-models). On Claude Opus 4.8, 4.7, 4.6 and Sonnet 4.6, thinking is adaptive but off until you set \`thinking: {type: "adaptive"}\`.

One more detail worth knowing: on the current models \`display\` defaults to \`"omitted"\`, so thinking blocks come back empty unless you ask for them. Set \`thinking: {"type": "adaptive", "display": "summarized"}\` when you want to see the reasoning.

## Further reading

- [Effort](https://platform.claude.com/docs/en/build-with-claude/effort) — the parameter, its levels, and per-model recommendations
- [Thinking](https://platform.claude.com/docs/en/build-with-claude/thinking) — how thinking works and how it interacts with tools, caching, and streaming
- [Extended thinking](https://platform.claude.com/docs/en/build-with-claude/extended-thinking) — the older manual configuration, for models that still take it
- [Adaptive thinking](/glossary/adaptive-thinking) — the mode current models run by default`

const EFFORT_PRACTICAL_EXCERPT =
  "Extended thinking as a toggle is gone on current models — Claude Opus 5, Sonnet 5 and Fable 5 think by default and adaptively, and budget_tokens is not accepted. The control that replaced it is `effort`, which governs total token spend including tool calls. Here's when to raise it, when to lower it, and the two behaviours that will bite you."

const EFFORT_ROLE = `Thinking used to be something you turned on. On the current models it isn't: Claude Opus 5, Claude Sonnet 5 and Claude Fable 5 think by default, and decide for themselves how deeply based on what you asked. The old \`budget_tokens\` configuration is not accepted on any of them.

What you steer instead is [\`effort\`](https://platform.claude.com/docs/en/build-with-claude/effort) — five levels, \`low\` through \`max\`, defaulting to \`high\`. And the question worth asking is no longer "should I turn thinking on for this," because it is already on. It is "am I paying for more deliberation than this task returns."

For most operators, the answer is yes, and nobody checks.

## Why the default is not always the right level

\`high\` is a sensible default for hard work. It is a poor default for volume. Effort governs everything Claude spends — reasoning, tool calls, response length — so leaving every workload at \`high\` means routine classification and extraction jobs are running at the setting designed for difficult coding problems.

The teams who notice this find their largest cost reduction here, and it costs them nothing in quality, because the work never needed the depth.

## Raise effort when the problem has hidden complexity

**Multi-step reasoning.** Problems where you have to get step 3 right to get step 5 right. Financial models, legal analysis, anything that chains dependencies.

**Ambiguous or contradictory inputs.** When what you have given Claude is incomplete or internally inconsistent, more deliberation makes it surface that explicitly rather than gloss over it.

**High-stakes decisions.** When the cost of a wrong answer justifies the extra spend. Strategic analysis, risk assessments, anything you will act on directly.

**Inconsistent results.** If Claude keeps giving different answers to the same question, higher effort usually produces more stable, considered output.

**Long agentic runs.** \`xhigh\` exists for work measured in tens of minutes and millions of tokens — repeated tool calling, detailed search, coding across many files.

## Lower it for routine work

First drafts, reformatting, summarising a document, answering a factual question, classification at volume, and any subagent doing one scoped job. \`low\` and \`medium\` are not degraded modes — they are the correct setting for work that does not need deliberation, and they are meaningfully faster.

Think of it as the difference between asking a colleague a quick question and booking an hour to work through a problem together. Both are right in different situations. Using the meeting format for every question is just expensive.

## A practical rule

If you would be comfortable reading only the final answer without checking how Claude got there, you are probably paying for effort you do not need. If you would want to check the reasoning — because the problem is hard enough that the path matters — the default or higher is right.

Set it per workload and measure. The goal is appropriate depth, not maximum depth.

---

## Further reading

- [Effort](https://platform.claude.com/docs/en/build-with-claude/effort) — levels, defaults, and per-model guidance
- [Thinking](https://platform.claude.com/docs/en/build-with-claude/thinking) — what thinking does and when it runs
- [Claude cost optimization](/articles/claude-cost-optimization) — where effort fits among the other levers`

const EFFORT_ROLE_EXCERPT =
  "You no longer turn thinking on — Claude Opus 5, Sonnet 5 and Fable 5 think by default. The question now is whether you're paying for more deliberation than the task returns. How to set `effort` per workload, and why leaving everything at the default is the most common avoidable cost."

const ADAPTIVE_OLD_1 = `You don't configure this — it happens automatically. It's different from [extended thinking](/glossary/extended-thinking), which is a specific feature you explicitly enable for tasks that require maximum reasoning depth. Adaptive thinking is the background process that's always running.`

const ADAPTIVE_NEW_1 = `On Claude Opus 5, Claude Sonnet 5 and Claude Fable 5 this is the default and requires no configuration. On Claude Opus 4.8, 4.7, 4.6 and Sonnet 4.6 it is available but off until you set \`thinking: {type: "adaptive"}\`.

Adaptive thinking replaced [extended thinking](/glossary/extended-thinking), the older arrangement where you explicitly enabled reasoning and handed the model a fixed token budget. That configuration — \`type: "enabled"\` with \`budget_tokens\` — is not accepted on the current models at all. You no longer decide *whether* Claude thinks. You influence *how much* it spends, using the [\`effort\`](https://platform.claude.com/docs/en/build-with-claude/effort) parameter.`

const ADAPTIVE_OLD_2 = `Think of adaptive thinking as the default setting that gets you most of the way there. Clear context and good prompting take you the rest of the way.`

const ADAPTIVE_NEW_2 = `Think of adaptive thinking as the default setting that gets you most of the way there. Clear context and good prompting take you the rest of the way.

**One control worth knowing.** \`effort\` — \`low\`, \`medium\`, \`high\` (the default), \`xhigh\`, \`max\` — steers how much Claude spends across the whole response, thinking included. Raise it for long agentic and coding work; lower it for high-volume routine tasks where the deliberation is not returning anything. See [when to raise and lower effort](/articles/extended-thinking-practical) for the workload-by-workload version.

Note also that thinking cannot always be switched off: Claude Opus 5 rejects \`thinking: {type: "disabled"}\` at \`xhigh\` and \`max\` effort, and Claude Fable 5 rejects it entirely.`

const ADAPTIVE_OLD_3 = `- [Extended thinking documentation](https://platform.claude.com/docs/en/build-with-claude/extended-thinking) — the manual version of extended thinking for when you want explicit control`

const ADAPTIVE_NEW_3 = `- [Effort](https://platform.claude.com/docs/en/build-with-claude/effort) — the parameter that steers how deeply Claude thinks on current models
- [Extended thinking documentation](https://platform.claude.com/docs/en/build-with-claude/extended-thinking) — the superseded manual configuration, still used by older models`

const MODEL_CHOICE = `Claude comes in four models: Fable 5 (highest capability), Opus 5 (complex agentic and enterprise work), Sonnet 5 (the balance of speed and intelligence), and Haiku 4.5 (fastest, cheapest). Most teams default to whatever sounds most powerful. That wastes money and often produces slower results without meaningful quality improvement.

Here is how to actually choose.

## The current lineup

| Model | Price (input / output per Mtok) | Context | Best for |
| --- | --- | --- | --- |
| Claude Haiku 4.5 | $1 / $5 | 200K | Classification, extraction, high-volume routine work |
| Claude Sonnet 5 | $2 / $10 | 1M | The daily driver — most work belongs here |
| Claude Opus 5 | $5 / $25 | 1M | Complex agentic coding, enterprise work |
| Claude Fable 5 | $10 / $50 | 1M | Long-running agents, the hardest problems |

The gaps are narrower than they used to be. Opus 5 is 2.5x Sonnet 5, not the 5x that separated the equivalent tiers a generation ago, and Sonnet 5 costs a third less than Sonnet did before its pricing became permanent in August 2026. Check the [pricing page](https://platform.claude.com/docs/en/about-claude/pricing) before budgeting — this lineup moves.

## What each model is good at

**Haiku 4.5** — the workhorse. Fast, cheapest, 200K context. Use for:
- Simple Q&A, classification, extraction
- Reformatting text, adjusting tone
- Sorting, categorising, and tagging
- Subagents doing one scoped mechanical job
- High-volume tasks where cost scales linearly

**Sonnet 5** — the daily driver, and where most teams should spend most of their time. Use for:
- Content drafting, summarising, analysis requiring judgment
- Code generation and review
- Multi-step tasks needing coherent reasoning
- Agent work that doesn't need the top tier

**Opus 5** — the heavy lifter. Anthropic positions it for complex agentic coding and enterprise work. Use when:
- The problem is genuinely hard: ambiguous inputs, nuanced judgment
- You're running long agentic loops with many tool calls
- Sonnet's output isn't good enough for a specific use case

**Fable 5** — next-generation intelligence for long-running agents, with thinking always on and no option to disable it. At $10/$50 it is double Opus 5, so use it when you have measured that Opus 5 leaves capability on the table, not as a default.

## The mistake teams make

Defaulting to the top of the lineup for everything. It is like taking a taxi for every trip when most of them are a five-minute walk.

**The right approach:** start with Sonnet 5. If output quality isn't good enough for a specific use case, upgrade that use case. Keep everything else on Sonnet. Route genuinely simple tasks to Haiku 4.5.

On Claude.ai you select the model per conversation. On the API you specify it per request, which means you can route different task types to different models programmatically.

## The lever most teams miss

Model choice is only half of it. The [\`effort\`](https://platform.claude.com/docs/en/build-with-claude/effort) parameter — \`low\` through \`max\`, defaulting to \`high\` — controls how many tokens Claude spends on a request, including tool calls. Sonnet 5 at \`medium\` effort is often both cheaper and faster than Haiku 4.5 at \`high\`, with better quality.

Tune effort per workload before you downgrade a model. It is the cheaper experiment and it frequently makes the downgrade unnecessary. See [when to raise and lower effort](/articles/extended-thinking-practical).

## For team admins: model strategy

1. **Set Sonnet 5 as the default.** Most people don't need to think about model selection.
2. **Educate on when to upgrade.** Deep analysis or mediocre outputs on a specific task — switch that task, not everything.
3. **Watch usage patterns.** If limits are getting hit, check whether people are running Opus on work Sonnet handles equally well.
4. **Set effort deliberately for anything automated.** Every agent and batch job should have a chosen effort level, not an inherited default.

## The simple rule

If in doubt, use Sonnet 5. Upgrade to Opus 5 when the output matters a lot and Sonnet isn't cutting it. Reserve Fable 5 for cases where you have evidence Opus 5 isn't enough. Drop to Haiku 4.5 when the task is simple and you need speed or volume.

## Further reading

- [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview) — current model capabilities and specs
- [Pricing](https://platform.claude.com/docs/en/about-claude/pricing) — full pricing breakdown including caching and batch discounts
- [Choosing a model](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model) — Anthropic's own selection criteria
- [Claude cost optimization](/articles/claude-cost-optimization) — the other levers besides model choice`

const MODEL_CHOICE_EXCERPT =
  "Claude is a four-model lineup now — Haiku 4.5 at $1/$5, Sonnet 5 at $2/$10, Opus 5 at $5/$25, Fable 5 at $10/$50 — and the gaps are narrower than they used to be. How to pick, why Sonnet 5 should be your default, and why tuning the effort parameter usually beats downgrading the model."

type P = { slug: string; title?: string; excerpt?: string; body?: string; edits?: [string, string][] }

const PATCHES: P[] = [
  { slug: 'extended-thinking-practical', title: 'Effort: how deeply should Claude think?', body: EFFORT_PRACTICAL, excerpt: EFFORT_PRACTICAL_EXCERPT },
  { slug: 'extended-thinking-role', title: "When to raise Claude's effort — and when it's a waste", body: EFFORT_ROLE, excerpt: EFFORT_ROLE_EXCERPT },
  { slug: 'adaptive-thinking-def', edits: [[ADAPTIVE_OLD_1, ADAPTIVE_NEW_1], [ADAPTIVE_OLD_2, ADAPTIVE_NEW_2], [ADAPTIVE_OLD_3, ADAPTIVE_NEW_3]] },
  { slug: 'choosing-the-right-claude-model', title: 'Which Claude model should your team use?', body: MODEL_CHOICE, excerpt: MODEL_CHOICE_EXCERPT },
]

async function main() {
  let failures = 0
  for (const p of PATCHES) {
    const { data, error } = await sb.from('articles').select('slug, body').eq('slug', p.slug).single()
    if (error || !data) {
      console.error(`✗ ${p.slug}: could not load — ${error?.message}`)
      failures++
      continue
    }

    let body = data.body as string
    if (p.body) {
      body = p.body
    } else if (p.edits) {
      let ok = true
      for (const [from, to] of p.edits) {
        if (!body.includes(from)) {
          console.error(`✗ ${p.slug}: anchor not found → ${from.slice(0, 70)}...`)
          ok = false
          break
        }
        body = body.replace(from, to)
      }
      if (!ok) { failures++; continue }
    }

    const update: Record<string, unknown> = { body, updated_at: new Date().toISOString() }
    if (p.title) update.title = p.title
    if (p.excerpt) update.excerpt = p.excerpt

    const { error: upErr } = await sb.from('articles').update(update).eq('slug', p.slug)
    if (upErr) {
      console.error(`✗ ${p.slug}: update failed — ${upErr.message}`)
      failures++
    } else {
      console.log(`✓ ${p.slug} — ${p.body ? 'body rewritten' : `${p.edits!.length} sections updated`}${p.title ? ' + retitled' : ''}`)
    }
  }
  if (failures) { console.error(`\n${failures} article(s) failed.`); process.exit(1) }
  console.log('\nBatch 3 complete — thinking controls and model selection corrected.')
}

main().catch((e) => { console.error(e); process.exit(1) })
