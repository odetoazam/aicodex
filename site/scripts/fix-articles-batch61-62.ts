/**
 * In-place fixes from persona review loop (April 17, 2026)
 *
 * ask-your-org-guide:
 *   - Add Team/Enterprise plan requirement callout at the very top
 *   - Explain what "Owner" means
 *
 * claude-session-economics:
 *   - Add Projects link in Projects section
 *   - Add API callout (same economics apply)
 *
 * claude-code-antipatterns:
 *   - Specify where deferred tool loading is enabled (settings.json key)
 *   - Clarify idle sessions don't cost money
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/fix-articles-batch61-62.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const FIXES = [

  {
    slug: 'ask-your-org-guide',
    body: `**Available on:** Team and Enterprise plans only. If you're on Pro or Max, Ask Your Org isn't available yet — it requires a plan with org-level admin controls.

Anthropic added a feature to Claude called Ask Your Org. It's a pre-configured project that lets you ask questions in plain English — and Claude searches across your connected company tools simultaneously, then gives you a single synthesized answer with sources.

Instead of searching Slack, checking Google Drive, scanning email, and opening SharePoint separately to find something, you ask one question and get one answer that pulls from all of them.

## What changed

When you open Claude on a Team or Enterprise plan, you'll see a project called "Ask Your Org" in your sidebar. Once an Owner completes the setup, it connects to your company's data sources and becomes searchable by everyone in the org.

**What's an Owner?** In Claude's Team and Enterprise plans, each organization has Owners (sometimes called admins) who can change org-wide settings, add connectors, and provision users. If you're not sure whether you're an Owner, check Settings → Organization in Claude — if you can see the admin panel, you are. If not, your IT admin or the person who manages your Claude plan is.

Claude searches across:
- Slack conversations
- Microsoft 365 (SharePoint documents and email)
- Google Workspace (Gmail and Google Drive)
- Any custom data sources added via MCP connectors

The search is permission-aware: Claude only shows you information you could already access in the original tool. If you don't have access to a Slack channel, Ask Your Org won't surface conversations from it.

Your searches count against your normal usage limits. Anthropic doesn't index or store your data — queries go directly to the connected source systems.

## If you're managing Claude for your org

Ask Your Org is off by default until an Owner completes setup. Here's what that looks like:

1. Open Ask Your Org in the Claude sidebar and click "Set up for your org"
2. Connect your data sources — you'll need to add at least a Documents connector and a Chat connector (email is optional)
3. Add any additional tools or MCP connectors for internal systems
4. Name the project and save

**Microsoft 365 note:** Connecting SharePoint and email requires signing in with an account that has access to your org's Microsoft 365 tenant. For most enterprise setups, this is a standard user login — it doesn't require Azure AD admin rights. If your org has conditional access policies, check with your IT team first.

Once active, it's available to everyone in your organization automatically.

To turn it off org-wide: Organization Settings → Capabilities → Disable.

The key compliance point: no data is indexed or stored by Anthropic. Each query hits the source system directly. You only see what you already have permission to access. This is the answer most IT/legal teams will ask about first.

## If you're using Claude in your daily work

The practical shift: questions that used to require switching between 4–5 tools can now start with a single Ask Your Org query.

Useful for:
- "What did we decide about [topic] in Slack last month?" — searches channels you have access to
- "What's our policy on [X]?" — searches SharePoint and Drive for relevant docs
- "What were the action items from the [client] call?" — searches email threads and meeting notes
- "Summarize everything we know about [prospect] before the call" — pulls from email, docs, and Slack in one go

The answers come with source citations — you can click through to the original document or message.

One limit to know: responses count against your usage limits the same as any other Claude conversation. Long multi-source queries on large data sets take more time than simple questions.

## If you're building with Claude

Custom connectors via MCP let you add internal data sources that aren't Slack/M365/Google — a proprietary database, a ticketing system, a wiki. The standard MCP connector interface applies.

If your organization has internal tools that would be useful to query alongside standard data sources, this is the route. The [MCP documentation](https://platform.claude.com/docs/en/build-with-claude/mcp) covers how to build and register connectors.

## What to do right now

**On Team or Enterprise:** Check if Ask Your Org is already set up by looking for it in your Claude project sidebar. If it's there and connected, you can start using it immediately.

**If you're an Owner and it's not set up yet:** The setup takes about 15 minutes. The main step is authenticating with your connected tools (Google Workspace or Microsoft 365 requires signing in once to authorize access). Once done, it's available org-wide.

**Not sure if you're an Owner?** Go to Settings → Organization in Claude. If you can see the organization settings panel, you have Owner access.

**On Pro or Max:** Ask Your Org requires a Team or Enterprise plan. It's not available on individual plans.

**Related:** [Setting up Claude for your team](/articles/setting-up-claude-for-your-team) · [Getting IT approval for Claude](/articles/getting-it-approval-for-claude)`,
  },

  {
    slug: 'claude-session-economics',
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

If you find yourself pasting the same context into conversations repeatedly, that's a sign it belongs in a Project instead. Set it up once; every new conversation in that Project has it automatically. See [how Projects work](/articles/claude-projects-role) for setup.

**A note on the Claude API:** The same economics apply if you're using Claude through the API. Every API call sends the full message history by default, so context accumulates the same way. If you're building an app, managing conversation history carefully — trimming old messages, using system prompts instead of early conversation turns for stable context — has the same cost impact as starting fresh chats in the consumer product.

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

**Related:** [How Projects work](/articles/claude-projects-role) · [Minimising token usage](/articles/minimising-token-usage) · [Setting up Claude for your team](/articles/setting-up-claude-for-your-team)`,
  },

  {
    slug: 'claude-code-antipatterns',
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

Claude Code sessions accumulate in the sidebar. Developers often have 10–20 old sessions sitting open from tasks completed days ago.

**To be clear: idle sessions don't cost money.** You're not billed for sessions just sitting there. The issue is cognitive — you end up reopening the wrong session, continuing work in a stale context, or getting confused about which session has what state.

The fix: close sessions when work is done. The new session sidebar lets you filter by status — completed tasks should be archived. For sessions that produced useful output (a design decision, a working prototype, a complex debugging trace), export or summarize what you need before closing. Claude Code sessions aren't permanent memory.

## Anti-pattern 6: Not using deferred tool loading

By default, Claude Code loads all available tool schemas at session start so it knows what it can do. For sessions with many tools configured, this is significant upfront context overhead even if most tools never get called.

Deferred tool loading changes this: tools are only loaded into context when Claude actually needs them. The first call to a tool triggers loading; subsequent calls that session are fast.

**How to enable it:** Add this to your Claude Code settings file (\`~/.claude/settings.json\`):

\`\`\`json
{
  "deferredToolLoading": true
}
\`\`\`

Or toggle it in the Claude desktop app under Settings → Claude Code → Performance.

Most teams with more than 5–6 tools configured see a meaningful session startup improvement. Particularly useful if you have several MCP servers configured — they only load if and when Claude decides to use them.

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
| Sessions never closed | Navigation confusion (no cost) | Archive when work is done |
| Deferred loading off | High session startup cost | Set deferredToolLoading: true |
| Contradictory CLAUDE.md rules | Inconsistent behavior | Single owner, regular review |

**Related:** [CLAUDE.md maintenance](/articles/claude-md-maintenance) · [CLAUDE.md templates](/articles/claude-md-templates) · [Claude Code for your team](/articles/claude-code-for-your-team) · [MCP for operators](/articles/mcp-for-operators)`,
  },

]

async function fix() {
  console.log('Applying persona-review fixes to batch 61–62 articles...\n')

  for (const f of FIXES) {
    const { error } = await sb.from('articles').update({ body: f.body }).eq('slug', f.slug)
    if (error) {
      console.error(`  ✗ ${f.slug}: ${error.message}`)
    } else {
      console.log(`  ✓ ${f.slug}`)
    }
  }

  console.log('\nDone.')
}

fix().catch(console.error)
