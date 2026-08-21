import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  const { data: ev, error } = await supabase
    .from('timeline_events')
    .select('event_date, org, title')
    .order('event_date', { ascending: false })
    .limit(40)
  if (error) throw error
  console.log('MOST RECENT EVENT DATE:', ev?.[0]?.event_date)
  console.log('--- recent 40 events ---')
  for (const e of ev!) console.log(`${e.event_date} | ${e.org} | ${e.title}`)

  const { count } = await supabase.from('timeline_events').select('*', { count: 'exact', head: true })
  console.log('TOTAL TIMELINE EVENTS:', count)

  const { data: arts } = await supabase
    .from('articles')
    .select('slug, title, created_at')
    .order('created_at', { ascending: false })
    .limit(40)
  console.log('--- 40 most recent articles ---')
  for (const a of arts!) console.log(`${a.slug}`)
  const { count: ac } = await supabase.from('articles').select('*', { count: 'exact', head: true })
  console.log('TOTAL ARTICLES:', ac)
}
main()
