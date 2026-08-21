import { createClient } from '@supabase/supabase-js'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function main(){
  const {data}=await sb.from('timeline_events').select('event_date,title,description,href,article_slug').gte('event_date','2026-07-20').order('event_date',{ascending:false})
  for(const e of data!) console.log(`${e.event_date} | ${e.title}\n  href: ${e.href}\n  slug: ${e.article_slug}\n  ${e.description?.slice(0,220)}\n`)
}
main()
