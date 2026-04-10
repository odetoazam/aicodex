/**
 * Batch 15 — CS renewal/QBR playbook + HR onboarding workflow
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-15.ts
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

  // ── 1. CS QBR and renewal prep ───────────────────────────────────────────
  {
    termSlug: 'claude-projects',
    slug: 'cs-qbr-and-renewal-prep-with-claude',
    angle: 'field-note',
    title: 'How CS managers use Claude to prepare for QBRs and renewals',
    excerpt: 'QBR prep used to take half a day per account. Here is the workflow that gets it to 45 minutes — without cutting corners on the things that actually matter.',
    readTime: 6,
    cluster: 'Business Strategy & ROI',
    body: `A quarterly business review is one of the highest-leverage moments in the CS calendar. Done well, it deepens the relationship, surfaces expansion signals, and shores up renewals before they become conversations about churn. Done poorly — or done hastily because you had eight QBRs to prep in two days — it is worse than not doing it at all.

The CS teams that have redesigned their QBR and renewal workflow around Claude are not cutting corners. They are moving the time investment from gathering and formatting to thinking and relationship building.

## What the old workflow looks like

Before the QBR: pull usage data from the product, pull health score from Gainsight or your CS platform, find the account notes from the last four check-ins, pull the contract details, build the deck. Two to four hours per account, half of it formatting.

The actual insight — what is this customer getting from the product, what are they not using, what is their risk profile, what should the renewal conversation focus on — gets ten minutes, if that.

Claude inverts this.

## The Claude-assisted QBR prep workflow

**Step 1: Data dump into Claude**

Paste everything into a [Project](/glossary/claude-projects) conversation: usage stats, health score summary, account notes, previous QBR notes if you have them, the contract renewal date and value. Do not format it — just paste it raw.

Prompt: *"Here is everything I have on this account ahead of a QBR. Give me: (1) a one-paragraph account narrative — what is working, what is not, and where they are relative to their stated goals; (2) three specific things to highlight; (3) two risks or gaps I should be prepared to address; (4) one expansion angle if appropriate."*

This takes five minutes. What you get back is a structured read on the account that would have taken an hour of mental assembly to produce otherwise.

**Step 2: Slide structure**

Give Claude your QBR template (upload it to the [Project](/glossary/claude-projects) once, and it is always there). Ask it to fill in the framework using the account narrative.

Prompt: *"Using the account narrative above and our standard QBR template, draft the key slides: goals recap, progress summary, value delivered, roadmap for next quarter, and renewal/expansion proposal."*

The drafts will not be final — you will edit them. But you are editing a structured draft, not building from scratch. The difference is 20 minutes of editing versus 90 minutes of writing.

**Step 3: Anticipate objections**

This is the step most CS managers skip under time pressure.

Prompt: *"Based on this account's profile — the gaps I identified, their usage patterns, their renewal date — what are the three most likely objections or concerns they will raise in the QBR? For each, give me a one-sentence response and a clarifying question I could ask."*

Walking into a QBR with three prepared objection responses is a different experience from winging it.

**Step 4: Pre-meeting email**

Prompt: *"Draft a pre-meeting email to the economic buyer and the day-to-day contact. It should set context for the QBR, confirm the agenda, and make them feel like we have done our homework."*

Done. Ten minutes of editing, not thirty minutes of writing.

## The renewal conversation specifically

Renewal conversations are a different mode from QBRs — they are often shorter, more commercial, and riskier if the relationship is shaky. Claude helps here in two specific ways.

**Risk profiling.** Paste the account's engagement history, support ticket volume, NPS scores if you have them, and usage trends. Ask Claude to rate the renewal risk and give you the three factors driving it. You already knew these intuitively — Claude makes them explicit and forces you to have a plan for each.

**Renewal email drafts.** The first renewal outreach email is one of the hardest emails to write well — it has to be confident without being presumptuous, commercial without feeling transactional. Claude drafts these well when you give it the account context and specify the tone.

Prompt: *"Draft an initial renewal outreach email for this account. The renewal is in 90 days. The relationship is strong but they have under-used the [feature] we sold them on. Tone: warm, partnership-focused, not pushy. Include a natural ask for a call."*

## Setting up your CS Project properly

One [Project](/glossary/claude-projects) for the whole CS team, shared, with:

**In the system prompt:**
- Your company name, product name, and what it does
- Your standard QBR structure and what each section covers
- The renewal stages you use (60-day outreach, 30-day conversation, etc.)
- What a healthy vs. at-risk account looks like at your company

**Documents to upload:**
- Your QBR slide template (text description or outline)
- Example of a strong QBR deck (redacted)
- Renewal email examples that have worked
- Churn risk criteria for your product
- Common objections and standard responses

Once this is set up, every CS rep on the team operates from the same baseline. A new hire in their first week can run a QBR prep workflow that previously required six months of experience to do well.

## What changes when you do this at scale

The teams that have implemented this workflow consistently report the same shift: they go from spending 70% of QBR prep time on production and 30% on thinking, to the inverse. The actual relationship work — knowing this customer's situation cold, anticipating what matters to them, walking in prepared for the hard question — gets the time it deserves.

That is what the QBR is supposed to be for.
`,
  },

  // ── 2. HR onboarding with Claude ─────────────────────────────────────────
  {
    termSlug: 'rag',
    slug: 'claude-for-new-hire-onboarding',
    angle: 'field-note',
    title: 'How HR teams use Claude to make onboarding actually work',
    excerpt: "New hires spend their first week confused and HR spends it answering the same 40 questions. Here is the workflow that fixes both — without building a chatbot.",
    readTime: 6,
    cluster: 'Business Strategy & ROI',
    body: `The first week of a new job is a firehose of information, most of it delivered at the wrong moment. Onboarding documentation exists — there is almost always too much of it — but it is scattered, and new hires cannot find what they need when they need it. The result: they interrupt the HR team with questions, or they do not interrupt anyone and muddle through with gaps in their understanding.

HR teams that have integrated Claude into their onboarding workflow have not solved onboarding by building a custom chatbot or rewriting their documentation. They have solved it by changing where the work sits — moving repetitive, volume-based work to Claude so the HR team can focus on the things that actually require a human.

## The two sides of the problem

**New hire side:** Too much information, wrong timing, no obvious way to ask questions without feeling like a burden.

**HR side:** Answering the same 30–40 questions every cohort. Writing individual onboarding emails. Chasing incomplete paperwork. Tailoring onboarding checklists to different roles when the underlying structure is identical.

Claude does not fix the underlying onboarding experience. But it handles a large portion of the volume work on both sides.

## The HR team's workflow with Claude

**Role-specific onboarding checklists**

Every new hire gets a checklist, but the right checklist for a software engineer is different from the right one for a customer success manager. Previously, HR would either send the same generic checklist to everyone or spend 20 minutes customising it per hire.

With Claude:

*"We are onboarding a new [Customer Success Manager] starting [date]. Their manager is [name] and they are based in [city]. Generate an onboarding checklist for their first two weeks that covers: required IT setup, key stakeholder meetings to book, systems access to request, and milestone goals for days 1, 7, 14, and 30. Use this template as the baseline: [paste template]."*

Two minutes per hire. The checklist is specific to the role, the team, and the start date. HR reviews and sends.

**Welcome emails and first-week communications**

The sequence of emails a new hire receives before and during their first week — welcome from HR, logistics email, manager intro, day-one instructions — follows a template but should feel personal. Claude handles the personalisation:

*"Draft the day-before-start email for [Name], who is joining as [Role]. Include: building access instructions for [office], where to go on arrival, who to ask for, and the first meeting on their calendar. Tone: warm, practical, not overly formal."*

**Pre-boarding Q&A**

New hires have questions before they start — about benefits, equipment, their first day, what to bring. These land in HR's inbox in the week before the start date and require immediate responses because delays make new hires anxious.

Set up a [Project](/glossary/claude-projects) with your HR FAQ document, your benefits summary, and your equipment policy. For each pre-boarding question:

*"Here is a question from a new hire starting next week: '[paste question]'. Answer it based on our HR policies [in the Project]. Keep it concise and warm."*

Most pre-boarding questions can be answered in one Claude interaction, reviewed in 30 seconds, and sent.

**Policy lookups for the HR team itself**

HR teams have policies. A lot of them. When a manager asks about the parental leave policy for a part-time employee, or whether a specific contractor type qualifies for the equipment policy, the answer is in a document somewhere — but finding it and synthesising it takes time.

Upload your policy library to the Project. Ask directly:

*"Does our equipment policy cover contractors on fixed-term contracts of six months or more?"*

This is [RAG](/glossary/rag) at its most practical — your documents, your team's questions, answered in seconds.

## What Claude does not replace in onboarding

**The human welcome.** The manager coffee chat, the team lunch, the informal introductions — the things that tell a new hire whether they made the right choice. Claude handles the logistics; nobody wants their first conversation with their manager to be a Claude-drafted checklist.

**Sensitive conversations.** A new hire who is struggling or anxious needs a person. The policy questions about accommodation, mental health support, or personal circumstances — these are not Claude tasks.

**Judgment about what an individual needs.** An experienced HR BP reads a room, notices when someone is overwhelmed, and adjusts the pace. Claude processes inputs; it does not observe.

## Setting up the onboarding Project

One HR onboarding [Project](/glossary/claude-projects) with:

**System prompt:**
- Company name, industry, headcount range
- Your values around onboarding (what matters to you about the new hire experience)
- Typical roles you hire for and what matters in each
- Tone guidelines: how formal, how warm, what language to avoid

**Documents:**
- Onboarding checklist master template
- Benefits summary (non-confidential version)
- Equipment and IT setup process
- Key HR FAQs (compile the 40 questions you get every cohort and answer them once)
- Org chart or team structure overview
- First-week schedule template

The investment in setting this up properly is three to four hours. The return is every future onboarding cycle runs faster, with less variation and fewer dropped balls.

## The compounding effect

Once you have this Project set up and working well, it becomes the reference point for everything new-hire-adjacent: offboarding checklists, role-change transition plans, return-from-leave welcome-backs. The same infrastructure handles all of it.

The HR teams that get the most from Claude are not the ones that automated the most — they are the ones that freed their best HR people to focus on the decisions and conversations that change whether someone becomes a long-term employee.

Onboarding is where that starts.
`,
  },

]

async function seed() {
  console.log('Seeding batch 15...\n')

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
