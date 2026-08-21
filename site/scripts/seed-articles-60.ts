/**
 * Batch 60 — Anthropic announcements (April 14–16, 2026)
 *
 * 1. claude-opus-4-7
 *    Claude Opus 4.7 launched April 16. Same $5/$25 pricing as Opus 4.6.
 *    Better software engineering, vision (3.75MP), document reasoning.
 *    New xhigh effort level, task budgets (beta).
 *    Has API breaking changes vs Opus 4.6 — see article 2.
 *    Audience: developer, operator. Cluster: Models & Pricing.
 *
 * 2. migrating-to-claude-4-7
 *    Practical migration guide: 5 breaking changes in Opus 4.7,
 *    migration checklist, plus Sonnet 4 / Opus 4 retirement (June 15, 2026).
 *    Audience: developer. Cluster: Models & Pricing.
 *
 * 3. claude-code-parallel-agents
 *    Claude Code desktop redesign (April 14). New sidebar, parallel sessions,
 *    integrated terminal + diff viewer, drag-and-drop panes, side chat.
 *    Audience: developer. Cluster: Claude Code.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-60.ts
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

const ARTICLES = [

  // ── 1. Claude Opus 4.7 ───────────────────────────────────────────────────
  {
    termSlug: 'large-language-model',
    slug: 'claude-opus-4-7',
    angle: 'role',
    title: "Claude Opus 4.7: what's new and what the API changes mean",
    excerpt: "Anthropic's flagship model gets a significant upgrade — better software engineering, 3.75-megapixel vision, and a new xhigh effort level. Pricing is unchanged. There are API breaking changes versus Opus 4.6.",
    readTime: 8,
    cluster: 'Models & Pricing',
    body: `Claude Opus 4.7 launched April 16, 2026. It is Anthropic's most capable generally available model. Pricing is unchanged from Opus 4.6: $5 per million input tokens and $25 per million output tokens.

The model ID is \`claude-opus-4-7\`. It is available on the Claude API, Amazon Bedrock, Google Cloud Vertex AI, and Microsoft Foundry.

**Important before you upgrade:** Opus 4.7 has API breaking changes compared to Opus 4.6. If you use extended thinking with \`budget_tokens\`, set \`temperature\`, or use assistant prefills, your existing code will break. See [Migrating from Opus 4.6 to Opus 4.7](/articles/migrating-to-claude-4-7) for the full list.

## What improved

**Software engineering.** Benchmark results show a 13% improvement over Opus 4.6 on a 93-task coding suite, with 3x more successful resolutions on Rakuten-SWE-Bench. Anthropic reports it resolves specific tasks that both Opus 4.6 and Sonnet 4.6 could not solve. For developers using Claude in agentic coding workflows — writing PRs, debugging production issues, scaffolding projects — this is the most practically relevant improvement.

**Finance and document reasoning.** Scores 0.813 on General Finance modules, up from 0.767 for Opus 4.6. Code review recall improved by over 10% while maintaining precision.

**Vision.** Opus 4.7 accepts images up to 2,576 pixels on the long edge, which works out to roughly 3.75 megapixels — more than three times the previous limit of 1,568 pixels. This matters for reading dense screenshots, extracting data from charts, and computer use workflows. Full-resolution images consume up to 4,784 tokens each (compared to ~1,600 tokens on prior models), so re-budget accordingly if you send images. Coordinates returned by the model are 1:1 with actual image pixels — no scale-factor conversion is needed anymore.

**Long-context work.** The 1M token context window is available at standard pricing with no long-context premium, same as Opus 4.6.

## New things

**xhigh effort.** A new effort level between \`high\` and \`max\`. Anthropic recommends \`xhigh\` as the default for most coding and agentic use cases:

\`\`\`python
client.messages.create(
    model="claude-opus-4-7",
    max_tokens=64000,
    thinking={"type": "adaptive"},
    output_config={"effort": "xhigh"},
    messages=[{"role": "user", "content": "..."}],
)
\`\`\`

Effort levels available: \`low\`, \`medium\`, \`high\`, \`xhigh\`, \`max\`. Effort is more important for Opus 4.7 than for any prior model.

**Task budgets (public beta).** A new parameter that tells the model how many total tokens it has for an agentic loop — across thinking, tool calls, and output. The model sees a running countdown and uses it to prioritize work. Unlike \`max_tokens\` (a hard per-request ceiling the model doesn't see), task budgets are advisory: the model self-moderates.

\`\`\`python
output_config = {
    "effort": "high",
    "task_budget": {"type": "tokens", "total": 128000},
}
\`\`\`

Requires the beta header \`task-budgets-2026-03-13\`. Minimum value is 20k tokens. Use for agentic workloads where you want the model to scope itself; don't use where quality matters more than token count.

**Better agentic progress updates.** Opus 4.7 provides more regular status updates during long agentic runs. If you added scaffolding to force interim messages ("After every 3 tool calls, summarize progress"), try removing it first.

## Behavioral changes

These aren't API breaking changes, but they may affect your outputs:

**More literal instruction following.** Opus 4.7 interprets prompts more literally. It won't generalize an instruction from one item to another or infer requests you didn't make. Good for structured pipelines. May require prompt updates for open-ended tasks.

**More direct tone.** Less validation-forward phrasing, fewer softeners and emoji than Opus 4.6. If your product relies on a specific voice, re-test style prompts.

**Fewer subagents by default.** Steerable via prompting — give explicit guidance when subagents are desirable.

**Stricter effort calibration at low/medium.** At \`low\` effort, the model scopes narrowly to what was asked. If you see shallow reasoning on moderately complex tasks, raise effort to \`high\` or \`xhigh\`.

**New tokenizer.** Text consumes 1.0–1.35x as many tokens as on Opus 4.6, varying by content. This is a cost consideration, not a capability concern. Re-budget \`max_tokens\` and re-test client-side token estimates.

## Cybersecurity safeguards

Opus 4.7 adds real-time safeguards that block high-risk cybersecurity content. For legitimate security work — penetration testing, vulnerability research, red-teaming — apply to the [Cyber Verification Program](https://claude.com/form/cyber-use-case) for reduced restrictions.

## Who should upgrade

**Now:** If you are building new applications and weren't using the old extended thinking API. The upgrade path is simple: change the model name, omit sampling parameters, adopt adaptive thinking.

**After testing:** If you have existing Opus 4.6 prompts in production. The behavioral changes (literalism, tone, response length calibration) mean your outputs will shift. Test first.

**Migration docs:** [platform.claude.com/docs/en/about-claude/models/migration-guide](https://platform.claude.com/docs/en/about-claude/models/migration-guide#migrating-to-claude-opus-4-7)

The practical checklist and code examples are in [Migrating from Opus 4.6 to Opus 4.7](/articles/migrating-to-claude-4-7).`,
  },

  // ── 2. Migrating to Claude Opus 4.7 ─────────────────────────────────────
  {
    termSlug: 'large-language-model',
    slug: 'migrating-to-claude-4-7',
    angle: 'process',
    title: 'Migrating from Claude Opus 4.6 to Opus 4.7: the breaking changes',
    excerpt: "Opus 4.7 has five API breaking changes that will return 400 errors on existing code. Here's each one, the fix, and the full migration checklist. Also: Sonnet 4 and Opus 4 retire June 15, 2026.",
    readTime: 7,
    cluster: 'Models & Pricing',
    body: `Claude Opus 4.7 launched April 16, 2026. Migrating from Opus 4.6 is mostly a model name swap — but there are five API breaking changes that will return 400 errors if you don't address them first.

This article covers each change and what to replace it with, followed by a complete checklist.

## Breaking change 1: Extended thinking removed

**Before (Opus 4.6):**

\`\`\`python
client.messages.create(
    model="claude-opus-4-6",
    max_tokens=64000,
    thinking={"type": "enabled", "budget_tokens": 32000},
    messages=[...],
)
\`\`\`

**After (Opus 4.7):**

\`\`\`python
client.messages.create(
    model="claude-opus-4-7",
    max_tokens=64000,
    thinking={"type": "adaptive"},
    output_config={"effort": "xhigh"},
    messages=[...],
)
\`\`\`

\`thinking: {type: "enabled", budget_tokens: N}\` returns a 400 error on Opus 4.7. Switch to adaptive thinking and use the effort parameter to control thinking depth.

Adaptive thinking is off by default — requests without a \`thinking\` field run without thinking, matching Opus 4.6 behavior. Set \`thinking: {type: "adaptive"}\` explicitly to enable it.

Available effort levels: \`low\`, \`medium\`, \`high\`, \`xhigh\` (new), \`max\`. For most coding and agentic work, start with \`xhigh\`.

## Breaking change 2: Sampling parameters removed

Setting \`temperature\`, \`top_p\`, or \`top_k\` to any non-default value returns a 400 error. Remove these parameters entirely:

\`\`\`python
# Remove these from Opus 4.7 requests:
# temperature=0.7
# top_p=0.9
# top_k=40
\`\`\`

If you were using \`temperature=0\` for determinism: note that it never guaranteed identical outputs on prior models. Use structured outputs or explicit formatting instructions in your system prompt instead.

## Breaking change 3: Thinking content omitted by default

Thinking blocks still appear in the response, but their \`thinking\` field is empty on Opus 4.7 unless you explicitly opt in. This is a silent change from Opus 4.6.

If your product streams reasoning to users or displays thinking progress, add \`display: "summarized"\`:

\`\`\`python
thinking = {
    "type": "adaptive",
    "display": "summarized",  # add this to restore visible thinking
}
\`\`\`

Without this, users will see a pause before output begins instead of reasoning progress. The default on Opus 4.7 is \`"omitted"\`.

## Breaking change 4: New tokenizer

Opus 4.7 uses a new tokenizer that consumes 1.0–1.35x as many input tokens as Opus 4.6, depending on content type. This isn't a breaking change in the API sense — requests won't error — but it will affect costs and may cause failures if your code assumes specific token counts or has tight \`max_tokens\` budgets.

What to do:
- Increase \`max_tokens\` to give headroom (Anthropic recommends starting at 64k for \`xhigh\`/\`max\` effort)
- Re-test any client-side token-counting code or character-to-token ratio assumptions
- Use the Token Counting endpoint (\`/v1/messages/count_tokens\`) to verify against Opus 4.7 specifically

## Breaking change 5: Prefill removal (carried from Opus 4.6)

Prefilling assistant messages (starting the \`assistant\` turn with your own text) returns a 400 error. This was introduced in Opus 4.6 and still applies.

Replace prefills with structured outputs or system prompt instructions:

\`\`\`python
# Before (breaks on 4.6+):
messages=[
    {"role": "user", "content": "List the items"},
    {"role": "assistant", "content": "["},  # prefill
]

# After:
# Use output_config.format for structured JSON
output_config={"format": {"type": "json_schema", "json_schema": {...}}}
\`\`\`

## Migration checklist

- [ ] Update model name: \`claude-opus-4-6\` → \`claude-opus-4-7\`
- [ ] Remove \`temperature\`, \`top_p\`, \`top_k\` from all request payloads
- [ ] Replace \`thinking: {type: "enabled", budget_tokens: N}\` with \`thinking: {type: "adaptive"}\` + \`output_config: {effort: "xhigh"}\`
- [ ] Remove any assistant-message prefills; replace with structured outputs or prompt instructions
- [ ] If your UI displays thinking content: add \`thinking.display: "summarized"\`
- [ ] Re-benchmark end-to-end cost and latency under the new tokenizer
- [ ] Raise \`max_tokens\` to 64k+ if using \`xhigh\` or \`max\` effort
- [ ] Re-test any client-side token-count estimations
- [ ] If you send images: re-budget for high-resolution support (up to 3x more tokens per image); downsample if you don't need the full resolution
- [ ] Review prompts for behavioral changes: response length calibration, more literal instruction following, fewer subagents
- [ ] If your product does legitimate security work: apply to the [Cyber Verification Program](https://claude.com/form/cyber-use-case)

## Automated migration via Claude Code

In Claude Code, run \`/claude-api migrate\` to invoke the bundled Claude API skill:

\`\`\`
/claude-api migrate this project to claude-opus-4-7
\`\`\`

The skill applies the model ID swap, parameter removals, prefill replacement, and effort calibration across your codebase, then produces a checklist of items to verify manually.

## Sonnet 4 and Opus 4 retire June 15, 2026

Alongside the Opus 4.7 launch, Anthropic announced that the original Sonnet 4 and Opus 4 models are retiring:

- \`claude-sonnet-4-20250514\` → retire June 15, 2026 → migrate to \`claude-sonnet-4-6\`
- \`claude-opus-4-20250514\` → retire June 15, 2026 → migrate to \`claude-opus-4-7\`

If you are still on the original Sonnet 4 model ID, the migration to Sonnet 4.6 is a model name swap with no breaking changes. Sonnet 4.6 supports extended thinking, the 1M token context window, and all tools.

Check your codebase for hardcoded model IDs with the \`-20250514\` suffix and update them before June 15.

## Full migration guide

[platform.claude.com/docs/en/about-claude/models/migration-guide](https://platform.claude.com/docs/en/about-claude/models/migration-guide#migrating-to-claude-opus-4-7)`,
  },

  // ── 3. Claude Code parallel agents desktop redesign ──────────────────────
  {
    termSlug: 'ai-agent',
    slug: 'claude-code-parallel-agents',
    angle: 'process',
    title: 'Parallel agents in Claude Code: the desktop redesign',
    excerpt: "Claude Code's desktop app was rebuilt for running multiple coding tasks at once. A new sidebar manages sessions across repos, an integrated terminal and diff viewer replace external tools, and side chat lets you branch conversations without interrupting ongoing work.",
    readTime: 6,
    cluster: 'Claude Code',
    body: `Claude Code's desktop app was redesigned in April 2026 to support running agents across multiple projects simultaneously. The previous design assumed you were working in one place at a time. This one assumes you are routing work across several repos and switching as results come in.

Here's what changed.

## The sidebar

The main change is a session sidebar that replaces the previous single-session view.

You can filter sessions by status (running, waiting, completed), by project, or by environment. Sessions can be grouped by project — useful when you have multiple branches of the same codebase in flight. When a session's pull request merges or closes on GitHub, the session automatically archives and leaves the active list.

This means you can kick off work on three different repos — a bug fix, a feature branch, and a dependency update — and move between them as each one needs attention instead of waiting for one to complete before starting the next.

## Side chat

A new side chat feature (\`⌘ + ;\` on macOS, \`Ctrl + ;\` on Windows/Linux) lets you branch a conversation without pausing the main task.

This is useful for asking questions mid-session or exploring an alternative approach while the primary agent is still running. The side chat runs as a separate conversation in the same project context; it does not interrupt the main session.

## Integrated tools

Three tools that previously required switching out of the app are now built in:

**Terminal.** Run test suites, build commands, or any shell command directly inside the app. The terminal is attached to the current session's working directory.

**File editor.** For spot edits — fixing a typo the agent missed, tweaking a config file — without opening your external editor.

**Diff viewer.** Rebuilt specifically for large changesets. Previous versions of the diff viewer struggled with PRs involving hundreds of files. The new one handles them.

**Preview pane.** Renders HTML files, PDFs, and locally running app servers. For frontend work, you can preview the running app in the same window where the agent is building it.

All panes are drag-and-drop. Resize and reorder them into whatever layout works for the task.

## View modes

Three verbosity levels control what you see during a session:

- **Verbose:** Every tool call, every file read, every decision the agent makes
- **Normal:** Tool calls and significant actions, without the low-level detail
- **Summary:** The agent's final status updates only, hiding most of the working trace

Switch modes mid-session with \`Ctrl+O\`. If you are managing multiple sessions at once, Summary mode across the background ones and Verbose on the active one is a practical starting point.

## SSH support on macOS

The desktop app now supports SSH for macOS in addition to the existing Linux support. You can connect to a remote server and run Claude Code sessions there directly from the desktop app.

## Organizational plugins

For enterprise teams, centrally managed plugins work the same way in the desktop app as in terminal sessions. Administrators can push plugin configurations that apply to the desktop app without requiring each developer to set them up individually.

## What to expect workflow-wise

The practical shift is from sequential to parallel. Instead of starting a task, waiting, reviewing, starting the next one — you queue several things at once and review as they complete.

The sidebar and session filtering are designed around that cycle. The most useful pattern is probably: kick off three or four tasks at the start of a work session, switch to something else, and return to the Claude Code app when a session has output to review.

Side chat handles the micro-interruptions — questions and small diversions — without forcing you to interrupt a running session.

**Getting the update:** The desktop app updates automatically. Version 2.1.111 includes Opus 4.7 support and the new \`xhigh\` effort level alongside this redesign.

Official blog post: [claude.com/blog/claude-code-desktop-redesign](https://claude.com/blog/claude-code-desktop-redesign)`,
  },

]

async function seed() {
  console.log('Seeding Batch 60 — Claude Opus 4.7 + migration guide + parallel agents desktop...\n')

  for (const a of ARTICLES) {
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

    if (error) {
      console.error(`  ✗ ${a.slug}: ${error.message}`)
    } else {
      console.log(`  ✓ ${a.slug}`)
    }
  }

  console.log('\nDone.')
}

seed().catch(console.error)
