/**
 * Batch 40 — Axis 3: What do I actually put in CLAUDE.md?
 * claude-md-templates
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-40.ts
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
    slug: 'claude-md-templates',
    angle: 'process',
    title: 'What to actually put in your CLAUDE.md',
    excerpt: 'Everyone says to set up CLAUDE.md. Nobody shows you what to write. Here are four real starting templates — for a solo project, a team backend, an agency client repo, and an ops/admin setup — with annotations explaining what each section does.',
    readTime: 8,
    cluster: 'Claude Code',
    body: `Every Claude Code article tells you to set up CLAUDE.md. None of them shows you what to actually write in it.

This article fixes that. Below are four working templates — for a solo project, a team backend codebase, an agency client repository, and a non-code ops setup. Each one is annotated to explain why each section is there, not just what it says.

Use them as starting points and cut anything that does not apply to your situation. A focused 30-line CLAUDE.md beats a comprehensive 200-line one that Claude has to work to parse.

---

## Template 1: Solo project (side project / early-stage startup)

Best for: one developer, one codebase, personal preferences only. The goal here is to tell Claude how you like to work and what the project is, so you do not repeat yourself every session.

\`\`\`markdown
# Project context
[App name] is a [brief description in one sentence, e.g. "B2B SaaS tool for HR teams that automates onboarding checklists"].
Stack: [e.g. Next.js 14, TypeScript, Supabase, Tailwind CSS]
Deploy: [e.g. Vercel, from the root directory]

# How I work
- I prefer short functions over clever abstractions. If something is more than 30 lines, ask whether it should be split.
- Always use TypeScript — no \`any\` types without a comment explaining why.
- Comments only where the logic is non-obvious. Do not comment every line.
- When in doubt, match the existing code style rather than improving it. Consistency over correctness.

# Running the project
- Dev server: \`npm run dev\`
- Tests: \`npm test\`
- Seed database: \`npm run db:seed\`
- Build: \`npm run build\` (run before suggesting a PR is ready)

# Common gotchas
- [e.g. The auth flow uses a custom session handler in lib/auth.ts, not NextAuth]
- [e.g. Environment variables: .env.local for dev, set in Vercel for prod]
- [e.g. Do not modify the DB schema directly — use migration files in /migrations]
\`\`\`

**What each section does:**

*Project context* — Gives Claude the one-sentence answer to "what are we building and with what?" Without this, Claude's answers drift toward generic patterns instead of your stack.

*How I work* — Your preferences for code style. The most important part for solo projects. Claude will hold these across the entire session.

*Running the project* — The commands Claude needs to run things. Without this it will either guess, ask, or run the wrong command. Five minutes of accuracy for every future session.

*Common gotchas* — Custom decisions that deviate from what Claude would expect. If you use a non-standard auth setup, a custom DB migration pattern, or anything that contradicts common conventions, document it here. This is where CLAUDE.md earns back its setup time the fastest.

---

## Template 2: Team backend project

Best for: 2–6 engineers sharing a codebase. The focus shifts from personal preferences to shared agreements — what the team has decided, not what one person prefers.

\`\`\`markdown
# Project overview
[Service name]: [one sentence description]
Owned by: [team name]
Stack: [languages, frameworks, key libraries]
Primary DB: [e.g. PostgreSQL via Prisma]

# Architecture
- Entry points: [e.g. src/api/ for HTTP handlers, src/workers/ for background jobs]
- Data access: [e.g. All DB queries go through src/db/repositories/ — do not query directly]
- Config: [e.g. Config is loaded from environment variables via src/config.ts, not imported directly]
- [Any other non-obvious structural decisions]

# Team conventions
- Branch naming: [e.g. feat/, fix/, chore/]
- PRs require: [e.g. tests for new features, updated types, no TODO comments without a ticket reference]
- Test runner: [e.g. Jest, run with \`npm test\`]
- We use conventional commits: feat:, fix:, chore:, docs:

# What to check before finishing
- [ ] Does it have a test?
- [ ] Are types correct (no \`any\` without justification)?
- [ ] Does the PR description explain the why, not just the what?
- [ ] Was the run command confirmed to work?

# Do not do this
- [e.g. Do not add dependencies without checking with the team first]
- [e.g. Do not modify shared types in src/types/shared.ts without a migration plan]
- [e.g. Do not use console.log — use the logger in src/lib/logger.ts]
\`\`\`

**What each section does:**

*Architecture* — The most important section for team repos. Documents structural decisions that Claude would otherwise have to infer from the code. When Claude knows that all DB access goes through a repository layer, it will generate code that matches that pattern instead of querying directly.

*Team conventions* — The agreements that exist in people's heads, not in the code. Commit format, PR requirements, branch naming. Documenting them in CLAUDE.md means Claude can remind you when a generated change drifts.

*What to check before finishing* — A checklist that Claude runs before calling something done. This is the highest-leverage addition for teams: Claude will not hand you work that skips the team's quality bar.

*Do not do this* — Explicit prohibitions. These often prevent the errors that happen when Claude makes a reasonable-seeming choice that contradicts a decision your team made for reasons that are not obvious from the code.

---

## Template 3: Agency / client project

Best for: an agency or freelancer setting up Claude Code on a client's codebase. The focus is on protecting the client — not changing things that should not change, following their conventions, and flagging anything non-obvious before acting.

\`\`\`markdown
# Client context
Client: [Company name]
Project: [what we are building or maintaining]
Our role: [e.g. Building new features on their existing codebase, or: Full ownership of this service]

# Their conventions (do not deviate without asking)
- [e.g. They use camelCase for everything, including database fields]
- [e.g. All API responses follow the shape in src/types/api.ts — match it exactly]
- [e.g. No external dependencies without client approval]

# Do not touch
- [e.g. src/legacy/ — this is unmaintained code they want to keep but not change]
- [e.g. The payment flow in src/checkout/ — always check with the client before modifying]
- [e.g. Any database migration without running it past the client's DBA first]

# Running the project
[Commands to run dev server, tests, build]

# Handoff notes
- [Anything the client needs to know to run this themselves]
- [e.g. Environment variables are in .env.example — client fills in production values]
\`\`\`

**What each section does:**

*Their conventions* — The most important section for client work. Claude will match whatever conventions are in the code when it can read them, but explicit documentation prevents it from "improving" things to match general best practices when the client has a different standard.

*Do not touch* — Explicit boundaries for the engagement. On client projects, there are almost always parts of the codebase that are out of scope or risky to change. Documenting them prevents Claude from generating changes in areas you are not supposed to touch.

*Handoff notes* — Instructions for the client's team after you leave. Writing them in CLAUDE.md means they are there when the client's developer opens the project and starts a session.

---

## Template 4: Non-code ops / admin setup

Best for: an ops manager, executive assistant, or team lead using Claude Code for documents, SOPs, and non-technical work — not code. This is the least common CLAUDE.md setup, but it is useful if you are running Claude Code for writing and documentation work rather than development.

\`\`\`markdown
# What this workspace is for
[One sentence: e.g. "Drafting and maintaining team SOPs, internal comms, and vendor documentation."]

# Organization context
Company: [Name]
Team: [Your team/department]
My role: [Your title and responsibilities]

# Writing standards
- Tone: [e.g. Clear, direct, no corporate buzzwords. Write like a smart person explaining something to a colleague.]
- Format: [e.g. Use headers. Keep sections short. Bullet points for lists of 3+.]
- Audience: [e.g. Internal team — assume familiarity with the business but not with this specific process]

# Document types we work with
- [e.g. SOPs: step-by-step guides with clearly assigned owners for each step]
- [e.g. Vendor communications: professional, direct, specific about deadlines and consequences]
- [e.g. Status updates: brief, bottom-line up front, then supporting detail]

# Important context
- [e.g. Our fiscal year ends March 31 — references to "Q4" mean Jan-Mar]
- [e.g. Key stakeholders: [names and titles of people Claude might need to reference]]
- [e.g. We have a style guide at [location] — match it for formal documents]
\`\`\`

**What each section does:**

*Organization context* — Equivalent to the "stack" section in a code project. Tells Claude who you are and where you work, so it does not produce generic content.

*Writing standards* — The most important section for non-code work. Without this, Claude defaults to a formal, hedged, slightly AI-sounding register. Documenting your actual tone standard produces much more usable first drafts.

*Document types* — Tells Claude what kind of documents you produce and what the format conventions are. This removes the need to specify format on every request.

---

## The one rule that applies to all of them

Every section in CLAUDE.md should answer a question Claude would otherwise have to guess at. If Claude could infer something from reading your code or files, it does not need to be documented. If Claude would have to ask, or would get it wrong, document it.

Start with the two highest-value sections: how the project runs (commands), and the non-obvious decisions (gotchas). Everything else can come later.

One practical limit: keep CLAUDE.md under 200 lines. Beyond that, Claude has too many instructions to hold reliably in working memory at once. When you hit that limit, move non-essential sections into \`.claude/rules/\` files — they load automatically and keep the main file focused. More on how CLAUDE.md degrades over time (and how to prevent it) in the [maintenance guide](/articles/claude-md-maintenance).

---

*For more on what CLAUDE.md is and how it differs from hooks, [this article covers the distinction](/articles/claude-md-vs-hooks). For the four ways CLAUDE.md breaks down over time and how to keep it accurate, [see the maintenance guide](/articles/claude-md-maintenance).*`,
  },
]

async function seed() {
  console.log('Seeding batch 40...\n')

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
