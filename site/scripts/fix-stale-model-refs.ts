/**
 * Corrections pass, Aug 21 2026.
 *
 * 1. claude-sonnet-5 — stated the price rises to $3/$15 on Sep 1, 2026. Anthropic
 *    cancelled that increase on Aug 10, 2026 and made $2/$10 the standard rate.
 *    This was actionably wrong for anyone budgeting off the article.
 * 2. your-first-claude-api-call — cited Sonnet 4.6 at 200k context. Wrong twice:
 *    4.6 is 1M, and Sonnet 5 is the current model.
 * 3. claude-cost-optimization — code comment priced Sonnet 4.6 at $3 input.
 * 4/5. Generic "GPT-4" mentions refreshed to the current flagship where the
 *    reference was to "the current frontier model" rather than to history.
 */
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type Fix = { slug: string; find: string; replace: string; label: string }

const FIXES: Fix[] = [
  {
    slug: 'claude-sonnet-5',
    label: 'pricing table rows',
    find: `| Price (through Aug 31, 2026) | $2 / $10 per MTok |
| Price (from Sep 1, 2026) | $3 / $15 per MTok |`,
    replace: `| Price | $2 / $10 per MTok |`,
  },
  {
    slug: 'claude-sonnet-5',
    label: 'pricing narrative',
    find: `## The pricing has a clock on it

This is the part worth putting in a calendar. Sonnet 5 runs at **$2 input / $10 output per million tokens through August 31, 2026**. On September 1 it goes to the standard **$3 / $15**.

That's a 50% increase on both input and output, arriving on a specific date. If you are modelling costs for a Sonnet 5 workload right now, model the September number, not the July one. Teams that budget off introductory pricing get an unpleasant surprise in the first September invoice.

For comparison, Sonnet 4.6 ran at $3/$15 — so the standard Sonnet 5 price is flat versus the model it replaces. The discount is genuinely a discount, not a repricing.`,
    replace: `## The pricing clock was cancelled

**Update, August 10, 2026:** the $2 / $10 rate is now permanent. It launched as introductory pricing due to expire on August 31, 2026, with a scheduled rise to $3 / $15 on September 1. Anthropic cancelled that increase. The standard price is $2 input / $10 output per million tokens, with no end date.

This is a real change to agent economics, not a footnote. Sonnet 4.6 ran at $3 / $15, so Sonnet 5 is a permanent 33% cut against the model it replaces — and Sonnet 5 is what most production agent fleets run on. If you built a cost model that assumed a 50% increase in September, you have just recovered a third of your headroom.

It also means the [Haiku 4.5 versus Sonnet 5 decision](/compare/claude-haiku-vs-sonnet) is not what it used to be. Sonnet is now 2× Haiku rather than 3.75×, which weakens the standard argument for dropping a tier on high-volume work.`,
  },
  {
    slug: 'your-first-claude-api-call',
    label: 'context window figure',
    find: 'Claude Sonnet 4.6 supports 200k input tokens.',
    replace: 'Claude Sonnet 5 supports a 1M-token context window, as do Opus 5 and Fable 5; Haiku 4.5 supports 200k.',
  },
  {
    slug: 'claude-cost-optimization',
    label: 'code comment pricing',
    find: '# Rough pricing for Sonnet 4.6 (check current pricing at anthropic.com)\n        input_cost = usage.input_tokens * 3 / 1_000_000',
    replace: '# Sonnet 5 pricing, $2/$10 per MTok (verify at claude.com/pricing)\n        input_cost = usage.input_tokens * 2 / 1_000_000',
  },
  {
    slug: 'large-language-model-def',
    label: 'current-frontier reference',
    find: 'Claude, GPT-4, and their contemporaries are estimated',
    replace: 'Claude and GPT-5 class models are estimated',
  },
  {
    slug: 'what-is-a-forward-deployed-engineer',
    label: 'current-frontier reference',
    find: 'Building Claude or GPT-4o is the hard part of AI research.',
    replace: 'Building Claude or GPT-5.6 is the hard part of AI research.',
  },
]

async function main() {
  console.log('Applying stale-reference corrections...\n')
  const bodies = new Map<string, string>()

  for (const f of FIXES) {
    if (!bodies.has(f.slug)) {
      const { data, error } = await sb.from('articles').select('body').eq('slug', f.slug).single()
      if (error || !data) { console.error(`  ✗ ${f.slug}: not found`); continue }
      bodies.set(f.slug, data.body as string)
    }
    const body = bodies.get(f.slug)!
    if (!body.includes(f.find)) {
      console.error(`  ✗ ${f.slug} (${f.label}): find-text not present — skipped`)
      continue
    }
    bodies.set(f.slug, body.replace(f.find, f.replace))
    console.log(`  ✓ ${f.slug} (${f.label})`)
  }

  for (const [slug, body] of bodies) {
    const { error } = await sb.from('articles').update({ body }).eq('slug', slug)
    console.log(error ? `  ✗ write ${slug}: ${error.message}` : `  → wrote ${slug}`)
  }
  console.log('\nDone.')
}

main().catch(console.error)
