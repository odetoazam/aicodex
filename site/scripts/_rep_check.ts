import { createClient } from '@supabase/supabase-js'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const slugs=['claude-academy-guide','what-claude-academy-doesnt-teach','claude-certifications-guide','computer-use-browser-use-ga','claude-code-august-2026-updates','managed-agents-budgets-guardrails']
async function main(){
  const {data}=await sb.from('articles').select('slug,body').in('slug',slugs)
  for(const a of data!){
    const b=a.body as string
    const has = /Try this today|## What to do this week|## What to do\b|Run the comparison|minutes?\b.*\bexercise|time-box/i.test(b)
    const heads = (b.match(/^## .*/gm)||[]).slice(-3).join(' | ')
    console.log(`${has?'REP':'---'}  ${a.slug}\n      last headings: ${heads}\n`)
  }
}
main()
