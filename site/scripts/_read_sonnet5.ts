import { createClient } from '@supabase/supabase-js'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function main(){
  const {data}=await sb.from('articles').select('body').eq('slug','claude-sonnet-5').single()
  const b=data!.body as string
  const i=b.indexOf('The pricing has a clock on it')
  console.log(b.slice(Math.max(0,i-900), i+1700))
}
main()
