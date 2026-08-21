/**
 * Batch 75 — Recovery seed: 3 articles missing from DB
 * ai-roi-role, claude-cs-team-playbook, claude-for-hr-teams
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-75.ts
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
    termSlug: 'ai-roi',
    slug: 'ai-roi-role',
    angle: 'role',
    title: 'Is AI worth it for your team right now?',
    excerpt: 'An honest assessment of where the value actually is — and how to avoid the flashy-but-useless use case that burns trust and budget.',
    readTime: 6,
    tier: 2,
    cluster: 'Business Strategy & ROI',
    body: `
Most managers asking this question have already seen the demos. Claude writes a whole email in seconds. It summarizes a 40-page document instantly. It sounds impressive. Then a few weeks in, it turns out nobody uses it for anything that actually matters, and someone asks why you spent time on this.

The honest answer to "is AI worth it for your team right now?" is: **probably yes, but not for the reasons you've been shown.**

## Where the real value is

The ROI from Claude comes from three sources, in roughly this order of reliability:

**1. Repetitive high-stakes drafting.** Emails you write five times a day with slight variations. Proposals that follow a template but require customization. Status updates to senior stakeholders that need to be tight and professional. These are the things that burn 30–60 minutes per instance and where the quality gap between a rushed first draft and a polished one actually costs you something.

**2. Research synthesis.** Any time your team needs to pull together information from multiple sources — competitor analysis, industry context, summarizing customer feedback, reviewing a long contract — Claude compresses the time significantly. The output still needs human judgment to evaluate, but the gathering and structuring happens faster.

**3. First-draft generation for structured output.** Job descriptions, meeting summaries, project briefs, feedback templates. Work that has a known format and known inputs, where the bottleneck is starting.

These aren't the demos you usually see. They're unglamorous. But they're where the hours come from.

## Where the value usually isn't

**One-off tasks you do infrequently.** If someone on your team does something once a month, Claude reduces that task from 2 hours to 1 hour — which is a 50% reduction that nobody notices because it happens so rarely. The ROI is real but immeasurable.

**Tasks that require institutional knowledge Claude doesn't have.** Claude is great at writing, reasoning, and synthesis. It doesn't know your specific customers, your internal product roadmap, your actual pricing, or the history of why you made certain decisions. Anything where that context is the whole job, Claude is at best a collaborator.

**Anything where errors are invisible.** If your team uses Claude for something where a wrong answer is hard to catch — and that wrong answer ends up in front of a customer or a stakeholder — you'll lose more trust than the hours saved are worth.

## The one use case to start with

Don't give your team an open-ended "try Claude and see." Almost nobody knows what to try, and the people who are most skeptical will try the thing most likely to fail.

Instead, pick one task that:
- Happens frequently (at least weekly per person)
- Has a clear output format (email, summary, brief)
- Has a human reviewing the output before it ships

That's your proof of concept. If it works, it becomes the example. If it doesn't, you've learned something specific without losing credibility.

## What it costs to find out

Three things: time to set up a Project in Claude (30 minutes), a few hours of team experimentation over 2–3 weeks, and a conversation to collect what worked and what didn't.

If your team doesn't get value from that investment, you'll know specifically why — and you'll have a better answer for the next time someone asks.

If they do, you'll have a real example to build from instead of a demo.

## The question worth asking first

Before you commit to rolling this out, ask your team one question: **What takes longer than it should?**

Not "what would you like help with" — that produces a wish list. "What takes longer than it should" produces friction points. That's where Claude is most likely to create actual value.

The flashy use case is easy to sell. The boring use case is what sticks.

---

*Ready to run a proper pilot? [Running your first AI pilot](/articles/running-your-first-ai-pilot) covers the 30-day structure. For the specific tasks worth prioritizing first, [What to automate first](/articles/what-to-automate-first) has the framework.*
`,
  },

  {
    termSlug: 'ai-agent',
    slug: 'claude-cs-team-playbook',
    angle: 'process',
    title: 'The Claude playbook for CS teams',
    excerpt: 'System prompts, ticket workflows, escalation patterns, and QBR prep — the operational guide for deploying Claude across a customer success team.',
    readTime: 10,
    tier: 2,
    cluster: 'Role Workflows',
    body: `
Most CS teams have tried Claude individually and gotten uneven results. One rep uses it every day; another tried it twice and gave up. The QBR prep that took you 4 hours still takes your team 4 hours because you never shared the prompt that actually worked.

This is the playbook for moving from individual experiments to team-level deployment.

## The foundation: one shared Project

Before anything else, create a Claude Project that every CS rep can access. Load it with:

- Your product FAQ (the real one, including known limitations)
- Your escalation matrix (who gets what kind of issue)
- Your tone and style guidelines for customer communication
- A paragraph describing your customer segments and their typical sophistication level
- Any standing internal context: current product updates, known outages, recent changes

This isn't a one-time setup. It's a living context layer. Assign someone to keep it updated when things change.

The moment you have a shared Project, you've eliminated the biggest source of inconsistency: different reps are working from the same foundation.

## Ticket workflow: the three-step pattern

For individual ticket responses, teach your team this pattern:

**Step 1 — Paste the customer message and ask for a summary.** "Summarize what this customer is asking and what they're frustrated about." This forces Claude to extract the real issue before generating a response.

**Step 2 — Generate the response.** "Draft a reply addressing the root issue. Keep it under 150 words. Tone: direct but warm. Include a clear next step." The length and next-step constraint prevents the padded non-answer that ruins CSAT.

**Step 3 — Review for product accuracy.** Claude doesn't know your product. The rep reviews for anything technically incorrect before sending. This step takes 30 seconds — skip it and you'll send wrong information.

This isn't slower than writing from scratch. Once the rep has the draft, they're editing and verifying, not staring at a blank screen.

## Escalation: where Claude helps and where it doesn't

Claude is useful for escalation prep, not escalation decisions.

**Where it helps:**
- Summarizing the full ticket history for a senior team member or engineer ("Summarize this 14-message thread. What's the customer's original issue, what's been tried, and what's unresolved?")
- Drafting the escalation notification to the customer ("Tell the customer we're escalating this and provide a realistic timeline. Don't overpromise.")
- Preparing your internal notes before a call

**Where it doesn't help:**
- Deciding whether to escalate — that requires judgment about customer value, relationship history, and internal capacity that Claude doesn't have
- Generating promises about resolution timelines unless you've given it accurate information to work from

A useful internal guideline: Claude helps you communicate a decision you've made. It doesn't make the decision.

## Account health: early warning signals

One underused application: using Claude to synthesize signals across accounts.

At the start of each week, have reps paste their 3–5 at-risk accounts and ask: "Based on these notes and recent interactions, what are the 2–3 most likely churn risks? What pattern connects them?"

This works better than you'd expect because CSMs often have the signals in their notes — a customer who's gone quiet, a QBR that felt off, a product change they weren't happy about — but haven't synthesized them into a pattern. Claude surfaces the pattern without judgment.

It's not a replacement for your health score system. It's a complement: qualitative signals that quantitative systems miss.

## QBR prep: the template that actually saves time

QBR prep is where CSMs spend the most time and where Claude delivers the highest time savings. Here's the structure that works:

**What to give Claude:**
- ARR and growth trend
- Product usage data (which features, frequency, volume)
- Key wins from the past quarter (specific examples, not general claims)
- Open support issues or recent friction points
- Goals for the coming quarter

**What to ask for:**
"Using this data, draft the narrative for a 20-minute QBR. Structure it as: (1) what worked and why, (2) what didn't and what we're doing about it, (3) what we're focused on next quarter and why it matters to them. Make it specific — no generic statements."

The output will need editing for voice and accuracy. But you've eliminated the hardest part: translating data into a narrative frame.

Time savings: typically 90–120 minutes per account, per quarter.

## Onboarding new reps

When you onboard a new CSM, give them three things before they touch their first ticket:

1. The shared Project (already loaded with context)
2. A 30-minute walkthrough of the three-step ticket pattern
3. Five real examples of a before/after: messy first draft → Claude-assisted response

Don't explain AI philosophy. Show the workflow.

The new rep will be effective faster, and they'll adopt the pattern because they've seen it work.

## What to measure

Three metrics worth tracking once you've deployed this:

**Time to first response** — usually drops 20–40% when reps are using the ticket workflow
**CSAT on AI-assisted tickets** — should be comparable to or better than unassisted; if it drops, the review step is being skipped
**QBR prep time per account** — track before and after the first quarter; this is where the largest savings show up

If you're not measuring, you can't make the business case for expanding this — and you'll lose ground when someone asks whether it's working.

## The failure mode to avoid

The most common failure in CS team deployments: giving reps access to Claude and no guidance on how to use it.

Some will figure it out. Most won't. The ones who don't will conclude it's not useful, and that conclusion will spread.

The playbook isn't complicated. But it needs to be handed to reps, not discovered by them.

---

*For the individual CSM workflow, [the CS manager's daily workflow with Claude](/articles/cs-manager-ai-workflow) covers the day-in-the-life pattern. For measuring whether the team deployment is working, [measuring AI ROI](/articles/measuring-ai-roi) has the metrics framework. If you're still getting approval for this rollout, [getting IT approval for Claude](/articles/getting-it-approval-for-claude) covers that conversation.*
`,
  },

  {
    termSlug: 'claude',
    slug: 'claude-for-hr-teams',
    angle: 'role',
    title: 'How HR teams are actually using Claude',
    excerpt: 'From job description drafting to performance review prep — the practical applications that save HR time without creating compliance risk.',
    readTime: 8,
    tier: 2,
    cluster: 'Role Workflows',
    body: `
HR is a function where the writing volume is high, the stakes are real, and the margin for tone errors is small. It's also one of the places where AI is being used most unevenly — some HR teams are saving hours a week, others have been burned by compliance concerns and stepped back.

This guide is about the applications that actually work, and the ones where you need to be more careful.

## Where HR teams get the most time back

**Job descriptions.** JDs are the highest-volume writing task in most HR functions. A well-run HR team writes dozens per month, often from scratch, often against tight hiring deadlines. Claude can produce a solid draft in 90 seconds given a role title, level, team context, and 3–4 key requirements. The draft still needs human review for accuracy and bias (Claude can inadvertently reproduce patterns it's been trained on), but the blank-page problem disappears.

The prompt that works: "Write a job description for a [Level] [Role] on our [Team]. Key requirements: [list]. We want candidates who [specific quality]. Avoid jargon. Length: 350–450 words."

**Offer letter and contract templates.** Claude is useful for drafting new template variants — a contractor version of your standard offer, an amendment template for a role change — but these always need legal review before they're used. Think of Claude as a first draft machine, not a lawyer.

**Interview question development.** Generating structured, role-specific interview questions for each stage of a hiring process. Especially useful for new roles where the hiring manager hasn't interviewed for this function before. Claude can suggest behavioral questions, technical probes, and culture questions — your job is to select and adapt.

**Internal policy drafting.** When HR needs to write or update an internal policy — expense policy, PTO guidelines, a code of conduct update — Claude can produce a solid first draft. The context you need to provide: the principle behind the policy, who it applies to, and any specific scenarios it needs to cover.

**New hire documentation.** Onboarding emails, welcome guides, first-week checklists. Claude handles the structure and language; you customize for your company's voice and specifics.

## Performance review season

Performance reviews are where Claude can save the most hours across an entire HR cycle.

**For managers writing reviews:** Load a Project with your performance rating scale, the review template structure, and examples of what "exceeds expectations" looks like at your company. Then have managers paste their notes and ask Claude to draft a structured review. The manager edits for accuracy — they know the person, Claude doesn't.

**For HR coaching managers:** Some HR business partners use Claude to prepare coaching conversations before helping a manager write a difficult review. "Help me think through how to frame feedback for a high performer who needs to develop executive presence" — this kind of reflective use is low-risk and genuinely useful.

**For calibration prep:** Summarizing review language across a team to spot patterns ("this manager rates everyone as exceptional; what's the pattern in their language?") can surface calibration issues before the committee meeting.

## What to be more careful about

**Anything involving specific employees in a way that could be discriminatory.** Claude doesn't discriminate, but how you use it can create issues. "Write a PIP for a 58-year-old employee who is slow" — even though Claude doesn't care about the age, the framing you're bringing can find its way into the output in subtle ways. Keep individual employee cases at the level of: "I'm managing someone who [behavioral description]. Help me think through the right language."

**Generated policy that goes to employees without legal review.** Anything binding — offer letters, PIPs, termination documentation, benefits explanations — needs counsel. Claude can draft it, but it's not a lawyer and it doesn't know your jurisdiction.

**Anything that touches pay equity.** Compensation-related decisions shouldn't be delegated to Claude. It can help you draft communication about a compensation change, but the decision itself is human.

## The compliance angle

The concern HR leaders usually raise: "What if Claude generates something biased in a job description or review?"

The answer is: Claude can, and the safeguard is human review, not avoidance. You review every JD before it's posted. You review every review before it's delivered. The risk isn't that Claude generates biased content — it's that someone posts or sends it without reading it.

The process fix: make human review a step in the workflow, not an afterthought. Claude drafts; you review and edit before anything goes anywhere.

## Getting your team started

The most practical starting point for most HR teams: job descriptions and interview questions. These are high-volume, low-stakes to try, and the time savings are immediately visible.

One week of drafting JDs with Claude, comparing to your previous process, and you'll have the data point you need to expand.

After that, the natural second step is onboarding documentation — then performance review support once you're comfortable with the workflow and have set expectations with your team about the review step.

---

*For the admin side of deploying Claude to your organization, [setting up Claude for your team](/articles/setting-up-claude-for-your-team) covers the technical setup. For making the business case, [building a business case for Claude](/articles/building-a-business-case-for-claude) has the framework.*
`,
  },
]

async function main() {
  console.log('Seeding batch 75 — 3 missing articles...\n')

  for (const a of ARTICLES) {
    const term = await getTermId(a.termSlug)
    if (!term) {
      console.error(`Term not found: ${a.termSlug}`)
      continue
    }

    const { error } = await sb.from('articles').upsert({
      slug: a.slug,
      term_id: term.id,
      term_name: term.name,
      term_slug: a.termSlug,
      angle: a.angle,
      title: a.title,
      excerpt: a.excerpt,
      read_time: a.readTime,
      tier: a.tier,
      cluster: a.cluster,
      body: a.body.trim(),
      published: true,
    }, { onConflict: 'slug' })

    if (error) {
      console.error(`Failed: ${a.slug}`, error.message)
    } else {
      console.log(`✓ ${a.slug}`)
    }
  }

  console.log('\nDone.')
}

main()
