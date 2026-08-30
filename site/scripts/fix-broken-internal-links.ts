/**
 * Two internal links pointed at slugs that do not exist.
 *
 * Both returned HTTP 200 with a near-empty page, because the article and
 * glossary routes rendered a "not found" component instead of calling
 * notFound(). That is fixed in app/articles/[slug]/page.tsx and
 * app/glossary/[slug]/page.tsx; this repairs the links themselves.
 *
 * (A third apparent break, /articles/claude-plus, is a real hub route defined
 * at app/articles/claude-plus/page.tsx rather than a row in the articles
 * table. It is fine and is deliberately left alone.)
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/fix-broken-internal-links.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const E: Record<string, [string, string][]> = {
  // The article IS the Ultraplan explainer; it was linking to a glossary term
  // that was never created. Drop the self-link.
  'ultraplan-def': [[
    '[Ultraplan](/glossary/ultraplan) is a planning mode in',
    'Ultraplan is a planning mode in',
  ]],

  // No programmatic-tool-calling article exists. Point at Anthropic's own
  // write-up, which is where the detail actually lives.
  'claude-code-june-2026-updates': [
    [
      'the **minimum** required for [programmatic tool calling](/articles/programmatic-tool-calling), the feature that lets Claude write a single script',
      'the **minimum** required for [programmatic tool calling](https://www.anthropic.com/engineering/advanced-tool-use), the feature that lets Claude write a single script',
    ],
    [
      '- [Programmatic tool calling](/articles/programmatic-tool-calling) — the feature that needs the new code execution version',
      '- [Advanced tool use](https://www.anthropic.com/engineering/advanced-tool-use) — programmatic tool calling, tool search and tool use examples',
    ],
  ],
}

async function main() {
  let failures = 0
  for (const [slug, edits] of Object.entries(E)) {
    const { data, error } = await sb.from('articles').select('slug, body').eq('slug', slug).single()
    if (error || !data) {
      console.error(`✗ ${slug}: ${error?.message}`)
      failures++
      continue
    }
    let body = data.body as string
    let ok = true
    for (const [from, to] of edits) {
      if (!body.includes(from)) {
        console.error(`✗ ${slug}: anchor not found → ${from.slice(0, 60)}...`)
        ok = false
        break
      }
      body = body.replace(from, to)
    }
    if (!ok) { failures++; continue }

    const { error: upErr } = await sb
      .from('articles')
      .update({ body, updated_at: new Date().toISOString() })
      .eq('slug', slug)
    if (upErr) { console.error(`✗ ${slug}: ${upErr.message}`); failures++ }
    else console.log(`✓ ${slug} — ${edits.length} link(s)`)
  }
  if (failures) { console.error(`\n${failures} failed.`); process.exit(1) }
  console.log('\nInternal links repaired.')
}

main().catch((e) => { console.error(e); process.exit(1) })
