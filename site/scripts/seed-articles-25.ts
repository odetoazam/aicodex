/**
 * Batch 25 — Beginner foundations: simple language, plain steps
 * Articles that fill the "total beginner" gap in the semantic graph.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-25.ts
 *
 * NOTE: inline backticks in body strings are escaped as \` to avoid TS template literal issues.
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

  // ── 1. How to write a good prompt ──────────────────────────────────────────
  {
    termSlug: 'system-prompt',
    slug: 'how-to-write-a-good-prompt',
    angle: 'process',
    title: 'How to write a good prompt',
    excerpt: 'Most people get mediocre results from AI because they ask vague questions. Here is the simple framework for writing prompts that actually work — no technical knowledge required.',
    readTime: 6,
    cluster: 'Prompt Engineering',
    body: `Writing a good prompt is not a skill you need to study for months. It is mostly about being specific. Most AI outputs that feel unhelpful are the result of vague inputs — not a limitation of the tool.

This guide gives you a repeatable approach. After reading it, you will get noticeably better results from Claude starting today.

## The core idea: treat Claude like a smart new colleague

Imagine you have just hired a smart, capable person who is starting their first day. They do not know your company, your preferences, your context, or what good looks like for you. If you hand them a task with three words — "write the email" — they will produce something generic.

If you give them proper context — who this email is to, what you want them to feel after reading it, what to include and what to leave out, what format you want — they will produce something useful.

Claude works the same way.

## The five-part prompt framework

You do not need to use all five parts every time. But knowing them lets you diagnose why a response fell short.

**1. Role — who should Claude be?**

Telling Claude to act as a specific kind of person sharpens the tone and perspective of the response.

Examples:
- "You are a senior customer success manager who has handled hundreds of renewal conversations."
- "You are a direct, no-fluff editor who cuts anything that is not essential."
- "You are a first-year lawyer reviewing this contract for someone without a legal background."

You do not need to always include a role. But when you are getting responses that feel too generic, adding a role often fixes it.

**2. Context — what does Claude need to know?**

The more relevant context you share, the better. Do not make Claude guess at things you already know.

Include:
- Who the output is for (your audience)
- What the situation is
- What has already happened (if relevant)
- Any constraints, rules, or things to avoid

Example: Instead of "write a response to this complaint," try "write a response to this customer complaint. The customer bought a premium subscription last month and the discount they were promised was not applied. Tone should be warm and direct. We will apply the discount immediately — just confirm it and apologize without being overly apologetic."

**3. Task — what exactly should Claude do?**

Be specific about what you want. "Help me with this" is not a task. "Summarize this in three bullet points for a busy executive" is a task.

If the output needs a specific format, say so:
- "List this as numbered steps."
- "Keep the whole response under 150 words."
- "Use headers and short paragraphs."

**4. Examples — show Claude what good looks like**

If you have a sense of what the output should look like, show it. Even one example of the tone, length, or structure you want will improve the result significantly.

"Here is an example of the kind of email we usually send: [paste example]. Match this tone."

**5. Constraints — what should Claude avoid?**

It is often easier to say what you do not want than to describe perfection.

Common constraints:
- "Do not use bullet points."
- "Do not suggest anything that requires a legal team to approve."
- "Do not use the phrase 'leverage' or 'synergy.'"
- "Keep it short — two paragraphs maximum."

## A worked example

Before: "Write me an email to reschedule a meeting."

After: "Write a short email rescheduling a one-on-one with my manager. The original time was Tuesday at 2pm. I need to move it because I have a conflict with a client call that just came up. Suggest Thursday at the same time as an alternative. Tone should be professional but not overly formal. Two short paragraphs maximum."

The second prompt takes 30 more seconds to write. The output will be five times more useful.

## When to iterate rather than rewrite

If Claude gives you something that is 60% right, do not start over. Keep going:

- "Make the tone warmer."
- "Cut this down by half."
- "Add a section at the end with next steps."
- "The third paragraph isn't quite right — make it more direct."

You are having a conversation, not submitting a form. Each response carries context from everything before it.

## What good prompting is not

Good prompting is not about using magic words or memorizing templates. It is about communicating clearly — the same skill that makes you good at briefing a colleague, writing a good brief, or asking a useful question in a meeting.

If the output is not what you wanted, ask yourself: what did I leave out? Start there.`,
  },

  // ── 2. What AI can't do ─────────────────────────────────────────────────────
  {
    termSlug: 'hallucination',
    slug: 'what-ai-cant-do',
    angle: 'failure',
    title: 'What AI actually cannot do',
    excerpt: "Most AI disappointment comes from the wrong expectations — not the wrong tool. Here is a plain-English list of what Claude genuinely can't do, so you know what to trust and what to verify.",
    readTime: 5,
    cluster: 'Business Strategy & ROI',
    body: `Claude is useful enough that it is tempting to over-rely on it. It is also imperfect enough that over-relying on it will cost you. The most effective users of AI are not the most enthusiastic — they are the most accurate about where the limits are.

Here is a plain guide to what Claude genuinely cannot do.

## It cannot look anything up in real time

Unless you are using a tool that has given Claude access to the internet, it cannot check current prices, today's news, stock quotes, whether a website is live, or anything that has happened after its training cutoff.

If you ask it a question that requires current information, it will either tell you it does not know or — more dangerously — give you a confident answer based on outdated information.

**What to do:** For anything time-sensitive, use Claude to help you think through the question, but verify the facts yourself from a live source.

## It cannot remember your previous conversations

Each conversation with Claude starts fresh. It does not remember what you discussed last week, what preferences you have shared over time, or any context from a previous session.

**What to do:** Give Claude the relevant context at the start of each conversation. Many people keep a short "briefing document" they paste in when starting a new session.

## It cannot reliably produce accurate numbers

Claude is not a calculator, and it is not a fact database. It can produce numbers that look plausible but are wrong — especially estimates, statistics, and calculations. This is not always obvious because the wrong numbers are often stated confidently.

**What to do:** For any numbers that matter, verify independently. Use Claude to structure the analysis, not to produce the final figures.

## It can be wrong about recent events and real people

Claude knows a lot about the world up to its training cutoff — but less about recent events, and its knowledge of specific individuals (especially non-famous people) is limited. It can invent biographical details, confuse two people with similar names, or state outdated information about someone's current role.

**What to do:** Do not rely on Claude for factual claims about real people without verifying through a primary source.

## It cannot read files, emails, or documents unless you paste them in

Unless you are using a version of Claude connected to your files, it cannot access your emails, Google Docs, Notion pages, or any other application. It only knows what you tell it in the conversation.

**What to do:** Paste the relevant text directly into your message. For longer documents, paste the section that matters most and describe the rest.

## It cannot learn from your corrections (within a session)

If Claude gets something wrong and you correct it, it will adjust for the rest of that conversation — but not for future conversations. It does not update its underlying knowledge based on your feedback.

**What to do:** Expect to give context every session. Do not assume Claude has gotten "smarter" based on what you have told it before.

## It can be confidently wrong

This is the most important thing to understand. When Claude does not know something, it does not always say so. It may produce a fluent, confident, plausible-sounding response that is simply incorrect. This is called hallucination.

It is more likely to happen when:
- The question involves specific factual details (dates, names, statistics)
- The topic is niche or recent
- The question is phrased in a way that suggests a specific answer is expected

**What to do:** The higher the stakes of the output, the more you need to verify it. Use Claude for drafting, thinking, and structure — not as the final authority on facts.

## What this means practically

None of this means Claude is not useful. It means you should use it the way you would use a brilliant colleague who is new to the job: great at helping you think, drafting, structuring, and generating options — but you would not send their output directly to a client without reading it first.

The people who get the most out of AI are the ones who treat it as a capable first draft, not a finished product.`,
  },

  // ── 3. Claude for writing and editing ──────────────────────────────────────
  {
    termSlug: 'ai-augmentation',
    slug: 'claude-for-writing-and-editing',
    angle: 'role',
    title: 'Using Claude for writing and editing',
    excerpt: 'Claude is most useful for writing not as a ghostwriter, but as a collaborator. The right workflow produces output that sounds like you — and is better than what you would have written alone.',
    readTime: 7,
    cluster: 'Business Strategy & ROI',
    body: `Most people use Claude wrong for writing. They describe what they want and expect it to produce a finished piece. The result feels generic, loses their voice, and needs so much editing it barely saved time.

The better approach: use Claude as a thinking partner and first-draft engine, then edit into your own voice. This produces work that is genuinely better than what you would have written alone — while still sounding like you.

## Where Claude helps most

**First drafts when you are starting from nothing.** The blank page problem is real. A rough Claude draft gives you something to react to, which is far easier than generating from scratch. Even if you rewrite most of it, you have a structure and the key points laid out.

**Editing and tightening.** Paste in a draft and ask Claude to make it more direct, cut it by 30%, or fix the structure. It is surprisingly good at identifying where pieces are too wordy or where the argument is muddled.

**Matching a specific tone.** Give Claude an example of writing you like and ask it to write in that style. Or describe the tone: "write like a senior director briefing executives — direct, no unnecessary context."

**Adapting one piece into many formats.** Long-form article → LinkedIn post → email newsletter → slide deck summary. This is mechanical work. Claude handles it well once you have the source material.

**Research synthesis.** Paste in several sources and ask Claude to synthesize the key points into a coherent summary with your editorial framing. This is not plagiarism — you are using it to structure and organize information you sourced yourself.

## A workflow that actually works

Here is a pattern that produces good output consistently:

**Step 1: Brief Claude properly.**
Tell it: who the audience is, what you want them to think or do after reading, the format, the tone, and any constraints. The more context, the better the first draft.

**Step 2: Get a rough draft.**
Do not overthink the prompt. You are looking for raw material, not a finished piece. Even a mediocre first draft gives you structure to work with.

**Step 3: Edit into your voice.**
This is where your judgment matters. Cut what does not sound like you. Add your specific examples, opinions, and experiences. Claude cannot know what you know — only you can.

**Step 4: Use Claude for refinements.**
Paste in your revised draft and ask for specific improvements: "tighten the conclusion," "this paragraph is unclear — rewrite it," "does the structure make sense?"

**Step 5: Final read yourself.**
Always do a final read. Claude does not know your audience the way you do, and it can miss the one sentence that will land wrong with a specific reader.

## What to keep in your own voice

Claude is better than most people at producing grammatically clean, coherent text. But it does not know:

- Your specific examples and stories
- Your opinions and the reasoning behind them
- The precise tone of your relationship with your reader
- What your audience has already heard and does not need explained

These are what make writing interesting. Claude can structure and draft; you provide the substance.

## Practical prompts that work

For a first draft:
"Write a [type of piece] for [audience]. The main point is [your point]. Tone should be [description]. Length: [rough word count or format]. Here are the key things to include: [your list]."

For editing:
"Edit this for clarity and directness. Cut anything that is not essential. Keep my voice — do not make it sound more formal."

For tone matching:
"Here is an example of writing I like: [paste example]. Write [new piece] in this style."

For adapting:
"Turn this [long piece] into a [LinkedIn post / email / set of slides]. Keep the main argument. Match this length: [target]."

## The test for whether Claude improved your writing

The simplest test: does the final output sound like you at your best, or does it sound like something a committee wrote? If it sounds like you, the process worked. If it does not, you edited too little, or you asked Claude to do too much without enough context.

Writing that sounds like Claude — hedged, corporate, structured to a fault — is worse than writing that sounds a bit rough but genuine. Always edit toward your own voice.`,
  },

  // ── 4. Using Claude for research ──────────────────────────────────────────
  {
    termSlug: 'rag',
    slug: 'using-claude-for-research',
    angle: 'process',
    title: 'Using Claude for research',
    excerpt: "Claude is not a search engine, but it is a powerful research partner. The distinction matters. Here is how to use it effectively for research without being misled by confident-sounding errors.",
    readTime: 6,
    cluster: 'Retrieval & Knowledge',
    body: `Claude is not a search engine. It cannot browse the web, look things up in real time, or tell you what happened last week. Using it like a search engine will produce unreliable results, and the errors will be hard to catch because they sound authoritative.

Used correctly, Claude is a different kind of research tool — one that excels at synthesis, structure, and helping you think through what you already have.

## What Claude is actually good at for research

**Synthesizing documents you provide.** Paste in reports, transcripts, articles, or research papers and ask Claude to extract what matters. "What are the three main arguments in this report?" or "Summarize the key findings across these five articles." This is where Claude genuinely outperforms manual reading — it reads fast and identifies patterns across sources.

**Explaining complex topics in plain language.** If you do not understand something you have read, ask Claude to explain it. "Explain this section of the report as if I have no background in finance." It is patient, and it will find multiple angles until the explanation lands.

**Identifying what you do not know.** Describe a topic you are researching and ask Claude: "What are the important questions I should be trying to answer that I have not thought of yet?" This is useful for scoping research before you start.

**Structuring and outlining findings.** After you have gathered sources, Claude can help you structure the analysis. "Here are my notes from five interviews. Organize these into themes and highlight any contradictions."

**Generating search queries.** If you need to do your own searching, ask Claude to generate the best search queries for your topic, including terms you might not have thought of.

## What Claude is not reliable for

**Facts and statistics.** Claude will produce numbers and facts that sound right but may be wrong. It is not a reliable source for specific figures, dates, statistics, or claims about real people or organizations. Always verify factual claims through primary sources.

**Recent events.** Claude's knowledge has a cutoff date. Do not use it to research anything recent without verifying the information elsewhere.

**Legal, medical, or financial specifics.** Claude can explain concepts and help you understand a domain — but the specific advice for your specific situation requires a qualified professional. Use Claude to ask better questions of that professional, not to replace them.

## A practical research workflow

**Step 1: Gather your sources yourself.**
Use search engines, databases, and primary sources to find the raw material. Do not outsource this step to Claude — it cannot reliably produce current, accurate source material.

**Step 2: Paste sources into Claude for synthesis.**
Once you have your sources, use Claude to process them. "Here are three articles on [topic]. What are the main points of agreement and disagreement?"

**Step 3: Ask Claude to identify gaps.**
After synthesizing, ask: "Based on what I have shared, what important questions are still unanswered?" This surfaces what you still need to find.

**Step 4: Use Claude to structure your findings.**
Draft a summary or outline with Claude: "Here are my research notes. Organize these into a clear structure for a [brief / report / presentation]."

**Step 5: Verify before citing.**
Any specific fact, figure, or claim that Claude produces — even as part of synthesizing your own sources — should be verified before you use it in something you will share or publish.

## The document-based research workflow

If you have a large document — a report, a transcript, a contract — paste it directly into Claude and ask specific questions about it.

Useful prompts:
- "What are the top three risks identified in this report?"
- "Summarize the methodology section in plain language."
- "Does this contract contain any clauses that would restrict us from [specific action]?"
- "What does the author seem to be arguing in the third section? I did not follow it."

Claude will read the document carefully and answer your specific question. This is faster than reading the whole document yourself, and it is more reliable than asking about documents Claude has not seen.

## The single most important rule

Treat Claude as a research collaborator, not a source. It helps you think, structure, and synthesize — but the facts should always be verified through primary sources before you rely on them.

The researchers who get the most from Claude are the ones who do the sourcing themselves and use Claude to make sense of what they have found. The researchers who get burned are the ones who ask Claude to produce facts they then accept at face value.`,
  },

]

async function run() {
  console.log('Seeding batch 25 — beginner foundations...')

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
