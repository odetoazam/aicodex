import { createClient } from '@supabase/supabase-js'
async function main() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data, error } = await supabase.from('articles').select('slug,title,created_at').order('created_at', { ascending: false })
  if (error) { console.error(error); process.exit(1) }
  console.log('TOTAL ARTICLES:', data!.length)
  console.log('--- MOST RECENT 25 ---')
  for (const a of data!.slice(0, 25)) console.log(a.slug)
  const terms = ['auto', 'managed-agent', 'self-host', 'permission', 'sandbox', 'budget', 'muse', 'cost']
  console.log('--- MATCHES ---')
  for (const t of terms) {
    const hits = data!.filter(a => a.slug.includes(t)).map(a => a.slug)
    console.log(t, '=>', hits.length ? hits.join(', ') : '(none)')
  }
}
main()
