import { createClient } from '@supabase/supabase-js'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
async function main(){
  // Where is path progress actually happening?
  const {data:prog}=await sb.from('user_progress').select('article_slug,read_at,user_id').order('read_at',{ascending:false}).limit(200)
  console.log('progress rows:', prog?.length)
  if(prog?.length){
    const users=new Set(prog.map(p=>p.user_id))
    console.log('distinct users:', users.size)
    console.log('date range:', prog[prog.length-1].read_at?.slice(0,10), '→', prog[0].read_at?.slice(0,10))
    const bySlug: Record<string,number> = {}
    for(const p of prog) bySlug[p.article_slug]=(bySlug[p.article_slug]||0)+1
    console.log('\ntop read articles:')
    Object.entries(bySlug).sort((a,b)=>b[1]-a[1]).slice(0,15).forEach(([s,n])=>console.log(`  ${n}x ${s}`))
    console.log('\nreads per user:')
    const byUser: Record<string,number> = {}
    for(const p of prog) byUser[p.user_id]=(byUser[p.user_id]||0)+1
    Object.values(byUser).sort((a,b)=>b-a).forEach((n,i)=>{ if(i<10) console.log(`  user ${i+1}: ${n} articles`) })
  }
  const {data:fav}=await sb.from('user_favorites').select('article_slug,created_at,user_id').order('created_at',{ascending:false}).limit(50)
  console.log('\nfavorites:', fav?.length, '| distinct users:', new Set(fav?.map(f=>f.user_id)).size)
  if(fav?.length) console.log('most recent favorite:', fav[0].created_at?.slice(0,10))
}
main()
