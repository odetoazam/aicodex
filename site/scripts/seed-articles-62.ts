/**
 * Batch 62 — Session economics + Claude Code antipatterns
 *
 * 1. claude-session-economics
 *    Why starting a new chat saves money and how context accumulation works.
 *    The 5.5x cost insight. Projects as the escape hatch. Angle: 'process'.
 *
 * 2. claude-code-antipatterns
 *    The failure-mode flip of the Claude Code cluster.
 *    What to stop doing: CLAUDE.md sizing, MCP cost traps, session waste,
 *    skipping Plan Mode, not using side chat. Angle: 'failure'.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-62.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ARTICLES = [

  // ── 1. Claude Session Economics ──────────────────────────────────────────
  {
    slug: 'claude-session-economics',
    angle: 'process',
    title: 'Why starting a new chat almost always saves money',
    excerpt: 'Ten turns in one conversation costs roughly 5.5x as much as ten separate conversations. Here\'s why that happens, when it matters, and the one habit that changes how you use Claude.',
    readTime: 5,
    cluster: 'Working with Claude',
    body: `Most people open one Claude conversation and keep going. It feels efficient — Claude has context, you don't have to re-explain things, the conversation is building on itself. But this is one of the most expensive habits in Claude usage, and it's almost never actually necessary.

Here's why.

## How Claude charges for each message

Every time you send a message, Claude reads the entire conversation from the beginning. Not just your new message — everything. Every question, every answer, every code block, every clarification since the start of the chat.

This matters because Claude charges per token — roughly per word or word-fragment — for everything it processes. The longer a conversation gets, the more tokens Claude reads to respond to each new message, even if earlier messages have nothing to do with your current question.

In practice: a conversation that's 5 messages long means message 6 also processes messages 1–5. A 20-message conversation means every new message also processes messages 1–19. The cost compounds with every turn.

## The 5.5x problem

Ten turns kept in one long conversation costs roughly 5.5x as much as ten separate conversations asking the same questions.

The first conversation: message 1 processes nothing, message 2 processes message 1, message 3 processes messages 1–2, and so on. By message 10, you're processing the equivalent of the entire conversation just for that one response.

Ten separate conversations: each one starts fresh. Message 1 in each chat processes only your question. There's no accumulation, no overhead.

If you're using Claude for distinct tasks across a day — a draft email, a data question, a summary of a document, a reply to a customer — there's almost no reason to keep them in the same conversation. Each one starts fresh, each one is cheaper, and each one actually gets better answers because the context isn't cluttered with unrelated earlier messages.

## When you actually want a long conversation

There are real cases where keeping a conversation going makes sense:

**Multi-step work on the same thing.** If you're iterating on a document, a design, or a piece of code and each message builds on the previous one, staying in the conversation is correct. The context is load-bearing.

**Ongoing projects.** If you're doing a research deep dive and each message refines the previous analysis, the accumulating context is the point.

**When you're debugging.** Showing Claude what you tried and why it didn't work is valuable context for the next attempt.

The test: does this new message actually need the previous messages to make sense? If yes, stay in the conversation. If no, start a new one.

## The Projects escape hatch

The reason most people keep long conversations going is that they need Claude to remember something — a project brief, their writing style, their codebase context, their preferences.

That's what Projects are for. Anything you reference more than twice belongs in Project Knowledge, not in a conversation. Project Knowledge is cached — Claude reads it efficiently without adding conversation overhead. It doesn't count against your message costs the way conversation history does.

If you find yourself pasting the same context into conversations repeatedly, that's a sign it belongs in a Project instead. Set it up once; every new conversation in that Project has it automatically.

## The PDF trap

An easy way to accidentally balloon your costs: uploading a 50-page PDF and asking questions across multiple messages in the same conversation. The entire PDF content sits in the conversation history and gets re-processed with every message, even when you're asking about page 3 and Claude has already answered everything on pages 1–40.

If you need to ask several questions about a long document, extract the relevant section and paste it as text — then ask one question per conversation rather than ten questions in one. Or put the document in a Project where it's cached properly.

## The model habit

One other lever that compounds with session economics: model choice. Claude Haiku handles most daily tasks — summarizing, drafting, answering straightforward questions — at a fraction of Sonnet's cost. Sonnet handles complex reasoning, nuanced writing, and tasks that need depth.

The default habit: start with Haiku. If the answer feels shallow, switch to Sonnet for that specific task. Don't use Sonnet for a task that Haiku would have handled fine.

Combined with starting new conversations for distinct tasks, these two habits account for the majority of the gap between moderate and efficient Claude usage.

## The short version

- Start a new chat for each distinct task
- Put context you use repeatedly into Projects, not conversations
- Extract relevant text from documents rather than uploading entire files
- Default to Haiku, escalate to Sonnet when the task needs it

None of these require changing how you work — just changing which button you click at the start of each task.

**Related:** [Projects are free context](/articles/claude-projects-role) · [Minimising token usage](/articles/minimising-token-usage) · [Setting up Claude for your team](/articles/setting-up-claude-for-your-team)`,
  },

  // ── 2. Claude Code Antipatterns ──────────────────────────────────────────
  {
    slug: 'claude-code-antipatterns',
    angle: 'failure',
    title: 'Claude Code anti-patterns: what to stop doing',
    excerpt: 'The failure-mode companion to every Claude Code setup guide. CLAUDE.md that\'s too big, MCP servers left running, sessions you never close, skipping Plan Mode, asking quick questions in the main thread — here\'s what each one costs you and how to fix it.',
    readTime: 6,
    cluster: 'Claude Code',
    body: `Most Claude Code guides tell you what to set up. This one covers what to stop doing. The patterns below are common, each one has a real cost, and most of them are fixable in under five minutes.

## Anti-pattern 1: A CLAUDE.md that never gets trimmed

CLAUDE.md is where you put project context, coding standards, and instructions Claude should follow. Teams add to it over time and rarely remove anything. By month three, it's often 400+ lines of accumulated rules, some of which contradict each other and half of which Claude can't meaningfully act on.

The cost: every Claude Code session reads CLAUDE.md in full at the start. A bloated CLAUDE.md means more tokens consumed before Claude writes a single line of code, and more noise in the context that dilutes the instructions that actually matter.

The fix: treat CLAUDE.md like a codebase. Review it quarterly. Remove rules that are no longer relevant. Consolidate rules that overlap. The effective limit is around 200 lines — past that, you're adding noise, not context. See [CLAUDE.md maintenance](/articles/claude-md-maintenance) for the full process.

**Signal you've hit this:** Claude starts ignoring specific rules from CLAUDE.md. That's usually a sign the file is too long and the relevant instruction is getting crowded out.

## Anti-pattern 2: Expensive MCP servers always running

MCP servers extend Claude Code's capabilities — connecting it to databases, APIs, external tools. The problem: every connected MCP server adds tokens to every context window, even when Claude doesn't need to use it for the current task.

A team with 8 MCP servers configured might have 3–4 relevant to any given task. The other 4 are burning context space for free.

The cost: when context usage climbs past roughly 10% from MCP overhead, Claude Code switches into tool search mode — it has to actively scan its available tools before using them, which adds latency and token use.

The fix: connect only the MCP servers you actually use for the current project. For servers used occasionally (a database tool you need for data migrations but not daily coding), remove them from the default config and add them when needed. Use Skills for simpler integrations — they're lighter weight than full MCP servers for repeatable tasks.

**The "money pit" pattern:** A team that connected every available MCP integration "because we might need it" and then wondered why their Claude Code sessions were running slow and expensive. The overhead was entirely from tools sitting idle.

## Anti-pattern 3: Asking quick questions in the main session thread

You're partway through a coding task. You have a quick question — should I use a class or a function here, what does this error mean, how does this library work. You ask it in the main thread.

The cost: that question and its answer now sit in your main session's context permanently. The next message Claude writes processes everything including the tangent. If you do this five times in a session, you've added significant dead weight to every subsequent response.

The fix: use side chat (⌘+; on Mac, Ctrl+; on Windows). Side chat pulls context from the main session so Claude understands where you are, but the conversation doesn't add back to the main thread. Ask your question, get your answer, close it. The main session stays clean.

This is what side chat was specifically built for. Most people who have it available don't use it because they don't know it exists.

## Anti-pattern 4: Skipping Plan Mode

The instinct when you have a coding task: open Claude Code, describe what you want, let it run. This works for small tasks. For anything involving multiple files or non-obvious architecture decisions, skipping Plan Mode costs more time than it saves.

The cost: Claude starts coding based on its first interpretation of your request. When that interpretation is slightly off — different file structure than you wanted, different pattern than your codebase uses, different approach than you had in mind — you spend the next several turns correcting it. Each correction processes the entire preceding session.

The fix: use Plan Mode first for multi-file tasks. Ask Claude to outline its approach before it writes a single line. You'll catch misalignments in 2 minutes that would otherwise take 20 minutes to untangle. For simple single-file tasks, Plan Mode is overkill — skip it. For anything that touches more than two files or has architectural implications, it pays for itself.

**Ultraplan note:** For complex tasks, Claude Code's Ultraplan uses a separate cloud planning call to generate a comprehensive implementation plan before any coding starts. Worth using when you're about to kick off a large feature.

## Anti-pattern 5: Sessions you never close

Claude Code sessions accumulate in the sidebar. Developers often have 10–20 old sessions sitting open from tasks completed days ago. Each session that's technically "active" holds some resources and can create confusion when you're navigating between projects.

The cost: less about compute, more about cognitive overhead. You end up reopening the wrong session, continuing work in a stale context, or getting confused about which session has what state.

The fix: close sessions when work is done. The new session sidebar lets you filter by status — completed tasks should be archived. For sessions that produced useful output (a design decision, a working prototype, a complex debugging trace), export or summarize what you need before closing. Claude Code sessions aren't permanent memory.

## Anti-pattern 6: Not using deferred tool loading

By default, Claude Code loads all available tool schemas at session start so it knows what it can do. For sessions with many tools configured, this is significant upfront context overhead even if most tools never get called.

Deferred tool loading changes this: tools are only loaded into context when Claude actually needs them. The first call to a tool triggers loading; subsequent calls that session are fast.

The fix: enable deferred tool loading in your Claude Code settings. It's off by default and most teams with more than 5–6 tools configured see a meaningful session startup improvement. Particularly useful if you have several MCP servers configured — they only load if and when Claude decides to use them.

## Anti-pattern 7: CLAUDE.md instructions that contradict each other

Happens naturally as teams grow: one developer adds "always use TypeScript interfaces for object types," another adds "prefer type aliases for union types," and six months later both instructions are in CLAUDE.md pointing in different directions.

The cost: Claude follows one instruction, ignores the other, and the output is inconsistent. Different developers get different behavior from what should be a shared standard.

The fix: CLAUDE.md should have one owner — the person responsible for keeping it consistent. When new instructions are added, the owner reviews them for conflicts with existing rules. The quarterly audit process in [CLAUDE.md maintenance](/articles/claude-md-maintenance) catches accumulated contradictions before they cause persistent inconsistency.

## The summary

| Anti-pattern | What it costs | Fix |
|---|---|---|
| CLAUDE.md never trimmed | Token overhead + ignored rules | Quarterly audit, 200-line limit |
| Too many MCP servers | Slow sessions, tool search mode | Connect only what you use |
| Questions in main thread | Accumulating context noise | Use side chat (⌘+;) |
| Skipping Plan Mode | Costly misalignment corrections | Plan first for multi-file tasks |
| Sessions never closed | Navigation confusion | Archive when work is done |
| Deferred loading off | High session startup cost | Enable in settings |
| Contradictory CLAUDE.md rules | Inconsistent behavior | Single owner, regular review |

**Related:** [CLAUDE.md maintenance](/articles/claude-md-maintenance) · [CLAUDE.md templates](/articles/claude-md-templates) · [Claude Code for your team](/articles/claude-code-for-your-team) · [MCP for operators](/articles/mcp-for-operators)`,
  },

]

async function seed() {
  console.log('Seeding Batch 62 — Session Economics + Code Antipatterns...\n')

  for (const a of ARTICLES) {
    const payload = {
      slug:      a.slug,
      angle:     a.angle,
      title:     a.title,
      excerpt:   a.excerpt,
      body:      a.body,
      read_time: a.readTime,
      cluster:   a.cluster,
      published: true,
    }

    const { error } = await sb.from('articles').upsert(payload, { onConflict: 'slug' })

    if (error) {
      console.error(`  ✗ ${a.slug}: ${error.message}`)
    } else {
      console.log(`  ✓ ${a.slug}`)
    }
  }

  console.log('\nDone.')
}

seed().catch(console.error)
