import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Three edits:
// 1. Add a "current as of" note up front (Yuki flag #4 — rate-limit and model specifics age)
// 2. Tighten the alert thresholds section with a CI-readiness-style numeric summary
// 3. Add a "Try this today" application prompt at the end (Kwame rule #8)

async function run() {
  const { data, error } = await sb.from('articles').select('slug, body').eq('slug', 'monitoring-your-claude-app').single()
  if (error || !data) { console.log('fetch error:', error); return }
  let body: string = data.body

  if (body.includes('Try this today')) {
    console.log('already updated — skipping all edits')
    return
  }

  // 1. Add date / currency note at the top (after the intro "Here is the full setup" sentence)
  const introAnchor = 'Here is the full setup: what to log, how to structure it, which metrics to surface, and what to alert on.'
  const introReplacement = introAnchor + '\n\n> **Current as of April 2026 — Claude Sonnet 4.6 / Opus 4.7.** The logging schema and metrics below are stable patterns; the specific rate-limit headers and tier numbers change. Check Anthropic\'s console and [rate-limits docs](https://docs.claude.com/en/api/rate-limits) for current values.'
  if (body.includes(introAnchor) && !body.includes('Current as of April 2026')) {
    body = body.replace(introAnchor, introReplacement)
  }

  // 2. Add numeric "healthy-vs-unhealthy" summary after the alerts table
  const tableEnd = '| Daily cost | > 150% of 7-day average | Unexpected usage — check for runaway process or abuse |'
  const summaryBlock = tableEnd + '\n\n**Healthy vs. unhealthy, at a glance:** if your 7-day rolling p95 latency creeps above 8 seconds, if your error rate stays above 2% for more than 24 hours, or if your 429 count is non-zero on any day, something is actively wrong and worth debugging today. None of these are "wait and see" numbers.'
  if (body.includes(tableEnd) && !body.includes('Healthy vs. unhealthy, at a glance')) {
    body = body.replace(tableEnd, summaryBlock)
  }

  // 3. Add "Try this today" application prompt at the end (just before the separator)
  const separatorAnchor = '\n---\n\n*For the pre-launch deployment checklist'
  const tryThisToday = `

## Try this today

Pick one feature in your Claude app that's currently in production or close to it. Spend 30 minutes:

1. Wrap the call site with the \`claude_call\` helper above (the whole wrapper is drop-in — no logic changes).
2. Ship it. Let it run for a few hours of real traffic.
3. Open your logs and answer three questions:
   - What's the p95 latency for this feature right now?
   - What's the cache hit rate?
   - What percentage of calls stopped with \`max_tokens\`?

If any of those numbers surprise you — especially \`max_tokens\` higher than 3% or a cache hit rate below 30% — you already have a real finding, and that one feature's worth of instrumentation will tell you more than reading about monitoring ever could.
`
  if (body.includes(separatorAnchor) && !body.includes('## Try this today')) {
    body = body.replace(separatorAnchor, tryThisToday + separatorAnchor)
  }

  const { error: upErr } = await sb.from('articles').update({ body }).eq('slug', 'monitoring-your-claude-app')
  if (upErr) { console.log('update error:', upErr); return }
  console.log('✓ monitoring-your-claude-app quality pass applied (currency note + healthy/unhealthy summary + Try this today)')
}

run().then(() => process.exit(0))
