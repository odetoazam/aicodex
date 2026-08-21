/**
 * Batch 94 — The FDE engagement itself.
 *
 * The /academy page names this gap in the FDE track verbatim: "No course
 * teaches you how to scope an engagement, what to do when the client's data is
 * worse than they said, or how to hand a system over so it survives your
 * departure." We were advertising the gap without filling it.
 *
 * The existing FDE series covers getting the job. This covers doing it.
 *
 * 1. fde-scoping-an-engagement    — the discovery week and how to size the work
 * 2. fde-when-client-data-is-bad  — the near-universal reality, and the recovery
 * 3. fde-handoff-that-survives    — leaving something that still works in month six
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-94.ts
 */

import { createClient } from '@supabase/supabase-js'
import { assertSeedable } from './_lib/article-gate'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getTermId(slug: string): Promise<{ id: string; name: string } | null> {
  const { data } = await sb.from('terms').select('id, name').eq('slug', slug).single()
  return data
}

const articles = [

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'fde-scoping-an-engagement',
    angle: 'process',
    title: 'Scoping an FDE engagement: the first week decides the next three months',
    excerpt:
      'Every failed forward-deployed engagement was scoped wrong in week one. The client described a system that does not exist, you agreed to a deliverable nobody can define, and by week six you are building the wrong thing competently. Here is what to ask, who to ask, and how to size the work before you commit to it.',
    readTime: 12,
    cluster: 'Business Strategy & ROI',
    termSlug: 'ai-use-case-discovery',
    body: `Most forward-deployed engagements that go wrong were already wrong at the end of week one.

Not because the engineer was bad. Because the scope was agreed before anyone had seen the systems, and the description the client gave in the sales conversation turned out to be a description of what they wished they had.

This is the part of the job no course covers, and it is the part that determines whether the next three months are productive or a slow renegotiation.

## The gap between the pitch and the environment

You will be handed a brief. It will say something like: *"Build an agent that answers questions about our inventory using our ERP data."*

That sentence contains at least four unverified claims:

1. That there is an ERP with a queryable interface.
2. That the inventory data in it is current.
3. That someone can tell you what "our inventory" means, unambiguously, across the whole company.
4. That the people who will use the agent are the people who asked for it.

In my experience roughly one of those four holds on arrival. Your first week is not building. It is finding out which one.

## The discovery week

Five days, structured. Resist the pressure to show code before Friday — an early demo built on a misunderstanding is worse than no demo, because it makes the misunderstanding official.

### Day 1 — Read the systems, not the docs

Ask for read access to the actual systems before you ask for documentation. Documentation describes intent; the database describes reality, and where they disagree the database wins.

Three queries to run on day one, whatever the domain:

- **Row counts by month for the last two years.** Gaps and cliffs tell you when something changed, and nobody will mention it unprompted.
- **Null rates on the fields your use case depends on.** If the field you were going to key on is 40% empty, your scope just changed.
- **Distinct values on anything that looks like a category.** You will find seven spellings of the same warehouse.

You are not auditing. You are calibrating how much of the brief survives contact.

### Day 2 — Find who actually does the work today

The person who commissioned the project and the person whose job it changes are almost never the same person, and the second one has not been consulted.

Ask to sit with whoever currently does the task manually. Not a meeting — sit with them for an hour while they do it. Every engagement I have seen go sideways had a version of this moment available in week one and skipped it.

What you are listening for: the steps that are not in any process document. The spreadsheet they keep on the side. The three exceptions they handle from memory. Those exceptions are usually 30% of volume, and they are always missing from the brief.

### Day 3 — Establish what "working" means, in a number

This is the day that saves the engagement.

Push until you have a measurable definition of success, agreed by the person who controls the budget. Not "the agent answers inventory questions." Something like: *"For the 20 questions the ops team asks most, the agent gives an answer the ops lead would have given, at least 17 times out of 20."*

If you cannot get to a number, that is your finding. Report it as one. A scope without a definition of done is not a scope, it is an open-ended commitment, and you will be the one holding it in month four.

The [eval framing here](/articles/how-to-evaluate-your-agents) is the same one an internal AI Agent Manager needs — the difference is that you have to negotiate it with someone who is paying you.

### Day 4 — Map the integration surface honestly

For each system you need to touch, write down four things:

| | Question | Why it matters |
|---|---|---|
| Access | Do you have credentials, or a promise of credentials? | A promise is a two-week delay |
| Interface | API, database, file drop, or screen? | Screen means [browser automation](/articles/computer-use-browser-use-ga) and a different estimate |
| Rate limits | What are they, actually? | The most common late-stage surprise |
| Owner | Who approves changes, and are they in this project? | An unlisted approver is a three-week delay |

The [internal AI stack architecture](/articles/internal-ai-stack-architecture) piece covers the technical shapes. The scoping question is narrower: which of these do I not yet have, and who do I need to ask this week.

### Day 5 — Write the scope memo, and make it uncomfortable

Two pages, delivered Friday, containing four sections:

**What I found.** The state of the systems and data, in specifics. Numbers, not adjectives.

**What I can build in [timeframe].** Concrete, and narrower than the brief. It should feel slightly disappointing to the reader. That feeling now is much cheaper than the same feeling in month three.

**What I cannot build, and why.** Name it explicitly. "Real-time inventory is not possible because the ERP syncs nightly" is a sentence that prevents a quarter of pain.

**What I need from you, by when.** Credentials, an approver's time, a decision. With dates. This section is how you convert your blockers into their blockers, which is where they belong.

## Sizing: the multiplier that is actually real

A rule that has held for me across engagements: **take your estimate for the same work in a codebase you know, and multiply by three.**

Not because the engineering is harder. Because of the tax that is invisible from outside:

- Getting access to a system: days, not hours, and it recurs
- Discovering an undocumented constraint: at least once per integration
- Waiting on a decision from someone with four other priorities: the single largest line item
- The exceptions the manual process handles silently

If the client pushes back on the multiplier, do not defend the number — show the discovery-week findings that produced it. "We found 7 warehouse spellings and the ERP syncs nightly" argues better than an estimate.

## Three scoping mistakes that cost the most

**Agreeing to a deliverable defined by capability rather than outcome.** "An agent that can query the ERP" is done the moment it returns any row. "The ops lead stops asking IT for stock reports" is a real finish line. Only one of these can be signed off.

**Scoping around the person who hired you.** They are frequently not the user, and sometimes their mental model of their own systems is a year out of date. Verify with the operators.

**Treating the pilot as a smaller version of the real thing.** It is not. A pilot on clean data with three enthusiastic users tells you almost nothing about a rollout to sixty. Scope the pilot to *answer a question* — usually "does the retrieval work on our real documents" — rather than to be a small deployment. [Running your first AI pilot](/articles/running-your-first-ai-pilot) covers the design.

## What good scoping looks like from the client's side

The engagements that go well share a pattern: by the end of week one the client knows something about their own systems that they did not know on Monday, and they are slightly alarmed by it.

That is the deliverable. You are not there to confirm their plan. You were hired because they cannot see their own environment clearly from inside it, and the first valuable thing you produce is an accurate description of it.

If your week-one memo tells the client only what they already believed, you have not done discovery. You have done onboarding.

## Try this today — 30 minutes

Take an engagement or project you are currently on — client work, or an internal build, it works the same either way — and write the **"What I cannot build, and why"** section of the scope memo. Just that one section.

Three to five bullets. Each one a specific thing someone currently expects, and the concrete reason it is not possible as described.

Two things will happen. You will find at least one item you have been quietly hoping nobody asks about. And you will find one that turns out to be possible after all, once you write down the actual constraint rather than carrying a vague sense of difficulty.

Then send it. The discomfort of sending that list is the entire skill — it is much smaller now than the conversation you avoid by not sending it.

**Related:** [What is a Forward Deployed Engineer](/articles/what-is-a-forward-deployed-engineer) · [When the client's data is worse than they said](/articles/fde-when-client-data-is-bad) · [The handoff that survives your departure](/articles/fde-handoff-that-survives)`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'fde-when-client-data-is-bad',
    angle: 'failure',
    title: 'When the client’s data is worse than they said',
    excerpt:
      'It is not an edge case, it is the default. The warehouse has seven spellings, the timestamps are in three time zones, 40% of the field you were going to key on is null, and nobody internally knows. Here is how to diagnose it in a day, how to say it without blowing up the engagement, and what you can still ship.',
    readTime: 12,
    cluster: 'Infrastructure & Deployment',
    termSlug: 'ai-integration',
    body: `Every forward-deployed engineer has the same week two.

You have access now. You run the first real query against the client's actual data, and it comes back wrong in a way that makes the agreed scope impossible. The customer table has duplicates that are not duplicates. The status field has values the schema does not document. A third of the records stop in March 2024 and resume in June with a different format.

Nobody lied to you. The people who described the system genuinely believe it works the way they said, because from where they sit it does — they interact with a reporting layer that has been quietly patching this for years.

This is the default condition, not a bad-luck engagement. Treating it as normal is what separates the third engagement from the first.

## The one-day data triage

Before you tell anyone anything, spend a day producing findings rather than impressions. "The data is messy" is not actionable and sounds like an excuse. Numbers are actionable and sound like work.

Run these six checks on every table your use case depends on.

**1. Completeness on the fields you actually need.**

\`\`\`sql
SELECT
  COUNT(*) AS rows,
  COUNT(customer_id)   AS has_customer,
  COUNT(closed_at)     AS has_closed_at,
  COUNT(category)      AS has_category
FROM orders;
\`\`\`

Not every field — the three or four your feature depends on. A 4% null rate is noise. A 40% null rate is a scope change.

**2. Time coverage, monthly.** Count rows per month for two years. You are looking for cliffs and gaps. Every cliff has a story — a migration, an acquisition, a system swap — and nobody will volunteer it until you show them the chart.

**3. Cardinality on anything categorical.** \`SELECT DISTINCT\` on the fields that look like enums. If \`warehouse\` has 7 values and the company has 3 warehouses, you have found the normalisation work.

**4. Duplicate identity.** Count rows per supposed key. Real duplicates are easy; the expensive ones are near-duplicates — the same customer with a trailing space, a different case, an \`Inc\` versus \`Inc.\`.

**5. Referential reality.** How many child rows point at a parent that does not exist? Orphans mean either a soft-delete you have not been told about, or a sync that has been failing silently for months.

**6. Freshness.** \`MAX(updated_at)\`, per table. This is the one that most often ends a real-time feature. A table that was described as live and last updated eleven hours ago is a nightly batch with better marketing.

One day. Six numbers per table. Now you can have the conversation.

## Saying it without detonating the engagement

The finding is not the problem. The framing is.

**Do not** lead with the data being bad. Your sponsor either does not know — in which case you have just told them their organisation is broken, in a meeting, in week two — or they half know and have been managing around it, in which case you have just made their private problem public.

**Do** lead with the consequence for the thing they asked for, then offer the options. The move is to stay on their side of the table and put the constraint on the other side.

A shape that works:

> "I ran completeness checks across the four tables we need. Three are in good shape. On \`orders\`, the \`category\` field is empty on 38% of rows since the 2024 migration — so an agent that answers 'how many orders in category X' will silently be wrong by about a third, and it will be confident about it.
>
> Three options. **One:** we scope category out of v1 and ship the other four question types on time. **Two:** we backfill category, which is roughly two weeks and needs someone from ops who knows the old mapping. **Three:** we ship it with an explicit 'partial data' warning on those answers, which I would not recommend for anything customer-facing.
>
> My recommendation is one, then two as a fast follow. What would you like to do?"

Four things that framing does. It shows work. It quantifies the damage in terms of *their* use case. It gives them a decision rather than a problem. And it puts the choice with the person who owns the budget, which is exactly where it belongs.

## The silent-wrongness principle

The reason data quality matters more for agents than for dashboards is worth stating plainly to a non-technical sponsor, because it is not obvious and it changes how seriously they take it.

A broken dashboard looks broken. A chart with a hole in it prompts someone to ask why.

An agent with a hole in its data produces a fluent, confident, complete-sounding sentence that is wrong. There is no visual cue. The failure mode of bad data plus a language model is not an error — it is an assertion.

That is the sentence that gets budget for a backfill. It is also the honest reason you should refuse option three above more often than is comfortable.

## What you can still ship

Bad data does not mean no engagement. It means a different one, and often a more valuable one.

**Narrow to the clean subset and be explicit about the boundary.** If three of four tables are solid, ship the questions those three answer. An agent that handles 60% of questions correctly and says "I do not have reliable data on that" for the rest is genuinely useful. An agent that answers all of them and is wrong on 40% is worse than nothing, because it destroys trust in a way that takes a year to rebuild.

**Make the refusal a feature.** Wire the null-rate check into the retrieval path so the agent knows which fields it cannot trust and declines accordingly. This is a couple of hours of work and it is frequently the thing the client remembers about the engagement.

**Ship the data-quality dashboard as a deliverable in its own right.** You already ran the six checks. Turning them into something that runs nightly and alerts on drift costs you a day and delivers something the client did not know they needed. On more than one engagement this has been the artifact with the longest life.

**Reframe the project honestly if it comes to that.** Sometimes the truthful finding is: *you do not have an AI problem, you have a data problem, and the AI project is how you found out.* Delivering that clearly is a real outcome. Clients who get told this early, with evidence, tend to come back. Clients who get told it in month five do not.

## The three-week rule

If the fix looks like more than about three weeks of data work, stop and escalate rather than absorbing it.

Engineers absorb this work. It feels like being helpful, and it feels faster than the conversation. But a data backfill inside an AI engagement is invisible on the invoice, it does not look like the deliverable, and when the timeline slips the story becomes "the AI project ran late" rather than "we discovered the ERP migration was never finished."

Escalate it as its own workstream with its own timeline. Whether they fund it is their call — but the record should show what it was.

## Try this today — 45 minutes

Run the six checks above on the primary table of whatever you are working on right now. Client system, internal system, your own product's database — it does not matter.

Write the six numbers in a document. Then write one sentence for each: *what would break for the user if this number stayed exactly as it is?*

Most people find at least one number they did not expect, and about half find something that changes what they should build next. If everything comes back clean, you have earned genuine confidence in the foundation — which is also worth 45 minutes.

Keep the document. It becomes the baseline you compare against in month six, when someone says the agent "used to be better."

**Related:** [Scoping an FDE engagement](/articles/fde-scoping-an-engagement) · [When agents break](/articles/when-agents-break) · [Wiring internal systems to agents](/articles/wiring-internal-systems-to-agents) · [Live API vs ETL](/articles/live-api-vs-etl-for-ai)`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'fde-handoff-that-survives',
    angle: 'process',
    title: 'The handoff that survives your departure',
    excerpt:
      'The measure of a forward-deployed engagement is not what works on your last day. It is what still works in month six, after a model deprecation, a schema change, and the departure of the one person who understood it. Most handoffs fail on the same four things.',
    readTime: 12,
    cluster: 'Business Strategy & ROI',
    termSlug: 'change-management',
    body: `You shipped. It works. The demo went well, the sponsor is happy, and your engagement ends in two weeks.

Six months later the system is either load-bearing or abandoned, and which one it becomes has very little to do with how good the code was.

This is the part of forward-deployed work that separates the engineers clients ask for by name from the ones who did a fine job once. It is also the part with the least written about it, because it happens after everyone has stopped paying attention.

## What actually kills a delivered system

Not bugs. Four things, in rough order of frequency:

**1. Nobody owns it.** It was your project. On your last day it becomes nobody's project. The first time it misbehaves, there is no one whose job it is to look, so it gets routed around instead of fixed. Routing around it is permanent.

**2. The model it was built on gets retired.** This is not hypothetical — in the first half of 2026 alone, Sonnet 4 and Opus 4 were retired in June, Opus 4.1 in August, and two models were suspended worldwide for nineteen days by government order. If the model ID is pinned in three files and nobody knows where, the retirement notice is a crisis rather than a ticket. See [when your AI model disappears](/articles/when-your-ai-model-disappears).

**3. A schema changes upstream.** Someone renames a column in the ERP. The agent starts returning subtly wrong answers rather than erroring. Nobody notices for weeks, and when they do, trust is gone.

**4. The champion leaves.** The one person internally who understood the system and advocated for it takes another job. Everything that lived in their head goes with them.

Notice that three of the four are organisational and one is a deprecation. None of them are code quality. You cannot engineer your way out of any of them — but you can hand over in a way that makes each survivable.

## Name the owner, in writing, before you go

The single highest-leverage thing in a handoff, and the one most often skipped because it is a conversation rather than a task.

Not "the IT team." A person, by name, who has:

- **Agreed to it out loud**, in a meeting, with their manager present
- **Time allocated** — even two hours a month is enough if it exists on paper
- **The access to actually fix things** — credentials, permissions, the ability to deploy

An owner without the third item is a name on a page. This is the item that quietly fails most often, because access provisioning is somebody else's queue and your engagement ends before it clears. Check it yourself. Watch them log in.

If you cannot get a named owner, escalate that to the sponsor as a risk in writing before your last week. It is the highest-probability failure in the whole handover, and it is entirely within their control.

## Write the runbook as failure modes, not architecture

Most handoff documents describe how the system is built. That is the wrong document. The person reading it in month six is not curious about your architecture — something is broken and they need it to stop.

Organise it by symptom:

> ### The agent says "I don't have data on that" for things it used to answer
> Almost always the nightly sync failed. Check \`sync_log\` for the last successful run. If it is more than 36 hours old, [runbook link]. If the sync is healthy, check whether the field null-rate has moved — see the data-quality dashboard.
>
> ### Answers are confident and wrong
> Usually a schema change upstream. Run \`scripts/check-schema.ts\`; it compares live columns against the ones the retrieval layer expects and prints a diff.
>
> ### Costs jumped this month
> Check the Console analytics by user first. In two out of three cases it is one person running a batch job through an interactive path.
>
> ### It stopped working entirely after a date in the news
> Check whether the model was retired. Model IDs live in \`config/models.ts\` — there is one file, deliberately.

Ten symptoms, each with a first check and a link. That document gets used. A thirty-page architecture overview does not.

## Make the deprecation survivable in one commit

Since you know a model retirement is coming — annually, roughly — build for it before you leave.

**One file holds every model ID.** Not three. Not a default buried in a client wrapper. One file, and the runbook names it.

**Write the migration test before you go.** A script that runs your eval set against a different model ID and prints a pass-rate diff. When the retirement notice arrives, the owner's job is: change one line, run one script, read one number. That is a task a competent person can do without understanding your architecture.

**Leave the eval set behind, with its answers.** This is the artifact most engineers forget and the one that matters most for longevity. Twenty real questions with agreed-correct answers, in a file, runnable. Without it, nobody can tell whether a change made things worse — so nobody changes anything, and the system slowly stops matching reality. See [auditing your eval suite](/articles/auditing-your-eval-suite).

## Set the ceiling honestly, in writing

Your last document should state what the system does **not** do and what would need to happen for it to do more.

This feels like undermining your own work. It is the opposite. Six months from now someone will ask the system a question outside its scope, get a bad answer, and conclude the whole thing is unreliable. The document that says "this covers the five question types listed; anything about pricing is out of scope and will be answered badly" converts that moment from a loss of faith into a known limitation.

Write down the things that would break it, too: a new warehouse, a change in the fiscal calendar, a fifth product line. Whoever inherits it will hit one of these, and recognising it as an anticipated event rather than a mystery is the difference between a ticket and an abandonment.

## The 30-day check-in

Negotiate one before you leave — an hour, a month after your last day, on the calendar with an invite already sent.

Almost nothing surfaces in the final week, because everyone is being positive and the system has not met a real month yet. Everything surfaces at day 30: the questions nobody thought to ask, the first upstream change, the thing the owner has been quietly working around because they did not want to bother you.

An hour at day 30 saves systems. It is also, commercially, the most reliable source of follow-on work I know of — not because you sell in it, but because it is when the client discovers what else they need.

## The test

Here is the honest measure of a handoff, and it is uncomfortable:

**Could a competent engineer who has never met you keep this running for a year, using only what you left behind?**

Not "could they understand your design." Could they diagnose the four failure modes, migrate a model, tell whether a change made things worse, and know what the system is not supposed to do.

If the answer depends on someone remembering to ask you something, you have not handed over. You have created a dependency and left.

## Try this today — 40 minutes

Take the system you are currently closest to — client-delivered or internal — and write the **symptom-first runbook**. Not the architecture. Ten symptoms.

Format: *what someone would observe* → *the first thing to check* → *where to look*.

Then do the honest test on it. Give it to someone who did not build the system and ask them to walk through one symptom out loud. Watch where they stop.

The place they stop is your actual handoff gap, and it is almost never where you expected. Most people discover the gap is not technical — it is that the reader does not know where something lives, or does not have access to look.

**Related:** [Scoping an FDE engagement](/articles/fde-scoping-an-engagement) · [When the client's data is worse than they said](/articles/fde-when-client-data-is-bad) · [Documenting your Claude setup for client handoff](/articles/documenting-claude-setup-for-client-handoff) · [When your AI model disappears](/articles/when-your-ai-model-disappears)`,
  },
]

async function seed() {
  assertSeedable(articles)

  console.log('Seeding Batch 94 — the FDE engagement...\n')

  for (const a of articles) {
    const term = await getTermId(a.termSlug)
    if (!term) {
      console.error(`  ✗ Term not found: ${a.termSlug}`)
      continue
    }

    const { error } = await sb.from('articles').upsert({
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
    }, { onConflict: 'slug' })

    console.log(error ? `  ✗ ${a.slug}: ${error.message}` : `  ✓ ${a.slug}`)
  }

  console.log('\nDone.')
}

seed().catch(err => { console.error(err.message); process.exit(1) })
