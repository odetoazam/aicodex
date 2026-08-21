import { createClient } from '@supabase/supabase-js'
import { ARTICLE_ACADEMY_LINKS } from '../lib/academy'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function main(){
  const all:any[]=[]
  for(let i=0;i<10;i++){
    const {data}=await sb.from('articles').select('slug,cluster,title').order('created_at').range(i*100,i*100+99)
    if(!data||!data.length)break; all.push(...data)
  }
  const mapped = new Set(Object.keys(ARTICLE_ACADEMY_LINKS))
  const stale = [...mapped].filter(s => !all.some(a=>a.slug===s))
  console.log('mapped slugs:', mapped.size, '| of', all.length, 'articles')
  console.log('MAPPINGS POINTING AT NONEXISTENT ARTICLES:', stale.length ? stale.join(', ') : 'none')
  const byCluster: Record<string,string[]> = {}
  for(const a of all){ if(!mapped.has(a.slug)){ (byCluster[a.cluster ?? 'null'] ||= []).push(a.slug) } }
  for(const [c,slugs] of Object.entries(byCluster).sort((x,y)=>y[1].length-x[1].length)){
    console.log(`\n${c} (${slugs.length}): ${slugs.join(', ')}`)
  }
}
main()
