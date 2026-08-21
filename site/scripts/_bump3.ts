import { createClient } from '@supabase/supabase-js'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function main(){
  const b: Record<string,number> = {'new-to-ai-start-here':9,'what-to-share-with-claude':7,'when-your-ai-model-disappears':9,'ai-platform-landscape-2026':9,'claude-compliance-api':8,'auditing-your-eval-suite':8,'founder-ai-workflow':9,'solo-founder-project-setup':7,'claude-for-agencies':8,'pricing-claude-consulting-work':8,'claude-plus-notion':9}
  for(const [s,rt] of Object.entries(b)) await sb.from('articles').update({read_time:rt}).eq('slug',s)
  console.log('read times updated')
}
main()
