import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function main() {
  const { data, error } = await sb
    .from('terms')
    .select('name, slug, tier, claude_specific')
    .order('name')
    .limit(50)

  if (error) { console.error(error); process.exit(1) }
  data?.forEach(t => console.log(`${t.name} | ${t.slug} | claude:${t.claude_specific}`))
  console.log(`\nTotal: ${data?.length}`)
}

main()
