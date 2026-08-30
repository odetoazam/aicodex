/**
 * Dead external link repair — 21 broken URLs across 27 articles.
 *
 * Found by extracting all 302 distinct external URLs from the corpus and
 * checking each. Every replacement below was verified to return 200 on
 * 2026-08-30. (Three 403s — BCG, WEF, ZipRecruiter — are bot-blocks on live
 * pages and are deliberately left alone, as is a GitHub 429 rate-limit.)
 *
 * Two links can't be repaired with an equivalent and are handled differently:
 *   - skaled.com RevOps citation: source is gone, so the linked claim is
 *     de-linked and softened rather than left pointing at a 404.
 *   - claude.com/settings/organization: app deep link that no longer resolves;
 *     replaced with the admin console support article plus the in-app path.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/fix-dead-external-links.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/** Straight URL swaps, applied everywhere the old URL appears. */
const URL_SWAPS: [string, string][] = [
  ['https://platform.claude.com/docs/en/test-and-evaluate/eval-intro', 'https://platform.claude.com/docs/en/test-and-evaluate/develop-tests'],
  ['https://platform.claude.com/docs/en/agents-and-tools/agent-sdk', 'https://platform.claude.com/docs/en/agent-sdk/overview'],
  ['https://support.claude.com/en/collections/connectors', 'https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities'],
  ['https://support.claude.com/en/articles/claude-memory', 'https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context'],
  ['https://www.anthropic.com/news/memory-and-new-tools-for-claude', 'https://claude.com/blog/claudes-memory-works-everywhere-and-you-decide-whats-in-it'],
  ['https://platform.claude.com/docs/en/build-with-claude/system-prompts-overview', 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/system-prompts'],
  ['https://code.claude.com/docs/en/secure-deployment', 'https://code.claude.com/docs/en/security'],
  ['https://platform.claude.com/docs/en/agents-and-tools/managed-agents', 'https://platform.claude.com/docs/en/managed-agents/overview'],
  ['https://platform.claude.com/docs/en/claude-code/routines', 'https://code.claude.com/docs/en/routines'],
  ['https://support.claude.com/en/articles/9945497-claude-projects', 'https://support.claude.com/en/articles/9517075-what-are-projects'],
  ['https://www.anthropic.com/news/agents-for-financial-services', 'https://www.anthropic.com/news/claude-for-financial-services'],
  ['https://trust.claude.com', 'https://trust.anthropic.com'],
  ['https://www.anthropic.com/claude/team', 'https://claude.com/team'],
  ['https://www.anthropic.com/claude/work', 'https://claude.com/solutions/enterprise'],
]

/** Link swaps that also need the label changed, since the target differs. */
const LABELLED_SWAPS: [string, string][] = [
  [
    '[Anthropic safety research](https://www.anthropic.com/safety) — Anthropic',
    '[Anthropic research](https://www.anthropic.com/research) — Anthropic',
  ],
  [
    '[Cowork overview — Anthropic Support](https://support.claude.com/en/articles/claude-cowork)',
    '[Claude Cowork](https://claude.com/product/cowork) — what Cowork is and how it runs tasks',
  ],
  [
    '[Deep Research — Anthropic Support](https://support.claude.com/en/articles/claude-deep-research) — the user guide for Deep Research in Claude.ai',
    '[Claude takes research to new places](https://claude.com/blog/research) — how Deep Research works and what it produces',
  ],
  [
    '[Claude for work — Anthropic](https://claude.com/solutions/enterprise)',
    '[Claude for Enterprise](https://claude.com/solutions/enterprise) — plans, controls and deployment for organisations',
  ],
  [
    '[Claude Security announcement](https://www.anthropic.com/news/claude-security), Anthropic, April 30, 2026.',
    '[Claude Security](https://www.anthropic.com/product/security) and [Making frontier cybersecurity capabilities available to defenders](https://www.anthropic.com/news/claude-code-security), Anthropic.',
  ],
]

/** Per-article fixes where a straight swap won't do. */
const ARTICLE_EDITS: Record<string, [string, string][]> = {

  // No live equivalent of the Max plan announcement post; point at pricing.
  'choosing-your-claude-plan': [[
    "[Introducing the Max Plan](https://claude.com/blog/max-plan) — what the Max plan includes and who it's for",
    "[Claude pricing](https://claude.com/pricing) — current plans, including Max, and what each includes",
  ]],
  'ai-for-executive-leaders': [[
    '[Introducing the Max Plan](https://claude.com/blog/max-plan) — what the Max plan includes for power users',
    '[Claude pricing](https://claude.com/pricing) — current plans, including Max, for heavy individual use',
  ]],
  'first-week-with-claude': [[
    "[Introducing the Max Plan](https://claude.com/blog/max-plan) — plan features you'll use in your first week",
    "[Claude pricing](https://claude.com/pricing) — what each plan includes, so you know which features you have",
  ]],
  'claude-adoption-plateau': [[
    '[Introducing the Max Plan](https://claude.com/blog/max-plan) — the plan most suited for power users working solo',
    '[Claude pricing](https://claude.com/pricing) — the plans best suited to power users working solo',
  ]],

  // Source is gone; de-link the claim rather than point at a 404.
  'ai-impact-on-knowledge-work': [[
    '[RevOps leaders are being elevated to VP-level positions](https://skaled.com/insights/revops%E2%80%912026/) across mid-market and enterprise SaaS, reporting directly to the CEO or COO. The reason:',
    'RevOps leaders are increasingly being elevated to VP-level positions across mid-market and enterprise SaaS, reporting directly to the CEO or COO. The reason:',
  ]],

  // App deep link no longer resolves; give the path and the support article.
  'claude-admin-controls-2026': [[
    "**If you're an IT admin or org Owner:** Check your admin panel at [claude.com/settings/organization](https://claude.com/settings/organization). The new controls are live — you don't need to request access.",
    "**If you're an IT admin or org Owner:** Open Settings and go to your organisation's admin console — see [About the admin console](https://support.claude.com/en/articles/10167454-about-the-admin-console) if you're not sure where it lives. The new controls are live; you don't need to request access.",
  ]],
}

async function main() {
  const all: any[] = []
  for (let i = 0; i < 30; i++) {
    const { data, error } = await sb.from('articles').select('slug, body').order('created_at').range(i * 200, i * 200 + 199)
    if (error) { console.error(error.message); process.exit(1) }
    if (!data || !data.length) break
    all.push(...data)
    if (data.length < 200) break
  }

  const touched = new Map<string, { body: string; changes: string[] }>()

  const bump = (slug: string, body: string, note: string) => {
    const cur = touched.get(slug)
    if (cur) { cur.body = body; cur.changes.push(note) }
    else touched.set(slug, { body, changes: [note] })
  }

  for (const a of all) {
    let body = (touched.get(a.slug)?.body ?? a.body) as string
    const before = body

    for (const [from, to] of LABELLED_SWAPS) {
      if (body.includes(from)) { body = body.split(from).join(to); bump(a.slug, body, 'relabelled link') }
    }
    for (const [from, to] of URL_SWAPS) {
      if (body.includes(from)) { body = body.split(from).join(to); bump(a.slug, body, from.replace(/^https:\/\//, '')) }
    }
    for (const [from, to] of ARTICLE_EDITS[a.slug] ?? []) {
      if (body.includes(from)) { body = body.split(from).join(to); bump(a.slug, body, 'article-specific fix') }
      else console.error(`  ! ${a.slug}: article-specific anchor not found`)
    }

    if (body !== before && !touched.has(a.slug)) touched.set(a.slug, { body, changes: ['(unlabelled)'] })
  }

  let failures = 0
  for (const [slug, { body, changes }] of touched) {
    const { error } = await sb.from('articles').update({ body, updated_at: new Date().toISOString() }).eq('slug', slug)
    if (error) { console.error(`✗ ${slug}: ${error.message}`); failures++ }
    else console.log(`✓ ${slug} — ${changes.length} link fix(es)`)
  }

  if (failures) { console.error(`\n${failures} article(s) failed.`); process.exit(1) }
  console.log(`\n${touched.size} articles updated.`)
}

main().catch((e) => { console.error(e); process.exit(1) })
