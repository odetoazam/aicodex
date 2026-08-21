import { createClient } from '@supabase/supabase-js'

async function main() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const { data: ev, error: e1 } = await supabase
    .from('timeline_events')
    .select('event_date,org,title,significance')
    .order('event_date', { ascending: false })
    .limit(45)
  if (e1) { console.error(e1); process.exit(1) }

  const { count } = await supabase.from('timeline_events').select('*', { count: 'exact', head: true })
  console.log('TOTAL_TIMELINE_EVENTS:', count)
  console.log('LATEST_EVENT_DATE:', ev![0]?.event_date)
  console.log('--- RECENT EVENTS ---')
  for (const e of ev!) console.log(e.event_date, '|', e.org, '|', e.title)

  const { data: arts, error: e2 } = await supabase
    .from('articles')
    .select('slug,title,created_at')
    .order('created_at', { ascending: false })
    .limit(40)
  if (e2) { console.error(e2); process.exit(1) }
  const { count: acount } = await supabase.from('articles').select('*', { count: 'exact', head: true })
  console.log('--- TOTAL ARTICLES:', acount, '---')
  console.log('--- RECENT ARTICLES ---')
  for (const a of arts!) console.log(a.slug, '|', a.title)
}
main()
