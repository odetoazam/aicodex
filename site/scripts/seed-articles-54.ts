/**
 * Batch 54 — Claude + Tool: Confluence
 *
 * 1. claude-plus-confluence — Claude + Confluence for engineering teams.
 *    Natural pair with claude-plus-jira. High search intent: "Claude + Confluence",
 *    "using AI in Confluence", "Claude for documentation".
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-54.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getTermId(slug: string): Promise<{ id: string; name: string } | null> {
  const { data } = await sb.from('terms').select('id, name').eq('slug', slug).single()
  return data ?? null
}

const ARTICLES = [
  {
    termSlug: 'connector',
    slug: 'claude-plus-confluence',
    cluster: 'Workflow & Tooling',
    angle: 'process',
    title: 'Claude + Confluence: keeping documentation from going stale',
    excerpt: "Confluence pages rot the moment the engineer who wrote them moves on to the next thing. Claude doesn't prevent that — but it makes the writing and updating fast enough that it might actually happen.",
    readTime: 7,
    body: `
Documentation has a decay problem. Not a writing problem.

Most engineering teams can produce good docs when they have the time and the context. The problem is that the context evaporates, the time never comes, and what was once accurate becomes quietly wrong. Six months later, someone follows an outdated Confluence page into an hour of lost debugging.

Claude doesn't solve the fundamental problem — documentation still requires someone to care about it. But it lowers the cost of caring enough that it can actually happen.

Here's how teams use Claude effectively alongside Confluence.

## The four workflows worth setting up

### 1. Writing a page from a conversation or meeting

This is the highest-leverage use and the one that creates the most documentation that would otherwise never exist.

Someone runs a planning meeting or a system design discussion. Notes exist somewhere — in Slack, in a Notion doc, in a voice transcript. Claude's job is to turn those notes into a structured Confluence page.

The prompt pattern that works:

> Here are my notes from our architecture discussion: [paste notes]. Write a Confluence page covering: the decision we made, why we made it, the alternatives we considered, and the constraints we were working within. Format it with clear headings and a decision log at the top.

What Claude produces won't be perfect — you'll need to fill in specifics and fix any inferences it got wrong. But it gives you a 70% draft in 2 minutes instead of a blank page you never get back to.

### 2. Keeping a runbook current

Runbooks go stale because updating them requires context that only exists when something just broke — the worst possible moment to write documentation.

A better pattern: when an incident happens and the post-mortem is written, give Claude the post-mortem and ask it to update the runbook.

> Here's our current runbook for [X]: [paste runbook]. Here's what we learned from last week's incident: [paste post-mortem]. Update the runbook to reflect what we now know. Mark anything that was wrong in the original. Add the new troubleshooting steps.

This turns every post-mortem into a documentation improvement cycle rather than a one-off writeup.

### 3. Standardizing page structure across a team

Confluence pages written by different engineers look completely different. Some are walls of text. Some are one-line stubs. Some have outdated warnings in bright red that nobody has removed in two years.

Use Claude to standardize: pick a page you want to use as a template, then apply it to existing pages that need restructuring.

> Here's our standard format for API documentation pages: [paste template page]. Here's an existing API doc that needs to be reformatted: [paste page]. Rewrite it to match the template structure while keeping all the technical content intact.

This is especially useful when onboarding someone new who's going to be writing a lot of docs — give them the template and a Claude prompt to enforce it.

### 4. Writing onboarding documentation from institutional knowledge

When a senior engineer leaves or a team grows, the knowledge that lived in their head needs to get into Confluence. Claude helps with the capture step.

Run a 30-minute interview with the departing or senior engineer — just ask them questions and take rough notes. Then give Claude those notes and ask it to produce a "how we work" page.

> Here are notes from my conversation with [name] about our deployment process: [paste notes]. Write a comprehensive Confluence page covering the end-to-end deployment process, including the things that aren't in the official runbook and the gotchas only experienced people know. Format it for someone joining the team for the first time.

You'll need a second pass with the engineer to fill in the gaps — but getting 80% of it written before that review session makes the review session faster and more useful.

## What Claude can't do here

**It can't access Confluence directly unless you paste content.** There's no native Claude-Confluence integration that reads or writes pages automatically. Every workflow here involves copying content from Confluence, running it through Claude, and pasting the result back. That's manual. Some teams use Zapier or Make to automate parts of this (trigger on page update, send content to Claude, post refined version as a comment), but that's a separate build.

**It can't know what changed in your codebase.** If you want documentation that reflects recent code changes, you have to either paste the diff or describe what changed. Claude can't watch your repo and automatically update docs — and if it could, you'd need a human review step anyway.

**It will sometimes get technical specifics wrong.** Claude is good at structure and language, not at knowing that your staging environment has a specific quirk or that the config key changed in v2.3. Always have the engineer who knows the system review what Claude drafts before it goes into the wiki.

## The workflow that sticks

The problem with documentation is activation energy — it's always lower to not write the doc than to write it.

The teams that make this work have one rule: before a code review goes out, the author uses Claude to update (or create) the relevant Confluence page. Not a comprehensive page. Not a beautifully formatted page. Just a page that a future engineer could use. They paste the PR description and any relevant context into Claude and ask for a draft. It takes five minutes.

That rule, consistently followed, generates more useful documentation than any documentation sprint you'll ever run.

---

**Try this today:** Pick one thing your team knows that isn't written down anywhere — a deployment quirk, an environment gotcha, a decision you made and why. Write 3-5 bullet points from memory. Paste them into Claude and ask it to expand this into a Confluence page. You'll have a first draft in under 2 minutes.

---

*Part of the [Claude + Tool series](/articles/claude-plus). Related: [Claude + Jira](/articles/claude-plus-jira) · [Claude for engineering teams](/articles/claude-for-engineering-teams) · [CLAUDE.md for your team](/articles/claude-code-for-your-team)*
`,
  },
]

async function seed() {
  for (const a of ARTICLES) {
    const term = await getTermId(a.termSlug)
    if (!term) { console.error(`Term not found: ${a.termSlug}`); continue }

    const { error } = await sb.from('articles').upsert({
      slug: a.slug,
      term_id: term.id,
      term_slug: a.termSlug,
      cluster: a.cluster,
      angle: a.angle,
      title: a.title,
      excerpt: a.excerpt,
      read_time: a.readTime,
      body: a.body.trim(),
      published: true,
    }, { onConflict: 'slug' })

    if (error) {
      console.error(`❌ ${a.slug}:`, error.message)
    } else {
      console.log(`✓ ${a.slug}`)
    }
  }
}

seed().then(() => process.exit(0))
