/**
 * Seed Claude terms batch 4 — Skills rewrite, Artifacts update
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-claude-terms-4.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const TERMS = [
  {
    // Full rewrite — old def described generic "capabilities" (web search, code, images).
    // Skills are now workflow/process packages: Anthropic's built-ins (Excel/Word/PPT/PDF)
    // + custom ones you build for your own repeatable processes.
    slug: 'skill',
    name: 'Skills',
    aliases: ['Claude Skills', 'Claude.ai skill', 'custom skill'],
    cluster: 'Tools & Ecosystem',
    scope: 'technical',
    lifecycle_stage: 'adoption',
    audience: ['operator', 'user'],
    tier: 2,
    angles: ['def', 'process', 'role'],
    related_terms: ['connector', 'artifact', 'claude-projects', 'project-instructions'],
    claude_specific: true,
    definition: 'Skills are packaged workflows that tell Claude exactly how to execute a specific type of task — the steps, the methodology, the output format. There are two kinds: Anthropic\'s built-in Skills (which handle Excel, Word, PowerPoint, and PDF creation automatically for paid users) and custom Skills you build for your own repeatable processes. A custom Skill might encode your brand review checklist, your QBR structure, or your quarterly analysis methodology. You create one by describing your workflow to Claude — it builds the Skill file for you. Once it\'s saved, Claude invokes it automatically whenever you do that type of work. The difference from Projects: Projects hold what Claude needs to know; Skills define how Claude should act.',
    published: true,
  },
  {
    // Update — adds remix/publish detail and cleaner type breakdown
    slug: 'artifact',
    name: 'Artifacts',
    aliases: ['Claude Artifacts'],
    cluster: 'Tools & Ecosystem',
    scope: 'technical',
    lifecycle_stage: 'adoption',
    audience: ['user'],
    tier: 2,
    angles: ['def', 'process'],
    related_terms: ['skill', 'claude-projects', 'claude-code'],
    claude_specific: true,
    definition: 'Artifacts are self-contained outputs Claude creates in a dedicated side panel — not buried in chat. They can be documents (Word, PDF, Markdown), spreadsheets, presentations, working code, full HTML pages, SVG graphics, diagrams, or interactive React components with real logic. You can preview, copy, download, or iterate on them without leaving the conversation. The shareable version: publish an artifact publicly and anyone with the link can view and interact with it — no Claude account needed. They can also "remix" it, opening it in their own Claude to build on. On Team and Enterprise plans, sharing stays org-internal behind authentication.',
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
