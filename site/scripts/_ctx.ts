import { createClient } from '@supabase/supabase-js'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const TARGETS: [string, RegExp][] = [
  ['claude-sonnet-5', /\$3\s*\/\s*\$15|September 1|introductory/gi],
  ['your-first-claude-api-call', /Sonnet 4\.5|Sonnet 4\.6|Haiku 3\.5|Opus 4\.1/g],
  ['claude-cost-optimization', /Sonnet 4\.5|Sonnet 4\.6|Haiku 3\.5|Opus 4\.1/g],
  ['monitoring-your-claude-app', /Sonnet 4\.5|Sonnet 4\.6|Haiku 3\.5|Opus 4\.1/g],
  ['claude-advisor-tool', /Sonnet 4\.5|Sonnet 4\.6|Haiku 3\.5|Opus 4\.1/g],
  ['large-language-model-def', /GPT-4[o.\d]*/g],
  ['writing-evals-that-catch-regressions', /GPT-4[o.\d]*|GPT-3\.5/g],
  ['claude-vs-custom-model', /GPT-4[o.\d]*/g],
  ['what-is-a-forward-deployed-engineer', /GPT-4[o.\d]*/g],
]
async function main(){
  for(const [slug, re] of TARGETS){
    const {data}=await sb.from('articles').select('body').eq('slug',slug).single()
    if(!data){ console.log(`?? ${slug} missing`); continue }
    console.log(`\n=== ${slug} ===`)
    const b = data.body as string
    let m; const seen = new Set<string>()
    while((m = re.exec(b)) !== null){
      const s = Math.max(0, m.index-140), e = Math.min(b.length, m.index+140)
      const snip = b.slice(s,e).replace(/\s+/g,' ')
      if(seen.has(snip)) continue; seen.add(snip)
      console.log('  …'+snip+'…')
      if(seen.size>=3) break
    }
  }
}
main()
