/**
 * Seed articles into Supabase.
 * Run with: npx tsx scripts/seed-articles.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
 * If you hit RLS errors, disable RLS on the articles table in the Supabase dashboard
 * or add your service role key as SUPABASE_SERVICE_ROLE_KEY and swap it in below.
 */

import { createClient } from '@supabase/supabase-js'
// tsx auto-loads .env.local, no dotenv needed

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ─── Article content ──────────────────────────────────────────────────────────

const ARTICLES: {
  termName: string
  slug: string
  angle: string
  title: string
  excerpt: string
  readTime: number
  tier: number
  body: string
}[] = [

  // ── 1. Context Window ────────────────────────────────────────────────────
  {
    termName: 'Context Window',
    slug: 'context-window-def',
    angle: 'def',
    title: 'The whiteboard every AI conversation shares',
    excerpt: 'Context window is the single number that shapes everything about how Claude thinks with you — and most people are using only a fraction of it.',
    readTime: 5,
    tier: 1,
    body: `
Think of a context window like a whiteboard.

Every time you start a conversation with Claude, a blank whiteboard appears. Everything goes on that whiteboard — your instructions, the documents you share, the questions you ask, Claude's answers, the follow-ups. When the whiteboard fills up, the oldest things get erased to make room for new ones.

The context window is the size of that whiteboard. Measured in **tokens** (roughly ¾ of a word each), it determines how much Claude can hold in mind at once during a conversation.

## Why this matters more than most people realize

Most AI assistants have historically had small whiteboards — 4,000 to 8,000 tokens. Enough for a back-and-forth conversation, not much more.

Claude's context window changes the game. Claude 3.5 Sonnet supports **200,000 tokens** — roughly 150,000 words. That's an entire novel. Or a company's full legal documentation. Or six months of customer support tickets. All available to Claude at once, without losing the thread.

This isn't just a bigger number. It's a different kind of tool.

With a small context window, you have to be strategic about what you tell the model. You summarize, compress, select. With 200K tokens, you can often just *give Claude everything* and let it find what matters.

## What fits in 200,000 tokens

To make this concrete:

- A full product specification document: fits easily
- An entire codebase for a small app: fits
- All your customer interviews from a discovery sprint: fits
- A year of email threads with a key partner: fits
- The complete works of Shakespeare: fits, with room to spare

## How Claude handles the whiteboard

When Claude reads a long document inside its context window, it doesn't skim. It processes the full text. This means Claude can answer questions about page 147 with the same accuracy as page 3 — as long as both are in the window.

What Claude *can't* do is remember anything from a previous conversation. When you start a new chat, the whiteboard is wiped clean. This is where **memory systems** and **RAG** come in — ways to give Claude access to information that lives outside the current window.

## The practical move

Most people use Claude like a search engine — quick questions, short exchanges. The context window makes a different workflow possible: **load everything once, ask many things**.

If you're analyzing a contract, paste the whole contract. If you're onboarding Claude into a project, dump all the relevant docs up front. If you're debugging a system, share the full logs. Claude will handle it.

The whiteboard is big. Use it.
    `.trim(),
  },

  // ── 2. System Prompt ─────────────────────────────────────────────────────
  {
    termName: 'System Prompt',
    slug: 'system-prompt-def',
    angle: 'def',
    title: 'How to brief Claude before the conversation starts',
    excerpt: 'The system prompt is where you stop asking Claude to be general-purpose and start making it yours. Most operators underuse it.',
    readTime: 4,
    tier: 1,
    body: `
Imagine hiring a brilliant contractor. On their first day, you have two choices: throw them in cold and let them figure it out, or spend 20 minutes briefing them on who you are, what matters to your company, what your customers need, and how you want them to communicate.

The system prompt is that briefing.

It's a block of text that sits above the user conversation — invisible to your users, but read by Claude before every single message. Whatever you put there shapes how Claude behaves for the entire session.

## What goes in a system prompt

A system prompt can contain anything Claude should know or do consistently:

**Identity and role.** "You are a support assistant for Acme Finance. You help users understand their account activity and guide them through common tasks."

**Tone and format.** "Keep responses concise. Use plain language. Avoid financial jargon unless the user uses it first."

**Constraints.** "Only discuss topics related to our product. If someone asks about competitors, acknowledge the question and redirect."

**Background knowledge.** "Here is our refund policy: [paste full policy]. Apply this when users ask about returns or cancellations."

**Output structure.** "When recommending an action, always list it as a numbered step."

## Why this matters

Without a system prompt, Claude is a generalist — capable of almost anything, optimized for nothing in particular.

With a well-crafted system prompt, Claude becomes a specialist. The same underlying model, shaped to fit your exact use case. It won't wander off-topic. It will speak in your company's voice. It will apply your business logic without you having to re-explain it in every conversation.

This is how every serious Claude deployment works. The system prompt is the product.

## Claude reads system prompts carefully

Claude treats the system prompt differently from user messages. It carries more weight. If your system prompt says to respond only in Spanish, Claude will do that even if the user writes in English. If your system prompt defines specific behavior, it holds.

A few things that make system prompts work especially well with Claude:

**XML tags help Claude organize instructions.** If your prompt has multiple sections, wrapping them in tags like \`<instructions>\`, \`<context>\`, and \`<format>\` makes it easier for Claude to locate and apply the right piece.

**Concrete beats abstract.** "Be helpful" does less work than "When a user asks a question you can't answer, tell them what you *can* help with instead."

**Examples are worth paragraphs.** Show Claude one ideal response and you've communicated more than a full page of instructions.

## The iteration loop

System prompts aren't set-and-forget. The best ones get built through testing — write a draft, run it against the questions your users actually ask, notice where Claude misses the mark, adjust.

Think of your system prompt as a living document. As your product evolves, your briefing should too.
    `.trim(),
  },

  // ── 3. Constitutional AI ─────────────────────────────────────────────────
  {
    termName: 'Constitutional AI',
    slug: 'constitutional-ai-def',
    angle: 'def',
    title: 'Why Claude has values instead of just rules',
    excerpt: 'Most AI safety is a list of don\'ts. Constitutional AI is the method Anthropic used to teach Claude to reason about right and wrong — the same way you\'d want a thoughtful colleague to.',
    readTime: 5,
    tier: 2,
    body: `
There are two ways to teach someone to behave well.

The first way: give them a rulebook. "Don't do X. Don't say Y. If Z happens, do W." This works until they encounter a situation the rulebook didn't anticipate — and then they're lost, or they find a loophole, or they apply the rule so rigidly they miss the point.

The second way: teach them *why* the rules exist. Help them understand the values behind the rules so they can reason their way through new situations, even ones nobody wrote a rule for.

Constitutional AI is Anthropic's approach to the second method. It's the training technique that gave Claude something closer to judgment than a filter.

## How it works

The "constitution" in Constitutional AI is a set of principles — plain-language statements about what it means to be helpful, honest, and harmless. Things like: avoid content that could be used to harm people, respect human autonomy, be honest even when the truth is uncomfortable.

During training, Claude was asked to evaluate its own outputs against these principles. Not just "does this break a rule" — but "does this response reflect good values? Would a thoughtful person reading this think it was the right thing to say?"

This self-critique loop runs thousands of times, across a huge variety of situations. The result is a model that has internalized a sense of what good judgment looks like, not just memorized a list of forbidden phrases.

## Why this is different

Most AI safety systems work by pattern matching. They detect certain words or request types and block them. This creates two problems:

**Overcorrection.** Legitimate requests get blocked because they superficially resemble harmful ones. You've probably seen this — asking a model about medication interactions for a safety guide, and getting refused because the words triggered a filter.

**Undercorrection.** Bad actors learn to phrase things differently to get around the filter. The pattern gets bypassed.

Constitutional AI sidesteps both problems because the model is reasoning about intent and impact, not just pattern-matching on words. Claude can engage with difficult topics in appropriate contexts while still exercising judgment about genuine harm.

## What this means when you build with Claude

In practice, Constitutional AI is why Claude behaves differently from models trained only on human approval ratings (which tend to optimize for "sounds good" rather than "is good").

Claude will push back on requests it finds problematic — not because a rule fires, but because it's made a judgment call. It will also engage with genuinely difficult topics in contexts where that's the right thing to do.

This creates a more collaborative dynamic. You can discuss why Claude responded a certain way. You can provide context that changes the assessment. Claude's position isn't a hard wall — it's a considered view that can update with new information.

## The honest trade-off

Constitutional AI doesn't make Claude perfect. No training method does. Claude makes mistakes, misjudges context, and occasionally refuses things it shouldn't.

But it does make Claude's safety behavior more like principled judgment and less like a brittle filter. For anyone building applications where edge cases matter — which is everyone — that's a meaningful difference.
    `.trim(),
  },

  // ── 4. AI Agent ──────────────────────────────────────────────────────────
  {
    termName: 'AI Agent',
    slug: 'ai-agent-def',
    angle: 'def',
    title: 'When Claude stops answering and starts doing',
    excerpt: 'There\'s a clean line between a model that responds to questions and one that takes actions in the world. Understanding that line is the most important thing you need to know about building with AI right now.',
    readTime: 5,
    tier: 1,
    body: `
Every AI interaction you've had so far probably looks like this: you type something, the model responds, you read the response and decide what to do next. The model talks. You act.

An AI agent flips this. The model doesn't just respond — it plans, executes, checks its own work, and keeps going until the task is done.

Think of the difference between asking a colleague "what should I do about this customer complaint?" versus handing them the complaint and saying "handle it." The first is a conversation. The second is delegation.

That's the shift from language model to agent.

## What makes something an agent

An AI agent has three things a basic chatbot doesn't:

**Tools.** The ability to take actions beyond generating text — searching the web, reading files, writing code, calling APIs, sending messages, querying databases. Tools are how an agent reaches beyond the conversation into the world.

**A goal, not just a prompt.** Instead of responding to a single input, an agent is working toward an outcome. "Summarize this document" is a prompt. "Research our three main competitors and produce a comparison report with sources" is an agent task.

**A loop.** The agent takes an action, observes what happened, decides what to do next, and repeats. This loop continues until the task is complete — or the agent determines it's stuck and asks for help.

## How Claude approaches agentic tasks

Claude is designed to be careful with this kind of power. When operating as an agent, Claude:

**Prefers reversible actions.** If Claude can read a file or copy it before editing, it will. The goal is to minimize hard-to-undo mistakes.

**Checks in when uncertain.** Rather than forge ahead when a decision point is ambiguous, Claude will pause and ask. This is configurable — you can tell Claude to be more autonomous or more conservative depending on the stakes.

**Maintains a minimal footprint.** Claude doesn't request permissions it doesn't need, doesn't retain data beyond the task, and doesn't take side actions outside the stated goal.

These behaviors come from Anthropic's approach to **safe agentic AI** — the intuition that an agent with good judgment should act like a contractor who asks before drilling into a wall, not one who assumes.

## The practical shape of agentic Claude

In real deployments, Claude-as-agent usually looks like one of these patterns:

**Single-agent with tools.** Claude has access to a set of tools (web search, code execution, file system) and works through a task autonomously. Good for well-defined workflows.

**Orchestrator + subagents.** A top-level Claude instance breaks a complex task into pieces and assigns them to specialized sub-instances. The orchestrator synthesizes the results. Good for tasks that benefit from parallelism.

**Human-in-the-loop.** Claude handles everything it can autonomously and surfaces decision points that require human judgment. The human approves or redirects, Claude continues.

## The thing most people miss

The shift to agents isn't just technical — it changes the relationship between you and the AI. You're no longer reading every output before anything happens. That means the quality of your instructions, the quality of your tools, and your error-handling strategy matter a lot more than they did when Claude was just answering questions.

The upside: tasks that used to take hours of back-and-forth can be delegated completely. The skill that unlocks this is learning to write goals, not prompts.
    `.trim(),
  },

  // ── 5. RAG ───────────────────────────────────────────────────────────────
  {
    termName: 'RAG',
    slug: 'rag-def',
    angle: 'def',
    title: 'How to give Claude a memory it doesn\'t have by default',
    excerpt: 'RAG is the most practical technique in AI engineering — and the most misnamed. It\'s not magic. It\'s just giving the model the right pages of the book before it answers.',
    readTime: 5,
    tier: 1,
    body: `
Imagine you asked a brilliant friend a question about your company's internal processes. Your friend is smart, but they've never worked at your company. They don't know your procedures, your product, your customers, or your history.

Now imagine you handed them the relevant page from your internal wiki before asking. Suddenly, they can give you a specific, accurate, useful answer — not a generic one.

That's RAG. Retrieval-Augmented Generation. The name sounds technical. The idea is simple.

## The problem it solves

Claude — like all language models — was trained on a fixed dataset with a knowledge cutoff. It knows a lot about the world up to that point, but it doesn't know:

- Your company's internal documents
- Your product's current pricing
- What happened last week
- Anything proprietary or private

RAG is the standard solution. Instead of trying to train the model on your data (expensive, slow, not always possible), you retrieve relevant information at query time and include it in the context window. Claude reads it, reasons over it, answers based on it.

Fresh, specific, accurate — without retraining.

## How it works in practice

A RAG system has two parts:

**1. The knowledge base.** Your documents, chunked into smaller pieces (paragraphs, sections, pages) and stored in a vector database — a type of database that understands semantic similarity, not just keyword matching.

**2. The retrieval step.** When a user asks a question, the system converts that question into a vector, finds the most semantically similar chunks in the database, and pulls them out.

Those chunks get assembled into a prompt — "Here is relevant context: [retrieved chunks]. Now answer this question: [user question]" — and sent to Claude.

Claude reads the context, reasons over it, and answers. The user gets a response grounded in your actual data, with citations if you want them.

## Why Claude is particularly good at this

RAG quality depends on two things: the retrieval (finding the right chunks) and the reasoning (doing something useful with them). Most improvement happens at the reasoning layer, and that's where Claude shines.

Claude's **200,000 token context window** means you can retrieve generously — 20 chunks instead of 3 — without worrying about fitting everything in. More context means fewer situations where the right answer was in chunk 4 but you only retrieved 3.

Claude also handles **conflicting or incomplete information** in retrieved context well. Rather than hallucinating a confident answer when the context is ambiguous, Claude tends to surface the uncertainty explicitly. For enterprise applications where accuracy matters, this is worth a lot.

## The one thing people get wrong

RAG gets blamed for retrieval failures that are actually document quality failures.

If your internal docs are inconsistent, outdated, or poorly written, retrieval will find the wrong chunks — not because the system is broken, but because the signal in your documents is weak. The best RAG improvement you can make is often editing the source material, not tweaking the retrieval parameters.

Clean docs → good retrieval → good answers. Garbage in, garbage out.

## When to use it

RAG is the right tool when:

- You have a body of knowledge Claude wasn't trained on
- Your information changes frequently (RAG updates instantly; retraining doesn't)
- You need Claude to cite specific sources
- You're building a product that needs to stay current with your data

If the information Claude needs is already in its training data — general knowledge, coding, writing — RAG adds complexity without much benefit. Use it when you have something specific to say.
    `.trim(),
  },

]

// ─── Seed script ─────────────────────────────────────────────────────────────

async function seed() {
  console.log('Fetching terms from Supabase...')

  const termNames = ARTICLES.map(a => a.termName)
  const { data: terms, error: termsError } = await supabase
    .from('terms')
    .select('id, slug, name, cluster')
    .in('name', termNames)

  if (termsError) {
    console.error('Error fetching terms:', termsError)
    process.exit(1)
  }

  console.log(`Found ${terms?.length ?? 0} / ${termNames.length} terms`)

  const termMap = Object.fromEntries((terms ?? []).map(t => [t.name, t]))

  const rows = []
  for (const a of ARTICLES) {
    const term = termMap[a.termName]
    if (!term) {
      console.warn(`⚠️  Term not found: "${a.termName}" — skipping`)
      continue
    }

    rows.push({
      slug: a.slug,
      term_id: term.id,
      term_name: term.name,
      term_slug: term.slug,
      cluster: term.cluster,
      title: a.title,
      angle: a.angle,
      body: a.body,
      excerpt: a.excerpt,
      read_time: a.readTime,
      tier: a.tier,
      published: true,
    })
  }

  console.log(`Inserting ${rows.length} articles...`)

  const { data, error } = await supabase
    .from('articles')
    .upsert(rows, { onConflict: 'slug' })
    .select('slug, title')

  if (error) {
    console.error('Insert error:', error)
    console.log('\nIf you see an RLS error:')
    console.log('  1. Go to Supabase dashboard → Table Editor → articles')
    console.log('  2. Disable Row Level Security for the articles table')
    console.log('  3. OR add SUPABASE_SERVICE_ROLE_KEY to .env.local and re-run')
    process.exit(1)
  }

  console.log('\n✓ Articles seeded:')
  data?.forEach(a => console.log(`  - ${a.slug}: ${a.title}`))
}

seed().catch(console.error)
