/**
 * Tier 1 currency fix — batch 2 of 3: context window and token specs.
 *
 * Five articles hard-code Claude 3.5 / 3.7 Sonnet and a 200,000-token context
 * window as current. Current lineup: Claude Fable 5, Opus 5 and Sonnet 5 all
 * carry 1M-token context windows with 128K max output; Haiku 4.5 is 200K/64K.
 * The tokenizer also changed with Claude Opus 4.7, so the "1 token ≈ ¾ of a
 * word" rule of thumb no longer holds on current models.
 *
 * Verified against docs on 2026-08-30:
 *   https://platform.claude.com/docs/en/about-claude/models/overview
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/fix-stale-context-specs.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const E: Record<string, [string, string][]> = {

  // -------------------------------------------------------------------------
  'context-window-def': [
    [
`Most AI assistants have historically had small whiteboards — 4,000 to 8,000 tokens. Enough for a back-and-forth conversation, not much more.

Claude's context window changes the game. Claude 3.5 Sonnet supports **200,000 tokens** — roughly 150,000 words. That's an entire novel. Or a company's full legal documentation. Or six months of customer support tickets. All available to Claude at once, without losing the thread.

This isn't just a bigger number. It's a different kind of tool.

With a small context window, you have to be strategic about what you tell the model. You summarize, compress, select. With 200K tokens, you can often just *give Claude everything* and let it find what matters.`,
`Most AI assistants have historically had small whiteboards — 4,000 to 8,000 tokens. Enough for a back-and-forth conversation, not much more.

Claude's context window changes the game. Claude Fable 5, Claude Opus 5 and Claude Sonnet 5 each support **1,000,000 tokens** — roughly 555,000 words on the current tokenizer. That's several novels. Or a company's full legal documentation. Or a year of customer support tickets. All available to Claude at once, without losing the thread. Claude Haiku 4.5, the fast model, carries 200,000 tokens.

This isn't just a bigger number. It's a different kind of tool.

With a small context window, you have to be strategic about what you tell the model. You summarize, compress, select. With a million tokens, you can often just *give Claude everything* and let it find what matters.`,
    ],
    [
`## What fits in 200,000 tokens

To make this concrete:

- A full product specification document: fits easily
- An entire codebase for a small app: fits
- All your customer interviews from a discovery sprint: fits
- A year of email threads with a key partner: fits
- The complete works of Shakespeare: fits, with room to spare`,
`## What fits in 1,000,000 tokens

To make this concrete:

- A full product specification document: fits, using a fraction of a percent
- An entire codebase for a mid-sized application: fits
- All your customer interviews from a discovery sprint: fits
- Several years of email threads with a key partner: fits
- The complete works of Shakespeare: fits about six times over

The practical ceiling stopped being "will it fit" and became "does including it help." Those are different questions, and the second one is now the one that matters.`,
    ],
    [
`What Claude *can't* do is remember anything from a previous conversation. When you start a new chat, the whiteboard is wiped clean. This is where **memory systems** and **[RAG](/glossary/rag)** come in — ways to give Claude access to information that lives outside the current window.`,
`The whiteboard is still per-conversation: what is on it is what Claude is actively reading. Claude does now carry [memory](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context) between conversations, but that works differently — memory is a set of retained entries that get brought *to* the whiteboard, not a whiteboard that never gets wiped. For information too large or too fast-changing to sit in either, that's where **[RAG](/glossary/rag)** comes in.`,
    ],
    [
`- [Models & context windows](https://platform.claude.com/docs/en/about-claude/models/overview) — current context window sizes per model`,
`- [Models & context windows](https://platform.claude.com/docs/en/about-claude/models/overview) — current context window sizes per model (1M on Fable 5, Opus 5 and Sonnet 5; 200K on Haiku 4.5)`,
    ],
  ],

  // -------------------------------------------------------------------------
  'context-window-practical': [
    [
`Claude 3.5 Sonnet has a 200,000 token context window, which is roughly 150,000 words, or about 500 pages of text.

That sounds enormous. In practice, context windows fill up faster than you expect, and how you manage them affects the quality of your outputs.`,
`Claude Fable 5, Claude Opus 5 and Claude Sonnet 5 each have a 1,000,000 token context window — roughly 555,000 words, or several thousand pages. Claude Haiku 4.5 has 200,000. Maximum output is 128,000 tokens on the current large models, 64,000 on Haiku.

That sounds like more room than anyone could use, and for most work it is. But a big window changed which problem you have rather than removing it: you will rarely run out of space now, and you can still degrade your own output by filling that space with material Claude did not need.`,
    ],
    [
`**Big documents consume context aggressively.** A 50-page PDF uploaded to a conversation is 30,000+ tokens. If you upload three such documents, you have used 90,000 tokens before you say anything. For large document sets, be selective about what you upload — only what Claude actually needs for the task at hand.`,
`**Big documents no longer threaten the limit, but they still cost you.** A 50-page PDF is 30,000-plus tokens. Against a million-token window, thirty of those still fit. What they cost is money and latency on every turn, and attention: the more competing material in the window, the more the thing you actually care about has to compete with. Be selective because it produces better answers, not because you are about to run out.`,
    ],
    [
`For most everyday use — drafting emails, answering questions, producing reports — you will never notice context window limits. The 200k window is genuinely large.

Context management matters when you are:
- Working with very large documents (50+ pages)
- Running long analytical conversations
- Building workflows that involve many back-and-forth exchanges
- Using the API for high-volume automated tasks`,
`For most everyday use — drafting emails, answering questions, producing reports — you will never come close to the limit. A million tokens is more than almost any single task needs.

Context management matters when you are:
- Working with document sets in the hundreds of pages
- Running long analytical conversations where early instructions need to keep holding
- Building workflows that involve many back-and-forth exchanges
- Using the API for high-volume automated tasks, where every token in the window is billed on every turn

Note that very large contexts can carry their own pricing tier — check the [pricing page](https://platform.claude.com/docs/en/about-claude/pricing) before you design a workflow that routinely runs near the top of the window.`,
    ],
  ],

  // -------------------------------------------------------------------------
  'context-window-role': [
    [
`Claude's [context window](/glossary/context-window) — currently 200,000 tokens for Claude 3.7 Sonnet, roughly 150,000 words — is large enough that most people never hit the limit. But "won't run out of space" and "using the space well" are different things.`,
`Claude's [context window](/glossary/context-window) — 1,000,000 tokens on Claude Fable 5, Claude Opus 5 and Claude Sonnet 5, roughly 555,000 words — is large enough that most people never come near the limit. But "won't run out of space" and "using the space well" are different things, and the gap between them got wider as the window got bigger.`,
    ],
    [
`When the whiteboard fills up, old content gets erased from the top. Claude doesn't have a separate long-term memory. The whiteboard is all there is.

This has two practical implications.`,
`When the whiteboard fills up, old content gets erased from the top. Claude does have [memory](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context) that carries between conversations, but that is a separate mechanism — retained entries that get loaded onto the whiteboard, not a bigger whiteboard. Within a conversation, what is on the board is what Claude is working from.

This has two practical implications.`,
    ],
  ],

  // -------------------------------------------------------------------------
  'token-def': [
    [
`The rule of thumb: **one token is about ¾ of a word**, or roughly 4 characters. So 1,000 tokens ≈ 750 words, and a typical page of text is around 500–600 tokens.`,
`The rule of thumb changed. Anthropic introduced a new tokenizer with Claude Opus 4.7, and on current models **one token is a bit over half a word**, or roughly 2.5 characters. A million tokens holds about 555,000 words. On models from before that change, the older ratio still applies: about ¾ of a word per token, or 750,000 words per million tokens.

If you are estimating costs, use the ratio for the model you are actually calling, and use the [count_tokens endpoint](https://platform.claude.com/docs/en/api/messages-count-tokens) when the number has to be right.`,
    ],
    [
`**[context window](/glossary/context-window) limits.** Claude's 200,000-token context window means 200,000 tokens of combined input and output. That's roughly 150,000 words — a lot, but finite. Long documents, conversation history, and system prompts all count toward this limit.`,
`**[context window](/glossary/context-window) limits.** Claude Fable 5, Opus 5 and Sonnet 5 carry a 1,000,000-token context window — combined input and output, roughly 555,000 words. Claude Haiku 4.5 carries 200,000. It is a lot, but it is finite, and long documents, conversation history and system prompts all count toward it.`,
    ],
    [
`For rough estimates: take your word count, multiply by 1.3, and that's approximately your token count. For precise counts before making API calls, Anthropic provides a tokenizer tool — or you can use the count_tokens endpoint to get exact figures before committing to a request.`,
`For rough estimates on current models: take your word count and multiply by 1.8. On models older than Claude Opus 4.7, multiply by 1.3 instead. For precise counts before making API calls, use the [count_tokens endpoint](https://platform.claude.com/docs/en/api/messages-count-tokens) to get exact figures before committing to a request — worth doing whenever the estimate is driving a budget rather than a guess.`,
    ],
  ],

  // -------------------------------------------------------------------------
  'rag-role': [
    [
`Start with a context-stuffed prompt. Take your knowledge base, paste the most relevant parts into Claude's context window, and see how well it performs. Claude's 200K token window is large enough to hold most small company knowledge bases entirely.`,
`Start with a context-stuffed prompt. Take your knowledge base, paste the most relevant parts into Claude's context window, and see how well it performs. At 1,000,000 tokens — roughly 555,000 words — the current window is large enough to hold most small and mid-sized company knowledge bases entirely.

This has moved the RAG decision meaningfully. A knowledge base that genuinely did not fit two years ago probably fits now, which means the honest answer to "do I need RAG" is no more often than it used to be. What has not changed is the cost side: everything you stuff into the window is billed on every single call, so at high volume, retrieval can still be the cheaper architecture even when stuffing would work.`,
    ],
    [
`**Your information is too large to paste in.** Anthropic's entire documentation. Your complete CRM history. Five years of support tickets. These can't live in a [context window](/glossary/context-window). RAG finds the relevant slice and passes only that.`,
`**Your information is too large to paste in.** Your complete CRM history. Five years of support tickets. A document corpus in the tens of thousands of pages. Even a million-token [context window](/glossary/context-window) does not hold these, and paying to re-send them on every call would be absurd if it did. RAG finds the relevant slice and passes only that.`,
    ],
    [
`2. Is that information more than roughly 50 pages of text?`,
`2. Is that information more than roughly 2,000 pages of text — or small enough to fit, but expensive enough that re-sending it on every call is the real problem?`,
    ],
  ],
}

async function main() {
  let failures = 0
  for (const [slug, edits] of Object.entries(E)) {
    const { data, error } = await sb.from('articles').select('slug, body').eq('slug', slug).single()
    if (error || !data) {
      console.error(`✗ ${slug}: could not load — ${error?.message}`)
      failures++
      continue
    }

    let body = data.body as string
    let ok = true
    for (const [from, to] of edits) {
      if (!body.includes(from)) {
        console.error(`✗ ${slug}: anchor not found → ${from.slice(0, 70)}...`)
        ok = false
        break
      }
      body = body.replace(from, to)
    }
    if (!ok) { failures++; continue }

    const { error: upErr } = await sb
      .from('articles')
      .update({ body, updated_at: new Date().toISOString() })
      .eq('slug', slug)

    if (upErr) {
      console.error(`✗ ${slug}: update failed — ${upErr.message}`)
      failures++
    } else {
      console.log(`✓ ${slug} — ${edits.length} sections updated`)
    }
  }
  if (failures) { console.error(`\n${failures} article(s) failed.`); process.exit(1) }
  console.log('\nBatch 2 complete — context window and token specs corrected.')
}

main().catch((e) => { console.error(e); process.exit(1) })
