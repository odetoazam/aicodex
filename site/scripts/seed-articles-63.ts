/**
 * Batch 63 — Anthropic announcements (April 14–17, 2026)
 *
 * 1. claude-design
 *    Claude Design (Anthropic Labs, April 17). Research preview for Pro/Max/Team/Enterprise.
 *    Create prototypes, slides, one-pagers from text descriptions. Powered by Opus 4.7.
 *    Angle: 'update'. Cluster: Features & Updates. PRODUCTIVITY_SLUGS.
 *
 * 2. claude-code-routines
 *    Claude Code routines (April 14). Schedule prompts to run on cron, API POST, or GitHub event.
 *    Runs on Anthropic's infrastructure — not your laptop. Pro/Max/Team/Enterprise.
 *    Angle: 'process'. Cluster: Claude Code. DEV_SLUGS.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-63.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ARTICLES = [

  // ── 1. Claude Design ───────────────────────────────────────────────────────
  {
    slug: 'claude-design',
    angle: 'update',
    title: 'Claude Design: create prototypes and slides without a designer',
    excerpt: "Anthropic's new experimental tool lets you describe a visual — a prototype, deck, or one-pager — and Claude Opus 4.7 builds it. Available in research preview for Pro and above.",
    readTime: 5,
    cluster: 'Features & Updates',
    body: `Claude Design is a new experimental product from Anthropic Labs (April 17 2026) that lets you create visual deliverables by describing what you want. Type "a mobile meditation app prototype with a calming onboarding flow" and Claude builds it. Adjust colors, add dark mode, swap layouts — all by asking.

It is available to Claude Pro, Max, Team, and Enterprise subscribers. Access it through the palette icon in the left-hand navigation at claude.ai.

## What it creates

Claude Design handles:

- **App and web prototypes** — rendered mockups for pitches, user testing, or handoffs to engineers
- **Slide decks** — presentation-format content for investor pitches, internal updates, client proposals
- **One-pagers** — single-page briefs, product overviews, service summaries
- **Charts, diagrams, and visualizations** — embedded inline in any of the above

The outputs are rendered deliverables, not image files. You iterate by continuing the conversation — each instruction updates the design directly.

## How it works

You describe what you want. Claude generates a first version. Then you refine: ask for a different color scheme, add a feature, reorder sections, tighten the copy. Each request applies immediately.

Claude Design runs on Claude Opus 4.7, which has better visual reasoning than earlier models — including image understanding at 3.75 megapixels.

## Teams and design systems

For Team and Enterprise subscribers, you can apply a design system across projects. Claude analyzes your codebase and design files to extract your visual language — colors, typography, component patterns — and applies it consistently to every deliverable you create.

This helps agencies or product teams who build across multiple clients or internal stakeholders maintain consistent branding without specifying it each time.

## Exporting

When the design is ready, you can export it as:

- **PDF** — for sharing as an attachment or printing
- **URL** — a shareable link that renders the design in the browser
- **PPTX** — opens in PowerPoint or Google Slides for further editing
- **Canva** — transfer for collaboration with team members who work in Canva

## What it is not

Claude Design is in research preview. It is not a Figma replacement — there are no component libraries, auto-layout constraints, or developer handoff specs. It is not a full slide editor — you cannot drag and reorder slides directly. Think of it as a fast path from an idea to a shareable visual, before bringing in design tools for final production.

## Getting started

Open claude.ai and look for the palette icon in the left-hand navigation. Start with a specific request:

> "A one-pager for a B2B SaaS product that tracks employee onboarding completion, designed for an HR director audience. Clean, professional, dark blue and white."

The more specificity up front, the fewer refinement rounds you'll need.

Official announcement: [anthropic.com/news](https://www.anthropic.com/news)`,
  },

  // ── 2. Claude Code Routines ────────────────────────────────────────────────
  {
    slug: 'claude-code-routines',
    angle: 'process',
    title: 'Claude Code routines: automate workflows on a schedule',
    excerpt: "A routine is a Claude Code automation that runs on a schedule, from an API call, or in response to a GitHub event — without your laptop open. Here's what they are and where they fit best.",
    readTime: 7,
    cluster: 'Claude Code',
    body: `A Claude Code routine is an automation you configure once — a prompt, a repo, and any connectors — and then run on a schedule, via an HTTP call, or in response to a GitHub event. Routines run on Anthropic's infrastructure, not your local machine.

The feature launched in research preview on April 14 2026. It is available on Pro, Max, Team, and Enterprise plans with Claude Code enabled.

## How to create one

Go to [claude.ai/code/routines](https://claude.ai/code/routines) to create and manage routines. You can also use \`/schedule\` from the CLI.

A routine has three parts:

1. **The task prompt** — what Claude should do each time the routine runs
2. **The repo** — which repository it has access to
3. **The trigger** — when and how it fires

## Trigger types

**Scheduled** — runs on a recurring cadence using standard cron syntax: hourly, nightly, weekly, or any other interval.

**API** — Anthropic generates a per-routine endpoint. Send an HTTP POST with a bearer token to trigger the routine from another system — a CI pipeline, a monitoring alert, or a webhook from your issue tracker.

**GitHub events** — attach to repository events like pull request opened, merged, or closed. The routine fires automatically when the event occurs.

## Daily run limits

| Plan | Daily runs |
|------|-----------|
| Pro | 5 |
| Max | 15 |
| Team / Enterprise | 25 |

## What to automate with routines

**Nightly issue triage.** Claude scans new GitHub issues, labels them by type, assigns based on code area, and posts a summary to Slack. You start each morning with a clean backlog instead of raw notifications.

**Docs drift detection.** Claude runs weekly, scans PRs merged since the last run, identifies functions or APIs that changed, and opens update PRs for the docs files that reference them.

**Deploy verification.** Your CD pipeline POSTs to the routine's API endpoint after each deploy. Claude checks the build, reads error logs, and posts a go/no-go to your release channel before on-call reviews anything.

**Alert triage.** Point Datadog at the routine's API endpoint. When an alert fires, Claude pulls the trace, correlates it with recent deployments, and has a draft fix ready before the on-call engineer opens the page.

**Feedback resolution.** Claude scans incoming product feedback on a cadence, categorizes it, and opens issues for patterns that appear more than a threshold number of times.

## What routines are not

Routines are not a CI/CD replacement. They run with the same repo permissions as your existing Claude Code setup — not with production credentials. They are best for reasoning tasks: reading, summarizing, triaging, flagging, and drafting. Tasks that require deploying code or modifying production systems need separate authorization.

For long one-off tasks, a standard Claude Code session is still the right tool. Routines fit recurring patterns.

## Getting started

1. Enable Claude Code on your account (requires Pro or above)
2. Go to [claude.ai/code/routines](https://claude.ai/code/routines)
3. Click "New routine," connect a repo, write a task prompt, and set a trigger
4. Test it by running it manually before setting the live schedule

Start narrow: one repo, one clear task, one output channel. Add complexity once the basic pattern is running reliably.

Official announcement: [claude.com/blog/introducing-routines-in-claude-code](https://claude.com/blog/introducing-routines-in-claude-code)`,
  },

]

async function seed() {
  console.log('Seeding Batch 63 — Claude Design + Claude Code Routines...\n')

  for (const a of ARTICLES) {
    const payload = {
      slug:      a.slug,
      angle:     a.angle,
      title:     a.title,
      excerpt:   a.excerpt,
      body:      a.body,
      read_time: a.readTime,
      cluster:   a.cluster,
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
