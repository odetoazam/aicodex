/**
 * Batch 53 — Internal business case article (Raj's #1)
 *
 * 1. building-a-business-case-for-claude — For the mid-level person who wants to roll
 *    out Claude at their company but has to pitch it upward. Different from the IT
 *    approval guide — this is the internal narrative memo, not the security brief.
 *    Written for Priya pitching her VP, or any team lead building a case for leadership.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-53.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getTermId(slug: string): Promise<{ id: string; name: string } | null> {
  const { data } = await sb.from('terms').select('id, name').eq('slug', slug).single()
  return data ?? null
}

const ARTICLES = [
  {
    termSlug: 'claude-plans',
    slug: 'building-a-business-case-for-claude',
    cluster: 'Business Strategy & ROI',
    angle: 'process',
    title: 'How to build a business case for Claude at your company',
    excerpt: "Your manager doesn't need an AI pitch — they need a staffing and efficiency argument with AI as the mechanism. Here's how to write it so leadership can say yes.",
    readTime: 9,
    body: `
Most internal AI proposals fail not because the technology is unproven but because the case is framed wrong. You write about what AI can do. Your manager reads it and thinks: "This is a technology pitch. I don't approve technology pitches — I approve business decisions."

The gap isn't conviction. It's framing.

This guide is about how to write a business case for rolling out Claude at your company — one that leadership can act on, not just nod at.

## The two proposals you should never write

**"AI is the future and we need to stay ahead."** This is a competitive anxiety argument dressed up as a strategy. It doesn't have a clear ask, doesn't quantify anything, and puts your manager in the position of approving a thesis, not a decision. If they're a skeptic, this hardens the skepticism. If they're a believer, they were already going to act.

**"Here's the ROI calculator."** A spreadsheet showing 3 hours saved per person per week × 20 people × $80/hour = $249,600 in annual productivity sounds credible. It isn't. Every leader who has seen this kind of analysis knows the hours saved don't convert to revenue — they convert to the same workload, done more comfortably. Unless you're planning layoffs (and you're not), this argument proves nothing.

Both proposals ask leadership to approve AI. The proposal that works asks leadership to solve a real business problem, and identifies Claude as the mechanism.

## Start with the problem, not the solution

The business case has to begin with something your manager already knows is true and already wishes were different. If you have to convince them the problem exists, you've lost before the ask.

The right problems to anchor on:

**Capacity problems.** "The CS team is handling 30% more tickets than last quarter with the same headcount. Our average resolution time has increased from 6 hours to 11 hours." This is a leadership problem — not because AI exists, but because customers are waiting and the team is stretched. Claude is the mechanism for solving it without adding headcount.

**Quality consistency problems.** "Our outbound email quality varies significantly by rep. Top performers convert at 18%; bottom quartile converts at 6%. The difference is almost entirely in how the email is researched and framed." This is a training problem and a process problem. Claude is a mechanism for compressing that gap.

**Knowledge transfer problems.** "We have 6 months until Sarah retires and she's the only person who knows how our renewal process works end-to-end." This is a documentation and continuity problem. Claude is a mechanism for capturing and distributing that knowledge before she leaves.

None of these are AI pitches. They're business problems with a tool recommendation embedded.

## The one-page format that works

Leadership reads your business case on a phone, between meetings, in 90 seconds. The format that works looks like this:

---

**Problem:** [One sentence. What's the actual business impact? Use a number if possible.]

**Root cause:** [One to two sentences. Why does this problem exist? What current process or constraint is creating it?]

**Proposed solution:** [One sentence. What you're proposing, at the level of specificity that makes the ask clear. Not "AI" — "rolling out Claude to the CS team with shared project setup and a usage policy."]

**What this involves:** [Three to five bullets. The actual work: who does what, what resources are needed, what the IT/compliance ask is, what the timeline looks like.]

**Expected outcome:** [One to two sentences. What measurable change do you expect to see in 60 to 90 days? Be specific. "Reduce average resolution time from 11 hours to 7 hours" is specific. "Improve team efficiency" is not.]

**Cost:** [The number. Claude Team is $30/person/month. For 8 people that's $240/month. This is not a significant budget ask — say so.]

**What I need from you:** [One sentence. Approval? Budget sign-off? An intro to IT? Name the ask precisely.]

---

That's it. Not a slide deck. Not a 6-page memo. One page, eight sections, a clear ask at the end.

## The three arguments, ranked

When you're building the narrative, you have three argument types available. Rank them in this order:

**1. Efficiency argument (strongest):** You're solving a capacity problem without adding headcount. This is the only argument that directly converts to budget justification. It doesn't require predicting the future — it describes the present.

**2. Quality argument (medium):** You're reducing variance and improving consistency across the team. This is a management argument — every manager wants this. But it's harder to quantify and easier to dismiss as "training."

**3. Competitive argument (weakest unless you have evidence):** Your competitors are already using this. True for many industries, but hard to prove and easy to deflect. Use this as supporting context, not the main argument.

Lead with efficiency. Support with quality. Mention competition only if you have concrete evidence.

## What your manager is actually worried about

Before you send the proposal, try to anticipate the real objections — not the stated ones.

**"Let's wait for IT to weigh in."** This is almost always a delay tactic, not a genuine concern. The way to prevent it: bring IT into the conversation before the proposal goes to leadership. Not to get IT approval first, but to be able to say "I've already spoken to IT and here's what they need" in the proposal. This removes the obvious out.

**"I'm worried about our data."** A real concern, not a deflection. Answer it directly in the proposal: Anthropic doesn't train on Team or Enterprise plan inputs, data is not retained after the conversation, and you're proposing a usage policy to govern what's appropriate to share. See the [IT approval guide](/articles/getting-it-approval-for-claude) for the full security briefing.

**"What happens if people misuse it?"** This is a governance question. Answer it by proposing a policy as part of the rollout. "We'll put a one-page usage policy in place before we start" costs you nothing and removes the concern.

**"Can't people just use the free version?"** People probably already are. The Team plan gives you admin controls, shared projects, a usage policy framework, and removes the consumer data-training question. That's the answer — not that free is bad, but that the Team plan is what makes this appropriate for work.

## Getting a sponsor, not just approval

There's a difference between getting your manager to say "fine, go ahead" and getting your manager to say "I want this to work." The latter is a sponsor. You want a sponsor.

A sponsor shows up at the 90-day review meeting and asks how it's going. They mention it to their peer in finance who asked about AI last month. They advocate for it when there's budget pressure.

You turn approval into sponsorship by doing two things:

**Propose a success metric.** "I'll come back to you in 90 days with data on resolution time and team feedback." This signals that you're accountable, that this isn't a one-time ask, and that you'll be measuring impact rather than assuming it.

**Tell them what you need from them beyond approval.** "The only thing I'd ask beyond the budget is a 15-minute intro call to James in IT so I can walk him through the security setup. That would prevent this from sitting in a queue." Sponsors help clear blockers. Give them a specific, small thing to do.

## The conversation before the proposal

Most proposals fail because they arrive cold. The manager reads it without context, responds based on their default posture (skeptical or supportive), and the outcome is determined by posture rather than content.

Before you send anything, have a five-minute conversation: "I've been using Claude for my own work and I think there's something worth bringing to the team. I'm going to put together a quick proposal — mostly I want to get your sense of what would make this an easy yes, and what would create friction."

This does three things: (1) tests whether there's a hidden blocker you should know about before you write the proposal, (2) makes the manager feel consulted rather than pitched, and (3) gives you the exact objections to pre-empt.

---

**Try this today:** Write one sentence describing the business problem you want to solve — not in terms of AI, but in terms of what's broken or slower than it should be. If that sentence is clear, specific, and already true in your manager's mind, you have the start of a business case. If it's not clear or specific yet, that's the work.

---

*Part of the AI Codex operator series. Related: [How to get IT to approve your Claude rollout](/articles/getting-it-approval-for-claude) · [Measuring AI ROI](/articles/measuring-ai-roi) · [Why Claude adoption plateaus](/articles/claude-adoption-plateau)*
`,
  },
]

async function seed() {
  for (const a of ARTICLES) {
    const term = await getTermId(a.termSlug)
    if (!term) { console.error(`Term not found: ${a.termSlug}`); continue }

    const { error } = await sb.from('articles').upsert({
      slug: a.slug,
      term_id: term.id,
      term_slug: a.termSlug,
      cluster: a.cluster,
      angle: a.angle,
      title: a.title,
      excerpt: a.excerpt,
      read_time: a.readTime,
      body: a.body.trim(),
      published: true,
    }, { onConflict: 'slug' })

    if (error) {
      console.error(`❌ ${a.slug}:`, error.message)
    } else {
      console.log(`✓ ${a.slug}`)
    }
  }
}

seed().then(() => process.exit(0))
