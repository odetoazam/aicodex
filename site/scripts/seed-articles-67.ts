/**
 * Batch 67 — Claude Code Agent Teams
 *
 * 1. claude-code-agent-teams
 *    When to use Agent Teams (and when not to). Decision guide: sub-agents vs teams,
 *    setup cost, rules that prevent chaos, display modes, plan approval, known limits.
 *    Sourced from official docs + AI Collective Hampton Roads webinar.
 *    DEV_SLUGS. Cluster: Claude Code.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-67.ts
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
    slug: 'claude-code-agent-teams',
    angle: 'process',
    title: 'Agent Teams: When Parallel Agents Actually Help (And When They Don\'t)',
    excerpt: "Agent Teams let you run multiple Claude Code instances with distinct roles — a frontend dev, a backend dev, a QA reviewer — all coordinating in parallel. There's a real setup cost and most tasks don't need it. Here's how to tell when it's worth it.",
    readTime: 7,
    cluster: 'Claude Code',
    audience: ['developer', 'operator'],
    termSlug: 'ai-agent',
    body: `Agent Teams in Claude Code let you spawn multiple AI agents with distinct roles — a frontend dev, a backend dev, a QA reviewer — all working in parallel on the same project. There's real overhead, and most tasks don't need it.

## The Core Idea (And the Key Distinction)

Before diving in: Agent Teams are not the same as subagents.

When you chat with Claude on the web or in the desktop app, it sometimes spawns subagents to parallelize work. Those subagents work independently and only report results back to the main agent — they never talk to each other. You can't message them directly, and you can't see what they're doing.

Agent Teams are different. Teammates each have their own context window, **communicate directly with each other** (not just through a lead), share a task list they can claim and hand off work through, and can be messaged individually by you at any time.

That inter-agent communication is what makes them worth the setup cost for complex tasks. If you just need parallelism where results get piped back to a single agent, subagents are lighter and cheaper.

| | Subagents | Agent Teams |
|---|---|---|
| **Communication** | Report back to main agent only | Teammates message each other directly |
| **Coordination** | Main agent manages all work | Shared task list, self-coordination |
| **Best for** | Focused tasks where only the result matters | Complex work requiring discussion and collaboration |
| **Token cost** | Lower — results summarized back | Higher — each teammate is a separate Claude instance |

## The Setup Tax

Agent Teams require:

- Claude Code v2.1.32 or later (\`claude --version\` to check)
- Linux or macOS (Windows split-pane mode doesn't work in Windows Terminal — in-process mode does)
- Pro or Max subscription
- The feature flag \`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1\` set in settings.json — disabled by default

\`\`\`json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
\`\`\`

These are experimental, with known limitations around session resumption and task coordination.

## When Agent Teams Win

**The work needs parallel exploration, not just parallel execution.** If you have three separate modules to build that are fully independent, three separate Claude Code sessions (or Git worktrees) might be simpler.

Where Agent Teams genuinely outperform other approaches:

**Research with competing hypotheses.** Three teammates each investigating a different root cause for a bug, explicitly tasked with disproving each other's theories. This beats sequential investigation because sequential investigation anchors — once one theory is explored, the next tends toward it. The theory that survives a three-way debate is much more likely to be the real cause.

**Code review with distinct lenses.** A security reviewer, a performance reviewer, and a test-coverage reviewer working the same PR simultaneously. Each applies a different filter with no overlap. The lead synthesizes findings after they finish.

**Cross-layer coordination.** Frontend, backend, and test coverage each owned by a different teammate. They finish in parallel, communicate about integration points, and hand off.

**New modules with clear boundaries.** Teammates own separate files. Conflict risk is low, parallelism benefit is high. Works best when each teammate can define what "done" looks like independently.

The common pattern: tasks are separable, the work takes 1+ hours, and the team genuinely benefits from talking to each other — not just running in parallel.

## When They Don't

Single-agent Claude Code or the desktop app wins here:

- **Quick tasks under 30 minutes** — coordination overhead eats the gain
- **Same-file edits** — two teammates touching the same file will overwrite each other
- **Sequential work** — when task B depends on task A, parallelism doesn't help
- **Exploratory or undefined work** — teams work best when the structure is clear upfront
- **Routine scripts and one-offs** — use the desktop app; no setup required

Also: **one team per session, no nested teams**. A lead can only manage one team at a time. Teammates can't spawn their own sub-teams. Clean up the current team before starting a new one.

## The Rules That Actually Matter

Teams break silently without constraints. If you don't define ownership upfront:

- Teammates overwrite each other's files
- Tasks get claimed twice or not at all
- No one knows what "done" means

The official approach: give the lead criteria in your spawn prompt.

- Define file ownership explicitly: "The frontend teammate owns \`src/components/\`, backend owns \`src/api/\`"
- Tell the lead what to approve or reject: "Only approve plans that include test coverage"
- Use hooks (\`TeammateIdle\`, \`TaskCompleted\`) to enforce quality gates at the task level

The task system has built-in dependency management — a task with unresolved dependencies can't be claimed until those are done — but only if you structure the tasks correctly.

## Team Size and Task Sizing

**3–5 teammates** is the right range for most workflows. The sweet spot for task ratio is **5–6 tasks per teammate**. That keeps everyone productive without excessive coordination.

- Too few tasks: teammates go idle, no parallelism gain
- Too many: coordination overhead and conflict risk
- Too small tasks: setup cost exceeds benefit
- Too large tasks: teammates work for long stretches without check-ins, mistakes compound

If the lead isn't breaking work into enough pieces, tell it to split tasks smaller. If you have 15 independent tasks, 3 teammates (5 tasks each) is usually better than 15 teammates (1 task each).

## Display Modes: In-Process vs Split Panes

**In-process** (default if you're not already in tmux): all teammates run inside your main terminal. Press Shift+Down to cycle through teammates and type to send a message. Wraps back to the lead after the last teammate. Works in any terminal, no extra setup.

**Split panes**: each teammate gets its own pane. You see all of them at once and click into any pane to interact directly. Requires tmux or iTerm2 with the \`it2\` CLI.

Split-pane mode doesn't work in VS Code's integrated terminal, Windows Terminal, or Ghostty. In-process works everywhere.

To force in-process for a session:

\`\`\`bash
claude --teammate-mode in-process
\`\`\`

## Model Choice Per Teammate

You can specify the model per teammate — it doesn't have to be Opus:

\`\`\`
Create a team with 4 teammates to refactor these modules in parallel.
Use Sonnet for each teammate.
\`\`\`

Smaller models cost less per teammate, which matters when token costs scale with each active context window. For research or review tasks, Sonnet may be sufficient. Haiku for lightweight verification.

## Plan Approval

For risky or complex work, you can require a teammate to plan before implementing:

\`\`\`
Spawn an architect teammate to refactor the authentication module.
Require plan approval before they make any changes.
\`\`\`

The teammate works in read-only mode, writes a plan, and sends it to the lead for approval. The lead can approve or reject with feedback. If rejected, the teammate revises and resubmits. Only after approval does implementation begin.

You control what the lead approves. Give it criteria in your prompt: "reject any plan that touches the database schema" and the lead applies that judgment autonomously.

## Known Limitations

These matter in practice:

- **No session resumption**: \`/resume\` and \`/rewind\` don't restore in-process teammates. If you close and reopen, the lead may try to message teammates that no longer exist. Spawn new ones.
- **Task status can lag**: teammates sometimes fail to mark tasks complete, which blocks dependent tasks. If something's stuck, update the status manually or tell the lead to nudge the teammate.
- **Lead is fixed**: whoever creates the team is the lead for its lifetime. You can't promote a teammate.
- **Shutdown isn't instant**: teammates finish their current action before stopping. Factor this in before force-quitting anything.
- **Permissions set at spawn**: all teammates start with the lead's permission mode. You can change individual modes after spawning, but not at creation time.

## The Real Win

Speed isn't the primary argument for Agent Teams. A well-prompted single agent with subagents often gets you there faster for most tasks.

The real argument is **structured parallel exploration** — specifically when you want multiple agents examining the same problem from different angles, talking to each other, and converging on a result that survived scrutiny. Parallel code review and competing-hypotheses debugging are where teams genuinely outperform everything else.

For everything else: start with Claude desktop or a single Claude Code session. If you hit parallelism limits, use Git worktrees with separate sessions. Reach for Agent Teams when inter-agent communication is what you actually need.

## Further reading

Official documentation: [Claude Code Agent Teams](https://code.claude.com/docs/en/agent-teams)`,
  },
]

async function seed() {
  console.log('Seeding Batch 67 — Claude Code Agent Teams...\n')

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
