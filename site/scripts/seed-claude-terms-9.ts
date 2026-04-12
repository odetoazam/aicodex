/**
 * Seed Claude terms batch 9 — Cowork definition update + Cowork Plugin new term
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-claude-terms-9.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const TERMS = [
  {
    // Full rewrite — old definition described "computer use / screen control" which was
    // the original Cowork framing. Cowork is now a full agentic work mode in the desktop app.
    slug: 'claude-cowork',
    name: 'Cowork',
    aliases: ['Claude Cowork'],
    cluster: 'Tools & Ecosystem',
    scope: 'technical',
    lifecycle_stage: 'adoption',
    audience: ['operator', 'user'],
    tier: 2,
    angles: ['def', 'process', 'role'],
    related_terms: ['scheduled-tasks', 'dispatch', 'computer-use', 'claude-projects', 'cowork-plugin'],
    claude_specific: true,
    definition: 'Cowork is the agentic work mode in the Claude desktop app — the tab between Chat and Code. Where Chat is a back-and-forth conversation, Cowork is delegation: you describe an outcome, Claude plans the steps, works through them, and delivers a finished file to your drive. It reads and writes real files in a folder you point it at, connects to your tools (Slack, Drive, Gmail, Calendar), and keeps working on longer tasks while you step away. Use Cowork when the task needs your files, your connected tools, or a real output file. Use Chat when you\'re thinking something through or everything fits in a paste. A few practical things to know: Cowork uses more of your plan allocation than Chat — match your model to the task (Sonnet is the right default, Opus only for genuinely complex multi-step work). Sleeping your computer is fine during a long task; quitting the app pauses it. Conversation history is stored locally on your machine, which matters for compliance-sensitive workloads. Projects in Cowork are local to your desktop with memory scoped to that project — different from Claude.ai Projects, which sync in the cloud.',
    published: true,
  },
  {
    slug: 'cowork-plugin',
    name: 'Cowork Plugins',
    aliases: ['Cowork plugin', 'knowledge work plugin'],
    cluster: 'Tools & Ecosystem',
    scope: 'technical',
    lifecycle_stage: 'adoption',
    audience: ['operator', 'user'],
    tier: 3,
    angles: ['def', 'process', 'role'],
    related_terms: ['claude-cowork', 'skill', 'claude-code-skill', 'scheduled-tasks', 'connector'],
    claude_specific: true,
    definition: 'Cowork Plugins are role-specific bundles that give Cowork domain expertise for a specific job function. Each plugin packages together skills (step-by-step workflows for common tasks), connectors (access to the tools that role uses), and subagents (parallel workers for tasks that have many independent pieces). There are open-source plugins for most knowledge-work roles — sales, marketing, product, finance, legal, ops, CS, data — available on GitHub at github.com/anthropics/knowledge-work-plugins. Install in one click from Cowork\'s Customize area. Once installed, the plugin is a folder on your machine: every file is readable plain text, every skill is editable, and you can add new skills or modify existing ones with no build step. Plugins compose with scheduled tasks: a skill encodes what to do, a scheduled task decides when. The result is recurring work that runs on its own. Not the same as Claude Code plugins, which distribute Claude Code Skills for developer workflows.',
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
