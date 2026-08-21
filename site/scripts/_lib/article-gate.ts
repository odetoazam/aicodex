/**
 * Retro instruction #30 — the application-prompt gate.
 *
 * Every seeded article must end with something the reader can *do*, or carry an
 * explicit, reasoned exemption. This has been a retro finding in three
 * consecutive sessions because it relied on the author remembering. It no
 * longer does: seed scripts call `assertSeedable()` before writing, and it
 * throws.
 *
 * Usage in a seed script:
 *
 *   import { assertSeedable } from './_lib/article-gate'
 *   assertSeedable(articles)          // throws before anything is written
 *
 * To exempt an article, set `noPromptReason` on it with a real reason:
 *
 *   { slug: 'ai-agent-def', ..., noPromptReason: 'Glossary definition — the
 *     practice lives on the role and process articles for this term.' }
 */

/** Headings that count as an application prompt. Keep this list tight. */
const PROMPT_PATTERNS: RegExp[] = [
  /^##+\s*Try this today/im,
  /^##+\s*Skill module/im,
  /^##+\s*What to do this week/im,
  /^##+\s*What to do\b/im,
  /^##+\s*Run (the|this|it)\b/im,
  /^##+\s*Your first\b.*\bhour/im,
  /^##+\s*The .{0,30}exercise/im,
]

export type SeedableArticle = {
  slug: string
  body: string
  /** Set only when the article genuinely has no useful action. Must explain why. */
  noPromptReason?: string
}

export function hasApplicationPrompt(body: string): boolean {
  return PROMPT_PATTERNS.some(re => re.test(body))
}

/**
 * Throws if any article lacks both an application prompt and a stated reason.
 * Call this at the top of a seed script, before any write.
 */
export function assertSeedable(articles: SeedableArticle[]): void {
  const failures: string[] = []
  const exempt: string[] = []

  for (const a of articles) {
    if (hasApplicationPrompt(a.body)) continue
    if (a.noPromptReason && a.noPromptReason.trim().length >= 20) {
      exempt.push(`${a.slug} — ${a.noPromptReason.trim()}`)
      continue
    }
    if (a.noPromptReason) {
      failures.push(`${a.slug}: noPromptReason is too short to be a real reason`)
      continue
    }
    failures.push(`${a.slug}: no application prompt, and no noPromptReason given`)
  }

  if (exempt.length) {
    console.log('Application-prompt exemptions (recorded):')
    exempt.forEach(e => console.log(`  – ${e}`))
    console.log()
  }

  if (failures.length) {
    throw new Error(
      '\n\nApplication-prompt gate failed (retro instruction #30).\n' +
      'Every article needs a section the reader can act on — "## Try this today",\n' +
      '"## Skill module: ...", "## What to do this week" — or an explicit\n' +
      '`noPromptReason` explaining why this one genuinely has no useful action.\n\n' +
      failures.map(f => `  ✗ ${f}`).join('\n') +
      '\n\nNothing was written. Fix the articles above and re-run.\n'
    )
  }

  console.log(`✓ Application-prompt gate passed (${articles.length} articles)\n`)
}
