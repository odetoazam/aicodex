/**
 * Patch claude-fable-5 top status banner: June 12 (suspended) -> June 29 (Mythos 5 partial restore).
 * The live DB banner is the original June 12 version (batch 87's patch never applied here).
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/fix-fable-banner-jun29.ts
 */
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const OLD = "> **Status update — June 12, 2026: Fable 5 is currently suspended.** The US government issued an export-control directive on June 12 (5:21pm ET) barring access to Fable 5 and Mythos 5 by any foreign national, citing a national-security concern tied to a method of bypassing the model's safeguards. To comply, Anthropic **disabled both models worldwide for all customers** — three days after launch. You cannot call `claude-fable-5` right now. Anthropic calls it a misunderstanding and says it is working to restore access; **all other Claude models (Opus 4.8, Sonnet, Haiku) are unaffected.** Everything below describes the model as launched — read it as what to expect *if and when access returns*, and keep a fallback to Opus 4.8 in place. See [Anthropic's statement](https://www.anthropic.com/news/fable-mythos-access)."

const NEW = "> **Status update — June 29, 2026: Mythos 5 partially restored; Fable 5 still offline (day 17).** The US government's June 12 export-control directive barred access to Fable 5 and Mythos 5 by any foreign national, and Anthropic disabled both worldwide three days after launch. On **June 26**, Commerce Secretary Howard Lutnick concluded appropriate safeguards were in place, and the government cleared **Claude Mythos 5 — the stronger cybersecurity model — to be redeployed to a set of US organizations that operate and defend critical infrastructure.** Fable 5 remained banned for general users as of June 29, though Anthropic and outside observers expected US access could return within days. The model still appears in some pickers but returns a `currently unavailable` error. **All other Claude models (Opus 4.8, Sonnet, Haiku) are unaffected; keep a fallback to Opus 4.8 wired in.** Everything below describes the model as launched — read it as what to expect *if and when access returns*. See [Anthropic's statement](https://www.anthropic.com/news/fable-mythos-access)."

async function run() {
  const { data, error } = await sb.from('articles').select('body').eq('slug', 'claude-fable-5').maybeSingle()
  if (error || !data) { console.error('could not read:', error?.message ?? 'not found'); process.exit(1) }
  if (!data.body.includes(OLD)) {
    console.warn('⚠ old banner not found — printing first 400 chars for inspection:')
    console.log(data.body.slice(0, 400))
    process.exit(1)
  }
  const newBody = data.body.replace(OLD, NEW)
  const { error: upErr } = await sb.from('articles').update({ body: newBody }).eq('slug', 'claude-fable-5')
  if (upErr) { console.error('update failed:', upErr.message); process.exit(1) }
  console.log('✓ claude-fable-5 banner updated to Jun 29 status (Mythos partial restore)')
}

run().then(() => process.exit(0))
