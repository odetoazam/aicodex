/**
 * Seed Claude terms batch 10 — CLAUDE.md, Hooks, Plan Mode (Claude Code 101)
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-claude-terms-10.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const TERMS = [
  {
    slug: 'claude-md',
    name: 'CLAUDE.md',
    aliases: ['claude.md file', 'project memory file', 'Claude Code memory'],
    cluster: 'Tools & Ecosystem',
    scope: 'technical',
    lifecycle_stage: 'adoption',
    audience: ['developer'],
    tier: 2,
    angles: ['def', 'process', 'role'],
    related_terms: ['claude-code', 'claude-code-hooks', 'claude-code-skill', 'context-window'],
    claude_specific: true,
    definition: 'CLAUDE.md is a Markdown file you add to your project root that Claude Code reads automatically at the start of every session. Its contents are appended to your prompt — so whatever is in there, Claude already knows before you type a single thing. Think of it as an onboarding doc for your codebase: your tech stack, your dev commands, your code conventions, and any corrections you\'ve had to make more than once. There are two levels: project-level (root of your project, checked into version control so your whole team benefits) and user-level (your personal config folder, applies across all projects, for preferences that are yours alone). A few practical things most people miss: (1) Don\'t start with one. Use Claude Code for a while first and notice where you keep course-correcting. When you know what to include, run /init and Claude will generate one from your session history. Keeps it focused instead of bloated. (2) If you catch yourself correcting Claude repeatedly — say, "use server actions, not API routes" — tell Claude to save that rule to CLAUDE.md. It won\'t rediscover it the next session. (3) CLAUDE.md is for instructions. Hooks are for enforcement. If it needs to happen every time without fail, put it in a hook — not here. Things in CLAUDE.md usually happen. Things in hooks always happen.',
    published: true,
  },
  {
    slug: 'claude-code-hooks',
    name: 'Hooks',
    aliases: ['Claude Code hooks', 'PostToolUse hook', 'PreToolUse hook', 'lifecycle hooks'],
    cluster: 'Tools & Ecosystem',
    scope: 'technical',
    lifecycle_stage: 'adoption',
    audience: ['developer'],
    tier: 3,
    angles: ['def', 'process', 'role', 'failure'],
    related_terms: ['claude-code', 'claude-md', 'claude-code-skill', 'mcp'],
    claude_specific: true,
    definition: 'Hooks are shell commands that run at specific points in Claude Code\'s lifecycle — before a tool call, after a file edit, when you submit a prompt, or when Claude finishes a response. The key distinction: everything else in Claude Code is probabilistic (Claude will usually follow instructions). Hooks are deterministic — they always run, no exceptions. You can tell Claude in CLAUDE.md to run Prettier after every file edit. Most of the time it will. A hook makes it happen every single time. There are five events: PreToolUse (before a tool runs), PostToolUse (after a tool completes), UserPromptSubmit (when you submit a prompt, before Claude processes it), Stop (when Claude finishes responding), and Notification (when Claude sends a notification). For PreToolUse hooks, the exit code controls behavior: 0 = proceed normally, 2 = block the action (your stderr message gets fed back to Claude as context so it knows why and can adjust), anything else = non-blocking error shown to you but not blocking. This is how teams enforce hard rules: block writes to production config directories, block bash commands containing rm -rf, block direct commits to main. Configure hooks with /hooks inside a Claude Code session, or edit .claude/settings.json directly. Project-level hooks live in .claude/settings.json and should be checked into version control — your whole team gets them automatically. Use CLAUDE_PROJECT_DIR in hook commands to reference scripts in your project so they work from any working directory.',
    published: true,
  },
  {
    slug: 'plan-mode',
    name: 'Plan Mode',
    aliases: ['Claude Code plan mode', 'planning mode'],
    cluster: 'Tools & Ecosystem',
    scope: 'technical',
    lifecycle_stage: 'adoption',
    audience: ['developer'],
    tier: 2,
    angles: ['def', 'process', 'role'],
    related_terms: ['claude-code', 'claude-code-subagent', 'context-window', 'claude-md'],
    claude_specific: true,
    definition: 'Plan Mode is a read-only execution mode in Claude Code — it analyzes your codebase and produces a plan of action without editing any files. Press Shift+Tab to cycle through modes (approval → auto-accept → plan mode). In plan mode, Claude reads files, runs web searches, and asks clarifying questions, then returns a structured plan you can review before a single line of code changes. You can approve the plan, ask it to revise specific parts, or ask questions before committing. Why it matters: most people jump straight to "write the code" and spend more time course-correcting than they would have spent planning. Plan mode is where it costs nothing to change direction. Once Claude starts editing files, every mistake requires a fix. Three situations where plan mode is the right default: (1) multi-step feature changes that touch more than a few files, (2) anything that involves dependencies or architectural decisions, (3) code review — restrict Claude to read-only tools and ask it to review without editing. The explore subagent does something similar (codebase exploration without planning), but plan mode is specifically scoped to a task you\'re about to implement. Running /compact after plan approval also helps — the exploration context is summarized before the coding phase begins, freeing up space for the actual work.',
    published: true,
  },
]

async function main() {
  console.log(`Upserting ${TERMS.length} terms...`)

  for (const term of TERMS) {
    const { error } = await sb
      .from('terms')
      .upsert({
        ...term,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'slug' })
      .select('slug')

    if (error) {
      console.error(`  ✗ ${term.slug}:`, error.message)
    } else {
      console.log(`  ✓ ${term.slug}`)
    }
  }

  console.log('\nDone.')
}

main().catch(console.error)
