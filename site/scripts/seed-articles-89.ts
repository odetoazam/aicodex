/**
 * Batch 89 — Anthropic announcements (June 30 – July 1, 2026)
 *
 * 1. claude-sonnet-5  (NEW)
 *    Launched June 30, 2026 (`claude-sonnet-5`). Anthropic's most agentic Sonnet,
 *    positioned as a cheaper way to run agents. Intro $2/$10 per MTok through
 *    Aug 31 (then $3/$15). 1M context, 128k output. Three migration changes from
 *    Sonnet 4.6: adaptive thinking on by default, manual extended thinking removed
 *    (400), non-default sampling params (400). New tokenizer (~30% more tokens).
 *    Default model for Free + Pro from July 1. DEV_SLUGS + PINNED_DEV pos 1.
 *    Cluster: Models & Pricing. Angle: update. Term: large-language-model.
 *
 * 2. claude-science  (NEW)
 *    Beta June 30, 2026 (macOS + Linux). A vertical Claude product for scientists —
 *    "Claude Code for research." 60+ scientific skills/connectors, 60+ databases,
 *    native 3D protein / genome / chemistry rendering, compute across laptop / HPC /
 *    on-demand GPU (Modal), reproducible outputs with full code history + a reviewer
 *    (critic) agent. Pro/Max/Team/Enterprise; discounted Team for academic labs.
 *    PRODUCTIVITY_SLUGS. Cluster: Features & Updates. Angle: update. Term: claude.
 *
 * 3. claude-fable-5  (PATCH — banner + pricing-clock note)
 *    July 1, 2026: US Commerce removed the June 12 export controls; Anthropic
 *    restored Fable 5 + Mythos 5. Flip the top banner from "suspended" to
 *    "restored" and clear the on-hold note in the pricing section.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-89.ts
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
    slug: 'claude-sonnet-5',
    angle: 'update',
    title: 'Claude Sonnet 5: near-Opus agents at a third of the price',
    excerpt: "Anthropic launched Claude Sonnet 5 on June 30, 2026 and made it the default model for Free and Pro the next day. It runs agents — planning, tool use, long autonomous tasks — at close to Opus 4.8 quality for a fraction of the cost: $2/$10 per million tokens through August 31. Three migration changes and a new tokenizer are the things to check before you swap the model string.",
    readTime: 7,
    cluster: 'Models & Pricing',
    audience: ['developer'],
    termSlug: 'large-language-model',
    body: `Claude Sonnet 5 (\`claude-sonnet-5\`) shipped on June 30, 2026 and became the **default model for every Free and Pro user on July 1**. It's the next generation of the Sonnet line — the mid-tier model most production traffic actually runs on — and Anthropic's pitch is specific: it does the agentic work that used to require Opus, at Sonnet cost.

An agentic task is one where the model plans, calls tools like a browser or terminal, checks its own output, and runs for many steps without a human in the loop. Sonnet 4.6 could do this but often stalled on longer chains. Sonnet 5 is built to finish them.

## The specs and the price

| | Claude Sonnet 5 | Claude Sonnet 4.6 | Claude Opus 4.8 |
|---|---|---|---|
| Model ID | \`claude-sonnet-5\` | \`claude-sonnet-4-6\` | \`claude-opus-4-8\` |
| Input price | **$2 / M** (intro) → $3 / M | $3 / M | $5 / M |
| Output price | **$10 / M** (intro) → $15 / M | $15 / M | $25 / M |
| Context window | 1M tokens | 1M tokens | 1M tokens |
| Max output | 128k tokens | 128k tokens | 128k tokens |
| Priority Tier | Not available | Available | Available |

The **introductory pricing — $2 input / $10 output per million tokens — runs through August 31, 2026**, then rises to the standard $3/$15. Even at standard pricing that's the same input price as Sonnet 4.6 for a materially stronger model; through August it's cheaper. Sonnet 5 undercuts Opus 4.8, OpenAI's GPT-5.5, and Google's Gemini 3.1 Pro. It is *not* the cheapest option on the board — Gemini 3.5 Flash is cheaper — but it's the cheapest that runs long agentic chains at this quality.

One caveat for latency-sensitive workloads: **Priority Tier is not available on Sonnet 5.** If you depend on Priority Tier for guaranteed capacity, stay on Sonnet 4.6 or Opus for those paths until it's added.

## How good is it, really

Anthropic's own numbers put Sonnet 5 just below Opus 4.8 on hard agentic work and slightly above it on knowledge work:

- **Agentic coding:** Sonnet 5 scores **63.2%** where Opus 4.8 scores **69.2%**. Opus is still the pick when you need the last few points of accuracy on the hardest tasks.
- **Knowledge work:** Sonnet 5 edges out Opus 4.8.

The practical read from early testers matched the framing. Zapier's team reported that complex multi-part automations that "used to stall halfway" with the prior model now "finished end to end." That's the whole value proposition: not a benchmark record, but a cheaper model that actually completes the long tasks you'd otherwise have paid Opus to run.

The honest routing rule: **default new agentic and general work to Sonnet 5. Reserve Opus 4.8 for the tasks where the top few points of accuracy pay for themselves** — the hardest reasoning, the longest-horizon coding. That inverts the old habit of reaching for Opus first.

## Three changes to check before you migrate

Swapping \`claude-sonnet-4-6\` for \`claude-sonnet-5\` is mostly a string change, but three behavior changes will break code that assumed the old defaults:

**1. Adaptive thinking is on by default.** Sonnet 5 decides per turn whether to reason before answering. You don't enable it. If your app assumed no thinking blocks in the response, handle them now — set \`thinking.display\` to \`"summarized"\` if you want readable summaries, or leave it omitted.

**2. Manual extended thinking is removed.** Passing \`thinking: {type: "enabled", budget_tokens: N}\` now returns a **400 error** (it was deprecated on Sonnet 4.6). Control reasoning depth with the [effort parameter](https://platform.claude.com/docs/en/build-with-claude/effort) instead of a token budget.

**3. Non-default sampling parameters return a 400.** Setting \`temperature\`, \`top_p\`, or \`top_k\` to anything other than the default now errors — same rule already in place on Opus 4.7 and 4.8. If you tuned temperature, remove it.

\`\`\`typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// Correct on Sonnet 5: no manual thinking budget, no temperature override.
const res = await client.messages.create({
  model: "claude-sonnet-5",
  max_tokens: 4096,
  messages: [{ role: "user", content: "Plan and run the migration." }],
  // effort: "high",  // use effort, not thinking.budget_tokens, to go deeper
});
\`\`\`

## The tokenizer tax

Sonnet 5 uses the tokenizer introduced with Opus 4.7. The **same text produces roughly 30% more tokens** than models before 4.7. This is the single most common budgeting mistake when moving to a current-generation model: the per-token price looks lower, but if you're projecting cost off old token counts, you'll under-estimate. Re-measure with the [token counting API](https://platform.claude.com/docs/en/build-with-claude/token-counting) using \`model: "claude-sonnet-5"\` before you trust any cost model. The 30% figure varies with content and workload shape — measure your actual prompts.

## What to do this week

1. **Point your agentic and general traffic at \`claude-sonnet-5\`** and keep Opus 4.8 for your hardest tasks. Write the routing rule down.
2. **Remove any \`temperature\`/\`top_p\`/\`top_k\` overrides and manual \`thinking\` budgets** — they now 400.
3. **Re-measure token counts** under the new tokenizer before trusting your cost projection.
4. **Check Priority Tier dependencies.** If a path relies on it, don't move that path to Sonnet 5 yet.
5. **Lock in the intro price mentally, not structurally** — $2/$10 ends August 31. Budget for $3/$15 after.

## Related reading

- [Claude Opus 4.8: the new default](/articles/claude-opus-4-8) — the model Sonnet 5 now sits just below, and your escalation target
- [Choosing the right Claude model](/articles/choosing-the-right-claude-model) — the routing framework, updated for a stronger Sonnet
- [Claude cost optimization](/articles/claude-cost-optimization) — why "default to Sonnet, escalate to Opus" is a cost decision
- [What to do when your AI model disappears](/articles/when-your-ai-model-disappears) — why every model swap should ride on an alias with a fallback

---

*Source: [Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview) and [What's new in Claude Sonnet 5](https://platform.claude.com/docs/en/about-claude/models/whats-new-sonnet-5), June 30, 2026.*`,
  },
  {
    slug: 'claude-science',
    angle: 'update',
    title: 'Claude Science: Anthropic builds a Claude Code for the lab',
    excerpt: "On June 30, 2026 Anthropic launched Claude Science, a research workbench that pulls scientific tools — databases, compute, visualization, a citation-checking reviewer — into one place the way Claude Code did for software. It's built for genomics, proteomics, and cheminformatics labs, not general knowledge work. Here's what it is, who it's actually for, and the product pattern it signals.",
    readTime: 6,
    cluster: 'Features & Updates',
    audience: ['operator'],
    termSlug: 'claude',
    body: `Claude Science is a research application Anthropic launched in beta on June 30, 2026. The one-line version: it's what Claude Code is for software engineering, pointed at scientific research instead. It runs on macOS and Linux and is available to Claude Pro, Max, Team, and Enterprise subscribers.

This is a specialist product. If you're a marketer, an operator, or a developer building a chatbot, Claude Science is not for your day job — the general Claude apps and API still are. It matters to you as a **signal about where Anthropic is heading**, which is the last section of this piece. But first, what it actually does.

## What it is

Science work is fragmented across tools: one program to pull sequences from a database, another to run an analysis, a third to make a figure, a manuscript editor to write it up, and a compute cluster somewhere to run the heavy jobs. Claude Science is a single environment where an AI agent drives all of those, with the researcher supervising.

It covers the full arc of a study:

- **Literature analysis** — reading and synthesizing prior work.
- **Multi-step experiments** — running analyses that chain many tools together.
- **Data visualization** — with native, in-app rendering of **3D protein structures, genome tracks, and chemical structures**, so you see the biology, not a generic chart.
- **Manuscript preparation** — drafting the write-up.

The target fields are specific: **genomics, single-cell analysis, proteomics, structural biology, and cheminformatics.**

## What's under the hood

Three things make it more than "Claude with a science prompt":

**60+ pre-configured scientific skills and connectors,** wired to **more than 60 scientific databases** — UniProt, the Protein Data Bank (PDB), Ensembl, and the rest of the standard toolkit — so the agent can pull real data instead of guessing at it. Labs can add their own skills and connect proprietary internal tools.

**Compute management across three tiers** — a laptop for light work, an HPC cluster for heavy jobs, or on-demand GPUs through **Modal** — so a long-running job goes to the right hardware without the researcher hand-managing infrastructure.

**A reviewer agent that checks the work.** Claude Science uses **actor–critic agent pairs**: one agent does the analysis, a second checks citations and recalculates numbers before results are trusted. Every output is reproducible, carrying its **complete code history** — the auditable trail that a scientific result needs and a chatbot answer doesn't. This is the feature that separates a research tool from a writing assistant: the output is meant to survive peer review, so it ships with its provenance.

## Availability and the fine print

- **Beta on macOS and Linux**, for Pro, Max, Team, and Enterprise plans.
- A **discounted Team plan** for academic and nonprofit research labs.
- An **AI for Science credits program** offered up to **$30,000 in credits** for selected projects; applications for that program closed **July 15, 2026**.

Anthropic also said it will use Claude Science itself, to pursue research into drugs for rare and neglected diseases — the kind of work that's scientifically tractable but commercially neglected.

## The pattern this signals

Claude Science is the clearest example yet of a strategy worth naming, because it will keep repeating. Anthropic is moving from **one general model you prompt** to **vertical products that wrap the model in the tools, data, and guardrails of a specific kind of work**:

- **Claude Code** wrapped the model in a terminal, a filesystem, and a git workflow — for software.
- **Claude Science** wraps it in scientific databases, compute, and a citation-checking reviewer — for research.

The shared shape is: take the domains where an expert spends most of their time gluing tools together, and build the glue. Expect more of these — for other professions where the work is tool-heavy and the output has to be auditable. If your organization has a function that looks like that (finance, legal, clinical), the useful question isn't "should we use Claude Science" — it's "what would the vertical Claude product for *our* work include, and can we assemble a version of it now with Projects, connectors, and skills?"

## Related reading

- [The six phases of AI adoption](/articles/ai-adoption-phases) — where "vertical product" sits on the curve from individual use to autonomous execution
- [Claude for Creative Work](/articles/claude-for-creative-work) — the same vertical-product move, aimed at design and creative tools
- [Ask Your Org](/articles/ask-your-org-guide) — assembling a domain-specific Claude from connectors, without waiting for a packaged product

---

*Source: [Claude Science, an AI workbench for scientists](https://www.anthropic.com/news/claude-science-ai-workbench), June 30, 2026.*`,
  },
]

// --- Fable 5 banner patch: flip from "suspended" (Jun 29) to "restored" (Jul 1) ---

const FABLE_OLD_BANNER =
  "> **Status update — June 29, 2026: Mythos 5 partially restored; Fable 5 still offline (day 17).** The US government's June 12 export-control directive barred access to Fable 5 and Mythos 5 by any foreign national, and Anthropic disabled both worldwide. On **June 26**, Commerce Secretary Howard Lutnick concluded appropriate safeguards were in place, and the government cleared **Claude Mythos 5 — the stronger cybersecurity model — to be redeployed to a set of US organizations that operate and defend critical infrastructure.** Fable 5 remained banned for general users as of June 29, though Anthropic and outside observers expected US access could return within days. The model still appears in some pickers but returns a \\`currently unavailable\\` error. **All other Claude models (Opus 4.8, Sonnet, Haiku) are unaffected; keep a fallback to Opus 4.8 wired in.** Everything below describes the model as launched — read it as what to expect *if and when access returns*. See [Anthropic's statement](https://www.anthropic.com/news/fable-mythos-access)."

const FABLE_NEW_BANNER =
  "> **Status update — July 1, 2026: Fable 5 and Mythos 5 are back.** On June 30 the US Department of Commerce removed the export-control restrictions it had imposed on June 12, and Anthropic began restoring access to both models on **July 1**, with updated cybersecurity safeguards. \\`claude-fable-5\\` is callable again across the Claude API and cloud platforms; Mythos 5 returns to Project Glasswing participants. The specs, pricing, and refusal handling described below are current again. The lasting lesson from the 19-day outage — a frontier model pulled worldwide three days after launch — is unchanged: anything you run in production needs a fallback model wired in, because a hosted model can vanish for reasons that have nothing to do with you. See the [Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview) and [what to do when your AI model disappears](/articles/when-your-ai-model-disappears)."

const FABLE_OLD_PRICING_NOTE =
  "**Note:** the schedule below is the one Anthropic announced at launch. It is on hold while the June 12 government suspension is in effect (see the status note at the top). The dates may shift once access is restored."

const FABLE_NEW_PRICING_NOTE =
  "**Note:** the free-access window below (through June 22) has passed; Fable 5 now bills at usage credits on subscription plans and at $10/$50 on the API. Access was restored on July 1, 2026 after the June 12–30 government suspension (see the status note at the top)."

async function patchFableBanner() {
  const { data, error } = await sb.from('articles').select('body').eq('slug', 'claude-fable-5').maybeSingle()
  if (error || !data) {
    console.error('  ✗ claude-fable-5: could not read body', error?.message ?? 'not found')
    return
  }
  let body = data.body as string
  let changed = false

  if (body.includes(FABLE_OLD_BANNER)) {
    body = body.replace(FABLE_OLD_BANNER, FABLE_NEW_BANNER)
    changed = true
    console.log('  ✓ claude-fable-5 banner flipped to RESTORED (Jul 1)')
  } else {
    console.warn('  ⚠ claude-fable-5: old banner not found — skipping banner patch')
  }

  if (body.includes(FABLE_OLD_PRICING_NOTE)) {
    body = body.replace(FABLE_OLD_PRICING_NOTE, FABLE_NEW_PRICING_NOTE)
    changed = true
    console.log('  ✓ claude-fable-5 pricing-clock note cleared')
  } else {
    console.warn('  ⚠ claude-fable-5: old pricing note not found — skipping pricing patch')
  }

  if (!changed) return
  const { error: upErr } = await sb.from('articles').update({ body }).eq('slug', 'claude-fable-5')
  if (upErr) console.error('  ✗ claude-fable-5 patch:', upErr.message)
  else console.log('  ✓ claude-fable-5 body updated')
}

async function seed() {
  console.log('Seeding Batch 89 — Claude Sonnet 5 + Claude Science + Fable restoration...\n')

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
    if (error) console.error(`  ✗ ${a.slug}: ${error.message}`)
    else console.log(`  ✓ ${a.slug}`)
  }

  await patchFableBanner()

  console.log('\nDone.')
}

seed().catch(console.error)
