/**
 * Batch 91 — Anthropic announcements: Claude Opus 5, Claude Sonnet 5, Claude Science
 *
 * Covers the June 30 – July 24, 2026 window that fell through the cracks while
 * the timeline was stale (last event Jun 12).
 *
 * 1. claude-opus-5 — new flagship (July 24, 2026). Thinking on by default,
 *    effort as the primary control, one breaking change, 512-token cache floor.
 *    DEV_SLUGS + PINNED_DEV pos 1. Cluster: Models & Pricing. Angle: update.
 *
 * 2. claude-sonnet-5 — new default model for Free/Pro (June 30, 2026).
 *    Introductory pricing through Aug 31, three migration-breaking changes,
 *    new tokenizer. DEV_SLUGS. Cluster: Models & Pricing. Angle: update.
 *
 * 3. claude-science — new product (June 30, 2026). Research workbench, 60+
 *    scientific databases, beta for all paid plans. PRODUCTIVITY_SLUGS.
 *    Cluster: Features & Updates. Angle: update.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-91.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getTermId(slug: string): Promise<{ id: string; name: string } | null> {
  const { data } = await sb.from('terms').select('id, name').eq('slug', slug).single()
  return data
}

const articles = [
  {
    slug: 'claude-opus-5',
    angle: 'update',
    title: 'Claude Opus 5: thinking on by default, and effort becomes the dial that matters',
    excerpt: "Anthropic launched Claude Opus 5 on July 24, 2026 at $5/$25 per million tokens — the same price as Opus 4.8. Thinking is now on by default, the effort parameter is the main control you tune, and there is exactly one breaking change: disabling thinking at xhigh or max effort returns a 400. Here's what changed and what to do about it.",
    readTime: 8,
    cluster: 'Models & Pricing',
    audience: ['developer'],
    termSlug: 'large-language-model',
    body: `Claude Opus 5 (\`claude-opus-5\`) launched on July 24, 2026. It replaces Claude Opus 4.8 as Anthropic's flagship model at the same price: **$5 per million input tokens, $25 per million output tokens**.

The specs:

| | Claude Opus 5 |
|---|---|
| Model ID | \`claude-opus-5\` |
| Context window | 1M tokens (both default and maximum) |
| Max output | 128k tokens |
| Thinking | On by default |
| Effort levels | \`low\`, \`medium\`, \`high\` (default), \`xhigh\`, \`max\` |
| Price | $5 / $25 per MTok |
| Prompt cache minimum | 512 tokens |

Anthropic positions it as frontier intelligence at half the cost of [Claude Fable 5](/articles/claude-fable-5), which runs $10/$50.

## The migration is a one-line change, then two things to check

Swapping the model ID is the whole migration:

\`\`\`python
model = "claude-opus-4-8"  # Before
model = "claude-opus-5"    # After
\`\`\`

Then check two behavior changes.

### 1. Thinking is on by default

On Opus 4.8, a request without a \`thinking\` field ran without thinking. On Opus 5, the same request runs **with** thinking — the model decides when and how much to think on each turn.

The practical consequence is about \`max_tokens\`. That parameter is a hard cap on *total* output, and thinking tokens count against it. If you tuned \`max_tokens\` tightly for a workload that ran without thinking on Opus 4.8, the model now has less room for its actual response.

Revisit \`max_tokens\` on any workload you migrate. If you were running at 4,000 and the answers suddenly truncate, that's why.

\`thinking: {"type": "adaptive"}\` still works and is equivalent to the default — no need to add it.

### 2. Disabling thinking now depends on effort (this is the breaking change)

On Opus 5, \`thinking: {"type": "disabled"}\` is only accepted when effort is \`high\` or below. Pair it with \`xhigh\` or \`max\` and you get a **400 error**.

\`\`\`python
# 400 error on Opus 5
client.messages.create(
    model="claude-opus-5",
    max_tokens=8000,
    thinking={"type": "disabled"},
    output_config={"effort": "max"},   # ← xhigh or max + disabled = 400
    messages=[{"role": "user", "content": "..."}],
)
\`\`\`

Two ways out. Either keep thinking disabled and drop effort to \`high\` or below, or keep the effort level and remove the \`thinking\` field entirely.

This is enforced per request, and it's generally available behavior — not a beta flag you can opt out of.

Anthropic also notes that with thinking disabled, Opus 5 sometimes writes a tool call into its text output instead of emitting a proper \`tool_use\` block, or leaks internal XML tags into the visible response. The recommended path is to leave thinking on and control cost with a lower effort level instead.

## Effort is the parameter to actually tune

The headline claim about Opus 5 is that it converts extra effort into better results more reliably than any earlier Opus model. That makes the effort ladder the main thing you tune, rather than something you set once and forget.

\`\`\`python
response = client.messages.create(
    model="claude-opus-5",
    max_tokens=64000,
    output_config={"effort": "max"},
    messages=[{"role": "user", "content": "..."}],
)
\`\`\`

The practical approach:

- **Start at \`high\`** — that's the default.
- **Step down to \`medium\` or \`low\`** where your evals show quality holds. Anthropic specifically calls out that low and medium effort on Opus 5 produce strong quality at a fraction of the tokens and latency. This is where the cost savings are.
- **Step up to \`xhigh\` or \`max\`** for capability-critical work only.

One thing to get right: when running at \`xhigh\` or \`max\`, set a large \`max_tokens\`. The model needs room to think and act across subagents and tool calls, and a tight cap will cut it off mid-work. The docs use 64,000 in their example.

## Behavior differences you'll notice without changing code

These aren't API changes, but they'll show up in output:

- **Responses run longer.** Default user-facing answers and written deliverables are more verbose than Opus 4.8.
- **It narrates more.** In agentic sessions, the model reports its progress to the user more often.
- **It delegates more readily.** In multi-agent setups, it hands work to subagents sooner.
- **It verifies its own work unprompted.** This one matters: if your prompts carry instructions like *"include a final verification step"* or *"use a subagent to verify"* from earlier models, **remove them**. On Opus 5 they cause over-verification — the model checks its work twice and burns tokens doing it.

That last point is the most common carried-over mistake when migrating. Grep your prompts for verification instructions before you ship.

## Smaller wins

**Prompt cache minimum dropped to 512 tokens**, down from 1,024 on Opus 4.8. Prompts that were too short to cache before now create cache entries with no code changes on your side. If you have a lot of short system prompts, this is free savings.

**Mid-conversation tool changes (beta).** You can add or remove tools between turns while preserving the prompt cache, instead of resending a fixed tool list for the life of a session. Requires the \`mid-conversation-tool-changes-2026-07-01\` beta header.

**Default fallbacks mode.** The \`fallbacks\` parameter now accepts \`"default"\`, which applies Anthropic's recommended fallback models by refusal category rather than a list you maintain. Requires the \`server-side-fallback-2026-07-01\` beta header. If you built fallback handling after the [Fable 5 suspension](/articles/when-your-ai-model-disappears), this replaces your hand-maintained model list.

**Fast mode** is available for Opus 5 on the Claude API only — not on Bedrock, Google Cloud, or Microsoft Foundry — at $10/$50 per MTok.

## Where you can run it

Claude API, Amazon Bedrock (\`anthropic.claude-opus-5\`), Google Cloud, and Microsoft Foundry. Opus 4.8 remains available on all of them, so there's no forced migration deadline.

## One thing that broke on the same day

Anthropic **removed fast mode for Claude Opus 4.7** on July 24. Requests to \`claude-opus-4-7\` with \`speed: "fast"\` now return an error — and unlike the Opus 4.6 removal a month earlier, they do *not* silently fall back to standard speed. Opus 4.7 itself still works at standard speed.

If you have anything still pinned to \`claude-opus-4-7\` with fast mode on, it is failing right now. Migrate to Opus 5 or Opus 4.8.

## What to do this week

1. Change the model ID on one non-critical workload and run your evals.
2. Check \`max_tokens\` — thinking now eats into it.
3. Grep your prompts for "verify" instructions and delete the ones aimed at earlier models.
4. If you disable thinking anywhere, confirm the effort level is \`high\` or below.
5. Try dropping to \`medium\` effort on a workload where quality has headroom, and compare cost.

---

**Related reading**

- [Choosing the right Claude model](/articles/choosing-the-right-claude-model) — the decision framework
- [Claude Sonnet 5](/articles/claude-sonnet-5) — the new default for everyday work
- [Claude Opus 4.8](/articles/claude-opus-4-8) — the model Opus 5 replaces
- [Claude cost optimization](/articles/claude-cost-optimization) — where effort levels fit in a cost strategy

---

*Source: [What's new in Claude Opus 5](https://platform.claude.com/docs/en/about-claude/models/whats-new-opus-5) and the [Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview), July 24, 2026.*`,
  },

  {
    slug: 'claude-sonnet-5',
    angle: 'update',
    title: 'Claude Sonnet 5: the new default, at a discount until August 31',
    excerpt: "Claude Sonnet 5 launched June 30, 2026 and is now the default model on Free and Pro. It runs at introductory pricing of $2/$10 per million tokens through August 31, then goes to $3/$15. Three things break when you migrate from Sonnet 4.6, and a new tokenizer means the same text costs about 30% more tokens.",
    readTime: 7,
    cluster: 'Models & Pricing',
    audience: ['developer'],
    termSlug: 'large-language-model',
    body: `Claude Sonnet 5 (\`claude-sonnet-5\`) launched on June 30, 2026. It is now the default model on Free and Pro plans, and it's available on Max, Team, Enterprise, Claude Code, and the Claude API.

| | Claude Sonnet 5 |
|---|---|
| Model ID | \`claude-sonnet-5\` |
| Context window | 1M tokens |
| Max output | 128k tokens |
| Thinking | Adaptive, on by default |
| Price (through Aug 31, 2026) | $2 / $10 per MTok |
| Price (from Sep 1, 2026) | $3 / $15 per MTok |
| Priority Tier | Not available |

## The pricing has a clock on it

This is the part worth putting in a calendar. Sonnet 5 runs at **$2 input / $10 output per million tokens through August 31, 2026**. On September 1 it goes to the standard **$3 / $15**.

That's a 50% increase on both input and output, arriving on a specific date. If you are modelling costs for a Sonnet 5 workload right now, model the September number, not the July one. Teams that budget off introductory pricing get an unpleasant surprise in the first September invoice.

For comparison, Sonnet 4.6 ran at $3/$15 — so the standard Sonnet 5 price is flat versus the model it replaces. The discount is genuinely a discount, not a repricing.

## Three things break when you migrate from Sonnet 4.6

### 1. Adaptive thinking is on by default

Same change as [Opus 5](/articles/claude-opus-5): requests now run with thinking unless you say otherwise. Because \`max_tokens\` caps total output including thinking tokens, revisit that value on anything you migrate.

### 2. Manual extended thinking is gone

\`\`\`python
# 400 error on Sonnet 5
thinking={"type": "enabled", "budget_tokens": 10000}
\`\`\`

Manual thinking budgets were deprecated on Sonnet 4.6 and are now **removed**. Passing \`thinking: {type: "enabled", budget_tokens: N}\` returns a 400 error. Adaptive thinking replaces it — the model chooses its own depth, and you steer with the effort parameter instead of a token budget.

### 3. Sampling parameters return an error

\`\`\`python
# 400 error on Sonnet 5
temperature=0.7
top_p=0.9
top_k=40
\`\`\`

Setting \`temperature\`, \`top_p\`, or \`top_k\` to any non-default value returns a 400. This catches people out, because temperature-tuning is one of the oldest habits in LLM work and a lot of older code sets \`temperature=0\` reflexively for "deterministic" output.

If your codebase has a shared client wrapper that sets temperature on every call, that wrapper will break every Sonnet 5 request. Check it before you migrate, not after.

## The tokenizer change is a real cost line

Sonnet 5 uses the tokenizer introduced with Opus 4.7. Compared to models before Opus 4.7, **the same text produces roughly 30% more tokens.**

This is not a price change, but it lands on your bill like one. A prompt that counted 10,000 tokens on Sonnet 4.6 may count around 13,000 on Sonnet 5. The exact increase depends on your content — code, non-English text, and structured data all shift differently.

Two things follow:

- **Re-measure, don't estimate.** Use the token counting API with \`model: "claude-sonnet-5"\` against your real prompts. A blanket 30% assumption will be wrong for your specific workload in one direction or the other.
- **Check your context headroom.** If you were running near a context limit on Sonnet 4.6, the same input may not fit the same way. The 1M window gives most workloads plenty of room, but anything that was already tight deserves a look.

Combined with the introductory pricing, the net effect through August is still cheaper than Sonnet 4.6 for most workloads. From September, run the numbers again with the new tokenizer counts and the $3/$15 rate.

## No Priority Tier

Sonnet 5 supports the same tools and platform features as Sonnet 4.6 with one exception: **Priority Tier is not available.** If you pay for Priority Tier to get guaranteed capacity during traffic spikes, that does not extend to Sonnet 5. This is the one reason a production workload might reasonably stay on Sonnet 4.6 for now.

## What actually got better

Anthropic reports substantial gains over Sonnet 4.6 in multi-step reasoning, tool use, coding, and knowledge work. The specific thing early testers highlighted: completing complex agentic workflows end to end, and self-verifying without being told to.

That last behavior carries the same caveat as Opus 5 — if your prompts contain instructions telling the model to verify its work, they were written for an older model and now cause redundant checking. Remove them.

## Migration checklist

1. Search your code for \`temperature\`, \`top_p\`, and \`top_k\`. Remove non-default values, especially in shared client wrappers.
2. Search for \`budget_tokens\`. Remove it.
3. Re-run token counting against real prompts with \`model: "claude-sonnet-5"\`.
4. Recheck \`max_tokens\` now that thinking counts against it.
5. Confirm nothing you're migrating depends on Priority Tier.
6. Put **September 1** in the calendar as the date your Sonnet 5 spend rises 50%.

---

**Related reading**

- [Claude Opus 5](/articles/claude-opus-5) — the new flagship
- [Choosing the right Claude model](/articles/choosing-the-right-claude-model) — Sonnet vs Opus vs Haiku
- [Claude cost optimization](/articles/claude-cost-optimization) — controlling spend
- [Minimising token usage](/articles/minimising-token-usage) — matters more under the new tokenizer

---

*Source: [Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview), June 30, 2026, and [Introducing Claude Sonnet 5](https://www.anthropic.com/news).*`,
  },

  {
    slug: 'claude-science',
    angle: 'update',
    title: 'Claude Science: a research workbench, not a new model',
    excerpt: "Anthropic launched Claude Science on June 30, 2026 — a workbench that puts 60+ scientific databases, computing tools, and research workflows in one environment. It runs on existing Claude models, and it's in beta for every paid plan. Here's what it is, who it's actually for, and what it signals about where Anthropic is going.",
    readTime: 6,
    cluster: 'Features & Updates',
    audience: ['operator'],
    termSlug: 'claude',
    body: `Anthropic launched **Claude Science** on June 30, 2026. It is a workbench for computational research: one environment that connects to 60+ scientific databases, analysis tools, and research workflows, with an AI assistant that coordinates work across them.

The clearest way to describe it: Claude Science is to scientific research what [Claude Code](/articles/claude-code-vs-web-app) is to software engineering. Give it a high-level instruction, and it carries out multi-step work — writing and running code on compute clusters, pulling from databases, and assembling results.

## It is not a new model

This is the detail most coverage buried, and it's the one that determines whether you care.

Claude Science runs on **existing Claude models** — Opus 4.8 among them. There is no special biology model, no gated access tier, no separate capability. What's new is the environment: the connections, the tools, and the workflow layer around the model.

If you were expecting a science-specialised model along the lines of OpenAI's GPT-Rosalind (April 2026, fine-tuned for biological reasoning), this isn't that. It's a product built on models you already have.

## What's actually in it

- **60+ scientific databases**, connected and queryable from one place — the genetics, chemistry, and protein biology sources used in drug discovery work.
- **Compute cluster access**, so the assistant can write and run analysis code rather than describing what code you should write.
- **An assistant that acts as project manager**, coordinating across the databases and tools rather than answering one question at a time.
- **Reproducibility as a design priority** — results carry their sources so a researcher can verify how a conclusion was reached.

The problem it targets is specific: a computational biologist's day involves moving between a dozen databases, several analysis tools, a notebook, and a cluster terminal. Claude Science collapses that into one surface.

## Who it's for

Primarily scientists in molecular and cellular biology and drug development. Anthropic announced it at an event for pharmaceutical executives, biotech founders, and researchers, and the tool coverage reflects that focus.

It can be pointed at other scientific fields, but the database connections are weighted heavily toward life sciences right now.

**Availability:** beta, included for all paid Claude subscribers — Pro, Max, Team, and Enterprise. Not a separate SKU, not an add-on.

## Why this matters even if you don't do science

Three things worth noticing, whatever your job is.

**1. This is the "vertical workbench" pattern, and it will spread.** Claude Code proved that a domain-specific environment wrapped around a general model beats a general chat interface for serious work in that domain. Claude Science is the second instance of that pattern. If it works, expect the same shape aimed at other domains where practitioners currently juggle a dozen tools — legal research, financial analysis, clinical operations. The lesson for anyone building internal AI tooling: the model is increasingly the commodity, and the connected environment is the product.

**2. It's included, not upsold.** A flagship product landing inside existing paid plans rather than as a new tier tells you Anthropic is competing on breadth of included capability. That's relevant when you're comparing plan value against Google or OpenAI.

**3. Anthropic is using it on itself.** Alongside the launch, Anthropic announced it is running its own research programmes into drugs for rare and neglected diseases using the product. Whatever else that is, it's a company betting its own research output on the tool it just shipped.

## The competitive picture

Claude Science lands in a three-way race:

- **OpenAI** released GPT-Rosalind in April 2026 — a model fine-tuned for biological reasoning.
- **Google** launched Gemini for Science at I/O in May 2026, bundling AlphaFold and AlphaGenome with 30+ databases.
- **Anthropic** now ships Claude Science with 60+ databases on general-purpose models.

Two different bets. OpenAI is betting on a specialised model. Google and Anthropic are betting the environment matters more than the model. Anthropic's version is the only one included with a standard paid consumer plan.

There is also a business context worth naming: Anthropic is expanding revenue lines ahead of an anticipated IPO. Claude Science widens the set of professional buyers who have a reason to be on a paid plan.

## What to do with this

If you work in or near life sciences research, it's in your existing plan — open it and point it at a workflow you currently do by hand across three tools.

If you don't, treat it as a signal about product direction rather than something to adopt. The transferable question is the one it raises for your own organisation: *which of our roles spends its day moving between a dozen systems, and what would a single connected environment for that role look like?*

That's the question Claude Code answered for engineers and Claude Science is answering for scientists. It's a good question to ask about your own team.

---

**Related reading**

- [Claude Opus 5](/articles/claude-opus-5) — the current flagship model
- [Connectors and skills](/articles/connectors-skills-role) — how Claude reaches external systems
- [What to build with Claude](/articles/what-to-build-with-claude) — picking the right first project
- [Deep research guide](/articles/deep-research-guide) — Claude's research workflow

---

*Sources: [MIT Technology Review](https://www.technologyreview.com/2026/06/30/1139987/claude-science-is-anthropics-newest-flagship-product/), [Endpoints News](https://endpoints.news/anthropic-debuts-claude-science-an-ai-product-for-bioscience/), and [Anthropic](https://www.anthropic.com/news), June 30, 2026.*`,
  },
]

async function seed() {
  console.log('Seeding Batch 91 — Claude Opus 5, Claude Sonnet 5, Claude Science...\n')

  for (const a of articles) {
    const term = await getTermId(a.termSlug)
    if (!term) {
      console.error(`  ✗ Term not found: ${a.termSlug}`)
      continue
    }

    const payload = {
      slug:      a.slug,
      angle:     a.angle,
      title:     a.title,
      excerpt:   a.excerpt,
      body:      a.body,
      read_time: a.readTime,
      cluster:   a.cluster,
      term_id:   term.id,
      term_name: term.name,
      term_slug: a.termSlug,
      published: true,
    }

    const { error } = await sb.from('articles').upsert(payload, { onConflict: 'slug' })

    if (error) {
      console.error(`  ✗ ${a.slug}: ${error.message}`)
    } else {
      console.log(`  ✓ ${a.slug}`)
    }
  }

  console.log('\nDone.')
}

seed().catch(console.error)
