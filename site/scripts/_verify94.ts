import { createClient } from '@supabase/supabase-js'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const S=['fde-scoping-an-engagement','fde-when-client-data-is-bad','fde-handoff-that-survives']
async function main(){
  const {data}=await sb.from('articles').select('slug,title,read_time,cluster,body').in('slug',S)
  for(const a of data!) console.log(`✓ ${a.slug} | ${a.cluster} | ${a.read_time}m | ${a.body.length} chars`)
  const links=new Set<string>()
  for(const a of data!) for(const m of a.body.matchAll(/\]\(\/articles\/([a-z0-9-]+)\)/g)) links.add(m[1])
  const {data:all}=await sb.from('articles').select('slug').in('slug',[...links])
  const have=new Set(all!.map(r=>r.slug))
  const missing=[...links].filter(s=>!have.has(s))
  console.log(`\ninternal links: ${links.size}  MISSING: ${missing.length?missing.join(', '):'none'}`)
}
main()
