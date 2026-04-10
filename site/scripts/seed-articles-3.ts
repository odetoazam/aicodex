/**
 * Third batch of articles — Claude-specific and strategic content.
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-3.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ARTICLES = [

  // ── Temperature (def) ────────────────────────────────────────────────────
  {
    termName: 'Temperature',
    slug: 'temperature-def',
    angle: 'def',
    title: "The dial between predictable and creative",
    excerpt: "Temperature controls how much Claude surprises you. Turn it down for consistent, focused answers. Turn it up for more varied, exploratory ones. Knowing when to do each is a real skill.",
    readTime: 4,
    tier: 1,
    body: `Temperature is one of the most misunderstood settings in AI. People assume higher is better for creative tasks and lower is better for factual ones. The reality is more nuanced — and getting it right changes the quality of your outputs significantly.

## The basic idea

When Claude generates text, each next token is chosen based on a probability distribution. Some tokens are far more likely than others given the context. Temperature controls how much that distribution gets "spread out" or "sharpened."

**Low temperature (closer to 0):** The highest-probability tokens become even more dominant. Claude almost always picks the most likely next word. Responses are consistent, predictable, and focused.

**High temperature (closer to 1 and beyond):** The distribution flattens. Lower-probability tokens get more chances. Claude is more likely to take an unexpected path.

Think of it like this: low temperature is Claude playing it safe, choosing the most obvious next word at each step. High temperature is Claude willing to take a detour, pick a less expected word, and see where it leads.

## What this looks like in practice

Ask Claude to summarize a document at temperature 0.1 and temperature 0.9. The summaries will be similar in content but noticeably different in character.

At 0.1: tight, structured, hitting the expected beats in a predictable order.

At 0.9: still accurate, but with different choices about what to emphasize, different sentence structures, maybe an unexpected observation or framing.

Neither is wrong. One is more useful for consistent outputs; the other for generative exploration.

## When to go low

Use lower temperature when:

- You need consistent outputs across many runs (summaries, classifications, extractions)
- You're building a product where users expect predictable behavior
- The task has a clear "right answer" and you want Claude to converge on it
- You're running automated pipelines where variance is a problem

A temperature around 0.2–0.4 gives you focused, reliable responses without the rigidity of 0.

## When to go higher

Use higher temperature when:

- You're brainstorming and want diverse options, not just the obvious ones
- You're generating creative content where variety is the point
- You're exploring a problem space and want Claude to surface unexpected angles
- You're running multiple passes and picking the best output

A temperature around 0.7–0.9 gives you genuine variety. Above 1.0, outputs can start to feel random or incoherent for most tasks.

## The practical default

For most Claude applications, a temperature of around 0.5–0.7 is a reasonable starting point. It's creative enough to produce varied, natural-sounding text without being so variable that outputs become unpredictable.

The real skill is matching temperature to task. Extraction and classification: low. Summarization and Q&A: medium. Brainstorming and ideation: high. And if you're building a product: test different settings against your actual use cases, because the right answer varies more than you'd expect.`,
  },

  // ── Fine-tuning (def) ────────────────────────────────────────────────────
  {
    termName: 'Fine-tuning',
    slug: 'fine-tuning-def',
    angle: 'def',
    title: "When a well-crafted prompt isn't enough",
    excerpt: "Fine-tuning is how you train a model on your specific data to change its behavior at a deeper level than prompting can reach. It's powerful — and often unnecessary. Knowing which situation you're in saves a lot of time.",
    readTime: 5,
    tier: 2,
    body: `Most Claude applications never need fine-tuning. A good system prompt, well-structured context, and maybe some few-shot examples will get you 90% of the way to what you want.

But there's a class of problems where prompting hits a ceiling — and fine-tuning is the answer. Understanding the difference is how you avoid a lot of wasted effort in both directions.

## What fine-tuning actually does

Fine-tuning continues the training process on a new, curated dataset. Instead of training from scratch on the broad internet, you train on examples that demonstrate exactly the behavior you want.

This is different from prompting in a fundamental way. Prompting shapes what Claude does with a specific input at inference time. Fine-tuning changes the weights — the underlying parameters — so that the desired behavior is baked in rather than instructed.

The result is a model that has genuinely learned a new pattern, not one that's been told how to behave.

## When prompting is enough

Before reaching for fine-tuning, it's worth being honest about whether you've fully exhausted prompting approaches:

- Have you written detailed, specific instructions with examples?
- Have you included several few-shot examples in your system prompt?
- Have you tested different phrasings and structures?
- Have you tried decomposing the task into clearer steps?

For most use cases — content generation, Q&A, summarization, extraction, classification — a well-crafted prompt with examples will match fine-tuned performance. Prompting is faster, cheaper, and easier to iterate on.

## When fine-tuning earns its cost

Fine-tuning pays off when:

**You need consistent style that prompting can't hold.** If your brand voice is highly specific — particular cadence, vocabulary choices, structural patterns — and you need it perfectly consistent across thousands of outputs, fine-tuning learns the style in a way prompting approximates.

**You have a narrow, high-volume task.** If you're running the same extraction or classification task millions of times, a fine-tuned model is faster and cheaper per inference than a large model with a long system prompt.

**You need to compress a long prompt.** Complex instructions take tokens. A fine-tuned model can learn behaviors that would otherwise require hundreds of tokens of prompting, which matters at scale.

**You have labeled data and a clear ground truth.** Fine-tuning without good training data makes things worse, not better. If you have a clean dataset of input-output pairs that represent exactly what you want, you have the raw material for effective fine-tuning.

## What fine-tuning can't do

Fine-tuning doesn't add new knowledge. It shapes behavior. If you want the model to know about your company's products, your processes, or your customers, that's a job for RAG — not fine-tuning. Trying to bake knowledge into a fine-tuned model is inefficient and the knowledge gets stale.

Fine-tuning also doesn't fix fundamental model limitations. If Claude makes reasoning errors on a class of problems, fine-tuning on more examples of that problem type may help marginally, but it won't change the underlying capability.

## The practical path

If you're unsure whether you need fine-tuning, start with prompting. Build a good eval set. Measure where you're falling short. Only move to fine-tuning when you have clear evidence that prompting is the bottleneck — not a theory that it might be.

The pattern you'll often find: prompting with good examples gets you close. Fine-tuning gets you the last mile. Both are worth having in your toolkit, but prompting almost always comes first.`,
  },

  // ── Tokens (def) ─────────────────────────────────────────────────────────
  {
    termName: 'Token',
    slug: 'token-def',
    angle: 'def',
    title: "The unit everything in AI is priced and measured in",
    excerpt: "Tokens are how language models read and write text — and how every AI API charges you. Understanding them turns abstract pricing into something you can predict and control.",
    readTime: 4,
    tier: 1,
    body: `If you've ever wondered why AI APIs charge by "tokens" instead of words or characters, this is the explanation.

## What a token is

A token is a chunk of text — somewhere between a character and a word. It's the atomic unit that language models work with.

English text breaks down roughly like this:

- Common short words are usually one token: "the," "is," "a," "in"
- Longer words often split into two or more tokens: "token" is one token, "tokenization" might be two or three
- Punctuation, spaces, and special characters each take tokens
- Numbers are chunked in various ways

The rule of thumb: **one token is about ¾ of a word**, or roughly 4 characters. So 1,000 tokens ≈ 750 words, and a typical page of text is around 500–600 tokens.

## Why models use tokens instead of words

Words are inconsistent. "Run" and "running" are related but different strings. "Unbelievable" is one word but contains recognizable sub-units. "New York" is two words but often functions as one concept.

Tokens let the model work at a level that captures meaningful sub-units without being arbitrarily split at spaces. The tokenizer — the system that converts text to tokens before feeding it to the model — is trained to find cuts that preserve semantic meaning.

## How this affects you as a builder

**Pricing.** Every AI API, including Anthropic's, charges per token — for input (what you send) and output (what Claude generates). Understanding token counts lets you estimate and control costs before they surprise you.

**Context window limits.** Claude's 200,000-token context window means 200,000 tokens of combined input and output. That's roughly 150,000 words — a lot, but finite. Long documents, conversation history, and system prompts all count toward this limit.

**Performance.** Fewer input tokens means faster responses and lower latency. Verbose prompts cost more and process more slowly than concise ones.

## The practical implications

A few things worth knowing for everyday use:

Code uses more tokens than prose. Programming languages have many special characters and unusual patterns that tokenize inefficiently.

Non-English text often uses more tokens per "word" than English. Languages with complex morphology or non-Latin scripts can require significantly more tokens to express the same content.

Whitespace and formatting add up. Excessive newlines, indentation, and markdown syntax all consume tokens. Clean, tight formatting uses context window more efficiently.

## How to estimate your usage

For rough estimates: take your word count, multiply by 1.3, and that's approximately your token count. For precise counts before making API calls, Anthropic provides a tokenizer tool — or you can use the count_tokens endpoint to get exact figures before committing to a request.

Understanding tokens turns the abstract "AI cost" into something predictable. Once you can estimate token counts reliably, you can design applications that are efficient by default rather than expensive by accident.`,
  },

  // ── Alignment (def) ──────────────────────────────────────────────────────
  {
    termName: 'Alignment',
    slug: 'alignment-def',
    angle: 'def',
    title: "The problem of making AI do what you actually mean",
    excerpt: "Alignment is the core challenge of AI development: building systems that reliably do what humans intend. It's harder than it sounds, and understanding why helps you build better applications today.",
    readTime: 5,
    tier: 2,
    body: `You ask a system to maximize a metric. It does. You didn't realize there were ways to maximize that metric that you'd find completely unacceptable. The system finds them.

This is alignment failure in its simplest form. Not malice. Not error. A system doing exactly what it was told — in a way that violates the spirit of what you wanted.

The challenge of alignment is the challenge of specifying what you actually mean well enough that a powerful AI system does the right thing — not just the technically correct thing.

## Why it's harder than it looks

Human goals are hard to specify precisely. When you tell someone "make this report better," you're relying on a massive amount of shared context about what "better" means — clarity, accuracy, appropriate length, right tone, nothing misleading. A person understands all that implicitly. An AI system needs all of it made explicit.

At small scales and low stakes, imprecise specification usually just produces suboptimal results. The system does something technically correct but misses the point, and you correct it.

At larger scales and higher stakes — autonomous systems making consequential decisions without human review — getting the specification wrong matters a lot more.

## Alignment at the model level vs. the application level

There are two places alignment shows up in practice:

**Model-level alignment** is what Anthropic works on. It's the training process that shapes Claude's values and dispositions — using techniques like Constitutional AI and RLHF to make Claude helpful, honest, and careful about harm across a huge range of situations. The goal is a model that generalizes to new situations in ways humans would endorse, not just a model that performs well on its training examples.

**Application-level alignment** is what you work on. It's ensuring that Claude, in your specific context, does what your users need — not just what they literally asked for, but what they actually want. Clear system prompts, well-designed tools, good eval sets, and thoughtful UX are all alignment work.

Both matter. A well-aligned model can still be misconfigured at the application level in ways that produce bad outcomes.

## What alignment looks like in Claude specifically

Anthropic is unusually transparent about their alignment approach. A few things that shape how Claude behaves:

**Claude has a character, not just instructions.** Claude's helpfulness, curiosity, and care about honesty aren't just prompted behaviors — they're trained dispositions that persist across contexts. This makes Claude more consistent and harder to manipulate out of its values.

**Claude can refuse, and the refusal is reasoned.** When Claude declines to do something, it's because it's made a judgment about potential harm — not because a filter fired. You can often provide context that changes the outcome, which you can't do with a rule-based system.

**Claude aims for the spirit, not the letter.** If your system prompt leaves gaps, Claude tries to fill them in ways you'd endorse, not ways that technically comply while undermining your intent.

## Why this matters for builders

Understanding alignment helps you build applications that work with Claude's design rather than against it.

Claude isn't trying to do the minimum specified — it's trying to actually help. That means being explicit about what you want produces better results than assuming Claude will infer it. It also means that if Claude is doing something unexpected, it's often worth asking why: Claude's reasoning is usually articulable, and understanding it is the first step to fixing it.

The deeper point: alignment is an ongoing problem, not a solved one. The best applications treat it as a design constraint — building in human oversight, making Claude's reasoning visible, designing for graceful failure — rather than assuming it's handled.`,
  },

  // ── Streaming (def) ──────────────────────────────────────────────────────
  {
    termName: 'Streaming',
    slug: 'streaming-def',
    angle: 'def',
    title: "Why Claude starts talking before it's finished thinking",
    excerpt: "Streaming sends Claude's response token by token as it's generated, instead of waiting until the full response is ready. The difference in perceived speed is significant — and the implementation is simpler than you'd expect.",
    readTime: 3,
    tier: 2,
    body: `When you chat with Claude at claude.ai, you see the response appear word by word, as if Claude is typing in real time. This isn't animation — it's streaming. Claude is actually sending you the response token by token as it generates each one.

The alternative is waiting for the complete response before displaying anything. For a short reply, the difference is barely noticeable. For a long, thoughtful response — which might take 10–30 seconds to generate fully — the difference between streaming and waiting is enormous.

## Why it matters for user experience

Humans are impatient in a specific way: we can tolerate ongoing activity much better than we can tolerate apparent inactivity.

A loading spinner for 15 seconds feels like a long wait. Text appearing progressively for 15 seconds feels like the AI is thinking and responding — which it is. The objective time is identical; the experience is completely different.

Streaming also lets users start reading before the response is complete. For a long analysis or a multi-step explanation, a user can be processing the first paragraphs while Claude is generating the last ones. The effective time-to-understanding drops significantly.

## How it works

When you enable streaming in the Anthropic API, the response comes back as a stream of Server-Sent Events (SSE) — a standard web protocol for sending data from server to client over an open connection.

Each event contains a small piece of the response — typically a few tokens. Your client receives and displays these incrementally. The connection stays open until Claude sends a final "done" event.

The implementation in most frameworks is straightforward: Anthropic's SDK handles the SSE protocol and gives you a simple interface to iterate over response chunks as they arrive.

## When not to stream

Streaming is the right default for user-facing interfaces. But there are cases where you want the complete response before doing anything with it:

**Automated pipelines.** If Claude's output is an input to another process, you usually need the complete response before processing. Streaming adds complexity without benefit.

**JSON and structured output.** If you're expecting a JSON object, you need the complete response to parse it. Partial JSON isn't valid JSON. Wait for the full response.

**Short responses.** For single-sentence or single-word responses, the latency difference is negligible. Keep it simple.

## The latency numbers

Streaming doesn't make Claude generate faster — the total time to produce a full response is the same. What it changes is **time to first token**: how long the user waits before seeing anything.

Time to first token with Claude is typically under a second for most requests. This is fast enough that the experience feels responsive even when the complete response takes much longer.

For any Claude product where users are waiting for responses, streaming is one of the simplest ways to make the experience feel significantly better. It's usually two or three lines of code to enable, and the UX improvement is immediate.`,
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
