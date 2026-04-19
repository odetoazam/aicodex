/**
 * Batch 34 — Claude Code team configuration (operator angle)
 * claude-code-for-your-team
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-34.ts
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
    slug: 'claude-code-for-your-team',
    angle: 'process',
    title: 'Claude Code for your team: the five decisions that actually matter',
    excerpt: 'Most teams let one developer set up the .claude folder and never discuss it again. These are the decisions you should make together — and what breaks when you skip them.',
    readTime: 7,
    cluster: 'Claude Code',
    body: `The .claude folder is not a developer tool. It is a team agreement written in markdown and JSON.

When a team skips it — or lets one person set it up without discussion — everyone ends up correcting Claude individually, in their own sessions, with no shared baseline. The developer who knows what \`npm run test:reset\` does. The team lead who knows not to touch the .env file. The manager who knows Claude keeps getting the codebase structure wrong. All of them giving Claude the same corrections, repeatedly, in every session.

The configuration that fixes this takes under an hour to set up. These are the five decisions your team actually needs to make.

## Decision 1: What goes in CLAUDE.md — and how long it stays

CLAUDE.md is the one file Claude reads at the start of every session, in every conversation, automatically. Whatever you write there, Claude holds in memory for the entire conversation.

Every line in CLAUDE.md takes up space in Claude's working memory — the space it holds instructions in while it works. Files that grow past 200 lines start hurting more than they help. Not because Claude ignores long files, but because Claude gets worse at following all the instructions at once when there are too many of them.

What actually belongs there: your run commands (five lines that prevent Claude from ever asking how to start the app), the stack in two sentences (what it is, which directories hold what), and three to four non-obvious gotchas — things Claude would get wrong by default that nobody would think to explain. For example: a stricter code-quality setting that Claude won't know to use unless you tell it. A real local database in tests, not a stand-in that simulates one (Claude defaults to the stand-in; that causes tests to pass when the real app would fail). A custom error-logging module instead of the generic one Claude would use by default.

The test for every line: would Claude get this wrong on the first try without it? If yes, it belongs. If Claude would figure it out from reading the code, leave it out.

**The coordination question:** CLAUDE.md is a shared file in the repo. Who updates it when something important changes — a new run command, a gotcha someone discovers? Pick one person to own it, or agree that anyone can add to it but no one edits existing lines without a quick discussion. CLAUDE.md merge conflicts are real. The rules/ folder (covered below) is the fix when the file starts growing.

## Decision 2: What Claude is and is not allowed to do

\`.claude/settings.json\` is your team's permission policy. Two lists: allow and deny.

**Allow list** — commands that run without Claude asking for confirmation. For most teams: your build and run scripts (\`Bash(npm run *)\`), standard file operations (Read, Write, Edit, Glob, Grep), read-only git commands.

**Deny list** — commands blocked entirely, regardless of context. A sensible minimum: \`Bash(rm -rf *)\` for destructive shell commands, \`Bash(curl *)\` for direct network calls, \`Read(./.env)\` and \`Read(./.env.*)\` for credential files.

The important thing about the deny list: if you do not add something to it, Claude can access it. That is the default. If you have API keys, database credentials, or sensitive configuration files in your project, they need to be explicitly denied — or Claude will read them when a task asks it to understand your environment.

This is the conversation your team needs to have once. What does Claude need access to? What should it never touch? The allow list is convenience. The deny list is security.

For personal permission preferences — someone wants to allow a command on their machine that the team has not agreed to — \`.claude/settings.local.json\` works the same way and is auto-gitignored.

## Decision 3: Do you want hooks, and if so, are they portable?

Hooks are shell scripts that fire automatically at specific points — before Claude runs a command (PreToolUse), after Claude edits a file (PostToolUse), when Claude declares it is finished (Stop). The most common use: a formatter that runs after every file edit, so Claude never produces unformatted code.

The trap that breaks most hook setups: scripts that only work on one machine.

If a hook references a script at \`/Users/yourname/.claude/hooks/format.sh\`, it works for you and nobody else. If it uses a relative path, it depends on where Claude Code is invoked from. Both break for teammates.

The fix: put hook scripts inside \`.claude/hooks/\` in your project root, commit them to git, and reference them using \`$CLAUDE_PROJECT_DIR\` — the environment variable Claude Code sets to the project root. Every teammate who clones the repo gets the same hooks, pointing to the same scripts.

One thing worth knowing: hooks use exit codes to communicate. Exit code 2 is the only code that actually blocks Claude. Exit code 1 logs a warning and does nothing — if you write a security hook that exits with code 1, Claude proceeds anyway. For any hook meant to prevent an action, the exit code must be 2.

If your team is not ready to maintain hook scripts, skip hooks for now. Hooks that only work on one machine are worse than no hooks. Come back when someone has a free afternoon.

## Decision 4: Personal vs. shared configuration

Two .claude folders exist. One lives inside your project and gets committed to git — that is team configuration. The other lives at \`~/.claude/\` in each person's home directory — that is personal.

Missing the personal folder means everyone's individual preferences either go undocumented or end up in the shared CLAUDE.md where they do not belong.

The split is straightforward: what Claude needs to know to work in this codebase goes in the project CLAUDE.md. What Claude needs to know about how you personally like to work goes in \`~/.claude/CLAUDE.md\`. Both files load into every session; the project file takes precedence on any conflict.

\`CLAUDE.local.md\` in the project root also works for this — it is auto-gitignored and loads alongside the main CLAUDE.md. If someone has a strong personal preference that is codebase-specific (a preferred test runner, a workflow quirk), it goes here instead of polluting the shared file.

## Decision 5: When to split into rules/ (not yet — but know the signal)

At some point your CLAUDE.md grows. Different people own different sections. The API conventions section gets long. You want rules about database queries to only load when Claude is working in the database layer.

\`.claude/rules/\` is the fix. Every markdown file in that folder loads alongside CLAUDE.md automatically. Instead of one file everyone edits, you have separate files organized by concern — \`api-conventions.md\`, \`testing.md\`, \`code-style.md\`. Each file can also be path-scoped with YAML frontmatter: add a \`paths\` field and it only loads when Claude is working in matching directories. API rules stay out of Claude's context when it is editing a React component.

Most teams do not need this early. The signal: CLAUDE.md approaches 200 lines, or two people edit it in the same week and create a merge conflict. That is the moment — not day one.

## The minimum viable setup

Day one, you need two things:

**CLAUDE.md** (~20 lines): run commands, stack in two sentences, which directories hold what, and three to four non-obvious gotchas.

**settings.json** (deny list at minimum): \`Bash(rm -rf *)\`, \`Bash(curl *)\`, \`Read(./.env)\`, \`Read(./.env.*)\`. Add an allow list for your build scripts so Claude does not ask for confirmation on every run.

Everything else — hooks, rules/, personal settings — you add when you feel the friction that makes them worth the time. The teams that try to configure everything on day one end up with a complicated setup nobody maintains. The ones who start with 20 lines and a deny list end up with a CLAUDE.md that is actually accurate six months later.`,
  },

]

async function seed() {
  console.log('Seeding batch 34...\n')

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
