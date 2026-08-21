/**
 * Batch 69 — Claude Code + 1M context: practical session management (April 2026)
 *
 * 1. claude-code-1m-context
 *    The 1M token context window is now GA for Opus 4.7 and Sonnet 4.6.
 *    This guide covers what that means specifically for Claude Code: when to
 *    keep the full context, when /compact still makes sense, and how to think
 *    about session structure for large codebases.
 *    DEV_SLUGS. Cluster: Claude Code.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-69.ts
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
    slug: 'claude-code-1m-context',
    angle: 'process',
    title: 'Claude Code with 1M context: when to use it and when to compact',
    excerpt: "The 1M token context window is now standard for Opus 4.7 and Sonnet 4.6 — no beta header, no special setup. For Claude Code specifically, that changes how long you can hold a session and what you can load into it. Here's how to use it and when /compact still wins.",
    readTime: 7,
    cluster: 'Claude Code',
    audience: ['developer'],
    termSlug: 'context-window',
    body: `The 1M token context window became generally available for Claude Opus 4.7 and Claude Sonnet 4.6 in March 2026. In practical terms: you can hold a very long Claude Code session — or load a very large codebase — without hitting the 200k limit or needing to compact.

This changes what's possible in a Claude Code session. It also introduces new decisions: keeping full context is not always the right call.

## What 1M context means for Claude Code

A 1M token context window means roughly 750,000 words, or about 50,000–100,000 lines of code depending on how dense it is. In practice, you could load:

- A medium-sized monorepo (several hundred files) into a single session
- Three to four hours of active back-and-forth with full history preserved
- Multiple large files alongside a long conversation thread

For most Claude Code work, you'll hit practical limits before you hit the 1M token cap. The cap is the ceiling; the question is how to structure sessions beneath it.

## When 1M context helps in Claude Code

**Exploring an unfamiliar codebase.** When you're new to a system and need to understand how components connect, you want as much loaded as possible. Compacting early removes the breadcrumb trail of what you've already read and what conclusions you've reached. Hold the full context while you're building a mental model.

**Long debugging sessions.** A debugging session accumulates valuable state: the full error, your hypotheses, what you tried, what failed, why. If you compact mid-session, Claude summarizes — but summaries lose the specific failure details you'll need to avoid dead ends. Keep the full thread for complex bugs.

**Cross-file refactoring.** When a change needs to be consistent across many files — renaming an API surface, migrating a pattern, updating a data model — Claude performs better when it can see every occurrence in full context rather than working from summaries or multiple sessions.

**Large CLAUDE.md projects.** If your CLAUDE.md references a lot of supporting material (architecture notes, style guides, decision logs), a bigger context window means you can include more of it without choosing between project knowledge and working memory.

## When /compact still makes sense

**Cost control.** The 1M context window doesn't change pricing at the standard tier — inputs under 200k tokens are billed normally, inputs over 200k enter long-context pricing. A session that's been running for three hours and touched a lot of files can accumulate significant input token usage. If the old parts of the conversation are no longer actively relevant, compacting resets that cost basis.

**Focused tasks.** After exploration, when you shift to a specific implementation task, carrying 40k tokens of "here's how I explored the codebase" can introduce noise. Compacting to a clean task handoff — "here's what we know, here's the goal" — gives Claude a focused working set.

**Slow responses.** As context grows, response latency increases. For tight iteration loops where speed matters more than continuity, compacting improves the pace.

**Long-running maintenance.** Sessions that run for more than a day accumulate stale context: earlier decisions that were reversed, code that was deleted, directions that were abandoned. A compact pass clears that debris.

## How to check your context size

In a Claude Code session, run:

\`\`\`
/context
\`\`\`

This shows your current context usage as a token count and a percentage of the model's limit. You can use this to decide whether to compact before starting a new task or to gauge how much room you have for additional files.

## Session structure for large codebases

A useful pattern for large repos:

**Session 1 — exploration.** Load broadly. Use the full context window to understand the system. Don't compact; you want the full trace of what you read and concluded.

**Checkpoint — summarize.** At the end of the exploration session, ask Claude to produce a written summary of the architecture, key files, important patterns, and open questions. Save this to a file.

**Session 2 — implementation.** Start fresh. Load the summary file plus the specific files relevant to the task. Your CLAUDE.md should point to the summary as a reference. You get focused context at lower cost.

This pattern uses 1M context where it helps (exploration) and uses /compact or new sessions where it doesn't (implementation).

## Model choice and context

The 1M window is GA for Opus 4.7 and Sonnet 4.6. If you're using a model alias like \`claude-sonnet-latest\` or \`claude-opus-latest\`, you're already on models that support it.

Earlier models (Sonnet 4.5, Haiku 4.5) do not support the full 1M window without a beta header. If you're specifying an older model ID explicitly, check your model selection before relying on extended context.

## Long-context pricing

Standard pricing applies for inputs under 200k tokens. For inputs that exceed 200k tokens, Anthropic charges at a higher rate for the excess — this is listed as long-context pricing in the API docs and pricing page.

For most Claude Code sessions, you'll stay under 200k. Sessions involving very large codebases or very long conversations can cross that threshold. The \`/context\` command's token count lets you monitor where you are.

## What to read next

- [Claude Code session economics](/articles/claude-session-economics) — why new chats cost less and when Projects help
- [Claude Code project setup](/articles/claude-code-project-setup) — configuring CLAUDE.md for large repos
- [Claude Opus 4.7](/articles/claude-opus-4-7) — what changed in the latest model

---

*The 1M context window for Opus 4.7 and Sonnet 4.6 was covered in the [API release notes](https://platform.claude.com/docs/en/release-notes/overview). The Claude Code blog post "Using Claude Code: session management and 1M context" (April 15, 2026) covers the official Anthropic guidance.*`,
  },
]

async function seed() {
  console.log('Seeding Batch 69 — Claude Code + 1M context...\n')

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
