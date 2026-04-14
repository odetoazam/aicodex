/**
 * Batch 37 — Failure-mode: CLAUDE.md maintenance
 * claude-md-maintenance
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-37.ts
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
    slug: 'claude-md-maintenance',
    angle: 'failure',
    title: 'Why your CLAUDE.md stops working — and how to keep it accurate',
    excerpt: 'Most teams set up CLAUDE.md once and never touch it again. Three months later, Claude is ignoring parts of it, following instructions that no longer apply, and producing inconsistent output for reasons nobody can identify.',
    readTime: 6,
    cluster: 'Claude Code',
    body: `Most teams set up CLAUDE.md once and never touch it again. Three months later, Claude is ignoring parts of it, following instructions that no longer apply, and producing inconsistent output for reasons nobody can identify.

CLAUDE.md does not break dramatically. It decays quietly. And by the time anyone notices, the file has become a mix of accurate instructions, outdated ones, and a few that directly contradict each other — all loaded into Claude's working memory at the start of every session.

Here are the four ways this happens and what to do about each.

## Problem 1: The file got too long

CLAUDE.md starts at 20 lines. Over three months, six people add to it: a new gotcha, an architecture note, a convention discovered after a painful bug, a reminder about the testing setup. Nobody removes anything. The file is now 300 lines.

The result: Claude's instruction-following degrades. Not because Claude ignores long files — it reads all of them. But Claude's working memory has limits, and when there are too many instructions to track simultaneously, newer or lower-priority ones get underweighted. You get a CLAUDE.md that is technically comprehensive and practically unreliable.

**The signal:** More than 200 lines is a warning sign. More than 50 distinct instructions is a stronger one — Claude has to hold all of them in active context simultaneously, and the more there are, the more likely lower-priority ones get deprioritized mid-task.

**The fix:** Set a line limit. 200 lines is the outer edge. When the file approaches it, move sections into \`.claude/rules/\` — separate files that load automatically but stay organized by concern (testing conventions in one file, API patterns in another). This keeps CLAUDE.md focused on essentials while preserving the full instruction set.

## Problem 2: Contradictory instructions

Someone adds a line in February: "Always use async/await, never .then()." In March, a different person adds: "Use .then() chaining for Promise chains in the utilities directory for consistency with the existing code." Neither person checked for conflicts. Both lines are now in CLAUDE.md.

Claude does not throw an error when instructions conflict. It does its best to reconcile them, which means its behavior becomes inconsistent and hard to predict. You get different output depending on which instruction Claude weighted more heavily in a given context.

**The diagnostic:** When you notice Claude doing something inconsistent — sometimes following a convention, sometimes not — paste your CLAUDE.md into a new conversation and ask: "Are there any instructions in this file that conflict with each other, or that could be interpreted in contradictory ways?" Claude is often good at identifying its own conflicting instructions.

**The fix:** Audit for contradictions when you add new lines. Before adding anything to CLAUDE.md, scan for existing instructions that touch the same topic. If you find a conflict, resolve it in the same edit — do not add a new instruction on top of an old one that says something different.

## Problem 3: The architecture changed but CLAUDE.md did not

In January, CLAUDE.md says: "All database access goes through the repository layer in \`src/db/\`." In February, you refactored and moved database logic to \`src/data/\`. Nobody updated CLAUDE.md.

Claude now confidently creates files in the wrong directory, writes imports that reference a path that no longer exists, and flags your actual code as potentially incorrect because it does not match the instructions.

This is the most common form of CLAUDE.md decay, and the hardest to notice. The file does not feel wrong — it describes how the project used to work, and that feels plausible to everyone who does not remember the refactor.

**The trigger to look for:** When Claude consistently puts things in the wrong place or references paths that do not exist, check whether CLAUDE.md describes the current architecture or the old one. A mismatch here explains a surprising amount of misbehavior.

**The fix:** Treat architecture changes as CLAUDE.md changes. When you rename a directory, update a library, or restructure how a module works — add updating CLAUDE.md to the same PR. Make it part of the change, not a follow-up task that gets skipped.

## Problem 4: Dead instructions nobody removed

Run commands change. The testing setup changes. The custom logger module gets deprecated and replaced. But the instructions stay in CLAUDE.md, pointing at things that no longer exist.

Dead instructions are not harmless. Claude follows them anyway. "Always run \`npm run test:integration\` before committing" — if that script no longer exists, Claude will try to run it, fail, and either flag the failure or silently produce incorrect output depending on the context.

**The quarterly audit:** Once every quarter, go through CLAUDE.md line by line and ask a single question for each instruction: is this still true? Not "was it true when we wrote it" — is it true now? Delete anything that is not.

Specific things to check: run commands that reference scripts — do those scripts still exist? Directory paths — are those directories still there? Library or framework references — are you still using those? Any instruction with a version number or a specific tool name is the highest-risk category.

Five minutes, three or four times a year. The return is a CLAUDE.md that Claude can actually rely on instead of one that has become a source of noise.

## The maintenance habit that prevents all four

The single most effective maintenance trigger is new team member onboarding.

When a new developer joins and uses CLAUDE.md for the first time, they will surface every inaccuracy within hours. They do not have the context to explain away wrong information — they will try to follow Claude's guidance, hit an error, and ask why Claude is telling them to do something that does not work.

Run a "CLAUDE.md accuracy check" whenever someone new joins. Have them note every time Claude gives them incorrect or confusing guidance in their first week. Fix those entries. The file will be more accurate after their first week than it was before.

The teams with the most reliable Claude Code setups are not the ones with the most comprehensive CLAUDE.md files. They are the ones who treat CLAUDE.md as a living document — reviewed when things change, cleaned up when they do not, and audited before anyone new has to depend on it.

---

*If you are still setting up CLAUDE.md for the first time, [the setup article](/articles/claude-code-project-setup) covers what each layer of the .claude folder does and which ones to set up first. If you want to understand why CLAUDE.md is guidance while hooks are enforced rules, [that distinction is covered here](/articles/claude-md-vs-hooks).*`,
  },

]

async function seed() {
  console.log('Seeding batch 37...\n')

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
