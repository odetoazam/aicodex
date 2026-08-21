/**
 * Batch 90 — Anthropic announcement: Claude Cowork on web and mobile (July 7, 2026)
 *
 * cowork-mobile-web
 *   On July 7, 2026 Anthropic expanded Claude Cowork beyond desktop to web
 *   (claude.ai) and mobile (iOS/Android), in beta, starting with Max. The real
 *   change is background execution: remote sessions run on Anthropic's servers,
 *   saved to your account, and keep working — including scheduled tasks — with no
 *   device online. Framed for operators: what shipped, what changes, how to use it
 *   without losing the review discipline background work demands.
 *   PRODUCTIVITY_SLUGS. Cluster: Features & Updates. Angle: update.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-90.ts
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
    slug: 'cowork-mobile-web',
    angle: 'update',
    title: 'Claude Cowork on web and mobile: your agent keeps working with the laptop closed',
    excerpt: "On July 7, 2026 Anthropic brought Claude Cowork to the web and to phones, in beta, starting with Max subscribers. The headline isn't the new surfaces — it's that Cowork sessions now run on Anthropic's servers and keep working, including scheduled tasks, with no device online. Here's what shipped and how to use background work without losing the review step.",
    readTime: 6,
    cluster: 'Features & Updates',
    audience: ['operator'],
    termSlug: 'claude-cowork',
    body: `Claude Cowork launched as a desktop app — macOS and Windows — where Claude works alongside you inside a session: reading files, running tools, and producing work you steer as it goes. It went generally available for enterprise in April 2026.

On July 7, 2026, Anthropic expanded it to two new places: the web at claude.ai, and mobile apps on iOS and Android. It's in beta and rolling out over several weeks, starting with Max subscribers and then reaching other paid plans.

New surfaces are the visible part. The change that matters is underneath them.

## The actual shift: work stops being tied to your machine

On the desktop app, a Cowork session ran on your computer. Close the laptop and the work paused with it.

The web and mobile sessions run on Anthropic's servers instead. A session is saved to your Claude account, not to a device. That has one direct consequence: **the work keeps going after you leave.** You can start a task on your laptop, close it, and check the result from your phone an hour later. The session was never on the laptop to begin with.

The same property is what makes scheduled tasks useful. A scheduled Cowork task can run at its appointed time with no device of yours online at all — because it was never going to run on your device.

## What that looks like in practice

The example Anthropic uses is a morning client brief. You set up a scheduled task the night before:

- At 6am, before you're awake, the task starts on Anthropic's servers.
- Claude works through the relevant email threads, Slack messages, and meeting transcripts, and checks recent news on the account.
- It builds the briefing document.
- It drafts the follow-up email — and leaves it **unsent**, waiting for your review.

You wake up, open the brief on your phone, read it, adjust the draft, and hit send yourself. The grind happened while you slept; the judgment call stayed with you.

That pattern — Claude does the assembly, you keep the decision — is the whole point, and it's worth protecting (more on that below).

## What you can do from web and mobile

On the new surfaces you can:

- **Start, steer, resume, and review** tasks — the full session loop, not a read-only view.
- Use **connectors, skills, and plugins** in a session, the same as on desktop.
- Set up and manage **scheduled tasks**.
- **Manage projects** and preview files Claude creates.
- **Approve actions from your phone** — when Claude wants to take a step that has consequences (sending, posting, changing something), it can surface the approval on mobile so you're not tethered to a desk to unblock it.

## Why this matters for an operator

If your job is to get repeatable work off your plate and onto an agent, background execution changes the shape of what's possible.

Until now, "use Claude for the Monday report" meant *sit down, open a session, drive it.* The agent was fast, but it was synchronous — it needed you present. Scheduled, server-side Cowork tasks make the same work **asynchronous**: you define it once, and it runs on a clock without you in the room. That's the difference between a tool you operate and a task that operates on a schedule.

This is the concrete version of the "agent as coworker" idea that's been abstract for most teams. A recurring task that runs overnight and leaves you a reviewed-and-ready draft is a small, real instance of it.

## Three things to keep in mind

**1. It's beta, and Max-first.** Rollout is staged over several weeks. Max subscribers get it first, then other paid plans. If you don't see it yet, that's expected — it isn't a setup problem on your end.

**2. Background work needs the review step more, not less.** The thing that makes the morning-brief pattern safe is that the follow-up email is left unsent. When work runs while you're not watching, the review gate at the end is the only thing standing between a draft and a mistake going out under your name. Set scheduled tasks up to **produce**, not to **send**. Keep the irreversible step — sending, posting, paying, deleting — on your side of the approval.

**3. Mind what a scheduled task can see.** A task that runs unattended still runs with your connectors, your account, and your data in scope. Before you schedule something recurring, check what it's able to reach, the same way you'd scope any standing automation. A task that reads your inbox every morning is reading your inbox every morning.

## What to read next

- [The Cowork and Dispatch guide](/articles/cowork-dispatch-guide) — how Cowork works and where it fits
- [What is an AI Agent Manager?](/articles/what-is-an-agent-operator) — the role that owns standing agent work like this
- [The five habits that get value from Claude](/articles/claude-operator-habits) — the review-first discipline background tasks depend on
- [Your first week with Claude](/articles/first-week-with-claude) — if Cowork is new to you

---

*Source: Anthropic, "Claude Cowork on web and mobile," July 7, 2026. Cowork sessions on web and mobile run on Anthropic's servers and support background and scheduled task execution; beta rollout began with Max subscribers.*`,
  },
]

async function seed() {
  console.log('Seeding Batch 90 — Cowork on web and mobile...\n')

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
