/**
 * Batch 86 — Anthropic announcements (June 15–23, 2026)
 *
 * 1. claude-tag (NEW)
 *    Claude Tag — research preview launched June 23, 2026. A virtual-employee
 *    tool that lives in Slack: tag @Claude into a channel, hand it a task, and
 *    it works through stages on its own, sharing progress in the channel.
 *    Enterprise + Team beta. PRODUCTIVITY_SLUGS. Cluster: Features & Updates.
 *    Angle: update.
 *
 * 2. claude-subscription-credit-changes (UPDATE)
 *    On June 15, 2026 Anthropic CANCELLED the planned billing change that this
 *    article (seeded May/June) described as upcoming. Programmatic usage still
 *    draws from subscription limits. Article re-seeded with a status banner and
 *    a corrected excerpt so readers landing on it today get the right answer.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-86.ts
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
    slug: 'claude-tag',
    angle: 'update',
    title: 'Claude Tag: a virtual coworker that lives in your Slack',
    excerpt:
      "Anthropic launched Claude Tag on June 23, 2026 — a research preview that puts Claude inside Slack as a shared team member. You tag @Claude into a channel, hand it a task, and it works through the steps on its own, posting progress where the whole team can see and redirect it. Here's what it does, how it differs from the Claude Slack connector you already know, and who can use it.",
    readTime: 6,
    cluster: 'Features & Updates',
    audience: ['operator'],
    termSlug: 'ai-agent',
    body: `On June 23, 2026, Anthropic launched **Claude Tag**, a research preview that puts Claude inside Slack as a shared team member rather than a personal chatbot. You tag \`@Claude\` into a channel, give it a task, and it breaks the task into steps and works through them on its own — posting progress in the channel as it goes, so anyone on the team can watch, jump in, or send it in a different direction.

The framing Anthropic uses is "a coworker you tag in." That is a useful way to read the difference from what came before.

## What's actually new here

Claude has been in Slack for over a year through the Slack connector — but that was Claude answering *your* questions in a DM or thread, tied to your account and your view of the data. Claude Tag is different in three ways:

1. **It's shared, not personal.** Claude Tag belongs to the channel, not to one person. A teammate can hand off a half-finished task to Claude, and someone else can pick up where Claude left off. The work happens in the open.
2. **It works in stages, not single replies.** You give it an outcome ("pull the numbers from last week's launch and draft the retro doc"), and it plans the steps and executes them, reporting back as each stage completes — closer to delegating to a person than asking a question.
3. **It learns your company over time.** It picks up context from the channels it's in — your projects, your terminology, who owns what — so you stop re-explaining the same background on every request.

## How it works in a channel

The basic loop:

- **Tag it in.** Mention \`@Claude\` in a channel and describe what you want done.
- **It scopes the work.** Claude restates the task, breaks it into stages, and starts.
- **It works in the open.** Progress shows up as messages in the channel. You can correct it mid-task, add a constraint, or stop it.
- **It hands back.** When it's done, the result lands in the channel where the whole team — not just the person who asked — can use it.

Because the work is visible, Claude Tag is also a hand-off mechanism: one person starts a task, goes offline, and a colleague continues steering Claude without losing the thread.

## Three capabilities worth calling out

**Ambient follow-ups.** Claude Tag proactively keeps people informed and follows up on tasks that were dropped — the "you said you'd send this, want me to draft it?" behavior, but coming from the assistant instead of a manager.

**Channel-scoped access.** Admins control which tools, data, and memories Claude can reach *per channel*. That means the HR channel's Claude can't see engineering's codebase, and vice versa. This is the control that makes a shared, always-present agent safe to put in sensitive channels.

**Tool and codebase connections.** Claude Tag connects to the same tools and data sources you'd wire to any Claude agent, including code. As an early data point, Anthropic says that inside its own product team Claude Tag is now approving roughly **65% of submitted code changes** — a sign the company is using it on real engineering work, not just demos.

## Who can use it, and what it costs

Claude Tag is a **research preview**, available now to **Claude Enterprise and Claude Team** customers, with access expanding later. There's no separate price announced for the preview — it's part of the Enterprise/Team offering. As with any research preview, expect rough edges and behavior changes while it's in beta.

If you're on Pro or Max, this isn't available to you yet. The Slack connector you already have is the closest thing — personal, per-account Claude in Slack — and remains the right tool for individual use.

## How to think about it if you run AI for a team

Claude Tag is the clearest expression yet of the shift from *Claude as a tool people open* to *Claude as a participant in the room*. That changes a few things you own as the person responsible for AI at your company:

- **Channel hygiene becomes access control.** Since access is scoped per channel, the question "which channels is Claude in, and what can it see there?" is now a real security boundary. Treat it like adding a member to a private channel.
- **The work is auditable by default.** Because Claude Tag posts in-channel, you get a visible trail of what it did and who redirected it — useful for trust, and for spotting where it's getting tasks wrong.
- **Adoption looks different.** A personal chatbot succeeds when individuals open it. A shared channel agent succeeds when teams hand work to it. Watch whether tasks actually get delegated, not just whether people say hi to it.

## Related reading

- [What is an AI Agent Manager (a.k.a. Agent Operator)?](/articles/what-is-an-agent-operator) — the role that owns tools like this
- [Claude + Slack for teams](/articles/claude-plus-slack-for-teams) — the personal Slack connector, and how it differs
- [What to share with Claude](/articles/what-to-share-with-claude) — the data-scoping framework, now a per-channel decision
- [Ask Your Org](/articles/ask-your-org-guide) — the other shared, org-aware Claude surface

---

*Source: [Anthropic launches Claude Tag, a tool that works like a virtual employee within Slack](https://fortune.com/2026/06/23/anthropic-claude-tag-virtual-employee-tool-slack/), Fortune, June 23, 2026. Claude Tag is a research preview for Claude Enterprise and Team.*`,
  },

  {
    // UPDATE — the June 15 change was cancelled on June 15, 2026.
    slug: 'claude-subscription-credit-changes',
    angle: 'update',
    title: "Claude's June 15 billing change — cancelled before it took effect",
    excerpt:
      "Anthropic planned to move programmatic usage (Agent SDK, `claude -p`, Code GitHub Actions, third-party agent apps) off subscription limits and onto a separate metered credit on June 15, 2026. On June 15, it cancelled the change. Nothing changes for now: those surfaces still draw from your Pro, Max, Team, and Enterprise limits exactly as before. Here's the full story, why it matters, and what to watch for next.",
    readTime: 6,
    cluster: 'Models & Pricing',
    audience: ['developer'],
    termSlug: 'claude-code',
    body: `> **Update — June 15, 2026: this change was cancelled.** Anthropic confirmed in its Help Center that the planned move of Agent SDK, \`claude -p\`, and third-party app usage to a separate monthly credit is **no longer happening**. Nothing changes for now: those surfaces continue drawing from your Pro, Max, Team, and Enterprise subscription limits exactly as before. There is **no credit to claim**, and your subscription limits are unchanged. Anthropic says it is reworking the plan "to better support how users build with Claude subscriptions" and will give advance notice before any future change takes effect. The rest of this article explains what the proposed change was and why it matters — it's now history, not a deadline.

## What was supposed to happen

On May 14, 2026, Anthropic announced that programmatic Claude usage would split off from subscription rate limits starting **June 15, 2026**. Under the proposal, programmatic usage would have moved to a **separate, dollar-denominated monthly credit**, metered at standard API list prices.

**What would have counted as "programmatic" (moving to the new credit pool):**

- The **Claude Agent SDK** running in your scripts and projects
- **\`claude -p\`** — the headless / non-interactive mode of Claude Code
- **Claude Code GitHub Actions**
- **Third-party apps** that authenticate using Agent SDK credentials (the path that lets editor integrations and tools run on your subscription)

**What would have stayed the same:**

- Interactive Claude Code in your terminal
- Claude web and desktop chat

The simple rule was: if a human is sitting there typing, unchanged; if code is calling Claude on its own, it spends from the credit pool.

## The numbers that were proposed

Each plan would have received a fixed monthly credit, billed at full API list rates:

| Plan | Proposed monthly programmatic credit |
|---|---|
| Pro | $20 |
| Max 5x | $100 |
| Max 20x | $200 |
| Team Standard | $20 / seat |
| Team Premium | $100 / seat |

The detail that drew the most concern: the credit was **per user with no rollover**, metered at API list prices — and **Enterprise Standard seats were slated to get $0 in new credits**. For anyone running agents or CI against a subscription, $20 of Opus usage at list price is not many agent runs, so for heavy programmatic users it read as a large effective price increase.

## Why it was proposed — and why the reversal matters

The original rationale was straightforward: a flat subscription fee with uncapped programmatic access meant some users ran heavy automated workloads — agents looping for hours, CI calling Claude on every commit — that cost far more in compute than the subscription brought in. Metered credit would have aligned price with cost.

The reversal matters for a practical reason beyond the refund-that-isn't: it's a reminder that **subscription-based programmatic access is on notice**. Anthropic didn't say "never" — it said "not like this, not yet." If your production setup depends on running agents cheaply against a Pro or Max subscription, that's a dependency with a question mark over it. The proposal getting pulled buys time; it doesn't remove the underlying economics that prompted it.

## What to actually do now

1. **Don't claim anything.** There is no credit and no email to act on. If you see a "claim your credits" message, it's stale.
2. **Know your real programmatic spend at API rates anyway.** This was good advice before the change and it's good advice now: get one number — what would your current Agent SDK / \`claude -p\` / GitHub Actions usage cost at API list prices per month? Run [\`/usage\`](/articles/claude-code-may-2026-updates) or pull the [Usage & Cost API](/articles/claude-rate-limits-api). If that number is large, you're exposed to whatever the reworked plan turns out to be.
3. **Have an exit plan for heavy workloads.** If you're well into "this would cost real money at API rates" territory, a proper API key with its own billing and [rate limits](/articles/rate-limiting-claude-api) is the stable foundation — independent of how subscription billing evolves.
4. **Watch for the advance notice.** Anthropic committed to giving notice before any future change. If you own CI or production agents, that notice is the thing to catch — not a June 15 deadline that no longer exists.

## Who this affects

If you're an [Agent Operator](/articles/what-is-an-agent-operator) running production agents off a subscription, or a developer with Claude wired into CI: nothing changes today, but treat your subscription-funded automation as a temporary arrangement and know your API-rate number. If you only ever use Claude by typing in the terminal or the web app: this never applied to you, and still doesn't.

## Try this today

Run \`claude /usage\` or pull last month's programmatic usage from the [Usage & Cost API](/articles/claude-rate-limits-api), and write down one number: your monthly programmatic spend at API list prices. The June 15 change is gone, but that number is exactly what the *next* proposal will be priced against — so it's worth knowing before the advance notice lands.

## Related reading

- [When your AI model disappears](/articles/when-your-ai-model-disappears) — the broader lesson on not over-depending on one billing or model arrangement
- [Claude Code, May 2026 updates](/articles/claude-code-may-2026-updates) — including the \`/usage\` cost breakdown
- [The Rate Limits API](/articles/claude-rate-limits-api) — reading your limits and usage in code

---

*Sources: Anthropic Help Center confirmation that the June 15, 2026 credit change is no longer happening; original change announced May 14, 2026. See [coverage of the reversal](https://www.digitalapplied.com/blog/anthropic-claude-credit-overhaul-june-15-2026).*`,
  },
]

async function seed() {
  console.log('Seeding Batch 86 — Claude Tag (new) + June 15 billing reversal (update)...\n')

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
