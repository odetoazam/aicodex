import { createClient } from '@supabase/supabase-js'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function main(){
  const bumps: Record<string,number> = { 'what-claude-academy-doesnt-teach': 15, 'claude-academy-guide': 12, 'claude-certifications-guide': 11, 'managed-agents-budgets-guardrails': 11 }
  for(const [slug,rt] of Object.entries(bumps)){
    const {error}=await sb.from('articles').update({read_time:rt}).eq('slug',slug)
    console.log(error?`✗ ${slug}`:`✓ ${slug} → ${rt} min`)
  }
}
main()
