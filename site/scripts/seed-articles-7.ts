/**
 * Batch 7 — CS/ops/marketing use cases + field notes
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-7.ts
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

  // ── 1. AI for customer success — field-note ───────────────────────────────
  {
    termSlug: 'claude',
    slug: 'ai-for-customer-success',
    angle: 'field-note',
    title: 'What AI actually looks like in a customer success team',
    excerpt: 'What CS teams are actually using AI for right now — what\'s working, what isn\'t, and what nobody tells you before you start.',
    readTime: 6,
    cluster: 'Business Strategy & ROI',
    body: `Customer success is one of the best places to implement AI. The work is high-volume, often repetitive in structure, deeply dependent on knowing your product, and has clear quality signals — you can tell pretty quickly whether an output is good or not.

Here's what it actually looks like when CS teams do it well.

## What's genuinely working

**First-draft responses to common ticket types.** Not full automation — Claude drafts, a human reviews and sends. For the top five most common ticket types (account access, billing questions, how-to questions, feature requests, bug reports), this typically cuts handle time by 40-60%. The human's job shifts from writing to editing, which is faster and still catches errors.

Setup: a [Claude Project](/glossary/claude-projects) with your product documentation, your tone guidelines, and instructions to always acknowledge the customer's frustration before solving. You're not replacing the human — you're giving them a strong starting point.

**Summarising long ticket histories.** Customer opens a ticket, it's their fourteenth interaction this year. Previously, the agent had to read through thirteen previous tickets to get context. Now: paste the history, ask Claude to summarise the situation and what's been tried. This alone saves meaningful time per complex ticket.

**Drafting customer-facing documentation updates.** When a feature changes, someone has to update the help docs. CS managers typically know these need updating but never have time. Paste the old doc and the release notes — Claude produces a draft. Human reviews and publishes. What used to sit on a backlog for three weeks happens in an afternoon.

## What doesn't work as well as expected

**Full ticket automation without human review.** The teams that tried this (sending Claude's response directly to customers) saw a spike in negative CSAT for edge cases. Claude is good at typical cases. Edge cases — angry customers, unusual account situations, billing disputes — need human judgment. Keep humans in the loop for anything customer-facing.

**Using Claude without product-specific context.** Generic Claude giving generic answers to product-specific questions produces answers that are helpful-sounding but subtly wrong. "Claude said our API supports X, but it doesn't" is a trust-destroying experience. [Connect Claude to your actual documentation](/glossary/rag) before using it for product questions.

**Prompting for empathy.** You can instruct Claude to "be empathetic" — it will use empathetic language. But customers can often tell the difference between genuine and performed empathy. Use Claude for the informational parts; have humans handle the emotional ones.

## The adoption pattern that works

Don't roll it out to the whole team at once. Start with one agent who's enthusiastic about the tool, let them work out the rough edges, and document what's working. Then expand. The early adopter's learnings — what prompts work, what the Project instructions should say, when to trust the output — are more valuable than any training you could write in advance.

## The metric to watch

CSAT by ticket type. If first-contact resolution rates go up but CSAT goes down for a specific ticket type, Claude is producing technically correct answers that miss the emotional register. That's fixable — but you need to be watching for it.
`,
  },

  // ── 2. AI for marketing teams — field-note ────────────────────────────────
  {
    termSlug: 'claude',
    slug: 'ai-for-marketing',
    angle: 'field-note',
    title: 'How marketing teams are actually using Claude',
    excerpt: 'Content is the obvious use case. But the marketing teams getting the most value from AI have figured out something different.',
    readTime: 5,
    cluster: 'Business Strategy & ROI',
    body: `The first thing marketing teams try with Claude is content generation. Blog posts, social copy, email sequences. That works — up to a point. The outputs are competent, production speeds up, the team is less burnt out.

But the teams getting genuinely outsized value have moved beyond content generation. Here's what that looks like.

## What most teams start with (and its limits)

Content drafting is a good starting point. It's high-volume, the quality bar is measurable, and Claude is genuinely useful at it. The limits become apparent over time: Claude's content sounds like Claude's content. Your audience may not notice immediately, but your team will, and your brand voice slowly homogenises.

The fix isn't to use Claude less — it's to use it differently. Claude is a better editor and strategist than it is a ghostwriter. Use it to improve what you write, not replace you writing it.

## Where the real leverage is

**Research and synthesis.** Ask Claude to analyse your competitors' messaging. Paste in three months of customer interviews and ask for common themes. Have it summarise what the research says about a market segment before you write the positioning document. This is the work that used to take a week and can now take an afternoon.

**Brief writing.** The brief is often the bottleneck. If Claude can produce a first-draft creative brief — positioning, audience, objectives, messaging hierarchy — the creative team can spend their time reacting and refining rather than staring at a blank document.

**Personalisation at scale.** A prospect email that references their specific company, role, and likely pain points outperforms a generic one by a significant margin. Claude can take a template and a set of prospect details and produce personalised variants. This used to require a copywriter for each segment. Now it doesn't.

**Repurposing.** A webinar becomes a blog post, a Twitter thread, a LinkedIn article, five email follow-ups, and a sales one-pager. Claude handles the reformatting and adaptation. A human ensures the high-visibility pieces are polished. The long tail gets done.

## The setup that works

A [Claude Project](/glossary/claude-projects) with:
- Your brand voice guidelines (specific, not vague — examples are better than adjectives)
- Your ICP description in detail
- Your product's positioning and key differentiators
- Examples of content you're proud of and why

This context means every conversation starts with Claude knowing who you are. Without it, every conversation is ground zero.

## The honest limitation

Claude doesn't know what's resonating with your audience right now. It doesn't know that the campaign you ran last quarter flopped because the message was off. It doesn't feel the difference between copy that's technically correct and copy that's actually compelling.

The most effective teams use Claude for the structure and the first draft, then a human with taste and audience knowledge shapes it into something that actually converts.
`,
  },

  // ── 3. Tool use — process ─────────────────────────────────────────────────
  {
    termSlug: 'tool-use',
    slug: 'tool-use-process',
    angle: 'process',
    title: 'How tool use works: what happens when Claude calls a function',
    excerpt: 'Tool use is the mechanism that lets Claude take actions — call APIs, run code, search files — instead of just generating text. Here\'s exactly what happens when Claude uses a tool.',
    readTime: 4,
    cluster: 'Tools & Ecosystem',
    body: `[Tool use](/glossary/tool-use) is what turns Claude from a text generator into something that can take actions in the world — search the web, query a database, send an email, run a calculation. Here's exactly how the mechanism works.

## The basic sequence

1. **You define the tools.** When you set up a Claude integration, you describe the functions Claude can call — their names, what they do, and what inputs they need. This happens in the system setup, not the conversation.

2. **The user asks something.** Claude reads the question and the tools available to it.

3. **Claude decides whether to use a tool.** If the question requires information or action that a tool can provide, Claude generates a structured call to that tool — the function name and the right inputs.

4. **The tool runs.** Your system executes the function with Claude's inputs. This happens outside Claude — Claude hands off to your code, which calls whatever API or database is involved.

5. **The result comes back.** Your system returns the tool's output to Claude.

6. **Claude incorporates it into the response.** Claude uses the returned information to answer the original question.

## What Claude actually controls

Claude decides *whether* to call a tool and *what inputs to pass*. Claude does not execute the tool itself — it just requests the call. Your system executes it. This matters for safety: you can validate Claude's tool calls before running them, limit what tools are available in different contexts, and log everything that happens.

## An example: a customer support bot

The bot has two tools: search_knowledge_base(query) and get_account_status(account_id).

Customer asks: "Is my account on the Pro plan?"

Claude calls get_account_status with the customer's account ID. Gets back the plan ("starter") and renewal date (June 1st 2026). Responds: "Your account is currently on the Starter plan. Your renewal date is June 1st, 2026. Would you like information on upgrading to Pro?"

Claude didn't know the account status. It knew which tool to call and how to use the result. That's the division of labour.

## The operator question

For most teams using Claude.ai: tool use is handled through [Skills](/glossary/skill) — you just enable them. For teams building with the API: defining tools well (clear names, accurate descriptions, the right input schema) is one of the most important decisions you make. Claude uses your descriptions to decide when and how to call each tool. Vague descriptions produce unreliable tool calls.
`,
  },

  // ── 4. AI agent — field-note ──────────────────────────────────────────────
  {
    termSlug: 'ai-agent',
    slug: 'ai-agent-field-note',
    angle: 'field-note',
    title: 'When Claude starts doing the work: what AI agents look like in practice',
    excerpt: 'An agent isn\'t just a chatbot that can click buttons. It\'s a fundamentally different relationship between a human and an AI. Here\'s what that looks like when it\'s working.',
    readTime: 5,
    cluster: 'Agents & Orchestration',
    body: `Most interactions with Claude are transactional: you ask, Claude answers. An [AI agent](/glossary/ai-agent) is something different — Claude working through a multi-step task on its own, making decisions along the way, and producing an outcome rather than just an answer.

Here's what that actually looks like when it works, and what to watch for.

## A concrete example: a sales research agent

The task: before every sales call, produce a briefing on the prospect — their company, recent news, likely pain points, relevant competitors they might already use.

Old process: sales rep spends 30-45 minutes on LinkedIn, Crunchbase, the company's website, and Google News before each call.

Agent process: give Claude the prospect's company name and domain. Claude searches the web, reads recent press releases and news, checks for job postings (a good signal for growth areas and pain points), looks at their product pages and pricing. Synthesises everything into a structured briefing. The whole thing runs while the rep is on their previous call.

The rep still reads the briefing and adds judgment. But the 30-minute research task is now a 2-minute review task.

## What makes this different from a regular prompt

The agent doesn't just answer one question — it completes a multi-step workflow. It decides what to search, reads the results, decides what's relevant, decides what to search next based on what it found, and synthesises the whole thing. At each step it's making judgment calls without human input.

That autonomy is what makes agents powerful. It's also what makes them require more care to set up.

## The failure mode to watch for

Agents fail in specific ways that regular prompts don't. The most common: a step in the middle goes wrong — Claude retrieves the wrong information, misinterprets a result, or follows an edge case — and all subsequent steps build on the error. The final output looks plausible but is wrong in ways that are hard to catch.

This is why good agent implementations include:
- Checkpoints where a human reviews intermediate outputs
- Clear scope limits (what Claude can and can't do without approval)
- Logging of every step so you can diagnose failures

**Don't build an agent that takes irreversible actions without human approval.** Start with agents that produce outputs for human review. Automate the approval step only after you've established that the outputs are reliably good.

## Where to start

The best early agent use cases are research-heavy, produce a document or summary (not an action), and have a clear definition of what "done" looks like. Sales briefings, competitive research, summarising large volumes of information, monitoring for specific events.

The cases to approach carefully: anything that takes actions in external systems, sends communications on your behalf, or modifies data.
`,
  },

  // ── 5. Evals — field-note ─────────────────────────────────────────────────
  {
    termSlug: 'evals',
    slug: 'evals-field-note',
    angle: 'field-note',
    title: 'How to actually evaluate whether your AI rollout is working',
    excerpt: 'Most AI rollout evaluations are either too vague ("the team likes it") or too technical (automated test suites that miss what users actually care about). Here\'s what works.',
    readTime: 5,
    cluster: 'Business Strategy & ROI',
    body: `Six months after your AI rollout, someone asks: "Is it working?"

If your honest answer is "we think so, people seem positive," you don't have an evaluation process. You have vibes.

[Evals](/glossary/evals) — the practice of systematically measuring AI output quality — sounds like a developer concern. In practice, it's an operator concern. You don't need to run automated test suites. You do need a process for knowing whether the rollout is delivering.

## The two questions to answer

Every eval process comes down to two questions:

**1. Are the outputs good enough?** Does Claude produce outputs that are accurate, on-brand, and useful? Would you be comfortable if a customer or executive saw them?

**2. Is it making a meaningful difference?** Are the metrics you care about moving? Handle time, error rate, output volume, hours saved, tickets escalated?

Most teams only measure one of these. Teams that measure only quality often don't know if the tool is actually changing productivity. Teams that measure only productivity often don't notice when quality degrades.

You need both.

## A practical quality evaluation process

Pick a sample size you can actually sustain. For most teams, 10-20 outputs per week reviewed by one person is enough to catch systematic problems.

Create a simple rubric with 3-4 criteria that matter for your use case. For a customer support application:
- Accurate (did it get the facts right?)
- Appropriate tone (did it match the situation?)
- Complete (did it actually answer the question?)
- On-brand (does this sound like us?)

Score each output 1-3 on each criterion. Track scores over time. Look for systematic failures — a specific ticket type that always scores low, a consistent accuracy problem with a product area.

This takes 20-30 minutes a week. It will tell you more than any automated metric.

## The productivity metrics that actually work

**Before/after measures are hard** — there are too many confounding factors. Better: measure the same task type throughout the rollout and track the trend.

Good metrics for common AI use cases:
- Time per ticket (customer support)
- Drafts submitted vs. accepted (content/marketing)
- Time from brief to first draft (any writing workflow)
- Volume produced per person per week (content)

Bad metrics: NPS (too lagged, too many confounds), "team satisfaction" (people often like tools that don't actually save time), cost per token (measures input, not output quality).

## The failure signal to watch for

Outputs look fine when you read them, but customers or downstream users push back more than expected. This is the hardest failure mode — the outputs pass your internal review but fail in the real world.

It's almost always a context problem: Claude is optimising for what looks right in isolation, but missing something about how customers actually interpret the communication. Fix: include real customer feedback in your evaluation loop, not just internal review.

## The most important thing

Whoever reviews outputs needs to be the person who knows what "good" actually looks like. Not the most junior person on the team, not the person with the most free time. The person with the most judgment about quality.

They don't need to review everything. They need to review a consistent sample, track trends, and have the authority to flag when something needs to change.
`,
  },

]

async function main() {
  console.log(`Seeding ${ARTICLES.length} articles...`)

  for (const a of ARTICLES) {
    const term = await getTermId(a.termSlug)
    if (!term) {
      console.error(`  ✗ ${a.slug}: term not found: ${a.termSlug}`)
      continue
    }

    const { error } = await sb.from('articles').upsert({
      slug: a.slug,
      term_id: term.id,
      term_name: term.name,
      term_slug: a.termSlug,
      cluster: (a as any).cluster ?? 'Tools & Ecosystem',
      title: a.title,
      angle: a.angle,
      body: a.body.trim(),
      excerpt: a.excerpt,
      read_time: a.readTime,
      tier: 2,
      published: true,
    }, { onConflict: 'slug' })

    if (error) {
      console.error(`  ✗ ${a.slug}:`, error.message)
    } else {
      console.log(`  ✓ ${a.slug}`)
    }
  }

  console.log('\nDone.')
}

main().catch(console.error)
