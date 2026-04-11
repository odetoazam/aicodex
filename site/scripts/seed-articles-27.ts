/**
 * Batch 27 — Common mistakes content
 * High-SEO, high-value articles targeting "claude not working" type queries.
 * Honest, practical, written for people who are already using Claude and hitting walls.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-27.ts
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

  // ── 1. The most common Claude mistakes ────────────────────────────────────
  {
    termSlug: 'prompt',
    slug: 'claude-common-mistakes',
    angle: 'failure',
    title: 'The most common Claude mistakes — and how to fix each one',
    excerpt: 'Most people using Claude are leaving a lot of value on the table — not because of the tool, but because of a handful of fixable habits. Here are the patterns that consistently underperform, and what to do instead.',
    readTime: 9,
    cluster: 'Prompt Engineering',
    audience: ['all'],
    body: `Most people who feel underwhelmed by Claude are not hitting a capability ceiling — they are hitting a prompting ceiling. The output is only as good as the input, and most people have a few specific habits that consistently produce mediocre results.

Here are the mistakes that come up again and again, and exactly what to change.

## Mistake 1: Being vague about what you want

The most common problem. "Help me with this email" or "make this better" tells Claude almost nothing about what good looks like in your situation.

**What happens:** Claude guesses. Sometimes it guesses right; often it produces something generic that technically answers the question but is not what you actually needed.

**The fix:** Be specific about the task, the audience, the format, and what "good" means.

Instead of: "Can you help me with this presentation?"

Try: "I'm presenting our Q3 results to the board next Tuesday. The audience is five executives who are skeptical about our AI investment. I need to reframe three missed targets as strategic pivots rather than failures. Review these slides and rewrite the framing on slides 4, 7, and 9. Keep each slide to two bullet points maximum."

The extra specificity takes 45 seconds to write. The output quality difference is significant.

## Mistake 2: Starting a new conversation every time

Every new Claude conversation starts from scratch. If you have been building context about a project over multiple chats — and each one begins with "so here's what we're working on" — you are wasting time and getting worse results than if Claude knew your full situation.

**What happens:** You spend the first third of every conversation re-explaining context. Claude's responses are calibrated to what it learned in that conversation, not the accumulated history of your project.

**The fix:** Use Projects. A Claude Project holds your documents, your team context, your style preferences, and your ongoing instructions. Every conversation inside that Project inherits everything you have set up. You never re-explain.

For things that are not project-level: keep a short "briefing document" — a few paragraphs of context you can paste at the start of any new conversation when you need it. Faster than re-explaining everything from scratch.

## Mistake 3: Accepting the first response without iterating

Most people treat a Claude response like a search result — they either use it or they do not, and if it is not right they move on. But Claude is a conversation, not a vending machine.

**What happens:** You get a 70% answer and stop there, when a few follow-up messages would get you to 95%.

**The fix:** Treat the first response as a draft to react to, not a final output. Common follow-ups that consistently improve results:

- "This is close. The second paragraph isn't quite right — make it more direct and cut the hedging."
- "Shorten this by 40%. Keep everything in the first and third sections."
- "The tone is too formal. Rewrite this like I'm talking to a colleague, not writing a report."
- "You missed the main point I was trying to make. The key argument is [X]. Rewrite around that."

You are the editor. Claude is the writer. Good editors do not accept first drafts.

## Mistake 4: Asking for too many things at once

"Write a blog post about our new product, summarize our Q3 metrics, draft a reply to this email, and suggest a title for the presentation" — this is one prompt asking for four separate outputs.

**What happens:** Claude attempts all of them, produces mediocre versions of each, and none gets the focus it deserves.

**The fix:** One task per prompt. If you have four things, run four separate prompts (in the same conversation or in sequence). Each task gets Claude's full attention.

The exception: tasks that genuinely benefit from being done together — like "draft this email and a subject line for it" — where the outputs are related and the context is shared.

## Mistake 5: Not giving Claude permission to push back

Claude tends toward agreement and helpfulness by default. If you ask it to review something you have written, it will often soften its feedback unless you explicitly tell it not to.

**What happens:** You get positive, gentle feedback on work that has real problems. Claude tells you it is "strong overall" and suggests minor tweaks. You miss the issues that actually matter.

**The fix:** Tell Claude explicitly what kind of feedback you want.

"Review this proposal critically. Tell me the three weakest arguments. Do not soften the feedback — I want to know what a skeptical reader would push back on."

"Act as a devil's advocate. Your job is to find every reason this plan could fail."

"What is wrong with this? Be direct. Do not compliment it first."

When you give Claude permission to be honest, it will be.

## Mistake 6: Using Claude for things it is bad at

Claude is not a reliable source for:
- Current facts, prices, statistics, or anything that changes over time
- Specific legal, medical, or financial advice for your situation
- Mathematical calculations (use a calculator — Claude makes arithmetic errors)
- Predicting specific future events

**What happens:** You get a confident-sounding answer that is wrong, and because it sounds right you do not check it.

**The fix:** Know the categories where Claude requires verification. Anything with a specific number, a current fact, or a real-world consequence should be checked against a primary source before you rely on it. Use Claude to think, structure, and draft — not to produce final facts.

## Mistake 7: Treating long documents as too big to share

"The document is 20 pages — I can't paste the whole thing." So you summarize it yourself and paste a summary, then ask Claude to help you work with your summary. You have already lost a layer of fidelity.

**What happens:** Claude works with a secondhand version of your document, which means it misses nuance, specific language, and context it could have caught from the original.

**The fix:** Paste the full document. Claude's context window is large — it can handle 100+ pages of text in a single conversation. For truly huge documents (a full codebase, a 500-page report), either paste the most relevant sections, or use the Google Drive Connector so Claude can access the file directly.

The default should be: give Claude the original, not your summary of it.

## Mistake 8: Not using a system prompt for recurring tasks

If you use Claude for the same type of task repeatedly — reviewing support tickets, drafting a specific type of email, analyzing deals — you are re-explaining the same context every time you start.

**What happens:** Inconsistent output, wasted time re-briefing, and Claude without the institutional context it needs to do the task well.

**The fix:** Set up a Project with a custom instruction for that use case. "You are reviewing customer support tickets for a SaaS company. Always respond in a warm but professional tone. Escalate tickets flagged as 'legal' or 'churn risk' with a [PRIORITY] tag. Use bullet points for suggested responses."

Now every conversation in that Project automatically starts with that context. You never re-explain.

## Mistake 9: Asking closed questions when open ones would work better

"Should I take this job offer?" is a closed question. Claude will answer yes or no, or hedge. You get a generic opinion.

"What questions should I be asking before deciding whether to take this job offer?" is an open question. You get a useful framework.

"What would a 10-year version of me regret more: taking it or turning it down, and why?" is an open question with a specific lens. You get genuine insight.

**What happens:** Closed questions get quick answers. Open questions get thinking.

**The fix:** Before asking Claude a yes/no or should-I question, ask yourself whether you actually want a recommendation or whether you want better thinking. Most of the time, you want better thinking. Ask for that.

## Mistake 10: Giving up after one bad response

If Claude gives you something unhelpful, most people close the conversation and assume the tool cannot do what they needed. The reality is that most failures are prompt failures, not capability failures.

**What happens:** You stop using Claude for things it is actually good at, because one vague prompt produced a vague result.

**The fix:** When a response misses, diagnose it rather than abandoning it.

Ask yourself:
- Did I give Claude enough context about what I wanted?
- Did I specify the audience, format, tone, or constraints?
- Was I asking for too many things at once?
- Did I give Claude a chance to try a different approach?

Then try again with the specific thing you think was missing. More often than not, the second or third attempt — after clarifying what you actually need — produces exactly what the first attempt seemed to prove impossible.

Claude's ceiling is higher than most people's experience of it suggests.`,
  },

  // ── 2. Hallucination prevention checklist ─────────────────────────────────
  {
    termSlug: 'hallucination',
    slug: 'claude-hallucination-prevention',
    angle: 'process',
    title: 'How to reduce Claude hallucinations: a practical checklist',
    excerpt: "Hallucination — Claude confidently stating something that isn't true — is the failure mode that kills trust fastest. Here's exactly how to minimize it in practice.",
    readTime: 7,
    cluster: 'Evaluation & Safety',
    audience: ['all'],
    body: `Hallucination is when Claude states something confidently that is not true — inventing a statistic, citing a source that does not exist, describing a product feature that was never real. It is the failure mode that erodes trust fastest, because the wrong answer sounds exactly like the right one.

You cannot eliminate hallucination entirely. But you can reduce it significantly with the right habits and design choices.

## Why Claude halluculates in the first place

Claude is a language model — it generates text that is likely to be true, not text that has been verified against reality. When it does not know something, it does not always say so. It produces what a plausible answer would look like, based on patterns in its training data.

Hallucination is more likely when:
- The question involves specific facts, numbers, dates, or names
- The topic is niche, recent, or not well-represented in training data
- The prompt implies a specific answer exists
- The model is asked to be comprehensive rather than honest about gaps

Understanding this makes the prevention strategies make sense.

## The checklist: before you prompt

**Provide the source material.** The most reliable way to reduce hallucination is to give Claude the information it needs rather than asking it to retrieve or infer it. Paste in the document, the data, the contract, the research paper. When Claude is working from what you give it — not from memory — accuracy goes up significantly.

**Ask for uncertainty explicitly.** Tell Claude it is okay to say it does not know. "If you are not confident about a specific fact, say so explicitly rather than guessing." Claude responds well to this instruction.

**Narrow the scope.** Instead of "tell me about the history of [company]," try "based on the following paragraph about [company], what are the key dates mentioned?" Specific questions constrained to a specific source are far less likely to produce hallucinated content.

**Avoid questions that beg a specific answer.** "What did the CEO of [company] say about layoffs last month?" implies that the CEO said something. If Claude does not know, it may manufacture a quote rather than disappoint you. Reframe: "Is there anything in the provided materials about [company's] recent layoffs?"

## During the conversation

**Ask Claude to cite its sources.** "For any specific facts, tell me where you got that information." Claude will either cite a real source or flag that it is drawing from general training data. Either way, you know what to verify.

**Ask the follow-up: "How confident are you in this?"** After a response with specific facts, ask Claude to rate its confidence and explain where the uncertainty lies. It is often honest when asked directly.

**Spot-check the surprising facts.** If Claude tells you something you did not know — a statistic, a date, a specific claim — verify it before using it. Not everything, but the things that will matter if wrong.

**Watch for telltale hallucination patterns:**
- Very specific numbers (89.3%, not "roughly 90%") without a source
- References to research papers or studies — check that they actually exist
- Quotes attributed to specific people
- Detailed biographical information about individuals
- Claims about current prices, policies, or recent events

## Design choices that reduce hallucination

**Use RAG (Retrieval-Augmented Generation) for anything knowledge-intensive.** If you are building an AI application that needs to answer questions about specific products, policies, or data, connect Claude to a real knowledge base rather than relying on its training data. When Claude retrieves information from your documents before answering, it is grounded in what you have verified.

**Ground Claude in the present conversation.** Include the relevant facts in your prompt. "Based on the following Q3 financial data: [data]" is more reliable than "summarize our Q3 performance" when Claude has not been given the data.

**Use structured prompts for high-stakes tasks.** When accuracy matters, structure the prompt to force verification. "For each claim you make, mark it as either (A) taken directly from the provided document or (B) your inference. Do not include any (B) claims I have not asked for inferences."

**Temperature matters for accuracy tasks.** At higher temperature settings, Claude is more creative — and more likely to produce fluent-but-wrong content. For factual tasks where accuracy matters more than creativity, lower temperature (closer to 0) produces more conservative, reliable outputs. Most consumer Claude interfaces handle this automatically; it is relevant if you are using the API.

## What to do when you catch a hallucination

Tell Claude. "This fact is incorrect — the actual figure is [X]. Why did you state otherwise?" Claude will typically acknowledge the error and recalibrate. It is also useful feedback for diagnosing where your prompt left too much room for fabrication.

Adjust the prompt for next time: more grounding, more explicit permission to express uncertainty, a narrower scope.

## The honest baseline

No set of techniques will reduce hallucination to zero. Claude is a language model, and language models are not fact-checking machines. The right mental model is not "how do I make Claude never get things wrong" but rather "for this specific task, what level of verification do I need to apply before I rely on the output?"

For brainstorming, drafting, and thinking through problems — the cost of occasional hallucination is low. For facts in a document you will share, a contract you will sign, or a decision you will make based on the output — verify.

The failure mode is not using Claude for things that need verification. The failure mode is not verifying things that need it.`,
  },

  // ── 3. Prompt debugging ────────────────────────────────────────────────────
  {
    termSlug: 'prompt-optimization',
    slug: 'claude-prompt-debugging',
    angle: 'process',
    title: "Your Claude prompt isn't working. Here's how to fix it.",
    excerpt: "Most prompt failures come from one of five fixable problems. Here's a diagnostic framework for figuring out what went wrong — and how to fix it without starting from scratch.",
    readTime: 6,
    cluster: 'Prompt Engineering',
    audience: ['all'],
    body: `When a Claude prompt produces a bad result, most people either try again with slightly different wording (and get a slightly different bad result) or give up and conclude that Claude cannot do the thing. Neither approach is efficient.

There is a better way: diagnose the specific problem before changing anything.

Almost every prompt failure falls into one of five categories. Identifying which one you are dealing with tells you exactly what to change.

## The five categories of prompt failure

### 1. The task is unclear

Claude does not know what you actually want. The prompt is vague enough that multiple reasonable interpretations exist, and Claude picked the wrong one.

**Signs this is your problem:**
- Claude's response is technically correct but not what you needed
- The output format is wrong (you wanted a list, Claude wrote paragraphs)
- The length is off (too long, too short, too detailed, not detailed enough)
- Claude interpreted the task differently than you intended

**The fix:** Add specificity. Name the output format, the length, the audience, and the constraints explicitly.

Before: "Write something about our new feature."

After: "Write a 150-word feature announcement for our product newsletter. The audience is existing customers who already use our core product. Focus on one key benefit — faster data import — and end with a link placeholder. No jargon."

---

### 2. Claude is missing context

Claude does not have information it needs to do the task well. It is making reasonable guesses about your situation, your audience, or your constraints — and guessing wrong.

**Signs this is your problem:**
- The response is generic and could have been written by anyone
- Claude got the tone wrong (too formal, too casual, too safe)
- Claude does not seem to understand your specific situation
- The content is accurate but not relevant to your actual use case

**The fix:** Tell Claude more about the situation. Who is the audience? What is the purpose? What has already happened? What constraints apply? The more Claude knows about your specific context, the less it has to guess.

A quick test: would a smart new employee, reading only your prompt, know exactly what you need? If not, they are missing context. Add it.

---

### 3. Claude is solving the wrong problem

You asked for X, but what you actually need is Y. This happens when you describe how you want something done rather than what you need to achieve.

**Signs this is your problem:**
- Claude does exactly what you asked for, but it does not solve your underlying problem
- You find yourself heavily editing the output to add the thing that was actually missing
- The response addresses the surface question but misses the real issue

**The fix:** Describe the goal, not the method. Instead of "write three options for this subject line," try "I need this email to get a 40% open rate from a list of people who have already ignored our last two messages. The subject line should create urgency without sounding desperate. Give me five options."

You are telling Claude what you need to achieve, not just what to produce.

---

### 4. Claude needs constraints it does not have

Claude is producing something that technically fits your description but is doing things you do not want — being too formal, too verbose, using buzzwords, generating content that does not match your brand, etc.

**Signs this is your problem:**
- The output is fine except for one persistent thing that keeps being wrong
- Claude keeps including something you do not want (caveats, bullet points, qualifications)
- The tone is off in a specific, repeatable way

**The fix:** Add explicit constraints. Instead of hoping Claude will intuit your preferences, state them directly.

"Do not use the word 'leverage.' Do not start with 'I.' Do not include qualifications like 'it's worth noting' or 'it's important to consider.' Keep each bullet to one line."

Negative constraints (what not to do) are often more effective than positive ones (what to do) for correcting persistent style problems.

---

### 5. The task is too big for one prompt

You are asking Claude to do too much in a single prompt. The output is unfocused because the prompt is unfocused.

**Signs this is your problem:**
- Claude gives you something that covers everything but does nothing well
- The response is a list of every possible point rather than the most important ones
- You wanted depth on one thing but got breadth across everything

**The fix:** Break the task into smaller pieces. Run them in sequence rather than in parallel.

Instead of: "Research our competitors, identify our differentiation, write positioning copy, and suggest a pricing strategy."

Run in order:
1. "Here are five competitors. Identify their key positioning claims."
2. "Based on those claims, what are the gaps they are not addressing?"
3. "Write three positioning statement options that target those gaps."
4. "For each option, suggest a pricing tier that supports it."

Each step produces something you can review before building on it.

---

## The debugging process

When a prompt does not work, run this in order:

1. **Read the output and name what is wrong.** Not "it is not right" — specifically: wrong format, wrong tone, missing context, too generic, wrong interpretation of the task.

2. **Match the problem to one of the five categories above.**

3. **Make one targeted change.** Not a complete rewrite — a specific adjustment to address the specific problem.

4. **Try again in the same conversation.** "That is not quite right — [specific issue]. Try again with [specific change]."

Most prompt problems require two or three iterations, not ten. The key is being specific about what went wrong rather than throwing a completely different prompt at it.

## The meta-skill

Getting good at prompting is mostly getting good at describing what you want clearly. The same skills that make you good at writing a brief, giving feedback, or explaining a problem to a colleague make you good at prompting.

The shortcut: before writing a prompt, write out in plain language exactly what you want Claude to do, who it is for, what format it should be in, and what the output will be used for. Then paste that as your prompt. It will not be perfect the first time — but you will know exactly what to adjust.`,
  },

]

async function run() {
  console.log('Seeding batch 27 — common mistakes content...')

  for (const a of ARTICLES) {
    const term = await getTermId(a.termSlug)
    if (!term) {
      console.error('  ✗ Term not found: ' + a.termSlug)
      continue
    }

    const { error } = await sb.from('articles').upsert({
      slug:       a.slug,
      title:      a.title,
      excerpt:    a.excerpt,
      body:       a.body,
      angle:      a.angle,
      cluster:    a.cluster,
      term_id:    term.id,
      term_name:  term.name,
      term_slug:  a.termSlug,
      read_time:  a.readTime,
      published:  true,
    }, { onConflict: 'slug' })

    if (error) {
      console.error('  ✗ ' + a.slug + ':', error.message)
    } else {
      console.log('  ✓ ' + a.slug)
    }
  }

  console.log('Done.')
}

run().catch(console.error)
