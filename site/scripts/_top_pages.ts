import { createClient } from '@supabase/supabase-js'
import { hasApplicationPrompt } from './_lib/article-gate'
import { NEXT_READS } from '../lib/next-reads'
import { ARTICLE_PATHS } from '../lib/paths'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const TOP=['claude-team-vs-enterprise-for-it','ask-your-org-guide','what-to-share-with-claude','claude-plus-google-sheets','claude-admin-controls-2026','fde-portfolio-projects','claude-hallucination-prevention','claude-projects-org-structure','managing-email-with-claude','claude-common-mistakes']
async function main(){
  const {data}=await sb.from('articles').select('slug,title,read_time,updated_at,body').in('slug',TOP)
  const bySlug=Object.fromEntries(data!.map(a=>[a.slug,a]))
  console.log('rank  prompt  nextreads  inpath  updated     slug')
  TOP.forEach((s,i)=>{
    const a=bySlug[s]; if(!a){console.log(`${i+1} MISSING ${s}`);return}
    console.log(`${String(i+1).padStart(4)}  ${hasApplicationPrompt(a.body)?'YES ':'no  '}   ${NEXT_READS[s]?'YES':'no '}        ${ARTICLE_PATHS[s]?'YES':'no '}     ${a.updated_at.slice(0,10)}  ${s}`)
  })
}
main()
