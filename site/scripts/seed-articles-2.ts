/**
 * Second batch of articles.
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-2.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ARTICLES = [

  // ── Prompt Caching (process) ─────────────────────────────────────────────
  {
    termName: 'Prompt Caching',
    slug: 'prompt-caching-process',
    angle: 'process',
    title: "Pay for your context once, not every time",
    excerpt: "Prompt caching is Claude's way of remembering the expensive part of a conversation so you don't have to re-send — and re-pay for — the same context on every request.",
    readTime: 4,
    tier: 2,
    body: `Every time you send a message to Claude via the API, you pay for every token Claude processes — including your system prompt, your documents, and your conversation history. In a normal exchange, that's fine. But in applications where you're sending a large, fixed context with every request, the costs add up fast.

Prompt caching solves this. It lets Claude store a snapshot of your context on Anthropic's servers so it doesn't have to re-process the same tokens on every call.

## The problem it's solving

Imagine you're building a support bot. Your system prompt is 2,000 tokens of company context, product documentation, and behavioral instructions. Every user message triggers a new API call — and every API call includes those 2,000 tokens.

If you get 10,000 support messages a day, you're paying to process 20 million tokens of context that never changes. That's the problem.

## How it works

Prompt caching works through a specific marker you place in your API request. You tell Claude: "everything up to this point, cache it."

The first request still processes everything — Claude has to read it once. But subsequent requests that include the same cached prefix skip the re-processing step. Instead of computing the full context from scratch, Claude retrieves the cached state and continues from there.

The result: **cache hits cost about 10% of the original input price**. On repeated calls with the same large context, you'll typically see 60–90% cost reduction.

## What's worth caching

Not everything benefits equally. Prompt caching shines when you have:

**Large, stable system prompts.** If your instructions are thousands of tokens and rarely change, cache them.

**Reference documents.** Loading a legal document, a codebase, or a knowledge base with every request? Cache it. The content doesn't change between calls.

**Conversation history in long sessions.** As a conversation grows, earlier turns stay fixed. Cache the accumulated history and only process new messages fresh.

**Few-shot examples.** If you're including a set of example inputs and outputs to shape Claude's behavior, those examples are identical across requests — perfect for caching.

## The practical setup

In the Anthropic API, caching is controlled by adding "cache_control" parameters to specific content blocks. You mark the boundary after your stable content, and Claude handles the rest.

The cache persists for 5 minutes by default (with options for longer). It's tied to the specific content — if you change a single token in the cached prefix, the cache invalidates and you pay for a fresh read.

## A real example

A startup using Claude to analyze sales calls found their system prompt (500 tokens) plus their scoring rubric (3,000 tokens) were identical across every call. After implementing prompt caching:

- Cost per analysis dropped from $0.08 to $0.012
- Latency on cache hits dropped by ~40% (less computation)
- Monthly API bill: down 85%

The code change took about 20 minutes.

## When to reach for it

If you're building anything with Claude where the same large context appears in multiple requests, prompt caching should be one of the first optimizations you make. It's low-effort, high-impact, and requires no changes to how your application works — just how it formats API calls.`,
  },

  // ── Tool Use (def) ───────────────────────────────────────────────────────
  {
    termName: 'Tool Use',
    slug: 'tool-use-def',
    angle: 'def',
    title: "How Claude reaches beyond the conversation",
    excerpt: "Tool use is the mechanism that turns Claude from a text generator into something that can actually do things — search the web, run code, query your database, send messages.",
    readTime: 5,
    tier: 2,
    body: `A language model on its own is like a brilliant person locked in a room with no phone, no computer, and no way to check anything. They can reason, write, analyze, and explain — but only with what's already in their head.

Tool use opens the door.

When you give Claude tools, you're giving it the ability to take actions in the world and bring back results. It can look things up, run calculations, query databases, call APIs, read files. The conversation becomes a workspace, not just a chat.

## What a tool actually is

From Claude's perspective, a tool is a function it can choose to call. You define what the function does, what arguments it takes, and what it returns. Claude decides when to use it.

In practice, it looks like this:

1. You send Claude a message along with a list of available tools and their descriptions
2. Claude reads the request and decides whether a tool would help
3. If yes, Claude responds with a tool call — the function name and the arguments it wants to pass
4. Your code runs the function and sends the result back to Claude
5. Claude incorporates the result and continues

The key insight: **Claude doesn't run the tool itself.** It requests a tool call, you execute it, you return the result. This keeps you in control of what actually happens.

## Why this design matters

This split between "Claude decides what to call" and "your code runs it" is intentional and important.

It means Claude can use tools without having direct access to your infrastructure. It can ask to query your database without having database credentials. It can request a web search without having internet access baked in. Every tool call goes through your code, which means you can validate, log, rate-limit, or block any call before it executes.

For security-conscious applications, this is exactly the right architecture.

## How Claude thinks about tool use

Claude is trained to use tools thoughtfully. A few patterns you'll see in practice:

**It confirms before acting.** For tools with side effects (sending an email, modifying a record), Claude will often summarize what it's about to do and ask for confirmation if the stakes seem high.

**It chains tools intelligently.** Claude can use multiple tools in sequence — search for information, then use the result to query a database, then format the output. It builds a plan and executes it step by step.

**It handles errors gracefully.** If a tool returns an error or unexpected result, Claude incorporates that feedback and adjusts its approach rather than giving up or hallucinating a result.

## The tools worth building first

If you're adding tool use to a Claude application, the highest-leverage tools are usually:

**Search.** Access to current, specific information that Claude doesn't have in training. Can be web search, internal search, or vector search over your documents.

**Code execution.** Let Claude run the code it writes and see the output. This dramatically improves accuracy on anything computational.

**Data access.** A read-only interface to your databases or APIs. Claude can answer specific questions about your data without you having to translate every query manually.

**Write operations.** Creating records, sending messages, updating content. These need the most careful handling — scope them tightly and log everything.

## The practical effect

Tool use changes what Claude can be in your product. Without tools, Claude is an advisor. With tools, it's a capable colleague who can actually go check things, run calculations, and take actions — while keeping you in the loop at every step.`,
  },

  // ── Hallucination (def) ──────────────────────────────────────────────────
  {
    termName: 'Hallucination',
    slug: 'hallucination-def',
    angle: 'def',
    title: "Why AI gets confident things wrong — and how to design around it",
    excerpt: "Hallucination isn't a bug that gets patched. It's a structural feature of how language models work. Understanding why it happens is the first step to building applications that aren't derailed by it.",
    readTime: 5,
    tier: 1,
    body: `The word "hallucination" makes it sound like the AI is daydreaming or malfunctioning. It's more mundane than that — and more important to understand.

When a language model halluccinates, it generates text that sounds confident and coherent but is factually wrong. A citation that doesn't exist. A product feature that was never built. A legal precedent that was never set. The model isn't lying — it doesn't know it's wrong. It's doing exactly what it was trained to do: produce plausible-sounding text.

That's the core of it. Language models are trained to generate text that fits the pattern of what they've seen. When they don't know something, they don't produce an error message — they produce a best guess, formatted as confidently as everything else.

## Why it happens

Think of how a language model works at the mechanical level: it's predicting the next token based on everything that came before. It's not retrieving facts from a database. It's not looking things up. It's pattern-matching at massive scale.

When the pattern is strong — common facts, well-documented events, widely-discussed concepts — the prediction is usually right. When the pattern is weak — obscure details, recent events, niche topics, specific numbers — the model fills the gap with whatever fits the statistical shape of the context.

The result is a model that's excellent at things that are common and well-represented in training data, and unreliable at things that are rare, recent, or highly specific.

## What this looks like in practice

Hallucinations cluster in predictable places:

**Specific numbers and statistics.** Claude knows unemployment rates are typically expressed as percentages around single digits. When asked for a specific figure it doesn't know, it may generate a plausible-sounding one.

**Citations and sources.** Academic paper titles, URLs, author names — these follow patterns that are easy to generate but hard to verify. Never trust an AI-generated citation without checking it.

**Recent events.** The training data has a cutoff. Anything after that cutoff is unknown territory.

**Internal and proprietary information.** Your product's specs, your company's history, your customer data — Claude has no idea. When asked, it will try to help based on whatever patterns fit.

## How Claude handles it differently

Claude is specifically trained to express uncertainty rather than paper over it. When it doesn't know something, the goal is to say so clearly — "I'm not certain about this" or "you should verify this" — rather than generating a confident but wrong answer.

This is one of the things Constitutional AI improves: Claude's training includes explicit guidance that honesty about uncertainty is better than sounding confident. In practice, Claude hedges more than many models and declines to answer when it knows it's in shaky territory.

It still hallucinates. But it's more likely to flag when it might be wrong.

## Designing around it

The good news: hallucination is a design constraint, not a dealbreaker. Here's how to build applications that handle it well:

**Give Claude the information it needs.** If your application requires accurate, specific data, include that data in the context. Don't ask Claude to recall specific numbers — give it the numbers and ask it to reason about them.

**Use RAG for anything current or proprietary.** Retrieval-Augmented Generation retrieves the relevant facts before Claude responds. Claude reasons over what you give it, not what it vaguely remembers.

**Ask for reasoning, not just answers.** "What's the answer and how did you get there?" surfaces shaky reasoning. A confident wrong answer often collapses when Claude has to explain its logic.

**Design for verification.** For high-stakes outputs, build in a review step. AI-generated drafts are faster to produce than to check — but checking is still essential.

**Match the tool to the task.** Claude is excellent at synthesis, explanation, structuring, and analysis. For tasks that require precise factual recall, pair it with a retrieval system rather than relying on memory.

Hallucination is real. But it's predictable, and it's manageable. The developers who get the most out of Claude are the ones who design systems that give Claude what it needs to be right, rather than hoping it will be.`,
  },

  // ── Evals (def) ──────────────────────────────────────────────────────────
  {
    termName: 'Evals',
    slug: 'evals-def',
    angle: 'def',
    title: "How to know if your Claude integration is actually working",
    excerpt: "Evals are the testing framework for AI — and they work differently from software tests. You're not checking for correct answers. You're measuring behavior across a range of realistic situations.",
    readTime: 5,
    tier: 1,
    body: `In software engineering, testing is straightforward: you know what the correct output is, you check whether the code produces it. Pass or fail. Green or red.

AI evaluation doesn't work like this.

When you're testing a Claude integration, there often isn't a single correct answer. There's a range of good answers and a range of bad ones. Whether a response is "good" depends on context, tone, completeness, and whether it actually helps the user — judgments that can't always be reduced to a comparison against expected output.

That's what makes evals a discipline of their own.

## What evals actually are

An eval is a structured way to measure how well your AI system performs across a representative set of inputs.

The "representative" part matters. Your eval set should reflect the real distribution of what your users will actually ask — not just the easy cases, and not just the edge cases. A good eval set covers:

- Typical inputs (the 80% of requests that look normal)
- Tricky inputs (ambiguous questions, incomplete context, conflicting instructions)
- Edge cases (unusual requests, potential misuse, things the system should decline)
- Regression tests (specific failures you've encountered and fixed)

## How to score them

There are three main approaches to scoring evals, and most good evaluation systems use all three:

**Human review.** A person reads the output and rates it. High signal, high cost, doesn't scale. Good for building your initial scoring intuition and for calibrating automated methods.

**Reference-based scoring.** Compare the output against a known-good answer. Works well for tasks with clear correct answers: extraction, classification, structured output. Doesn't work for open-ended generation.

**LLM-as-judge.** Use a second Claude call to evaluate the output. Give it a rubric — "was this response helpful? accurate? appropriate in tone?" — and have it score the original response. This scales better than human review and handles nuance better than reference comparison. Claude is well-suited to this role.

## What to measure

The right metrics depend on your application, but most Claude integrations care about some combination of:

**Accuracy.** Is the information correct? For factual tasks, this is measurable. For open-ended tasks, it's fuzzy.

**Completeness.** Did the response address the full question? Missing information is a common failure mode.

**Format adherence.** If your system prompt specifies a response format, does Claude follow it? Evals can check this programmatically.

**Tone and persona.** Does the response sound the way your product should sound? This requires human or LLM-as-judge scoring.

**Safety and compliance.** Did Claude avoid outputs that violate your guidelines? This is critical for any consumer-facing application.

## The eval loop in practice

Evals aren't a one-time setup. They're a continuous feedback loop:

1. Build an initial eval set from real or realistic inputs
2. Run it against your current system prompt and configuration
3. Identify where the system underperforms
4. Make a change (update the system prompt, add context, adjust the temperature)
5. Re-run evals to verify the change improved things without breaking anything else
6. Add the new failure cases to your eval set before moving on

That last step is critical. Every bug you find is a new test case. Over time, your eval set becomes a comprehensive map of your system's behavior — and a safety net against regressions.

## Why this matters more for Claude than for traditional software

When you change traditional software, you know exactly what changed. When you update a system prompt, you've changed the behavior of every possible input simultaneously — in ways you can't fully predict.

Evals are how you regain visibility. They let you make changes with confidence: not "I think this is better" but "I ran 200 tests and the scores improved by 18%."

For any Claude integration you're serious about, evals aren't optional. They're the difference between deploying on hope and deploying on evidence.`,
  },

  // ── Large Language Model (def) ───────────────────────────────────────────
  {
    termName: 'Large Language Model',
    slug: 'large-language-model-def',
    angle: 'def',
    title: "The engine under everything",
    excerpt: "A large language model is what Claude is at its core — and understanding how it works changes how you think about everything else in AI.",
    readTime: 5,
    tier: 1,
    body: `Before you can understand RAG, agents, prompt engineering, or anything else in AI, you need a working mental model of what a large language model actually is.

Not the technical details — the intuition.

## The core idea

A large language model is a system trained to predict what text should come next, given the text that came before. That's it.

Trained on trillions of words — books, articles, code, conversations, documentation, the web — the model learned the patterns of language at a scale that's hard to comprehend. Not just grammar and syntax, but reasoning patterns, factual associations, argument structures, writing styles, domain knowledge.

The prediction task sounds humble. "Given these words, what comes next?" But at scale, with enough data and enough parameters, something remarkable emerges: a system that can answer questions, write code, analyze documents, translate languages, explain concepts, and reason through problems — all as a side effect of learning to predict text well.

## What "large" actually means

The "large" in large language model refers to the number of **parameters** — the numerical weights that get adjusted during training to capture patterns in the data.

Early language models had millions of parameters. GPT-2 had 1.5 billion. Claude, GPT-4, and their contemporaries are estimated to have hundreds of billions to over a trillion.

More parameters means more capacity to store patterns, make distinctions, and handle complex reasoning. But "large" is also relative — the trend is toward better performance at smaller sizes through improved training techniques. Today's smaller models often outperform yesterday's larger ones.

## How it generates a response

When you send Claude a message, here's roughly what happens:

1. Your text gets converted into **tokens** — chunks of characters, roughly ¾ of a word each
2. The model processes all the tokens in your context window simultaneously
3. For each position, it calculates a probability distribution over what token should come next
4. It samples from that distribution to produce the next token
5. That token gets appended, and the process repeats until the response is complete

This happens incredibly fast — generating thousands of tokens per second. But the underlying mechanism is the same for every word: predict what comes next, then predict what comes after that.

## Why this mental model matters

Understanding that Claude is fundamentally a next-token predictor changes how you interact with it.

**It explains why prompting works.** The tokens you provide are the context the model uses to predict what should come next. More relevant, well-structured context leads to better predictions. That's why clear prompts get better results.

**It explains hallucination.** When the model doesn't know something, it doesn't produce an error — it produces a plausible-looking continuation of the pattern. It's still doing next-token prediction, just with weaker signal.

**It explains why format matters.** If you ask for a bulleted list, Claude has seen millions of examples of bulleted lists in its training data and will generate text that continues that pattern. The format you specify shapes the prediction.

**It explains why Claude isn't a search engine.** Claude doesn't retrieve information — it generates text that's consistent with patterns in its training. For specific, current, or proprietary facts, you need to give it the information, not ask it to recall it.

## What Claude is on top of this

Claude is a large language model plus several layers of additional training.

After pre-training on the broad text corpus, Claude was further trained using **RLHF** (reinforcement learning from human feedback) and **Constitutional AI** — techniques that shaped its behavior to be helpful, honest, and careful about harm.

This post-training is what makes Claude feel different from a raw language model. It's why Claude follows instructions, maintains a consistent character, pushes back on harmful requests, and expresses uncertainty rather than confidently guessing. The underlying prediction engine is what makes it capable. The post-training is what makes it useful.`,
  },

]

async function main() {
  console.log('Fetching terms...')
  const termNames = ARTICLES.map(a => a.termName)
  const { data: terms, error: tErr } = await sb
    .from('terms')
    .select('id, slug, name, cluster')
    .in('name', termNames)

  if (tErr) { console.error(tErr.message); process.exit(1) }

  const termMap = Object.fromEntries((terms ?? []).map(t => [t.name, t]))
  console.log(`Matched ${Object.keys(termMap).length}/${termNames.length} terms`)

  const rows = ARTICLES.map(a => {
    const term = termMap[a.termName]
    if (!term) { console.warn(`  ⚠ not found: ${a.termName}`); return null }
    return {
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
    }
  }).filter(Boolean)

  const { data, error } = await sb
    .from('articles')
    .upsert(rows, { onConflict: 'slug' })
    .select('slug, title')

  if (error) { console.error(error.message); process.exit(1) }

  console.log(`\n✓ ${data?.length} articles seeded:`)
  data?.forEach(a => console.log(`  - ${a.slug}: ${a.title}`))
}

main().catch(e => { console.error(e); process.exit(1) })
