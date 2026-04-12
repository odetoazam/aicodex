/**
 * Batch 5 — articles for new terms + founder learning path
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-5.ts
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

  // ── 1. Claude Projects — role ────────────────────────────────────────────
  {
    termSlug: 'claude-projects',
    slug: 'claude-projects-role',
    angle: 'role',
    title: 'How to set up Claude Projects for your team (and what most people miss)',
    excerpt: 'Projects are the most underused feature in Claude. Here\'s how to configure them so your whole team gets consistent outputs — not whatever each person happens to type.',
    readTime: 5,
    tier: 2,
    body: `Most teams using Claude are doing it the hard way.

Every conversation starts from scratch. Each person has their own way of prompting. Outputs vary wildly. Someone writes a great brief with Claude, then nobody else can reproduce it. The company's been "using AI" for six months and has nothing to show for it except a pile of individual wins that never compounded.

[Claude Projects](/glossary/claude-projects) fix this. They're persistent workspaces where you set context once, and it applies to every conversation that happens inside. Your company background, your tone of voice, your standard caveats, the specific way you want summaries formatted — you write it once, and everyone on the team benefits from it.

Here's how to actually set them up.

## Step one: pick a single use case to start

Don't build a Project called "Marketing". Build one called "Writing customer emails" or "Drafting LinkedIn posts in [your founder's] voice". The narrower the scope, the easier it is to write instructions that actually work.

The biggest mistake is building a general-purpose assistant and expecting it to work well for everything. It won't. Specificity is what makes Projects useful.

## Step two: write the custom instructions like a brief, not a list of rules

Most people write instructions like:
- Always be professional
- Use British English
- Don't make things up

That's fine but it's not what makes Projects powerful. What makes them powerful is context that Claude couldn't otherwise have:

- Who your customer is and what they actually care about
- What your product does and who it's for
- What you've tried before that didn't work
- The specific format you want outputs in
- Phrases or framings to avoid

Think of it as briefing a smart contractor on their first day. What do they need to know to do good work immediately?

## Step three: add your documents

Projects let you upload files — your product documentation, your brand guidelines, your customer research, past examples of good work. Claude can reference these during conversations.

This is the difference between a generic assistant and one that knows your business. If someone asks Claude to write a feature announcement, and your roadmap and messaging doc are in the Project, Claude can actually write something accurate — not just plausible-sounding.

Keep documents current. Outdated documents produce confidently wrong outputs.

## Step four: test before you roll it out

Write ten example prompts that represent real tasks your team would do. Run them through the Project. Read the outputs carefully. Are they consistent? On-brand? Would you actually use them?

Most Projects need two or three rounds of instruction refinement before they're ready to share with a team. That's normal — treat it like editing a brief, not debugging software.

## What this looks like when it works

A customer success team at a SaaS company sets up a Project with their product documentation, common customer questions, and instructions on tone. When a new CS hire joins, they can start drafting responses on day one that are actually on-brand and accurate — instead of spending their first month learning the product before they can write anything useful.

That's the compounding effect. Projects aren't just about efficiency — they're about making the team's collective knowledge accessible to everyone, immediately.
`,
  },

  // ── 2. Extended Thinking — role ─────────────────────────────────────────
  {
    termSlug: 'extended-thinking',
    slug: 'extended-thinking-role',
    angle: 'role',
    title: 'When to use extended thinking — and when it\'s a waste',
    excerpt: 'Extended thinking makes Claude noticeably better on hard problems. But most tasks don\'t need it, and using it everywhere will slow you down and cost more.',
    readTime: 4,
    tier: 3,
    body: `[Extended thinking](/glossary/extended-thinking) is one of those features that sounds obviously useful — Claude thinks harder before answering, so it gets better results — until you realise that "thinking harder" takes longer and costs more tokens, and most of your prompts don't need it.

Here's how to decide when it's actually worth it.

## What extended thinking actually does

When you enable extended thinking, Claude works through the problem step by step before giving its answer. You can see the reasoning — including where it changed its mind or caught an error. It's not just more words. It's a different process.

The result is meaningfully better on certain types of problems. On others, it's overkill.

## Use it when the problem has hidden complexity

Extended thinking pays off most on:

**Multi-step reasoning.** Problems where you have to get step 3 right to get step 5 right. Financial models, legal analysis, anything that chains dependencies.

**Ambiguous or contradictory inputs.** When the information you've given Claude is incomplete or internally inconsistent, extended thinking helps Claude surface that explicitly rather than glossing over it.

**High-stakes decisions.** When the cost of a wrong answer is high enough that taking extra time is worth it. Strategic analysis, risk assessments, anything you're going to act on directly.

**Tasks where you've been getting inconsistent results.** If Claude keeps giving you different answers to the same question, extended thinking often produces more stable, considered outputs.

## Don't use it for routine work

For most everyday tasks — writing a first draft, answering a factual question, reformatting something, summarising a document — standard Claude is fast, accurate, and perfectly sufficient. Extended thinking adds latency you don't need.

Think of it like the difference between asking a colleague a quick question versus booking a meeting to work through a problem together. Both are right in different situations. Using the meeting format for every question is just inefficient.

## A practical rule

If you'd be comfortable reading just the final answer without understanding how Claude got there, you don't need extended thinking. If you'd want to check the reasoning — because the problem is hard enough that the path matters — turn it on.

The goal is appropriate depth. Not always deep, not always shallow.
`,
  },

  // ── 3. MCP — role ───────────────────────────────────────────────────────
  {
    termSlug: 'mcp',
    slug: 'mcp-role',
    angle: 'role',
    title: 'What MCP actually means for your business (it\'s not just for developers)',
    excerpt: 'The Model Context Protocol sounds technical. The practical implication is simple: AI tools can now connect to your actual systems in a standardised, safe way. Here\'s what that means for how you work.',
    readTime: 5,
    tier: 3,
    body: `When Anthropic open-sourced the [Model Context Protocol](/glossary/mcp), most coverage was aimed at developers. "Universal standard for AI tool integration." "Replaces custom API wrappers." Technical stuff.

But there's a business story here that matters to operators, not just engineers.

## The problem MCP solves

Before MCP, connecting Claude to an external tool — your CRM, your database, your file storage — required custom code specific to that tool. Each integration was its own project. Expensive, slow, and brittle when the tool's API changed.

MCP creates a universal interface. If a tool supports MCP, any MCP-compatible AI can use it. No custom code per integration. Build it once, use it everywhere.

The analogy: before USB, every device had its own proprietary connector. You needed a different cable for everything, and they weren't interchangeable. USB standardised the interface. MCP does the same thing for AI tool connections.

## What this unlocks in practice

**Your team can build AI workflows without involving engineering every time.** Because integrations follow a standard pattern, more of the work is configuration rather than custom development. That's a real shift in who can build what.

**Your AI tools can access your actual company data — safely.** MCP includes proper permission controls. You define what Claude can see and do. It can read your Notion docs but not write to your database. It can query your CRM but not send emails on its own. The boundaries are explicit, not implied.

**Third-party tools are building MCP support.** Zapier, Notion, GitHub, Linear — the ecosystem is growing fast. An AI assistant that connects to your existing tools isn't a custom engineering project anymore. It's increasingly a configuration task.

## The operator question to ask

Not "should we use MCP?" — that's a developer question. The operator question is: **"Which tool or data source, if Claude had access to it, would make the biggest difference to my team right now?"**

Start there. Then work backwards to figure out how to connect them. MCP is the infrastructure that makes the connection practical. The strategy is yours to define.

## One thing to watch

MCP moves quickly. The standard is relatively new and the tooling is still maturing. For low-stakes internal use, the current state is fine. For anything customer-facing or touching sensitive data, get your engineering team involved in reviewing the implementation before deploying.
`,
  },

  // ── 4. AI pilot — failure ────────────────────────────────────────────────
  {
    termSlug: 'evals',
    slug: 'ai-pilot-failure',
    angle: 'failure',
    title: 'Why your first AI pilot probably failed',
    excerpt: 'Most AI pilots don\'t fail because the AI wasn\'t good enough. They fail for three very predictable reasons — none of which are technical.',
    readTime: 5,
    tier: 2,
    body: `If your first AI pilot didn't turn into a production system, you're in good company. Most don't. But the failure is rarely what teams think it is.

Here are the three patterns that kill most pilots — before any technology decisions matter.

## Failure 1: The pilot was too ambitious

The most common mistake. Someone sees a demo of Claude handling complex customer queries, and the pilot becomes "build an AI customer service agent that handles 80% of tickets."

That's a product, not a pilot. A pilot is supposed to test one specific assumption about whether something works in your context. The narrower the scope, the faster you learn, the cheaper the failure.

A good pilot question: "Can Claude draft first-pass responses to our three most common support ticket types, which a human then reviews before sending?"

That's testable. You can run it in two weeks. You know what "worked" means before you start.

A bad pilot question: "Can AI improve our customer experience?"

That's a strategy, not a test. You'll spend three months not knowing whether it's working.

## Failure 2: No one owned the output quality

AI output quality doesn't maintain itself. Someone needs to read the outputs regularly, notice when they're drifting, update the instructions, and close the feedback loop.

In pilots, this role usually isn't assigned. The assumption is that Claude will just keep being good. It won't, because the context changes. Customers start asking different questions. Your product changes. Edge cases accumulate.

Before you start any pilot: name a person who is responsible for output quality. Not "the team." One person. Their job is to read a sample of outputs every week and flag problems.

## Failure 3: Success was never defined

At the end of the pilot, someone asks "did it work?" and the honest answer is "we don't know."

Outputs were fine. People seemed to like it. But was it faster? Did it reduce errors? Did it save anyone meaningful time? Nobody measured.

This is fixable in advance and almost never fixed in advance. Before you start: write down what "worked" means in numbers. Not "qualitatively better" — actual metrics. Handle time, error rate, hours saved per week, tickets escalated. Pick two that matter and measure them from day one.

A pilot without defined success criteria isn't a pilot. It's a demo that runs longer than it should.

## The common thread

None of these failures are technical. The AI was capable enough. The failure was in how the pilot was scoped, staffed, and evaluated.

The organisations that get pilots right treat them like small bets with explicit hypotheses — not exploratory wandering with a vague hope that something good emerges.
`,
  },

  // ── 5. What to automate first — role ─────────────────────────────────────
  {
    termSlug: 'tool-use',
    slug: 'what-to-automate-first',
    angle: 'role',
    title: 'What to automate first with AI',
    excerpt: 'Every company has ten things they could automate with AI. About two of them are actually good starting points. Here\'s the framework for finding them.',
    readTime: 5,
    tier: 2,
    body: `When a team decides to implement AI, the first question is usually "where do we start?" The answer most people give is some version of "find a repetitive task and automate it." That's not wrong, but it's not specific enough to be useful.

Here's the framework we'd actually use.

## The four criteria that matter

A good first automation target scores well on all four:

**1. High volume.** You want something that happens many times a week, not occasionally. If the task only comes up twice a month, the impact of automating it — even if you do it perfectly — is small. Volume is what turns small efficiency gains into real savings.

**2. Consistent input.** AI works best when what goes in is predictable. "Summarise this customer support ticket" is a good prompt. "Handle this situation however seems right" is a bad prompt. Start with tasks where the input is structured enough that you can write clear instructions.

**3. Low consequence of error.** For your first automation, pick something where a wrong output is annoying rather than catastrophic. First drafts that a human reviews before sending are good. Automated emails that go directly to customers without review are not a good first automation.

**4. Measurable outcome.** You should be able to tell whether the automation is working. "Faster" is measurable. "Better" is not. "Tickets responded to in under 2 hours" is measurable. "Customer satisfaction" is not — at least not in the short term.

## The tasks that usually score well

- **First-draft responses** to common inbound queries (support tickets, sales enquiries, partner requests)
- **Summarisation** — meeting notes, long documents, email threads
- **Research briefs** — competitive summaries, background on a prospect, topic overviews
- **Content reformatting** — turning bullet points into prose, adapting copy for different channels
- **Internal documentation** — turning a Loom recording or meeting notes into a structured doc

Notice what these have in common: they're all tasks where a human is in the loop. Claude produces something; a human checks and uses it. That's the right structure for early automations.

## The tasks that usually score poorly

- **Autonomous customer communication** — anything where Claude acts without review
- **Data entry into critical systems** — accounting, legal, compliance
- **Anything with unpredictable edge cases** — situations where "it depends" is the real answer
- **Tasks that require judgment about sensitive situations** — personnel decisions, legal risk assessments, medical advice

These aren't permanent no-go zones. They're wrong starting points because failure modes are harder to catch and more costly.

## The question to ask your team

Get your team together and ask: "What do we spend the most time on that follows a predictable pattern?"

The person who's been doing the job longest usually knows the answer immediately. They've built mental shortcuts for the repetitive parts. Those mental shortcuts are what you're trying to encode into a [system prompt](/glossary/system-prompt) or workflow.

Start there. Score it against the four criteria. If it passes, that's your first automation.
`,
  },

  // ── 6. Skills & Connectors — role ───────────────────────────────────────
  {
    termSlug: 'connector',
    slug: 'connectors-skills-role',
    angle: 'role',
    title: 'Skills and Connectors: how to make Claude actually useful at work',
    excerpt: 'By default, Claude only knows what you tell it in the conversation. Skills and Connectors change that — here\'s what they do and which ones are worth turning on.',
    readTime: 4,
    tier: 2,
    body: `Out of the box, Claude is a capable but isolated assistant. It can write, reason, and analyse — but only with what you paste in. It can't look things up, access your files, or take actions in other tools.

[Skills](/glossary/skill) and [Connectors](/glossary/connector) change that.

## What's the difference?

**Skills** are built-in capabilities you enable inside Claude.ai — things Claude can do, not places it can reach. Web search. Code execution. Image generation. When you enable a skill, Claude gains access to that capability and will use it automatically when it's relevant to your conversation.

**Connectors** link Claude to external services — Google Drive, Dropbox, Notion, Jira, GitHub. When you connect a service, Claude can read documents from it, search it, or in some cases take actions within it. This is how you give Claude access to your actual work instead of making you copy-paste everything.

The practical distinction: Skills extend what Claude can do. Connectors extend what Claude can see.

## Which ones are actually worth turning on?

**Web search** — almost always worth enabling. Claude's training data has a cutoff date. For anything time-sensitive — current events, recent product launches, prices, who currently holds a role — search is the difference between an accurate answer and a confidently wrong one.

**Google Drive / Dropbox / Notion** — worth it if your team stores documents there and you find yourself copy-pasting things into Claude regularly. Set it up once, stop doing that.

**GitHub** — valuable for technical teams who want Claude to work with their actual codebase rather than pasted snippets.

**Code execution** — useful if you want Claude to run calculations, manipulate data, or test code rather than just write it. Claude can write the code and verify it works in the same step.

## What Connectors don't do

Connectors give Claude read access to your files and the ability to search within them. They don't give Claude persistent memory across conversations, and they don't let Claude proactively go looking for things without you asking.

Think of it like a smart intern who can access your Google Drive but only looks at things when you ask, and doesn't remember what they found in the last conversation.

For teams building more persistent AI workflows — where Claude should proactively pull context, take actions, or remember across sessions — that's a different setup, closer to what [Claude Projects](/glossary/claude-projects) and the [Agent SDK](/glossary/claude-agent-sdk) are for.

## The practical starting point

If you're using Claude.ai for work: enable web search immediately. Then look at where your work documents live and connect that service. Those two things alone will make most conversations noticeably more useful.
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
      cluster: 'Tools & Ecosystem',
      title: a.title,
      angle: a.angle,
      body: a.body.trim(),
      excerpt: a.excerpt,
      read_time: a.readTime,
      tier: a.tier,
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
