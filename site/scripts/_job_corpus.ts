import { createClient } from '@supabase/supabase-js'
import { hasApplicationPrompt } from './_lib/article-gate'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const JOB = ['what-is-a-forward-deployed-engineer','how-to-become-forward-deployed-engineer','fde-portfolio-projects','fde-for-career-counselors','what-is-an-agent-operator','agent-operator-first-90-days','how-to-evaluate-your-agents','when-agents-break','wiring-internal-systems-to-agents','agent-change-management','agent-operator-cost-control','agent-operator-roi-reporting','agent-operator-job-market-2026','ai-agent-manager-vs-agent-operator']
async function main(){
  const {data}=await sb.from('articles').select('slug,title,read_time,body').in('slug',JOB)
  for(const a of data!){
    const b=a.body as string
    const heads=(b.match(/^## .*/gm)||[])
    console.log(`${hasApplicationPrompt(b)?'REP':'---'} ${String(a.read_time).padStart(2)}m ${a.slug}`)
    console.log(`     last: ${heads.slice(-2).join(' | ')}`)
  }
  console.log('\nfound', data!.length, 'of', JOB.length)
}
main()
