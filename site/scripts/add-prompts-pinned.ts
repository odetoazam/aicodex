/**
 * Application prompts for the 11 pinned articles (retro instruction #30).
 *
 * These are the first thing each persona tab shows, so they are the highest-
 * leverage place in the corpus for a rep. Backlog after this pass: ~193.
 *
 * Each prompt is written to the specific article, uses something the reader
 * already has, and produces an artifact. No generic "go try it" filler — that
 * is the failure mode Kwame objects to and it is worse than no prompt.
 */
import { createClient } from '@supabase/supabase-js'
import { hasApplicationPrompt } from './_lib/article-gate'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ADDITIONS: Record<string, string> = {

  'new-to-ai-start-here': `

## Try this today — 15 minutes

One task, from your actual job, that you already know the answer to.

That last part is the trick. Pick something you have already done this week — an email you sent, a summary you wrote, a decision you talked through. Ask Claude to do the same thing, then compare.

Working from a known answer does two things nothing else does. You can tell immediately whether the output is good, because you already know what good looks like. And you find out where it is weak on your kind of work specifically, rather than on a generic example.

Then do the thing most people skip: **reply once**. Say what was wrong with the first answer — "too long", "you missed that this is for a client, not internally", "the second point is not right". The gap between a first answer and a second answer is where most of the value in this lives, and most people close the tab before they find it.

If the second answer is meaningfully better, you have learned the actual skill. If it is not, tell it what you wanted more precisely and go once more.`,

  'what-to-share-with-claude': `

## Try this today — 10 minutes

Write your own version of the vendor test, for your specific job, before you need it.

Three lines on a sticky note or in a notes app:

1. **Always fine:** the categories of information you would put in a Google Doc without thinking. Drafts, public information, your own notes, anything already in a shared drive.
2. **Only with the right plan or account:** client work, internal documents, anything covered by a customer contract. Name which account of yours qualifies.
3. **Never, on any account:** the specific things your industry or contract prohibits. Card numbers, patient records, credentials, unreleased financials — whatever yours are, name them concretely rather than as a category.

Ten minutes now means you stop re-litigating the question every time you paste something, which is the actual cost of not having decided. It also means that when a colleague asks — and they will — you have an answer rather than a hedge.

If you cannot confidently fill in line 2, that is your finding: ask whoever owns your Claude account which plan you are on and what its data terms are.`,

  'when-your-ai-model-disappears': `

## Try this today — 20 minutes

Find every place a model name is hard-coded in something you own.

\`\`\`bash
# Adjust for your stack — the point is to find them all, not to be clever
grep -rn "claude-opus\\|claude-sonnet\\|claude-haiku\\|claude-fable\\|gpt-5\\|gemini-" \\
  --include="*.ts" --include="*.py" --include="*.js" --include="*.yaml" --include="*.env*" .
\`\`\`

Count the hits. Most people expect two or three and find nine — in a config file, a test fixture, a notebook someone left behind, and a deployment variable nobody remembers setting.

Then do one thing: **move them all to a single constant**, and leave a comment saying that is where they live. That is the whole exercise. You are not building a fallback chain today; you are making the fallback chain possible to build in an afternoon rather than a week, at the moment when you have no time.

Three Claude models were retired or suspended in the first half of 2026 alone. The grep takes twenty minutes. The retirement notice arrives without warning.`,

  'ai-platform-landscape-2026': `

## Try this today — 25 minutes

Do not run a bake-off. Answer the four questions that make one unnecessary.

Write the answers down — a shared doc, so the next person who asks gets the same answer:

1. **Where does the work actually happen?** Name the suite your team lives in. This decides more than capability does, because a tool people have to switch tabs for loses to one that is already open.
2. **What is the twelve-month cost, not the today cost?** At least one vendor on your shortlist is on introductory pricing that expires. Find out which.
3. **What will your security team refuse?** Ask them now, in one email, before you evaluate anything. A "no" in month four is the most expensive possible time to get one.
4. **What happens when the model you standardise on is retired?** Every vendor here retires models roughly annually. Whoever you pick, the answer needs to exist.

If you can answer all four, you have made the decision. Most evaluations that drag on for a quarter are stuck on question 3 or 4 and running capability tests instead of asking.

**One deliberate output:** whichever platform you choose, write down what would make you change your mind. Revisit it in six months. A decision with no revisit condition becomes an identity, and identities are expensive in a market that moves this fast.`,

  'claude-compliance-api': `

## Try this today — 30 minutes

Before you integrate anything, find out what your organisation actually needs from this — because the answer determines which of the 28 partners matter and which are noise.

Ask your security or compliance lead three questions, in one message:

1. **What is our retention requirement for AI conversations, in months?** If nobody knows, that is the finding, and it is a common one.
2. **In an eDiscovery request, who is expected to produce AI conversation records, and how long do they have?** This is the question that turns the Compliance API from nice-to-have into a line item.
3. **Do we need coverage of sessions running on employees' own machines?** Since August 11, 2026 the API reaches local Cowork and Claude Code sessions. Most audit stories have this blind spot and most people have not noticed.

Then map their answers to the partner groups above and pick **one** integration to pilot — almost always the SIEM you already run, because routing into an existing tool needs no new dashboard and no new training.

The mistake to avoid is integrating all 28 because they are available. Every integration is a thing someone maintains. Start with the one that answers a question your auditor has actually asked.`,

  'auditing-your-eval-suite': `

## Try this today — 45 minutes

Run step 4 only — golden dataset currency. It is the fastest of the five steps and it fails most often.

Open your golden dataset and check three things:

1. **When was each case added?** Anything older than your last two model changes is testing behaviour you no longer ship.
2. **Where did the cases come from?** If they were written by you in one sitting, they encode the failure modes you imagined, not the ones your users hit. Real production failures should outnumber invented cases.
3. **What has changed in the product since?** A new feature with no eval cases is an untested surface, and it is usually the newest thing that breaks.

Then add **three cases from real production failures in the last quarter**. Not hypotheticals — actual things that went wrong, with the output you got and the output you wanted.

If you cannot find three real failures, that is itself a finding: either you are not logging enough to know when the agent is wrong, or nobody is reporting it. Both are more urgent than the eval suite.

**The uncomfortable version of this exercise:** take the last thing a user complained about and check whether your suite would have caught it. Most suites would not, and that gap is the whole reason to audit.`,

  'founder-ai-workflow': `

## Try this today — 20 minutes

Pick the one of the four workflows above that matches what is actually on your plate this week, and run it once. Not all four.

Then do the part that makes it stick: **put whatever context you had to explain into a Project.**

Almost every founder's first week with Claude involves re-typing the same three paragraphs about what the company does, who the customer is, and what stage you are at. The second week involves doing it again. That re-explanation is the tax that makes the whole thing feel not-quite-worth-it, and it is the thing Projects exist to remove.

Fifteen minutes of setup — your positioning, your ICP, the current quarter's goal, and two examples of writing in your voice — and every future conversation starts where this one ended.

If you only do one thing from this article, do that. The workflows are useful; the Project is what makes them repeatable. [Setting up your Project](/articles/solo-founder-project-setup) covers exactly what to put in it.`,

  'solo-founder-project-setup': `

## Try this today — 15 minutes

Do the setup above, but write the system prompt for **the person who joins in six months**, not for yourself.

That single reframe fixes the three things founders skip. You already know what the company does, so you write a thin prompt. Someone new does not, and neither does Claude — and Claude is, functionally, a new hire on every conversation.

So write it as onboarding:

- What we do, in the words a customer would recognise, not the words on the pitch deck
- Who we sell to, and specifically who we do **not**
- The decisions already made and closed, so nobody reopens them — the stack, the pricing model, the positioning
- The two or three things that are still genuinely undecided
- How we write: one paragraph of instruction, and one real example

Then a test worth doing: open a fresh conversation, ask a question you already know the answer to, and see whether the Project answers it the way you would. Where it does not, the prompt is missing something — and the gap you find is almost always the thing you thought was too obvious to write down.

Fifteen minutes now. It compounds on every conversation after it, and it is genuinely the onboarding doc when you do hire.`,

  'claude-for-agencies': `

## Try this today — 30 minutes

Take one live client deliverable and split it into three columns.

| Column | What goes in it |
|---|---|
| **AI does the first pass** | Research, first drafts, synthesis, reformatting, competitive scans |
| **Human does it, informed by AI** | Strategy, the recommendation, anything requiring taste or client-relationship knowledge |
| **Human only, no AI involved** | Anything covered by a client confidentiality clause, and anything where the judgement *is* the product |

Be specific to that one deliverable. This is not a policy exercise — you are looking at real work on a real timeline.

Two things fall out. You will find at least one task in column one you have been doing manually out of habit, which is immediate margin. And you will find the boundary of column three, which is what you should actually be telling clients about — see [what to tell clients about AI](/articles/what-to-tell-clients-about-ai).

**Then the harder question, worth five more minutes:** now that column one is faster, is that deliverable still priced correctly? If you are delivering in six hours what you scoped at fourteen, you have a repricing decision, not a productivity win. [Pricing Claude consulting work](/articles/pricing-claude-consulting-work) covers it.`,

  'pricing-claude-consulting-work': `

## Try this today — 30 minutes

Take your most recent completed engagement and reprice it, on paper, as an outcome rather than as hours.

Three numbers:

1. **What you charged**, and how many hours it actually took.
2. **What it was worth to the client** — in their terms. Hours saved per week across how many people, or a revenue number, or a risk removed. If you cannot estimate this, you have found the real problem: you did not ask, and that is why you are billing hours.
3. **What you would charge if you priced at 10–20% of the first-year value** of number 2.

The third number is usually two to four times the first. That gap is not greed; it is the difference between selling your time and selling the result, and clients who are getting a result rarely dispute it.

Then write the two sentences you would use to justify the new number to that specific client. If you cannot write them convincingly, you are missing evidence — go get number 2 properly on the next engagement by asking during discovery rather than guessing afterward.

**The move that changes the business:** ask the value question in the *first* conversation of the next engagement, not the last. Everything about pricing gets easier when the client has said the number out loud themselves.`,

  'claude-plus-notion': `

## Try this today — 20 minutes

Pick the workflow above that matches something you did manually in Notion this week, and run it once end to end.

Then decide honestly whether it beat doing it by hand. Sometimes it will not — and knowing which of the three workflows is genuinely faster for *your* setup is worth more than adding a fourth.

Two things that decide the answer, and both are worth checking while you are there:

- **How your Notion is structured.** These workflows work well on databases with consistent properties, and badly on a wiki of freeform pages. If yours is the second kind, the fix is Notion-side, not Claude-side.
- **Whether the context is reusable.** A one-off that takes as long to set up as to do manually is a loss. The same thing run weekly is a clear win. Sort your candidate workflows by frequency before you automate any of them.

**The pitfall to check for specifically:** verify that what came back matches what is actually in Notion, on this first run. Read the source pages. Getting a plausible, well-formatted, subtly wrong summary is the failure mode here, and it is invisible unless you check the first one deliberately.`,
}

async function main() {
  console.log('Adding application prompts to pinned articles...\n')
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
