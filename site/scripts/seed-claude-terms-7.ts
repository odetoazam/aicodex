/**
 * Seed Claude terms batch 7 — Claude Code Skill (SKILL.md) + update existing Skill term
 * to surface the naming distinction.
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-claude-terms-7.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const TERMS = [
  {
    // Update: add the naming distinction note — two things called "Skills"
    slug: 'skill',
    name: 'Skills',
    aliases: ['Claude Skills', 'Claude.ai skill', 'custom skill'],
    cluster: 'Tools & Ecosystem',
    scope: 'technical',
    lifecycle_stage: 'adoption',
    audience: ['operator', 'user'],
    tier: 2,
    angles: ['def', 'process', 'role'],
    related_terms: ['connector', 'artifact', 'claude-projects', 'project-instructions', 'claude-code-skill'],
    claude_specific: true,
    definition: 'Skills are packaged workflows that tell Claude exactly how to execute a specific type of task — the steps, the methodology, the output format. There are two kinds: Anthropic\'s built-in Skills (which handle Excel, Word, PowerPoint, and PDF creation automatically for paid users) and custom Skills you build for your own repeatable processes. A custom Skill might encode your brand review checklist, your QBR structure, or your quarterly analysis methodology. You create one by describing your workflow to Claude — it builds the Skill file for you. Once saved, Claude invokes it automatically whenever you do that type of work. The difference from Projects: Projects hold what Claude needs to know; Skills define how Claude should act. Note: Claude Code also has a feature called Skills (SKILL.md files) — a separate concept for developer workflows. See Claude Code Skills.',
    published: true,
  },
  {
    slug: 'claude-code-skill',
    name: 'Claude Code Skills',
    aliases: ['SKILL.md', 'Code skill', 'agent skill'],
    cluster: 'Tools & Ecosystem',
    scope: 'technical',
    lifecycle_stage: 'adoption',
    audience: ['developer'],
    tier: 3,
    angles: ['def', 'process', 'role'],
    related_terms: ['claude-code', 'skill', 'mcp'],
    claude_specific: true,
    definition: 'Claude Code Skills are markdown files (SKILL.md) that teach Claude Code how to handle a specific type of task — your PR review format, your commit message style, your security checklist. Unlike CLAUDE.md which loads into every conversation, Skills load on-demand: only the name and description load at startup, the full instructions only load when a request matches. This keeps context efficient — you can have many skills without bloating every session. Skills live in four locations with a strict priority order: enterprise (managed settings) overrides personal (~/.claude/skills/) overrides project (.claude/skills/) overrides plugins. A critical gotcha: sub-agents do not inherit skills automatically — they start with a clean context, and you must explicitly list which skills they should load in the agent.md file. The allowed-tools field lets you restrict what Claude can do when a skill is active, useful for read-only or security-sensitive workflows. Not the same as Claude.ai Skills, which are workflow packages for productivity tasks.',
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
