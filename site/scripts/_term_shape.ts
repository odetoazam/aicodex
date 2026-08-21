import { createClient } from '@supabase/supabase-js'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function main(){
  const {data}=await sb.from('terms').select('*').eq('slug','ai-literacy').single()
  console.log('COLUMNS:', Object.keys(data!).join(', '))
  console.log(JSON.stringify(data,null,1).slice(0,1800))
}
main()
