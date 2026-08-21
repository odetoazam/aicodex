import { createClient } from '@supabase/supabase-js'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const S=['new-to-ai-start-here','what-to-share-with-claude','when-your-ai-model-disappears','ai-platform-landscape-2026','claude-compliance-api','auditing-your-eval-suite','founder-ai-workflow','claude-for-agencies','pricing-claude-consulting-work','solo-founder-project-setup','claude-plus-notion']
async function main(){
  const {data}=await sb.from('articles').select('slug,title,excerpt,body').in('slug',S)
  for(const a of data!){
    console.log(`\n### ${a.slug} — ${a.title}`)
    console.log(`EXCERPT: ${a.excerpt.slice(0,180)}`)
    console.log(`H: ${(a.body.match(/^## .*/gm)||[]).map((h:string)=>h.replace('## ','')).join(' | ')}`)
  }
}
main()
