/**
 * Batch 82 — Anthropic announcements (May 28 – June 2, 2026)
 *
 * 1. claude-opus-4-8
 *    Claude Opus 4.8 launched May 28, 2026. Most capable GA model.
 *    Same $5/$25 pricing as 4.7. Effort defaults to high. 1M context default,
 *    128k max output. Fast mode 3x cheaper / 2.5x faster. Mid-conversation
 *    system messages. Beats GPT-5.5 on 12 benchmarks. Migration from 4.7 is a
 *    model-name swap (same tools/features). Cluster: Models & Pricing.
 *
 * 2. claude-code-dynamic-workflows
 *    Dynamic Workflows (research preview) — Claude authors a multi-step plan
 *    and orchestrates tens-to-hundreds (up to ~1000) of subagents in the
 *    background. For codebase-scale migrations. Distinct from sub-agents,
 *    Agent Teams, and `claude agents`. Cluster: Claude Code.
 *
 * 3. claude-subscription-credit-changes
 *    June 15, 2026 billing change (announced May 14). Programmatic usage
 *    (Agent SDK, claude -p, Code GitHub Actions, third-party Agent SDK apps)
 *    moves off the subscription rate-limit pool onto a separate monthly
 *    dollar credit metered at API list prices. What changes, the numbers,
 *    and what to do before June 15. Cluster: Models & Pricing.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-82.ts
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

const ARTICLES = [

  // ── 1. Claude Opus 4.8 ───────────────────────────────────────────────────
  {
    termSlug: 'large-language-model',
    slug: 'claude-opus-4-8',
    angle: 'update',
    title: "Claude Opus 4.8: what's new, and why migration is easy this time",
    excerpt:
      "Anthropic's new flagship launched May 28, 2026. Pricing is unchanged at $5/$25. Effort now defaults to high, fast mode is 3x cheaper, and a 1M context window ships by default. Unlike the 4.6→4.7 jump, there are no new breaking changes — moving from Opus 4.7 is a model-name swap.",
    readTime: 8,
    cluster: 'Models & Pricing',
    body: `Claude Opus 4.8 launched May 28, 2026. It is Anthropic's most capable generally available model, and the model ID is \`claude-opus-4-8\`. Pricing is unchanged from Opus 4.7: $5 per million input tokens, $25 per million output tokens. It is available on the Claude API, Amazon Bedrock, Google Cloud Vertex AI, and Microsoft Foundry.

The headline for anyone already on Opus 4.7: this is the easy upgrade. Opus 4.8 supports the same set of tools and platform features as 4.7, and there are no new API breaking changes. If your code already runs on Opus 4.7, switching is a model-name swap — change \`claude-opus-4-7\` to \`claude-opus-4-8\` and re-test.

## What's new

**Effort defaults to high.** On Opus 4.8 the [effort parameter](https://platform.claude.com/docs/en/build-with-claude/effort) defaults to \`high\` across every surface — Claude Code and the Messages API included. On 4.7 you had to opt into higher effort; now the strong default is the floor, and you dial *down* (\`low\`, \`medium\`) when you want speed. The full ladder is \`low\`, \`medium\`, \`high\`, \`xhigh\`, \`max\`.

**1M token context by default.** The 1M token context window is on by default on the Claude API, Bedrock, and Vertex AI (200k on Microsoft Foundry) at standard pricing — no beta header. Maximum output is 128k tokens.

**Smarter adaptive thinking.** With [adaptive thinking](https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking) enabled, Opus 4.8 triggers reasoning only when a turn actually needs it. At the same effort level, it spends fewer thinking tokens than 4.7 — you pay for reasoning where it helps and skip it where it doesn't.

**Fast mode, 3x cheaper.** [Fast mode](https://platform.claude.com/docs/en/build-with-claude/fast-mode) for Opus 4.8 runs at roughly 2.5x the speed of standard generation and is priced at $10/$50 per million tokens — three times cheaper than fast mode on previous Opus models. It is a research preview on the Claude API; in Claude Code, Max-plan users now default to fast mode on Opus 4.8. (Fast mode for Opus 4.6 is deprecated, with removal about 30 days after launch — migrate to 4.8 or 4.7.)

**Mid-conversation system messages.** You can now send \`role: "system"\` messages *after* a user turn, in the middle of a long-running session, to change instructions without breaking your [prompt cache](https://platform.claude.com/docs/en/build-with-claude/prompt-caching). Previously, changing the system prompt mid-session invalidated the cache from that point on. No beta header required. This matters for long agent loops where the rules shift partway through a task.

**Lower cache threshold.** The minimum cacheable prompt length drops to 1,024 tokens on Opus 4.8 (it was higher on 4.7), so more of your prompts qualify for caching.

**Documented refusal categories.** Refusal responses now expose a \`stop_details\` field with a \`category\` (\`cyber\`, \`bio\`, or \`null\`) and a human-readable \`explanation\`, so your app can route different classes of refusal to the right next step instead of treating every block the same.

## How it performs

Anthropic reports Opus 4.8 outperforms GPT-5.5 on at least 12 benchmarks. The two most relevant to practitioners:

- **Agentic coding** — SWE-Bench Pro: 69.2% (vs. 58.6% for GPT-5.5).
- **Computer use** — OSWorld-Verified: 83.4% (vs. 78.7% for GPT-5.5). On the Online-Mind2Web browser-agent benchmark it scores 84%.

Two quality claims worth noting for production work. Anthropic says 4.8 is about **4x less likely than 4.7 to let a code flaw pass unremarked** in review — directly relevant if you use Claude for code review or [security scanning](/articles/claude-security). And it reports improved **honesty**: 4.8 is better at flagging its own uncertainty and avoiding confident, unsupported claims — the failure mode behind most [hallucination](/articles/claude-hallucination-prevention) incidents.

## What carries over from 4.7

These were introduced with Opus 4.7 and still apply, so if you migrated to 4.7 you've already handled them:

- **Sampling parameters are gone.** Setting \`temperature\`, \`top_p\`, or \`top_k\` to a non-default value returns a 400 error. Use structured outputs or prompt instructions for determinism instead.
- **High-resolution vision.** Images up to 2,576 pixels on the long edge (~3.75 MP). Full-resolution images cost more tokens — budget accordingly.
- **Task budgets, advisor tool, computer use** all support 4.8.

If you are still on Opus 4.6 or earlier, read [Migrating from Opus 4.6 to Opus 4.7](/articles/migrating-to-claude-4-7) first — those breaking changes (extended thinking removal, prefill removal, the new tokenizer) apply on the way to 4.8 as well.

## The biggest new capability isn't in the model

Alongside Opus 4.8, Claude Code shipped **Dynamic Workflows** (research preview): Claude can now author a multi-step plan and orchestrate work across tens — up to roughly a thousand — subagents running in the background, for jobs like a codebase-scale migration. That's a large enough shift to cover on its own: see [Dynamic Workflows in Claude Code](/articles/claude-code-dynamic-workflows).

## Who should upgrade, and when

**Now, if you're on Opus 4.7.** It's a model-name swap with no new breaking changes. Re-test because the *defaults changed* (effort is now \`high\`, which can raise latency and token use on simple calls) — but there's no code to rewrite.

**After a test pass, if you have tuned 4.7 prompts in production.** The honesty and effort-calibration changes can shift outputs. Run your [eval suite](/articles/writing-evals-that-catch-regressions) before flipping the default.

Full migration guidance: [platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-8](https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-8)

## Try this today

Swap one non-critical service to \`claude-opus-4-8\`, leave everything else identical, and watch two numbers for a day: cost per request (effort now defaults to \`high\`, so this may rise) and your escaped-error or eval-pass rate. If quality climbs and cost is acceptable, roll it forward. If cost jumps on simple calls, set \`effort: "medium"\` on those routes — you don't have to take the new default everywhere.`,
  },

  // ── 2. Dynamic Workflows in Claude Code ──────────────────────────────────
  {
    termSlug: 'claude-code',
    slug: 'claude-code-dynamic-workflows',
    angle: 'update',
    title: 'Dynamic Workflows in Claude Code: when Claude orchestrates its own agent swarm',
    excerpt:
      "Shipped with Opus 4.8 as a research preview, Dynamic Workflows let Claude write a multi-step plan and fan it out across tens to hundreds of subagents running in the background. It's built for work one context window can't hold — codebase-wide migrations, sweeping audits. Here's what it is, how it differs from sub-agents and Agent Teams, and when it's worth the token bill.",
    readTime: 7,
    cluster: 'Claude Code',
    body: `Dynamic Workflows shipped with Claude Opus 4.8 on May 28, 2026, as a research preview in Claude Code. The idea: instead of you breaking a large job into pieces and dispatching them, Claude writes a structured multi-step plan itself and orchestrates the work across many subagents running in the background — tens, hundreds, up to roughly a thousand for the largest jobs.

This is aimed at work a single agent in a single context window cannot do well: migrating a pattern across hundreds of thousands of lines of code, auditing every file in a large repo, or running the same transform over a long list of items where doing them one at a time would take all day.

## What it actually is

A workflow is a deterministic script that fans work out across subagents. Claude authors the script — what runs in parallel, what runs in sequence, what verifies the result — and then executes it. The building blocks are simple:

- **Fan-out (parallel).** Run many subagents at once — one per file, per module, per item — and collect their results.
- **Pipeline.** Push each item through several stages (find → fix → verify) independently, so one item can be in stage three while another is still in stage one.
- **Phases.** Group the work so you can see progress: "Scanning 340 files," then "Applying fixes," then "Verifying."

Each subagent gets its own context window, its own prompt, and its own slice of the job. The lead agent stitches the results back together. Because the plan is a script and not a freeform conversation, the same job runs the same way each time — that determinism is the point.

## How it differs from what you already have

Claude Code now has several ways to run more than one agent, and they're easy to conflate:

| Feature | Who plans the work | Best for |
|---|---|---|
| **Sub-agents** | You invoke one for a scoped task | Delegating a single side-quest (search, review) |
| [**Agent Teams**](/articles/claude-code-agent-teams) | You define named roles up front | A fixed division of labor you reuse |
| [**\`claude agents\`**](/articles/claude-agents-command) | You launch parallel tasks by hand | Running several independent jobs at once in the terminal |
| **Dynamic Workflows** | **Claude** writes and runs the plan | One large job decomposed into many similar pieces |

The distinction that matters: with Agent Teams and \`claude agents\`, *you* decide the structure. With Dynamic Workflows, Claude decides the structure — it looks at the job, writes the fan-out plan, and runs it. You approve the plan, not each step.

## When it's worth it — and when it isn't

**Worth it:** the job is large, repetitive, and decomposable. "Rename this API across the whole monorepo." "Add the new license header to every source file." "Find every place we call the deprecated client and migrate it." These are tasks where the work is mostly the same shape repeated hundreds of times, and where parallelism turns hours into minutes.

**Not worth it:** the job is small, or it's a tightly-coupled change where every edit depends on the last. Spinning up a swarm to edit three files is slower and more expensive than just doing it. And a deeply sequential refactor — where step 5 can't be written until step 4 is reviewed — doesn't parallelize, so a workflow buys you nothing.

## The cost model, stated plainly

Parallel agents mean parallel context windows. Ten subagents reading the codebase is roughly ten times the input tokens of one agent reading it once, and up to ~1,000 subagents is a real bill. Opus 4.8 also defaults to \`high\` effort, which raises per-call token use further. None of this is hidden — but it's easy to launch a workflow over a large repo and be surprised by the token count.

Two habits keep it sane:

1. **Scope the input.** Point the workflow at the directory or file set that actually needs the change, not the whole repo, so subagents aren't re-reading code that won't be touched.
2. **Watch the run.** Use [\`/usage\`](/articles/claude-code-may-2026-updates) to see the token breakdown mid-session, and stop a workflow that's ballooning rather than letting it run to completion.

This is the same discipline that separates productive Claude Code use from the [antipattern](/articles/claude-code-antipatterns) of letting context and cost run unchecked — just at a larger scale, because a workflow multiplies whatever a single agent would have spent.

## Getting it

Dynamic Workflows arrived in the Claude Code v2.1.154 range alongside Opus 4.8 support. As a research preview, expect the surface to change. The official docs live at [code.claude.com/docs](https://code.claude.com/docs).

## Try this today

Pick a genuinely repetitive chore you've been avoiding — a mechanical rename, a header insertion, a deprecated-call migration — scoped to one directory. Ask Claude Code to plan a workflow for it, **read the plan before approving**, and run it on that one directory. You'll learn more about where workflows help (and where they overspend) from one real scoped run than from any amount of reading.`,
  },

  // ── 3. June 15 subscription billing change ───────────────────────────────
  {
    termSlug: 'claude-code',
    slug: 'claude-subscription-credit-changes',
    angle: 'update',
    title: "Claude's June 15 billing change: programmatic usage moves to a separate credit pool",
    excerpt:
      "From June 15, 2026, Agent SDK, `claude -p`, Claude Code GitHub Actions, and third-party agent apps stop drawing from your subscription's usage limits and start drawing from a separate monthly dollar credit, metered at API list prices. Interactive Claude Code and web chat are unchanged. Here's exactly what changes, the credit per plan, and what to do before the deadline.",
    readTime: 6,
    cluster: 'Models & Pricing',
    body: `Anthropic announced on May 14, 2026 that programmatic Claude usage is splitting off from subscription rate limits. The change takes effect **June 15, 2026**. If you run agents, scripts, or CI against your Claude Pro, Max, or Team subscription, this changes your bill and possibly your behavior — so it's worth understanding before the deadline rather than after.

## What's changing

Today, programmatic Claude usage draws from the same pool as your interactive chat — your subscription's rate limits cover both. From June 15, programmatic usage moves to a **separate, dollar-denominated monthly credit**, metered at standard API list prices.

**What counts as "programmatic" (moves to the new credit pool):**

- The **Claude Agent SDK** running in your scripts and projects
- **\`claude -p\`** — the headless / non-interactive mode of Claude Code
- **Claude Code GitHub Actions**
- **Third-party apps** that authenticate using Agent SDK credentials (this is the path that lets tools like OpenClaw and editor integrations run on your subscription)

**What stays exactly the same (still covered by your normal subscription limits):**

- Interactive Claude Code in your terminal
- Claude web and desktop chat

The simple rule: if a human is sitting there typing, it's unchanged. If code is calling Claude on its own, it now spends from the credit pool.

## The numbers

Each plan gets a fixed monthly credit, billed at full API list rates:

| Plan | Monthly programmatic credit |
|---|---|
| Pro | $20 |
| Max 5x | $100 |
| Max 20x | $200 |
| Team Standard | $20 / seat |
| Team Premium | $100 / seat |

Three things to internalize about the credit:

1. **It's per user, not pooled.** A 10-seat Team Standard plan does not get $200 in one shared bucket — each person gets their own $20.
2. **It resets monthly with no rollover.** Unused credit disappears at the end of the cycle.
3. **It's metered at API list prices**, not at some discounted subscription rate. $20 of credit buys $20 of API usage — which, with Opus, is not a lot of agent runs.

## Why Anthropic is doing this

The honest framing: this ends a period of uncapped, subsidized programmatic access. A subscription was a flat monthly fee, and some users were running heavy automated workloads — agents looping for hours, CI pipelines calling Claude on every commit — that cost far more in compute than the subscription brought in. Moving programmatic usage to metered credit aligns the price with the cost. For light programmatic users the included credit may cover everything; for heavy ones it's effectively a large price increase, because past that credit you pay API rates per token.

## What to do before June 15

1. **Watch for the claim email (around June 8).** Anthropic is sending an email to claim your credits. Don't ignore it.
2. **Audit your real programmatic spend at API rates.** Before the change lands, get a number: how much would your current Agent SDK / \`claude -p\` / GitHub Actions usage cost at API list prices per month? If it's under your plan's credit, you're fine. If it's over, you have a decision to make. The [\`/usage\`](/articles/claude-code-may-2026-updates) command and the [Usage & Cost API](/articles/claude-rate-limits-api) help you measure this.
3. **Decide your overflow behavior.** There's a "usage credits" toggle that controls what happens when the credit runs out — either stop, or keep going and bill at API rates. Pick deliberately; the default could quietly run up a bill or quietly break a pipeline.
4. **Right-size, or move heavy workloads to the API directly.** If you're well over the credit, a higher plan tier, or a proper API key with its own billing and [rate limits](/articles/rate-limiting-claude-api), may be cleaner than living on overflow.
5. **Brief whoever owns your CI.** GitHub Actions calling \`claude -p\` on every PR is exactly the kind of workload that will eat the credit fast. The person who set that up needs to know before June 15, not after the first surprised invoice.

## Who this hits hardest

If you're an [Agent Operator](/articles/what-is-an-agent-operator) running production agents off a subscription, or a developer with Claude wired into CI, this is a real operational change — model it now. If you only ever use Claude by typing in the terminal or the web app, you can stop reading: nothing about your usage changes.

## Try this today

Open a terminal and run \`claude /usage\`, or pull last month's programmatic usage from the [Usage & Cost API](/articles/claude-rate-limits-api), and write down one number: your monthly programmatic spend at API list prices. Compare it to your plan's credit from the table above. That single comparison tells you whether June 15 is a non-event or a thing you need to act on this week.`,
  },

]

async function seed() {
  console.log('Seeding Batch 82 — Claude Opus 4.8 + Dynamic Workflows + June 15 billing change...\n')

  for (const a of ARTICLES) {
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
      tier:      3,
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
