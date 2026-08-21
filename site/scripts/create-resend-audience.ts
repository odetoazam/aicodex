/**
 * One-off: create the "AI Codex Weekly" audience in Resend and print the ID.
 *
 * Prereq: RESEND_API_KEY must be set in .env.local.
 *
 *   ./node_modules/.bin/tsx --env-file=.env.local scripts/create-resend-audience.ts
 *
 * Safe to re-run: if an audience with the same name exists, you'll see a conflict
 * error — just grab the existing ID from the Resend dashboard or use the list
 * endpoint (see below).
 */

import { Resend } from 'resend'

async function run() {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.error('✗ RESEND_API_KEY not set. Add it to .env.local first.')
    process.exit(1)
  }

  const resend = new Resend(key)

  // First, check if an audience named "AI Codex Weekly" already exists.
  // Reusing is better than erroring if the script gets re-run.
  const existing = await resend.audiences.list()
  if (existing.data) {
    const match = existing.data.data.find(a => a.name === 'AI Codex Weekly')
    if (match) {
      console.log('\n✓ Audience "AI Codex Weekly" already exists.')
      console.log('\nRESEND_AUDIENCE_ID=' + match.id)
      console.log('\nPaste that line into .env.local. Done.')
      return
    }
  }

  const res = await resend.audiences.create({ name: 'AI Codex Weekly' })

  if (res.error) {
    console.error('✗ audiences.create failed:', res.error)
    process.exit(1)
  }
  if (!res.data) {
    console.error('✗ audiences.create returned no data')
    process.exit(1)
  }

  console.log('\n✓ Created audience "AI Codex Weekly".')
  console.log('\nRESEND_AUDIENCE_ID=' + res.data.id)
  console.log('\nPaste that line into .env.local (and into Vercel env vars).')
}

run().then(() => process.exit(0))
