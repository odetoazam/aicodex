import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const OLD_HEADER = '## The failure modes that actually happen'

// A screenshot-worthy callout block placed directly under the section header,
// before the prose expansion of each failure type. The prose below remains.
const CALLOUT = `## The failure modes that actually happen

> **The five ways multi-agent systems fail in production:**
>
> 1. **Timeout mid-pipeline** — the caller gives up, the sub-agent keeps running
> 2. **Partial output** — a truncated JSON or error-in-text that looks like success
> 3. **Cascading failure** — one sub-agent fails, the orchestrator can't decide what to do with the others
> 4. **Silent degradation** — low-quality output that passes validation but poisons the final result
> 5. **State inconsistency** — one writer finished, the other didn't, and the store is now half-updated
>
> Agents fail differently than APIs. Build for these five, not for HTTP status codes.`

async function run() {
  const { data, error } = await sb.from('articles').select('slug, body').eq('slug', 'multi-agent-failure-handling').single()
  if (error || !data) { console.log('fetch error:', error); return }
  const body: string = data.body
  if (body.includes('The five ways multi-agent systems fail in production')) {
    console.log('callout already present — skip')
    return
  }
  if (!body.includes(OLD_HEADER)) {
    console.log('header not found — aborting')
    return
  }
  const updated = body.replace(OLD_HEADER, CALLOUT)
  const { error: upErr } = await sb.from('articles').update({ body: updated }).eq('slug', 'multi-agent-failure-handling')
  if (upErr) { console.log('update error:', upErr); return }
  console.log('✓ multi-agent-failure-handling updated with screenshot-worthy callout')
}

run().then(() => process.exit(0))
