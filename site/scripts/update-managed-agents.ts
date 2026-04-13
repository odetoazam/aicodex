/**
 * Update managed-agents-for-your-org article:
 * - Add 4-persona framework from transcript
 * - Add cost vs. ROI framing (service vs. internal use)
 * - Add platform.claude.com, anth CLI, sessions view
 * - Add "test locally first" tip
 * - Explicit PaaS framing
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/update-managed-agents.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const body = `Anthropic launched [Managed Agents](/glossary/managed-agents) in April 2026. If you have been following the AI space, you have heard the word "agent" a lot. Most of the time it is vague. This is not.

Managed Agents are Claude running in the cloud, completing multi-step tasks on its own, with Anthropic handling the infrastructure. You define what the agent should do. Anthropic runs it, sandboxes it, and gives you the result. Think of it as platform-as-a-service for AI agents — you focus on the business logic, Anthropic handles everything underneath.

## The core idea: intelligence and infrastructure separated

The fundamental shift with Managed Agents is a decoupling of two things that previously had to live together:

- **The intelligence** — your agent's instructions, skills, and the logic of what it should do
- **The infrastructure** — the session management, tool execution, orchestration loop, and sandboxing

Before Managed Agents, if you wanted to run a multi-step autonomous agent, you needed to build and maintain both. Now you bring the intelligence; Anthropic provides the infrastructure. Your agent definition is portable and reusable. The infrastructure is Anthropic's problem.

## Who this is for — four personas

**1. Claude chat / Cowork users**
Non-technical users and business owners who want results out of the box, same day. They want an agent they can run without touching code or managing servers. Managed Agents at [platform.claude.com](https://platform.claude.com) give them a workbench interface — no CLI required.

**2. Claude Code users**
Developers who want speed and reuse, and who are comfortable with the command line. For this persona, Managed Agents come with the \`anth\` CLI — Anthropic's command-line interface for deploying agents directly from your local files, skills, and MCP server configurations. The same things you build in Claude Code can be packaged and deployed through \`anth\`.

**3. Agent SDK users**
Developers who already have their own infrastructure and are using the Claude Agent SDK. For them, Managed Agents may be more expensive than necessary — they already have the infrastructure layer solved. The trade-off is cost vs. control: Managed Agents are managed for you, the SDK gives you ultimate flexibility on your own stack.

**4. AI tinkerers and solopreneurs**
Curious, cost-conscious, always experimenting. Managed Agents are currently not a great fit for this persona. The platform runs on a token-as-a-service model — you pay for tokens plus Anthropic's infrastructure time — and the costs add up faster than a Claude Code subscription for exploratory work. Stick with Claude Code for personal experimentation.

## What it looks like in practice

When you log into [platform.claude.com](https://platform.claude.com), you land in a workspace with two main areas:

**Workbench** — where you deploy and run agents. Each deployed agent can be triggered and each run creates a session.

**Sessions** — the full transcript of what the agent actually did, step by step. On the left: every tool call, script execution, and sub-agent call made during the run. On the right: the finished output or deliverable. This visibility is one of the things Managed Agents does better than ad hoc agent setups — you can see exactly what happened.

**Analytics** — usage dashboard showing token consumption (in and out) and cost breakdown per month. Useful for understanding what each workflow actually costs before you commit to running it at scale.

## The cost model — and when it is worth it

You pay for:
- Your normal Claude API token costs
- A session time fee for running on Anthropic's infrastructure (approximately $0.08 per session-hour)

For most workflows, the session time cost is small compared to the token cost of the work the agent is doing.

**The honest framing on cost:** Managed Agents are expensive relative to running something yourself, and whether that is worth it depends entirely on the use case.

If you are using a Managed Agent to **fulfill a service or product you sell**, the economics are usually clear. Running an AI assessment for a client costs $2.58 in Managed Agent fees; you charge $1,000 for the deliverable. That math works.

If you are using a Managed Agent for **internal tasks**, you need to be confident in the ROI — time saved, quality improved, revenue generated. Running high-volume internal work on Managed Agents at scale can get expensive. For compute-intensive internal automation, the Agent SDK on your own infrastructure may be cheaper with comparable results.

For **experimental or exploratory use**, a Claude Code subscription is more cost-efficient than incurring Managed Agent session fees every time you test something.

## A practical tip: test locally first

If you are deploying with the \`anth\` CLI, you can build and test your agent locally before deploying. Testing locally does not incur Managed Agent session fees — only the token cost of the model calls. When you are confident the agent works, deploy it. That is when you start accumulating session-time costs.

This matters because agent workflows can have unexpected paths that cost more than you anticipated. Validate the logic locally first.

## How to think about it

Managed Agents are not a replacement for Claude conversations. They are a different tool for a different kind of work:

- **Conversations** — interactive, back-and-forth, you are in the loop
- **Managed Agents** — autonomous, multi-step, you define the task and come back to the result

If you are an operator deciding whether to explore this: identify the tasks your team does that take more than 30 minutes, involve pulling information from multiple sources, and produce a document or output at the end. Those are your agent candidates. Then ask: does the value of automating this justify the cost of running it on managed infrastructure? If yes, Managed Agents are the fastest path to getting it running without building your own stack.
`

async function main() {
  const { error } = await sb
    .from('articles')
    .update({
      body,
      updated_at: new Date().toISOString(),
    })
    .eq('slug', 'managed-agents-for-your-org')

  if (error) {
    console.error('✗ managed-agents-for-your-org:', error.message)
  } else {
    console.log('✓ managed-agents-for-your-org updated')
  }
}

main().catch(console.error)
