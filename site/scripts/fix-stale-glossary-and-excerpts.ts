/**
 * Tier 1 currency fix — batch 4: glossary terms and stale excerpts.
 *
 * The `terms` table drifted alongside the articles. Seven definitions still
 * describe a 200K context window, a "¾ of a word" token ratio that the Opus 4.7
 * tokenizer changed, extended thinking as a mode you toggle, and Claude 3-era
 * model IDs. Two article excerpts ("In brief" on the article page) also still
 * contradict bodies corrected in batches 1-3.
 *
 * Also fixes a pre-existing defect in why-claude-feels-inconsistent: the body
 * has four causes but the intro, the excerpt and the closing prompt all say five.
 *
 * Verified against docs on 2026-08-30:
 *   https://platform.claude.com/docs/en/about-claude/models/overview
 *   https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions
 *   https://platform.claude.com/docs/en/build-with-claude/thinking
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/fix-stale-glossary-and-excerpts.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const TERMS: Record<string, { definition: string; practical_example: string }> = {

  'token': {
    definition:
      'A token is the basic unit Claude uses to read and write text. On current models the ratio is a bit over half a word per token — Anthropic changed the tokenizer with Claude Opus 4.7, so a million tokens holds roughly 555,000 words. On models older than that, the ratio is about three-quarters of a word per token. Everything you send to Claude (your message, system prompt, uploaded documents) and everything Claude sends back counts as tokens. Tokens determine both your usage limits and your API costs.',
    practical_example:
      'You ask Claude a question that\'s 50 words. Claude responds with 200 words. That exchange is roughly 450 tokens on a current model. Your API bill reflects that usage. Long conversations, big documents and verbose system prompts all add tokens — and tokens are directly what you pay for. When the estimate is driving a budget rather than a guess, use the count_tokens endpoint instead of a ratio.',
  },

  'tokenization': {
    definition:
      'The step where AI breaks your text into small pieces — called tokens — before it can process anything. On current Claude models a token is a bit over half a word, following the tokenizer change introduced with Claude Opus 4.7; on older models it is about three-quarters of a word. This matters practically because API costs and usage limits are measured in tokens, not words or characters. The more text you send and receive, the more tokens you use.',
    practical_example:
      'Before Claude can process your message, it gets broken into tokens. Code tokenizes less efficiently than prose because of its punctuation and unusual patterns, and non-English text often needs more tokens per word than English. Practically: a 10,000-word document is roughly 18,000 tokens on a current model, which affects both cost and how much room is left in the context window.',
  },

  'context-window': {
    definition:
      "The context window is how much text Claude can hold in its attention at once — your conversation history, any documents you've shared, system instructions, and Claude's own responses. Once you hit the limit, older content gets pushed out. Claude Fable 5, Claude Opus 5 and Claude Sonnet 5 each have a 1,000,000-token context window, roughly 555,000 words; Claude Haiku 4.5 has 200,000. Long contexts let Claude analyse full document sets or maintain long conversations — but they also cost more on every turn, and can dilute Claude's focus on the material that actually matters.",
    practical_example:
      'You paste a 200-page document into Claude and it reads the whole thing, using a fraction of the window. You paste an entire document repository and you will eventually find the edge. The practical question stopped being "will it fit" and became "does including this help" — a smaller context holding the right material reliably beats a large one full of noise.',
  },

  'long-context': {
    definition:
      'Using a model\'s ability to process very large amounts of text in one go, instead of breaking it into chunks and searching. Claude Fable 5, Opus 5 and Sonnet 5 each handle up to 1,000,000 tokens — roughly 555,000 words — in a single context window. For many use cases (analysing a full legal contract, reading a codebase, processing a set of transcripts) it is simpler and more accurate to give Claude the whole thing than to build a search system around it.',
    practical_example:
      'You paste all 200 pages of a vendor contract into Claude and ask "what are the termination clauses and auto-renewal terms?" Claude holds the entire document in one session rather than chunking it and losing coherence. The tradeoff is cost: everything in the window is billed on every call, so for high-volume automated work, retrieval can still be cheaper than long context even when long context would work.',
  },

  'extended-thinking': {
    definition:
      'Extended thinking was the mode where you explicitly switched Claude into step-by-step reasoning and gave it a fixed token budget (`thinking: {type: "enabled", budget_tokens: N}`). It has been superseded. On Claude Opus 5, Claude Sonnet 5 and Claude Fable 5, thinking is on by default and adaptive — the model decides how deeply to reason — and the extended-thinking configuration is not accepted at all. Depth is now steered with the `effort` parameter. The older configuration still applies on models that support only extended thinking.',
    practical_example:
      'If you have code calling `thinking: {type: "enabled", budget_tokens: 10000}` against `claude-opus-5`, it will fail. Replace it with `output_config: {effort: "xhigh"}` for demanding agentic and coding work, or drop the parameter entirely to get the `high` default. To see the reasoning, which is hidden by default on current models, pass `thinking: {"type": "adaptive", "display": "summarized"}`.',
  },

  'adaptive-thinking': {
    definition:
      'Adaptive thinking is how Claude decides for itself how much reasoning to apply to a given request. Simple questions get fast, direct answers; complex or ambiguous ones trigger more deliberate reasoning first. It is the default on Claude Opus 5, Claude Sonnet 5 and Claude Fable 5, and available but off by default on Claude Opus 4.8, 4.7, 4.6 and Sonnet 4.6 until you set `thinking: {type: "adaptive"}`. It replaced extended thinking, where you enabled reasoning manually and set a token budget.',
    practical_example:
      "You ask Claude a quick factual question and it answers in one sentence. You ask it to help you think through a tricky hiring decision and it slows down, considers multiple angles, and works through its reasoning first. You didn't change anything — Claude calibrated the depth on its own. When you want to influence that calibration, the control is `effort` (low, medium, high, xhigh, max), not a thinking toggle.",
  },

  'model-versioning': {
    definition:
      'Keeping track of which model and which prompt version are running in production, so you can test changes safely and roll back if something breaks. The mechanics changed: from the Claude 4.6 generation onward, every model ID is a pinned snapshot, including the dateless ones like `claude-opus-5`. There is no silently-updating "latest" to guard against on current models. What you do have to plan for is retirement — Claude Opus 4.1 was retired on 5 August 2026, and calls to a retired model return an error rather than falling back.',
    practical_example:
      "You pin `claude-opus-5` in your API calls and record which prompt version it was evaluated against. The model won't change underneath you — dateless IDs from the 4.6 generation on are their own pinned snapshots. What will happen eventually is a retirement notice, so keep the eval suite that told you the current setup works, and check the model deprecations page when you plan quarters. A retirement with no eval suite is a migration with a deadline someone else set.",
  },
}

const ARTICLE_EDITS: Record<string, { excerpt?: string; edits?: [string, string][] }> = {

  'context-window-role': {
    excerpt:
      'A million tokens sounds like more room than anyone could use. In practice, how you use that space — not whether you run out of it — is what changes the quality of your outputs.',
  },

  'using-claude-for-research': {
    excerpt:
      'Claude can search the web now, which changed the research workflow but not the discipline it requires. A citation proves a page exists, not that it says what Claude says it says. How to use Claude for research without inheriting its judgment about sources.',
  },

  'claude-plus-airtable': {
    excerpt:
      'There is a first-party Airtable connector now — Claude can query your base and create and update records directly, no Zapier in the middle. Here is what the connector handles, what still needs an automation layer, and the write-access caveat worth knowing.',
  },

  'why-claude-feels-inconsistent': {
    excerpt:
      "Claude isn't being random — inconsistency almost always has a specific cause you can find and fix. Memory closed part of the gap; here are the four causes that remain, in order of how often they appear.",
    edits: [
      [
        'Now match it to one of the five causes above.',
        'Now match it to one of the four causes above.',
      ],
    ],
  },
}

async function main() {
  let failures = 0

  console.log('-- glossary terms --')
  for (const [slug, fields] of Object.entries(TERMS)) {
    const { data, error } = await sb.from('terms').select('slug').eq('slug', slug).single()
    if (error || !data) {
      console.error(`✗ ${slug}: not found — ${error?.message}`)
      failures++
      continue
    }
    const { error: upErr } = await sb
      .from('terms')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('slug', slug)
    if (upErr) {
      console.error(`✗ ${slug}: update failed — ${upErr.message}`)
      failures++
    } else {
      console.log(`✓ ${slug}`)
    }
  }

  console.log('\n-- article excerpts and fixes --')
  for (const [slug, p] of Object.entries(ARTICLE_EDITS)) {
    const { data, error } = await sb.from('articles').select('slug, body').eq('slug', slug).single()
    if (error || !data) {
      console.error(`✗ ${slug}: not found — ${error?.message}`)
      failures++
      continue
    }

    const update: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (p.excerpt) update.excerpt = p.excerpt

    if (p.edits) {
      let body = data.body as string
      let ok = true
      for (const [from, to] of p.edits) {
        if (!body.includes(from)) {
          console.error(`✗ ${slug}: anchor not found → ${from.slice(0, 60)}...`)
          ok = false
          break
        }
        body = body.replace(from, to)
      }
      if (!ok) { failures++; continue }
      update.body = body
    }

    const { error: upErr } = await sb.from('articles').update(update).eq('slug', slug)
    if (upErr) {
      console.error(`✗ ${slug}: update failed — ${upErr.message}`)
      failures++
    } else {
      console.log(`✓ ${slug}${p.edits ? ' (excerpt + body)' : ' (excerpt)'}`)
    }
  }

  if (failures) { console.error(`\n${failures} item(s) failed.`); process.exit(1) }
  console.log('\nBatch 4 complete — glossary and excerpts corrected.')
}

main().catch((e) => { console.error(e); process.exit(1) })
