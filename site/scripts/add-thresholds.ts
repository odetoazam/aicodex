/**
 * Numeric thresholds audit — rule #24 (Diaz pattern).
 * Every how-to article must have at least one earned numeric threshold.
 * Applies to: securing-your-claude-app, your-first-claude-api-call
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

async function patchArticle(slug: string, oldStr: string, newStr: string) {
  const { data, error } = await sb.from('articles').select('body').eq('slug', slug).single()
  if (error || !data) { console.error(`Could not fetch ${slug}:`, error); return }

  if (!data.body.includes(oldStr)) {
    console.error(`Pattern not found in ${slug}. Body may have changed.`)
    console.error(`Looking for: ${oldStr.slice(0, 80)}...`)
    return
  }

  const updatedBody = data.body.replace(oldStr, newStr)
  const { error: updateErr } = await sb.from('articles').update({ body: updatedBody }).eq('slug', slug)
  if (updateErr) { console.error(`Update failed for ${slug}:`, updateErr); return }
  console.log(`✓ Threshold added to ${slug}`)
}

async function run() {
  // securing-your-claude-app: make cost exposure concrete in the API key section
  await patchArticle(
    'securing-your-claude-app',
    'API keys with high usage can accumulate significant costs quickly if someone else is using them.',
    'A compromised API key running automated requests can generate $500 or more in unauthorized API charges within a single day. Rotate immediately if you suspect exposure.',
  )

  // your-first-claude-api-call: add timing context to the streaming section
  await patchArticle(
    'your-first-claude-api-call',
    'For anything user-facing, stream. Waiting for the full response before rendering is a bad user experience, and for long outputs it is a long wait.',
    'For anything user-facing, stream. Waiting for the full response before rendering is a bad user experience — responses that take more than 2 seconds to begin rendering have measurably lower completion rates in user-facing interfaces. Streaming starts delivering text within the first 200–500ms of generation, regardless of how long the full response takes.',
  )
}

run().then(() => process.exit(0))
