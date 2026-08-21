/**
 * Correction — claude-fable-5 status banner is stale.
 *
 * The article has carried a "Fable 5 is currently suspended" banner since
 * June 13, 2026. The US Commerce Department export-control directive was
 * lifted on June 30, and Anthropic restored access to Claude Fable 5 and
 * Claude Mythos 5 on July 1, 2026. The banner and excerpt have been wrong
 * on the live site for ~4 weeks.
 *
 * This script replaces the leading status blockquote and rewrites the excerpt.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/fix-fable-5-restored.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const NEW_BANNER = `> **Status update — July 1, 2026: Fable 5 is back.** The US export-control directive that forced this model offline was lifted on June 30, and Anthropic restored access to both Claude Fable 5 and Claude Mythos 5 on July 1, 2026. \`claude-fable-5\` is callable again on the Claude API and across subscription plans. The suspension lasted three weeks, from June 12 to July 1. See [Anthropic's statement](https://www.anthropic.com/news/redeploying-fable-5). Two things are worth carrying forward from the outage: keep the fallback path you built (the \`fallbacks\` parameter now supports a \`"default"\` mode that picks fallback models for you), and read [what to do when your AI model disappears](/articles/when-your-ai-model-disappears) — this will happen again to some model, somewhere. Note also that Fable 5 is no longer the top of the lineup on price-performance: [Claude Opus 5](/articles/claude-opus-5) launched July 24, 2026 at $5/$25 — half the price of Fable 5's $10/$50 — and Anthropic positions it as close to Fable 5's frontier intelligence.`

const NEW_EXCERPT =
  "Claude Fable 5 is Anthropic's most capable widely released model — $10/$50 per million tokens, a 1M-token context window, always-on adaptive thinking, and the first Claude model that can decline a request mid-API-call. It was suspended for three weeks by a US export-control directive and restored on July 1, 2026. Here's what the model does, what the refusal behaviour means for your code, and when it's worth double the price of Opus 5."

async function main() {
  const { data, error } = await sb
    .from('articles')
    .select('slug, excerpt, body')
    .eq('slug', 'claude-fable-5')
    .single()

  if (error || !data) {
    console.error('Could not load claude-fable-5:', error?.message)
    process.exit(1)
  }

  const blocks = (data.body as string).split('\n\n')

  if (!blocks[0].startsWith('> **Status update')) {
    console.error('Unexpected body shape — first block is not the status banner. Aborting.')
    console.error('First 200 chars:', blocks[0].slice(0, 200))
    process.exit(1)
  }

  blocks[0] = NEW_BANNER
  const newBody = blocks.join('\n\n')

  const { error: upErr } = await sb
    .from('articles')
    .update({ body: newBody, excerpt: NEW_EXCERPT })
    .eq('slug', 'claude-fable-5')

  if (upErr) {
    console.error('Update failed:', upErr.message)
    process.exit(1)
  }

  console.log('✓ claude-fable-5 — suspension banner replaced with restoration notice')
  console.log('✓ claude-fable-5 — excerpt rewritten')
}

main().catch(console.error)
