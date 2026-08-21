import { createClient } from '@supabase/supabase-js'
async function main() {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data } = await sb.from('articles').select('body').eq('slug','claude-fable-5').single()
  const banner = data!.body.split('\n')[0]
  console.log('FIRST LINE (banner):\n', banner)
}
main()
