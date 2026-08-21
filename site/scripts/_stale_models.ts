import { createClient } from '@supabase/supabase-js'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const PATTERNS: [string, RegExp][] = [
  ['GPT-4 / 4o / 3.5 references', /\bGPT-4[o.\d]*\b|\bGPT-3\.5\b/g],
  ['Gemini 1.x / 2.x', /\bGemini [12]\.\d\b/g],
  ['old compare URLs', /\/compare\/claude-vs-gpt4-[a-z-]+/g],
  ['retired Claude models as current', /\bSonnet 4\.5\b|\bSonnet 4\.6\b|\bOpus 4\.1\b|\bHaiku 3\.5\b/g],
  ['stale Sonnet pricing', /\$3\s*\/\s*\$15|\$0\.80\s*\/\s*\$4/g],
]
async function main(){
  const all:any[]=[]
  for(let i=0;i<10;i++){
    const {data}=await sb.from('articles').select('slug,body').order('created_at').range(i*100,i*100+99)
    if(!data||!data.length)break; all.push(...data)
  }
  console.log('scanned', all.length, '\n')
  for(const [label,re] of PATTERNS){
    const hits: [string,number][] = []
    for(const a of all){ const m=a.body.match(re); if(m) hits.push([a.slug, m.length]) }
    hits.sort((x,y)=>y[1]-x[1])
    console.log(`## ${label} — ${hits.length} articles`)
    hits.slice(0,15).forEach(([s,n])=>console.log(`  ${n}x  ${s}`))
    console.log()
  }
}
main()
