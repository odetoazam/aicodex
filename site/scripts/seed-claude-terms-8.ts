/**
 * Seed Claude terms batch 8 — Claude Code Subagent
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-claude-terms-8.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const TERMS = [
  {
    slug: 'claude-code-subagent',
    name: 'Subagents',
    aliases: ['Claude Code subagent', 'custom subagent', 'agent delegation'],
    cluster: 'Agents & Orchestration',
    scope: 'technical',
    lifecycle_stage: 'adoption',
    audience: ['developer'],
    tier: 3,
    angles: ['def', 'process', 'role', 'failure'],
    related_terms: ['claude-code', 'claude-code-skill', 'task-decomposition', 'ai-agent'],
    claude_specific: true,
    definition: 'Subagents in Claude Code are separate conversation contexts that the main agent spins up to handle isolated work. The subagent gets a task, does its own file reads, searches, and tool calls, then returns a summary — after which its entire context is discarded. Your main thread only sees the question and the answer, not the 15 files that were read along the way. This keeps your main context window clean for longer sessions. Three things most people miss: (1) Subagents do not inherit your skills automatically — you must explicitly list which skills to load in the agent.md file. (2) Adding "proactively" to a subagent\'s description field makes the main agent delegate to it automatically without you asking. (3) You can assign a different model per subagent — Haiku for fast lookups, Opus for deep analysis — which matters for cost. Three patterns that consistently backfire: sequential pipelines where each step depends on the last (information dies in the handoff), test runner subagents (you need the full output to debug, not a summary), and "expert persona" subagents like "you are a Python expert" (Claude already knows this — it adds nothing). Best use cases: research and codebase exploration, code reviews (fresh context means better feedback — Claude reviewing code it helped write produces weaker critique), and tasks that need a completely different system prompt from your main thread.',
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
