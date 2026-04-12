/**
 * Batch 34 — Is AI worth it for your team right now?
 * ai-roi-role
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-34.ts
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
    termSlug: 'workflow-automation',
    slug: 'ai-roi-role',
    angle: 'role',
    title: 'Is AI worth it for your team right now? An honest assessment',
    excerpt: 'Most teams should start. Almost none should start as big as they plan to. Here is how to honestly evaluate where AI will actually deliver for your function — and how to avoid the trap of the impressive-but-useless use case.',
    readTime: 6,
    cluster: 'Team Rollout',
    audience: ['operator'],
    body: `The honest answer to whether AI is worth it for your team is almost certainly yes. But the version of "worth it" that most managers are picturing — the transformation, the dramatic productivity jump, the 10x output — usually is not what happens first. And chasing that version often leads to a failed pilot, a skeptical team, and a conclusion that AI was overhyped.

The version that actually delivers is smaller, faster, and far less glamorous. And starting there is what makes the bigger changes possible later.

Here is how to think through the assessment properly.

## Start with the work your team already does repeatedly

The highest-ROI AI use cases are almost never the ones that look impressive in a demo. They are the boring, recurring tasks that eat hours every week — and that nobody has ever bothered to systematize because they seemed unavoidable.

Before evaluating any specific tools or workflows, spend twenty minutes listing the work your team does that is:

**High frequency.** Something that happens daily or weekly, not once a quarter. AI compounds — a small improvement on a task done 200 times a year is worth far more than a large improvement on a task done twice.

**Text-heavy or structured.** First drafts, summaries, briefs, email responses, status updates, documentation, research synthesis. Claude is genuinely good at these. It is less useful for anything requiring real-time data, original research, or judgment calls with no clear right answer.

**Variable quality.** Tasks where the output quality varies a lot depending on who does it and when. AI can raise the floor significantly — it produces consistent, competent first drafts even on a bad day.

Write down three to five of these. That is where you look for the starting use case, not at the list of things that would be cool if AI could do them.

## The trap of the impressive use case

There is a pattern in almost every team rollout that does not go well. Someone sees something remarkable — AI summarizing a call in seconds, generating a full marketing brief from a product spec, answering a complex customer question from scratch — and that becomes the North Star for the rollout.

The problem is that impressive use cases tend to be complex use cases. They require setup, context-loading, specific prompting knowledge, and often produce outputs that need significant editing. They are also the cases where errors matter most. Teams who start here often conclude that Claude is "not reliable enough" — because they started with the hardest test.

The best starting use case has three properties:

**Low stakes.** Mistakes are easy to catch and cheap to fix. Internal drafts, not customer-facing messages. Summaries for review, not documents that go out.

**Clear baseline.** You know what good looks like, so you can tell immediately if Claude is helping. "First draft of a weekly update" is clear. "Make our customer communications better" is not.

**Short feedback loop.** Your team sees the benefit within the first week. If they have to wait a month to evaluate whether something worked, they will not stay motivated long enough to find out.

If you find a use case that is impressive AND has these three properties, great. If not, choose the less impressive one.

## What ROI actually looks like at first

The realistic ROI from an early AI rollout is not dramatic on paper. It looks like:

- A first draft that takes five minutes instead of forty-five
- A summary that replaces thirty minutes of re-reading notes before a meeting
- A response to a common customer question that goes out in two minutes instead of ten

Individually, none of these are transformative. Across a team of eight people doing three or four of these things daily, you are looking at several hours per person per week — freed up for actual judgment work, relationship work, problem-solving. Over a quarter, that is real.

More importantly, it is the kind of change that compounds. Teams that start with boring wins develop the prompting instincts that make the more complex use cases work. Teams that skip straight to complex use cases usually do not get there.

## The question you actually need to answer

Rather than asking "is AI worth it for our team," ask something more specific:

**Is there one task my team does at least twice a week, that takes more than thirty minutes per person, where the output quality is inconsistent, and where mistakes are catchable before they matter?**

If the answer is yes, you have a starting use case. Start there. Build the habit. Measure the time saved informally — you do not need a dashboard for this, just pay attention for thirty days. Then decide whether to expand.

If the answer is no — if every task your team does is genuinely high-stakes, low-frequency, or resistant to text-based assistance — then AI might not be the right investment right now, and that is a legitimate answer too.

## What you need to decide before you start

A few decisions that will shape the rollout, regardless of which use case you pick:

**Who goes first.** Pick a small group of volunteers who are open to experimentation, not the whole team at once. Three people trying something seriously for two weeks tells you far more than fifteen people trying it casually.

**What plan you need.** Individual Claude accounts work for personal experimentation, but if you want shared context across a team, you need Claude for Teams or above. This unlocks Projects — the feature that lets you set team-level instructions so every conversation starts from the same baseline. More on this in the next step.

**What success looks like at 30 days.** Decide this now, before you start. Not "the team loves it" — something you can actually observe. Time saved on a specific task. Number of drafts that went out without significant edits. Tickets closed per hour. Pick one metric, measure it roughly, and revisit at 30 days.

## The honest summary

Most teams benefit from starting with Claude. Almost none benefit from starting big. The teams that get real value are the ones who pick a small, boring, high-frequency use case, run it for a month, build the habit, and then expand from there.

The ones who do not get value are the ones who tried to do everything at once, picked the impressive use case, ran a loose pilot with no baseline, and concluded six months later that AI did not deliver.

Start small. Measure informally. Expand what works. That is it.

**Where to go next:** Once you have a use case in mind, the next question is how to scope the rollout so it actually succeeds — not just "turn on Claude and see what happens." That is what the [pilot guide](/articles/running-your-first-ai-pilot) covers.`,
  },
]

async function run() {
  for (const a of ARTICLES) {
    const term = await getTermId(a.termSlug)
    if (!term) { console.error(`Term not found: ${a.termSlug}`); continue }

    const { error } = await sb.from('articles').upsert({
      term_id: term.id,
      slug: a.slug,
      angle: a.angle,
      title: a.title,
      excerpt: a.excerpt,
      read_time: a.readTime,
      cluster: (a as any).cluster ?? null,
      body: a.body,
    }, { onConflict: 'slug' })

    if (error) console.error(`Error upserting ${a.slug}:`, error)
    else console.log(`✓ ${a.slug}`)
  }
  console.log('Done.')
}

run()
