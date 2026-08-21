import { createClient } from '@supabase/supabase-js'
import { hasApplicationPrompt } from './_lib/article-gate'
import { PATH_SLUGS } from '../lib/paths'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const PINNED = ['new-to-ai-start-here','claude-academy-guide','what-claude-academy-doesnt-teach','what-to-share-with-claude','when-your-ai-model-disappears','first-week-with-claude','building-a-business-case-for-claude','ai-platform-landscape-2026','claude-compliance-api','claude-opus-5','computer-use-browser-use-ga','managed-agents-budgets-guardrails','your-first-claude-api-call','auditing-your-eval-suite','founder-ai-workflow','solo-founder-project-setup','claude-plus-notion','claude-for-agencies','pricing-claude-consulting-work']

async function main(){
  const inPath = new Set<string>()
  for (const slugs of Object.values(PATH_SLUGS)) slugs.forEach(s => inPath.add(s))

  const all:any[]=[]
  for(let i=0;i<10;i++){
    const {data}=await sb.from('articles').select('slug,title,cluster,read_time,body,created_at').order('created_at',{ascending:false}).range(i*100,i*100+99)
    if(!data||!data.length)break; all.push(...data)
  }
  const missing = all.filter(a=>!hasApplicationPrompt(a.body))
  const prio = missing.filter(a => inPath.has(a.slug) || PINNED.includes(a.slug))
  console.log(`missing overall: ${missing.length}`)
  console.log(`missing AND (in a learning path OR pinned): ${prio.length}\n`)
  for(const a of prio) console.log(`  ${inPath.has(a.slug)?'PATH':'PIN '}  ${a.slug}  [${a.cluster}]  ${a.read_time}m`)
}
main()
