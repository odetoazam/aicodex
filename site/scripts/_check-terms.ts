import { createClient } from '@supabase/supabase-js'
async function main() {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  for (const slug of ['large-language-model','claude','claude-projects','ai-agent']) {
    const { data } = await sb.from('terms').select('id,name').eq('slug', slug).maybeSingle()
    console.log(slug, '->', data ? `OK (${data.name})` : 'MISSING')
  }
  // confirm sonnet-5 / science not already present
  for (const slug of ['claude-sonnet-5','claude-science']) {
    const { data } = await sb.from('articles').select('slug').eq('slug', slug).maybeSingle()
    console.log('article', slug, '->', data ? 'EXISTS' : 'absent')
  }
}
main()
