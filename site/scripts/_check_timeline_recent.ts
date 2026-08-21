import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
dotenv.config({ path: path.join(__dirname, '../.env.local') })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function main() {
  const { data, error } = await supabase.from('timeline_events').select('event_date, org, title, published, article_slug').order('event_date', { ascending: false }).limit(20)
  if (error) { console.error(error); process.exit(1) }
  for (const e of data!) console.log(`${e.event_date}  ${e.published ? 'P' : '-'}  ${String(e.org).padEnd(10)}  ${e.title.slice(0,68)}`)
}
main()
