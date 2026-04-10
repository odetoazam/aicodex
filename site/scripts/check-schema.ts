import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function main() {
  const { data, error } = await sb.from('terms').select('lifecycle_stage, scope, audience, cluster').limit(50)
  if (error) { console.error(error); return }
  console.log('lifecycle_stage:', [...new Set(data?.map((r: any) => r.lifecycle_stage))])
  console.log('scope:', [...new Set(data?.map((r: any) => r.scope))])
  const allAudiences = new Set(data?.flatMap((r: any) => r.audience ?? []))
  console.log('audience values:', [...allAudiences])
  const clusters = new Set(data?.map((r: any) => r.cluster))
  console.log('cluster values:', [...clusters])
}

main().catch(console.error)
