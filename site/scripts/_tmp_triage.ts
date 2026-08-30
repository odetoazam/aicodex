import { createClient } from '@supabase/supabase-js'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
// Specific, checkable factual breaks — not just "old"
const P:[string,RegExp][]=[
 ['thinking-as-toggle',/enable extended thinking|extended thinking (?:is |as )?(?:a )?(?:mode|feature) you|turn on extended thinking|budget_tokens/gi],
 ['200K ctx',/\b200[,]?0?0?0?[kK]?[- ]?token|200k (?:context|window)/gi],
 ['Sonnet/Opus old pricing',/\$3\s*(?:\/|per )\s*(?:M|million)|\$15\s*(?:\/|per )\s*(?:M|million)|\$3\/\$15/gi],
 ['retired model as current',/Opus 4\.1|Sonnet 4\.5|Haiku 3\.5|Claude 3(?:\.5|\.7)?\s(?:Sonnet|Opus|Haiku)/g],
 ['Workbench',/\bWorkbench\b/g],
 ['skills==tools confusion',/[Ss]kills (?:are|give)[^.]{0,60}(?:web search|code execution|capabilities you enable)/g],
 ['connectors read-only assumption',/connectors? (?:can )?only read|read-only connector|cannot write (?:back )?to/gi],
 ['no memory',/no memory (?:of|between|across)|each session starts|blank slate|does ?n.t remember/gi],
 ['claude.ai model picker as only route',/model picker/gi],
 ['deprecated: latest alias advice',/-latest\b|claude-3-|claude-sonnet-4-5|claude-opus-4-1/g],
]
async function main(){
 const all:any[]=[]
 for(let i=0;i<30;i++){const {data}=await sb.from('articles').select('slug,title,updated_at,body').order('created_at').range(i*200,i*200+199); if(!data||!data.length)break; all.push(...data); if(data.length<200)break}
 const score=new Map<string,string[]>()
 for(const a of all){
  if(a.updated_at.slice(0,7)>='2026-08') continue
  for(const [l,re] of P){re.lastIndex=0; if(re.test(a.body)){ if(!score.has(a.slug))score.set(a.slug,[]); score.get(a.slug)!.push(l) }}
 }
 const rows=[...score.entries()].sort((x,y)=>y[1].length-x[1].length)
 console.log(`${rows.length} pre-August articles with at least one specific factual break\n`)
 for(const [slug,ls] of rows){
  const a=all.find(x=>x.slug===slug)
  console.log(`${String(ls.length)}  ${a.updated_at.slice(0,10)}  ${slug.padEnd(42)} ${ls.join(', ')}`)
 }
}
main()
