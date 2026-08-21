/**
 * Application prompts for the Internal AI Stack path (retro instruction #30).
 *
 * All nine articles in this path shipped without a rep, which meant a reader
 * could complete the whole path and never do anything. These are the most
 * architectural articles on the site, so each prompt produces a measurement or
 * an artifact rather than asking anyone to build a layer in twenty minutes.
 */
import { createClient } from '@supabase/supabase-js'
import { hasApplicationPrompt } from './_lib/article-gate'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ADDITIONS: Record<string, string> = {

  'internal-ai-stack-architecture': `

## Try this today — 20 minutes

Locate yourself on the five layers before you build anything.

For each of the five, write one of three words: **none**, **partial**, or **working**. Be strict — "we have a Slack connector" is not a data access layer, and one person's saved prompts are not a Skills layer.

Then answer the only question that matters next: **which single layer, if it existed, would unblock the most people?**

It is almost never layer 1. For most teams at the ChatGPT-tab stage the answer is layer 2 or layer 3, because everything above them is starved without data. Building a caching layer in front of nothing is the most common wasted quarter in this space.

Write the answer down with a date and show it to whoever controls your engineering time. A one-line honest assessment — *"we are at partial on layer 2 and none above it; the next thing is an internal MCP server"* — is a more useful artifact than a diagram of the whole stack, because it is small enough to get funded.`,

  'internal-mcp-server-explained': `

## Try this today — 25 minutes

Do not build the server. Write the tool list.

Open a file and write down the **six to ten named functions** your company would actually want. Not the systems — the functions. \`get_customer_orders(customer_id, since)\` rather than "connect Salesforce."

The exercise is harder than it looks and that is the point. Three things surface every time:

- **Two of your "tools" turn out to be the same tool with a different name**, used by different teams who did not know.
- **One tool needs data from two systems**, which is exactly the case native connectors cannot handle and the argument for building this at all.
- **At least one has no clear owner** — nobody can tell you authoritatively what "active customer" means. That is a definitions problem your MCP server will otherwise encode wrongly and permanently.

For each function write the parameters and, critically, the **shape of what comes back**. The shaped-response argument in this article is the whole token-economics case, and it is made concrete only when you write the return shape and notice you were about to return the full record.

That list is the spec. It is also the thing to take to an engineer, and it is a much better ask than "we should build an MCP server."`,

  'ai-data-access-token-economics': `

## Try this today — 30 minutes

Measure one real session instead of estimating it.

Take the agent or workflow you run most often, run it once as a user would, and record three numbers from the API response or the Console:

1. **Input tokens on the first turn** — the cold start
2. **Total input tokens for the whole session**
3. **Cache read tokens**, if any

Then divide: what fraction of your session's input was the first turn? For most unoptimised agents the answer is between 60% and 80%, and people consistently guess 20%.

Multiply the session cost by your realistic daily session count. That annual number is the one that gets a data-architecture project funded, and it is almost always larger than the model-choice conversation everyone is having instead.

**The comparison that lands with a finance audience:** price the same workflow at each of the three tiers described above. Same task, same model, three architectures. The spread between tier one and tier three is usually more than the spread between Haiku and Opus — which is the entire argument of this article, expressed in your own numbers rather than ours.`,

  'ai-agent-cold-start-caching': `

## Try this today — 25 minutes

Before writing a cron job, work out whether you have a cold-start problem worth solving.

Answer three questions about your highest-traffic agent:

1. **What does it fetch before the user says anything?** List the sources. If the answer is "nothing," you do not need this yet — close the tab and come back when you do.
2. **How stale can each of those sources be before someone is materially misled?** Be honest per source. Calendar: minutes. Yesterday's closed deals: hours. The org chart: a week. This list *is* your caching policy, and it is the part people skip in favour of a single global TTL that is wrong for everything.
3. **When is your usage trough?** Look at the actual timestamps, not your assumption. That is when the pre-fetch runs.

Twenty-five minutes gets you a staleness table. The cron job is an afternoon once the table exists, and it will be right rather than a guess.

**The trap to avoid:** caching something whose acceptable staleness you have not decided. A cached value with an unexamined TTL is how an agent confidently reports last week's inventory, and that failure is invisible — it looks exactly like a correct answer.`,

  'ai-agent-access-control': `

## Try this today — 20 minutes

Run the question that ends most AI security reviews, on your own system, before someone else does.

Pick your most privileged internal user and your least privileged one. Ask your agent the same question — one that touches something sensitive: compensation, unreleased financials, another team's pipeline.

Compare the answers.

Three possible outcomes:

- **Identical answers.** You have no access control. This is the common case at the ChatGPT-tab stage and it is fine to discover — as long as you discover it, rather than your auditor.
- **Different answers, but you cannot explain why.** Worse than the first. Something is filtering and nobody knows the rule, which means nobody can verify it is right.
- **Different answers, and you can point at the layer that produced the difference.** You have real access control. Now check the audit log actually recorded both requests.

Write down which of the three you got. That sentence is the most useful thing you can bring to a security conversation, and it takes twenty minutes to earn.`,

  'live-api-vs-etl-for-ai': `

## Try this today — 20 minutes

Classify your data sources before you build a routing layer for them.

Make a three-column table. For every source your agents touch, write the source, **how fresh it genuinely needs to be** (not how fresh it could be), and **the shape of the typical query** — single record lookup, or aggregate across many rows.

Then apply the framework: single-record lookups needing current data go live; aggregates over history go to the warehouse. Most sources sort themselves in about a minute once the two columns are written down.

The value is in the disagreements. You will find at least one source where someone insists on real-time and cannot say what breaks at fifteen minutes of staleness. Real-time is expensive, and "we did not ask" is the reason most agent architectures cost more than they need to.

**The one to look hardest at:** anything currently live that is only ever queried in aggregate. That is a warehouse table paying live-API prices, and it is the most common thing this exercise finds.`,

  'data-warehouse-for-ai-agents': `

## Try this today — 20 minutes

Do not migrate anything. Measure the pattern first.

Pull your last week of agent-generated queries from your warehouse logs and answer three questions:

1. **How many queries, and how many were under a second of actual compute?** The AI agent pattern is many small queries, and it is the pattern that per-query pricing punishes hardest.
2. **What did they cost in total?** Compare that to the same number for your human analysts. If agents are a small share of compute but a large share of spend, you have found the mismatch this article is about.
3. **What was the p50 and p95 latency?** Cold start shows up in the p95. If p95 is several times p50, your users are experiencing a slow agent even though your average looks fine.

Those three numbers tell you whether this is a real problem for you or an interesting article. If agent queries are 5% of your bill, leave it alone — there are better things to do. If they are 40% and growing, you have a specific, quantified case for a change.

**Do this before you evaluate any alternative engine.** A migration justified by a benchmark somebody else ran is the most expensive way to find out your workload was different.`,

  'building-ai-skills-for-your-team': `

## Try this today — 30 minutes

Write one skill, for something you personally did more than twice last month.

Not the most valuable workflow in the company — the one you have already repeated, because you already know the steps and the edge cases, and that knowledge is what makes a skill good.

Use the structure above: description, when to use, steps, output format. Keep it to one page. Then do the part that decides whether it survives: **run it on a real case and note every place you had to intervene.** Each intervention is a missing step, and the second draft is where a skill becomes usable by someone else.

Then hand it to one colleague and watch them use it without helping. Where they get confused is the actual gap — and it is almost never in the steps. It is in "when to use," because you know when to reach for it and they do not.

**The honest counterweight, before you write forty of these:** most Skill libraries are mostly dead. Skills that get used are ones somebody wrote for their own repeated work and then shared, not ones written speculatively for other people. See [the Cowork skills graveyard](/articles/cowork-skills-graveyard) for what the failure looks like at scale, and check the invocation counts after a month.`,

  'mcp-production-agents': `

## Try this today — 30 minutes

Test the failure paths, not the happy path. Your MCP connection already works; that is not the risk.

Four things to try against a non-production target:

1. **Take the MCP server down mid-session.** Does the agent report a tool failure, or does it carry on and answer from nothing? The second behaviour is the one that produces confident wrong answers, and it is the most common default.
2. **Return an empty result where data was expected.** Empty and error must be distinguishable to the model. If an empty array reads as "no results found," the agent will assert that the customer has no orders when the query simply failed.
3. **Exceed the rate limit deliberately.** Watch what happens on retry. Unbounded retries against a production CRM is a way to get your credentials revoked by someone else's incident.
4. **Return a malformed response.** Whatever the agent does here, it should not be to hallucinate a well-formed one.

Write down the behaviour for each. Those four rows are the beginning of your runbook, and they are the questions a production review will ask.

**The one that catches most teams:** number 2. Silent empty results are the single most common cause of an agent that "used to work" and now quietly does not. See [when agents break](/articles/when-agents-break).`,
}

async function main() {
  console.log('Adding application prompts to the Internal AI Stack path...\n')
  let added = 0
  for (const [slug, addition] of Object.entries(ADDITIONS)) {
    const { data, error } = await sb.from('articles').select('body').eq('slug', slug).single()
    if (error || !data) { console.error(`  ✗ ${slug}: not found`); continue }
    const body = data.body as string
    if (hasApplicationPrompt(body)) { console.log(`  – ${slug}: already has one, skipped`); continue }
    const { error: wErr } = await sb.from('articles')
      .update({ body: body.trimEnd() + '\n' + addition })
      .eq('slug', slug)
    if (wErr) { console.error(`  ✗ ${slug}: ${wErr.message}`); continue }
    console.log(`  ✓ ${slug}`)
    added++
  }
  console.log(`\n${added} added.`)
}

main().catch(console.error)
