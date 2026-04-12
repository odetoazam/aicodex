/**
 * Seed Claude terms batch 3 — Projects update + new terms: Project Instructions, Scheduled Tasks
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-claude-terms-3.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const TERMS = [
  {
    // Update: adds RAG auto-scaling detail + collaboration layer
    slug: 'claude-projects',
    name: 'Projects',
    aliases: ['Claude Projects'],
    cluster: 'Tools & Ecosystem',
    scope: 'technical',
    lifecycle_stage: 'adoption',
    audience: ['operator', 'user'],
    tier: 2,
    angles: ['def', 'process', 'role'],
    related_terms: ['project-instructions', 'connector', 'skill', 'system-prompt', 'context-window', 'rag'],
    claude_specific: true,
    definition: 'Projects are dedicated workspaces inside Claude.ai — each with its own instructions, uploaded files, and conversation history. Where a regular chat starts from scratch, a project carries everything forward: your context, your documents, your rules for how Claude should behave. When the files you upload grow large, Projects automatically switch to RAG mode, pulling only what\'s relevant rather than loading everything at once — which means the knowledge base can scale well beyond the context window without slowing down. On Team and Enterprise plans, projects can be shared with teammates, so a whole team works from the same foundation instead of each person rebuilding it individually.',
    published: true,
  },
  {
    slug: 'project-instructions',
    name: 'Project Instructions',
    aliases: ['project system prompt', 'project prompt'],
    cluster: 'Tools & Ecosystem',
    scope: 'technical',
    lifecycle_stage: 'adoption',
    audience: ['operator', 'user'],
    tier: 2,
    angles: ['def', 'process', 'role'],
    related_terms: ['claude-projects', 'system-prompt', 'context-window', 'prompt-caching'],
    claude_specific: true,
    definition: 'Project Instructions are the standing brief you give Claude for a specific project — the role it should play, the tone it should use, the constraints it should follow, the workflow steps it should apply. They\'re written once and automatically prepended to every conversation within that project, so you never have to re-explain the setup. Functionally, they work like a system prompt, but scoped to a workspace rather than a deployment. A good set of project instructions turns a blank chat into something purpose-built: a content editor that always follows your brand voice, a research assistant that always cites sources, a code reviewer that always checks your specific concerns first.',
    published: true,
  },
  {
    slug: 'scheduled-tasks',
    name: 'Scheduled Tasks',
    aliases: ['Claude scheduled tasks', 'recurring tasks'],
    cluster: 'Tools & Ecosystem',
    scope: 'technical',
    lifecycle_stage: 'adoption',
    audience: ['user'],
    tier: 3,
    angles: ['def', 'process', 'role'],
    related_terms: ['claude-cowork', 'dispatch', 'claude-projects', 'connector'],
    claude_specific: true,
    definition: 'Scheduled Tasks let you define a piece of work once and have Claude run it automatically on a recurring schedule. A morning briefing that pulls from your calendar and email. A weekly summary of what shipped. An inbox triage that runs before you start your day. You write the task and set when it should run — Claude handles the rest each time the desktop app is open. If your computer was closed when a task was due, it catches up the next time you\'re back. Available in the Cowork tab of the Claude desktop app on Pro and Max plans.',
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
