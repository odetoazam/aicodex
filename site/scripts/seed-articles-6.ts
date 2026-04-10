/**
 * Batch 6 — dept head path articles + more operator content
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-6.ts
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

  // ── 1. Context window — role ─────────────────────────────────────────────
  {
    termSlug: 'context-window',
    slug: 'context-window-role',
    angle: 'role',
    title: 'How to think about Claude\'s context window (and when it actually matters)',
    excerpt: '200,000 tokens sounds enormous. In practice, how you use that space changes everything about the quality of your outputs.',
    readTime: 4,
    cluster: 'Foundation Models & LLMs',
    body: `Claude's [context window](/glossary/context-window) — currently 200,000 tokens for Claude 3.7 Sonnet, roughly 150,000 words — is large enough that most people never hit the limit. But "won't run out of space" and "using the space well" are different things.

Here's how to actually think about it.

## The whiteboard metaphor

The context window is like a whiteboard Claude can see during a conversation. Everything on the whiteboard — your instructions, the conversation so far, documents you've pasted in, Claude's previous responses — is available to Claude while it's answering.

When the whiteboard fills up, old content gets erased from the top. Claude doesn't have a separate long-term memory. The whiteboard is all there is.

This has two practical implications.

## Long conversations drift

In a long back-and-forth, the instructions you gave at the start start to feel further away. Not because Claude "forgets" them exactly, but because there's now a lot of other content competing for attention in the same space.

If you notice that Claude's behaviour starts to drift across a long conversation — becoming less precise, reverting to generic patterns — this is often why. Solutions: start a fresh conversation with your key instructions repeated, or use [Projects](/glossary/claude-projects) to keep instructions persistent and separate from the conversation itself.

## Large documents need care

If you paste a 50-page document and then ask Claude questions about it, Claude has the whole document. But the quality of answers depends on how clearly the relevant section stands out from the noise.

For documents with lots of sections, consider telling Claude where to look: "Focus on the section titled 'Pricing' when answering this question." This isn't a workaround — it's good practice. You wouldn't give a colleague a 50-page document and ask them a question without pointing them to the right page.

## When the context window actually matters for operators

Two scenarios where the context window becomes a real consideration:

**Building with the API.** If you're running Claude in a product where context accumulates across many turns, you need to think about context management — when to summarise, when to reset, what to keep. This is a technical design decision.

**Very long analysis tasks.** Asking Claude to read and synthesise a whole book, a full year of customer feedback, or a large codebase — these tasks benefit from thinking about how you structure the input, not just dumping everything in at once.

For most conversational use, the context window is something you can ignore. When it becomes relevant, these are the patterns to know.
`,
  },

  // ── 2. Prompt caching — process ──────────────────────────────────────────
  {
    termSlug: 'prompt-caching',
    slug: 'prompt-caching-role',
    angle: 'role',
    title: 'Prompt caching: why it matters when you\'re building with Claude at scale',
    excerpt: 'If your application sends the same long system prompt on every request, you\'re paying to re-process it every time. Prompt caching stops that.',
    readTime: 4,
    cluster: 'Tools & Ecosystem',
    body: `[Prompt caching](/glossary/prompt-caching) is a feature that most people deploying Claude in products should know about — but it mostly matters at scale, not for casual use.

Here's the honest version of what it does and when it's worth caring about.

## What it actually does

When you make an API call to Claude, you typically send a system prompt, some context, and the user's message. If your system prompt is long — detailed instructions, a large knowledge base, company documentation — Claude has to process all of that on every single request.

[Prompt caching](/glossary/prompt-caching) lets you save a portion of that context server-side. The first request processes everything and caches the expensive part. Subsequent requests reference the cache instead of re-processing it. The result: faster responses and lower costs on those cached tokens.

## When this matters

If you're building a product where:
- Every API call includes the same large system prompt (common)
- You're passing the same long document as context on many requests
- You're running a lot of requests per day

...then prompt caching can make a real difference to both latency and cost.

The official numbers from Anthropic: cache reads are 90% cheaper than standard input tokens and come back significantly faster.

## When it doesn't matter

For direct use of Claude.ai (the web app) — it's not something you configure. For infrequent API use, or short system prompts, the savings aren't worth the added complexity.

## The operator question

If you're deploying Claude in a product and you've noticed API costs are significant, or latency is a problem for users, prompt caching is one of the first things to look at. It's a relatively straightforward implementation and the economics are good.

If you're not at that stage yet — early pilot, small team, low volume — file this away for later. It's not a feature you need on day one.
`,
  },

  // ── 3. Hallucination — role (decision guide) ─────────────────────────────
  {
    termSlug: 'hallucination',
    slug: 'hallucination-failure',
    angle: 'failure',
    title: 'The hallucination patterns that catch operators off guard',
    excerpt: 'Everyone knows AI can make things up. What surprises people is which specific situations trigger it — and how confident Claude sounds when it does.',
    readTime: 5,
    cluster: 'Foundation Models & LLMs',
    body: `Every operator knows that AI can [hallucinate](/glossary/hallucination) — state false things confidently. What catches people off guard isn't the existence of the problem but the specific patterns it takes.

Here are the ones worth knowing.

## The confident citation

You ask Claude for research on a topic and ask it to cite its sources. Claude provides citations with journal names, author names, publication years, and volume numbers. They look completely real.

Sometimes they are. Sometimes they aren't — Claude has constructed something plausible-sounding that doesn't actually exist. The problem is that real and fabricated citations look identical in the output.

**Pattern:** Happens most often with obscure topics, academic literature, or anything where the real sources are sparse. Claude fills the gap with what a real citation would look like.

**Fix:** Never use citations Claude generates without independently verifying they exist. For research tasks, ask Claude to reason and analyse — don't ask it to source.

## The product feature that doesn't exist

Your team asks Claude to help write sales copy or documentation for a competitor's product, based on their website. Claude produces accurate-sounding feature descriptions — including some that the competitor doesn't actually offer.

**Pattern:** Claude knows the product category well, knows what features typically exist, and fills gaps in its knowledge with plausible ones.

**Fix:** For factual claims about specific products, services, or organisations, ground Claude in primary sources. Paste the actual website content in. Don't ask Claude to summarise from memory.

## The confident wrong number

Claude does a calculation or provides statistics and gets them slightly wrong — rounding errors, transposed digits, or numbers that are close but not accurate.

**Pattern:** More common with mental arithmetic than with specific, widely-reported statistics. Claude is trained on text, not computation. It's approximating rather than calculating.

**Fix:** For anything where the exact number matters, use code execution ([Skills](/glossary/skill)) to have Claude run the calculation rather than state it. Or verify independently.

## The outdated fact stated as current

Claude says something is true — a company's CEO, a regulation's status, a product's pricing — and it was true when Claude was trained but has since changed.

**Pattern:** Claude's training data has a cutoff. Anything time-sensitive is potentially stale.

**Fix:** Enable web search for any task involving current information. Treat all facts that could have changed in the last year as needing verification.

## The common thread

What makes these patterns dangerous isn't that Claude is wrong — it's that Claude sounds equally confident whether it's right or wrong. There's no hedging on fabricated citations, no asterisk on outdated facts.

The mental model to build: Claude is good at reasoning and analysis; it's unreliable as a source of facts it can't verify in context. Give it the facts; ask it to reason about them.
`,
  },

  // ── 4. System prompt — role ──────────────────────────────────────────────
  {
    termSlug: 'system-prompt',
    slug: 'system-prompt-role',
    angle: 'role',
    title: 'Writing a system prompt that actually works',
    excerpt: 'The system prompt is the highest-leverage thing you control when deploying Claude. Most are either too vague or too long. Here\'s what good looks like.',
    readTime: 6,
    cluster: 'Tools & Ecosystem',
    body: `The [system prompt](/glossary/system-prompt) is the invisible set of instructions that shapes every conversation your users have with Claude. Get it right and Claude is consistently useful, on-brand, and appropriate. Get it wrong and you'll spend months troubleshooting outputs that never quite work.

Most system prompts have one of two problems: they're too vague to change Claude's behaviour meaningfully, or they're so long that Claude starts ignoring parts of them. Here's how to write one that actually works.

## What a system prompt can and can't do

A system prompt can:
- Define Claude's role and persona
- Set the context Claude is operating in (your product, your users, their goals)
- Establish output format preferences (length, structure, tone)
- Tell Claude what to focus on and what to avoid
- Give Claude specific information it needs (your product's features, your company's policies)

A system prompt can't:
- Guarantee Claude will never deviate from instructions
- Override Claude's core values and safety behaviours
- Make Claude competent at things it's not competent at
- Substitute for giving Claude the actual information it needs at query time

This last point matters. A system prompt that says "always provide accurate product information" does nothing useful unless Claude actually has the product information available — either in the system prompt itself or connected via [Connectors](/glossary/connector) or [RAG](/glossary/rag).

## The structure that works

Start with context, not rules.

Before you tell Claude what to do, tell it where it is and who it's talking to. "You are a customer support assistant for Acme Inc. Acme makes project management software for construction teams. The people you're talking to are project managers and site supervisors, typically non-technical users who need quick, practical answers."

That three-sentence context does more work than ten bullet points of rules. Claude now has a frame for every decision it makes.

Then: persona and tone. How should Claude sound? Not adjectives ("professional, friendly, clear") — specifics. "Write like a knowledgeable colleague, not a formal customer service rep. Use short sentences. Avoid filler phrases like 'Great question!' Match the user's energy."

Then: what Claude should do. The specific tasks it's there to handle.

Then: what Claude should not do. Keep this short — a long list of prohibitions often produces overly cautious behaviour. Cover the important cases, not every edge case you can imagine.

Finally: format guidance. "Keep responses under 150 words unless the user asks for more detail. Use bullet points for lists of more than three items. Don't use markdown headers."

## Common mistakes

**Writing rules instead of context.** "Always be helpful" is a rule. "Users are typically frustrated by the time they contact support — acknowledge that before solving" is context. Context produces better behaviour.

**Being vague about format.** "Respond appropriately" means nothing. "Keep responses to 2-3 paragraphs, always end with a question that moves the conversation forward" means something specific.

**Not testing it.** Write ten representative queries. Run them through Claude with the system prompt. Read the outputs as if you're a user, not a developer. Fix what feels off. Repeat.

**Setting it and forgetting it.** Your product changes, your users' questions change, edge cases emerge. Treat the system prompt as a living document, not a one-time configuration.

## The sign of a good system prompt

Claude produces outputs that feel like they came from the same assistant, regardless of who wrote the query or what they asked. Consistency is the goal. If your system prompt produces wildly different results depending on how the question is phrased, it needs more work.
`,
  },

  // ── 5. Adaptive thinking — def/process ───────────────────────────────────
  {
    termSlug: 'adaptive-thinking',
    slug: 'adaptive-thinking-def',
    angle: 'def',
    title: 'Adaptive thinking: how Claude decides how hard to think',
    excerpt: 'Claude doesn\'t apply the same effort to every question. Here\'s what adaptive thinking is, how it works, and why it matters for the outputs you get.',
    readTime: 3,
    cluster: 'Foundation Models & LLMs',
    body: `When you ask Claude a simple question — "What's the capital of France?" — it answers immediately. When you ask it something complex — "What are the second-order effects of raising our enterprise pricing by 20%?" — it should take more care. And it does, automatically.

That's [adaptive thinking](/glossary/adaptive-thinking): Claude's ability to calibrate how much reasoning effort to apply based on what the question actually requires.

## How it works

Claude assesses the complexity and ambiguity of each request and adjusts its internal process accordingly. Simple, factual questions get direct answers. Nuanced, multi-part, or high-stakes questions get more deliberate internal processing before a response is generated.

You don't configure this — it happens automatically. It's different from [extended thinking](/glossary/extended-thinking), which is a specific feature you explicitly enable for tasks that require maximum reasoning depth. Adaptive thinking is the background process that's always running.

## Why it matters in practice

Two things to understand:

**The quality floor is higher than it used to be.** Early language models applied roughly the same process to everything, which meant complex questions often got shallow treatment. Adaptive thinking means Claude is more likely to give appropriately careful answers to questions that need them — without you having to explicitly ask for more effort.

**Complex questions still benefit from explicit framing.** Adaptive thinking doesn't mean Claude always knows what a question requires. A question like "Should we expand into the European market?" looks like a business strategy question but might need very different treatment depending on your company's stage, resources, and risk tolerance. Giving Claude more context — "We're a 30-person SaaS company, €2M ARR, currently UK-only" — helps it calibrate more accurately.

Think of adaptive thinking as the default setting that gets you most of the way there. Clear context and good prompting take you the rest of the way.
`,
  },

  // ── 6. RAG — failure ─────────────────────────────────────────────────────
  {
    termSlug: 'rag',
    slug: 'rag-failure',
    angle: 'failure',
    title: 'Why RAG implementations fail (and how to avoid the most common mistakes)',
    excerpt: 'RAG is one of the most powerful things you can build with Claude. It\'s also where a lot of teams get stuck. Here are the failure patterns worth knowing before you start.',
    readTime: 5,
    cluster: 'Tools & Ecosystem',
    body: `[RAG](/glossary/rag) — connecting Claude to your documents and data so it can answer questions grounded in real information — is genuinely transformative when it works. But the path from "let's build a RAG system" to "this reliably works in production" has some consistent failure points.

Here are the ones worth knowing before you start.

## Failure 1: Retrieval brings back the wrong chunks

RAG works by splitting your documents into chunks, converting them into numerical vectors, and retrieving the chunks most similar to the user's question. The problem: "most similar" in vector space and "most relevant to answer this question" aren't always the same thing.

A user asks "What's our returns policy for international orders?" Your returns policy document has a section on international returns — but also a section on domestic returns, shipping terms, and exception cases. The retrieval system might surface all of those, or none of the right one.

**Fix:** Invest in the quality of your chunking strategy. Chunks should be semantically coherent — a complete thought, not a paragraph cut in the middle of a sentence. Test your retrieval system separately from your generation system. If what's coming back isn't right, better prompts won't help.

## Failure 2: The documents are outdated or inconsistent

If your knowledge base contains both an old pricing doc and a new one, Claude might synthesise them into something that reflects neither accurately. RAG retrieves; it doesn't curate.

**Fix:** Treat your document corpus like a product. Someone owns it. Documents have owners, review dates, and a deprecation process. "Add documents to the RAG system and never look at them again" produces confidently wrong answers about anything that's changed.

## Failure 3: Claude doesn't know what it doesn't know

Standard RAG: user asks question, system retrieves documents, Claude answers. The failure mode: the right document isn't in your corpus, so nothing relevant gets retrieved, and Claude answers from its general training data instead — without telling you that's what it's doing.

**Fix:** Instruct Claude explicitly to say when it doesn't have the relevant information in its provided context. "If the answer isn't in the documents provided, say so clearly. Don't answer from general knowledge." This is one of the most important instructions to include in a RAG system prompt.

## Failure 4: Too much context, not enough signal

Retrieving more documents isn't always better. If your retrieval returns ten chunks and only one is actually relevant, Claude has to find the signal in the noise. On easy questions this works. On hard ones, the irrelevant context can actively mislead.

**Fix:** Quality of retrieval over quantity. Better to retrieve three highly relevant chunks than ten loosely related ones. Tune your similarity threshold rather than increasing the number of results.

## The honest framing

RAG done well is one of the most valuable things you can build. RAG done quickly often looks impressive in demos and breaks in production. The investment is in the data pipeline, the retrieval quality, and the ongoing maintenance — not just the LLM integration.

If you're scoping a RAG project, budget time for document curation, retrieval testing, and iteration. Those are where the real work is.
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
