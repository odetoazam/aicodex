import { createClient } from '@supabase/supabase-js'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function main(){
  const {data}=await sb.from('articles').select('body').eq('slug','building-a-business-case-for-claude').single()
  const b=data!.body as string
  const i=b.search(/## (Practice|Skill|Try|Exercise|Rehears)/i)
  console.log(i>=0? b.slice(i, i+1900) : 'no module heading found; last 1200:\n'+b.slice(-1200))
}
main()
