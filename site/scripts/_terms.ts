import { createClient } from '@supabase/supabase-js'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function main(){
  const all:any[]=[]
  for(let i=0;i<5;i++){const {data}=await sb.from('terms').select('slug,name').range(i*100,i*100+99); if(!data||!data.length)break; all.push(...data)}
  console.log(all.map(t=>t.slug).join(' '))
  console.log('TOTAL TERMS', all.length)
}
main()
