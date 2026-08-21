/**
 * Retro instruction #30 — every article ships with an application prompt.
 *
 * Batch 93 shipped 6 articles; only 2 had one. This is the third consecutive
 * session Coach Diaz has flagged the same miss, so this fixes it rather than
 * logging it again.
 *
 * Also adds skill module #4 (Diaz's standing ask — the rep count has been
 * frozen at 3 for three sessions) to what-claude-academy-doesnt-teach. The
 * nine-gap audit is the right home for it: it produces a prioritised artifact,
 * it uses the reader's real deployment, and it is the one exercise Claude
 * Academy structurally cannot offer.
 */
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ADDITIONS: Record<string, string> = {

  'claude-academy-guide': `

## Try this today — 20 minutes

Pick your track from the list above. Open Claude Academy, enrol in the **first two items only**, and put the hours in your calendar as real blocks this week.

Two items, not six. The most common failure with a free catalog is enrolling in nine courses and finishing none — the enrolment feels like progress and costs nothing, which is exactly the problem. Two finished courses beat nine started ones, and finishing changes what you do on Monday.

Then write one sentence somewhere you will see it again: *the thing I want to be able to do after these two courses is ______.* If you cannot finish that sentence, you picked the wrong track — go back and pick the one that matches the job you actually have.`,

  'claude-certifications-guide': `

## Try this today — 10 minutes

Before you plan any study time, settle the eligibility question, because it decides everything else.

Email whoever owns vendor relationships at your company — IT, procurement, or your manager — and ask one question: **"Are we in the Claude Partner Network, and if not, would we join?"** Membership is free, and a surprising number of consultancies and integrators are already in it without their staff knowing.

Three possible answers, three different next moves:

- **Already in it.** You are eligible today. Pick your exam and start with the free Academy courses above.
- **Not in it, but willing.** Ask them to apply, then start the free courses now — the prep is identical either way.
- **Not in it and not interested.** The exams are closed to you. Spend the fifteen hours on [portfolio projects](/articles/fde-portfolio-projects) instead, which is what hiring managers screen on anyway.

Ten minutes now saves you from studying for an exam you cannot sit.`,

  'managed-agents-budgets-guardrails': `

## Try this today — 30 minutes

Pick the agent you would least like to explain to your CFO — the one whose spend you cannot predict — and put a budget on it.

1. **Look up what it actually cost last month.** Not your estimate. The number, from the Console.
2. **Set a session budget at roughly 1.5× your typical session cost.** Deliberately tight. You want it to pause, because a pause is information.
3. **Let it run for a week and watch what trips.** Sessions that hit \`budget_reached\` are telling you something — either the task is harder than you scoped it, or the agent is looping. Both are worth knowing before the invoice arrives.
4. **Open the Console session viewer on one paused session** and read the per-tool statistics. Look specifically for a tool with a high call count and a low success rate. That is the most common silent cost sink.

The point is not to cap spend. It is to find out where the money goes while the stakes are one session rather than one quarter.

**One thing to check while you are in there:** deployment budgets apply *per session*, not in aggregate. A deployment with a $5 budget running 200 sessions can spend $1,000. If you need an aggregate ceiling, that is still a monitoring job.`,

  'what-claude-academy-doesnt-teach': `

## Skill module: the nine-gap audit

**The scenario.** Your Claude deployment is six months old. The pilot team liked it. Adoption is real but not what you projected. Nothing is on fire, but something is off and you cannot name it — and next month someone is going to ask you whether this is working. You have taken the product training. That is not the missing piece.

**Your task.** Score your own deployment against the nine gaps above, 1 to 5, where 1 means "we have not thought about this at all" and 5 means "we have a documented answer I would defend in a meeting." Use your real deployment, not a hypothetical one. It takes about twenty minutes and you should do it alone before you do it with anyone else.

Then take the **two lowest scores** and write one concrete next action for each, with a date. Two, not nine — a nine-item plan is a way of doing nothing.

**What good looks like:**

> | Gap | Score | Why |
> |---|---|---|
> | 1. When to use something else | 2 | Never evaluated. We picked Claude because I had used it. |
> | 2. What breaks in month six | 3 | We know Skills go stale; no process for it. |
> | 3. The budget conversation | **1** | Renewal is in March. I have no numbers. |
> | 4. What it costs at our volume | 2 | I know the invoice total. I cannot break it down. |
> | 5. Surviving a deprecation | **1** | Two agents are pinned to a model. No migration plan. |
> | 6. The organisation | 3 | Warehouse team still routes around it. Known, unaddressed. |
> | 7. Evals you can defend | 2 | We spot-check. No test set. |
> | 8. The industry record | 4 | I follow releases weekly. |
> | 9. The career | 3 | My title still says IT Manager. |
>
> **Two lowest: #3 (budget) and #5 (deprecation).**
>
> - **#3 — by Feb 14:** pull three months of usage by team from the analytics dashboard, and convert the two workflows finance already cares about into hours saved. One page, ahead of the March renewal.
> - **#5 — by Feb 28:** list every pinned model ID across our agents, and test the two highest-traffic ones against the current flagship. Write down what breaks.

**The common mistake.** Scoring the technical gaps and quietly skipping the organisational ones. Gaps 3, 6, and 9 are the uncomfortable rows — they are about money, politics, and your own position — and they are where deployments actually die. If your two lowest scores are both technical, you probably graded 3 and 6 generously. Go back and ask what you would actually say if the CFO asked on Monday.

**Why this is the exercise.** No course can run it for you, because the answers are specific to your organisation and several of them are about your organisation's dysfunction. That is the whole argument of this article, applied to you.`,
}

async function main() {
  console.log('Adding application prompts and skill module #4...\n')
  for (const [slug, addition] of Object.entries(ADDITIONS)) {
    const { data, error } = await sb.from('articles').select('body').eq('slug', slug).single()
    if (error || !data) { console.error(`  ✗ ${slug}: not found`); continue }
    const body = data.body as string
    const marker = addition.trim().split('\n')[0]
    if (body.includes(marker)) { console.log(`  – ${slug}: already present, skipped`); continue }

    const { error: wErr } = await sb.from('articles').update({ body: body.trimEnd() + '\n' + addition }).eq('slug', slug)
    console.log(wErr ? `  ✗ ${slug}: ${wErr.message}` : `  ✓ ${slug}`)
  }
  console.log('\nDone.')
}

main().catch(console.error)
