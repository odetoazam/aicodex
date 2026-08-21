/**
 * Corpus-wide audit for retro instruction #30.
 *
 * The gate in _lib/article-gate.ts stops new articles shipping without an
 * application prompt. This reports on everything already in the database, so
 * the backlog is a visible number rather than a vague worry.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/check-application-prompts.ts
 */
import { createClient } from '@supabase/supabase-js'
import { hasApplicationPrompt } from './_lib/article-gate'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  const all: { slug: string; body: string; cluster: string | null; created_at: string }[] = []
  for (let i = 0; i < 10; i++) {
    const { data } = await sb
      .from('articles')
      .select('slug, body, cluster, created_at')
      .order('created_at', { ascending: false })
      .range(i * 100, i * 100 + 99)
    if (!data || !data.length) break
    all.push(...(data as any))
  }

  const missing = all.filter(a => !hasApplicationPrompt(a.body))
  const pct = Math.round(((all.length - missing.length) / all.length) * 100)

  console.log(`\nApplication prompts: ${all.length - missing.length} / ${all.length} articles (${pct}%)\n`)

  console.log('Most recent 25 without one — these are the ones worth fixing first:')
  missing.slice(0, 25).forEach(a => console.log(`  ${a.created_at.slice(0, 10)}  ${a.slug}  [${a.cluster ?? '—'}]`))

  const byCluster = new Map<string, number>()
  for (const a of missing) byCluster.set(a.cluster ?? '—', (byCluster.get(a.cluster ?? '—') ?? 0) + 1)
  console.log('\nBy cluster:')
  ;[...byCluster.entries()].sort((a, b) => b[1] - a[1]).forEach(([c, n]) => console.log(`  ${String(n).padStart(3)}  ${c}`))
  console.log()
}

main().catch(console.error)
