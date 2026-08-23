import { createClient } from '@supabase/supabase-js'
import { NEXT_READS } from '../lib/next-reads'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function main(){
  const all:any[]=[]
  for(let i=0;i<10;i++){const {data}=await sb.from('articles').select('slug').range(i*100,i*100+99); if(!data||!data.length)break; all.push(...data)}
  const have=new Set(all.map(a=>a.slug))
  let badKeys=0, badTargets=0
  for(const [k,v] of Object.entries(NEXT_READS)){
    if(!have.has(k)){ console.log(`✗ key not an article: ${k}`); badKeys++ }
    for(const r of v) if(!have.has(r.slug)){ console.log(`✗ ${k} → missing target ${r.slug}`); badTargets++ }
  }
  console.log(`\nnext-reads entries: ${Object.keys(NEXT_READS).length} | bad keys: ${badKeys} | broken targets: ${badTargets}`)
}
main()
