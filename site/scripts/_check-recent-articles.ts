import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  const slugs = [
    'claude-for-microsoft-365',
    'claude-managed-agents-multiagent',
    'claude-for-small-business',
    'mcp-tunnels',
    'claude-managed-agents-self-hosted',
  ]
  const { data } = await supabase
    .from('articles')
    .select('slug, created_at')
    .in('slug', slugs)
  console.log('Found:', data?.map(d => d.slug).join(', ') || 'none')
  console.log('Missing:', slugs.filter(s => !data?.find(d => d.slug === s)).join(', '))
}

main()
