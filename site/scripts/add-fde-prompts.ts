/**
 * Application prompts for the FDE series (retro instruction #30).
 *
 * The Agent Manager series all had prompts; the four FDE articles had none —
 * which is the worst place for the gap, since these are career-transition
 * articles where the whole value is the reader doing something.
 *
 * Includes skill module #5 on fde-portfolio-projects: writing the ADR. It is
 * the cheapest of the five portfolio projects, it can be done in one sitting
 * from work already finished, and it tests the thing FDEs are actually hired
 * for — explaining an architecture decision to someone non-technical.
 */
import { createClient } from '@supabase/supabase-js'
import { hasApplicationPrompt } from './_lib/article-gate'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ADDITIONS: Record<string, string> = {

  'what-is-a-forward-deployed-engineer': `

## Try this today — 15 minutes

Do not start building a portfolio yet. Find out first whether this is your role.

Open the "What companies look for" and "Is this role right for you?" sections above and score yourself honestly on each line: **have**, **could learn in six months**, or **genuinely not me**.

Then write one sentence in the form: *"I am a [current role] with [N] years of [domain], and the FDE gap I need to close is ______."*

Three ways that sentence usually comes out, and what each means:

- **"…is enterprise exposure."** Common, and the most fixable. You can code; you have never been in the room. Pick the transition path in [how to become an FDE](/articles/how-to-become-forward-deployed-engineer).
- **"…is agent-building experience."** Also fixable, and faster. Start with [the portfolio projects](/articles/fde-portfolio-projects).
- **"…is that I do not want to be client-facing."** That is a real answer and a useful one. The [AI Agent Manager](/articles/what-is-an-agent-operator) role is the same technical work without the travel and the client politics. It is not a consolation prize; for a lot of people it is the better job.

Fifteen minutes here saves you six months of building toward the wrong role.`,

  'how-to-become-forward-deployed-engineer': `

## Try this today — 30 minutes

Pick your transition path from the three above and commit to one. Not two.

Then write a three-line plan and put it somewhere you will see it in a month:

1. **My path:** [backend engineer / consultant / data or ML] → FDE
2. **The gap I am closing first:** the single weakest item in the 4-part skill stack. One, not four.
3. **The first evidence I will produce, by [date within 6 weeks]:** a specific artifact — a running MCP server, a written eval suite, an ADR. Not "learn more about agents."

Then book the first block of time in your calendar now, while the article is open. The path fails at this step far more often than at the technical ones — not because people cannot learn the material, but because "become an FDE" stays a category of intention instead of becoming a task with a date.

**A note on the honest filter above.** If you read it and felt relief rather than recognition, take that seriously. Ruling this out deliberately is a good outcome for a thirty-minute exercise.`,

  'fde-portfolio-projects': `

## Skill module: write the ADR this weekend

**The scenario.** You have decided to pursue FDE roles. Looking at the five projects above, you estimate three months of evenings and quietly lose momentum. Meanwhile you already have work — a system you built at your job, a service you designed, a migration you led — that nobody outside your team has ever seen.

**Your task.** Write project 4, the architecture decision record, this weekend, about something you have **already built**. Two to three pages. One real decision, from real work.

Do this one first for three reasons. It is the only project of the five that requires no new code. It is the one most candidates skip, so it differentiates immediately. And it tests the thing FDEs are genuinely hired for — explaining a technical decision to someone who is not technical and getting them to agree.

Structure it as: **the decision**, **the context and constraints**, **the options you rejected and why**, **what you chose**, **what it cost you**, and **what you would do differently**.

**What good looks like** — the opening of a real one:

> **Decision:** We put the order-sync service behind a message queue instead of calling the ERP's API directly.
>
> **Context:** The ERP allowed 40 requests per minute across the whole company. Warehouse scanning alone peaked at 300. The vendor quoted eleven weeks to raise the limit and would not commit to a number.
>
> **Rejected — client-side rate limiting:** simplest, and it would have meant a scanner operator waiting up to nine minutes at peak. Rejected on the floor, by the operations lead, in about four seconds. That was the right call and I had not weighted it properly.
>
> **Rejected — caching reads:** helped reads, did nothing for writes, and writes were the problem.
>
> **Chose — queue with batched writes:** batches of 25 on a 10-second window, well inside the limit at peak.
>
> **What it cost:** eventual consistency. Inventory can be up to 10 seconds stale. We agreed that explicitly with operations and put the staleness window in the UI.
>
> **What I would do differently:** I spent a week on the caching approach before talking to the operations lead. Ten minutes with her would have killed it on day one. I now start these by asking who feels the constraint.

**The common mistake.** Writing the ADR as though the decision was obvious in hindsight. An interviewer learns nothing from a clean narrative — they are reading for whether you can hold two viable options in tension, name what you gave up, and admit a misstep without theatre. The "what it cost" and "what I would do differently" sections are the whole document. If yours are thin, the ADR is marketing rather than evidence.

**Why this is the rep.** Every FDE engagement ends in a version of this conversation — with a client's architect, or their CFO, or a sceptical internal team. Writing one is the closest you can get to practising it before you are in the room. And unlike the other four projects, you can finish it in a weekend and have something to send on Monday.`,

  'fde-for-career-counselors': `

## Try this today — 20 minutes

Do not build a program yet. Have one conversation.

Pick **three students or advisees** who fit the profile in "Who should pursue this" — the backend-leaning ones who are competent but not standing out in a crowded new-grad market, and the career-changers with domain depth in an industry that is now deploying AI.

Send each of them one message with one specific thing in it. Not "have you considered forward deployed engineering." Something like:

> There is a role called Forward Deployed Engineer — engineers who go into a company and build AI systems inside their actual environment. Hiring is growing fast and comp starts well above standard new-grad engineering. It rewards exactly the thing you have that most candidates do not: [their specific domain, industry experience, or client-facing instinct]. Worth 20 minutes of reading: [link]

Then note who replies and what they ask. Those questions are your program design. Building curriculum before you know which part confuses people is how career-services programs end up answering questions nobody had.

**The one number to keep handy** when a student's parent asks whether this is a real career: entry compensation starts around $150K and senior roles reach $700K+ total comp, at companies including Anthropic, OpenAI, and Palantir. That sentence ends the conversation about legitimacy faster than any explanation of the role.`,
}

async function main() {
  console.log('Adding FDE application prompts and skill module #5...\n')
  for (const [slug, addition] of Object.entries(ADDITIONS)) {
    const { data, error } = await sb.from('articles').select('body').eq('slug', slug).single()
    if (error || !data) { console.error(`  ✗ ${slug}: not found`); continue }
    const body = data.body as string
    if (hasApplicationPrompt(body)) { console.log(`  – ${slug}: already has a prompt, skipped`); continue }

    const next = body.trimEnd() + '\n' + addition
    const { error: wErr } = await sb.from('articles').update({ body: next }).eq('slug', slug)
    console.log(wErr ? `  ✗ ${slug}: ${wErr.message}` : `  ✓ ${slug}`)
  }
  console.log('\nDone.')
}

main().catch(console.error)
