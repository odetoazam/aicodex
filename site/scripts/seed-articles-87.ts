/**
 * Batch 87 — Anthropic announcement: Programmatic tool calling (June 18, 2026)
 *   + in-place currency refresh of claude-fable-5 banner (still suspended at Jun 26).
 *
 * 1. programmatic-tool-calling  (NEW)
 *    Shipped June 18, 2026 with code_execution_20260120 (REPL state persistence).
 *    Claude writes Python that calls your tools inside the code execution container,
 *    so intermediate tool results never enter the model context. ~11% better on
 *    agentic-search benchmarks with 24% fewer input tokens. DEV_SLUGS. Cluster: Claude API.
 *    Angle: update. Term: tool-use.
 *
 * 2. claude-fable-5  (PATCH — banner only)
 *    The model has now been suspended for 2+ weeks (Anthropic confirmed zero traffic
 *    on Jun 25). Refresh the top status banner so it doesn't read as freshly-pulled.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-87.ts
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
    slug: 'programmatic-tool-calling',
    angle: 'update',
    title: 'Programmatic tool calling: let Claude write the glue code between your tools',
    excerpt: "Anthropic shipped programmatic tool calling on June 18, 2026. Instead of bouncing through the model once per tool call, Claude writes a single Python script that calls your tools inside a sandbox, filters the results, and returns only what matters. On agentic-search benchmarks it scored ~11% higher while using 24% fewer input tokens. Here's how it works and the exact API shape.",
    readTime: 8,
    cluster: 'Claude API',
    audience: ['developer'],
    termSlug: 'tool-use',
    body: `Regular tool use is a loop. Claude asks to call a tool, you run it, you hand the result back, Claude reads it, Claude asks for the next tool, and so on. Every step is a round trip through the model, and every tool result — however large — gets pasted into the context window before Claude can decide what to do next.

That loop is fine for one or two calls. It gets expensive fast when a task needs twenty.

**Programmatic tool calling**, which Anthropic shipped on June 18, 2026, replaces the loop with a script. Claude writes Python that calls your tools as functions inside a [code execution](/articles/tool-use-implementation-deep-dive) sandbox, runs all the calls there, processes the results in code, and returns only the final answer to its own context. Intermediate results never touch the model.

On agentic-search benchmarks like BrowseComp and DeepSearchQA, adding programmatic tool calling on top of plain search tools improved task performance by an average of **11% while using 24% fewer input tokens**, per Anthropic's numbers.

## The example that makes it click

Say you need to check budget compliance across 20 employees.

**Regular tool use:** 20 separate model round trips. Each one pulls that employee's expense line items — thousands of rows in total — into the context window. Claude reads all of it, even though you only care about who went over.

**Programmatic tool calling:** Claude writes one script that loops over all 20 employees, calls your \`get_expenses\` tool for each, filters in code to the ones who exceeded their limit, and returns a three-line summary. The thousands of line items run through the sandbox and are discarded. Claude only ever reasons over the handful of names that matter.

The token bill and the latency both drop because the model is sampled once, not twenty times.

## How it works

When you mark a tool as callable from code execution and Claude decides to use it:

1. Claude writes Python that invokes the tool as a function — possibly many calls, plus pre- and post-processing logic.
2. The code runs in a sandboxed container through the code execution tool.
3. When the code calls a tool function, execution **pauses** and the API returns a normal \`tool_use\` block to you.
4. You return the tool result. Execution resumes. That result is **not** loaded into Claude's context window.
5. When the script finishes, Claude receives only the final output and continues the task.

So you still run the actual tools — the database query, the API call, whatever — exactly as you do today. What changes is that Claude orchestrates them in code instead of one model turn at a time.

## The API shape

Two things make it work: the code execution tool must be enabled, and each tool you want callable from code carries an \`allowed_callers\` field.

\`\`\`python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Query sales data for the West, East, and Central "
                       "regions, then tell me which region had the highest revenue",
        }
    ],
    tools=[
        # 1. Enable the code execution sandbox
        {"type": "code_execution_20260120", "name": "code_execution"},
        # 2. Mark your tool as callable from inside that sandbox
        {
            "name": "query_database",
            "description": "Execute a SQL query against the sales database. "
                           "Returns a list of rows as JSON objects.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "sql": {"type": "string", "description": "SQL query to execute"}
                },
                "required": ["sql"],
            },
            "allowed_callers": ["code_execution_20260120"],
        },
    ],
)
\`\`\`

The TypeScript shape is the same fields:

\`\`\`typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-opus-4-8",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content:
        "Query sales data for the West, East, and Central regions, then tell me which region had the highest revenue",
    },
  ],
  tools: [
    { type: "code_execution_20260120", name: "code_execution" },
    {
      name: "query_database",
      description:
        "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
      input_schema: {
        type: "object" as const,
        properties: {
          sql: { type: "string", description: "SQL query to execute" },
        },
        required: ["sql"],
      },
      allowed_callers: ["code_execution_20260120"],
    },
  ],
});
\`\`\`

No beta header is required. Your tools are converted to **async** Python functions behind the scenes, so the code Claude writes uses \`await\` — for example \`result = await query_database("SELECT ...")\` — which also lets it fire independent calls in parallel.

## The \`allowed_callers\` field

This one field decides where each tool can be invoked from:

- \`["direct"]\` — Claude calls the tool the classic way, one model turn per call. This is the default if you omit the field, so existing tools behave exactly as before.
- \`["code_execution_20260120"]\` — Claude calls the tool only from inside the sandbox.
- \`["direct", "code_execution_20260120"]\` — both are allowed.

Anthropic's guidance: pick one or the other per tool rather than enabling both, because a single clear mode gives Claude better guidance on how to use the tool.

**Important security note from the docs:** \`allowed_callers\` shapes how the tool is presented to Claude and is checked against \`tool_choice\`, but it is **not a hard API-level block**. Claude is strongly steered to respect it, but your handler should still be ready to receive a direct \`tool_use\` for any tool you define. Do not treat \`allowed_callers\` as a security boundary — enforce permissions in the tool handler itself, the same as you would for [any tool](/articles/securing-your-claude-app).

## When to reach for it

The docs call out three patterns, and they match where the regular loop hurts:

- **Large data processing** — filter or aggregate tool results in code before any of it reaches the context window. This is the budget-check case.
- **Multi-step workflows** — call tools serially or in a loop without sampling the model between each call. Fewer round trips, lower latency.
- **Conditional logic** — branch on an intermediate result ("if the first lookup returns nothing, try the fallback source") without a model turn to make the decision.

If your tool calls are one-offs, or the results are small and you want Claude reasoning over each one, plain direct tool use is still the right default. Programmatic tool calling earns its keep when the work is fan-out, high-volume, or chained.

## What you need to run it

- The **code execution tool** enabled (it's what the sandbox runs in).
- A model that supports \`code_execution_20260120\` or later: Claude Fable 5, Mythos 5, Opus 4.8, 4.7, 4.6, 4.5, and Sonnet 4.6 and 4.5.
- Available on the **Claude API, Claude Platform on AWS, and Microsoft Foundry**. Not on Amazon Bedrock or Google Cloud at launch.
- One caveat: the feature is **not eligible for Zero Data Retention**. Data follows the code execution tool's standard retention policy. If your org runs under ZDR, this is a blocker — check before you build on it.

## What to read next

- [Tool use, implemented: a deep dive](/articles/tool-use-implementation-deep-dive) — the regular tool-use loop this builds on
- [Claude cost optimization](/articles/claude-cost-optimization) — where the token savings show up on your bill
- [Securing your Claude app](/articles/securing-your-claude-app) — why tool permissions belong in the handler, not the schema

---

*Source: [Programmatic tool calling](https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling) and the [Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview), June 18, 2026. Benchmark figures from [Improved web search with dynamic filtering](https://claude.com/blog/improved-web-search-with-dynamic-filtering).*`,
  },
]

// --- Fable 5 banner patch (in-place, body string replace) ---

const FABLE_OLD_BANNER =
  "> **Status update — June 12, 2026: Fable 5 is currently suspended.** The US government issued an export-control directive on June 12 (5:21pm ET) barring access to Fable 5 and Mythos 5 by any foreign national, citing a national-security concern tied to a method of bypassing the model's safeguards. To comply, Anthropic **disabled both models worldwide for all customers** — three days after launch. You cannot call \\`claude-fable-5\\` right now. Anthropic calls it a misunderstanding and says it is working to restore access; **all other Claude models (Opus 4.8, Sonnet, Haiku) are unaffected.** Everything below describes the model as launched — read it as what to expect *if and when access returns*, and keep a fallback to Opus 4.8 in place. See [Anthropic's statement](https://www.anthropic.com/news/fable-mythos-access)."

const FABLE_NEW_BANNER =
  "> **Status update — still suspended as of June 26, 2026 (day 14).** The US government issued an export-control directive on June 12 (5:21pm ET) barring access to Fable 5 and Mythos 5 by any foreign national, citing a national-security concern tied to a method of bypassing the model's safeguards. Anthropic **disabled both models worldwide for all customers** three days after launch — and they remain down. On June 25, Anthropic confirmed it is serving *zero* traffic to Fable 5; viral claims that access had returned were a model-picker UI bug, not real access. The model still appears in some pickers but returns a \\`currently unavailable\\` error. Anthropic now offers US-only inference at 1.1x pricing for workloads that must run inside the US, and an updated privacy policy with government-ID verification takes effect July 8 — the likely mechanism for a US-first restoration. **All other Claude models (Opus 4.8, Sonnet, Haiku) are unaffected; keep a fallback to Opus 4.8 wired in.** Mythos 5 remains restricted to Project Glasswing partners. Everything below describes the model as launched — read it as what to expect *if and when access returns*. See [Anthropic's statement](https://www.anthropic.com/news/fable-mythos-access)."

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
  else console.log('  ✓ claude-fable-5 banner refreshed (Jun 26 status)')
}

async function seed() {
  console.log('Seeding Batch 87 — Programmatic tool calling + Fable banner refresh...\n')

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
