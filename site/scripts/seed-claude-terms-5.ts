/**
 * Seed Claude terms batch 5 — Enterprise Search
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-claude-terms-5.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const TERMS = [
  {
    slug: 'enterprise-search',
    name: 'Enterprise Search',
    aliases: ['Ask Your Org', 'org search'],
    cluster: 'Tools & Ecosystem',
    scope: 'technical',
    lifecycle_stage: 'adoption',
    audience: ['operator', 'user'],
    tier: 3,
    angles: ['def', 'process', 'role'],
    related_terms: ['connector', 'claude-projects', 'project-instructions', 'rag'],
    claude_specific: true,
    definition: 'Enterprise Search is an org-wide search project that lives in every team member\'s Claude sidebar. An admin connects your organisation\'s tools once — Slack, Google Drive, SharePoint, email — and then anyone in the org can ask questions that pull from all of them simultaneously. The key difference from regular connectors: it\'s configured centrally with retrieval-optimised instructions, and each person authenticates individually, so Claude only surfaces what that person has permission to see. Two people asking the same question may get different answers — that\'s intentional. What it surfaces well: documented knowledge spread across tools. What it can\'t surface: decisions that were never written down. Team and Enterprise plans only. An admin must complete setup before anyone else can use it.',
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
