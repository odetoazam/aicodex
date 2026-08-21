import { createClient } from '@supabase/supabase-js'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function main(){
  const {data}=await sb.from('articles').select('body').eq('slug','what-claude-academy-doesnt-teach').single()
  const b=data!.body as string
  console.log('has module heading:', b.includes('## Skill module: the nine-gap audit'))
  console.log('has worked example table:', b.includes('| Gap | Score | Why |'))
  console.log('has common mistake:', b.includes('**The common mistake.**'))
  console.log('body length:', b.length)
}
main()
