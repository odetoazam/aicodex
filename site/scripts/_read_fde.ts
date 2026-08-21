import { createClient } from '@supabase/supabase-js'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const S=['what-is-a-forward-deployed-engineer','how-to-become-forward-deployed-engineer','fde-portfolio-projects','fde-for-career-counselors']
async function main(){
  for(const slug of S){
    const {data}=await sb.from('articles').select('body,excerpt').eq('slug',slug).single()
    const b=data!.body as string
    console.log(`\n########## ${slug}`)
    console.log('EXCERPT:', data!.excerpt.slice(0,200))
    console.log('HEADINGS:', (b.match(/^## .*/gm)||[]).join(' | '))
    console.log('TAIL:\n'+b.slice(-1100))
  }
}
main()
