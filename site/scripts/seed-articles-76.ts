/**
 * Batch 76 — Anthropic announcements: M365 full Office suite + Managed Agents update (May 6–7, 2026)
 *
 * 1. claude-for-microsoft-365
 *    On May 7, 2026 Anthropic shipped Claude for Excel, PowerPoint, and Word at GA,
 *    plus Claude for Outlook in public beta. Cross-app context now carries between
 *    apps (Excel assumptions update linked PPT/Word; emails open straight into Word).
 *    Distinct from claude-for-word (April 11) which was the first Office add-in alone.
 *    PRODUCTIVITY_SLUGS. Cluster: Features & Updates. Angle: update.
 *
 * 2. claude-managed-agents-multiagent
 *    On May 6, 2026 Anthropic shipped three new Managed Agents capabilities:
 *    multiagent sessions (public beta), outcomes (public beta), and dreaming (research preview).
 *    Multiagent: lead agent delegates to specialists on shared FS with persistent event memory.
 *    Outcomes: rubric-graded self-correction, +8.4% docx, +10.1% pptx success.
 *    Dreaming: scheduled cross-session memory curation — research preview only.
 *    DEV_SLUGS. Cluster: Claude API. Angle: update.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-76.ts
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
    slug: 'claude-for-microsoft-365',
    angle: 'update',
    title: 'Claude for Microsoft 365: Excel, PowerPoint, Word, and Outlook',
    excerpt: "On May 7, 2026 Anthropic shipped Claude as add-ins inside Excel, PowerPoint, and Word at general availability, with Outlook in public beta. The headline is cross-app context — assumptions in Excel now propagate into linked PowerPoint slides and Word memos, and an email in Outlook can open straight into a draft in Word.",
    readTime: 7,
    cluster: 'Features & Updates',
    audience: ['operator'],
    termSlug: 'connector',
    body: `Anthropic shipped Claude for Word as an Office add-in on April 11, 2026. That was a single-app integration: open Word, summon Claude in the sidebar, drop in changes as tracked edits, accept or reject. Useful, but bounded.

The May 7, 2026 release closes the loop on the rest of Office:

- **Claude for Excel** — GA
- **Claude for PowerPoint** — GA
- **Claude for Word** — GA (was beta from April)
- **Claude for Outlook** — public beta

The interesting piece is not that all four apps now have a Claude sidebar. It is that they share context.

## What "cross-app context" actually does

The four add-ins share a single conversation thread per Microsoft 365 user. When you talk to Claude in Excel about a financial model, then open the PowerPoint deck where that model lives, Claude knows what assumptions you just changed. When you change a number in Excel, the linked sentence in the Word memo updates with it.

A concrete walk-through from the launch post:

1. Outlook surfaces an email from a customer raising a billing question.
2. You ask Claude to triage. Claude opens the attached invoice in Word and drafts a response memo using the relevant pricing terms from your Excel rate sheet.
3. The email reply is staged in Outlook with the right recipients and the memo attached.

Each step is something Claude could already do app-by-app. The new behavior is: state carries across apps without copy-pasting context every time.

## What's actually in each add-in

**Excel.** Build sheets from a description; explain what a complex sheet does; propose formulas; debug broken references; generate charts; pivot the same data into a new analysis. The add-in respects named ranges and links — change a value in a model and dependent sheets, charts, and downstream PPT/Word references update.

**PowerPoint.** Generate decks from a brief; rewrite slides without breaking templates; reformat content into your company's master; pull updated numbers from the linked Excel without rebuilding the deck. Slide layout follows the active template, not a generic Claude default.

**Word.** Draft from a prompt; restructure long documents; insert tracked changes you can accept or reject; generate appendix tables from Excel data. Same as the April beta, now GA.

**Outlook (beta).** Sort the inbox by urgency; draft replies with recipients and subject prefilled; check attendee availability before sending a meeting invite; summarize long threads. The add-in pre-stages a draft — you still hit send.

## Plan availability

The add-ins are available on **paid plans** for Mac and Windows. Outlook is in beta on all paid plans (Pro, Team, Max, Enterprise).

If your org runs Microsoft 365 with admin-controlled add-ins, your IT admin enables Claude for Microsoft 365 from the Microsoft admin center via Microsoft AppSource. End users can't enable it themselves on managed tenants.

## What admins get

Three controls worth knowing:

- **OpenTelemetry export.** IT can stream prompts and tool calls to a custom collector — useful for audit, not just analytics.
- **Analytics API.** Per-user, per-app, per-day activity. Same shape as the existing [Claude Code Analytics API](/articles/claude-admin-controls-2026), now extended to Office.
- **Gateway routing.** Traffic can route through your own LLM gateway to Claude on Amazon Bedrock, Google Cloud Vertex AI, or Microsoft Foundry — useful for orgs that already settled on a deployment surface and don't want a second one.

For larger rollouts, this is the integration that makes a "no shadow AI" position defensible: if Claude lives inside the Office surface your team already uses, you don't need a separate browser tab as the primary surface.

## How this compares to Microsoft 365 Copilot

Copilot lives in the same surface (Word, Excel, PowerPoint, Outlook). Practical differences as of this release:

- **Model.** Claude add-ins use Claude (Opus 4.7 or Sonnet 4.6 depending on the task). Copilot uses OpenAI's GPT-5.x.
- **Cross-app context.** Both products do this. Copilot's is tied to Microsoft Graph; Claude's is tied to a single user thread.
- **Pricing.** Copilot is $30/user/month on top of M365. Claude for M365 is included in your Claude paid plan (Pro is $20/month for individuals; Team and Enterprise vary).
- **Models.** Microsoft Foundry now also serves Claude models, so an admin can run both Copilot and Claude side-by-side without billing duplication.

The honest read: most teams that have made the M365 + Copilot bet won't switch. Teams that prefer Claude — or want a non-OpenAI model in the same surface for evaluation, redundancy, or output quality — now have a path that doesn't require leaving the Office apps.

## What this is not

A few things this release does not do, that the marketing language might suggest:

- **It's not a replacement for Claude Code.** The Office add-ins are for documents and email, not source code or terminal work. If your team has been using Claude Code, that flow is unchanged.
- **It's not a connector.** The other May add-ins (Granola, Linear, etc.) are connectors — Claude calls them. The Office add-ins are the inverse — Claude is hosted inside Office and calls Office.
- **It's not yet on iOS or Android.** Mac and Windows desktop only. Mobile is on the roadmap but not announced.

## What to do this week

If you already use Claude:

1. Enable the four add-ins from your Office app's Add-ins panel (Mac/Windows).
2. Try the Outlook → Word → Excel → PowerPoint loop on one real task. The cross-app context only matters if you actually use it.
3. If you're an admin, enable the OpenTelemetry export before users start. Easier to set up clean logging on day one than to retrofit it later.

If you don't use Claude yet but live in M365: this is the lowest-friction first deployment surface. The team doesn't need to learn a new app — Claude shows up in the Office surface they already open.

## Related reading

- [Claude for Word](/articles/claude-for-word) — the original April 11 announcement, now superseded for Excel/PPT/Outlook context
- [Claude + Google Sheets](/articles/claude-plus-google-sheets) — the equivalent flow if your team is on Workspace
- [Claude admin controls 2026](/articles/claude-admin-controls-2026) — the broader admin surface this slots into

---

*Source: [Collaborate with Claude across Excel, PowerPoint, Word and Outlook](https://claude.com/blog/collaborate-with-claude-across-excel-powerpoint-word-and-outlook), Anthropic blog, May 7, 2026.*`,
  },
  {
    slug: 'claude-managed-agents-multiagent',
    angle: 'update',
    title: 'Claude Managed Agents update: multiagent sessions, outcomes, and dreaming',
    excerpt: "On May 6, 2026 Anthropic shipped three new capabilities for Claude Managed Agents: multiagent sessions (public beta), outcomes (public beta), and dreaming (research preview). Multiagent lets a lead agent delegate to specialist subagents on a shared filesystem; outcomes turns a rubric into a self-correction loop; dreaming lets an agent review its past sessions overnight and curate its memory.",
    readTime: 9,
    cluster: 'Claude API',
    audience: ['developer'],
    termSlug: 'ai-agent',
    body: `Claude Managed Agents shipped at GA on April 8, 2026. Memory followed on April 23. The May 6, 2026 release adds three features that turn the product from a single-agent harness with state into something closer to a coordinated team.

All three sit under the same beta header — \`managed-agents-2026-04-01\` — that you already use for the rest of the API.

## Multiagent sessions (public beta)

A multiagent session has a **lead agent** and one or more **specialist subagents**. The lead delegates work; the subagents run in parallel; everything writes to a shared filesystem and a shared event log.

The shape, in pseudo-API terms:

\`\`\`json
POST /v1/managed-agents/sessions
{
  "agent_id": "agent_lead_xxx",
  "subagents": [
    { "agent_id": "agent_research_xxx", "name": "research" },
    { "agent_id": "agent_writer_xxx",   "name": "writer"   },
    { "agent_id": "agent_reviewer_xxx", "name": "reviewer" }
  ],
  "shared_filesystem": true,
  "memory_stores": ["mem_xxx"]
}
\`\`\`

The lead receives the user request. It decides which subagent to call, what filesystem path each one writes to, and how the outputs feed each other. Each subagent gets its own context window and tool set. The shared filesystem (mounted at \`/mnt/shared/\`) is the integration surface.

Three details that matter:

**Different models per agent.** A lead on Opus 4.7 can dispatch to a Haiku 4.5 specialist for a fast, cheap subtask. The token bill is per-agent.

**Persistent event memory.** Every session writes to an event stream. A subagent that ran an hour ago can be inspected — what it read, what it wrote, what tool it called. Useful for debugging and for the agent itself to read back what its peers did.

**Console visibility.** The Claude Console shows the full agent tree per session: which agent fired what, in what order, with what rationale. This is the difference between "an agent did something I can't explain" and "I can see exactly where the run forked."

When this matters: you have a workflow that is too long for one context window, or that benefits from specialization (research vs. writing vs. review) more than from monolithic intelligence. When it doesn't: a single agent with memory and tools is enough. Don't reach for multiagent for tasks Opus 4.7 alone can finish in one session.

## Outcomes (public beta)

Outcomes is the API surface for **rubric-graded agents**. You define what success looks like; a separate grader scores the agent's output; if the score is below threshold, the agent retries with the grader's notes.

\`\`\`json
POST /v1/managed-agents/outcomes
{
  "name": "deck_quality",
  "rubric": [
    { "criterion": "Each slide has one clear claim",        "weight": 0.3 },
    { "criterion": "Numbers are sourced from the brief",    "weight": 0.4 },
    { "criterion": "Tone is appropriate for executive aud.", "weight": 0.3 }
  ],
  "passing_score": 0.80,
  "max_attempts": 3
}
\`\`\`

You attach the outcome to a session. The agent runs; the grader evaluates the output in its own context window (so the grader doesn't share the agent's blind spots); if the score is below the threshold, the grader's structured feedback is fed back into the next attempt.

Anthropic reports +8.4% on .docx generation success and +10.1% on .pptx generation success against their internal benchmark, with up to 10 points of improvement on more complex tasks. Concrete and modest — not the headline number a vendor would lead with if they were inflating it.

When this matters: the task has a clear quality definition (a brief, a spec, a contract) and the cost of a wrong output is higher than a few extra grader calls. When it doesn't: open-ended creative work where the rubric is the hard part.

A practical note: the grader is a separate billed call. For high-volume jobs, profile the cost. A 3-attempt rubric with a Sonnet 4.6 grader on a Haiku 4.5 worker can still be cheaper than a single Opus 4.7 call — but you have to measure.

## Dreaming (research preview)

Dreaming is the most speculative of the three. Per the announcement: "a scheduled process that reviews your agent sessions and memory stores, extracts patterns, and curates memories so your agents improve over time."

What this means in practice: between sessions (typically overnight), the dreaming process reads your agent's session history and memory stores. It pulls out patterns — recurring user preferences, converged workflows, recurring mistakes — and writes them back to the memory stores. Next session, the agent has a higher-signal memory to read from.

This is research preview, not public beta. You request access; not everyone gets it. The interface, the cadence, and the reliability characteristics are likely to change.

Two reasons to care anyway:

**It is a different memory model.** Existing memory ([covered here](/articles/claude-managed-agents-memory)) is write-during-session. Dreaming is curate-between-sessions. They compose: an agent writes facts during the day; dreaming compresses them at night; the compressed version is what next-day's agent reads.

**It ships in the standard product surface.** Unlike a separate "long-term learning" SDK, this is just another control on the existing memory store. Once it leaves research preview, it should be a small change for teams already using memory.

Two honest cautions: this is the feature most likely to change shape between research preview and public beta, and the value depends on whether your sessions actually have patterns to extract. A single-purpose agent that does one task the same way every time has nothing to dream about.

## How to think about all three together

A practical mental model:

- **Memory** is per-agent state.
- **Outcomes** is per-task quality control.
- **Dreaming** is per-agent learning over time.
- **Multiagent** is task decomposition across agents.

Most production agent setups don't need all four. The progression most teams will follow:

1. Single agent with tools — start here.
2. Add memory when the agent forgets things between sessions that the user shouldn't have to repeat.
3. Add outcomes when output quality on long-tail edge cases drops below an acceptable bar.
4. Add multiagent when one context window or one model class is genuinely the constraint.
5. Wait on dreaming until it leaves research preview.

The features compose well because they share the same primitives — sessions, events, memory stores, and the existing beta header. You don't need a parallel SDK to use them.

## Related reading

- [Claude Managed Agents](/articles/claude-managed-agents) — the original April 8 launch
- [Claude Managed Agents memory](/articles/claude-managed-agents-memory) — the memory store API this update builds on
- [Multi-agent orchestration basics](/articles/multi-agent-orchestration-basics) — the conceptual framing for when multiagent helps
- [Multi-agent failure handling](/articles/multi-agent-failure-handling) — what to plan for when subagents break

---

*Source: [New in Claude Managed Agents: dreaming, outcomes, and multiagent orchestration](https://claude.com/blog/new-in-claude-managed-agents), Anthropic blog, May 6, 2026. Public beta features available under the \`managed-agents-2026-04-01\` beta header.*`,
  },
]

async function seed() {
  console.log('Seeding Batch 76 — M365 full suite + Managed Agents update...\n')

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

    if (error) {
      console.error(`  ✗ ${a.slug}: ${error.message}`)
    } else {
      console.log(`  ✓ ${a.slug}`)
    }
  }

  console.log('\nDone.')
}

seed().catch(console.error)
