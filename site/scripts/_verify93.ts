import { createClient } from '@supabase/supabase-js'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const slugs=['claude-academy-guide','what-claude-academy-doesnt-teach','claude-certifications-guide','computer-use-browser-use-ga','claude-code-august-2026-updates','managed-agents-budgets-guardrails']
async function main(){
  const {data}=await sb.from('articles').select('slug,title,published,read_time,cluster,body').in('slug',slugs)
  for(const a of data!) console.log(`${a.published?'✓':'✗'} ${a.slug} | ${a.cluster} | ${a.read_time}min | body ${a.body.length} chars`)
  console.log('found', data!.length, 'of', slugs.length)
  // check every internal /articles/ link in these bodies resolves
  const links = new Set<string>()
  for(const a of data!) for(const m of a.body.matchAll(/\]\(\/articles\/([a-z0-9-]+)\)/g)) links.add(m[1])
  const {data:all}=await sb.from('articles').select('slug').in('slug',[...links])
  const have=new Set(all!.map(r=>r.slug))
  const missing=[...links].filter(s=>!have.has(s))
  console.log('internal article links:', links.size, 'MISSING:', missing.length? missing.join(', '):'none')
}
main()
