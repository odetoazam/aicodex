/**
 * Batch 24 — Agencies: how agencies use Claude for client work
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-24.ts
 *
 * NOTE: inline backticks in body strings are escaped as \` to avoid TS template literal issues.
 * Dollar-brace expressions use \${ to avoid template expression parsing.
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

  // ── 1. Claude for agencies ──────────────────────────────────────────────────
  {
    termSlug: 'ai-use-case-discovery',
    slug: 'claude-for-agencies',
    angle: 'role',
    title: 'Claude for agencies: where it actually fits',
    excerpt: 'Agencies are not typical Claude users. You have client context, brand constraints, approval chains, and billable hours to account for. Here is how Claude fits into that reality.',
    readTime: 7,
    cluster: 'Business Strategy & ROI',
    body: `Agency work is not about producing content — it is about producing the right content, on brand, approved, and delivered on time. Claude fits into that workflow in specific places. Used wrong, it slows you down or produces output you spend hours fixing. Used right, it multiplies your output without multiplying your headcount.

## Where Claude actually helps agencies

The most immediate wins are in the middle of workflows, not at the start or end.

**Research and synthesis.** Before a pitch or strategy deck, you need to understand a client's industry fast. Claude can read a 40-page report, three competitor landing pages, and a category analysis and give you the three tensions worth building strategy around. This is not "summarize this" — it is structured research synthesis with an editorial lens.

**First-draft production.** Social copy, email sequences, website copy, ad concepts — Claude produces first drafts that are good enough to react to, which is far more useful than a blank page. The writer's job shifts from generating to editing and elevating. Senior writers find this more satisfying, not less, because they spend less time on obvious first passes.

**Repurposing and adaptation.** You wrote a long-form blog post. Now you need it in LinkedIn format, email format, and a short TikTok hook. This is mechanical work that takes time and adds no strategic value. Claude handles it in minutes, and the adaptations are better than what a rushed writer produces at 5pm on a Friday.

**Internal documentation.** Briefing documents, onboarding guides for new team members on a client account, process documentation. This is always underfunded at agencies. Claude turns a 30-minute briefing call transcript into a proper brief.

## Where Claude does not replace human judgment

**Client relationships.** The qualitative sense of what a client wants — the mood they are in, the political constraints they did not mention, the real reason the last campaign failed — does not live in any document. That is your strategist's job.

**Brand voice at the edges.** Claude can approximate a brand voice with a good system prompt and examples. It cannot capture the idiosyncratic choices that make a brand distinctive. Those require a human who internalizes the brand, not reads the guidelines.

**Judgment calls about what should be said.** Should this campaign acknowledge the criticism or ignore it? Is this angle too provocative for this market? Claude can lay out the tradeoffs, but the call is yours.

## How to structure Claude for client work

The agencies that get the most out of Claude are the ones that treat it like a contractor who needs a proper brief, not a magic button.

**Client context documents.** Build a standard document per client that captures: brand voice, audience description, constraints (things the client has rejected before), and approved terminology. Paste this as the system prompt when working on that client. You will stop producing output that gets rejected for obvious reasons.

**Angle-first prompting.** Do not ask Claude to "write a LinkedIn post about our new product launch." Ask it to write three posts: one that leads with a result, one that leads with a provocative question, one that leads with a customer story. React to those and direct the revision. This is how a creative director works with a copywriter.

**Build an internal prompt library.** The five prompts that produce the best first drafts for your most common deliverables. Social captions, email subject lines, brief expansions, research synthesis, client-ready strategy summaries. Document them, version them, and stop reinventing them every engagement.

## The billing question

This comes up at every agency: if Claude writes 60% of the first draft, does the client still pay the same?

The framing is wrong. Clients pay for outcomes and expertise, not hours. If Claude lets your team get to a better first draft faster, the strategy and judgment that shaped that output still came from your people. The brief, the angle, the feedback loop, the final approval — that is the work.

The agencies that get this wrong try to hide Claude use or feel guilty about it. The ones that get it right treat it as a production efficiency that lets them do more strategic work in the same engagement.`,
  },

  // ── 2. Client handoff with Claude ─────────────────────────────────────────
  {
    termSlug: 'system-prompt',
    slug: 'client-handoff-with-claude',
    angle: 'process',
    title: 'Client handoff: giving Claude the context it needs to work on your accounts',
    excerpt: 'Claude does not know your client. A structured client context document — passed as the system prompt — is the difference between output you can use and output you have to rewrite.',
    readTime: 6,
    cluster: 'Prompt Engineering',
    body: `Every agency has the same problem when they start using Claude: the output is competent but generic. It does not sound like the client, it avoids the client's actual constraints, and it occasionally suggests things the client has already rejected three times.

The fix is not better prompting in the moment. It is a structured client context document that you pass as the system prompt every time you work on that account.

## What the client context document contains

Think of this as the briefing document you would give a new freelancer who needs to write for your client from day one — not a brand guidelines PDF, but the actual working knowledge your team has built over the engagement.

**Voice and tone.** Two or three sentences describing how the brand sounds. Not "professional and approachable" (useless) but "writes like a confident peer, not an authority figure — uses contractions, avoids jargon, occasionally challenges the reader." Then include three short examples: a social post, an email subject line, a CTA. Claude uses examples more than it uses descriptions.

**Audience.** Who is actually reading this. Not "busy professionals" but "VP-level buyers at mid-market SaaS companies who are skeptical of vendor content and read it on their phone during commute." The more specific, the better.

**Constraints and rejections.** Things the client has explicitly said no to. "Does not use the phrase 'game-changer.'" "Never leads with a question in subject lines." "Does not mention competitors by name." This is the most underused section — and the one that prevents the most wasted drafts.

**Approved terminology.** Words they use and words they avoid. Some clients have very specific language around their product category or audience. If they call customers "members" not "users," Claude needs to know.

**What success looks like.** The actual outcome the deliverable is meant to produce: "Email campaign goal is re-engagement, not awareness — we want a response or a click, not brand recall."

## How to structure this as a system prompt

\`\`\`
You are a copywriter working on behalf of [Client Name].

BRAND VOICE
[Two to three sentences. Include three examples.]

AUDIENCE
[Specific description of who reads this content.]

CONSTRAINTS
- Never use: [list]
- Always use: [list]
- Previously rejected angles: [list]

APPROVED TERMINOLOGY
[Key product/audience terms they use]

CURRENT TASK CONTEXT
[Fill this in per session: what campaign, what stage, what has been approved]
\`\`\`

The "Current Task Context" section at the bottom is what changes each session. The rest stays stable and gets pasted at the top of every Claude conversation for this client.

## Maintaining the document

The client context document only works if it is maintained. Three practices that keep it current:

**Add rejections immediately.** When a client rejects something for a recurring reason ("we don't want to sound urgent"), add that to the constraints section before you close the session. Two minutes now saves an hour next month.

**Review it before pitches.** Before a new campaign, read the constraints section. What did they push back on last time? What angle worked well? Update the document with what you learned.

**Version it per campaign type.** Some clients behave differently for organic social vs. paid ads vs. email. You may need a base document plus a campaign-specific overlay for each channel.

## What this changes

The difference between a generic Claude prompt and a client-context Claude prompt is not subtle — it is the difference between a first draft that goes back to the client and a first draft that gets revised once and then goes. Agencies that build this system find that their Claude output quality compares favorably with a mid-level copywriter who has been on the account for three months. That is the standard to aim for.`,
  },

  // ── 3. Building a Claude-powered deliverable ──────────────────────────────
  {
    termSlug: 'tool-use',
    slug: 'building-claude-powered-deliverable',
    angle: 'process',
    title: 'Building a Claude-powered client deliverable',
    excerpt: 'Some agencies are not just using Claude internally — they are building Claude into the work itself. What that looks like, what clients actually want, and how to avoid the obvious failure modes.',
    readTime: 8,
    cluster: 'Agents & Orchestration',
    body: `There is a category of agency work that used to be a novelty and is now a real line item: building Claude-powered tools for clients. A content brief generator. A competitive analysis tool. An onboarding assistant trained on client documentation. These are not advanced engineering projects — they are Claude with a structured interface and well-crafted system prompts. Agencies with even one technical person can build and deploy them.

## What clients actually want

Most clients do not want "an AI tool." They want a specific problem solved. The agencies that win this work have learned to translate vague AI interest into concrete use cases.

**The pattern that works:** Find a task your client's team does repeatedly that requires judgment but follows a predictable structure. "Reviewing incoming customer support tickets and drafting first responses." "Generating weekly social posts from a brief." "Turning a sales call transcript into a CRM summary." These are small enough to ship in weeks, concrete enough to evaluate, and high enough volume that the ROI is visible.

**The pattern that fails:** "An AI strategy assistant for the executive team." Too broad, too vague, too hard to evaluate. It gets built, used twice, and abandoned.

## The architecture of a simple Claude-powered deliverable

For most agency-built tools, the architecture is the same: a form or interface that collects input → a system prompt that defines behavior → Claude's API → an output formatted for what the client actually needs to do with it.

You do not need a custom frontend for this. For internal tools, a simple Next.js page, a Retool dashboard, or even a structured Notion database with a Zapier integration can collect the input and return Claude's output. The complexity is in the prompt engineering, not the frontend.

The system prompt is the product. For a client deliverable, this means:

1. **A clear persona and role** that reflects the client's brand and the task's purpose
2. **Output format instructions** that match how the output will be used (markdown, JSON, plain text, numbered list)
3. **Client context** — the same material as the client context document, but baked into the system prompt permanently
4. **Quality guardrails** — what it should refuse, what it should flag for human review, what it should never do

A content brief generator for a fashion brand looks different from one for a B2B software company. The tool is the same; the system prompt is the product differentiation.

## Managing the approval and review layer

Claude-powered deliverables for agencies usually need a review step — output goes to a human before it reaches the end audience or gets used in a live campaign. Designing for review is as important as designing for generation.

**Make review easy, not optional.** If the review step is friction, it gets skipped. The output format should make review natural: side-by-side comparison with the source material, highlighted fields that require human judgment, a simple approve/edit/reject interface.

**Log what gets rejected and why.** This is your improvement loop. When a client rejects an output, you need to understand whether it is a prompt problem (Claude produced the wrong kind of output) or an expectation problem (the client's standards shifted). Build a lightweight feedback mechanism — even a simple comments field — that captures this.

**Set version expectations early.** Claude-powered tools rarely produce perfect output in v1. Set the expectation with clients that the first month is a calibration period, not a launch. Use the rejection data to improve the system prompt. Most tools get significantly better between month one and month three.

## Pricing this work

The question agencies struggle with: how do you price a tool you built in a week using Claude's API at \$0.003 per call?

You are not pricing the API cost or the build time. You are pricing:
- The expertise to identify the right use case
- The prompt engineering and iteration to make the output useful
- The ongoing maintenance as the client's needs evolve
- The liability for output quality

Agencies that position these tools well charge a project fee for the build and a monthly retainer for maintenance and improvements. The retainer is the model because the tool is only as good as the prompts, and the prompts always need tuning.`,
  },

  // ── 4. What to tell clients about AI ───────────────────────────────────────
  {
    termSlug: 'hallucination',
    slug: 'what-to-tell-clients-about-ai',
    angle: 'failure',
    title: 'What to tell clients about AI (and what not to)',
    excerpt: 'Clients ask about AI on every call now. Most agency answers are either too defensive or too evangelical. Here is a more honest framing — and how to have the conversation without losing credibility.',
    readTime: 6,
    cluster: 'Evaluation & Safety',
    body: `Every agency is having some version of this conversation: a client asks how much AI is involved in their work, and the account lead either freezes, deflects, or overclaims. None of those serve the relationship.

The problem is not that clients are asking — it is that agencies have not developed a clear, honest answer. Here is one.

## The honest framing

AI is a production tool in our workflow, the same way design software or a research database is. It helps our team move faster on first drafts, synthesis, and adaptation. The judgment, strategy, editorial voice, and approval chain are still entirely human.

That is the full answer. It does not oversell, it does not hide, and it accurately describes what is actually happening in almost every agency using Claude responsibly.

Clients who ask "are you using AI?" are usually asking one of three underlying questions:

1. **Am I paying for work a machine did?** — The right response is to clarify what they are paying for: expertise, judgment, and accountability. Claude drafts; your team directs, revises, and is responsible for what goes out.

2. **Is the work going to be generic and off-brand?** — This is the real concern. Address it directly: "Our process includes a client context document that gives Claude your brand voice, constraints, and past feedback. We review everything before it leaves the team." That is more reassuring than any abstract answer about AI quality.

3. **Are you going to charge me the same for half the work?** — See the billing section below.

## What not to say

**"We're experimenting with AI."** This sounds evasive and implies you are using the client as a test subject. If you are using Claude in production work, say so.

**"AI writes everything and we review it."** This overstates Claude's role and removes your team from the story. The work is yours. Claude is a tool.

**"Our AI never makes mistakes."** No. Claude hallucinates, especially on specific facts, statistics, and citations. Clients who use AI themselves know this. If you deny it, you lose credibility. The honest version: "Claude sometimes produces errors that require human review — which is why our process always includes a review step before delivery."

## The hallucination conversation

If a client specifically asks about hallucination or accuracy, you need a real answer.

Claude produces plausible-sounding text. For most creative and strategic work — copy, briefs, frameworks, analysis of information you provided — accuracy errors are rare and the review step catches them. For tasks that require factual accuracy about the real world — statistics, citations, competitor specifics, current events — Claude needs to be grounded with provided source material, or the output needs human fact-checking.

The practical rule: if a fact in Claude's output matters and you cannot verify it from a source you provided, verify it externally before it leaves your team. This is not unique to AI. It is editorial hygiene.

## The billing conversation

Clients sometimes push on pricing when AI is involved. The right response is to anchor on outcomes, not process.

"We charge for the strategic judgment, brand expertise, and accountability that makes the work effective — not for the hours spent in any particular tool. Our use of AI means we can deliver faster without compromising quality. The expertise behind the output is the same."

If a client pushes further, offer to walk through the actual process. Show them the brief, the angle development, the revision rounds. Most clients, once they see the work that shapes and directs the AI output, stop asking about AI pricing. The process is defensible because it is real.

## What proactive disclosure looks like

Some agencies are choosing to proactively disclose AI use rather than wait to be asked. The agencies that do this well frame it as a process strength, not a confession.

"Our workflow now includes AI-assisted first-draft production, which means we can get to a reviewable draft faster and spend more of our time on strategy and revisions. Everything still goes through our senior team before it reaches you."

That framing — AI makes us faster at the mechanical work so we can do more of the high-value work — is accurate, confident, and client-friendly. It also positions the agency as operationally sophisticated rather than reactive.`,
  },

]

async function seed() {
  console.log('Seeding batch 24 — agency articles...\n')

  for (const a of ARTICLES) {
    const term = await getTermId(a.termSlug)
    if (!term) {
      console.error(`✗ Term not found: ${a.termSlug}`)
      continue
    }

    const { error } = await sb.from('articles').upsert({
      slug: a.slug,
      term_id: term.id,
      term_slug: a.termSlug,
      term_name: term.name,
      angle: a.angle,
      title: a.title,
      excerpt: a.excerpt,
      read_time: a.readTime,
      cluster: a.cluster,
      body: a.body,
      published: true,
    }, { onConflict: 'slug' })

    if (error) {
      console.error(`✗ ${a.slug}:`, error.message)
    } else {
      console.log(`✓ ${a.slug}`)
    }
  }

  console.log('\nDone.')
}

seed()
