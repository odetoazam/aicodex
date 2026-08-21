import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function main() {
  const { data: one } = await supabase.from('articles').select('*').limit(1)
  console.log('COLUMNS:', Object.keys(one![0]).join(', '))
  const all: any[] = []
  for (let i = 0; i < 10; i++) {
    const { data } = await supabase.from('articles').select('slug, cluster, tier, read_time').order('created_at', { ascending: true }).range(i*100, i*100+99)
    if (!data || !data.length) break
    all.push(...data)
  }
  for (const a of all) console.log(`${a.slug}|${a.cluster}|${a.tier}`)
  console.log('TOTAL', all.length)
}
main()
