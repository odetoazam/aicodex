/**
 * Internal MCP Server Series — 8 articles on building a production internal AI stack
 *
 * 1. internal-mcp-server-explained
 * 2. ai-data-access-token-economics
 * 3. ai-agent-cold-start-caching
 * 4. ai-agent-access-control
 * 5. live-api-vs-etl-for-ai
 * 6. data-warehouse-for-ai-agents
 * 7. building-ai-skills-for-your-team
 * 8. internal-ai-stack-architecture
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-internal-mcp.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const articles = [
  {
    slug: 'internal-mcp-server-explained',
    angle: 'def',
    title: 'What Is an Internal MCP Server — and Why Your Team Needs One',
    excerpt: 'When you connect Claude to company tools through native connectors, you get one connection per service, no shared context, and no access control. An internal MCP server is a single routing layer that proxies everything through one interface — with auth, shaped responses, and permissions baked in.',
    readTime: 9,
    cluster: 'Agents & Orchestration',
    body: `You've connected Claude to HubSpot. Then to Intercom. Then to QuickBooks. Each connection was its own thing — different setup, different permissions, different response shapes. When your sales rep asks Claude about a customer, Claude knows their deal stage (HubSpot), but not their open support ticket (Intercom), and definitely not their billing status (QuickBooks). You've connected Claude to three systems and it still doesn't know what's actually going on with the customer.

This is the native connector problem. And it's why teams that get serious about AI infrastructure build an internal MCP server.

---

## What native connectors give you (and what they don't)

A native connector is a direct line between Claude and one service. You connect HubSpot, and Claude can look up deals. You connect Slack, and Claude can search messages. Each connector works fine in isolation.

The problems emerge when you need more than one:

**No shared context.** Each connector operates independently. Claude can look up a deal in HubSpot and a ticket in Intercom, but it needs to make two separate calls, and there's nothing connecting them. If you want "show me all customers with open support tickets and an enterprise deal closing this quarter," you're assembling that manually.

**No access control.** A sales rep and a finance manager both have Claude. The sales rep probably shouldn't be able to pull payroll data from your HR system. The finance manager probably shouldn't see individual customer conversations. Native connectors don't have a layer where you can enforce this. You're left writing it into your prompts, which is not enforcement — that's hoping.

**No response shaping.** Native connectors return what the API returns. HubSpot's deal endpoint returns a JSON object with 40+ fields, most of which Claude doesn't need. You're paying token costs for data that doesn't help the answer.

**No audit trail.** When Claude looks something up, you often have no record of what was accessed, by whom, at what time. For most companies, this is a liability.

---

## What an internal MCP server is

An MCP server (Model Context Protocol server) is a standardized way for Claude to call tools and get data. An *internal* MCP server is one you build and control — it sits between Claude and all your external services.

The architecture looks like this:

\`\`\`
Claude
  ↓
Internal MCP Server
  ↓  [ACL Middleware — injects caller identity, checks permissions]
  ↓
  ├── ChargeOver (billing)
  ├── HubSpot (CRM)
  ├── Intercom (support)
  ├── QuickBooks (accounting)
  ├── Gong (call recordings)
  ├── Granola (meeting notes)
  ├── Notion (docs)
  ├── Slack (comms)
  ├── GitHub (code)
  └── Data Warehouse (BigQuery / StarRocks)
\`\`\`

Instead of Claude talking to each service directly, Claude makes a single connection to your MCP server, and the MCP server handles routing.

Every call goes through ACL middleware that knows who's calling. The middleware injects the caller's user ID and org ID into every request automatically — no relying on prompts or user input. If the tool the caller is trying to use requires a permission they don't have, the call never reaches the service. The tool doesn't even appear in Claude's available tool list for that user.

---

## Tools as named functions

The way Claude discovers what it can do through your MCP server is by reading a list of tools — named functions with descriptions.

A tool looks like this:

\`\`\`typescript
{
  name: 'get_customer_profile',
  description: 'Returns the full customer record including deal stage, support tickets, and billing status. Use this when the user asks about a specific customer.',
  inputSchema: {
    type: 'object',
    properties: {
      customer_id: { type: 'string', description: 'The customer ID from HubSpot or ChargeOver' }
    },
    required: ['customer_id']
  }
}
\`\`\`

Claude reads the name and description and decides when to call it. The implementation behind the tool can call three different APIs, join the results, strip out irrelevant fields, and return a shaped object — Claude just gets the clean answer.

This is the key insight: **the tool's description is how Claude understands capability, and the implementation is how the server delivers it.** You control both.

---

## Shaped responses: the token economics argument

When Claude calls HubSpot directly through a native connector, it gets a full API response. A HubSpot deal object has fields for: deal ID, deal name, owner, pipeline, stage, amount, close date, created date, last modified, contact associations, company associations, activity log, custom fields — plus all the metadata.

Claude reads all of it. You pay for all of it.

Your internal MCP server can return just what's needed:

\`\`\`json
{
  "customer": "Acme Corp",
  "deal_stage": "Negotiation",
  "close_date": "2026-06-15",
  "amount": 42000,
  "open_support_tickets": 2,
  "last_payment_status": "current"
}
\`\`\`

Six fields instead of sixty. A fraction of the tokens. And because the server controls what goes into that response, it can pull the support ticket count from Intercom and the payment status from ChargeOver and include them in the same response — something Claude couldn't do with three separate native connectors.

---

## The company's AI data layer

The right mental model for an internal MCP server is an API gateway — but for AI agents rather than other services.

Like an API gateway, it:
- Routes requests to the right service
- Handles authentication so callers don't need service-specific credentials
- Enforces access policies
- Shapes and transforms responses
- Maintains an audit log

Unlike a typical API gateway, it's designed around Claude's consumption patterns: natural language descriptions of tools, shaped responses optimized for token cost, and permission filtering that determines which tools even exist for a given caller.

Once you have this layer in place, adding a new data source becomes: write one MCP tool, point it at the service, define the permission group that can use it. Every team member with Claude access gets the new capability automatically — shaped, permissioned, logged.

---

## What this enables

**Cross-system answers.** "Which customers have an open enterprise renewal this quarter and more than one unresolved support ticket?" This query touches HubSpot and Intercom. Your MCP server can handle it in one tool call.

**Role-shaped AI.** Your sales rep's Claude has access to deal data, call transcripts, and customer profiles. Your finance team's Claude has access to billing, AR aging, and QBO reports. Not because of different prompts — because of different permission groups hitting the same server.

**Consistent data contracts.** Every team member asking about a customer gets the same shape of response, from the same source. No one's pulling stale data from a CSV they downloaded last week.

**Audit trail.** Every tool call is logged: which user, which tool, which parameters, what was returned, when. This is the kind of record most companies don't have for AI queries today.

---

## What goes wrong without it

The most common failure mode: your AI setup works fine for individual users, falls apart the moment you try to scale it.

A sales rep figures out that if they ask Claude about a customer, they need to paste in the HubSpot record first, then the recent Gong summary, then the last Intercom ticket. They do this because there's no other way. It takes 90 seconds of copy-paste before every customer conversation. The AI is genuinely helping — but only after a manual assembly step that was supposed to be the AI's job.

The second failure mode: someone asks Claude something they shouldn't be able to know. Not because Claude was hacked — because there was no access control in the first place. "What's Sarah's salary?" Claude answers because it has access to the HR system and no one built the layer that says finance managers can't see individual salaries.

An internal MCP server is how you build the infrastructure before those problems show up, rather than after.

---

## Getting started

The minimum viable internal MCP server has:
1. Two or three tools covering your most common Claude queries
2. An ACL middleware layer that injects user identity and checks permissions
3. An audit log (even just writing to a table is fine to start)

You don't need all your services wired up on day one. Start with the data your team actually asks Claude about most often. Add tools as the use cases demand them.

The architecture is straightforward. The payoff — having one interface that routes, shapes, and controls all AI data access — compounds the longer it runs.`,
  },

  {
    slug: 'ai-data-access-token-economics',
    angle: 'failure',
    title: 'The Token Cost of How You Fetch Data — and Why It Matters More Than Your Model Choice',
    excerpt: 'A morning routine agent that pulls calendar, email, CRM, and support data cold via native connectors can burn 400,000 tokens before the user asks a single question. The same workflow with pre-fetched, shaped data costs near zero on startup. How you fetch data has a 10-50x cost impact — bigger than your model choice.',
    readTime: 10,
    cluster: 'Infrastructure & Deployment',
    body: `Here's a number that should bother you: 400,000 tokens.

That's what a morning routine skill can burn before the user types their first message — if you're fetching data the naive way. That's before any reasoning, before any output, before any value is delivered. Four hundred thousand tokens of context loading, just to give the agent what it needs to get started.

At \$3 per million input tokens (Sonnet pricing), that's $1.20 per user per morning. For a team of 50, that's $60 a day, $1,500 a month, just for the cold start.

And here's the thing: the morning routine itself isn't expensive. Generating a daily brief, summarizing meetings, flagging priority emails — that's maybe 2,000–5,000 tokens of output. The token cost isn't in what the AI does. It's in how the data gets in.

---

## Three tiers of data access

Not all data fetching is equal. There's a spectrum from cheap to expensive, and where you land on it is mostly an architectural choice.

### Tier 1: Warehouse SQL (cheapest)

You write a SQL query against your data warehouse. The query is precomputed, returns exactly the fields you asked for, and the result is a flat table.

\`\`\`sql
SELECT
  customer_name,
  deal_stage,
  arr,
  open_tickets,
  last_payment_status
FROM customer_summary
WHERE owner_id = ?
  AND close_date BETWEEN NOW() AND NOW() + INTERVAL 90 DAY
\`\`\`

This returns maybe 20 rows, 6 columns, clean field names. Claude reads a tight table. Tokens: minimal.

The tradeoff: warehouse data is lagged. It reflects wherever your last ETL run landed — typically a few hours behind. For yesterday's revenue numbers or pipeline state, that's fine. For a live support ticket someone just opened 10 minutes ago, it's not.

### Tier 2: Internal MCP Live API (middle)

Your internal MCP server calls the upstream API, shapes the response, and returns only what Claude needs. The raw HubSpot deal object has 40+ fields. Your tool returns 6. The raw Intercom ticket has the full conversation thread. Your tool returns the status and last update.

The live API is slower than a warehouse query (you're making an HTTP call) and costs more tokens (JSON still needs to be serialized), but the data is current and you control the shape.

Token cost: much higher than SQL, but far less than raw native connectors. The shaping makes a real difference.

### Tier 3: Native Connectors (most expensive)

You've connected HubSpot, Intercom, QuickBooks, Gong, Granola, and Slack directly to Claude. Claude loads 8+ tool schemas at session start. When it calls each one, it gets the full API response.

A HubSpot deal API call returns 40+ fields. A Gong recording summary might be 3,000 words. Intercom's conversation history includes every message thread. Slack's API returns the full message objects with metadata. QuickBooks entity objects include the full audit trail.

Claude parses all of it. You pay for all of it.

**Token cost per call: 10-50x more than equivalent SQL.**

Now multiply that by session initialization. Six connected services, each loading their schemas. The agent populates its context with enough information to be useful — and that population costs before a single question is answered.

---

## The morning routine cold start, unpacked

Here's what actually happens when a "morning routine" skill runs cold with native connectors:

1. **Schema loading.** Claude loads tool schemas for all connected services: HubSpot, Gong, Intercom, QuickBooks, Google Calendar, Gmail. That's maybe 8 schema definitions, each 500-2,000 tokens. Already at 10,000 tokens before the first API call.

2. **Calendar pull.** Fetch today's meetings. Google Calendar returns each event as a full JSON object including attendees, conferencing links, recurrence rules, color codes, and RSVP status for all invitees. Five meetings: ~15,000 tokens.

3. **Email triage.** Fetch last 24 hours of email. Each email returns full MIME headers, thread ID, label IDs, history ID, and message body. 40 emails at 2,000 tokens each: 80,000 tokens.

4. **CRM pipeline check.** Fetch all open deals in the quarter. HubSpot returns deal objects with 40+ properties each. 25 deals: ~60,000 tokens.

5. **Support tickets.** Fetch open tickets assigned to the team. Intercom returns full conversation objects including all message threads. 15 tickets: ~80,000 tokens.

6. **Gong summaries.** Fetch recent call recordings. Even "summaries" include full transcript snippets. 8 calls: ~150,000 tokens.

Total before the user says good morning: roughly 400,000 tokens.

---

## What the same workflow costs with proper data architecture

With an internal MCP server and pre-fetched warehouse data:

1. **Schema loading.** One MCP server, one schema, a dozen clean tool definitions. Maybe 3,000 tokens.

2. **Calendar pull.** Your tool returns a shaped list: meeting name, time, attendees, agenda note. No conferencing metadata, no recurrence rules, no RSVP status. 5 meetings: ~1,500 tokens.

3. **Email triage.** Your ETL runs at 2 AM, processes the inbox, and stores a summary table: sender, subject, priority flag (computed), one-line summary. 40 emails: ~4,000 tokens.

4. **CRM pipeline.** Your warehouse query returns a clean summary view: customer, stage, ARR, days-to-close. 25 deals: ~2,000 tokens.

5. **Support tickets.** Pre-processed ticket summary: customer, issue category, priority, days open. 15 tickets: ~1,500 tokens.

6. **Gong summaries.** Pre-processed AI summaries from your own batch run, stored in warehouse. 8 calls: ~6,000 tokens.

Total: roughly 18,000 tokens. The same information, 95% cheaper.

---

## Why this matters more than your model choice

Teams spend a lot of energy debating Claude Sonnet vs. Haiku vs. Opus. The per-token price difference between models is real — Haiku is roughly 20x cheaper per token than Opus.

But if your data access pattern is burning 400,000 tokens on setup, the model choice is a rounding error on a rounding error. You're paying for context, not computation. And context costs scale with architecture, not with model tier.

Fix the architecture first. Then debate models.

---

## The session cost mental model

Think of every agent session as having two cost buckets:
- **Context cost:** what you pay to load information into the model's window
- **Reasoning cost:** what you pay for the model to think and respond

Most people optimize for reasoning cost (by choosing cheaper models). Most of the waste is in context cost (by fetching data badly).

A few principles that compound:

**Shape before you send.** If your API returns 40 fields and you need 6, filter at the tool level — not inside the prompt. Every extra field you pass is a token you pay for.

**Pre-process what doesn't change.** Yesterday's revenue numbers are the same whether you fetch them at 3 AM or 9 AM. Fetch them once, cache them, read from cache.

**Summarize before storing.** A 2-hour Gong recording transcript is 30,000 words. A good summary is 400. If you're going to use this in AI context repeatedly, the summarization step is worth paying once.

**Know your freshness requirements.** Not all data needs to be live. Pipeline state from this morning is fine for a daily brief. Real-time payment status matters for a customer call. Build your data access patterns around actual freshness requirements, not "always live is safest."

---

## The practical starting point

You don't have to rebuild everything at once. Start here:

1. **Identify the highest-cost pattern.** What does your agent load at session start that it could read from a pre-processed table instead?

2. **Write one warehouse view.** Take your most expensive live query and move it into a nightly materialized view. Measure the before/after token cost.

3. **Shape your top-five tools.** If you have native connectors pulling full API responses, write wrapper tools that return only the fields you actually use.

4. **Add a pre-fetch job.** A cron at 3 AM that runs your most common queries and caches results. User sessions read from cache. Token cost shifts to a background key.

The economics compound. Every tool you shape, every query you pre-process, every API call you replace with a warehouse lookup — it all reduces session startup cost, which is the biggest single line item in most AI agent budgets.`,
  },

  {
    slug: 'ai-agent-cold-start-caching',
    angle: 'process',
    title: 'Eliminating AI Agent Cold Start with Pre-Fetch Caching',
    excerpt: 'The most expensive moment for an AI agent is the first one. A cron job at 3–4 AM that pre-fetches and caches context eliminates cold start entirely — shifting token cost from user sessions to a background API key that runs once, not fifty times a day.',
    readTime: 8,
    cluster: 'Infrastructure & Deployment',
    body: `The worst time to fetch data is when the user is waiting for an answer.

Not just because it's slow — though it is. But because in an AI agent context, fetching at session start means you're paying for that data 50 times a day (once per session, for every user), when you could be paying for it once (overnight, in a batch job the user never sees).

This is the cold start problem. And the fix is straightforward once you see it.

---

## What cold start actually is

Cold start is the latency and cost of populating an agent's context from scratch at session start. The agent needs to know the state of the world — your pipeline, your open tickets, your recent meetings — before it can do anything useful.

If you fetch that data live at session start:
- **Latency:** The user waits while APIs respond
- **Cost:** You pay for the same data 50 times (once per session per user)
- **Reliability:** If HubSpot is slow or Intercom has a hiccup, the agent's startup fails

If you pre-fetch and cache overnight:
- **Latency:** Zero. The data is already there.
- **Cost:** You pay once per data source per day, not once per session
- **Reliability:** API failures don't affect user sessions

---

## The pattern

The pre-fetch pattern has four steps:

**1. Identify what data the agent needs at session start.**
What does your agent load before it can answer the first question? Pipeline state? Meeting notes from yesterday? Open support tickets? This is your pre-fetch candidate list.

**2. Write a cron job that runs at 3–4 AM.**
This job calls all your data sources, processes the responses, and writes results to a cache layer (a database table, a Redis key, an S3 object — whatever fits your stack).

**3. Agent sessions read from cache.**
When a user starts a session, the agent reads from the pre-fetched cache instead of calling APIs live. Session startup becomes a few fast reads instead of a dozen slow API calls.

**4. Token cost shifts to the background pool.**
Instead of 50 sessions each paying for cold start, one background job pays for it once.

---

## Implementation

Here's what a pre-fetch job looks like in practice:

\`\`\`typescript
// cron-prefetch.ts — runs at 03:00 UTC daily

import { createClient } from '@supabase/supabase-js'
import { fetchHubspotPipeline } from './connectors/hubspot'
import { fetchOpenTickets } from './connectors/intercom'
import { fetchGongSummaries } from './connectors/gong'
import { fetchGranolaYesterday } from './connectors/granola'

const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)

async function runPrefetch() {
  const date = new Date().toISOString().split('T')[0]

  // Fetch and process each source
  const [pipeline, tickets, callSummaries, meetingNotes] = await Promise.all([
    fetchHubspotPipeline(),         // Returns shaped summary, not full objects
    fetchOpenTickets(),             // Returns status + priority, not full threads
    fetchGongSummaries({ days: 7 }),// AI-summarized, not raw transcripts
    fetchGranolaYesterday(),        // Action items extracted, not raw notes
  ])

  // Write to cache table
  await sb.from('agent_context_cache').upsert({
    cache_key: \`daily_context_\${date}\`,
    pipeline,
    tickets,
    call_summaries: callSummaries,
    meeting_notes: meetingNotes,
    generated_at: new Date().toISOString(),
  }, { onConflict: 'cache_key' })

  console.log(\`Prefetch complete: \${date}\`)
}

runPrefetch().catch(console.error)
\`\`\`

And the session startup becomes:

\`\`\`typescript
// agent-session.ts

async function getSessionContext(userId: string): Promise<string> {
  const date = new Date().toISOString().split('T')[0]

  const { data } = await sb
    .from('agent_context_cache')
    .select('*')
    .eq('cache_key', \`daily_context_\${date}\`)
    .single()

  if (!data) {
    // Fallback: fetch live if cache miss (rare — only on first run or failures)
    return await fetchContextLive(userId)
  }

  return formatContextForAgent(data, userId)
}
\`\`\`

Session startup goes from "call 6 APIs and wait" to "read one database row."

---

## What to cache vs. what to keep live

Not everything belongs in the pre-fetch. The rule is simple: if the data changes faster than your cache refresh cycle and the user needs the freshest version, keep it live.

| Cache it | Keep live |
|---|---|
| Meeting notes from yesterday | Current support conversation |
| CRM pipeline state | Real-time payment status |
| Yesterday's revenue numbers | Live inventory count |
| Roadmap and Notion docs | Active Slack thread |
| Gong call summaries (last 7 days) | Chat message someone just sent |
| Open ticket list (summary) | Whether a payment is processing right now |
| Weekly pipeline health | Real-time stock or pricing data |

The pattern: **aggregate or summarized views of past data** get cached. **Real-time status of active operations** stays live.

In practice, this means the pre-fetch handles 80–90% of what agents read at session start. The few live calls that remain are fast (single-record lookups) and necessary (payment status, active conversations).

---

## Staleness handling

The obvious objection: what if the data changes during the day and the cache is stale?

A few approaches, depending on how much freshness matters:

**Per-user timestamp checks.** When the agent reads from cache, it includes the cache generation time in the context. "As of this morning's data..." This sets expectations and gives Claude a signal to flag when freshness matters.

**Invalidation hooks.** If a deal closes mid-day, a webhook hits your cache invalidation endpoint, which marks that record as stale and triggers a targeted refresh for that customer only.

**Explicit live lookups.** Your agent knows which tools are cached vs. live. When a user asks about a specific customer's current status, the tool routes to the live API. When they ask about pipeline trends, it reads from cache. The routing is explicit, not implicit.

**Multiple cache windows.** Hourly cache for data that changes fast (ticket status), daily cache for data that changes slowly (deal stages, Notion docs), weekly cache for data that almost never changes (historical revenue, old meeting summaries).

---

## The economics

Let's make this concrete. Assume:
- 50 active users per day
- Each session previously fetched from 6 live sources
- Average cold start cost: 400,000 tokens × $3/M input = $1.20 per session
- Total daily cold start cost (50 users): $60

With pre-fetch caching:
- One background job fetches all 6 sources once
- Cost of the background job: ~100,000 tokens × $3/M input = $0.30
- Per-session startup: reading from cache = near zero tokens
- Total daily cost: $0.30

That's a $59.70 daily savings — or roughly $1,800/month — from one overnight cron job.

The numbers will vary. The pattern doesn't. Pre-fetching converts per-session cost to per-day cost. At any reasonable team size, that arithmetic is compelling.

---

## The hidden benefit: reliability

The cost savings are the headline. The operational benefit that shows up later is reliability.

When your agent cold-starts from live APIs, every API dependency is in the critical path of user sessions. If HubSpot is slow (or down), your agent is slow (or broken). If Gong's API is rate-limited, your session startup fails.

With pre-fetch caching, those APIs are called once a day in a background job at 3 AM. If the background job fails, you catch it in monitoring, fix it, and the user sessions run on yesterday's cache. The user experience degrades gracefully — slightly stale data — rather than failing hard.

---

## Getting started

**Week 1:** Identify your highest-cost cold start items. Measure the actual token cost of your session startup (log it if you don't already). Find the biggest offenders.

**Week 2:** Write a pre-fetch job for the top two or three sources. Keep it simple — fetch, process, write to a table.

**Week 3:** Wire your agent sessions to read from cache first, fall back to live on miss.

**Week 4:** Add monitoring. Track cache hit rate, cache generation time, staleness at session start. Now you have visibility into something that was previously invisible.

The infrastructure investment is a few days of engineering. The payoff runs every day.`,
  },

  {
    slug: 'ai-agent-access-control',
    angle: 'process',
    title: 'Access Control for AI Agents — Why "Everyone Gets Everything" Breaks at Scale',
    excerpt: 'When you give AI access to company data, tool-level, group-level, and user-level access control needs to be built into the architecture — not enforced by prompt. The difference: a sales rep\'s Claude never even sees payroll tools. They don\'t exist in their tool list.',
    readTime: 9,
    cluster: 'Infrastructure & Deployment',
    body: `When you first give your team access to Claude connected to company data, the easy path is everyone gets everything. One configuration, all tools available to all users. Simple to set up.

This breaks in two ways. Fast.

The first way is the obvious one: someone accesses something they shouldn't. A sales rep pulls payroll data because they were curious. An intern sees customer billing details. It's usually not malicious — people just use what's in front of them. But the exposure is real.

The second way is subtler: the AI stops feeling like a tool and starts feeling like a liability. When executives realize that junior employees can ask Claude to pull org chart changes, executive comp surveys, or financial projections — the enterprise AI program gets a pause meeting. Not because of what happened, but because of what *could* happen. And you lose months of momentum.

Access control isn't about distrust. It's about making the AI feel appropriately shaped to each person's role — so it stays trusted.

---

## The three layers you need

Solid AI access control has three layers:

**Tool-level permissions.** Each tool has an enable/disable toggle and a required permission level. The payroll query tool requires the \`hr_admin\` permission. The billing lookup requires \`finance_read\`. A sales rep's tool list doesn't include these tools — not because they're blocked at runtime, but because they're never offered.

**Group-level assignment.** Users are assigned to permission groups: \`sales\`, \`finance\`, \`cs\`, \`engineering\`, \`executive\`. Each group has a set of tools it can use. An executive group might get read access to everything. A CS group gets customer profiles and support tools. Sales gets CRM and call data.

**User-level overrides.** Occasionally, a specific person needs access that doesn't fit neatly into their group. A sales engineer who needs to see certain technical docs. A manager who needs one-time access to a report. The system supports per-user exceptions without having to create new groups.

---

## How the ACL middleware works

The ACL middleware is the enforcement layer. It sits between Claude and every tool call.

\`\`\`typescript
// acl-middleware.ts

interface CallerContext {
  user_id: string
  org_id: string
  permission_group: string
  permissions: string[]  // e.g., ['crm_read', 'calls_read', 'tickets_read']
}

async function handleToolCall(
  toolName: string,
  params: Record<string, unknown>,
  caller: CallerContext
): Promise<ToolResult> {

  const toolConfig = TOOL_REGISTRY[toolName]

  // Tool doesn't exist
  if (!toolConfig) {
    return { error: 'Tool not found', code: 404 }
  }

  // Check permission
  const hasPermission = toolConfig.requiredPermissions.every(
    p => caller.permissions.includes(p)
  )

  if (!hasPermission) {
    // Log the attempt (useful for auditing)
    await logToolCall({
      user_id: caller.user_id,
      tool: toolName,
      status: 'denied',
      timestamp: new Date().toISOString(),
    })
    // Return a clean denial — don't leak what the tool does
    return { error: 'Not authorized', code: 403 }
  }

  // Inject caller identity into every call — tools never trust user-provided IDs
  const enrichedParams = {
    ...params,
    _caller_user_id: caller.user_id,
    _caller_org_id: caller.org_id,
  }

  // Execute the tool
  const result = await executeToolImpl(toolName, enrichedParams)

  // Log the successful call
  await logToolCall({
    user_id: caller.user_id,
    tool: toolName,
    status: 'success',
    timestamp: new Date().toISOString(),
  })

  return result
}
\`\`\`

The key move in the middleware: caller identity (\`user_id\`, \`org_id\`) is injected by the server, not provided by the user or the prompt. A user cannot claim to be someone else to get different data. The identity comes from the authenticated session — it's a fact, not a parameter.

---

## What tools each role sees

The principle is that unauthorized tools don't appear in Claude's tool list at all. This isn't just a UX nicety — it prevents Claude from offering to do things it can't actually do, which would be confusing and erode trust.

Here's a rough mapping of who sees what:

| Tool | Sales | Finance | CS | Engineering | HR | Executive |
|---|---|---|---|---|---|---|
| \`get_deal_history\` | ✓ | ✓ | — | — | — | ✓ |
| \`get_call_transcript\` | ✓ | — | ✓ | — | — | ✓ |
| \`get_billing_status\` | — | ✓ | ✓ | — | — | ✓ |
| \`get_ar_aging_report\` | — | ✓ | — | — | — | ✓ |
| \`get_employee_compensation\` | — | — | — | — | ✓ | ✓ |
| \`get_deploy_status\` | — | — | — | ✓ | — | ✓ |
| \`run_sql_query\` | — | ✓ | — | ✓ | — | ✓ |
| \`get_customer_profile\` | ✓ | ✓ | ✓ | — | — | ✓ |
| \`get_roadmap\` | — | — | — | ✓ | — | ✓ |

Sales sees deal history, call transcripts, customer profiles. Finance sees billing, AR, and SQL access. CS sees customer profiles and billing status. Engineering sees deploy status, roadmap, and SQL. HR sees compensation. Executives see everything.

None of these are enforced by telling Claude "don't tell sales reps about payroll." The tools don't exist for them. There's nothing to enforce.

---

## The audit log

Every tool call gets logged. This is non-negotiable for any enterprise AI setup.

Your audit log should capture:
- \`user_id\` — who made the call
- \`tool_name\` — what they called
- \`params\` — what they passed (sanitized if needed)
- \`status\` — success or denied
- \`timestamp\` — when
- \`response_hash\` — a hash of what was returned (not the full response, but enough to reconstruct if needed)

The audit log answers two questions:
1. **Retroactive:** "Who looked at customer X's billing data last Tuesday?" Now you can find out.
2. **Proactive:** "Is anyone calling the payroll tool more than 20 times a day?" That's an anomaly worth investigating.

\`\`\`typescript
// Simple audit log table schema
// tool_calls (
//   id uuid primary key,
//   user_id text not null,
//   org_id text not null,
//   tool_name text not null,
//   params jsonb,
//   status text,  -- 'success' | 'denied' | 'error'
//   response_hash text,
//   duration_ms integer,
//   created_at timestamptz default now()
// )
\`\`\`

---

## What goes wrong without this

**The trust event.** An executive finds out that junior employees have been asking Claude to pull deal data, comp information, or budget numbers. Not because it was misused — because it *could* be. The enterprise AI program gets halted while a governance review happens. You lose two months.

**The prompt-as-policy failure.** You add "don't share financial data with non-finance users" to your system prompt. It works until it doesn't. Claude interprets a question differently than you expected. A clever user phrases the request in a way that bypasses the instruction. Prompt-as-policy is not enforcement — it's hope.

**The scope creep problem.** You add a new data source (say, your HR system) and it's technically available to all users because you didn't think about the access control when you wired it in. A week later someone pulls org data they shouldn't have. Now you're cleaning up instead of building.

**The compliance problem.** Financial data, PII, health information — many data types have regulatory implications for who can access them. "Claude just has access to everything" is not a defensible audit response.

---

## What to build first

If you're building this from scratch, the order matters:

1. **Permission groups first.** Define your groups before you define your tools. What roles exist in your organization? What data does each role legitimately need?

2. **Tool-level permission requirements.** For each tool you build, define which permissions it requires. Start strict — you can always loosen.

3. **ACL middleware.** Build the check-before-execute layer. This is the piece that makes everything else meaningful.

4. **Identity injection.** Every tool call gets caller identity passed in automatically. No exceptions.

5. **Audit logging.** From day one. Not retroactively.

6. **Tool list filtering.** The session initialization step that builds Claude's available tool list based on the caller's permission group. Unauthorized tools are never offered.

This is a few days of engineering work. It's the foundation that everything else builds on. And unlike most infrastructure, the value shows up in what doesn't happen — the data exposure that didn't occur, the trust event that didn't derail your program.`,
  },

  {
    slug: 'live-api-vs-etl-for-ai',
    angle: 'process',
    title: 'Live API vs. ETL: Choosing the Right Data Access Pattern for AI Agents',
    excerpt: 'Not all data needs to be in a warehouse. Not all data can wait for an ETL cycle. The right pattern depends on freshness requirements, query shape, and whether the operation writes or reads — and in practice, you use both through the same internal MCP server.',
    readTime: 8,
    cluster: 'Infrastructure & Deployment',
    body: `Every AI agent data question eventually hits the same fork: should this come from a live API call or from the data warehouse?

The naive answer is "live is always better because it's fresher." The expensive answer is "warehouse for everything because it's cheaper." Neither is right. The actual answer depends on what you're asking, how quickly the data changes, and whether you need to write anything back.

Here's how to make the call.

---

## The decision framework

| Question | Live API | ETL / Warehouse |
|---|---|---|
| Does freshness matter (< 1 hour)? | ✓ | — |
| Is it a single record lookup? | ✓ | Either |
| Is it an aggregate or bulk query? | — | ✓ |
| Do you need to join across systems? | — | ✓ |
| High-volume (millions of rows)? | — | ✓ |
| Write / update (not just read)? | ✓ | — |
| Can you tolerate a few hours of lag? | — | ✓ |
| Does the data change multiple times per hour? | ✓ | — |

The logic behind each row:

**Freshness < 1 hour.** An ETL cycle typically runs every few hours, or nightly. If the answer to "did this customer's payment clear?" changes faster than your ETL runs, you need a live API call. If yesterday's revenue numbers are accurate enough, the warehouse is fine.

**Single record lookup.** Both patterns work for looking up one customer. The live API is fresher; the warehouse is cheaper. The tiebreaker is usually freshness requirements.

**Aggregate or bulk query.** "What's our average deal size by sales rep this quarter?" requires scanning potentially thousands of deal records. A live API call that touches HubSpot's endpoint for each deal doesn't scale. The warehouse is built for this.

**Cross-system joins.** "Which customers have an open support ticket and a renewal coming up this quarter?" touches Intercom and HubSpot. Your live APIs don't know about each other — you'd need to make two calls and manually join the results. The warehouse has both datasets and can join them in SQL.

**Write operations.** If Claude is updating a record — marking a task complete, logging a note, changing a deal stage — that has to go through the live API. Warehouses are (almost always) read-only.

---

## What this looks like in practice

Take a customer success manager using Claude as an assistant. Here are some of the questions they ask in a day:

| Query | Pattern | Why |
|---|---|---|
| "What's the renewal status for Acme Corp?" | Live API | Payment status changes fast |
| "Which accounts have low product usage this month?" | Warehouse | Aggregate, cross multiple tables |
| "Who did I talk to at Acme last week?" | Warehouse | Historical, logged at ETL time |
| "Log a note on the Acme deal" | Live API | Write operation |
| "What's our average renewal rate by industry?" | Warehouse | Aggregate, single query |
| "Did the payment for Acme come through?" | Live API | Real-time status |
| "Which customers renewed in Q1 vs. Q2 last year?" | Warehouse | Historical aggregate |

The same agent, the same session, uses both patterns. The caller doesn't need to know which one — the internal MCP server routes based on the tool definition.

---

## Building the routing layer

The beauty of going through an internal MCP server is that the client (Claude) doesn't care which path a tool takes. The tool is named and described; the implementation detail is hidden.

\`\`\`typescript
// Tool definition — client sees this
{
  name: 'get_customer_renewal_status',
  description: 'Returns the current renewal status for a customer, including payment status and contract end date. Use for real-time renewal questions.',
  // ... schema
}

// Tool implementation — routes to live API
async function get_customer_renewal_status({ customer_id }) {
  // This goes live — renewal status changes hourly
  return await chargeoverClient.getSubscription(customer_id)
}

// ────────────────────────────────────────────────

// Another tool definition
{
  name: 'get_renewal_cohort_analysis',
  description: 'Returns renewal rates by cohort, industry, and plan type. Use for trend analysis and reporting.',
  // ... schema
}

// Tool implementation — routes to warehouse
async function get_renewal_cohort_analysis({ quarter, group_by }) {
  // This goes to warehouse — aggregate query over historical data
  return await warehouse.query(\`
    SELECT
      \${group_by},
      COUNT(*) as total,
      SUM(CASE WHEN renewed THEN 1 ELSE 0 END) as renewed,
      ROUND(AVG(CASE WHEN renewed THEN 1.0 ELSE 0.0 END) * 100, 1) as renewal_rate
    FROM renewals
    WHERE quarter = ?
    GROUP BY \${group_by}
  \`, [quarter])
}
\`\`\`

Same server, two different backends, clean abstraction for Claude.

---

## The hybrid pattern: warehouse with live fallback

The most practical architecture for many teams is a hybrid: the warehouse is the primary data source, with live API fallback for fields where freshness matters.

\`\`\`typescript
async function get_customer_profile({ customer_id }) {
  // Start with warehouse — has most of what we need
  const baseData = await warehouse.query(\`
    SELECT
      name, industry, arr, deal_stage, health_score,
      last_payment_date, renewal_date, open_tickets
    FROM customer_summary
    WHERE customer_id = ?
  \`, [customer_id])

  // Augment with live payment status — this changes fast
  const paymentStatus = await chargeoverClient.getCurrentStatus(customer_id)

  return {
    ...baseData,
    payment_status: paymentStatus.status,  // Live
    payment_as_of: new Date().toISOString(),
  }
}
\`\`\`

The result: 90% of the profile from a fast warehouse query, the high-freshness field from a targeted live call. Best of both patterns, minimal token cost.

---

## ETL pipeline considerations for AI workloads

If you're building ETL for AI agent consumption (not just BI dashboards), a few things matter that don't matter for traditional analytics:

**Flatten your schemas.** BI analysts write complex SQL. AI agents work better with pre-joined, flat tables. Build dedicated customer summary views that already have all the relevant fields joined in.

**Add summary fields.** Instead of a raw ticket count, store \`open_high_priority_tickets\`, \`days_since_last_activity\`, \`onboarding_completion_pct\`. These are the fields Claude will actually use.

**Version your ETL output.** When your ETL schema changes, old cached values can confuse Claude if it's reading a mix of old and new formats. Version your output tables and have the MCP layer reference the current version explicitly.

**Log ETL run times.** The MCP server should know when the last ETL completed. It can include that in context: "data as of 3:42 AM today." This lets Claude accurately caveat time-sensitive answers.

**Monitor for ETL lag.** If your ETL is supposed to run at 3 AM and it actually ran at 7 AM (because it failed and retried), the agent is working with 4 hours less fresh data than expected. Alerting on ETL lag is as important as alerting on API downtime.

---

## Common mistakes

**Using live API for everything.** Works fine with one user and one service. Breaks fast when you have 50 users, 10 connected services, and agents that make multiple calls per session. Token costs and API rate limits both become problems.

**Using warehouse for everything.** Your ETL runs at 3 AM. A user asks "did Acme's payment clear this morning?" Your warehouse says no (because the payment came in at 9 AM). The user thinks there's a billing problem. There isn't — the data is just stale. Warehouse-for-everything breaks on freshness-sensitive queries.

**Not communicating data freshness.** Claude should know (and tell the user) when data was last refreshed. "Based on data as of this morning" is a materially different claim than "as of right now." Build this into your tool responses.

**Writing back through warehouse.** This seems obvious but it still happens: someone tries to close a deal by writing a row to the warehouse. The warehouse is read-only (or should be). All write operations go through live APIs.

---

## The right mental model

Think of your data access layer like a caching strategy in software engineering:

- **Hot cache (live API):** The freshest data, highest cost, needed for real-time operations
- **Warm cache (internal MCP with shaped responses):** Pre-fetched, cheaper, good for most queries
- **Cold cache (warehouse):** Batch processed, cheapest, great for aggregates and history

Most data access patterns are warm cache or cold cache. Live API is the exception, not the default. Building with that mental model — and routing explicitly based on freshness requirements — is what separates AI infrastructure that scales from AI infrastructure that gets expensive and slow.`,
  },

  {
    slug: 'data-warehouse-for-ai-agents',
    angle: 'cross',
    title: 'BigQuery vs StarRocks for AI Agent Workloads',
    excerpt: 'BigQuery is the default for data teams, but per-query pricing and cold start latency make it expensive when AI agents are making dozens of small queries throughout the day. StarRocks — flat monthly pricing, sub-second latency, MySQL-compatible SQL — is often a better fit.',
    readTime: 9,
    cluster: 'Infrastructure & Deployment',
    body: `Most data teams already have BigQuery. It's the default for Google Cloud shops, it handles scale well, and the serverless model means you don't manage infrastructure. For traditional analytics workloads — a few large queries per day, run by analysts who are used to waiting 5-10 seconds — it works well.

AI agents are not traditional analytics workloads. They make many small queries, throughout the day, from user sessions that have latency expectations. The economics that work for BI break for agent workloads.

This isn't a verdict on BigQuery — it's genuinely excellent software. It's an honest look at where the mismatch is, and when a different database fits better.

---

## The AI agent query pattern

Traditional BI queries: 3-5 per day, large scans, analysts tolerate 5-30 seconds of latency.

AI agent queries: 20-100+ per day per agent, small lookups, users expect 1-2 second responses.

That pattern difference matters for two things: pricing and latency.

**Pricing.** BigQuery charges by data scanned. A query that scans 1 TB costs about $5. That's fine when you're running it twice a day. It gets expensive when 50 agents are each running 20 queries daily.

The math: 50 agents × 20 queries/day × $0.25/query (rough estimate for typical AI-scale queries) = $250/day = $7,500/month. That's before you've done any of your other BigQuery analysis.

**Latency.** BigQuery has cold start time. A query that hasn't been run recently takes 2-5 seconds before it even starts processing. For a BI analyst waiting on a dashboard, that's acceptable. For an AI agent session where the user is waiting for a response, it adds up.

---

## BigQuery: what it does well

To be fair about where BigQuery genuinely excels:

**Massive scale.** If you're scanning petabytes of data, BigQuery is the right tool. The serverless architecture handles data volumes that would require significant infrastructure management elsewhere.

**Complex analytics.** Sophisticated window functions, nested/repeated fields, BigQuery ML — for analysts doing complex analysis, these features matter.

**Google Cloud integration.** If you're already in GCP, BigQuery integrates cleanly with everything else: Data Studio, Looker, Pub/Sub, Cloud Functions.

**No infrastructure management.** You don't manage nodes, you don't worry about capacity planning, you don't deal with cluster rebalancing. It just works at any scale.

For traditional BI workloads in a GCP environment, BigQuery is hard to beat.

---

## Where BigQuery struggles for AI agents

**Per-query cost model.** Every time an AI agent queries BigQuery, you pay for the data scanned. Agents don't batch queries — they respond to user questions as they come in. The cost structure that works for "run 5 reports a day" doesn't work for "answer 100 questions a day across 50 users."

You can mitigate this with:
- Materialized views (but they add complexity)
- Partition pruning and clustering (requires schema discipline)
- BI Engine (reservation pricing, but adds another cost layer)
- Caching (Anthropic prompt caching or your own — helps but doesn't solve it)

These are real solutions, but they add engineering overhead to a system that should be straightforward.

**Cold start latency.** BigQuery's 2-5 second cold start is invisible to a dashboard user who expects to wait. It's visible to an agent user who's watching a spinner.

**Query costs for small lookups.** BigQuery charges on data scanned, not rows returned. If you run \`SELECT * FROM customer_summary WHERE customer_id = '123'\` on a table with 100,000 customers, you're scanning a lot to return one row. Partitioning helps, but it requires intentional schema design.

---

## StarRocks: what it is and why it fits differently

StarRocks is an open-source OLAP database optimized for real-time analytics. It's MySQL-compatible (your SQL just works), runs as a cluster you manage (or use a managed version), and is designed for sub-second query latency on large datasets.

The key differences for AI agent workloads:

**Flat pricing.** Whether you're running 5 queries or 500, your monthly cost is the same. For AI agents making frequent queries, this is a significant advantage. A t2 StarRocks cluster on a managed provider runs roughly $200-400/month regardless of query volume.

**Sub-second latency.** StarRocks is built for real-time query response. Typical analytical queries on millions of rows return in under a second. The cold start problem doesn't exist in the same way — the cluster is always warm.

**MySQL compatibility.** Your existing SQL works. No need to learn BigQuery-specific syntax or rewrite queries for a new dialect.

**Index support.** BigQuery doesn't have traditional indexes (it uses partitioning and clustering instead). StarRocks supports bitmap indexes, sorted keys, and materialized views — useful for the specific query patterns AI agents run (frequent lookups by customer ID, user ID, date ranges).

---

## Direct comparison for AI workloads

| Dimension | BigQuery | StarRocks |
|---|---|---|
| Pricing model | Per TB scanned | Flat monthly |
| Cold query latency | 2-5 seconds | < 1 second |
| Management overhead | None (serverless) | Cluster management |
| MySQL compatibility | No (BigQuery SQL) | Yes |
| Scale ceiling | Effectively unlimited | Cluster-bound (but large) |
| AI agent economics | Expensive at volume | Predictable |
| Setup complexity | Low | Medium |
| Ecosystem integration | Deep (GCP) | Vendor-neutral |
| Index support | Partitioning/clustering | Full index support |

---

## When to use each

**Use BigQuery when:**
- You're already heavily invested in GCP and the integration value is real
- Your query volume is low (< 50 queries/day across all agents)
- You're doing complex analytics alongside AI queries — the analyst use case is primary
- You need petabyte scale
- You don't want to manage infrastructure

**Use StarRocks when:**
- AI agents are the primary consumer of the database
- Query frequency is high (100+ queries/day)
- Latency matters — users expect fast responses
- You want predictable infrastructure costs
- Your team is comfortable managing a cluster (or using a managed StarRocks provider)

**Use both when:**
- You have existing BigQuery investment and active BI usage
- AI agents need fast, frequent queries
- Pattern: BigQuery for batch analytics and large-scale processing, StarRocks for the agent-facing query layer

The hybrid approach lets you keep BigQuery for what it does well (large-scale analytics, GCP integration) while adding StarRocks as a purpose-built layer for AI workloads.

---

## The migration path

If you're on BigQuery and want to add a faster, cheaper query layer for agents:

**Step 1:** Identify which queries your agents run most frequently. Log all MCP tool calls for a week. Find the top 10 query patterns.

**Step 2:** Spin up a StarRocks cluster. Managed options (CelerData, StarRocks Cloud) have reasonable free tiers for evaluation.

**Step 3:** Replicate the relevant tables. You don't need to move everything — just the tables your agents actually query.

**Step 4:** Update your MCP tools to point to StarRocks for agent queries. Keep BigQuery for batch analytics.

**Step 5:** Measure. Compare latency and monthly cost before and after.

The migration is mostly a data pipeline addition, not a replacement. Both databases coexist — they just handle different workloads.

---

## The query that illustrates the difference

To make this concrete: a customer success agent running a daily brief needs to query:
- Customer health scores for their portfolio (50 customers)
- Open support tickets per customer
- Renewal dates coming up in 90 days
- Recent call activity

On BigQuery (no optimization): 4 separate queries, 2-5 second cold start on the first, ~10 seconds total, billing for all data scanned.

On StarRocks: 1-2 queries with pre-joined views, sub-second response on each, flat monthly cost regardless of frequency.

At one agent with one daily brief, the difference doesn't matter much. At 50 agents running multiple queries throughout the day, the difference is $4,000-6,000 per month and noticeably faster response times.

That's the AI agent economics argument in one example.`,
  },

  {
    slug: 'building-ai-skills-for-your-team',
    angle: 'process',
    title: 'Building AI Skills: Turning Repeated Workflows into Reusable Tools Your Whole Team Can Use',
    excerpt: 'A skill is a reusable, parameterized AI workflow stored as a markdown file — a function call where the function is a multi-step AI process. Teams use them to encode institutional knowledge so every team member gets the same quality result on demand, not just the person who figured it out first.',
    readTime: 10,
    cluster: 'Agents & Orchestration',
    body: `There's a person on every team who gets dramatically better results from AI than everyone else. They've figured out the right questions to ask, the right data to pull in, the right output format to request. They do it quickly, consistently, and the output is actually useful.

The problem: that knowledge lives in their head. When they're out sick, in back-to-back meetings, or on vacation, their teammates either don't run the workflow at all or run it badly.

A skill is how you capture what they know and make it available to everyone.

---

## What a skill actually is

A skill is a SKILL.md file that contains:
- A description of what the skill does (used for discovery — how does Claude know when to invoke it?)
- Trigger phrases that activate it
- Step-by-step instructions for how to execute the workflow
- The expected output format
- Which tools to call and in what order

Claude Code loads these files at session start. When a user says "run the deal intel report" or "pull the BDR audit," Claude matches the request against the trigger phrases in the skill files and executes the defined workflow.

A skill is stored in a plugin folder. The plugin is just a directory with a skills/ subfolder. You publish a new skill with a PR. Any team member with Claude Code access gets it immediately.

---

## A concrete example: the deal intelligence skill

Here's what a deal intelligence skill file looks like:

\`\`\`markdown
# Deal Intelligence Report

## Description
Generates a structured Deal Intelligence Report for one or more HubSpot deals,
pulling from HubSpot CRM and Gong call data to produce a three-section report:
Discovery (when it started), How It Went (engagement timeline), How's It Going
(current status and risks).

## When to use
When someone asks to "run the deal intel report", "pull deal history", "give me
the full story on [company]", or wants to understand a prospect's engagement
timeline.

## Steps

1. Ask which company or deal to analyze (if not specified)
2. Call \`get_deal_by_company_name\` with the company name
3. Call \`get_gong_calls_for_deal\` with the deal ID
4. Call \`get_hubspot_activity_timeline\` with the deal ID
5. Call \`get_contact_history\` for each primary contact on the deal

## Output format

### Discovery
[When the deal entered the pipeline, how it was sourced, first contact date,
who initiated, what problem they were trying to solve]

### How It Went
[Chronological timeline of touchpoints: demo calls, follow-up emails,
objections raised, stakeholders involved, notable moments]

### How's It Going
[Current stage, days in stage, risk signals (no activity > 14 days, key
stakeholder went dark, competing vendor mentioned), recommended next action]
\`\`\`

When a sales rep says "give me the full history on Acme," Claude loads this skill, follows the steps, makes the tool calls in order, and generates a formatted report — pulling from HubSpot and Gong automatically.

The sales rep who figured out this workflow did so once. Now it's a skill the whole team uses.

---

## What makes a good skill candidate

Not every workflow should be a skill. The economics favor skills that are:

**Repeated.** If someone does it less than once a month, the overhead of maintaining a skill file isn't worth it. Good candidates run weekly or daily.

**Consistent.** The workflow should have roughly the same steps every time. If every execution is genuinely different, a skill won't capture it well.

**Multi-step.** A skill where Claude just calls one API and returns the result isn't much better than calling the API directly. The value is in encoding complex sequences — call this API, then join with that one, then apply this logic, then format like this.

**Skill-dependent.** The "good output" depends on knowing your business context, not just executing the workflow. The deal intel skill is better because the person who wrote it knows that call transcripts under 30 minutes usually mean the prospect wasn't engaged, and the skill flags that. That's institutional knowledge encoded in the instructions.

---

## High-value skills across teams

Different teams have different high-value workflows. Here are real examples:

**Sales:**
- *Deal intelligence report* — full engagement history from HubSpot + Gong for any deal
- *Pre-call research brief* — pull everything known about a prospect before a meeting
- *BDR compliance audit* — scan pipeline against SOP, flag accounts without follow-up within 48 hours

**Finance:**
- *Monthly variance report* — compare actuals from QuickBooks against forecast, flag significant variances
- *Revenue recognition summary* — pull ChargeOver data, apply recognition rules, format for the CFO
- *Vendor spend summary* — aggregate all AP from QuickBooks by vendor for budget review

**Customer Success:**
- *Account health brief* — product usage, open tickets, renewal status, last call summary
- *QBR prep* — pull all relevant data for a quarterly business review, generate talking points
- *Renewal risk report* — scan all accounts coming up for renewal, flag those with risk signals

**Engineering:**
- *PR review brief* — summarize recent PRs by area, flag anything touching critical paths
- *Deploy status check* — check recent deploys, error rates, any active incidents
- *Dependency audit* — scan package.json for known vulnerability flags

**Operations:**
- *Weekly meeting brief* — pull yesterday's Granola notes, extract action items, format agenda for standup
- *Event pipeline tracker* — group conference-sourced deals by event, show stage distribution

---

## The skill lifecycle

**1. Identify a repeated workflow.**
Watch your team. When does the same person do the same sequence of steps more than once a week? Interview them: "walk me through what you do when you need to prep for a customer call." That's your skill.

**2. Write the SKILL.md.**
Start with the description and trigger phrases. Then document the steps as specifically as you can. What tools get called? In what order? What logic is applied to the results? What does the output look like?

**3. Test and iterate.**
Give the skill to the person who originally did the workflow manually. Ask them to run it for 10 real cases. What does it get wrong? What does it miss? What would they do differently? Update the skill based on their feedback.

**4. Publish to the team plugin.**
Add the skill file to the plugin's skills/ directory. Open a PR. Merge. Every team member with Claude Code access gets it at their next session start.

**5. Maintain it.**
Workflows change. Data sources change. Output formats change. Treat skills like code — they need maintenance. A designated "skill owner" per skill (usually the person who originally did the workflow) is responsible for keeping it current.

---

## How skills call tools

Skills invoke tools through MCP. When the skill says "call \`get_deal_by_company_name\`," Claude makes an MCP tool call to your internal MCP server, which routes to HubSpot, applies ACL checks, shapes the response, and returns clean data.

The skill itself doesn't know about HubSpot's API. It knows about the tool name. This means:
- If you change from HubSpot to Salesforce, you update the MCP tool implementation — not all the skills that use it
- Access control is enforced at the MCP layer — a sales rep can run the deal intel skill, but a skill that requires \`hr_admin\` permission won't work for them even if they have the skill file
- Logging happens at the MCP layer — every tool call is audited regardless of which skill triggered it

---

## The compounding effect

The value of skills compounds in a specific way: each skill you publish makes the next skill more valuable.

When you have one skill (deal intel report), you have one workflow automated. When you have ten skills (deal intel, pre-call brief, BDR audit, QBR prep, variance report, account health, deploy status, PR review, vendor spend, event pipeline), each team member has a toolbox of institutional knowledge they can invoke on demand.

The CS manager who goes on parental leave doesn't need to document everything — the skills encode their workflows. The new hire on day three can run the same account health brief as the five-year veteran.

And as you add more MCP tools (more data sources, more services), every existing skill that calls those tools gets more powerful automatically.

---

## Getting started

The fastest path to a working skill:

**This week:** Pick one workflow that someone on your team does manually more than twice a week. Interview them for 30 minutes. Write the SKILL.md based on that interview.

**Next week:** Test it with the same person on 5-10 real cases. Fix what's wrong.

**Week three:** Publish it to your plugin. Watch what the rest of the team does with it.

**Month two:** Build the second skill based on what you learned from the first.

The first skill takes a week. The second takes three days. The tenth takes a day. By month six, your team is running a dozen workflows that used to require the institutional knowledge of specific people — and anyone can run any of them.`,
  },

  {
    slug: 'internal-ai-stack-architecture',
    angle: 'field-note',
    title: 'The Internal AI Stack: What It Looks Like When You Build It Properly',
    excerpt: 'Most teams are still at the ChatGPT-tab stage. A mature internal AI stack has five layers. Here\'s what each layer does, how they connect, and the metrics that tell you it\'s working — versus the metrics that tell you you\'re still paying 400k tokens to get started.',
    readTime: 11,
    cluster: 'Infrastructure & Deployment',
    body: `Most AI rollouts look like this: someone on the team discovers Claude is useful, tells their manager, the manager approves a company account, the team starts using it for drafting things. After a few months, usage is uneven — a handful of people use it heavily, most use it occasionally for simple tasks, and no one is quite sure what value they're actually getting.

This isn't a failure. It's Phase 1. Individual discovery is how every AI rollout starts.

But there's a significant gap between Phase 1 (individuals using AI as a better search engine) and a mature internal AI stack (AI with structured access to company data, enforced permissions, and reusable workflows that run across the team). Crossing that gap is an engineering problem as much as it is an organizational one.

Here's what the mature version looks like, layer by layer.

---

## The five-layer stack

\`\`\`
┌─────────────────────────────────────┐
│  Layer 5: UI                        │
│  Claude Code (dev), Claude Chat     │
│  (everyone else)                    │
├─────────────────────────────────────┤
│  Layer 4: Skills                    │
│  Reusable workflows stored as       │
│  markdown, invoked by natural       │
│  language, published to team plugin │
├─────────────────────────────────────┤
│  Layer 3: Internal MCP Server       │
│  Single routing layer with ACL      │
│  middleware, shaped responses,      │
│  audit logging                      │
├─────────────────────────────────────┤
│  Layer 2: Data Access               │
│  Live API (real-time) + Data        │
│  Warehouse (aggregates/history)     │
├─────────────────────────────────────┤
│  Layer 1: Pre-Fetch Cache           │
│  Nightly cron job, session-start    │
│  context ready before user appears  │
└─────────────────────────────────────┘
\`\`\`

Each layer handles a specific concern. Remove any one of them and the others don't work as well.

---

## Layer 1: Pre-Fetch Cache

The pre-fetch cache is the foundation no one talks about until they get the bill.

Every morning at 3 AM, a cron job runs. It fetches everything your agents will need at session start — pipeline state, meeting notes from yesterday, open ticket summaries, call summaries from the past week — and writes it to a cache table.

When users start their sessions at 8 AM, their agents read from cache. Session initialization goes from "call 6 APIs and wait 8 seconds" to "read one database row." Token cost goes from 400,000 tokens per session (for native connectors pulling everything live) to near zero on startup.

This layer is invisible when it's working. It's very visible when it's not — slow sessions, high token costs, unreliable startup.

**What to monitor:**
- Cache generation time (did the cron finish before 6 AM?)
- Cache hit rate per session (are sessions actually reading from cache or falling back to live?)
- Cache staleness at session start (how old is the data when users start their day?)

---

## Layer 2: Data Access (Live API + Warehouse)

The data access layer has two paths, and both are necessary.

**The warehouse path** handles aggregates, historical data, and cross-system joins. "What's our renewal rate by industry this quarter?" "Which customers have both open tickets and renewals in the next 90 days?" These queries touch large datasets across multiple systems. The warehouse handles them in a single fast query.

**The live API path** handles anything where freshness matters more than cost. "Did Acme's payment clear?" "What's the status of this open ticket?" "Is this deploy still in progress?" These need current answers — the warehouse might be hours stale.

The right warehouse for AI agent workloads is often different from your BI warehouse. BigQuery is excellent for large-scale analytics and works well in GCP. For AI agent queries — many small lookups, sub-second latency requirements, flat per-month pricing — StarRocks is often a better fit at roughly $200-400/month regardless of query volume.

**What to monitor:**
- Query latency by source (warehouse vs. live API)
- ETL lag (when did the warehouse last update?)
- Live API error rates (so you know when to expect stale cache reads)

---

## Layer 3: Internal MCP Server

The MCP server is the routing and control layer. Claude makes a single connection here; the server handles everything else.

Every tool call passes through ACL middleware that:
1. Identifies the caller (from the authenticated session — not from user input)
2. Checks whether the caller's permission group includes access to this tool
3. Injects caller identity into every downstream call (so services know who's asking)
4. Returns a clean denial for unauthorized tools (and they don't appear in the tool list to begin with)
5. Logs every call with the user ID, tool name, parameters, status, and timestamp

The tools themselves are named functions with descriptions. Claude reads the description and decides when to call the tool. The implementation is hidden — it might call the warehouse, it might call a live API, it might call both and join the results. Claude gets the shaped output.

Tool response shaping is where you reclaim the 10-50x token cost difference between raw API responses and clean data. A HubSpot deal object has 40+ fields. Your tool returns 6. You pay for 6.

**What to monitor:**
- Tool call latency (p50, p95 — where are the slow spots?)
- Permission denial rate (are users hitting tools they shouldn't have? Or tools that should exist for them but don't?)
- Most-called tools (what does your team actually use Claude for?)
- Audit log (every access, for compliance and debugging)

---

## Layer 4: Skills

Skills are the layer that converts institutional knowledge into team capability.

A skill is a SKILL.md file describing a multi-step workflow: what it does, when to invoke it, what tools to call in what order, and what the output should look like. Skills are stored in a plugin folder, published via PR, and available to everyone immediately.

The person who figures out the best way to run a BDR compliance audit or prep for a QBR or pull a deal intelligence report — their knowledge goes into a skill file. Now anyone on the team can run the same workflow with the same quality.

The most valuable skills are the ones that encode decisions, not just steps. The pre-call research brief isn't valuable because it pulls from HubSpot and Gong — any tool can do that. It's valuable because it knows which fields matter, which signals to flag, and how to format output for a 15-minute read before a call.

**What to monitor:**
- Skill invocation frequency (which skills get used? Which don't?)
- Skill success rate (does the skill complete without error?)
- Skill coverage (what percentage of your team's repeated workflows have a skill?)

---

## Layer 5: UI

The UI layer is the interface through which your team actually uses everything above.

**Claude Code** is the primary UI for developers and technical users. It has direct access to the internal MCP server, can invoke skills by name, can write and run code, and can operate in longer multi-step sessions with tool use.

**Claude Chat** (claude.ai or a custom front-end) is the primary UI for everyone else. Sales, finance, CS, operations — they interact through a conversational interface that uses the same MCP server and skills in the background.

For most teams, this means two interface surfaces but one data layer underneath.

---

## What each role gets

The stack's value is that it gives different teams access to different things — shaped to their role, with their permissions, and with their most common workflows automated.

**Sales:**
- CRM pipeline data in real-time
- Call transcripts and Gong summaries
- Deal intelligence reports on demand
- Pre-call research briefs automatically
- Tools: deal lookup, call history, contact profiles

**Finance:**
- Accounting reports from QuickBooks
- Billing and AR data from ChargeOver
- Monthly variance analysis vs. forecast
- Revenue recognition reports
- Tools: SQL access (finance_read), billing lookup, report generation

**Customer Success:**
- Customer health scores
- Open ticket status and history
- Renewal pipeline with risk signals
- QBR prep on demand
- Tools: customer profile, ticket lookup, usage data

**Engineering:**
- Codebase access via GitHub MCP
- Roadmap and spec docs from Notion
- Deploy status and incident history
- PR summaries and review briefs
- Tools: repo lookup, deploy status, docs search

**Executives:**
- Cross-functional dashboards
- Pipeline and revenue summaries
- Meeting briefs from Granola
- KPI snapshots
- Tools: broad read access across all tools, SQL access

The same MCP server, the same skills layer, the same cache — but each person's Claude looks different because the tool list is filtered to their permissions.

---

## The metrics that tell you it's working

**Cold start token cost.** Target: under 10,000 tokens per session startup. If you're over 100,000, you don't have a working pre-fetch cache. If you're over 400,000, you're running native connectors with no shaping.

**Query latency.** Target: under 2 seconds for 95% of tool calls. If you're regularly at 3-5 seconds, your warehouse query layer needs work — or you're hitting live APIs for things that should be cached.

**Cross-system query availability.** Can you ask "which customers have an open enterprise renewal and more than two unresolved support tickets?" and get an answer in one query? If not, your warehouse layer isn't joining across systems.

**Permission violations.** Target: zero. If unauthorized tool access is possible (not just detected), your ACL middleware isn't working correctly. If it's happening and being caught, your permission groups need review.

**Skill coverage.** What percentage of your team's regularly repeated workflows have a skill? Under 20%: you're at individual discovery. Over 60%: your institutional knowledge is becoming a shared asset. Over 80%: most of your team's repeated work is automated.

---

## The metrics that tell you something is wrong

**High session startup cost.** You're paying for cold start. Check cache hit rate, check whether pre-fetch is running, check whether tools are shaping responses.

**Slow tool calls.** Check which tools are slow (warehouse, live API, or MCP overhead). Check warehouse query plans. Check live API rate limiting.

**Low skill invocation.** Skills exist but nobody uses them. Either discovery is broken (the trigger phrases don't match how people ask) or the output isn't good enough to trust.

**High permission denial rate.** People are hitting tool walls. Either your permission groups are too restrictive, or you haven't built tools that certain roles actually need.

**Token cost spikes.** Log token cost per session by user. Spikes usually mean one of: a user who's asking Claude to process a lot of raw data, a skill that's not shaping its tool calls, or a new data source that got connected without thinking about response size.

---

## Where most teams actually are

Most teams are between Layers 1 and 3. They have native connectors (no shaping, no ACL, no audit trail), no pre-fetch cache, and no skills layer.

This gives them an AI that's useful for individuals but doesn't compound across the team. Token costs are high. Session startup is slow. The same workflows get reinvented by each person independently. And there's no access control — everyone gets everything.

The path forward isn't a complete rebuild. It's adding the missing layers in order:

1. Add a pre-fetch cache for your top 3 session startup queries (one week of engineering)
2. Build an internal MCP server with 3-5 tools and ACL middleware (two weeks)
3. Write your first 5 skills for the team's most common workflows (two weeks)
4. Add the warehouse query layer for aggregates and cross-system joins (two weeks)

Six to eight weeks of focused engineering. The result is an internal AI stack where every tool call is shaped, permissioned, logged, and fast — and where the team's institutional knowledge compounds instead of staying locked in individuals' heads.`,
  },
]

async function seed() {
  console.log('Seeding Internal MCP Series — 8 articles...\n')

  for (const a of articles) {
    const payload = {
      slug:      a.slug,
      angle:     a.angle,
      title:     a.title,
      excerpt:   a.excerpt,
      body:      a.body,
      read_time: a.readTime,
      cluster:   a.cluster,
      term_id:   null,
      term_name: '',
      term_slug: '',
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
