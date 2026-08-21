/**
 * Batch 88 — Anthropic developer roundup: June 2026 platform + Claude Code changes
 *   + in-place currency refresh of claude-fable-5 banner (Mythos 5 partial restore, Jun 26).
 *
 * 1. claude-code-june-2026-updates  (NEW)
 *    Developer-facing roundup of June 2026 changes, following the
 *    claude-code-may-2026-updates pattern. Covers: API rate-limit tier
 *    consolidation (Start/Build/Scale, Jun 26), fast-mode lifecycle (Opus 4.6
 *    removed Jun 29, Opus 4.7 deprecated -> Jul 24), code_execution_20260120
 *    REPL state persistence (Jun 18), Sonnet 4 / Opus 4 retirement (Jun 15),
 *    Claude in Microsoft Foundry GA (Jun 29), Claude Code app UX (org default
 *    models, readable session names, clickable attachments, Trusted Devices,
 *    org-wide MCP connector provisioning via Okta). DEV_SLUGS. Cluster: Claude Code.
 *    Angle: update. Term: claude-code.
 *
 * 2. claude-fable-5  (PATCH — banner only)
 *    Jun 26: the US government cleared Mythos 5 for US critical-infrastructure
 *    orgs (Lutnick letter); Fable 5 still offline for general users at Jun 29
 *    but restoration expected within days. Refresh the top status banner.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-88.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getTermId(slug: string): Promise<{ id: string; name: string } | null> {
  const { data } = await sb.from('terms').select('id, name').eq('slug', slug).single()
  return data
}

const articles = [
  {
    slug: 'claude-code-june-2026-updates',
    angle: 'update',
    title: 'What changed for Claude developers in June 2026',
    excerpt: "Six changes landed on the Claude API and in Claude Code in June 2026 that affect how you build and what you pay. Rate-limit tiers were consolidated and raised, fast mode started winding down for older Opus models, the code execution tool gained persistent state, and Claude Opus 4 and Sonnet 4 were retired. Here is each one, the date, and what to do about it.",
    readTime: 6,
    cluster: 'Claude Code',
    audience: ['developer'],
    termSlug: 'claude-code',
    body: `June 2026 was a maintenance month more than a launch month. No new flagship model shipped after [Fable 5 on June 9](/articles/claude-fable-5), but a string of platform and Claude Code changes landed that change rate limits, billing, and which models you can call. Here is each one with its date and the action it asks of you.

## 1. Rate-limit tiers consolidated and raised (June 26)

Anthropic raised [rate limits](https://platform.claude.com/docs/en/api/rate-limits) across the Claude API and collapsed the old usage-tier ladder into three tiers: **Start, Build, and Scale**.

The change that matters most: **Claude Sonnet and Claude Haiku rate limits now match Claude Opus at every tier.** Previously the cheaper models often had lower ceilings, which forced some teams onto Opus just to get throughput. That distortion is gone.

Anthropic's stated outcome: most organizations move to a higher tier, no organization receives lower limits than before, and no action is required. You can see your tier and current limits in the [Claude Console](https://platform.claude.com/settings/limits).

**What to do:** nothing required. If you were rate-limited on Sonnet or Haiku and worked around it by routing to Opus, re-check whether that workaround is still worth its cost.

## 2. Fast mode is winding down for older Opus models

[Fast mode](https://platform.claude.com/docs/en/build-with-claude/fast-mode) — the premium-priced option that returns responses roughly 2.5x faster — is being retired on the older Opus generations and consolidated onto Opus 4.8.

- **June 25 — Opus 4.7 fast mode deprecated.** Removal is scheduled for **July 24, 2026**. After that date, a request to \`claude-opus-4-7\` with \`speed: "fast"\` returns an error.
- **June 29 — Opus 4.6 fast mode removed.** A request to \`claude-opus-4-6\` with \`speed: "fast"\` no longer runs at fast speed or premium pricing. It runs at standard speed, is billed at standard rates, and does **not** return an error. The response's \`usage.speed\` field reports the speed actually used.

The June 29 behavior is the one to watch, because it fails quietly. If you have code that sets \`speed: "fast"\` on Opus 4.6 and assumes it is getting the fast path, you are now silently getting standard speed at standard price — no exception thrown.

**What to do:** if you depend on fast mode, migrate those calls to \`claude-opus-4-8\`, which is where fast mode now lives. See the [migration guide](/articles/migrating-to-claude-4-7) for the model-name swap.

## 3. Code execution tool gained persistent state (June 18)

The [code execution tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool) shipped a new version, \`code_execution_20260120\`, that adds **REPL state persistence**: variables and imports survive across cells within a session instead of resetting each time. The SDKs for Python, TypeScript, Go, Java, Ruby, PHP, and C# all support it. No beta header is required — set the tool's \`type\` to \`code_execution_20260120\`.

This version is also the **minimum** required for [programmatic tool calling](/articles/programmatic-tool-calling), the feature that lets Claude write a single script that calls your tools inside the sandbox instead of bouncing through the model once per call. If you are adopting programmatic tool calling, you need this version.

It is available on Claude Fable 5, Mythos 5, Opus 4.5 and newer, and Sonnet 4.5 and newer.

**What to do:** if you use code execution and want state to carry across cells, bump the \`type\` string. Check the [model compatibility table](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool#model-compatibility) first.

## 4. Claude Opus 4 and Sonnet 4 were retired (June 15)

The original Claude 4 models reached end of life:

- \`claude-opus-4-20250514\` (Opus 4)
- \`claude-sonnet-4-20250514\` (Sonnet 4)

Requests to either model ID now return an error. This was announced well in advance, but if you pinned a model ID from May 2025 and never updated it, your calls are now failing.

**What to do:** point Opus 4 calls at [Opus 4.8](/articles/claude-opus-4-8) and Sonnet 4 calls at Sonnet 4.6. Researchers who need ongoing access to the retired models can request it through the [External Researcher Access Program](https://support.claude.com/en/articles/9125743-what-is-the-external-researcher-access-program). This is the standard reason to pin a model *family* alias where possible and to keep a [fallback path](/articles/when-your-ai-model-disappears) wired in.

## 5. Claude in Microsoft Foundry reached general availability (June 29)

Claude is now generally available in **Microsoft Foundry** on Azure, out of preview. Opus 4.8 and Haiku 4.5 are available through the Messages API with Azure-native identity, billing, and governance, plus optional US data zone support for eligible customers.

For teams already standardized on Azure, this means Claude access without a separate Anthropic billing relationship — the same Messages API shape you use elsewhere, routed through Foundry.

**What to do:** if your org runs on Azure and procurement was the blocker, this removes it. The API surface is the same; only the endpoint and auth change.

## 6. Claude Code app: smaller quality-of-life changes

Several changes landed in the Claude Code desktop and CLI experience through June:

- **Organization default models** — admins can set a default model for everyone in the org, so new sessions start on the model you standardized on.
- **Readable session names** — sessions get human-readable names at startup instead of opaque IDs, which makes the sessions list navigable.
- **Clickable file attachments** and a **smoother agents view** for managing parallel work.
- **Trusted Devices for remote sessions (June 25)** — Team and Enterprise admins can require device verification before a member connects to a remote Claude Code session.
- **Org-wide MCP connector provisioning** — admins can provision [MCP](/articles/mcp-for-operators) connectors for the whole organization through their identity provider, starting with Okta. Users get connector access automatically on first login instead of each person wiring it up.

None of these change your code. They change how a team is administered and how sessions are kept straight at scale.

## The pattern across all six

Nothing here is a new capability you have to learn. Five of the six are lifecycle moves — tiers consolidated, fast mode migrated, old models retired, a tool version bumped, a cloud endpoint promoted to GA. The lesson they share is the same one [Fable 5's suspension](/articles/when-your-ai-model-disappears) taught the hard way in the same month: pinned model IDs and assumed pricing paths are liabilities. The teams that spent June untouched were the ones already pointing at current model aliases with a fallback wired in.

## What to read next

- [What changed for Claude developers in May 2026](/articles/claude-code-may-2026-updates) — the prior month's roundup
- [Programmatic tool calling](/articles/programmatic-tool-calling) — the feature that needs the new code execution version
- [Claude's June 15 billing change](/articles/claude-subscription-credit-changes) — the separate-credit-pool change for programmatic usage
- [What to do when your AI model disappears](/articles/when-your-ai-model-disappears) — fallback patterns for retirements and suspensions

---

*Sources: [Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview) (June 15–29, 2026) and the [Claude Code changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md).*`,
  },
]

// --- Fable 5 banner patch (in-place, body string replace) ---

const FABLE_OLD_BANNER =
  "> **Status update — still suspended as of June 26, 2026 (day 14).** The US government issued an export-control directive on June 12 (5:21pm ET) barring access to Fable 5 and Mythos 5 by any foreign national, citing a national-security concern tied to a method of bypassing the model's safeguards. Anthropic **disabled both models worldwide for all customers** three days after launch — and they remain down. On June 25, Anthropic confirmed it is serving *zero* traffic to Fable 5; viral claims that access had returned were a model-picker UI bug, not real access. The model still appears in some pickers but returns a \\`currently unavailable\\` error. Anthropic now offers US-only inference at 1.1x pricing for workloads that must run inside the US, and an updated privacy policy with government-ID verification takes effect July 8 — the likely mechanism for a US-first restoration. **All other Claude models (Opus 4.8, Sonnet, Haiku) are unaffected; keep a fallback to Opus 4.8 wired in.** Mythos 5 remains restricted to Project Glasswing partners. Everything below describes the model as launched — read it as what to expect *if and when access returns*. See [Anthropic's statement](https://www.anthropic.com/news/fable-mythos-access)."

const FABLE_NEW_BANNER =
  "> **Status update — June 29, 2026: Mythos 5 partially restored; Fable 5 still offline (day 17).** The US government's June 12 export-control directive barred access to Fable 5 and Mythos 5 by any foreign national, and Anthropic disabled both worldwide. On **June 26**, Commerce Secretary Howard Lutnick concluded appropriate safeguards were in place, and the government cleared **Claude Mythos 5 — the stronger cybersecurity model — to be redeployed to a set of US organizations that operate and defend critical infrastructure.** Fable 5 remained banned for general users as of June 29, though Anthropic and outside observers expected US access could return within days. The model still appears in some pickers but returns a \\`currently unavailable\\` error. **All other Claude models (Opus 4.8, Sonnet, Haiku) are unaffected; keep a fallback to Opus 4.8 wired in.** Everything below describes the model as launched — read it as what to expect *if and when access returns*. See [Anthropic's statement](https://www.anthropic.com/news/fable-mythos-access)."

async function patchFableBanner() {
  const { data, error } = await sb.from('articles').select('body').eq('slug', 'claude-fable-5').maybeSingle()
  if (error || !data) {
    console.error('  ✗ claude-fable-5: could not read body', error?.message ?? 'not found')
    return
  }
  if (!data.body.includes(FABLE_OLD_BANNER)) {
    console.warn('  ⚠ claude-fable-5: old banner string not found — skipping patch (already updated or text changed)')
    return
  }
  const newBody = data.body.replace(FABLE_OLD_BANNER, FABLE_NEW_BANNER)
  const { error: upErr } = await sb.from('articles').update({ body: newBody }).eq('slug', 'claude-fable-5')
  if (upErr) console.error('  ✗ claude-fable-5 patch:', upErr.message)
  else console.log('  ✓ claude-fable-5 banner refreshed (Jun 29 status — Mythos partial restore)')
}

async function seed() {
  console.log('Seeding Batch 88 — June 2026 developer roundup + Fable banner refresh...\n')

  for (const a of articles) {
    const term = await getTermId(a.termSlug)
    if (!term) {
      console.error(`  ✗ Term not found: ${a.termSlug}`)
      continue
    }

    const payload = {
      slug:      a.slug,
      angle:     a.angle,
      title:     a.title,
      excerpt:   a.excerpt,
      body:      a.body,
      read_time: a.readTime,
      cluster:   a.cluster,
      term_id:   term.id,
      term_name: term.name,
      term_slug: a.termSlug,
      published: true,
    }

    const { error } = await sb.from('articles').upsert(payload, { onConflict: 'slug' })
    if (error) console.error(`  ✗ ${a.slug}: ${error.message}`)
    else console.log(`  ✓ ${a.slug}`)
  }

  await patchFableBanner()

  console.log('\nDone.')
}

seed().catch(console.error)
