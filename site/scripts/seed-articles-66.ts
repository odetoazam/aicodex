/**
 * Batch 66 — Anthropic announcements: Claude Code Routines + Claude Design (April 14–17, 2026)
 *
 * 1. claude-code-routines
 *    Routines: Claude Code automations that run on schedule, via API call, or on
 *    GitHub events — on Anthropic's cloud, no machine required. Announced April 14.
 *    DEV_SLUGS. Cluster: Claude Code.
 *
 * 2. claude-design
 *    Anthropic's new visual creation product. Describe what you want, get a
 *    prototype/slide deck/one-pager. Powered by Opus 4.7. Research preview
 *    April 17. PRODUCTIVITY_SLUGS. Cluster: Features & Updates.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-66.ts
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
    slug: 'claude-code-routines',
    angle: 'process',
    title: 'Claude Code Routines: automations that run without you',
    excerpt: "Routines let you configure a Claude Code task once — a nightly bug triage, a PR review on every push, an alert fix triggered by your monitoring system — and have it run in the cloud on its own schedule. Here's how they work and what they're useful for.",
    readTime: 6,
    cluster: 'Claude Code',
    audience: ['developer', 'operator'],
    termSlug: 'ai-agent',
    body: `Routines are Claude Code automations you configure once and leave running. They exist on Anthropic's infrastructure, not your machine — so they keep running when your laptop is closed, your terminal is gone, or no one is logged in.

They were announced April 14, 2026, and are available to Pro, Max, Team, and Enterprise users with Claude Code on the web enabled.

## Three ways to trigger a routine

**Scheduled**

You give Claude a task and a cadence. It runs on that schedule, unattended.

Example: every night at 2am, pull the highest-priority open bug from Linear, attempt a fix, and open a draft PR. You wake up to something to review rather than an empty inbox.

**API-triggered**

Each routine gets its own endpoint and auth token. POST a message to that URL and the routine executes.

This lets external systems kick off Claude Code sessions. Useful for: your monitoring system detecting a production anomaly and triggering a diagnostic routine, a deployment hook running a post-deploy check, an internal tool spinning up a Claude Code session from a Slack command.

**Webhook-based (GitHub events)**

You subscribe a routine to a repository event — PR opened, commit pushed, review comment added. Claude creates a session per matching event and responds to it continuously.

Example: subscribe a security review routine to pull request creation. Every new PR gets a Claude Code session that checks for common security issues, comments its findings, and tracks CI failures until they're resolved. The routine feeds updated context as the PR evolves.

## Daily limits

Routines run against your plan's daily allowance:

| Plan | Routines per day |
|------|-----------------|
| Pro | 5 |
| Max | 15 |
| Team | 25 |
| Enterprise | 25 |

Additional routine capacity is available for purchase beyond these limits.

## What routines are good for

The four use cases Anthropic highlights at launch:

**Backlog management.** Automated issue triage: pull new issues, categorize them, assign labels, post a Slack summary of the day's additions. Frees up the meeting you'd otherwise spend reviewing the backlog.

**Alert triage.** Connect to Datadog or your alerting system. When a threshold fires, the routine starts a session: reads the alert, looks at recent code changes, produces a draft fix or a diagnosis note. By the time someone picks it up, context is already assembled.

**Code review.** Run a review routine on every PR — security scan, performance check, dependency audit. The human reviewer sees Claude's notes alongside the diff.

**Library porting.** If you maintain an SDK in multiple languages, a routine can sync changes from the primary implementation to secondary ones automatically.

## How this differs from hooks

Claude Code hooks (configured in settings.json) run locally in your terminal session, triggered by specific Claude actions — tool calls, session stop, permission requests. They run on your machine while Claude Code is running.

Routines are cloud-based and event-driven at a higher level. They spin up a full Claude Code session on Anthropic's infrastructure in response to a schedule, an API call, or a repository event. You don't need to be at your computer.

The mental model: hooks customize what happens *inside* a session you're running. Routines schedule sessions to run *without* you.

## Setting up a routine

Routines are configured through Claude Code on the web (claude.ai/code). You specify:
- A prompt describing what Claude should do
- The repository to work in
- Any connectors (Linear, GitHub, Slack, etc.)
- The trigger: schedule expression, API endpoint, or GitHub event

Once configured, you get an endpoint URL and auth token for API-triggered routines, or the scheduled run starts automatically.

The Claude Code session Claude creates for each routine run has full access to the tools and connectors you configured — the same capabilities as an interactive session, just unattended.

## Official docs

Full reference: [platform.claude.com/docs/en/claude-code/routines](https://platform.claude.com/docs/en/claude-code/routines)

Announcement post: [claude.com/blog/introducing-routines-in-claude-code](https://claude.com/blog/introducing-routines-in-claude-code)`,
  },
  {
    slug: 'claude-design',
    angle: 'update',
    title: 'Claude Design: from description to visual in one conversation',
    excerpt: "Anthropic's new tool lets you create prototypes, slide decks, one-pagers, and full design systems by describing what you want. Output is exportable as PDF, URL, or PPTX and can connect to your existing design files. Available in research preview for Pro, Max, Team, and Enterprise.",
    readTime: 5,
    cluster: 'Features & Updates',
    audience: ['operator'],
    termSlug: 'large-language-model',
    body: `Claude Design is a product Anthropic launched in research preview on April 17, 2026. It generates visual output — prototypes, slides, one-pagers, design systems — from a plain-language description.

It runs on Claude Opus 4.7 and is available to Claude Pro, Max, Team, and Enterprise subscribers.

## What you can make

The initial release supports four output types:

**Prototypes.** Interactive mockups of apps or interfaces. Describe the screen, the user flow, the visual language you want, and Claude generates a working prototype you can click through.

**Slides.** Presentation decks built from your content. Describe the topic, the audience, the number of slides, any specific framing — Claude builds the deck. You refine it from there.

**One-pagers.** Single-page documents: executive summaries, product briefs, proposals. Claude formats the content into a clean, printable layout.

**Design systems.** Visual language rules for a product or brand — typography scales, color palettes, spacing, component patterns. Claude can generate a design system from a description or by reading your existing codebase.

## How it works

The workflow is iterative. You describe what you want. Claude produces a first version. You refine it with follow-up requests — "change the accent color to slate blue," "make the headline 4 points larger," "move the CTA above the fold."

Direct edits also work alongside natural language: click an element and change it in place, then ask Claude to apply that change pattern across the document.

Design system integration: if you give Claude your design files or codebase, it reads your existing visual conventions and applies them to new work. Output stays consistent with what you've already built.

## Export options

Finished work exports in three formats:

- **PDF** — for print or sharing
- **URL** — a hosted link to a shareable, live version
- **PPTX** — for editing in PowerPoint or presenting directly

Claude Design also integrates with Canva: you can transfer work to Canva for further editing and collaboration.

## What it doesn't replace

Anthropic positions Claude Design as complementary to dedicated design tools, not a replacement. It's built for moving quickly from concept to something concrete — a first pass at a slide deck, a prototype to test an idea, a one-pager to share with stakeholders.

For production design work, refined component libraries, or complex animation, tools like Figma, Canva, or dedicated prototyping software still handle things Claude Design does not.

The practical use case is the gap between "I have an idea" and "I have something I can show someone" — that step usually requires either design skills or design time. Claude Design compresses it.

## Availability

Research preview access is rolling out to all Claude Pro, Max, Team, and Enterprise subscribers. It runs on Opus 4.7, so it uses the same model capacity as other Opus 4.7 features on your plan.

No separate signup is required — Claude Design appears as a product option within your Claude account as access rolls out.

## Official announcement

Anthropic announcement: [anthropic.com/news](https://www.anthropic.com/news)

TechCrunch coverage: [techcrunch.com/2026/04/17/anthropic-launches-claude-design-a-new-product-for-creating-quick-visuals](https://techcrunch.com/2026/04/17/anthropic-launches-claude-design-a-new-product-for-creating-quick-visuals/)`,
  },
]

async function seed() {
  console.log('Seeding Batch 66 — Claude Code Routines + Claude Design...\n')

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
