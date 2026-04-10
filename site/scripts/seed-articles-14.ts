/**
 * Batch 14 — Executive leaders + engineering teams
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-14.ts
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

  // ── 1. AI for executive leaders ──────────────────────────────────────────
  {
    termSlug: 'ai-roi',
    slug: 'ai-for-executive-leaders',
    angle: 'process',
    title: "What executives actually need to know about AI at work",
    excerpt: "You're not implementing it yourself — but you're approving the budget, setting expectations, and accountable for the results. Here's the executive-level view: what to ask, what to expect, and where things go wrong.",
    readTime: 7,
    cluster: 'Business Strategy & ROI',
    body: `You have probably been asked to approve a budget for AI tools, weigh in on an AI policy, or understand why a Claude rollout is "going slower than expected." Maybe your team has been experimenting for six months and you're not sure if anything has changed.

This is the executive-level view. Not how to use Claude — how to govern a Claude implementation, ask the right questions, and know when something is working versus when you're being told what you want to hear.

## The frame that matters most: AI is a capability, not a project

Most AI rollouts fail not because the tools don't work, but because organisations treat them like a project with an end date. "We rolled out Claude" is not a meaningful outcome. The outcome is whether specific people are doing specific work differently — faster, better, or cheaper.

Your job is to push past the adoption metrics (seat licenses used, logins this month) and ask about the actual work. Which teams are doing something they couldn't do before? Which workflows have changed? Where has it saved real time?

If no one can answer those questions concretely after three months, you have a tool deployment, not an AI capability.

## The four questions to ask your team

**1. Which teams are using it — and what are they using it for?**
Not "are people logging in" but "what are they actually doing." Ask for specific examples. A CS team that drafts ticket responses 40% faster is a result. "Everyone is using it more" is not.

**2. What have you configured that you couldn't just do with the default?**
A real deployment involves [Projects](/glossary/claude-projects) with custom [system prompts](/glossary/system-prompt), relevant documents loaded, and [Skills](/glossary/skill) or [Connectors](/glossary/connector) that connect Claude to your actual data. If the answer is "nothing — people just use Claude.ai," the organisation has not deployed Claude. Individuals have personal accounts.

**3. What's the cost per meaningful outcome?**
Your admin should be tracking [token](/glossary/token) usage by team. More importantly, they should be able to map usage to outputs — tickets handled, documents produced, research completed. If you can't connect spend to outcomes, you can't manage the investment.

**4. What's in the way?**
The blockers that slow AI adoption in most organisations are not technical. They are: unclear guidance on what's allowed (people default to not using it), lack of a configured starting point (everyone reinvents the wheel), and no social proof (people don't see colleagues getting value, so they don't try). Ask your admin what the actual friction is — and whether it's been addressed.

## What realistic ROI looks like

Two traps to avoid:

**The vanity trap:** Your team shows you hours saved based on self-reported surveys. This is real but hard to verify. More useful: ask for specific workflow comparisons — how long did this task take before, how long now, in a real example.

**The AI hype trap:** Claude can do almost anything, so almost everything sounds like an opportunity. Focus on the 3–5 use cases that involve your highest-volume, highest-value work. A great AI use case has: high frequency (daily or weekly), significant time cost, text-heavy or research-heavy nature, and consistent enough inputs that the AI can be configured well.

[Measuring AI ROI](/articles/measuring-ai-roi) covers the full framework. The key executive insight: ROI compounds when the same people use Claude for progressively more complex work, not when you expand to new teams too quickly.

## Where things go wrong at the executive level

**Setting unrealistic timelines.** Real AI adoption takes 90–120 days to show measurable impact at team level. Organisations that declare success at 30 days (or failure at 45) have not run a real experiment.

**Confusing deployment with adoption.** Sending a "we now have Claude" company announcement and distributing licenses is day zero, not day one. Adoption requires configured tools, active training, and someone accountable for each team's use case.

**Delegating without a mandate.** You cannot ask someone to "lead AI implementation" and then not give them the authority to change how teams work. The admin can configure Claude brilliantly, but if department heads aren't accountable for their team's adoption, it stays optional — and optional things don't get prioritised.

**Treating AI policy as a legal exercise.** AI usage policies written by legal teams tend to produce long lists of things people cannot do. What you need is a short, clear framework that tells people what they *can* do, what requires review, and what's off-limits. See [How to write an AI usage policy your team will actually follow](/articles/ai-usage-policy-for-teams).

## What to expect at each stage

**Month 1:** Mostly exploration. Early adopters find use cases. Expect chaos in the first Project structures. This is normal.

**Month 2–3:** Teams start to develop consistent workflows. The first real time savings appear. Expect to hear from teams that are stuck — usually because their system prompt is vague or they haven't uploaded the right documents.

**Month 3–6:** Compounding starts. Teams that have been using Claude consistently start using it for progressively harder work. The gap between teams that adopted early and those that haven't becomes visible.

**Month 6+:** The question shifts from "is it working" to "what do we do next." New capabilities (agents, automated workflows, deeper integrations) become relevant. The administration work increases — you now need proper governance, not just setup.

## Your single highest-leverage action

Make one department head accountable for their team's AI adoption — with a specific outcome to hit by a specific date. Not "use Claude more." Something like: "CS team handles 20% more tickets per person without quality drop by end of Q2." Then resource them properly and get out of the way.

The organisations that get real value from AI are not the ones with the biggest budgets or the most sophisticated setup. They are the ones where someone is genuinely accountable for making it work.
`,
  },

  // ── 2. Claude for engineering teams ──────────────────────────────────────
  {
    termSlug: 'claude-code',
    slug: 'claude-for-engineering-teams',
    angle: 'field-note',
    title: "Claude for engineering teams: beyond the obvious",
    excerpt: "Engineers are often the last team to adopt Claude, and the first to find the most interesting uses once they do. The field note on what actually works — beyond autocomplete.",
    readTime: 6,
    cluster: 'Business Strategy & ROI',
    body: `Engineering teams have a complicated relationship with AI. Most engineers already know Claude. Many have strong opinions. And somehow, engineering teams are often the last in an organisation to build a consistent, configured Claude workflow — even though they're surrounded by the tools to do it.

The reason is usually this: engineers try Claude for code generation, find it useful but not transformative, and file it under "nice to have." The teams that get the most out of Claude have found a different set of use cases — ones where Claude is not replacing what they already do well, but filling the gaps where the team is genuinely slow.

## What engineering teams actually use Claude for

The high-value use cases are rarely "write me a function." They are:

**Incident and postmortem analysis.** After an incident, someone has to write a postmortem. It involves synthesising logs, timelines, and stakeholder perspectives into a structured document. Claude is excellent at this: give it the raw Slack thread, the alert timeline, and the bullet points from the retro, and it will produce a first draft in minutes. Engineers still own the analysis — Claude handles the structure and prose.

**Documentation that actually gets written.** Engineering teams perpetually underdocument. Claude doesn't fix the problem of "no one wants to write docs" — but it dramatically lowers the cost. An engineer can describe a system verbally, paste in the relevant code, and ask Claude to produce an ADR (Architecture Decision Record), a README, or an API reference. The draft takes five minutes; cleaning it up takes fifteen. Before, writing it from scratch took two hours — so it didn't happen.

**PR review prep.** Before requesting a review, engineers can ask Claude to review their own PR: "Here is the diff. What edge cases am I missing? What would a senior reviewer likely flag?" This does not replace human review — it makes it faster and catches obvious issues before they waste a reviewer's time.

**Debugging unfamiliar code.** "I'm looking at this function and I don't understand why it does X. Here is the context." Claude is patient, thorough, and doesn't make you feel stupid for not knowing something. For engineers working in an unfamiliar part of the codebase, or dealing with someone else's legacy code, this is often the highest-value daily use.

**Writing RFC and design doc prose.** Most engineers can produce a bullet list of what a system should do. Turning that into a coherent RFC that non-engineers can read is a different skill. Claude is good at this translation — particularly when you give it the bullet points, the constraints, and an example of a past RFC you liked.

## Setting up a Claude Project for engineering

The engineering Project often gets neglected because engineers assume they don't need configuration — they'll just ask ad hoc. This works poorly. A well-set-up engineering Project should include:

**In the system prompt:**
- Your stack (languages, frameworks, infrastructure)
- Your coding conventions and style guide principles
- What makes a good PR in your org (what reviewers actually check for)
- Your incident severity definitions
- Any acronyms or internal names Claude would otherwise guess at

**Documents to upload:**
- Architecture overview (one-pager or diagram description)
- Your ADR template
- Your postmortem template
- A sample RFC in your org's format
- Any public API contracts relevant to your team's work

The goal is not to give Claude your entire codebase — it's to give Claude the context it needs to produce outputs in your organisation's format, voice, and technical style. A Claude that knows you use TypeScript with strict mode, prefer functional React, and write ADRs in Notion beats a generic Claude every time.

## The skeptic arc

Most engineering teams go through a predictable pattern:

1. **Skepticism** ("I write better code than it does")
2. **Narrow adoption** ("I use it for regex and SQL but nothing else")
3. **Bottleneck discovery** ("Wait, this postmortem would have taken me three hours")
4. **Expansion** ("I now use it for anything where the output is prose or structure, not logic")

The teams that get stuck at stage 2 are usually using Claude for the wrong thing: asking it to generate core application logic from scratch, which is genuinely hit or miss. Teams that move past stage 2 have found the tasks where Claude is reliably excellent: synthesis, structure, documentation, and explaining things.

It helps to share specific examples within the team. "Here's the PR description I generated in two minutes" is more convincing than any argument. Engineers are empiricists — show them evidence, not theory.

## Claude Code vs Claude for engineering teams

[Claude Code](/glossary/claude-code) (the terminal tool) and Claude (the workspace) are different tools for different contexts. Claude Code is for deep, in-codebase work: multi-file edits, test generation, refactoring with full file context. Claude in the workspace is for synthesis, communication, and knowledge work around the engineering process.

Most engineering teams benefit from both. Claude Code replaces many coding tasks that previously required a human. Claude in Projects replaces many communication and documentation tasks that previously required effort no one wanted to spend.

If your engineering team is only using one, they're leaving half the value on the table.

## What doesn't work

**Pasting entire codebases.** Claude has a large context window, but flooding it with code it doesn't need produces worse outputs, not better. Give it the relevant file, the function, and the context — not the whole repo.

**Vague questions.** "How do I make this faster?" produces less useful output than "This function scans 500k rows on every API call. The table has an index on user_id. Here's the query plan. What am I missing?"

**Skipping review for customer-facing outputs.** Claude-drafted customer communications, release notes, and external documentation should always have a human pass. The bar for "good enough to ship" is higher than "good enough as a first draft."
`,
  },

]

async function seed() {
  for (const article of ARTICLES) {
    const term = await getTermId(article.termSlug)
    if (!term) {
      console.error(`Term not found: ${article.termSlug}`)
      continue
    }

    const { error } = await sb.from('articles').upsert({
      slug: article.slug,
      term_id: term.id,
      term_name: term.name,
      term_slug: article.termSlug,
      cluster: article.cluster,
      title: article.title,
      angle: article.angle,
      body: article.body.trim(),
      excerpt: article.excerpt,
      read_time: article.readTime,
      tier: 2,
      published: true,
    }, { onConflict: 'slug' })

    if (error) {
      console.error(`Error seeding ${article.slug}:`, error.message)
    } else {
      console.log(`✓ ${article.slug}`)
    }
  }
}

seed().then(() => process.exit(0))
