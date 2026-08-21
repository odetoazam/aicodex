import { createClient } from '@supabase/supabase-js'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function main(){
  const b: Record<string,number> = {'internal-ai-stack-architecture':12,'internal-mcp-server-explained':10,'ai-data-access-token-economics':11,'ai-agent-cold-start-caching':9,'ai-agent-access-control':10,'live-api-vs-etl-for-ai':9,'data-warehouse-for-ai-agents':10,'building-ai-skills-for-your-team':11,'mcp-production-agents':10}
  for(const [s,rt] of Object.entries(b)) await sb.from('articles').update({read_time:rt}).eq('slug',s)
  console.log('read times updated')
}
main()
