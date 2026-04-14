/**
 * Batch 41 — Axis 4 (Claude Code × Agencies): client project setup
 * claude-code-client-setup
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-41.ts
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
    slug: 'claude-code-client-setup',
    angle: 'process',
    title: 'Setting up .claude on a client project',
    excerpt: "The setup you build for yourself and the setup you build for a client are two different things. One optimizes for your preferences. The other has to survive your departure.",
    readTime: 7,
    cluster: 'Claude Code',
    body: `The setup you build for yourself and the setup you build for a client are two different things. One optimizes for your preferences. The other has to survive your departure.

Most consultants and agency developers treat client Claude Code setup the same way they treat their own — documenting their preferences, their conventions, their workflow habits. The client's team then inherits a Claude setup that made sense for the person who built it and is confusing for everyone else.

This article covers what is different about setting up .claude on a client project, and the specific decisions that determine whether the setup gets used after you leave.

## The handoff problem

Here is what happens when you do not think about handoff: you build an excellent CLAUDE.md that describes the project accurately, set up hooks that enforce the conventions you care about, and leave detailed notes. Three months later you check in and discover that the client's developers deleted the hooks because one of them was failing on Windows, changed the CLAUDE.md to add a bunch of preferences without removing yours, and generally reverted to treating Claude like a blank slate.

The failure is not that they did not care. It is that they did not understand what you built or why. A setup that requires understanding to maintain will not be maintained.

The goal for a client setup is: the client's team can use it without knowing anything about how you configured it, and they can change the things that should change without breaking the things that should not.

## What goes in .claude/ vs. what stays out

On your own projects, the .claude folder contains everything. On a client project, you need to be more deliberate.

**Commit to the repo:**
- \`CLAUDE.md\` — the shared project context and conventions. This is what the whole team uses.
- \`.claude/settings.json\` — permission policy and any deny list entries. This is a security and consistency decision, not a personal preference. It should be shared.
- \`.claude/rules/\` — any rule files that encode the client's conventions. If they have a specific test structure, a required code review checklist, or compliance requirements, these go in rules/ so they load reliably.

**Do not commit:**
- Your personal instruction overrides. If you have habits Claude should follow for you specifically (your preferred output length, your formatting preferences), these belong in your global \`~/.claude/\` folder, not the project.
- Hooks that depend on your personal machine setup. A hook that references an absolute path on your machine or a tool that is not in the project's standard tooling will break for every other developer on the team.

**Document in CLAUDE.md what you configured and why:**
This is the most important thing you can do for the client's team. Not just what the setup does, but why each decision was made. "Hooks enforce formatting on save" is a configuration fact. "Hooks enforce formatting on save because the client's CI pipeline fails on formatting errors and we lost two hours to this in week 1" is information someone can make a decision with.

## Writing CLAUDE.md for someone else to own

The client's CLAUDE.md is not yours to optimize. It is a team document that needs to be accurate, maintainable, and written for someone who was not in the room when the project started.

Three principles:

**Write for a developer joining the project in six months.** Not for yourself. Not for the developer you are working with today. What does someone need to know to be productive quickly, and what would they get wrong without the document?

**Separate facts from preferences.** "All API routes are in \`src/api/\`" is a fact — it should be in CLAUDE.md. "Use descriptive variable names" is a preference — it does not need to be there (Claude will do this anyway, and if the client's team does not care, the instruction just adds noise). Every line in CLAUDE.md should answer: is this something a developer on this project would need to know that they could not learn from reading the code?

**Put the "do not touch" list prominently.** On client projects, there are almost always parts of the codebase that are fragile, out of scope, or require special care. These are the most important things to document explicitly. If a section of code should only be changed after consulting the client's internal team, say so clearly at the top of CLAUDE.md, not buried in a notes section.

## Hooks: simpler is more durable

Hooks are the part of a Claude Code setup most likely to be deleted by the client's team after you leave — especially if they cause problems for developers on different machines or operating systems.

The rule for client projects: only add hooks you can defend the purpose of in one sentence to a developer who has never seen Claude Code before.

"This hook runs \`prettier\` on save and rejects the change if it fails" is defensible. The developer can understand it, disable it if needed, and fix it if it breaks.

"This hook validates that all function names follow our naming convention by running a custom lint script" is harder to maintain. If the lint script breaks or the convention changes, the hook becomes an obstacle.

For client projects specifically:
- Prefer hooks that use tools already in the project's dependencies — not tools that require separate installation
- Use \`$CLAUDE_PROJECT_DIR\` for all paths, not absolute paths on your machine
- Test every hook on a fresh checkout before considering the setup complete
- Document what each hook does and what error code it returns in CLAUDE.md

If you are unsure whether a hook will be maintained, leave it out. A missing hook is better than a broken one that the client's developer disables along with the ones that should stay.

## The handoff document

Before you leave a client project, write a short handoff document that covers three things:

1. **What the .claude setup does** — not just what it contains, but what behavior it produces. "CLAUDE.md tells Claude about the project structure. The settings.json blocks file deletions in production directories. There are two hooks: one runs tests before commits, one enforces the import order lint rule."

2. **What should be maintained** — which parts of the setup are important to keep and which are just starting points. "The deny list in settings.json is important to keep — it prevents Claude from deleting files in /data/. The hooks can be modified if they cause problems, but check whether there is a CI equivalent before removing them."

3. **How to update it** — a short guide to adding new instructions to CLAUDE.md, enabling or disabling a hook, and testing changes. Most client developers have not configured Claude Code before. The document should answer the questions they will have when they try to change something.

This document can be short. Half a page is enough. The goal is that the client's developer can maintain the setup without asking you for help.

## The honest summary

Setting up Claude Code on a client project is less about configuration sophistication and more about durability. The best client Claude Code setup is the one that is still working correctly a year after you leave — because the client's team understands it, maintains it, and can adapt it as the project changes.

That means: less configuration than you would put on your own project, more documentation, and a much higher bar for what goes into hooks. Build for the developer who will take it over, not for yourself.

---

*If you are still learning what the .claude folder can do, [the setup guide](/articles/claude-code-project-setup) covers the five layers in priority order. For a set of CLAUDE.md starting templates you can adapt for clients, [the templates article](/articles/claude-md-templates) has annotated examples for four project types including an agency/client template.*`,
  },
]

async function seed() {
  console.log('Seeding batch 41...\n')

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
