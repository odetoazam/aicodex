import { createClient } from '@supabase/supabase-js'
async function main() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data, error } = await supabase.from('timeline_events').select('event_date,org,title').order('event_date',{ascending:false}).limit(30)
  if (error) { console.error(error); process.exit(1) }
  for (const e of data!) console.log(e.event_date, '|', e.org, '|', e.title)
}
main()
