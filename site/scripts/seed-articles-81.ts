/**
 * Batch 81 — The "measure AI value with the right instrument" article
 *
 * 1. measuring-ai-value
 *    The consequence/cost side of measuring AI value, written prescriptively:
 *    for each thing leaders say to "measure," names the ACTUAL instrument
 *    (system-of-record KPI vs. survey vs. vendor admin console vs.
 *    OpenTelemetry vs. graded sampling vs. a competency ritual) and why the
 *    obvious instrument is usually wrong. Master move: match the instrument
 *    to the question, and pair every value number with a consequence check.
 *    Fills the gap left by measuring-ai-roi (value delivered) and
 *    agent-operator-roi-reporting (reporting upward): this one is HOW you
 *    capture each number, plus the cost/erosion side nobody instruments.
 *    Cluster: Business Strategy & ROI. Angle: process. Agent Operator pool.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-81.ts
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
    slug: 'measuring-ai-value',
    angle: 'process',
    title: 'How to measure the value of AI: the exact instrument for each thing leaders tell you to track',
    excerpt:
      "Every framework tells you to measure AI's value, utilization, and risk. None of them tell you HOW — with what tool, asking whom. The answer is that each question needs a different instrument, and the obvious one (a survey, a gut estimate) is usually the wrong one. Here's the instrument for each, including the costs that never show up on a dashboard.",
    readTime: 12,
    cluster: 'Business Strategy & ROI',
    termSlug: 'ai-agent',
    body: `There's a good framework making the rounds for measuring the value of AI. It says: don't just measure what AI created (the benefit), also measure how well you're using it (utilization) and what you're risking in the process (consequences). An organization can get faster and sloppier. Leaner and weaker. That's all correct.

And then it stops — right where the actual work begins.

"Measure what your freed-up hours became." How? Is that a survey? Do you ask managers, or the people directly? "Track utilization." With what — the vendor's dashboard? Something you build? OpenTelemetry? "Measure trust." Trust isn't a number that exists anywhere until you go create it.

These are the questions that decide whether you have a real measurement system or a slide that looks like one. This article answers them. The organizing idea is simple and almost nobody follows it:

> **Match the instrument to the question.** Each thing you're told to measure needs a *specific*, *different* tool. The default instrument people reach for — a survey, or a confident estimate — is the right tool for exactly one of these questions and the wrong tool for all the others.

Here's the map. Then we'll walk each one.

| What you're measuring | The instrument people default to | The instrument that actually works |
|---|---|---|
| Value created (what the hours became) | A "how do you use AI?" survey | A downstream KPI in your system of record, baselined |
| Utilization / adoption | Seat count ("we bought 200 licenses") | Vendor admin console (people) or your own run logs / OpenTelemetry (agents) |
| Quality of output | Output volume ("we shipped 3x more") | Graded sampling → an escaped-error rate |
| What you risked or lost | Nothing — it's left unmeasured | Override-rate trend + a competency spot-check ritual |
| Trust / culture | Adoption numbers as a proxy | A short, recurring, anonymous pulse |

Notice the survey only earns its place once — at the very bottom, for trust. Most teams use it at the top, for value, and get fiction.

---

## 1. Value created: instrument it downstream, in a system you already have

The seductive question is "how many hours did AI save us?" The honest answer is that hours saved, asked directly, is one of the least reliable numbers you can collect. If you survey people — "how much time does AI save you each week?" — you get recall bias, optimism, and a little flattery (people sense you want a big number). And even an accurate hours-saved figure doesn't prove value, because the framework's real point stands: ten freed hours that dissolve into more meetings created nothing.

So don't measure the hours. Measure what they were supposed to turn into — in a place where the truth already lives.

**The method:**

1. **Pick one workflow** AI is changing. Not "AI across the company." One: support triage, contract review, the weekly sales report.
2. **Find the downstream business metric that workflow feeds** — one that already exists in a system of record you don't control by hand. Tickets resolved per rep (Zendesk/Intercom). Deals advanced per AE (your CRM). Invoices processed (your ERP). Briefs shipped (your PM tool). The point is it's *recorded automatically*, so it can't be talked up.
3. **Baseline it for 4 weeks before** the AI workflow goes live. Write the number down.
4. **Watch the same metric after.** If it moved, the freed hours converted into output and you can quantify it. If it didn't move, the hours dissolved — and that is a finding, not a failure of measurement. It's exactly the "faster but not better" case the framework warns about, made visible.

This is why the system-of-record matters more than the survey: you're not asking people what they did with their time, you're reading what the business actually produced.

**When there's no clean downstream metric** — a lot of knowledge work doesn't have one — fall back to *manager attestation tied to a specific named artifact*. Not "the team feels more productive." Instead: "Because the analyst stopped hand-building the Monday report, she shipped the pricing analysis that had been backlogged for a quarter." A concrete thing that exists, with a name, that wouldn't exist otherwise. One real artifact beats a page of self-reported percentages.

(For turning these into the dollars-and-throughput story your CEO wants, [the ROI reporting playbook](/articles/agent-operator-roi-reporting) and [how to measure the ROI of Claude](/articles/measuring-ai-roi) cover the framing and the math. This article is about *capturing the raw number honestly* — that's upstream of reporting it.)

---

## 2. Utilization: the right instrument depends on what you actually deployed

"Track adoption" has two completely different answers depending on what you rolled out, and conflating them is why people end up confused about whether they need OpenTelemetry.

**If you rolled out a chat tool people use directly** (Claude, ChatGPT for your team): the instrument is the **vendor's admin console.** You build nothing. Claude's Team and Enterprise plans expose usage analytics — active members, activity over time, usage by person. ChatGPT Enterprise has the same plus a usage/compliance API. Start there. The two numbers worth pulling:

- **Weekly active users as a percentage of *eligible* users** — not seats sold. Seat count is a vanity number; a license nobody opens is worth zero. WAU/eligible is the real adoption rate.
- **The frequency distribution.** Sort users into daily / weekly / tried-once-and-stopped. That long tail of one-time users is your [month-4 adoption plateau](/articles/claude-adoption-plateau) showing up *early*, while you can still act on it.

**If you built agents or automations** (the [Agent Operator](/articles/what-is-an-agent-operator) case — there's no human "opening the app"): you have to instrument it yourself, because the work runs unattended. The minimum viable version is a **structured log line on every run**: timestamp, what triggered it, which use case, tokens used, and the outcome (success / failed / escalated to a human). A single logging table gets you adoption, volume, and failure rate on day one.

**This is where [OpenTelemetry](https://opentelemetry.io/) actually fits** — and where it doesn't. OTel is the right tool once you're running *several* agents or multi-step pipelines and need to see not just *that* something ran but *where in the chain* it slowed down or broke: spans per step, latency, failure points, fed into a dashboard like Grafana, Honeycomb, or Datadog. It earns its keep for production agent systems. It is overkill for "is my team using the chat app" — that's what the vendor console is for, and reaching for OTel there is just building a dashboard you didn't need. Match the instrument to the question.

One more dimension, whichever case you're in: **depth, not just breadth.** Track distinct use cases per active user. Ten people using AI for one task each is fragile — kill the task and adoption goes to zero. Ten people using it for five tasks each is embedded. Breadth tells you who's in; depth tells you whether it would survive you leaving.

---

## 3. Quality: graded sampling, and the one number that matters is "escaped errors"

The trap here is measuring *volume* as if it were quality. "We produce 3x the drafts" is a consequence number wearing a value number's clothes — if the materially-wrong rate climbed at the same time, you've flooded yourself with more work to check, not more value.

The instrument is **sampling plus a graded audit.** Weekly, pull a random sample of AI-assisted outputs and grade each against a short rubric: *correct / minor issue / materially wrong.* ([How to evaluate your agents](/articles/how-to-evaluate-your-agents) covers building the test set and the scoring discipline in full — use that for the mechanics.) For high volume, an LLM-as-judge against a golden set is the cheap continuous layer; the human audit is your ground truth that keeps the judge honest.

The headline number for the *value* conversation isn't the raw error rate — it's the **escaped-error rate**: outputs that were materially wrong *and reached a customer or a decision without a human catching them.* That's the number that translates "we got faster" into "and here's what it cost us when we were fast and wrong." Track its trend. A rising escaped-error rate is the single clearest signal that speed is outrunning your guardrails.

---

## 4. What you risked or lost: the part with no dashboard — so don't fake one

This is the measure the framework is most right about and that almost no one instruments, because the honest answer is that the most important consequences resist being turned into a clean metric. The discipline here is to use real instruments where they exist and to be honest — out loud — where they don't.

**Override / edit rate, watched as a trend.** How often does a human change the AI's output before it ships? You can capture this cheaply: a one-click *accepted / edited / rejected* on the workflow, or just tally it during your weekly audit. But here is the catch, and it's important: a *falling* override rate is genuinely ambiguous. It can mean the agent earned trust — or it can mean people stopped reading and started rubber-stamping. The number cannot tell you which. So it's a flag, not a verdict, and it's why you need the next one.

**A "can you still do it" spot-check — a ritual, not a metric.** Once a quarter, take a person who now leans on the agent for task X and have them either do one instance without it or explain why a given output is right or wrong. If they can't anymore, that's skill erosion happening in real time — the "leaner but weaker" organization made visible at the level of one person. I'm calling this a ritual deliberately: there's no tidy number for institutional judgment, and inventing one would be theater. A standing review you actually run beats a fake metric you put on a slide. (The deeper version of what's eroding and why is in [what AI is actually doing to your job](/articles/ai-impact-on-knowledge-work).)

**Time-to-detect a wrong answer, as a leading indicator.** When the AI is wrong, how long until someone notices? If that lag is lengthening, judgment is atrophying even while your error rate looks flat — people have stopped scrutinizing. This one pairs naturally with the escaped-error rate above.

And the cheapest risk instrument of all: a written list of the things you've decided *not* to hand to AI, and why. [Knowing when not to use it](/articles/when-not-to-use-claude) is itself a measurement — of judgment you're choosing to keep.

---

## 5. Trust: now — and only now — you run a survey

Here's the instrument everyone reaches for first, finally used for the one thing it's good at. Trust is a genuine variable: if people experience AI as a threat, adoption decays no matter how good the tool is; if they experience it as leverage, it compounds. You can't read trust off a usage log. You have to ask.

**The method:** a short, recurring, *anonymous* pulse. Three questions, same wording every cycle, eNPS-style (0–10 or agree/disagree):

1. AI helps me do better work, not just faster work.
2. I trust the output of the AI tools I use.
3. I feel more — not less — secure about my role because of how we're using AI.

Track the **trend**, not the absolute. A score of 6 means nothing; a score that went 7 → 6 → 5 over three quarters is telling you adoption is about to stall and people are quietly defending themselves. (What to do about it lives in [the human side of rolling out AI](/articles/ai-change-management).)

The thing people get exactly backwards: they survey to measure *productivity* — where surveys produce fiction — and then never survey to measure *trust*, which is the one thing only a survey can reach.

---

## The rule that ties it together: pair every value number with its consequence

The reason all of this matters is that value and consequence are two columns of the *same ledger*, and a number from one column is misleading without its partner from the other. Make the pairing explicit before anything goes in a board deck:

| When you report this value… | …ship it next to this consequence |
|---|---|
| Hours saved / throughput up | Where the hours went (the downstream metric moved — or didn't) |
| Faster output / more volume | Escaped-error rate held flat (or it didn't) |
| Headcount or cost reduced | What knowledge or judgment left with the people who did |
| High adoption / heavy usage | Override-rate trend + the trust pulse |

A value number alone is a half-truth that flatters whoever presents it. The pair is the truth. "We're handling 40% more tickets *and* our escaped-error rate held at 2%" is a real claim. "We're handling 40% more tickets" — full stop — is the claim that gets an organization in trouble two quarters later.

The framework's last line is the right one: the real measure of AI value isn't whether the organization got faster, it's whether it got *better.* This is the instrumentation that lets you tell the difference instead of guessing.

---

## Try this today (15 minutes)

1. **Pick one workflow and name its downstream metric** — the one already recorded in a system you don't update by hand. Write down today's number. That's your baseline; you can't measure value without it, and every week you wait is a week of baseline you can't recover.
2. **Pull your real adoption number.** Open the vendor admin console (or your run logs) and compute weekly-active-as-%-of-eligible. If it's a gut number right now, you don't have an adoption measure — you have a hope.
3. **Write your "not yet AI" list.** Three tasks you've deliberately kept human, and one sentence each on why. That list is your cheapest risk instrument, and revisiting it quarterly is half of measuring consequences.

---

## Where to go next

- To turn these raw numbers into the story your CEO wants: [Showing AI ROI to your CEO](/articles/agent-operator-roi-reporting) and [How to measure the ROI of Claude](/articles/measuring-ai-roi).
- For the quality instrument in full — test sets, scoring, audits: [How to evaluate your agents](/articles/how-to-evaluate-your-agents).
- For the consequence side at the level of the work itself: [What AI is actually doing to your job](/articles/ai-impact-on-knowledge-work) and [When not to use Claude](/articles/when-not-to-use-claude).`,
  },
]

async function seed() {
  console.log('Seeding Batch 81 — Measuring AI value with the right instrument...\n')

  for (const article of articles) {
    const term = await getTermId(article.termSlug)
    if (!term) {
      console.log(`  ✗ ${article.slug} — term not found: ${article.termSlug}`)
      continue
    }

    const { error } = await sb.from('articles').upsert(
      {
        slug: article.slug,
        term_id: term.id,
        term_name: term.name,
        term_slug: article.termSlug,
        angle: article.angle,
        title: article.title,
        excerpt: article.excerpt,
        read_time: article.readTime,
        tier: 3,
        cluster: article.cluster,
        body: article.body,
        published: true,
      },
      { onConflict: 'slug' }
    )

    if (error) {
      console.log(`  ✗ ${article.slug} — ${error.message}`)
    } else {
      console.log(`  ✓ ${article.slug}`)
    }
  }

  console.log('\nDone.')
}

seed().catch(console.error)
