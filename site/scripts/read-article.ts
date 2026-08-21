import { createClient } from '@supabase/supabase-js'

const slug = process.argv[2]
if (!slug) { console.error('Usage: read-article.ts <slug>'); process.exit(1) }

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

async function run() {
  const { data } = await sb.from('articles').select('title, body').eq('slug', slug).single()
  if (!data) { console.error(`Not found: ${slug}`); process.exit(1) }
  console.log(`# ${data.title}\n\n${data.body}`)
}

run().then(() => process.exit(0))
