/**
 * Seed practical_example for all published glossary terms.
 *
 * For each term, calls Claude API to generate a 2-3 sentence plain-English
 * scenario showing what the concept looks like in real use.
 *
 * Prerequisites:
 *   1. Run migration 003_practical_example.sql in Supabase dashboard SQL editor
 *   2. ANTHROPIC_API_KEY must be in environment
 *
 * Run:
 *   ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-practical-examples.ts
 *
 * Resume-safe: skips terms that already have practical_example set.
 * Add --force flag to regenerate all.
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

// Force-load .env.local, overriding any empty shell env vars
try {
  const envPath = resolve(process.cwd(), '.env.local')
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const eq = line.indexOf('=')
    if (eq > 0) {
      const key = line.slice(0, eq).trim()
      const val = line.slice(eq + 1).trim()
      if (key && val) process.env[key] = val
    }
  }
} catch { /* ignore if file not found */ }

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const FORCE = process.argv.includes('--force')
const BATCH_SIZE = 5      // concurrent API calls
const DELAY_MS   = 800    // ms between batches

async function generateExample(term: {
  name: string
  cluster: string
  definition: string
  audience: string[]
}): Promise<string> {
  const audienceHint = term.audience.includes('developer')
    ? 'The reader may be a developer or a non-technical operator.'
    : 'The reader is a non-technical to semi-technical person — office manager, CS rep, marketing coordinator, or small business owner.'

  const msg = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 200,
    messages: [{
      role: 'user',
      content: `You are writing a plain-English "what this looks like in practice" block for a glossary term on AI Codex — a site that helps people understand and use Claude/AI effectively at work.

Term: ${term.name}
Cluster: ${term.cluster}
Definition: ${term.definition}

${audienceHint}

Write exactly 2-3 sentences that answer: "what does this actually look like when someone encounters or uses it?"

Requirements:
- Start with a concrete scenario ("You're building a support bot and...", "When your team asks Claude to...", "Imagine you're reviewing a vendor contract...")
- Do NOT repeat the definition — add the scenario, the moment it matters, or the outcome
- No jargon without immediate plain-English explanation in the same sentence
- No headers, no bullets, no markdown — plain prose only
- 2-3 sentences only`,
    }],
  })

  return (msg.content[0] as { text: string }).text.trim()
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  console.log('Fetching published terms...')
  const { data: terms, error } = await sb
    .from('terms')
    .select('id, slug, name, cluster, definition, audience')
    .eq('published', true)
    .order('name')

  if (error) {
    console.error('Failed to fetch terms:', error)
    process.exit(1)
  }

  // Check which terms already have examples (separate query, tolerates missing column)
  let existingSlugs = new Set<string>()
  if (!FORCE) {
    const { data: existing } = await sb
      .from('terms')
      .select('slug')
      .eq('published', true)
      .not('practical_example', 'is', null)
    existingSlugs = new Set((existing ?? []).map((t: { slug: string }) => t.slug))
  }

  const toProcess = FORCE ? terms : terms.filter(t => !existingSlugs.has(t.slug))

  console.log(`${terms.length} total terms. ${toProcess.length} need examples.`)
  if (toProcess.length === 0) {
    console.log('Nothing to do. Use --force to regenerate all.')
    return
  }

  let done = 0
  let failed = 0

  // Process in batches
  for (let i = 0; i < toProcess.length; i += BATCH_SIZE) {
    const batch = toProcess.slice(i, i + BATCH_SIZE)

    await Promise.all(batch.map(async term => {
      try {
        const example = await generateExample(term)

        const { error: updateError } = await sb
          .from('terms')
          .update({ practical_example: example })
          .eq('id', term.id)

        if (updateError) {
          console.error(`  ✗ ${term.slug}: DB write failed:`, updateError.message)
          failed++
        } else {
          done++
          console.log(`  ✓ ${term.slug} (${done}/${toProcess.length})`)
        }
      } catch (e) {
        console.error(`  ✗ ${term.slug}:`, (e as Error).message)
        failed++
      }
    }))

    if (i + BATCH_SIZE < toProcess.length) {
      await sleep(DELAY_MS)
    }
  }

  console.log(`\nDone. ${done} updated, ${failed} failed.`)
}

main()
