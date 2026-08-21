import { createClient } from '@supabase/supabase-js'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const S=['internal-ai-stack-architecture','internal-mcp-server-explained','ai-data-access-token-economics','ai-agent-cold-start-caching','ai-agent-access-control','live-api-vs-etl-for-ai','data-warehouse-for-ai-agents','building-ai-skills-for-your-team','mcp-production-agents']
async function main(){
  const {data}=await sb.from('articles').select('slug,title,excerpt,body').in('slug',S)
  for(const a of data!){
    console.log(`\n### ${a.slug} — ${a.title}`)
    console.log(`E: ${a.excerpt.slice(0,150)}`)
    console.log(`H: ${(a.body.match(/^## .*/gm)||[]).map((h:string)=>h.replace('## ','')).join(' | ')}`)
  }
}
main()
