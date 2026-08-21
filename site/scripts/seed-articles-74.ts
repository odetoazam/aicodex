/**
 * Batch 74 — Anthropic announcement: Claude finance agents (May 5, 2026)
 *
 * claude-finance-agents
 *   On May 5, 2026 Anthropic shipped 10 reference agent templates aimed at
 *   financial services workflows. Each template bundles three things — skills
 *   (instructions + domain knowledge), connectors (governed data access),
 *   and subagents (specialized Claude models for specific subtasks). Available
 *   as plugins for Claude Cowork and Claude Code, and as cookbook snippets
 *   for Claude Managed Agents.
 *
 *   This article frames the launch as a *reference architecture* rather than
 *   a vertical sales pitch. Finance is the first vertical to get the Skills +
 *   Connectors + Subagents pattern packaged end-to-end. The pattern is
 *   reusable — read the templates to learn how to wire your own agents.
 *
 *   PRODUCTIVITY_SLUGS. Cluster: Features & Updates. Angle: update.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-74.ts
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
    slug: 'claude-finance-agents',
    angle: 'update',
    title: 'Claude finance agents: 10 reference templates and the pattern behind them',
    excerpt: "On May 5, 2026 Anthropic shipped 10 ready-made agent templates for financial services — pitch builder, KYC screener, month-end closer, and seven more. Each one bundles skills, connectors, and subagents in a way that's reusable beyond finance. Here's what shipped and what the pattern teaches anyone designing agents.",
    readTime: 8,
    cluster: 'Features & Updates',
    audience: ['operator', 'developer'],
    termSlug: 'ai-agent',
    body: `On May 5, 2026 Anthropic released 10 reference agent templates aimed at the most time-consuming work in financial services. Five for research and client coverage, five for finance and operations:

**Research and client coverage**
- **Pitch builder** — target lists, comparables, draft pitchbook
- **Meeting preparer** — client and counterparty briefs
- **Earnings reviewer** — read transcripts and filings, update models
- **Model builder** — financial models from filings and data feeds
- **Market researcher** — sector tracking and synthesis

**Finance and operations**
- **Valuation reviewer** — checks valuations against comps and standards
- **General ledger reconciler** — reconciles accounts, calculates NAV
- **Month-end closer** — close checklists, journal entry prep
- **Statement auditor** — consistency and audit-readiness review
- **KYC screener** — entity files and compliance review

Anthropic reports the agents score 64.37% on Vals AI's Finance Agent benchmark using Opus 4.7 — the firm calls it state-of-the-art on financial tasks.

What's actually interesting about this release is not the finance angle. It's the **reference architecture** the templates expose. Every template uses the same three-part pattern, and the pattern is reusable for any vertical.

## The three-part pattern

Each template bundles:

1. **Skills** — instructions plus domain knowledge. The "what good looks like" for a specific task. The pitch builder skill knows the structure of a pitchbook, the comp-set logic, the citation format. The KYC skill knows the questions to ask and the documents to assemble.

2. **Connectors** — governed access to the systems where the data lives. Eight new finance-specific connectors shipped alongside the templates: Dun & Bradstreet, Fiscal AI, Financial Modeling Prep, Guidepoint, IBISWorld, SS&C IntraLinks, Third Bridge, and Verisk. Moody's added an MCP app covering credit ratings and 600M+ companies. Connectors are how the agent reads and writes — without you handing it raw API keys.

3. **Subagents** — specialized Claude models scoped to a single subtask. The pitch builder doesn't try to do everything in one prompt; it spawns subagents for the comp-set, the valuation work, the slide assembly. The parent agent orchestrates.

This is the same pattern used in [Claude Managed Agents](/articles/claude-managed-agents) and [Claude Code Agent Teams](/articles/claude-code-agent-teams) — but here it ships as **packaged templates you can install or read**, not just a framework to assemble yourself.

## Where the templates live

Anthropic published the templates in three forms:

- **Plugins for Claude Cowork** — a Cowork user can install the pitch-builder plugin and start running it from a chat. Available on all paid Cowork plans.
- **Plugins for Claude Code** — engineers can install the same templates as Code plugins for use in their development environment. The Code path is closer to source: you can read the prompts, modify them, and push back as a custom plugin.
- **Cookbook snippets for Claude Managed Agents** — for teams running production agents through the Managed Agents API, the templates are published as starter code that wires up the same skills, connectors, and subagents in code.

The full marketplace lives at [github.com/anthropics/financial-services](https://github.com/anthropics/financial-services).

## Why this matters even if you're not in finance

Three reasons.

**1. The template repo is a teaching artifact.** If you've been trying to figure out how to assemble skills + connectors + subagents into something that works, the finance templates are the most complete worked example Anthropic has shipped. Read the pitch builder template the way you'd read a worked exam problem. The structure transfers directly to other verticals — the equivalent for legal would be a "memo builder" or "contract reviewer," for sales an "RFP responder" or "account brief generator."

**2. It signals the next vertical wave.** Anthropic shipping packaged agents for one vertical is a strong indicator that other verticals are coming. Healthcare, legal, and supply chain are the obvious next candidates. If you operate in one of those verticals, expect a similar drop in the next 6–12 months — and you can assume the same Skills + Connectors + Subagents pattern.

**3. The connector list is a forward indicator.** Eight new finance-data connectors landed in one day. That's a signal of what data partnerships Anthropic is investing in. If your team relies on a specific data vendor, search the connector marketplace; the chances it's there are higher than they were a month ago.

## Microsoft 365 footnote

Alongside the agents, the Anthropic add-ins for Microsoft 365 are now available across **Excel, PowerPoint, and Word**, with **Outlook coming soon**. Context carries between apps — Claude can read a deck in PowerPoint and respond about it inside an Outlook email, without re-uploading files. This isn't strictly part of the finance agents launch, but it's a relevant adjacent piece: a finance agent that drafts a pitchbook in PowerPoint and a follow-up note in Outlook is now a single connected workflow rather than three exports.

For the operator-friendly explainer of the M365 add-ins, see [Claude for Word](/articles/claude-for-word).

## How to read the templates

If you want to actually study these templates, here's the order I'd take them in:

1. **Start with the pitch builder.** It's the most complex agent in the set and exposes every part of the architecture — orchestration, parallel subagents, output formatting, connector calls, citation handling.
2. **Then read the month-end closer.** It's a process agent rather than an output agent. You'll see how to model a multi-step workflow with checkpoints and approvals.
3. **Then read the KYC screener.** The shortest of the three. Useful if you're sketching agents for narrow, well-defined screening tasks.

Skip the others on first pass. Three is enough to internalize the pattern.

## What this is and isn't

This launch is **not** a finance product. It's a set of reference agents and supporting connectors, plus a marketplace structure for them.

It is also **not** a replacement for evaluation. The 64.37% benchmark score means roughly *two-thirds* of test cases passed. For high-stakes finance work, you still need a human in the loop, your own evals against your own data, and a clear escalation path for the failures. See [Writing evals that catch regressions](/articles/writing-evals-that-catch-regressions) and [Multi-agent failure handling](/articles/multi-agent-failure-handling).

What it is: **the cleanest worked example of the agent architecture Anthropic wants developers and operators to copy.** Read it that way and you'll get more out of it than you would from any of Anthropic's framework docs.

## What to read next

- [Claude managed agents](/articles/claude-managed-agents) — the runtime these templates target
- [Claude Code agent teams](/articles/claude-code-agent-teams) — the Code-native version of the multi-subagent pattern
- [MCP for production agents](/articles/mcp-production-agents) — connector best practices when you're wiring real systems
- [Multi-agent orchestration basics](/articles/multi-agent-orchestration-basics) — the foundation pattern these templates build on

---

*Sources: [Agents for financial services](https://www.anthropic.com/news/agents-for-financial-services) and [Deploying Claude across financial services](https://claude.com/blog/deploying-claude-across-financial-services), Anthropic, May 5, 2026. Template repo: [github.com/anthropics/financial-services](https://github.com/anthropics/financial-services).*`,
  },
]

async function seed() {
  console.log('Seeding Batch 74 — Claude finance agents...\n')

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
