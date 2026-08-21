import { createClient } from '@supabase/supabase-js'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const PATTERNS: [string, RegExp][] = [
  ['claims no official course/training exists', /\b(no|there is no|nobody has|no one has|isn't an?|is not an?)\b[^.]{0,70}\b(official|anthropic'?s?|vendor)\b[^.]{0,70}\b(course|training|curriculum)/gi],
  ['claims Anthropic docs do not cover X', /[Aa]nthropic('s)?[^.]{0,60}\b(does ?n'?t|do(es)? not|don'?t|fails? to|never)\b[^.]{0,60}\b(cover|explain|teach|document|tell you)/gi],
  ['stale anthropic.com/learn URL', /anthropic\.com\/learn/gi],
  ['claims no good free resource', /\b(no|neither has a?|lacks? an?)\b[^.]{0,50}\bfree resource/gi],
  ['old platform name', /[Aa]nthropic Academy|skilljar/gi],
]

async function main(){
  const all:any[]=[]
  for(let i=0;i<10;i++){
    const {data}=await sb.from('articles').select('slug,body').order('created_at').range(i*100,i*100+99)
    if(!data||!data.length)break; all.push(...data)
  }
  console.log('scanned', all.length, 'articles\n')
  for(const [label,re] of PATTERNS){
    const hits:string[]=[]
    for(const a of all){
      const m=a.body.match(re)
      if(m) hits.push(`  ${a.slug} :: ${m.slice(0,2).map((x:string)=>x.replace(/\s+/g,' ').slice(0,120)).join('  ||  ')}`)
    }
    console.log(`## ${label} — ${hits.length}`)
    hits.slice(0,14).forEach(h=>console.log(h))
    console.log()
  }
}
main()
