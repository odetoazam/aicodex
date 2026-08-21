/**
 * Batch 77 — May 2026 AI super-app wave
 * claude-agents-command      — new `claude agents` terminal multi-agent mode
 * karpathy-joins-anthropic   — Andrej Karpathy joins Anthropic: what it signals
 * ai-platform-landscape-2026 — Claude vs Codex vs Cursor: choosing your platform
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-77.ts
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
  {
    termSlug: 'claude-code',
    slug: 'claude-agents-command',
    angle: 'update',
    title: 'claude agents: run multiple tasks in parallel from the terminal',
    excerpt: "Anthropic's new `claude agents` CLI mode lets you fire off independent tasks simultaneously and navigate between them — turning Claude Code into a proper multi-agent terminal environment.",
    readTime: 5,
    tier: 2,
    cluster: 'Claude Code',
    body: `For most of Claude Code's life, the terminal interface was linear. You ran \`claude\`, you had a conversation that worked downward, you waited for one task to finish before starting another. It was powerful — but one lane.

That changed with \`claude agents\`.

## What it is

Type \`claude agents\` in your terminal instead of \`claude\` and you enter a different mode entirely. Instead of one chat, you get a panel where each task you submit runs as an independent agent. You can have five things running at once.

The navigation is keyboard-driven: arrow keys to scroll between agents, right to open a chat and see what it's doing, left to go back to the overview. Each agent shows its working status — you can glance across all of them like a dashboard.

## Why this matters

The practical implication: you can now run parallel research, parallel builds, or any set of tasks that don't depend on each other — without waiting.

Old workflow: submit task → wait → review → submit next task.

New workflow: submit five tasks → while they run, check in on each → review results as they complete.

For anyone running Claude Code seriously — research pipelines, multi-step dev tasks, content generation at scale — this is a meaningful throughput change. The bottleneck shifts from "waiting for Claude" to "how fast can you review and redirect."

## How it works with sub-agents

If you've already built custom sub-agents (specialized agents for specific research domains, writing tasks, coding patterns), they work inside \`claude agents\` exactly as before. Each agent session can use whatever sub-agents you've wired up. \`claude agents\` is the orchestration layer on top: you're dispatching tasks, not micromanaging how each one runs.

## What it's not

This isn't the same as Claude Code's desktop parallel sessions sidebar — that's a GUI feature for running multiple project sessions side-by-side in the desktop app. \`claude agents\` is the terminal-native equivalent: same idea, different surface, no GUI required.

If you're running Claude Code headless, in SSH sessions, or just prefer the terminal, \`claude agents\` is how you get parallel work without switching to the desktop app.

## Getting started

If you have Claude Code installed and updated:

\`\`\`bash
claude agents
\`\`\`

From there, type a task and press enter. It queues as an agent. Add more tasks — they all run concurrently. Use arrow keys to navigate. Right arrow on any agent opens it so you can see its progress or add a follow-up.

The most useful starting pattern: fire off 3–5 independent research or build tasks while you work on something else. Check back when they complete.

---

*For the broader Claude Code setup — CLAUDE.md, hooks, project structure — [Claude Code project setup](/articles/claude-code-project-setup) covers the foundation. For knowing when to use agent teams vs. sequential tasks, [when to use Claude Code agent teams](/articles/claude-code-agent-teams) has the decision framework. For the desktop parallel sessions experience, [Claude Code parallel agents](/articles/claude-code-parallel-agents) covers the GUI version.*`,
  },

  {
    termSlug: 'anthropic',
    slug: 'karpathy-joins-anthropic',
    angle: 'update',
    title: 'Andrej Karpathy joins Anthropic — what it signals',
    excerpt: "The foremost AI educator and ex-Tesla/OpenAI researcher joined Anthropic in May 2026 to get back to R&D. Here's what the hire suggests about where Claude is heading.",
    readTime: 4,
    tier: 2,
    cluster: 'Features & Updates',
    body: `On May 19, 2026, Andrej Karpathy announced he had joined Anthropic.

> *"I've joined Anthropic. I think the next few years at the frontier of LLMs will be especially formative. I am very excited to join the team here and get back to R&D. I remain deeply passionate about education and plan to resume my work on it in time."*

Karpathy is, in the technical AI community, about as close to a household name as it gets. He was a founding member of OpenAI, ran Tesla's Autopilot team for years, left to produce independent education work (his neural networks series on YouTube has millions of views), and has now chosen Anthropic for his return to active research.

## Why people noticed

The hire triggered speculation in proportion to its significance. Some estimated his package at over $1 billion. The tech press compared it to Ronaldo signing for Manchester City — a talent signal that reshapes how the rest of the industry reads the competitive picture.

What's more notable than the individual hire is the pattern it's part of. CTOs of publicly traded companies have left for individual contributor roles at Anthropic. Bun, the JavaScript runtime, was acquired. The Workday CTO left. Researchers from every major lab have been relocating. Anthropic has become one of the few places where the most technically accomplished people in the world are choosing to go — not to run something, but to build something.

That's a different kind of talent signal than a headcount milestone or a funding round.

## What it suggests about Claude's direction

Karpathy's stated reason is to "get back to R&D." His research interests have historically centered on: how neural networks actually work, training dynamics, interpretability at a practical level, and education as a forcing function for deeper understanding. He has never been primarily a product builder — he's a researcher who thinks clearly about what's actually happening inside these systems.

Reading between the lines: Anthropic is investing in foundational model research at a time when the field is accelerating. The next few capability jumps are probably not going to come from UI improvements or connector integrations — they're going to come from advances in how models are trained, evaluated, and understood. Karpathy showing up at that research level is meaningful.

## What it means for users of Claude

In the short term: nothing changes. In the medium term: Anthropic's research depth is increasing at exactly the moment when that depth is most likely to translate into measurable capability improvements.

If you've already bet on Claude as your primary AI platform, this hire is a datapoint that the bet is getting stronger. If you've been on the fence between platforms, it's worth noting that Anthropic is now pulling research talent that very few places in the world could attract.

The era of the polymathic individual contributor is real — and right now, they're going to Anthropic.

---

*For what Anthropic has been shipping recently, [the AI timeline](/timeline) has the full picture. For understanding the Claude model lineup and what Opus is designed for, [choosing the right Claude model](/articles/choosing-the-right-claude-model) covers the tradeoffs.*`,
  },

  {
    termSlug: 'ai-strategy',
    slug: 'ai-platform-landscape-2026',
    angle: 'process',
    title: 'Claude, Codex, or Cursor: choosing your AI platform in 2026',
    excerpt: 'Three serious AI agent platforms, three different strengths. A decision framework for operators and IT teams choosing where to standardize — without the hype.',
    readTime: 8,
    tier: 2,
    cluster: 'Business Strategy & ROI',
    body: `In mid-2026, three platforms have emerged as the serious options for teams wanting to use AI agents for real work: Claude (via the desktop app and Claude Code), OpenAI's Codex, and Cursor. They're converging fast — each is adding features the others have — but they're still meaningfully different, and choosing the wrong default costs you time and money when you eventually switch.

This is a practical comparison for operators and IT leaders making that choice right now.

## What each platform is

**Claude (Claude desktop app + Claude Code)**

Claude's platform is split into two surfaces: Claude.ai (the desktop/web app, which includes Cowork for knowledge work) and Claude Code (the coding agent, available via terminal and desktop). The strength is the model — Claude Opus 4.7 remains the strongest available model for complex, multi-step reasoning — and the integration breadth through connectors and skills. The gap is fragmentation: Cowork and Claude Code don't fully share context or customizations, which creates friction for teams doing mixed work.

**OpenAI Codex**

Codex is OpenAI's "super app" play — a unified environment handling chat, knowledge work, and agentic coding tasks from one interface. Key recent additions: \`/goal\` mode (agents that run autonomously for hours, or even more than a day, toward a high-level objective), plugin sharing across teams (build a workflow plugin, deploy it to everyone), and an annotation+design mode for iterating on UI without leaving the platform. The in-app browser is mature. The unified approach means fewer context switches. The tradeoff: you're more locked in to one surface.

**Cursor**

Cursor started as a code editor and is rapidly expanding. XAI (Elon Musk's AI division, backed by SpaceX compute) acquired it at roughly $60 billion with a $10 billion opt-out clause. That compute budget funded Composer 2.5 — currently one of the fastest, cheapest frontier-adjacent coding models available. The in-app browser is competitive with Codex. The current gap: document, spreadsheet, and knowledge-work tasks, which Codex and Claude Cowork handle more naturally. Based on the acquisition intent ("next generation platform for coding and knowledge work"), that gap is closing.

## The "super app" race and what it means for buyers

All three platforms are converging on the same vision: one environment where you can chat, do knowledge work, write and run code, and automate workflows — connected to your existing tools, with an in-app browser as the interface layer.

By that definition, Codex is currently closest to the complete vision. Claude's desktop app is close but fragmented between surfaces. Cursor is catching up on the knowledge-work side.

For teams making decisions today, "which platform will win" is the wrong question. The right question: **which platform's current state matches your team's primary use case?**

## Decision framework

**Choose Claude if:**
- Your team's primary work is knowledge-intensive: writing, synthesis, research, strategic thinking, stakeholder communication
- You need the best model quality for reasoning-heavy tasks (Opus 4.7 is genuinely ahead on multi-step reasoning)
- You have serious security/data requirements — Anthropic's Team/Enterprise plans have auditing, SSO, SCIM, and clearly documented data handling
- You need deep connector integrations with enterprise tools (Slack, Salesforce, Jira, Google Workspace) that your team actually uses day-to-day
- You're running Claude Code for engineering work and want the best underlying model for agentic coding

**Choose Codex if:**
- Your team's work crosses constantly between coding and knowledge work, and you want one surface for both
- You're running long autonomous agent tasks — \`/goal\` mode for multi-hour runs is genuinely useful for complex, multi-step projects
- You want team-wide plugin sharing — Codex's plugin ecosystem and sharing model is the most mature right now
- You're already deep in OpenAI's ecosystem (ChatGPT Enterprise, OpenAI API)
- Your team does rapid front-end iteration / vibe coding and wants design tooling alongside coding

**Choose Cursor if:**
- You're primarily a developer team doing engineering and front-end work
- Speed and cost matter — Composer 2.5 is significantly cheaper per task than equivalents on other platforms, and noticeably faster
- You can accept the current knowledge-work gap
- You want to bet on improving trajectory: XAI's compute investment is real and the Cursor roadmap is moving fast

## The fragmentation reality

The one thing that cuts across all three: **your team will use more than one.** The question isn't "which one exclusively?" — it's "which one to standardize on for each category of work?"

A pattern emerging for technical teams: Claude for knowledge work and strategic thinking; Cursor or Codex for coding; Claude Code routines or Codex \`/goal\` for scheduled autonomous tasks. The super app vision is real but hasn't fully arrived — the platforms are still better at some things than others.

## For IT and operators making the call

1. **Standardize on one for knowledge work.** For most organizations, this is Claude. Reasoning quality and data handling are strongest.
2. **Let developers choose their coding environment.** Cursor and Codex are legitimate tools developers will use regardless. Fighting this is not worth it; spend energy on governance instead.
3. **Define what "integration" means before signing contracts.** All three have connector ecosystems, but they connect to different things at different depths.
4. **Audit the data policies.** Codex and Cursor have different data handling than Claude. If you're on Claude Team/Enterprise, your data handling is clearly defined. Get equivalent documentation from any other platform before committing.

This comparison will need revisiting in six months — the space is moving that fast. But the fundamental tradeoff (model quality vs. platform completeness vs. coding speed) is stable enough to act on today.

---

*For the internal business case for your platform choice, [building a business case for Claude](/articles/building-a-business-case-for-claude) has the framework. For the security and data handling questions IT usually asks first, [Claude admin security and privacy](/articles/claude-admin-security-privacy) covers Anthropic's side of that conversation. For understanding what Claude Team vs. Enterprise actually means, [Claude Team vs Enterprise for IT](/articles/claude-team-vs-enterprise-for-it) has the side-by-side.*`,
  },
]

async function main() {
  console.log('Seeding batch 77 — May 2026 AI platform wave...\n')

  for (const a of ARTICLES) {
    const term = await getTermId(a.termSlug)
    if (!term) {
      console.error(`Term not found: ${a.termSlug}`)
      continue
    }

    const { error } = await sb.from('articles').upsert({
      slug: a.slug,
      term_id: term.id,
      term_name: term.name,
      term_slug: a.termSlug,
      angle: a.angle,
      title: a.title,
      excerpt: a.excerpt,
      read_time: a.readTime,
      tier: a.tier,
      cluster: a.cluster,
      body: a.body.trim(),
      published: true,
    }, { onConflict: 'slug' })

    if (error) {
      console.error(`Failed: ${a.slug}`, error.message)
    } else {
      console.log(`✓ ${a.slug}`)
    }
  }

  console.log('\nDone.')
}

main()
