/**
 * Batch 35 — Concept-first Claude Code: CLAUDE.md vs hooks
 * claude-md-vs-hooks
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-35.ts
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

  {
    termSlug: 'claude-md',
    slug: 'claude-md-vs-hooks',
    angle: 'process',
    title: 'CLAUDE.md vs. hooks: instructions Claude follows and rules it cannot break',
    excerpt: 'CLAUDE.md tells Claude what you want. Hooks make certain behaviors guaranteed. Most teams only use one. Here is how to know which one you actually need.',
    readTime: 6,
    cluster: 'Claude Code',
    body: `When you configure Claude Code, you have two tools for shaping how Claude behaves: CLAUDE.md and hooks. They look similar from the outside — both influence what Claude does. But they work in completely different ways, and confusing them is the reason most Claude Code setups have holes in them.

CLAUDE.md is a suggestion. Hooks are a guarantee.

That is the whole distinction. Everything else follows from it.

## What CLAUDE.md actually does

CLAUDE.md loads into Claude's working memory at the start of every session. (Working memory is Claude's version of short-term context — the space it holds instructions in while it works.) Claude reads it the same way it reads anything else you put in the conversation — and it follows the instructions it contains the same way a thoughtful person follows guidance: most of the time, in most situations, with reasonable interpretation of edge cases.

"Always use our custom logger module, not console.log" — Claude will do this in the vast majority of cases. If it is writing a quick debugging snippet in an unusual context, it might use console.log. You will catch it if you are reviewing. Over thousands of lines of code, it will slip occasionally.

This is not a bug. It is how AI assistants work — more like a well-trained colleague than a computer executing commands. CLAUDE.md is strong guidance, not a hard rule. Think of it the way you would think of a style guide for a new hire: they will follow it most of the time, and occasionally interpret edge cases differently.

That is exactly what you want for most things: coding conventions, naming patterns, architecture preferences, non-obvious gotchas. These do not need to be followed with zero exceptions. They need to be followed reliably. CLAUDE.md handles that well.

Where it breaks down: anything that must happen every single time, regardless of context. And anything that should be blocked before it happens, not corrected after.

## What hooks actually do

Hooks are shell scripts that fire automatically at specific points in Claude's workflow. They do not pass through Claude's judgment. They execute outside of it.

A PostToolUse hook that runs your formatter after every file edit does not depend on Claude remembering to run it. It runs because the hook fires. Claude edits a file, the hook triggers, the formatter runs — in that order, every time, with no exceptions for unusual contexts.

A PreToolUse hook that checks a proposed bash command against a blocklist does not trust Claude to decide not to run \`rm -rf /\`. It intercepts the command before Claude executes it. If the command matches a blocked pattern, exit code 2 stops everything. Claude sees the error and self-corrects.

This is deterministic behavior. The shell script runs every time, or it does not run at all. There is no "usually."

The distinction matters for two categories of things:

**Consistency you want to be absolute.** Code formatting. A standard header in every generated file. A log entry every time a specific file type is modified. If you want this to happen without exception — not "almost always" but literally every time — it needs to be a hook.

**Actions you want to prevent, not just discourage.** Destructive commands. Writing to credential files. Pushing directly to the main branch. CLAUDE.md can say "never do this." A PreToolUse hook can make it structurally impossible. If the consequence of the action happening even once is significant, use a hook.

## The practical split

For most teams, the right mental model is: CLAUDE.md for everything that shapes how Claude works, hooks for the handful of things that must be guaranteed or prevented.

CLAUDE.md holds: your run commands, architecture context, non-obvious gotchas, naming conventions, error handling patterns, the custom logger reminder. All of it matters. None of it needs to be enforced with zero-exception guarantees.

Hooks hold: the formatter (PostToolUse), the bash command firewall (PreToolUse), and possibly a test gate that prevents Claude from declaring done until the suite is green (Stop hook). Three scripts, committed to \`.claude/hooks/\`, covering the three things your team actually needs to guarantee.

Most teams never need more than this. The formatter and firewall cover the enforcement cases. Everything else goes in CLAUDE.md.

## The mistake that creates gaps

The gap appears when teams treat CLAUDE.md as the enforcement mechanism for things it cannot actually enforce.

"Never run \`npm install\` without checking with the user first" — this goes in CLAUDE.md. Claude will almost always follow it. But it is not a guarantee. If you actually need to prevent Claude from running npm install without confirmation, that is a PreToolUse hook that checks for the pattern and exits with code 2.

The tell: when you find yourself frustrated that Claude keeps doing something despite CLAUDE.md saying not to — the frustration is often correct, and the solution is moving that rule from CLAUDE.md to a hook. Not writing the CLAUDE.md instruction more forcefully. Not repeating it in the conversation. A hook.

The inverse mistake: over-engineering with hooks for things that do not need guarantees. Hooks run every time, which means they can slow down Claude's workflow and create friction if you apply them too broadly. A coding style preference in a hook is unnecessary — CLAUDE.md handles it fine, and the occasional miss is not worth the overhead.

## Which one to reach for

When you are deciding where something belongs, ask: what happens if Claude ignores this once?

If the answer is "nothing serious, I would catch it in review" — it goes in CLAUDE.md.

If the answer is "we would have a security issue, production would break, or the thing that happened would be hard to undo" — it goes in a hook.

That is the whole decision.`,
  },

]

async function seed() {
  console.log('Seeding batch 35...\n')

  for (const article of ARTICLES) {
    const term = await getTermId(article.termSlug)
    if (!term) {
      console.error(`  ✗ Term not found: ${article.termSlug} (for ${article.slug})`)
      continue
    }

    const { error } = await sb.from('articles').upsert({
      slug: article.slug,
      term_id: term.id,
      term_name: term.name,
      term_slug: article.termSlug,
      cluster: article.cluster,
      title: article.title,
      angle: article.angle,
      body: article.body.trim(),
      excerpt: article.excerpt,
      read_time: article.readTime,
      tier: 2,
      published: true,
    }, { onConflict: 'slug' })

    if (error) {
      console.error(`  ✗ ${article.slug}:`, error.message)
    } else {
      console.log(`  ✓ ${article.slug}`)
    }
  }

  console.log('\nDone.')
}

seed().then(() => process.exit(0))
