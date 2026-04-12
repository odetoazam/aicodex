/**
 * Batch 31 — Anthropic advisor tool + managed agents (announced April 7–9, 2026)
 * claude-advisor-tool, claude-managed-agents
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-31.ts
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
    slug: 'claude-advisor-tool',
    angle: 'process',
    title: 'The advisor tool: Opus-level reasoning at Sonnet prices',
    excerpt: "A new Claude API feature lets Sonnet or Haiku call Opus mid-task when they need help. You pay Opus rates only for those calls — everything else runs at Sonnet or Haiku cost. Here's what it does and when to use it.",
    readTime: 7,
    cluster: 'Agents & Orchestration',
    audience: ['developer', 'operator'],
    termSlug: 'ai-agent',
    body: `The advisor tool is a new feature in the Claude API (public beta, April 9 2026) that lets a lighter model — Sonnet or Haiku — call Opus when it needs help on a specific decision mid-task.

How it works: Sonnet runs the agent loop, handles tools, and works through steps the normal way. When it hits something it can't resolve — a hard reasoning problem, an ambiguous situation, a decision that needs more care — it calls the advisor. Anthropic runs a separate inference pass with Opus against the full conversation, Opus returns a plan or correction, and Sonnet continues.

This all happens within a single API call. No extra round trips from your side.

The cost logic is simple. Sonnet handles the bulk of the work. Opus only gets called when the executor decides it needs help — typically generating 400–700 tokens per call. Total cost stays well below running Opus end-to-end.

## What the numbers show

Anthropic ran benchmarks and published the results at launch.

**Sonnet 4.6 with Opus 4.6 as advisor:**
- SWE-bench Multilingual (software engineering tasks): +2.7 percentage points over Sonnet alone
- Cost per agentic task: 11.9% less than Sonnet alone — the advisor helps Sonnet avoid wasted steps, so total task cost drops even accounting for the Opus tokens

**Haiku 4.5 with Opus 4.6 as advisor:**
- BrowseComp (web research benchmark): 41.2%, up from 19.7% for Haiku alone
- That is a 109% improvement on tasks that reward careful, multi-step reasoning

The Haiku result is the more striking one. Haiku alone has real limits on complex research tasks. With Opus advising it at the right moments, it more than doubles its score while still costing well below Sonnet or Opus running solo.

## How to set it up

The advisor tool is declared like any other tool in the messages API. It requires the beta header.

\`\`\`python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=4096,
    betas=["advisor-tool-2026-03-01"],
    tools=[
        {
            "type": "advisor_20260301",
            "name": "advisor",
            "model": "claude-opus-4-6",
        },
        # your other tools here
    ],
    messages=[
        {"role": "user", "content": "Your task here"}
    ]
)
\`\`\`

The executor decides when to call the advisor — you don't control that directly. Advisor tokens bill at Opus rates. Everything else bills at the executor model's rate.

Haiku as executor:

\`\`\`python
response = client.beta.messages.create(
    model="claude-haiku-4-5",
    max_tokens=4096,
    betas=["advisor-tool-2026-03-01"],
    tools=[
        {
            "type": "advisor_20260301",
            "name": "advisor",
            "model": "claude-opus-4-6",
        }
    ],
    messages=[...]
)
\`\`\`

## When to use it

The advisor tool fits agentic tasks — situations where the model is working through multiple steps, making decisions, and using tools. These are exactly the cases where judgment quality on specific sub-decisions matters most and where running Opus end-to-end becomes expensive.

Good fits:
- Multi-step software engineering tasks (debugging sessions, PRs, refactors)
- Web research and browsing workflows where reasoning quality varies by step
- Any agentic loop where you want near-Opus quality on the hard decisions but not on every token

Less useful for:
- Single-turn generation or Q&A — no multi-step loop, the advisor does not add much
- Latency-sensitive applications — each advisor call adds roughly 1–3 seconds
- Simple tasks Sonnet handles reliably on its own

## The cost math

Running Opus end-to-end on a 10-step agentic task is expensive. Running Sonnet for all 10 steps is cheaper but may fail on the hard ones. The advisor pattern gives you a third option: Sonnet for the routine steps, Opus called in for the 1–2 decisions that actually need it.

In the SWE-bench results, Sonnet with Opus advisor cost 11.9% less per task than Sonnet alone. The efficiency gain on the overall loop offset the Opus token cost.

For Haiku with Opus advisor, you pay more than Haiku alone but still far less than Sonnet — while getting a quality jump that makes Haiku viable for tasks it previously could not handle.

## Official docs

Full API reference: [platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool)

Announcement post: [claude.com/blog/the-advisor-strategy](https://claude.com/blog/the-advisor-strategy)`,
  },
  {
    slug: 'claude-managed-agents',
    angle: 'process',
    title: 'Claude Managed Agents: a hosted agent loop without the infrastructure',
    excerpt: "Anthropic now runs the full agent loop for you — sandboxed execution, built-in tools, and event streaming included. Here's what you get and when it makes sense over building the loop yourself.",
    readTime: 5,
    cluster: 'Agents & Orchestration',
    audience: ['developer'],
    termSlug: 'ai-agent',
    body: `When you build an agentic system with Claude yourself, you manage the whole loop: running each model call, handling tool execution, managing state between steps, dealing with errors, streaming results back to users. That is real work. [Claude Managed Agents](https://platform.claude.com/docs/en/agents-and-tools/managed-agents) (public beta, April 8 2026) is Anthropic running that loop for you.

You send a task. Anthropic handles the iteration. You get back results via server-sent events as the agent works.

## What is included

**Sandboxed execution.** The agent runs in an isolated environment. Code it writes executes in a secure sandbox — you do not need to set that up yourself.

**Built-in tools.** Web search, code execution, file operations, and browser use are available without you wiring them up separately. You can include your own tools alongside them.

**Server-sent event streaming.** The agent streams progress as it works — steps completed, tool calls made, intermediate outputs. You get observability without building it.

**Automatic error handling.** Managed Agents handles retries and recovery from common failure modes in the agent loop.

## The API shape

The request uses a different endpoint from the standard messages API. It requires the beta header.

\`\`\`python
import anthropic

client = anthropic.Anthropic()

with client.beta.managed_agents.stream(
    model="claude-sonnet-4-6",
    task="Research the top three competitors for [company] and summarize their pricing",
    betas=["managed-agents-2026-04-01"],
    tools=["web_search", "code_execution"],
    max_steps=20,
) as stream:
    for event in stream:
        print(event)
\`\`\`

You can add custom tools alongside the built-in ones. The agent decides which tools to use and when.

## DIY loop vs. Managed Agents

Building your own agent loop gives you full control: custom tool logic, precise state management, specific error handling, the ability to inject context between steps. If your use case is highly customized, building the loop yourself is still the right call.

Managed Agents makes sense when:
- You want to ship an agentic feature without building the infrastructure
- Your use case fits the built-in tool set (search, code, browser, files)
- You want streaming observability without building it
- You are prototyping before deciding whether to invest in a custom loop

## Combining with the advisor tool

You can pair Managed Agents with the [advisor tool](/articles/claude-advisor-tool): use Sonnet as the executor in a Managed Agent loop, with Opus as the advisor for hard decisions. The two features are compatible.

## Official docs

Full reference: [platform.claude.com/docs/en/agents-and-tools/managed-agents](https://platform.claude.com/docs/en/agents-and-tools/managed-agents)`,
  },
]

async function seed() {
  console.log('Seeding Batch 31 — advisor tool + managed agents...\n')

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
