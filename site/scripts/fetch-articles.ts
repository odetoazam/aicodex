import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const slugs = [
  'managed-agents-for-your-org',
  'claude-projects-org-structure',
  'choosing-your-claude-plan',
  'evals-role',
  'skills-setup-guide',
  'cowork-dispatch-guide',
  'connectors-best-practices',
]

async function main() {
  for (const slug of slugs) {
    const { data, error } = await sb
      .from('articles')
      .select('slug, body')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error(`✗ ${slug}:`, error.message)
    } else {
      console.log(`\n${'='.repeat(80)}`)
      console.log(`SLUG: ${slug}`)
      console.log('='.repeat(80))
      console.log(data.body)
    }
  }
}

main().catch(console.error)
