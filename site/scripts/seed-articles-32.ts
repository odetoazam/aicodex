/**
 * Batch 32 — CS team playbook + HR deep dive (Pass 2 role-type content)
 * claude-cs-team-playbook, claude-for-hr-teams
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-32.ts
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

  // ── 1. CS team playbook (CS leader angle) ─────────────────────────────────
  {
    termSlug: 'claude-projects',
    slug: 'claude-cs-team-playbook',
    angle: 'process',
    title: 'Building the CS team playbook with Claude',
    excerpt: "Individual reps using Claude is useful. A CS leader building shared AI infrastructure for the whole team is where the real leverage is. Here's how to do it.",
    readTime: 8,
    cluster: 'Business Strategy & ROI',
    body: `When an individual CS rep starts using Claude, they get faster at their job. When a CS leader builds a shared Claude infrastructure for the whole team, something different happens: the floor rises. Your weakest rep writes escalation emails like your best one. New hires get up to speed in half the time. Consistency — the thing CS orgs almost never have — becomes achievable.

This is about the second scenario. Not individual adoption, but team-level AI infrastructure.

## The problem this solves

CS teams have a consistency problem by default. One rep handles a renewal conversation one way; another approaches it completely differently. One person writes empathetic escalation responses; another writes defensive ones. The best practices of your top performers stay in their heads.

Claude doesn't fix this automatically. But a well-built [Project](/glossary/claude-projects) with a shared system prompt, shared documents, and a shared prompt library creates a structural answer to the consistency problem — one that doesn't depend on everyone having the same experience or talent level.

## What to build: the CS team Project

Your CS team [Project](/glossary/claude-projects) is the foundation. Most CS leaders get this wrong by treating it as a convenience rather than infrastructure. Here is what a well-built CS Project contains.

**The system prompt.** This is where team standards live. Write it to reflect how your best CSM would approach the work, not the average. Include:
- The company name and what you sell
- The tone that represents your best rep's voice: "empathetic and direct, not defensive or corporate, assumes the customer is intelligent"
- The specific constraints: "Never promise a specific resolution date. Never escalate without explaining the next step. Always acknowledge the customer's frustration before addressing the substance."
- The customer context: who your customers are, typical account sizes, common pain points

A tight 250-word system prompt beats a 1,500-word one. Every word in the system prompt costs tokens and attention. Edit ruthlessly.

**Documents to upload.** The most valuable uploads for CS teams:
1. Your product FAQ — the questions customers actually ask, with the accurate answers
2. Your escalation guide — what triggers escalation, who handles what, response time commitments
3. Your tone and voice guide — if you don't have one, write a two-page version for this purpose
4. Known issues and standard responses — the current product problems and approved messaging around them
5. Pricing and plan details — the facts Claude needs to be accurate on plans

Do not upload your entire knowledge base. Upload what Claude needs to be accurate on the tasks it will actually do.

## The prompt library: where team learning compounds

The prompt library is the most underused element in CS team AI setups. It is also the highest-leverage one.

The idea: every time a rep finds a prompt that works well for a common task, it gets added to a shared document. Not a generic prompt — a specific, battle-tested one with context about when to use it.

Over three months, a well-maintained prompt library becomes a genuine competitive asset. It encodes the judgment of your best reps into something every rep can access.

What to include in the prompt library:

**Escalation response:** "A customer is frustrated about [situation]. They believe [their interpretation]. The actual situation is [what happened]. Write a response that: acknowledges their frustration specifically and without defensiveness, corrects the misunderstanding plainly, explains what happens next, and sets a clear timeline. Tone: [your team's tone]. Do not make commitments about [things you can't promise]."

**Renewal email (at-risk account):** "I am preparing a renewal outreach for [account name]. Context: [their plan, their usage, any recent issues, the relationship history]. Write an email that opens with their specific wins this year, acknowledges any rough patches honestly, makes the case for renewal in terms of their outcomes (not features), and proposes a call. Do not be sycophantic. Do not use the word 'journey.'"

**QBR narrative:** "I am preparing a QBR for [account]. Here is their usage data and our interaction history this quarter: [paste data]. Write a QBR narrative covering: what they accomplished, where they are underutilizing the product with specific examples, our top three recommendations for next quarter, and the business case for expansion. Format as talking points the CSM can present conversationally."

**Health score commentary:** "Based on this account's data — [usage metrics, support ticket volume, NPS score, last engagement date] — write a two-paragraph health assessment that explains the risk level and recommends the next action. Be specific about which signals are concerning and which are positive."

**Post-churn debrief:** "A customer churned after [tenure]. Their stated reason was [what they said]. Based on the interaction history [paste], write a debrief that identifies what we could have caught earlier, what we should have done differently at [specific moments], and what the warning signs were. Use this to update our early warning criteria."

These prompts are not magic. They work because they are specific, tested, and encode the decisions your best reps make implicitly. When a new rep joins and sees that the escalation prompt is already figured out, they spend their learning time on the judgment layer — not the writing layer.

## Training new reps with Claude

New CSMs are typically productive on easy accounts within 60 days and on complex ones within 90. The bottleneck is not product knowledge — it's judgment development. What does a healthy account look like? When do you escalate? How do you read the tone of a frustrated email?

Claude can compress some of this. Two specific uses:

**Scenario practice.** Give new reps a scenario: "A customer who has been with us 18 months just sent an email saying they are reviewing all their software tools and want to talk about whether they are getting value. Draft a response." Then have them review their draft alongside what Claude would produce with the team prompt. The gap between the two is a learning conversation.

**Response calibration.** Give a new rep five real escalation emails from the past year (anonymised) and ask them to respond. Then run the same emails through the Claude prompt. Compare. Where their response is better, figure out why and encode that into the prompt. Where Claude's is better, discuss what the rep missed.

This is not replacing the manager's coaching role. It is giving the manager better material to coach from.

## Measuring whether it's working

Three things to measure:

**Time on response drafting.** Before and after. If your team was spending an average of 45 minutes per day on draft writing and that drops to 15, you have 30 minutes per rep per day reclaimed. For a team of 8, that is four hours per day of capacity.

**Consistency of quality.** Pull 10 escalation responses per rep per month and score them on a simple rubric: acknowledgement, accuracy, next step clarity, tone. Track variance across the team. If variance drops over six months, your AI infrastructure is working.

**New rep ramp time.** How long until a new hire's outputs are indistinguishable from the team's standard? If your prompt library and Project are well-built, this should be shorter than before.

## What AI infrastructure cannot do for CS teams

It cannot build relationships. The handshake moment, the candid conversation where a customer tells you what is really going on with their internal stakeholders — that is entirely human.

It cannot make judgment calls about commitments. Whether to offer a credit, extend a contract, escalate to your VP — these are decisions that require context about your company's position, the account's strategic value, and the relationship history. Claude can help you think through the options. It cannot make the call.

It cannot replace the need to know your product deeply. Reps who don't understand the product cannot fact-check Claude's outputs. Before deploying the team Project, make sure every rep knows enough about the product to catch errors in what Claude produces.

The playbook is infrastructure, not a substitute for good people. Build it for that purpose.
`,
  },

  // ── 2. Claude for HR teams ───────────────────────────────────────────────
  {
    termSlug: 'claude-projects',
    slug: 'claude-for-hr-teams',
    angle: 'field-note',
    title: 'What Claude actually looks like for an HR team',
    excerpt: 'HR has more high-volume text work than almost any other function. Here is where Claude fits — the workflows, the setup, and the places where AI has no business being.',
    readTime: 8,
    cluster: 'Business Strategy & ROI',
    body: `HR is not the most obvious place to look for AI leverage. The perception is that HR work is fundamentally about people — hiring, managing, developing, supporting. Which is true. But underneath that, HR is also one of the most text-heavy functions in any company. Job descriptions, offer letters, onboarding guides, policy documents, performance review frameworks, manager communications, culture content — the writing is relentless. And most of it follows patterns.

That is the space Claude occupies for HR teams.

## The job description problem

Job descriptions are the first thing most HR teams try with Claude, and it works. The average JD takes 45 to 90 minutes to write from scratch, needs input from a hiring manager who has never written one before, and gets updated roughly never — despite the role changing significantly over 18 months.

With Claude, the process is: paste your existing JD (or describe the role from scratch), add the specifics, and use Claude to produce a structured first draft. The hiring manager reviews it in 15 minutes. You edit the one or two things that are specific to your company's language. Total time: 30 minutes instead of 90.

More importantly, Claude normalises quality. In most companies, JDs vary wildly — some are too long, some vague, some full of jargon that scares off good candidates. When every JD goes through Claude with the same system prompt, the quality floor rises across the board.

A good JD system prompt: "You write job descriptions for [Company]. Our descriptions are direct and specific — no jargon, no inflated requirements. We include: a clear summary of what the role actually does day to day, the three to five things that genuinely matter for success, what we offer, and who we are. We do not include: years of experience requirements (we write skill-based requirements instead), corporate language like 'fast-paced environment' or 'rockstar', or a list of 20 qualifications. Tone: honest, direct, specific."

## Interview prep and question generation

Preparing for an interview takes longer than it should. The hiring manager needs questions that actually reveal whether a candidate can do the job — not generic questions from a Google search. Claude helps.

"I am interviewing a candidate for [role]. The three most important things for success in this role are [X, Y, Z]. Write 10 interview questions that test for these specific capabilities. Include two behavioural questions that use the STAR format, two technical questions that reveal how they actually work, and two questions about how they handle the situations this role will face most often."

The questions are starting points. The manager reviews, picks the ones that feel right, and adds their own. The saving is the blank page.

For structured interviewing (where every candidate gets the same questions and rubric), Claude can also produce the scoring rubric: "For each of these questions, write a rubric with three levels: what a weak answer looks like, what a good answer looks like, what an exceptional answer looks like."

## Policy Q&A: the highest-leverage HR application

Here is the application most HR teams do not think of first, but which delivers the most ongoing value: putting your HR policies into a [Project](/glossary/claude-projects) and letting employees ask questions in plain language.

The problem: HR teams spend enormous time answering the same questions. "What is the parental leave policy?" "How do I submit a PTO request?" "What counts as a conflict of interest?" "Can I work remotely from another country for two weeks?" These questions come in via Slack, email, and in person — constantly. Most of the answers are in the employee handbook that no one reads.

A Claude Project with your handbook uploaded and a good system prompt changes this. Employees get instant, accurate answers. HR gets time back. The system prompt is critical here:

"You are the HR Policy Assistant for [Company]. You answer questions about our policies accurately and in plain English. Your answers are sourced from the documents provided. When a policy is clear, answer directly. When something is ambiguous or requires individual judgment (e.g. requests for exceptions, specific personal situations), tell the employee to speak with an HR team member and explain what information to bring. Never guess about policy details — say you do not have information rather than guess."

That last instruction is essential. An HR Claude that makes up policy details creates liability. One that says "I don't have information on that — please contact HR" and gives the right contact stays safely within its lane.

## Performance review season

Performance review cycles are where HR teams and managers spend enormous time — most of it on writing that follows the same patterns. Claude helps at two levels.

**For HR teams: building the framework.** Review templates, rating rubric descriptions, calibration guidance, FAQ documents for managers going through the process for the first time. Claude produces these from a brief; HR edits for company-specific details. Two hours of template work instead of a full day.

**For managers: drafting review comments.** A manager who supervises eight people needs to write eight reviews. Most of them will write the same things slightly differently, struggle with how to phrase feedback about someone who is good but not great, and take longer than they should. Claude helps with drafting:

"I am writing a performance review for a [role] who [summary of their year: what they did well, what they struggled with, what they achieved]. Write a review draft that: acknowledges their specific strengths with concrete examples, addresses the development area honestly but constructively, sets a clear expectation for next year. Tone: fair, direct, developmental — not punitive, not sycophantic."

Note: HR should be clear with managers that Claude produces a first draft for human review and editing — not a final review. The manager's judgment about their employee, including context Claude cannot have, goes in after Claude has produced the structure.

## Culture and communications content

HR teams produce a lot of internal culture content: welcome messages for new hires, all-hands updates, employee survey summaries, culture guides, team norms documents. This is writing that matters — it shapes how employees feel about working at the company — and it takes disproportionate time relative to its importance.

Claude is strong here. Not to replace the HR team's voice, but to accelerate it. Give Claude the raw material — the survey data, the themes from the all-hands, the values the company has articulated — and ask it to produce a first draft. The HR team then edits it to sound like them. The process is twice as fast; the quality is consistent.

For new hire welcome emails in particular: "Write a welcome email for a new [role] joining on [date]. Their manager is [manager name]. They will be joining the [team name] team. Include: a genuine welcome that does not sound corporate, what to expect on their first day, who to contact if they have questions before their start date. Tone: warm, specific, not bureaucratic."

## What Claude should not do in HR

**Make hiring decisions.** Claude can summarise candidate notes, organise interview feedback, and help write offer letters. It should not rank candidates, recommend who to hire, or make assessments about fit. Those judgments have bias risks, legal implications, and depend on human context Claude does not have.

**Handle sensitive employee issues.** Performance improvement plans, complaints, disciplinary conversations — these require professional HR judgment, legal review in many cases, and a level of sensitivity about individual circumstances that goes beyond what Claude can safely handle. Use Claude for the administrative scaffolding; keep the judgment human.

**Generate final-version employment documents.** Offer letters, employment contracts, settlement agreements — anything with legal force needs to be reviewed by someone with employment law expertise before it is used. Claude can draft; a human (and sometimes a lawyer) approves.

**Provide benefits or payroll specifics from memory.** Benefits change, payroll rules are jurisdiction-specific, and Claude's training data is not current. Always verify benefits and payroll information against your actual HR system and current plan documentation before sharing with employees.

## The HR Project setup

One [Project](/glossary/claude-projects) for HR, with:
- Employee handbook (or summary)
- Current benefits overview
- PTO and leave policies
- Standard HR process guides (how to request a reference, how to submit expenses, etc.)
- Your JD template and example JDs
- Your performance review template

System prompt: "You are the HR assistant for [Company]. You help the HR team draft documents, answer policy questions from employees, and support the hiring process. You are accurate, clear, and direct. When answering policy questions, source your answer from the documents provided. When you are not sure or when a question requires personal judgment, say so and direct the employee to contact HR."

The HR Project is one of the highest-reliability uses of Claude in a company — the work is text-heavy, structured, and repetitive enough that the quality floor rises significantly with good configuration. The teams that get the most out of it are the ones that took 30 minutes to upload the right documents and write a system prompt that keeps Claude within its appropriate lane.
`,
  },

]

async function seed() {
  console.log('Seeding batch 32...\n')

  for (const article of ARTICLES) {
    const term = await getTermId(article.termSlug)
    if (!term) {
      console.error(`  ✗ Term not found: ${article.termSlug} (for ${article.slug})`)
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
      console.error(`  ✗ ${article.slug}:`, error.message)
    } else {
      console.log(`  ✓ ${article.slug}`)
    }
  }

  console.log('\nDone.')
}

seed().then(() => process.exit(0))
