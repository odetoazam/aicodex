/**
 * Backfill existing Supabase newsletter_subscribers into the Resend audience.
 * One-shot. Run after RESEND_API_KEY + RESEND_AUDIENCE_ID are set in .env.local.
 *
 *   ./node_modules/.bin/tsx --env-file=.env.local scripts/backfill-resend-audience.ts
 *
 * Safe to re-run: "already exists" errors from Resend are treated as success.
 */

import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function run() {
  const apiKey = process.env.RESEND_API_KEY
  const audienceId = process.env.RESEND_AUDIENCE_ID
  if (!apiKey || !audienceId) {
    console.error('✗ Missing RESEND_API_KEY or RESEND_AUDIENCE_ID. Set them in .env.local first.')
    process.exit(1)
  }
  const resend = new Resend(apiKey)

  const { data, error } = await sb
    .from('newsletter_subscribers')
    .select('email, subscribed_at')
    .order('subscribed_at', { ascending: true })

  if (error) {
    console.error('✗ Supabase fetch failed:', error.message)
    process.exit(1)
  }
  if (!data || data.length === 0) {
    console.log('No subscribers to backfill.')
    return
  }

  console.log(`Backfilling ${data.length} subscriber(s) into Resend audience ${audienceId}...\n`)

  let added = 0
  let existed = 0
  let failed = 0

  for (const row of data) {
    const res = await resend.contacts.create({
      email: row.email,
      audienceId,
      unsubscribed: false,
    })
    if (res.error) {
      const msg = typeof res.error === 'object' && 'message' in res.error ? String(res.error.message) : 'unknown'
      if (msg.toLowerCase().includes('already exists')) {
        existed += 1
        console.log(`  - ${row.email}  (already in audience)`)
      } else {
        failed += 1
        console.log(`  ✗ ${row.email}  — ${msg}`)
      }
    } else {
      added += 1
      console.log(`  ✓ ${row.email}`)
    }
    // Be gentle with the API — 50ms spacing is well under Resend's default limits.
    await new Promise(r => setTimeout(r, 50))
  }

  console.log(`\nDone. Added: ${added}  |  Already existed: ${existed}  |  Failed: ${failed}`)
}

run().then(() => process.exit(0))
