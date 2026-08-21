import { createClient } from '@supabase/supabase-js'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function main(){
  const b: Record<string,number> = { 'what-is-a-forward-deployed-engineer':12,'how-to-become-forward-deployed-engineer':11,'fde-portfolio-projects':13,'fde-for-career-counselors':9 }
  for(const [s,rt] of Object.entries(b)){ const {error}=await sb.from('articles').update({read_time:rt}).eq('slug',s); console.log(error?`✗ ${s}`:`✓ ${s} → ${rt}m`) }
}
main()
