/**
 * Seed Claude terms batch 6 — Deep Research update
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-claude-terms-6.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const TERMS = [
  {
    slug: 'deep-research',
    name: 'Deep Research',
    aliases: ['Claude Deep Research', 'Research mode'],
    cluster: 'Tools & Ecosystem',
    scope: 'technical',
    lifecycle_stage: 'adoption',
    audience: ['operator', 'user'],
    tier: 2,
    angles: ['def', 'process', 'role'],
    related_terms: ['extended-thinking', 'enterprise-search', 'connector', 'rag'],
    claude_specific: true,
    definition: 'Deep Research (called "Research" in the product) turns Claude into a systematic investigator rather than a conversational assistant. Instead of one search, it runs many — each building on what the previous one found — then synthesises everything into a structured, cited report. Extended thinking activates automatically, so Claude plans its approach before searching. Most reports complete in 5 to 15 minutes; complex ones can run up to 45. Not a feature to kick off five minutes before a meeting. Pro, Max, Team, and Enterprise plans only — not available on Free. Two modes worth knowing: the default uses the web; if you disable web search and keep connectors on, it runs the same deep investigation against your internal tools only — useful for "what has our team actually decided about X" questions. When to use it over simpler tools: when you need citations from multiple sources, not just a quick answer.',
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
