/**
 * Tier 1 currency fix — batch 1 of 3: capability denials.
 *
 * Five articles assert limits that Claude no longer has. Since these were
 * written (April 2026), Claude gained web search, memory that persists across
 * conversations and into Cowork, a connectors directory of 950+ MCP servers
 * (including a first-party Airtable connector), and code execution.
 *
 * Verified against docs on 2026-08-30:
 *   https://support.claude.com/en/articles/10684626-enable-and-use-web-search
 *   https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context
 *   https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities
 *   https://claude.com/connectors/airtable
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/fix-stale-capability-denials.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ---------------------------------------------------------------------------
// 1. what-ai-cant-do — full rewrite. The old premise ("here are seven things
//    Claude cannot do") has a different answer now; four of the seven fell.
// ---------------------------------------------------------------------------

const WHAT_AI_CANT_DO = `Most published lists of "what AI can't do" are quietly out of date, and this article used to be one of them.

When we first wrote it in April 2026, it said Claude could not search the web, could not remember anything between conversations, could not read your files unless you pasted them in, and could not learn from your corrections. All four of those are now false. Web search shipped. [Memory](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context) shipped, and it carries across chat and Cowork. [Connectors](https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities) shipped, and there are now over 950 of them.

That is worth sitting with before you read the new list, because it is the most useful thing in this article: **the limits move roughly every quarter, and the confident list you read six months ago is the thing most likely to be wrong.** People who built workflows around "Claude can't look things up" spent a year pasting search results into a chat window for no reason.

So here is the current list, with the understanding that it too has a shelf life. What has changed is that the remaining limits are no longer capability gaps. They are structural.

## The limits that fell

| What we used to say | What is actually true now |
| --- | --- |
| Cannot look anything up in real time | Web search is available in Claude and on the API, with citations |
| Cannot remember previous conversations | Memory persists across chats and into Cowork tasks, as editable entries you control |
| Cannot read your files, emails, or documents | Connectors reach Drive, Gmail, Slack, Airtable, GitHub and ~950 more; custom remote MCP servers work on every plan |
| Cannot reliably produce accurate numbers | Claude runs code to compute, rather than predicting digits |
| Cannot learn from your corrections | Corrections you ask it to remember persist into later sessions |

If your mental model of Claude is more than about two quarters old, check it against the [model overview](https://platform.claude.com/docs/en/about-claude/models/overview) before you design a workflow around a limit.

## What Claude genuinely cannot do

### It cannot tell you how confident it should be

This is the one that has not moved and shows no sign of moving. Claude produces fluent, well-structured, confident prose whether or not the content is correct. The register does not change. A wrong answer and a right answer look identical.

Search helps less here than people expect. Retrieval means the claim now has a source attached — but Claude can still misread the source, cite a page that says something adjacent, or lean on a result that is itself wrong. A citation is evidence that a page exists. It is not evidence that the page supports the claim.

**What to do:** Calibrate on stakes, not on how confident the output sounds. For anything you will act on or ship, click through to the source. The failure mode is not "Claude made something up" — it is "Claude gave you something plausible and you had no signal to check it."

### It cannot know what nobody wrote down

Connectors give Claude your documents. They do not give it the reasoning that never made it into the documents — why the deal was structured that way, which stakeholder will block this, what happened the last time someone tried it, which parts of the roadmap everyone privately knows are dead.

In most organisations, the load-bearing context is in people's heads and in conversations that were never recorded. Claude reads what exists. Nothing gives it what doesn't.

**What to do:** When output is technically fine but somehow wrong for your situation, the missing ingredient is almost always undocumented context. Say the quiet part explicitly in the prompt.

### It cannot hold accountability

Claude can draft the analysis, run the numbers, and argue both sides. It cannot be the one who is responsible when the decision is wrong. That is not a capability gap that a better model closes — it is a category difference. Responsibility requires someone with something at stake.

This matters practically, not philosophically. The moment a workflow has no named human who owns the output, the quality of that output stops being checked by anyone, and it degrades without anyone noticing.

**What to do:** Every automated workflow needs a named owner and a review step with teeth. See [when agents break](/articles/when-agents-break) for what this looks like in practice.

### It cannot reliably report on itself

Ask Claude what it just did, which tools it called, why it made a choice, or what it is capable of, and you get a plausible reconstruction rather than a log. It does not have privileged access to its own processing, and its knowledge of its own product surface is bounded by a training cutoff that is months behind the release notes.

This is the specific reason "I asked Claude and it said it can't do that" is unreliable evidence about what Claude can do.

**What to do:** Check capability questions against [the docs](https://platform.claude.com/docs/en/about-claude/models/overview) and the [release notes](https://support.claude.com/en/articles/12138966-release-notes), never against the model's self-description. For agent behaviour, read the actual trace, not the summary.

### It cannot make the calls that require taste or stakes

What your product should be. Whether to fire someone. Which customer to disappoint. When to abandon a strategy you have publicly committed to. Claude will help you think through any of these more completely than you would alone, and it will not tell you what to believe, because conviction is not something it has.

**What to do:** Use it to pressure-test the decision — "what am I not considering, what would change my answer" — then make the decision yourself.

## The practical stance

Treat Claude as a capable colleague whose work you read before it goes out, whose sources you spot-check, and whose confidence you ignore as a signal.

And re-check the limits every few months. The most expensive mistake with AI right now is not over-trusting it. It is building a careful workaround for a constraint that quietly stopped existing two releases ago.

## Further reading

- [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview) — what each current Claude model does, with real specs
- [Release notes](https://support.claude.com/en/articles/12138966-release-notes) — the canonical record of what shipped and when
- [Use connectors to extend Claude's capabilities](https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities) — what Claude can reach into
- [Hallucination](/glossary/hallucination) — why confident wrongness happens at all`

const WHAT_AI_CANT_DO_EXCERPT =
  "Four of the five limits this article originally listed are now false — Claude searches the web, remembers across sessions, reads your files through connectors, and runs code to compute. Here's the current list of what Claude genuinely cannot do, and why the remaining limits are structural rather than technical."

// ---------------------------------------------------------------------------
// 2. using-claude-for-research — opening premise inverted.
// ---------------------------------------------------------------------------

const RESEARCH_OLD_OPEN = `Claude cannot browse the web, look things up in real time, or tell you what happened last week. Using it like a search engine produces unreliable results, and the errors are hard to catch because they sound authoritative.

Used correctly, Claude is a different kind of research tool — one that excels at synthesis, structure, and helping you think through what you already have.`

const RESEARCH_NEW_OPEN = `Claude can search the web now, which changes the research workflow but not the discipline it requires. The old advice — "Claude can't look things up, so bring your own sources" — is obsolete. The reason behind it is not.

When Claude searches, you get citations. Citations tell you a page exists. They do not tell you the page is any good, that it says what Claude says it says, or that the three sources it found are not all downstream of the same original claim. The errors got harder to catch, not easier, because now they arrive with a footnote.

Used well, Claude is a genuinely strong research tool for synthesis, structure, and finding the questions you have not asked. Here is how to use it without inheriting its judgment about sources.`

const RESEARCH_OLD_NOTRELIABLE = `**Facts and statistics.** Claude will produce numbers and facts that sound right but may be wrong. It is not a reliable source for specific figures, dates, statistics, or claims about real people or organizations. Always verify factual claims through primary sources.

**Recent events.** Claude's knowledge has a cutoff date. Do not use it to research anything recent without verifying the information elsewhere.`

const RESEARCH_NEW_NOTRELIABLE = `**Facts and statistics, cited or not.** With search on, Claude produces figures with sources attached. Click through on anything that matters. The common failure is not invention — it is a real number pulled from a source that measured something slightly different, or a 2023 figure presented as current.

**Source quality.** Claude does not rank sources the way a domain expert does. A content-farm summary and a primary regulatory filing look similar in a result list. If provenance matters for your work, specify it: "only use primary sources, government data, or peer-reviewed publications, and tell me if you can't find one."

**Single-origin consensus.** Three articles agreeing is not three sources of evidence if all three are rewrites of one press release. Ask Claude to trace claims back to origin when a finding is load-bearing.

**Anything past the reliable knowledge cutoff, without search.** If search is off or unavailable in your context, Claude's knowledge stops at its cutoff, and it will not always volunteer that the question needs current information.`

const RESEARCH_OLD_STEP1 = `**Step 1: Gather your sources yourself.**
Use search engines, databases, and primary sources to find the raw material. Do not outsource this step to Claude — it cannot reliably produce current, accurate source material.`

const RESEARCH_NEW_STEP1 = `**Step 1: Scope the question before you search.**
Ask Claude what the important sub-questions are and what kinds of sources would actually answer them, before it goes looking. This is the step people skip, and it is the one that determines whether the search returns evidence or just material. For anything where provenance matters, name the source types you will accept in the prompt.`

const RESEARCH_OLD_STEP2 = `**Step 2: Paste sources into Claude for synthesis.**
Once you have your sources, use Claude to process them. "Here are three articles on [topic]. What are the main points of agreement and disagreement?"`

const RESEARCH_NEW_STEP2 = `**Step 2: Search and synthesise, then read the citations.**
Let Claude search, or paste in sources you have already gathered — both work, and for specialised or paywalled material, paste still wins. Then open the citations on any claim you intend to use. Reading four source pages takes ten minutes and is the entire difference between research and laundering.`

const RESEARCH_OLD_FURTHER = `- [Claude takes research to new places](https://claude.com/blog/research) — Deep Research for in-depth investigation`

const RESEARCH_NEW_FURTHER = `- [Enable and use web search](https://support.claude.com/en/articles/10684626-enable-and-use-web-search) — turning search on and what it covers
- [Claude takes research to new places](https://claude.com/blog/research) — Deep Research for in-depth investigation`

// ---------------------------------------------------------------------------
// 3. why-claude-feels-inconsistent — the "blank slate" thesis needs updating.
// ---------------------------------------------------------------------------

const INCONSISTENT_OLD = `## Why the inconsistency happens

Claude starts every conversation with no memory of anything before it. No memory of who you are, what your company does, how you like things written, what you were working on yesterday. Each session is a blank slate.

This means the quality of what Claude produces depends almost entirely on the quality of what it receives in that session. Give it rich, specific context and it produces tailored, useful work. Give it a sparse prompt and it produces generic output — not because it is less capable, but because it is working with less information.

When output quality varies between people or between sessions, the cause almost always traces back to one of four things.`

const INCONSISTENT_NEW = `## Why the inconsistency happens

Claude has memory now — it carries context between your chats and into Cowork tasks, as a set of entries you can read and edit. That closed part of this gap, and if you have not turned it on, do that first.

But memory did not make the problem go away, and it is worth being precise about why. Memory captures what surfaced in your conversations. It does not capture what you never said out loud: your team's format conventions, the constraint your manager cares about, the account history that lives in your CRM, the reason this particular customer is sensitive. Claude still produces output against whatever context is present at the moment you ask — memory just widened the pool of what counts as present.

So the quality of what Claude produces still depends almost entirely on the quality of what it has. Give it rich, specific context and it produces tailored work. Give it a sparse prompt and it produces generic output — not because it is less capable, but because it is working with less information.

When output quality varies between people or between sessions, the cause almost always traces back to one of four things.`

const INCONSISTENT_OLD_C4 = `Claude has no continuity across sessions by default. When you come back the next day, it does not know about the call you had yesterday, the draft you worked through last week, or the feedback you incorporated in the previous version.

The result is that output feels inconsistent over time — not because the model changed but because each session starts without the history that would make the output build on what came before.

The fix for this kind of work is to create a running context document that you paste in at the start of relevant sessions. One or two paragraphs: where the project stands, what decisions have been made, what the current draft looks like, what you are trying to do in this session. It sounds effortful but takes two minutes and the quality difference is significant.`

const INCONSISTENT_NEW_C4 = `Memory helps here, but it is not a project tracker. It retains what came up naturally in conversation, not a structured record of where a piece of work stands. When you come back after two weeks, Claude may remember that you are working on the Q3 pricing review without remembering which of the three options you killed and why.

The result is that output feels inconsistent over time — not because the model changed, but because the session is missing the specific state that would let the output build on what came before.

The fix for this kind of work is a running context document you keep in the Project and update as things move. One or two paragraphs: where it stands, what has been decided and rejected, what the current draft looks like, what you are trying to do now. Memory handles the ambient context; the document handles the state that has to be exact. It takes two minutes and the quality difference is significant.`

// ---------------------------------------------------------------------------
// 4. solo-founder-operating-system — same "every session starts from zero".
// ---------------------------------------------------------------------------

const FOUNDER_OLD = `Every session starts from zero. Claude has no memory of your company, your positioning, your customers, your constraints. You are re-explaining context constantly. And because you never gave Claude the full picture of your business, its help is generic — useful, but not as sharp as it could be.

The fix is a [Claude Project](/glossary/claude-projects). One persistent workspace that knows everything about your company, always loaded and ready, with different conversation threads for different functions.`

const FOUNDER_NEW = `Each session starts from whatever Claude happens to have picked up. Memory means it is no longer zero — Claude retains context across your chats and into Cowork — but ambient recall is not the same as a deliberate briefing. It remembers that you mentioned churn last week. It does not have your positioning, your pricing logic, your constraints, or your 90-day plan in front of it unless you put them there.

The result is help that is useful but generic, and inconsistent in a way that is hard to diagnose, because sometimes Claude happens to remember the relevant thing and sometimes it does not.

The fix is a [Claude Project](/glossary/claude-projects) with a real context document in it. One persistent workspace that holds the full picture of your company deliberately rather than incidentally, always loaded, with different conversation threads for different functions. Leave memory on — it is genuinely useful for the connective tissue between sessions — but do not let it substitute for writing the briefing once.`

// ---------------------------------------------------------------------------
// 5. claude-plus-airtable — there IS a first-party Airtable connector now.
// ---------------------------------------------------------------------------

const AIRTABLE_OLD_OPEN = `The integration is not native (there is no official Airtable Connector inside Claude.ai, so you are working with copy-paste or automation tools like Zapier or Make. Here is what each approach gives you.`
const AIRTABLE_OLD_OPEN_ALT = `The integration is not native (there is no official Airtable Connector inside Claude.ai as of now), so you are working with copy-paste or automation tools like Zapier or Make. Here is what each approach gives you.`

const AIRTABLE_NEW_OPEN = `There is now a first-party [Airtable connector](https://claude.com/connectors/airtable) in the connectors directory, which changes the answer to "how do I connect these two." Claude can read your base, query it in conversation, and create and update records directly — no Zapier in the middle. The copy-paste and automation routes still have their uses, so here is what each approach is actually for.`

const AIRTABLE_OLD_M1 = `**1. Copy from Airtable, paste into Claude**`
const AIRTABLE_NEW_M1 = `**1. The Airtable connector (start here)**

Add the [Airtable connector](https://claude.com/connectors/airtable) from the connectors directory and authorise the bases you want reachable. Claude can then query your data in conversation and write back to it: "which deals in the pipeline base have had no activity in 30 days?" or "add a record for each of these five leads with source set to conference."

This is the right default for anything recurring. It removes the export step, it works against live data rather than a stale paste, and it does not require an automation subscription. Scope the authorisation to the specific bases Claude needs — the connector inherits whatever access you grant it.

**2. Copy from Airtable, paste into Claude**`

const AIRTABLE_OLD_M2 = `**2. Zapier or Make automation**`
const AIRTABLE_NEW_M2 = `**3. Zapier or Make automation**`

const AIRTABLE_OLD_M3 = `**3. Airtable scripting with direct API calls**`
const AIRTABLE_NEW_M3 = `**4. Airtable scripting with direct API calls**`

const AIRTABLE_OLD_NOTWORK = `**Claude cannot write directly to Airtable without an automation layer.** There is no native Claude Connector for Airtable inside Claude.ai, so Claude cannot browse your base or update records in real time without Zapier, Make, or the Scripting app.

**Very large bases get unwieldy.**`

const AIRTABLE_NEW_NOTWORK = `**Unattended, scheduled work still needs an automation layer.** The connector is conversational — it runs when you ask. If you want something to fire on a record entering a view at 3am, that is still Zapier, Make, or the Scripting app.

**Write access is real access.** The connector can update and create records, which means a misread instruction can modify live data. Scope authorisation to the bases Claude actually needs, and be specific in prompts that write — say which records, by name or filter, rather than "update the ones that need it."

**Very large bases get unwieldy.**`

const AIRTABLE_OLD_LEVERAGE = `For most teams without a developer: Zapier automation on a single high-value view (the records that need attention right now). Set it up once for your most repetitive task — writing descriptions, classifying submissions, generating summaries — and let it run.`

const AIRTABLE_NEW_LEVERAGE = `For most teams: install the connector, scope it to your two or three working bases, and stop exporting CSVs. That single change removes more friction than any automation you would have built.

Add Zapier on top only for the work that has to happen without you in the room — a record entering a view overnight, a form submission that needs classifying before anyone reads it.`

// ---------------------------------------------------------------------------

type Patch = { slug: string; edits: [string, string][]; excerpt?: string; replaceBody?: string; optional?: string[] }

const PATCHES: Patch[] = [
  { slug: 'what-ai-cant-do', edits: [], replaceBody: WHAT_AI_CANT_DO, excerpt: WHAT_AI_CANT_DO_EXCERPT },
  {
    slug: 'using-claude-for-research',
    edits: [
      [RESEARCH_OLD_OPEN, RESEARCH_NEW_OPEN],
      [RESEARCH_OLD_NOTRELIABLE, RESEARCH_NEW_NOTRELIABLE],
      [RESEARCH_OLD_STEP1, RESEARCH_NEW_STEP1],
      [RESEARCH_OLD_STEP2, RESEARCH_NEW_STEP2],
      [RESEARCH_OLD_FURTHER, RESEARCH_NEW_FURTHER],
    ],
  },
  {
    slug: 'why-claude-feels-inconsistent',
    edits: [
      [INCONSISTENT_OLD, INCONSISTENT_NEW],
      [INCONSISTENT_OLD_C4, INCONSISTENT_NEW_C4],
    ],
  },
  { slug: 'solo-founder-operating-system', edits: [[FOUNDER_OLD, FOUNDER_NEW]] },
  {
    slug: 'claude-plus-airtable',
    edits: [
      [AIRTABLE_OLD_OPEN_ALT, AIRTABLE_NEW_OPEN],
      [AIRTABLE_OLD_M1, AIRTABLE_NEW_M1],
      [AIRTABLE_OLD_M2, AIRTABLE_NEW_M2],
      [AIRTABLE_OLD_M3, AIRTABLE_NEW_M3],
      [AIRTABLE_OLD_NOTWORK, AIRTABLE_NEW_NOTWORK],
      [AIRTABLE_OLD_LEVERAGE, AIRTABLE_NEW_LEVERAGE],
    ],
  },
]

async function main() {
  let failures = 0
  for (const p of PATCHES) {
    const { data, error } = await sb.from('articles').select('slug, body').eq('slug', p.slug).single()
    if (error || !data) {
      console.error(`✗ ${p.slug}: could not load — ${error?.message}`)
      failures++
      continue
    }

    let body = data.body as string

    if (p.replaceBody) {
      body = p.replaceBody
    } else {
      let ok = true
      for (const [from, to] of p.edits) {
        if (!body.includes(from)) {
          console.error(`✗ ${p.slug}: anchor not found → ${from.slice(0, 70)}...`)
          ok = false
          break
        }
        body = body.replace(from, to)
      }
      if (!ok) { failures++; continue }
    }

    const update: Record<string, unknown> = { body, updated_at: new Date().toISOString() }
    if (p.excerpt) update.excerpt = p.excerpt

    const { error: upErr } = await sb.from('articles').update(update).eq('slug', p.slug)
    if (upErr) {
      console.error(`✗ ${p.slug}: update failed — ${upErr.message}`)
      failures++
    } else {
      console.log(`✓ ${p.slug} — ${p.replaceBody ? 'body rewritten' : `${p.edits.length} sections updated`}`)
    }
  }
  if (failures) { console.error(`\n${failures} article(s) failed.`); process.exit(1) }
  console.log('\nBatch 1 complete — capability denials corrected.')
}

main().catch((e) => { console.error(e); process.exit(1) })
