/**
 * Batch 33 — Claude + Tool guides (Salesforce, Confluence) + diagnostic article + ops day-in-the-life
 * claude-plus-salesforce, claude-plus-confluence, why-claude-feels-inconsistent, ops-manager-ai-workflow
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-33.ts
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

  // ── 1. Claude + Salesforce ────────────────────────────────────────────────
  {
    termSlug: 'connector',
    slug: 'claude-plus-salesforce',
    angle: 'process',
    title: 'Claude + Salesforce: what actually works',
    excerpt: 'Salesforce holds your account history, deal notes, and contact records. Claude writes and thinks. Here is how to connect the two without copy-pasting everything manually.',
    readTime: 6,
    cluster: 'Tools & Ecosystem',
    body: `Salesforce and Claude do not integrate natively the way Claude connects to Notion or Google Docs through first-party [Connectors](/glossary/connector). But they work together effectively — it just requires a slightly different setup depending on how you want to use them.

Here is what actually works, starting with the no-code options and moving toward the more connected setups.

## The copy-paste approach (no integration needed)

The simplest use case requires no integration at all: pull the relevant Salesforce data into a text document, paste it into Claude, and work from there.

For sales reps, this commonly looks like:
1. Pull the account record, recent activity, and open opportunity notes from Salesforce
2. Paste into Claude with a prompt: "Here is everything I know about this account. I have a renewal call on Thursday. Write me a prep brief covering: what matters to them, what might come up, and what I should be trying to accomplish."
3. Get a structured brief in under a minute

For CS teams, the pattern is similar for QBR prep: pull the account's interaction history, support tickets, usage notes — paste and ask Claude to build the QBR narrative. This is how most teams start, and for many it is good enough.

The limitation: manual. Every time you need Claude to work on an account, you are doing a data gathering step first.

## Connecting through Zapier or Make

For teams who want to automate the data gathering, Zapier and Make both have Salesforce integrations that can push data to Claude without manual copy-pasting.

Common automations:
- **Account brief on trigger**: When an opportunity moves to a specific stage (e.g., "Renewal"), automatically pull the account data and send it to Claude to generate a prep brief, then post the brief as a note back to the Salesforce record or to a Slack channel.
- **New contact research**: When a new lead is added, pull their company name and title, send to Claude with web search enabled, and write back a one-paragraph prospect summary.
- **Meeting follow-up notes**: After a meeting is logged in Salesforce, send the meeting notes to Claude to format them as a structured summary with action items, then write back to the record.

The setup is Zapier/Make, not Claude directly — but Claude does the language work at each step.

## Using Claude's MCP connector with Salesforce

If your team is on Claude Enterprise or using the API, the [MCP](/glossary/mcp) layer allows Claude to read from and write to Salesforce directly, without manual data transfer. This is the most powerful integration and the one most CS and sales teams are moving toward.

With MCP connected to Salesforce, Claude can:
- Pull account and opportunity data without you pasting anything
- Write notes and next steps back to records after generating them
- Answer questions like "what are the three accounts most at risk this quarter based on recent activity?" using live Salesforce data

Setting this up requires either a pre-built Salesforce MCP connector (some are available in the Claude.ai connector marketplace) or a developer configuring a custom MCP server pointed at your Salesforce instance.

## Practical prompt patterns for Salesforce work

Regardless of how the data gets into Claude, these prompts consistently produce useful output:

**Account prep brief:**
"Here is the Salesforce account data for [account name]: [paste account summary, opportunity history, recent notes, open cases]. I have a [type of call] on [date]. Produce a one-page prep brief: what is the current relationship status, what has happened recently that matters, what are the key risks, and what are the two or three things I should accomplish on this call."

**Renewal risk assessment:**
"Here is the activity history and case data for [account] over the past 90 days: [paste]. Based on this, write a brief risk assessment: what signals look healthy, what signals are concerning, what is the most important thing to address before renewal."

**Opportunity summary for handoff:**
"Here are the opportunity notes and discovery call transcripts for [deal]: [paste]. Write a clean handoff summary for the new account owner covering: what the customer cares about most, what was promised in the sales process, known risks, and suggested first 30-day priorities."

**CRM note from meeting:**
"I just had a [type of call] with [account/contact]. Here are my rough notes: [paste raw notes]. Format these as a clean CRM note with: date, attendees, summary of discussion, decisions made, action items with owners, and next steps."

## What not to expect from Claude + Salesforce

Claude does not replace Salesforce. It does not manage pipeline, track opportunity stages, or enforce process. It works on the language layer — writing, summarising, and structuring the information that lives in Salesforce.

The teams that get the most from this combination are the ones that have identified their highest-frequency writing tasks (prep briefs, renewal narratives, meeting notes) and built a consistent workflow around them — not the ones treating Claude as a general Salesforce add-on.

Start with one workflow. Get it reliable. Then add the next.
`,
  },

  // ── 2. Claude + Confluence ────────────────────────────────────────────────
  {
    termSlug: 'connector',
    slug: 'claude-plus-confluence',
    angle: 'process',
    title: 'Claude + Confluence: what actually works',
    excerpt: 'Confluence is where team knowledge lives and slowly dies. Claude helps write it, update it, and make it findable. Here is the setup that actually works for engineering and ops teams.',
    readTime: 6,
    cluster: 'Tools & Ecosystem',
    body: `Confluence has a documentation problem that every team hits: writing it takes longer than the work it documents, nobody keeps it updated, and finding anything requires already knowing where to look. Claude does not fix the fundamental incentive problem — but it dramatically lowers the cost of writing, which is where most documentation debt starts.

Here is how engineering and ops teams are using Claude alongside Confluence, and what the integration looks like at different levels of setup.

## The core use case: Claude writes, Confluence stores

The most reliable use of Claude + Confluence is the simplest: use Claude to draft documentation that a human reviews and publishes to Confluence.

This works for:
- **Architecture Decision Records (ADRs)**: "Here is the decision we made about [architectural choice] and the reasoning: [paste context]. Write an ADR in our format covering: context, decision, rationale, alternatives considered, and consequences."
- **Runbooks**: "Here is how we handle [incident type] based on what we've done in the past: [paste rough notes]. Write a structured runbook with: trigger conditions, first response steps, escalation path, resolution steps, and post-incident checklist."
- **Post-mortems**: "Here are the raw notes from our incident on [date]: [paste timeline and notes]. Write a post-mortem document covering: incident summary, timeline, root cause, contributing factors, impact, action items with owners."
- **Onboarding guides**: "Here is what a new engineer needs to know to get set up for [system/team]: [paste rough knowledge dump]. Write a structured onboarding guide in clear steps."
- **API documentation**: "Here is the function signature and what it does: [paste code and comments]. Write documentation for this in our standard format."

The pattern: you supply the knowledge (the stuff only your team has), Claude supplies the writing (which always takes longer than it should). The result goes into Confluence.

## Connecting Claude to Confluence directly

For teams who want Claude to read from and write to Confluence without copy-pasting, there are two paths:

**Claude Connector for Confluence**: Atlassian and several third parties have built Claude connectors for Confluence through the Claude.ai connector marketplace. With this set up, you can ask Claude questions against your Confluence knowledge base directly: "What is our current policy on database migrations?" and Claude will answer from your actual Confluence pages, not from guesswork.

This is the highest-value setup for teams with large Confluence spaces — it turns your documentation into a searchable, answerable knowledge base rather than a search-and-scroll exercise.

**MCP server**: For API users or Enterprise teams, an [MCP](/glossary/mcp) server pointed at the Confluence REST API lets Claude read, create, and update pages programmatically. This enables automation: when a runbook is created in a ticketing system, automatically generate the Confluence page; when code ships, update the relevant ADR with the outcome.

## The Q&A workflow (highest leverage for existing Confluence spaces)

If your team has a large Confluence space that people are bad at using, the Q&A workflow is where Claude adds the most immediate value.

Setup: Connect Claude to your Confluence space via Connector or [RAG](/glossary/rag). Anyone on the team can now ask questions in plain language instead of navigating Confluence:

- "What do we do when the payment service goes down?"
- "What was the decision behind using [technology]?"
- "Who owns the billing service?"
- "What does the new engineer onboarding process look like?"

Claude answers from your actual documentation, with citations to the relevant Confluence page. The documentation you spent years writing finally gets used.

One important note: Claude answers what the documentation says. If the documentation is wrong or out of date, Claude's answer will be wrong too. The Q&A workflow is an incentive to keep documentation current — not a substitute for it.

## Keeping documentation up to date

The hardest documentation problem is not writing it the first time. It is keeping it current when things change.

Claude helps here in two ways:

**Flagging staleness**: If you run a periodic review — paste a Confluence page into Claude and ask "given that [thing] changed last month, what in this document is now inaccurate or outdated?" — you get a fast review rather than re-reading the whole thing.

**Drafting updates**: "Here is the current documentation for [process]: [paste]. Here is what changed: [describe the change]. Update the relevant sections." Claude produces a diff you review rather than rewriting from scratch.

This is not automated — someone still has to trigger the review and approve the changes. But the barrier to updating is much lower when Claude does the writing.

## The realistic outcome

Engineering teams who use Claude + Confluence consistently report that documentation coverage improves — not because engineers love writing documentation, but because the cost of producing it drops enough that it actually gets done. The ADR that used to take 45 minutes gets written in 15. The runbook that would never have been written gets drafted during the incident debrief.

The documentation is still only as good as the knowledge the engineer puts into the prompt. Claude cannot document what it does not know. But it can turn rough notes into structured pages, which is the step most documentation dies on.
`,
  },

  // ── 3. Why Claude feels inconsistent (diagnostic) ─────────────────────────
  {
    termSlug: 'system-prompt',
    slug: 'why-claude-feels-inconsistent',
    angle: 'failure',
    title: 'Why Claude keeps giving you different quality outputs — and how to fix it',
    excerpt: "Claude is not randomly inconsistent. There are four specific causes of output variation, each with a different fix. Here is how to diagnose which one is your problem.",
    readTime: 6,
    cluster: 'Foundation Models & LLMs',
    body: `One of the most common complaints about using Claude at work: "Sometimes it's great, sometimes the output is completely off, and I can't tell which I'm going to get." This feels like unreliability. It usually isn't — it is almost always one of four diagnosable causes, each with a specific fix.

Before you give up on a workflow that feels inconsistent, run through these four causes.

## Cause 1: No persistent context (the most common cause)

Claude starts every new conversation with no memory of previous ones. If you open a new chat and ask Claude to draft a customer email, it does not know your company, your tone, your product, or the fact that you spent 20 minutes last week telling it exactly how you want emails to sound. It is starting from zero.

This is why outputs vary: each conversation starts blank, and the quality of the output depends entirely on the quality of the context you provide that day.

**The fix: [Claude Projects](/glossary/claude-projects).** A Project lets you store a [system prompt](/glossary/system-prompt) and knowledge documents that are present in every conversation automatically. Set up a Project for the work you do repeatedly. You provide the context once; Claude reads it every time.

Teams that set up Projects and then use them consistently report that the variation mostly disappears — not because Claude got smarter, but because the context is no longer dependent on whether you remembered to include it today.

## Cause 2: Vague instructions (the second most common cause)

"Write a good summary" and "write a 3-sentence executive summary that leads with the business impact, uses no jargon, and ends with a clear recommendation" are very different instructions. The first leaves Claude to guess what you mean by good. The second does not.

Claude makes reasonable default choices when instructions are vague — but reasonable defaults are not the same as what you actually want. The variation you experience is often Claude being appropriately responsive to the underspecification in your prompt, not Claude being random.

**The fix: be more specific about format, length, tone, and purpose before you get an output rather than after.** The most reliable prompt structure:
- What is the output (email, summary, analysis, list)?
- Who is it for?
- What format should it take?
- What tone?
- What should it include or exclude?

If you find yourself editing the same aspects of Claude's output every time, that is a signal to add those requirements to the prompt instead.

## Cause 3: The conversation has run too long

Claude attends to the full [context window](/glossary/context-window) — everything in the conversation — but recent content gets more weight than early content. In a very long conversation, instructions you gave at the start start to fade in influence. Claude may drift away from the constraints or tone you established early on.

This is not a bug. It is a property of how language models process long contexts. But it means that multi-hour conversations where you have given a lot of instructions will produce less consistent outputs toward the end.

**The fix: start a new conversation.** When a conversation has gone on for more than 30 to 40 exchanges and outputs start drifting, starting fresh resets the context. Your Project instructions reload from the beginning. Claude attends fully to them again.

For long complex tasks — writing a whole document, working through a multi-part problem — break it into separate conversations rather than doing everything in one long thread.

## Cause 4: The system prompt and the conversation are pulling in different directions

If you have a Project with a system prompt that says "always be concise and use bullet points" and then you spend a conversation asking Claude to write long-form prose, Claude is being pulled in two directions. The output will be inconsistent because the instruction set is inconsistent.

This also happens when a system prompt is out of date. You updated your product's pricing, or changed the tone guidelines, or added a new offering — but the system prompt still reflects the old state. Claude confidently produces outputs based on wrong information.

**The fix: treat your system prompt like a living document.** Review it when your outputs start feeling off. Check for contradictions between the system prompt and what you are asking in conversation. Update it when things change.

A useful diagnostic: when an output is wrong in a way that is hard to explain, paste your system prompt and the relevant conversation into a new conversation and ask: "Is there anything in the system prompt that might be causing this output?" Claude is often good at identifying where its own instructions are ambiguous or contradictory.

## The diagnostic shortcut

When you get a bad output, ask three questions in order:

1. **Did I give Claude the full context it needed?** (Cause 1)
2. **Were my instructions specific about format, tone, and purpose?** (Cause 2)
3. **Is this conversation very long, or is the system prompt outdated?** (Causes 3 and 4)

In most cases, you will identify the cause within one minute. The fix follows from the cause.

The teams that find Claude most reliable are not the ones with the best prompts on any given day — they are the ones with a Project set up, a maintained system prompt, and the habit of starting a fresh conversation when something feels off.
`,
  },

  // ── 4. Day in the life: Ops Manager ───────────────────────────────────────
  {
    termSlug: 'claude-projects',
    slug: 'ops-manager-ai-workflow',
    angle: 'field-note',
    title: 'What using Claude actually looks like for an ops manager',
    excerpt: "Ops managers live in documentation, process, and communication — high-volume work that follows patterns. Here is where Claude shows up in the actual job.",
    readTime: 7,
    cluster: 'Role Workflows',
    body: `Operations managers have a different relationship with Claude than most roles. Unlike CS, where the wins are obvious (ticket drafts, QBR prep), or marketing, where the output is clearly content — ops work is harder to pin down. It is coordination, documentation, problem-solving, and communication, most of it internal, most of it without a clean end product.

What that means: Claude's value in an ops role is diffuse. It shows up in a dozen places rather than two or three. The total time saved is significant; any individual use case is unremarkable. Which is also why ops teams often underestimate how much they are getting from it.

## Where Claude actually shows up

**Process documentation.** Writing SOPs is one of the most reliably time-consuming ops tasks. The knowledge is in someone's head; getting it into a format that someone else can follow takes longer than doing the thing. Claude compresses this significantly.

The workflow: have the person who owns the process talk through it (or write rough notes about it), then give Claude the raw description and ask it to produce a structured SOP. "Here is how we handle vendor onboarding at our company — rough notes below. Write a step-by-step SOP with: overview, who is responsible for each step, inputs and outputs, decision points, and escalation path."

The first draft is 70 to 80 percent there. The SME reviews, corrects the specific steps that are wrong, and adds the judgment calls that were not in the rough notes. What used to take a morning takes an hour.

**Meeting prep and facilitation.** Ops managers run a lot of meetings — planning sessions, vendor reviews, cross-functional syncs, retrospectives. Claude is useful at both ends.

Before: "I am facilitating a quarterly ops review with the following people and agenda items: [paste]. Write a 60-minute meeting agenda with time allocations, the three decisions we need to make, and two or three good questions to surface disagreement early."

After: "Here are my rough notes from today's ops sync: [paste raw notes]. Write a clean meeting summary with: decisions made, action items with owners and deadlines, open questions to follow up on, and anything that needs to go to leadership."

The after version is where most ops managers find the biggest time saving — turning rough notes into a structured summary that gets sent to stakeholders is something Claude does in 30 seconds that would otherwise take 20 minutes.

**Vendor and contract management.** Ops is often the function that manages vendor relationships and the paperwork that comes with them. Claude is useful for:

- Summarising vendor agreements: "Here is this vendor contract. Extract the key commercial terms: pricing, payment schedule, renewal terms, termination provisions, and any unusual clauses."
- Drafting vendor communications: "We need to tell this vendor we are not renewing. Context: [situation]. Write a professional, direct email that explains our decision and the timeline."
- RFP and vendor evaluation: "Here are three vendor proposals. Compare them on: pricing, implementation timeline, support model, and contract terms. Produce a summary table and a recommendation paragraph."

**Cross-functional communication.** A significant part of ops work is translating information between teams — explaining a process change to people affected by it, summarising a vendor decision for the finance team, updating leadership on a project status. These are different audiences requiring different framings.

Claude handles the translation: "Here is the situation with [project/vendor/process]: [paste]. Write a short update for the leadership team that explains what happened, what we are doing about it, and what they need to know or decide."

**Policy and procedure documents.** Every new initiative needs a policy. Every policy needs to be communicated. Every communication needs to be documented. Claude handles the writing; you provide the decisions.

"We have decided to [policy decision]. Write a one-page policy document that covers: what the policy is, who it applies to, why we are doing this, how it works in practice with examples, and what happens when it is not followed. Plain language, no jargon."

## Where Claude does not help much in ops

**Making judgment calls about trade-offs.** Should we use this vendor or that one? Should we invest in this process improvement or deprioritise it? These require context about your company's priorities, your relationships, your constraints. Claude can help you structure the decision framework; it cannot make the call.

**Managing stakeholder dynamics.** Ops managers spend a lot of time managing relationships — with vendors, with internal stakeholders, with leadership. Claude can help you draft a difficult email, but it cannot tell you whether sending it will make things better or worse in a specific relationship context.

**Knowing what to prioritise.** The hardest ops question is always: what is most important right now? Claude can help you think through a prioritisation framework, but your judgment about what matters given the organisation's current state has no substitute.

## The setup that works for ops teams

One [Project](/glossary/claude-projects) for ops, with:
- Your company overview and org structure
- Key process documents and SOPs
- Vendor list and summary of key relationships
- Meeting templates (agenda, notes, action item format)

System prompt: "You are an operations assistant for [Company]. You help draft documentation, meeting materials, vendor communications, and process guides. You write clearly and concisely for an internal audience. When you need specific information to be accurate — names, dates, costs, decisions — ask for it rather than inventing it."

That last instruction matters most in ops. An ops Claude that invents specific details about processes or vendor terms is worse than useless — it creates documents that have to be completely re-verified. A Claude that flags when it needs specific facts produces reliable first drafts.

## The compound view

The clearest way to see Claude's ops impact is to count the recurring tasks that happen every week and estimate how much writing time each one involved. For most ops managers, the list includes: meeting notes, status updates, process documentation, policy drafts, vendor correspondence, and cross-functional communications.

Add up the time. For a typical ops manager, it is 8 to 12 hours a week spent writing. Claude can absorb a meaningful share of that — not all of it, but enough to free up time for the judgment-intensive work that actually requires an experienced ops manager.
`,
  },

]

async function seed() {
  console.log('Seeding batch 33...\n')

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
