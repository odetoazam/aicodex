/**
 * update-links-4.ts — Cross-link batch 23 articles
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/update-links-4.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// href is either /articles/slug or /glossary/slug
// text must match exactly in the article body (case-sensitive)

const LINK_RULES: Record<string, { text: string; href: string }[]> = {

  // ── rate-limiting-claude-api ────────────────────────────────────────────────
  'rate-limiting-claude-api': [
    { text: 'exponential backoff', href: '/glossary/rate-limiting' },
    { text: 'context window', href: '/glossary/context-window' },
    { text: 'authentication', href: '/articles/nextauth-claude-integration' },
    { text: 'conversation history', href: '/articles/supabase-conversation-history' },
  ],

  // ── nextauth-claude-integration ─────────────────────────────────────────────
  'nextauth-claude-integration': [
    { text: 'conversation history', href: '/articles/supabase-conversation-history' },
    { text: 'rate limiting', href: '/articles/rate-limiting-claude-api' },
    { text: 'API route', href: '/articles/your-first-claude-api-call' },
    { text: 'production', href: '/articles/deploying-claude-app-production' },
  ],

  // ── supabase-conversation-history ───────────────────────────────────────────
  'supabase-conversation-history': [
    { text: 'context window', href: '/glossary/context-window' },
    { text: 'authentication', href: '/articles/nextauth-claude-integration' },
    { text: 'rate limiting', href: '/articles/rate-limiting-claude-api' },
    { text: 'persistent memory', href: '/articles/chatbot-with-persistent-memory' },
  ],

  // ── claude-vs-custom-model ──────────────────────────────────────────────────
  'claude-vs-custom-model': [
    { text: 'fine-tuning', href: '/glossary/fine-tuning' },
    { text: 'eval suite', href: '/articles/writing-evals-that-catch-regressions' },
    { text: 'RAG', href: '/articles/building-a-rag-pipeline-from-scratch' },
    { text: 'system prompt', href: '/glossary/system-prompt' },
    { text: 'build vs. buy', href: '/articles/build-buy-prompt-early-stage' },
    { text: 'extended thinking', href: '/glossary/extended-thinking' },
  ],

}

function injectLink(body: string, text: string, href: string): string {
  // Only link the first occurrence, skip if already linked
  if (body.includes(`[${text}](`)) return body
  // Skip if inside a code block
  const idx = body.indexOf(text)
  if (idx === -1) return body
  return body.slice(0, idx) + `[${text}](${href})` + body.slice(idx + text.length)
}

async function run() {
  console.log('Running update-links-4...\n')

  for (const [slug, rules] of Object.entries(LINK_RULES)) {
    const { data: article, error } = await sb
      .from('articles')
      .select('id, body')
      .eq('slug', slug)
      .single()

    if (error || !article) {
      console.error(`❌  Not found: ${slug}`)
      continue
    }

    let body: string = article.body ?? ''
    let changed = false

    for (const { text, href } of rules) {
      const updated = injectLink(body, text, href)
      if (updated !== body) {
        body = updated
        changed = true
        console.log(`   → linked "${text}" in ${slug}`)
      }
    }

    if (changed) {
      const { error: updateError } = await sb
        .from('articles')
        .update({ body })
        .eq('id', article.id)

      if (updateError) {
        console.error(`❌  Failed to update ${slug}:`, updateError.message)
      } else {
        console.log(`✅  ${slug}`)
      }
    } else {
      console.log(`–   ${slug} (no changes)`)
    }
  }

  console.log('\nDone.')
}

run().catch(console.error)
