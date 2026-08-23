import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  const { data: events, error: e1 } = await supabase
    .from('timeline_events')
    .select('event_date, org, title, significance')
    .order('event_date', { ascending: false })
    .limit(40)
  if (e1) throw e1
  console.log('=== MOST RECENT TIMELINE EVENTS ===')
  for (const ev of events!) {
    console.log(`${ev.event_date} | ${ev.org} | ${ev.title}`)
  }

  const { count } = await supabase
    .from('timeline_events')
    .select('*', { count: 'exact', head: true })
  console.log(`\nTOTAL TIMELINE EVENTS: ${count}`)

  const { data: arts, error: e2 } = await supabase
    .from('articles')
    .select('slug, title, created_at')
    .order('created_at', { ascending: false })
    .limit(40)
  if (e2) throw e2
  console.log('\n=== 40 MOST RECENT ARTICLES ===')
  for (const a of arts!) console.log(`${a.created_at?.slice(0,10)} | ${a.slug}`)

  const { count: ac } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
  console.log(`\nTOTAL ARTICLES: ${ac}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
