/**
 * Batch 83 — Anthropic announcements: Claude Fable 5 + Managed Agents self-hosted (June 9, 2026)
 *
 * 1. claude-fable-5
 *    Launched June 9, 2026. Anthropic's most capable widely released model — the
 *    public version of the Mythos class. $10/$50 (double Opus 4.8). 1M context,
 *    128k output, adaptive thinking always on. The integration-breaking change:
 *    safety classifiers that return stop_reason: "refusal", plus a fallback path
 *    to Opus 4.8. Free in Pro/Max/Team/Enterprise through June 22, credits after.
 *    DEV_SLUGS + PINNED_DEV. Cluster: Models & Pricing. Angle: update.
 *
 * 2. claude-managed-agents-self-hosted
 *    Self-hosted sandboxes for Claude Managed Agents reached general availability
 *    across the Claude API and Claude Platform on AWS (May 19 -> June). Move tool
 *    execution onto infrastructure you control while Claude keeps running on
 *    Anthropic's side. Work-queue model, environment worker, MCP tunnels for
 *    private servers, scheduled deployments + vault env credentials (June 9).
 *    DEV_SLUGS. Cluster: Claude API. Angle: update.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-83.ts
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
    slug: 'claude-fable-5',
    angle: 'update',
    title: 'Claude Fable 5: the new flagship, the new price, and the first model that can refuse you',
    excerpt: "Anthropic launched Claude Fable 5 on June 9, 2026 — its most capable widely released model — then disabled it worldwide on June 12 to comply with a US government export-control directive. It costs $10/$50 per million tokens (double Opus 4.8), and it's the first Claude model that can decline a request mid-API-call. Here's what the model is, why it was pulled, and what to do while access is suspended.",
    readTime: 9,
    cluster: 'Models & Pricing',
    audience: ['developer'],
    termSlug: 'large-language-model',
    body: `> **Status update — June 12, 2026: Fable 5 is currently suspended.** The US government issued an export-control directive on June 12 (5:21pm ET) barring access to Fable 5 and Mythos 5 by any foreign national, citing a national-security concern tied to a method of bypassing the model's safeguards. To comply, Anthropic **disabled both models worldwide for all customers** — three days after launch. You cannot call \`claude-fable-5\` right now. Anthropic calls it a misunderstanding and says it is working to restore access; **all other Claude models (Opus 4.8, Sonnet, Haiku) are unaffected.** Everything below describes the model as launched — read it as what to expect *if and when access returns*, and keep a fallback to Opus 4.8 in place. See [Anthropic's statement](https://www.anthropic.com/news/fable-mythos-access).

---

Claude Fable 5 (\`claude-fable-5\`) shipped on June 9, 2026 as Anthropic's most capable widely released model. It's the public, generally available version of the **Mythos** model class — the same model line that, until now, only Project Glasswing partners and critical-infrastructure operators could touch.

At launch it was generally available on the Claude API, [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws), Amazon Bedrock, Vertex AI, and Microsoft Foundry — until the June 12 directive pulled it from all of them.

Two things make this release different from a routine model bump: the **price doubled**, and Fable 5 is the first Claude model that can **refuse a request in the middle of an API call**. Both have direct consequences for anyone with Claude in production.

## The specs

| | Claude Fable 5 | Claude Opus 4.8 (for comparison) |
|---|---|---|
| Model ID | \`claude-fable-5\` | \`claude-opus-4-8\` |
| Input price | **$10 / million tokens** | $5 / million tokens |
| Output price | **$50 / million tokens** | $25 / million tokens |
| Context window | 1M tokens (default) | 1M tokens (default) |
| Max output | 128k tokens | 128k tokens |
| Thinking | Adaptive, always on | Adaptive (effort defaults to high) |
| Safety classifiers | **Yes — can refuse** | No |

Fable 5 is **twice the price of Opus 4.8** on both input and output. That alone should make you deliberate about where you point it. More on that below.

One more cost wrinkle: Fable 5 uses the tokenizer introduced with Opus 4.7, so the same text produces roughly **30% more tokens** than models before 4.7. If you're budgeting off old token counts, re-measure with the [token counting API](https://platform.claude.com/docs/en/build-with-claude/token-counting) using \`model: "claude-fable-5"\` before you trust any cost estimate.

## What "the model can refuse you" actually means

On Fable 5, Anthropic runs **safety classifiers** on the incoming request and again during generation. When a classifier declines a request — primarily in high-risk cyber, biology, and chemistry domains, plus attempts to reverse-engineer the model — the Messages API does **not** throw an error. It returns a normal **HTTP 200** response with:

\`\`\`json
{
  "stop_reason": "refusal",
  "stop_details": {
    "category": "cyber",
    "explanation": "..."
  }
}
\`\`\`

\`stop_details.category\` is \`"cyber"\`, \`"bio"\`, or — new on Fable 5 — \`"reasoning_extraction"\` (blocked under the Terms of Service rules on duplicating model outputs). No beta header is required to read it.

The trap: if your code branches on \`stop_reason === "end_turn"\` or just reads \`response.content[0].text\`, a refusal will surface as an empty or malformed result rather than an error your monitoring catches. **You have to handle \`"refusal"\` explicitly.**

Billing detail that works in your favor: **you are not charged** for a request that is refused before any output is generated.

## Handle the refusal, then fall back

A request Fable 5 refuses can usually be served by another Claude model — Opus 4.8 has no classifiers. The simplest, most portable pattern is a client-side check and retry:

\`\`\`typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function ask(prompt: string) {
  const res = await client.messages.create({
    model: "claude-fable-5",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  if (res.stop_reason === "refusal") {
    // res.stop_details.category -> "cyber" | "bio" | "reasoning_extraction"
    // Retry on a model without the classifiers.
    return client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });
  }

  return res;
}
\`\`\`

Anthropic also ships two managed paths so you don't hand-roll the retry:

- **Server-side fallback** — an opt-in \`fallbacks\` parameter (beta on the Claude API and Claude Platform on AWS; not supported on the Message Batches API) re-runs a refused request on a model you name, billed at that model's rates.
- **Client-side fallback** — official [SDK middleware](https://platform.claude.com/docs/en/cli-sdks-libraries/middleware) (TypeScript, Python, Go, Java, C#) that retries from the client on any platform.

Either way, **fallback credit** refunds the prompt-cache cost of switching models, so you don't pay the cache penalty twice. The full mechanics are in [Refusals and fallback](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback).

## Other breaking differences from Opus 4.8

These are specific to Fable 5 (and Mythos 5). The Messages API is unchanged for Opus, Sonnet, and Haiku.

- **Adaptive thinking is the only thinking mode.** \`thinking: {"type": "disabled"}\` is not supported. Manual extended-thinking budgets and assistant prefill both return a **400 error**. Control reasoning depth with the [effort parameter](https://platform.claude.com/docs/en/build-with-claude/effort) instead.
- **Raw chain of thought is never returned.** \`thinking.display\` defaults to \`"omitted"\`; set \`"summarized"\` if you want readable reasoning summaries. Pass thinking blocks back unchanged in multi-turn conversations on the same model.
- **No zero data retention.** Fable 5 requires 30-day data retention and is a designated Covered Model — it is not available under ZDR. If your contract mandates ZDR, you can't use Fable 5 yet; stay on Opus 4.8.

If you're coming from the old **Mythos Preview**, the migration is mostly a model-name swap to \`claude-mythos-5\`; see the [migration guide](https://platform.claude.com/docs/en/about-claude/models/migration-guide).

## What Claude Mythos 5 is

\`claude-mythos-5\` is the **same underlying model as Fable 5, with the safety classifiers removed**. It never refuses. It is **not** generally available — it stays locked to approved [Project Glasswing](https://anthropic.com/glasswing) participants: vetted cyber defenders and critical-infrastructure operators doing exactly the high-risk work Fable 5 blocks. If you don't have Glasswing access, Fable 5 gives you the same capabilities everywhere except those restricted domains.

## Is it actually better?

Anthropic reports Fable 5 scores more than 10% higher than Opus 4.8 on some benchmarks, with strength in software engineering, knowledge work, and vision. Early third-party testing backs the direction: analytics platform Hex reported Fable as the first model to clear **90%** on its core benchmark, and app builders cited stronger one-shot app generation and tool-calling than any prior model.

Treat those as a real step up at the top end — not a reason to move everything. The honest version: Fable 5 is the model for the **hardest reasoning and longest-horizon agentic work**, where a 10% quality gain is worth paying double for and the occasional refusal-and-fallback is acceptable. For the large majority of production traffic — drafting, summarizing, classification, routine tool use — **Opus 4.8 at half the price, with no refusal handling required, is still the right default.** Route to Fable 5 deliberately, not globally.

## Availability and the pricing clock

**Note:** the schedule below is the one Anthropic announced at launch. It is on hold while the June 12 government suspension is in effect (see the status note at the top). The dates may shift once access is restored.

As launched, Fable 5 was **free** in Pro, Max, Team, and seat-based Enterprise plans **through June 22, 2026**, then moving to usage credits on those plans, and billed at $10/$50 on the API from day one.

If you're putting Fable 5 in an app, the API price is what matters — and that, plus the lesson the suspension just taught everyone about a single model vanishing overnight, is exactly why the "route deliberately, keep a fallback" advice earns its keep.

## What to do this week

1. **Find every place you'd swap the model string.** For each, add an explicit \`stop_reason === "refusal"\` branch with a fallback to Opus 4.8.
2. **Re-measure token counts** under the new tokenizer before trusting any cost projection.
3. **Decide the routing rule.** Default to Opus 4.8; send only your hardest tasks to Fable 5. Write that rule down so it doesn't drift into "Fable everywhere" by habit.
4. **Check your ZDR requirement.** If you're contractually on zero data retention, Fable 5 is off the table for now.

## Related reading

- [Claude Opus 4.8: the new default](/articles/claude-opus-4-8) — the model Fable 5 sits above, and your fallback target
- [Choosing the right Claude model](/articles/choosing-the-right-claude-model) — the routing framework, now with a fourth tier
- [Claude cost optimization](/articles/claude-cost-optimization) — why "route deliberately" is a cost decision, not just a quality one

---

*Source: [Introducing Claude Fable 5 and Claude Mythos 5](https://platform.claude.com/docs/en/about-claude/models/introducing-claude-fable-5-and-claude-mythos-5) and the [Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview), June 9, 2026.*`,
  },
  {
    slug: 'claude-managed-agents-self-hosted',
    angle: 'update',
    title: 'Running Claude Managed Agents on your own infrastructure',
    excerpt: "Self-hosted sandboxes let Claude Managed Agents keep their orchestration on Anthropic's side while tool execution — the agent's filesystem, processes, and network — runs on infrastructure you control. It's the answer for agents that touch data that can't leave your network. Here's the work-queue model, the environment worker, and how MCP tunnels, scheduling, and vaults fit in.",
    readTime: 8,
    cluster: 'Claude API',
    audience: ['developer'],
    termSlug: 'ai-agent',
    body: `Claude Managed Agents normally execute their tool calls — running code, reading and writing files, reaching the network — inside Anthropic-managed cloud sandboxes. That's the easy path, and for most agents it's fine.

It stops being fine the moment the agent needs to operate on data that **can't leave your network**, reach **internal services that aren't publicly routable**, or run under **your own compliance and audit controls**. Self-hosted sandboxes are the answer to all three. They reached general availability across the Claude API and Claude Platform on AWS over May–June 2026, with scheduled deployments and vault credentials landing alongside the Fable 5 release on June 9.

This is a builder/operator guide to how they work and when to reach for them.

## What stays where

The split is the whole point:

- **Orchestration stays on Anthropic's side.** Claude — the model deciding what to do next — runs on Anthropic's control plane. You don't host the model.
- **Tool execution moves to your infrastructure.** The filesystem the agent reads and writes, the processes it spawns, and the network it can reach are all on a host you control, under your network policy and lifecycle.
- **Tool inputs and outputs still flow to Anthropic's control plane** so Claude can see results and pick the next step. That's the data-flow boundary to understand before you commit; the [security model](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-security) spells it out.

In a table:

| | Cloud sandbox (default) | Self-hosted sandbox |
|---|---|---|
| Where tools run | Anthropic-managed | **Your infrastructure** |
| Network reach | Anthropic's egress controls | **Your network policy** |
| File / repo mounting | Managed by Anthropic | Managed by you |
| Lifecycle | Managed by Anthropic | Managed by you |

Self-hosting is also what unlocks **Zero Data Retention and HIPAA BAA eligibility** for the execution layer — see [API and data retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention#feature-eligibility).

## The mental model: a work queue

A self-hosted environment is a **work queue**. When a session is assigned to it, Anthropic enqueues that session as a work item. A process you run — the **environment worker** — claims items from the queue, downloads the agent's [skills](https://platform.claude.com/docs/en/managed-agents/skills), runs the tool calls locally, and posts the results back.

You run the worker one of two ways:

- **Always-on** — a long-running process polls the queue continuously. Needs only outbound HTTPS. Simplest setup.
- **Webhook-triggered** — a handler that wakes on the \`session.status_run_started\` webhook and polls then. Avoids an idle poller, but needs an endpoint Anthropic can reach.

Both the \`ant\` CLI and the SDKs ship pre-built workers. The CLI supports the always-on pattern; the SDK supports both.

## Standing one up

**1. Create the environment** with \`config.type: "self_hosted"\`:

\`\`\`bash
curl -sS --fail-with-body https://api.anthropic.com/v1/environments \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "anthropic-beta: managed-agents-2026-04-01" \\
  -H "content-type: application/json" \\
  -d '{ "name": "self-hosted", "config": {"type": "self_hosted"} }'
\`\`\`

**2. Generate an environment key** in the Console (key generation is Console-only, even if you created the environment over the API). On the worker host:

\`\`\`bash
export ANTHROPIC_ENVIRONMENT_KEY="sk-ant-oat01-..."
export ANTHROPIC_ENVIRONMENT_ID="env_..."
\`\`\`

**3. Run the worker.** With the CLI:

\`\`\`bash
ant beta:worker poll --workdir /workspace
\`\`\`

Or with the SDK (TypeScript shown):

\`\`\`typescript
import Anthropic from "@anthropic-ai/sdk";
import { EnvironmentWorker } from "@anthropic-ai/sdk/helpers/beta/environments";

const environmentKey = process.env.ANTHROPIC_ENVIRONMENT_KEY!;
const environmentId = process.env.ANTHROPIC_ENVIRONMENT_ID!;
const client = new Anthropic({ authToken: environmentKey });

const controller = new AbortController();
process.once("SIGTERM", () => controller.abort());

await new EnvironmentWorker({
  client,
  environmentId,
  environmentKey,
  workdir: "/workspace",
  signal: controller.signal,
}).run();
\`\`\`

The worker drains in-flight tool calls and exits cleanly on SIGTERM.

**4. Create a session that targets the environment.** It enters the queue and waits there until a worker claims it — if no worker is connected, the session stays queued rather than failing:

\`\`\`bash
curl -sS https://api.anthropic.com/v1/sessions \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "anthropic-beta: managed-agents-2026-04-01" \\
  -H "content-type: application/json" \\
  -d '{ "agent": "'"$AGENT_ID"'", "environment_id": "'"$ANTHROPIC_ENVIRONMENT_ID"'" }'
\`\`\`

## The one security rule that matters most

Run monitoring and session-management calls (\`work.stats\`, \`work.stop\`, session creation) with your **organization API key, from outside the worker host**. The worker itself authenticates with the **environment key only**.

> Never set \`ANTHROPIC_API_KEY\` on the worker host. Doing so exposes an organization-scoped credential to the agent's own tool calls.

The environment key is scoped to claiming and completing work. The API key can spend money and read org data. Keep them on different machines.

## Stronger isolation: a sandbox per session

\`ant beta:worker poll\` runs tool calls in-process, in the working directory. If you need a fresh filesystem, resource limits, or per-session network controls, run **each session in its own sandbox**. Build an image with \`ant\` installed and \`ant beta:worker run\` as the entrypoint, then point the poller at a spawn script:

\`\`\`bash
ant beta:worker poll --on-work ./spawn.sh
\`\`\`

The poller injects \`ANTHROPIC_SESSION_ID\`, \`ANTHROPIC_WORK_ID\`, \`ANTHROPIC_ENVIRONMENT_ID\`, and \`ANTHROPIC_ENVIRONMENT_KEY\` into the script, which launches a fresh container per session (Docker, or a managed sandbox provider). Bind-mount a host directory to the sandbox's \`/mnt/session/outputs\` to retrieve the agent's deliverables after it exits.

If you'd rather not build the harness, there are pre-built integrations for **Blaxel, Cloudflare, Daytona, E2B, Modal, Namespace, Superserve, and Vercel** — each gives you per-session sandboxes without writing the spawn logic yourself.

## Reaching private MCP servers

Self-hosting controls *where the agent's code executes*. [MCP tunnels](https://platform.claude.com/docs/en/agents-and-tools/mcp-tunnels/overview) control *how Anthropic reaches MCP servers inside your network*. They're independent:

- A session in Anthropic's **cloud** sandbox can still reach a private MCP server through a tunnel.
- A **self-hosted** session can use tunneled or public MCP servers.

Use both when you want execution **and** tool access to stay inside your boundary — the full-isolation configuration for sensitive agents.

## Two companion features (June 9)

Shipped alongside Fable 5 and worth knowing if you operate agents:

- **Scheduled deployments** — run agent sessions on a **cron schedule** without standing up your own scheduler. The natural fit for recurring jobs: a nightly reconciliation agent, a Monday-morning report builder.
- **Vault environment-variable credentials** — securely inject secrets into the agent's sandbox as environment variables, for CLIs, SDKs, and other services that authenticate that way. Keeps keys out of your prompts and out of the agent's code.

## Operating the fleet

\`work.stats\` returns queue health — call it from your ops tooling with the org API key:

\`\`\`json
{
  "type": "work_queue_stats",
  "depth": 0,            // items waiting to be claimed -> scale or alert on backlog
  "pending": 0,          // items a worker is currently processing
  "oldest_queued_at": null,
  "workers_polling": 0   // workers seen in the last 30s -> liveness alerting
}
\`\`\`

Alert when \`workers_polling\` drops to 0 (no worker is connected and sessions are piling up) and when \`depth\` climbs (you're under-provisioned). Use \`work.stop\` for a graceful shutdown of a specific session — it finishes the in-flight tool call, posts a final status, and releases the session.

## Two limits to plan around

- **Files aren't mounted.** Anthropic doesn't stage files or GitHub repos into self-hosted sandboxes. Pass a reference (an S3 path, a commit SHA) in the session \`metadata\`, and have your worker read that from the claimed item and stage the files before tool execution begins.
- **Memory isn't supported yet.** The Managed Agents [memory stores](/articles/claude-managed-agents-memory) feature doesn't work with self-hosted sandboxes at launch. If your agent depends on persistent memory, stay on cloud sandboxes for now.

## When to reach for this

Default to **cloud sandboxes** — they're less to operate. Move to **self-hosted** when one of these is true: the agent must touch data that can't leave your network, it needs to reach internal non-public services, or your compliance regime (ZDR, HIPAA) requires execution to stay inside your boundary. Those are the cases worth running a worker fleet for. Everything else isn't.

## Related reading

- [Claude Managed Agents](/articles/claude-managed-agents) — the foundation: what the hosted agent loop is
- [Managed Agents memory](/articles/claude-managed-agents-memory) — the persistence layer (cloud sandboxes only, for now)
- [MCP for production agents](/articles/mcp-production-agents) — connecting agents to real systems safely

---

*Source: [Self-hosted sandboxes](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes) and the [Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview), May–June 2026.*`,
  },
]

async function seed() {
  console.log('Seeding Batch 83 — Claude Fable 5 + Managed Agents self-hosted...\n')

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
