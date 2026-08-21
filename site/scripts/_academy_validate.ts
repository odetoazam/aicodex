import { createClient } from '@supabase/supabase-js'
import { ARTICLE_ACADEMY_LINKS, ACADEMY_COURSES, ACADEMY_TUTORIALS, ACADEMY_BASE } from '../lib/academy'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function main(){
  const all:any[]=[]
  for(let i=0;i<10;i++){
    const {data}=await sb.from('articles').select('slug').range(i*100,i*100+99)
    if(!data||!data.length)break; all.push(...data)
  }
  const have = new Set(all.map(a=>a.slug))
  const keys = Object.keys(ARTICLE_ACADEMY_LINKS)
  const bad = keys.filter(k=>!have.has(k))
  console.log(`mappings: ${keys.length} / ${all.length} articles (${Math.round(keys.length/all.length*100)}% coverage)`)
  console.log('KEYS WITH NO MATCHING ARTICLE:', bad.length? bad.join(', ') : 'none')

  const paths = new Set<string>()
  for(const r of [...Object.values(ACADEMY_COURSES), ...Object.values(ACADEMY_TUTORIALS)]) paths.add(r.path)
  console.log('distinct academy resources:', paths.size)
  let bad2 = 0
  for(const path of paths){
    const res = await fetch(ACADEMY_BASE+path, { redirect:'follow' })
    if(!res.ok){ console.log('  ✗', res.status, path); bad2++ }
  }
  console.log(bad2 ? `${bad2} broken` : 'all academy URLs resolve ✓')
}
main()
