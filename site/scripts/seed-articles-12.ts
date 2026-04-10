/**
 * Batch 12 — More role-type field notes, practical operator guides, change management
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-12.ts
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

  // ── 1. AI change management ───────────────────────────────────────────────
  {
    termSlug: 'claude-plans',
    slug: 'ai-change-management',
    angle: 'process',
    title: 'The human side of rolling out AI at your company',
    excerpt: "Getting Claude configured is the easy part. Getting people to actually change how they work is harder. Here is what that looks like when done well.",
    readTime: 6,
    cluster: 'Business Strategy & ROI',
    body: `Most AI rollout post-mortems say the same thing: the technology worked, the people didn't change. Not because they were resistant or incompetent — because nobody thought carefully about change management. The configuration was fine. The communication and support structure wasn't.

This is the part that determines whether your rollout actually delivers value.

## Why people don't change even when the tool is good

The barrier to adopting a new tool is almost never capability. It is habit, uncertainty, and the feeling that the new way is more work than the old way — at least at first.

When someone opens Claude for the first time, they face several questions simultaneously: What should I type? How will I know if the output is good? What happens if it's wrong? Is this the kind of thing I'm supposed to use this for? If any of those questions don't have clear answers, the path of least resistance is to close the tab and keep doing things the way they've always done them.

Your job in change management is to answer those questions before people have to ask them.

## What actually works: the first-use moment

The most important intervention is not training. It is the first-use moment — the first time someone opens Claude with a real task in mind.

People need to leave that first session feeling that it was worth it. One successful experience is worth ten slides of onboarding material.

Design for this:
- Give people a specific task to try first, not an open invitation to "explore." Something from their actual work that will take 20-30 minutes and where the output is obviously useful.
- Make sure their [Project](/glossary/claude-projects) is configured before they log in. They should not have to figure out settings.
- Have someone available to help for the first 30 minutes — a Slack message is fine. Just someone who will answer "why did it do that?" questions quickly.

One good first session creates an advocate. One confusing first session creates a skeptic who will tell three colleagues.

## The early adopter strategy

Do not roll out to the whole team at once. Find the two or three people per team who are most curious about new tools. Roll out to them first. Give them two weeks to develop their own practice — prompts that work, workflows they have changed, outputs they have shared.

Then have them present to their team. Not as an IT demo — as a peer saying "here's what I actually changed in my week." Peer credibility is exponentially more powerful than admin credibility. The same information about how Claude works lands completely differently when it comes from a colleague who has done it.

This approach also gives you time to find the problems before they happen at scale. The early adopters will encounter the edge cases, the workflow fits that don't quite work, the prompts that need refining. Better to discover those in a small group than across the whole team simultaneously.

## The question you need to answer for every team

For each team, the change management question is: "What is the specific workflow change you want them to make?" Not "use Claude more" — a specific behaviour change.

For a CS team: "Before you draft a response to a complex ticket, open Claude and paste the ticket in. Use the draft Claude produces as your starting point."

For a marketing team: "When you have a content brief, use Claude to produce three angle options before you start writing."

For an operations team: "When you're documenting a new process, talk it through with Claude first and use its structure as the starting point for your SOP."

These are specific, testable, and small enough to try once and evaluate. Vague encouragement to "use AI" produces vague adoption. Specific behaviour targets produce measurable change.

## Handling resistance

Most resistance is not ideological. It is practical: people are busy, learning a new tool is an investment, and the payoff is not always immediate. Respect this.

The people most resistant to Claude are often the most experienced — they have workflows that work, and they are right that disrupting a working workflow for marginal gain is a bad trade. Do not try to change their whole workflow at once. Find the one task where the gain is obvious and undeniable, and start there.

The people who say "AI is going to replace us" need a different conversation. Acknowledge the concern honestly. Share your company's position. Be clear about what Claude is being used for and what it is not. Uncertainty about job security is legitimate — pretending it isn't makes it worse.

## The ongoing work

Change management does not end at launch. At 30 days, do a structured check-in (four questions: what are you using it for, what's faster, what stopped, what's not working). At 90 days, identify which teams have meaningfully changed how they work and which haven't — and find out why.

The teams that are not changing are telling you something. Maybe the configuration is wrong. Maybe the use cases don't fit. Maybe the team lead is not modelling the behaviour. Each of these has a different solution. Ask before assuming.

The rollouts that work are the ones where someone treats change management as a continuous process — not a launch event. The configuration is a quarter of the job. The rest is helping people actually change.
`,
  },

  // ── 2. Claude for data teams ──────────────────────────────────────────────
  {
    termSlug: 'tool-use',
    slug: 'claude-for-data-teams',
    angle: 'field-note',
    title: 'What AI actually looks like for a data and analytics team',
    excerpt: 'Data teams have a counterintuitive relationship with Claude — it is not about the analysis, it is about everything around it.',
    readTime: 5,
    cluster: 'Tools & Ecosystem',
    body: `Data analysts and data scientists have a complicated relationship with AI tools. On one hand, they work with the kind of structured, logical problems that AI should handle well. On the other hand, the core of their work — running queries, building models, statistical analysis — is better handled by their existing tools than by Claude.

The real value for data teams is not in the analysis. It is in everything around it.

## Where Claude delivers for data teams

**Translating analysis into communication.** The gap between what a data team can see in data and what stakeholders understand from it is enormous. Claude closes that gap. "Here is what this cohort analysis shows. Write an executive summary for a non-technical audience that makes the business implication clear." This is where data teams spend disproportionate time — Claude handles the translation without losing the integrity of the finding.

**Writing SQL and Python faster.** Claude cannot run your database or your Jupyter notebook. But it can write the query or the function, which you then review and run. For a data analyst, "write a SQL query that does X given this schema" is a meaningful time saving — especially for unfamiliar syntax or edge cases. Always review before running.

**Documentation that actually gets written.** Data documentation is universally behind. Datasets go undocumented. Pipelines are a mystery to anyone who didn't build them. "Here is the schema and what this table is used for. Write the documentation for it." Claude produces documentation that would never have been written otherwise, because the barrier was the blank page rather than the knowledge.

**Stakeholder question handling.** "The head of sales asked why their pipeline numbers differ from the finance report. Help me draft an explanation that covers the three most likely reasons and asks the right clarifying questions." Data teams field questions like this constantly. Claude helps draft the response; the analyst confirms the technical accuracy.

**Exploratory analysis planning.** "I have a dataset with these columns and I want to understand what drives churn. What analyses should I run and in what order?" Claude can produce a structured analysis plan — not the analysis, but the plan. Useful for junior analysts or unfamiliar domains.

## What Claude does not replace for data teams

The actual analysis. If you ask Claude to analyse a dataset in a conversation, it will give you a plausible-sounding answer that is not grounded in your actual data. Your numbers, your statistical methods, your model outputs — these must come from your actual tools: SQL, Python, R, your BI platform, whatever you use.

Claude works with text. Your data lives in databases, dataframes, and visualisation tools. The integration between these is thin unless you are using [Tool Use](/glossary/tool-use) or code execution in an agent context — and even then, the analyst needs to understand and verify what is being run.

**Statistical interpretation.** Claude knows statistics. It does not know your data's specific characteristics, distribution, or the domain context that makes an effect meaningful or trivial. Statistical conclusions about your data require a statistician — Claude can help explain methodology, not validate findings.

## The setup for data teams

A data Project with:
- Your data dictionary or key table schemas
- Standard query patterns your team uses
- Definitions for key business metrics (to ensure consistency)
- Communication templates (executive summary format, stakeholder update format)

System prompt: "You are a data communication assistant for [Company]'s analytics team. You help translate data findings into clear communication for non-technical stakeholders, assist with documentation, and help draft queries and code. You do not run analysis or provide statistical conclusions without being given data — you work with what the team provides."

## The real pattern

The data teams that get the most from Claude are not using it for analysis. They are using it to multiply the impact of their analysis — faster communication, better documentation, less time on translation and more time on the work that requires their expertise. That is the right division of labour.
`,
  },

  // ── 3. Context window practical guide ─────────────────────────────────────
  {
    termSlug: 'context-window',
    slug: 'context-window-practical',
    angle: 'process',
    title: 'The context window in practice: what it means for how you work',
    excerpt: "The context window is not just a technical spec — it shapes what Claude can and can't do in any given conversation. Here is how to work with it.",
    readTime: 5,
    cluster: 'Foundation Models & LLMs',
    body: `The [context window](/glossary/context-window) is the amount of text Claude can hold in its working memory at once — everything from the current conversation, uploaded documents, your Project instructions, and its own responses. Claude 3.5 Sonnet has a 200,000 token context window, which is roughly 150,000 words, or about 500 pages of text.

That sounds enormous. In practice, context windows fill up faster than you expect, and how you manage them affects the quality of your outputs.

## What goes into the context window

Every token in the context window costs something, and affects how Claude attends to different parts of the conversation. The context window contains, in order:

1. Your [system prompt](/glossary/system-prompt) or [Project instructions](/glossary/claude-projects)
2. Any documents you have uploaded to the Project
3. The full conversation history — every message from you and every response from Claude
4. Your current message

The more that is in the context window, the more Claude has to process — and the more it may weight earlier instructions less heavily as the conversation gets longer.

## The practical implications

**Long conversations drift.** In a very long conversation (40+ exchanges), Claude may start to lose track of instructions given early in the conversation, or produce outputs that are less consistent with the original setup. This is a property of attention — the model processes the full context, but recent content gets more weight. For long, complex tasks, it is often better to start a new conversation with a fresh context than to continue an old one indefinitely.

**Big documents consume context aggressively.** A 50-page PDF uploaded to a conversation is 30,000+ tokens. If you upload three such documents, you have used 90,000 tokens before you say anything. For large document sets, be selective about what you upload — only what Claude actually needs for the task at hand.

**Project instructions are always present.** Your Project system prompt is sent with every message. If it is 3,000 tokens, that is 3,000 tokens consumed on every turn. This is why keeping Project instructions tight matters — see the guidance on [writing system prompts](/articles/writing-system-prompts-that-work) for how to do this well.

**Prompt caching helps at scale.** For teams using Claude via the API, [prompt caching](/glossary/prompt-caching) lets you cache repeated context (like a large document that is referenced in every call) so it does not need to be re-processed each time. This is a significant cost and latency saving for high-volume use cases.

## When context length actually matters

For most everyday use — drafting emails, answering questions, producing reports — you will never notice context window limits. The 200k window is genuinely large.

Context management matters when you are:
- Working with very large documents (50+ pages)
- Running long analytical conversations
- Building workflows that involve many back-and-forth exchanges
- Using the API for high-volume automated tasks

For Claude.ai users: if a conversation is getting long and Claude seems to be losing track of earlier instructions, start a fresh conversation. Your Project instructions reload from scratch, and you get clean attention.

## The quality principle

A smaller context with the right information in it produces better outputs than a large context full of noise. Claude attends better to focused, relevant input. Before uploading a document, ask: does Claude actually need all of this? Often the answer is no — a 5-page summary of a 50-page document does better than the full document for most tasks.

This is the same principle as a good briefing: give someone exactly what they need to do the work, not everything you have.
`,
  },

  // ── 4. Claude Memory guide ─────────────────────────────────────────────────
  {
    termSlug: 'claude-memory',
    slug: 'claude-memory-practical',
    angle: 'process',
    title: 'How Claude Memory actually works — and how to use it',
    excerpt: 'Memory lets Claude remember things across conversations. Here is what it remembers, what it forgets, and how to make it useful for team work.',
    readTime: 5,
    cluster: 'Tools & Ecosystem',
    body: `[Claude Memory](/glossary/claude-memory) solves a specific problem: every Claude conversation, by default, starts from scratch. Claude does not know who you are, what you have worked on before, or what you care about. Memory changes that — it allows Claude to retain information across sessions, building up context over time rather than starting fresh every time.

Understanding how it actually works prevents the disappointment of expecting too much, and the underuse that comes from expecting too little.

## What Memory stores and when

Memory is not automatic recall of everything Claude has ever seen. It is a set of facts Claude has explicitly noted and stored — typically triggered when you or Claude identifies something worth remembering.

Things Memory is designed to hold:
- Facts about you: your role, preferences, how you like to work
- Facts about your organisation: company name, key context, ongoing projects
- Preferences about how Claude should behave with you: tone preferences, formatting preferences, things to avoid
- Ongoing context: a project you are working on, a decision you are tracking

Memory is personal — it is scoped to your account, not shared across a team. If you set up Memory with your preferences, your colleagues do not inherit them.

## How to build useful Memory

Memory is most useful when you treat it deliberately rather than hoping Claude automatically retains the right things.

At the start of a relationship with Claude, you can explicitly ask it to remember key context:
- "Remember that I am a head of product at a 50-person SaaS company."
- "Remember that I prefer bullet-point summaries over prose paragraphs."
- "Remember that when I ask for a draft, I want three options, not one."

These instructions persist. Future conversations start with Claude already knowing these things.

You can also ask Claude to recall what it remembers: "What do you know about me?" gives you a clear picture of what is stored and what you might want to add or correct.

## What Memory does not solve

**Memory is not a knowledge base.** Memory stores facts and preferences, not documents. If you want Claude to reference your company's product documentation, that belongs in a [Project's](/glossary/claude-projects) uploaded files — not Memory. Memory is for persistent context about you and how you work; Projects are for domain knowledge about your work.

**Memory is not a conversation history.** Claude does not remember the specific content of past conversations through Memory — it remembers facts that were explicitly stored. If you had a detailed strategic discussion last week, Memory will not let Claude reference that conversation unless you explicitly extracted key points and asked it to remember them.

**Memory resets are possible.** If Memory is producing wrong or outdated information, you can ask Claude to forget specific things: "Forget that I am the head of product — I've changed roles." Keeping Memory accurate is an ongoing task, not a one-time setup.

## Memory for individuals vs. teams

Memory is fundamentally an individual feature. It personalises Claude for one person's way of working.

For team consistency — everyone getting the same baseline context — [Projects](/glossary/claude-projects) with well-configured system prompts are the right tool. Memory adds personalisation on top of that: a CS rep might have individual Memory that tells Claude their preferred communication style, layered on top of a CS Project that gives everyone the same product knowledge.

Think of it as: Project = team context, Memory = individual personalisation.

## The practical pattern

Set up Memory early with the four or five facts about yourself and your work that would most change how Claude interacts with you. Review it quarterly. Use it primarily for how you like to work, not for what you are working on (projects come and go — Memory is for the more persistent stuff).

For teams, do not rely on Memory for consistency. That is Projects' job. Memory is the layer that makes Claude feel like it knows you — useful, but not the foundation of team deployment.
`,
  },

  // ── 5. Deep Research guide ────────────────────────────────────────────────
  {
    termSlug: 'deep-research',
    slug: 'deep-research-practical',
    angle: 'process',
    title: 'How to get the most out of Claude Deep Research',
    excerpt: 'Deep Research is not a faster Google. It is a different kind of tool. Here is what it actually does and how to use it well.',
    readTime: 5,
    cluster: 'Agents & Orchestration',
    body: `[Deep Research](/glossary/deep-research) is one of Claude's most powerful features and one of the most commonly misused. The misuse comes from treating it like a faster web search — typing a question and expecting a Google-style answer. That is not what it does.

Deep Research is a multi-step research process. Claude reads multiple sources, synthesises across them, follows up on findings that need more context, and produces a structured report. It takes minutes, not seconds. It produces thousands of words, not a paragraph. It is the research process, not the search query.

Here is how to use it well.

## What Deep Research actually does

When you trigger Deep Research, Claude:
1. Plans a research approach based on your question
2. Searches the web (and any connected sources) for relevant information
3. Reads and evaluates what it finds
4. Identifies gaps and searches again
5. Synthesises across all sources into a coherent report with citations

This is substantively different from a single web search or even asking Claude a question with web search enabled. The multi-step process allows for the kind of synthesis that single queries cannot achieve: comparing across sources, identifying consensus and disagreement, following threads that emerge from early findings.

## When to use it

Deep Research is the right tool when:

- You need comprehensive coverage of a topic, not a quick answer
- You want to understand the landscape across multiple sources
- You are preparing for a significant decision and want to surface what you don't know
- You need a report you can share with others, with citations

Use cases that work well:
- Competitive landscape analysis: "Research the competitive landscape for [product category] in [market]. Who are the key players, what do they charge, how do they position themselves?"
- Market research: "Research the state of AI adoption in [industry] in 2025-2026. What are the primary use cases, what results are companies reporting, what are the barriers?"
- Due diligence: "Research [company]. What is their history, product, funding, key people, public perception?"
- Regulatory landscape: "Research the current regulatory environment for [topic] in [jurisdiction]. What are the key requirements, recent changes, and pending developments?"

## When not to use it

Deep Research is not the right tool when:
- You need a quick answer, not a comprehensive report (use regular Claude with web search)
- The question is about your internal data or documents (Deep Research crawls the web — upload your documents to a Project instead)
- You need something in seconds, not minutes
- The question is specific enough that one or two sources would answer it

## How to write a good Deep Research prompt

The most important element is scope. Too narrow and Claude cannot find enough material. Too broad and the report is diffuse and shallow.

Good Deep Research prompts:
- State the specific question you are trying to answer
- Define the scope (industry, geography, time period, product category)
- Tell Claude what form you want the output in: "Produce a structured report with an executive summary, key findings by section, and citations"
- Tell Claude what you are going to use it for: "This is for a board presentation" shapes the report differently than "this is for my own background research"

Bad Deep Research prompts:
- "Tell me about AI" (too broad)
- "What is our competitor's pricing?" (Deep Research cannot access your competitor's private pricing)
- "Summarise this document" (not a research task — just provide the document)

## What to do with the output

Deep Research reports are starting points, not final deliverables. Treat them as a thorough first pass that:
- You read and annotate, not publish directly
- You verify the most important claims against the cited sources
- You supplement with your own knowledge and context

The citations are critical. Check them. Deep Research occasionally misattributes or draws inferences that go beyond what the source actually says. The report is excellent for orientation; primary sources remain primary.

Used this way — as a 20-minute research process that would otherwise take hours — Deep Research is one of the highest-leverage features Claude has.
`,
  },

  // ── 6. Extended Thinking guide ────────────────────────────────────────────
  {
    termSlug: 'extended-thinking',
    slug: 'extended-thinking-practical',
    angle: 'process',
    title: 'When to use Extended Thinking — and when not to',
    excerpt: 'Extended Thinking gives Claude time to reason through hard problems before answering. Here is what it is actually good for, and what it adds over standard Claude.',
    readTime: 5,
    cluster: 'Foundation Models & LLMs',
    body: `[Extended Thinking](/glossary/extended-thinking) is Claude's mode for working through complex problems step by step before responding. In standard mode, Claude reads your message and produces a response. In Extended Thinking mode, Claude reasons through the problem — exploring approaches, checking its logic, considering edge cases — before writing the final answer.

The tradeoff is simple: Extended Thinking takes longer and uses more tokens. In exchange, it produces better reasoning on problems that actually require it.

## What Extended Thinking improves

**Multi-step reasoning problems.** When getting from question to answer requires holding multiple pieces of logic in sequence — mathematical proofs, legal analysis, complex planning problems, code architecture — Extended Thinking produces more reliable answers. Standard Claude can handle simpler versions of these, but longer chains of reasoning are where it tends to drop threads.

**Problems with many valid approaches.** When the question has multiple plausible answers and you want Claude to evaluate them against each other before committing — strategic decisions, architectural choices, competing interpretations — Extended Thinking gives Claude time to work through the options rather than defaulting to the first plausible one.

**Tasks where systematic coverage matters.** Reviewing a contract for risk, auditing a plan for gaps, checking an argument for logical flaws — tasks where missing something has a cost. Extended Thinking gives Claude time to be more thorough.

**Hard coding and technical problems.** Complex algorithms, debugging non-obvious issues, designing systems with multiple interacting components. This is where Extended Thinking's benefits are clearest to most users.

## What Extended Thinking does not improve

**Simple questions.** If the answer does not require reasoning — factual recall, basic summarisation, straightforward writing tasks — Extended Thinking adds time and cost without improving quality. Use standard Claude for 90% of tasks.

**Creative tasks.** Writing, brainstorming, ideation — Extended Thinking can make Claude more systematic but often makes it less fluent and creative. The reasoning process is a constraint as much as a capability for open-ended creative work.

**Tasks where speed matters more than depth.** Customer support drafts, quick Q&A, anything where responsiveness is part of the value. Use standard Claude.

## How to activate it

In Claude.ai, Extended Thinking is available in certain plans and can be toggled per conversation. Look for the "Extended" or "Think" option in the interface. For API users, it is available as a parameter in the messages API.

Not every plan includes Extended Thinking — check your plan's feature set. It is available on Pro and above.

## A practical test

If you are not sure whether Extended Thinking is right for your task, run it both ways: once with Extended Thinking, once without. Compare the outputs. For tasks that genuinely benefit, the difference will be obvious — more thorough reasoning, fewer gaps. For tasks that don't, you'll get similar results and can save the additional processing time.

The general rule: if you would want a smart person to think carefully before answering rather than answering immediately, Extended Thinking is probably the right mode. If you want a quick, fluent response, standard Claude is better.

## Extended Thinking and [Adaptive Thinking](/glossary/adaptive-thinking)

Adaptive Thinking is the automatic version — Claude decides when to think deeply based on the complexity of the question, without you having to specify. Extended Thinking is the explicit version — you tell Claude to think carefully regardless of how complex it judges the question to be.

For most users, Adaptive Thinking is sufficient. Extended Thinking is for when you have a specific hard problem and want to be sure Claude is giving it full attention.
`,
  },

]

async function seed() {
  console.log('Seeding batch 12...\n')

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
