/**
 * Tier 2 currency fix — batch 2.
 *
 * A targeted scan of every pre-August article for *specific checkable breaks*
 * (rather than age alone) surfaced 15 candidates; 7 were real. The other 8 were
 * false positives worth recording so nobody re-flags them:
 *   - claude-opus-4-7 / migrating-to-claude-4-7 mention extended thinking
 *     because they correctly document its REMOVAL in 4.7. Accurate.
 *   - multi-agent-orchestration-basics and chatbot-with-persistent-memory say
 *     agent/API calls are stateless. Accurate — the Messages API is stateless.
 *     (chatbot- still gets a clarifier below, since "Claude" reads as the
 *     product there.)
 *   - claude-md-maintenance's "does not remember the refactor" is about people.
 *   - claude-code-june-2026-updates' "Opus 4.5 and newer" is a compatibility
 *     range, not a claim about the current lineup.
 *   - fine-tuning-def already tells readers to check current Bedrock docs.
 *   - writing-evals-that-catch-regressions matched on a CI action version.
 *
 * Verified against docs on 2026-08-30:
 *   https://claude.com/blog/claudes-memory-works-everywhere-and-you-decide-whats-in-it
 *   https://claude.com/connectors/atlassian
 *   https://platform.claude.com/docs/en/about-claude/models/overview
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/fix-stale-tier2-batch2.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const E: Record<string, { excerpt?: string; edits: [string, string][] }> = {

  // 200K -> 1M, and the point about retrieving generously gets stronger.
  'rag-def': {
    edits: [[
      "Claude's **200,000-token context window** means you can retrieve generously — 20 chunks instead of 3 — without worrying about overflow.",
      "Claude's **1,000,000-token context window** on Fable 5, Opus 5 and Sonnet 5 means you can retrieve generously — 20 chunks instead of 3 — without worrying about overflow. The constraint has shifted from what fits to what you want to pay to re-send on every call.",
    ]],
  },

  // Console Workbench was renamed Playground on 2026-08-18.
  'managed-agents-for-your-org': {
    edits: [[
      '**Workbench** — where you deploy and run agents. Each deployed agent can be triggered and each run creates a session.',
      '**Playground** — where you deploy and run agents. Each deployed agent can be triggered and each run creates a session. (This was called the Workbench until August 2026; the older prompt-tools APIs behind it retired on 17 August.)',
    ]],
  },

  // Three-model lineup with no mention of the biggest cost lever available.
  'minimising-token-usage': {
    edits: [[
      'If your team uses Claude.ai with a Pro or Team plan, model selection is handled in the model picker. On the API, routing simple tasks to Haiku and complex tasks to Sonnet or Opus can reduce costs by 60-80% without quality loss on the simple tasks.',
      'If your team uses Claude.ai with a Pro or Team plan, model selection is handled in the model picker. On the API, routing simple tasks to Haiku 4.5 and complex ones to Sonnet 5 or Opus 5 can cut costs substantially without quality loss on the simple tasks.\n\n**The lever most teams miss is `effort`.** Alongside model choice, the [effort parameter](https://platform.claude.com/docs/en/build-with-claude/effort) — `low`, `medium`, `high` (the default), `xhigh`, `max` — controls how many tokens Claude spends on a request, including tool calls. Leaving every workload at the default means routine classification is running at the setting designed for hard coding problems. Tune effort per workload before you downgrade a model: it is the cheaper experiment, and it often makes the downgrade unnecessary.',
    ]],
  },

  // Memory was redesigned in July and extended in August. Most of this article
  // described the pre-redesign model.
  'claude-memory-practical': {
    excerpt:
      'Memory is now a list of editable topic files that Claude updates as you chat, shared across Claude and Cowork. Here is what it holds, what it still will not do, and how to keep it from going stale.',
    edits: [
      [
        `Memory is not automatic recall of everything Claude has ever seen. It is a set of facts Claude has explicitly noted and stored — typically triggered when you or Claude identifies something worth remembering.`,
        `Memory is not automatic recall of everything Claude has ever seen. It is a set of short topic files that Claude writes and updates **as you chat**, rather than a summary generated after a conversation ends. You can read, edit or delete each one under **Settings → Memory → Topics**, which is the single most useful thing to know about it: when Claude has something wrong, you fix the file once and every future conversation inherits the correction.

By default Claude keeps sensitive subjects — health, beliefs, identity — out of memory. There is an "include sensitive topics in memory" setting if you want them retained. Some categories are always excluded regardless: identification numbers, criminal history, and anything that would violate the usage policy.`,
      ],
      [
        `Memory is personal — it is scoped to your account, not shared across a team. If you set up Memory with your preferences, your colleagues do not inherit them.`,
        `Memory is scoped to your account, not shared across a team — your colleagues do not inherit your preferences. It does follow you between surfaces, though: the memory you build in chat is the same memory Claude uses in Cowork, so a task running in the background already knows what you established in conversation.`,
      ],
      [
        `You can also ask Claude to recall what it remembers: "What do you know about me?" gives you a clear picture of what is stored and what you might want to add or correct.`,
        `You can also just look. Settings → Memory → Topics lists everything, and reading it is faster and more reliable than asking Claude what it knows — the files are short, and seeing them is how you notice the one that has been quietly wrong for a month.`,
      ],
      [
        `**Memory is not a conversation history.** Claude does not remember the specific content of past conversations through Memory — it remembers facts that were explicitly stored. If you had a detailed strategic discussion last week, Memory will not let Claude reference that conversation unless you explicitly extracted key points and asked it to remember them.`,
        `**Memory is not a full transcript.** Claude writes topics as you chat, so more gets captured than under the old explicitly-stored model — but it is still a set of distilled notes, not a recording. If you had a detailed strategic discussion last week, expect Claude to retain the shape of it, not the specifics. Searching your past chats is a separate capability from memory; when you need the actual content of an earlier conversation, that is the tool.`,
      ],
      [
        `**Memory resets are possible.** If Memory is producing wrong or outdated information, you can ask Claude to forget specific things: "Forget that I am the head of product — I've changed roles." Keeping Memory accurate is an ongoing task, not a one-time setup.`,
        `**Memory goes stale, and stale memory is worse than none.** Claude will confidently apply a fact that stopped being true in March. You can correct it in conversation — "forget that I'm head of product, I've changed roles" — but editing the topic file directly under Settings is more reliable, because you can see what actually changed. Keeping memory accurate is ongoing work, not one-time setup.`,
      ],
      [
        `Set up Memory early with the four or five facts about yourself and your work that would most change how Claude interacts with you. Review it quarterly.`,
        `Set up Memory early with the four or five facts about yourself and your work that would most change how Claude interacts with you. Then actually open Settings → Memory → Topics once a quarter and read what has accumulated.`,
      ],
      [
        `- [What's new in Claude: Turning Claude into your thinking partner](https://claude.com/blog/your-thinking-partner) — the product update that introduced memory and other persistent features`,
        `- [Claude's memory works everywhere, and you decide what's in it](https://claude.com/blog/claudes-memory-works-everywhere-and-you-decide-whats-in-it) — the current model: topic files, shared across chat and Cowork, editable in Settings
- [Use Claude's chat search and memory](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context) — memory and past-chat search, and how they differ`,
      ],
    ],
  },

  // The Jira connector became the Atlassian Rovo connector, and it writes.
  'claude-plus-jira': {
    excerpt:
      "The Atlassian connector reads and writes — Claude can create Jira issues, update status and pull sprint state directly. Here's what to hand it, what to keep manual, and the caveat that comes with write access.",
    edits: [
      [
        'There is a native Jira connector inside Claude.ai (for Claude for Teams and Claude Enterprise users), which lets Claude query your Jira workspace directly. There is also the copy-paste + API approach for teams without the connector. Both are covered here.',
        'Jira is reached through the [Atlassian connector](https://claude.com/connectors/atlassian), which covers Jira and Confluence together and is listed as read **and** write. Claude can query your workspace, create issues, and update status directly. There is also the copy-paste + API approach for teams without it. Both are covered here.',
      ],
      [
        '## With the Jira connector (Claude for Teams / Enterprise)\n\nIf you have connected Jira to Claude, you can query your workspace directly in conversation.',
        '## With the Atlassian connector\n\nOnce connected, you can query your workspace directly in conversation.',
      ],
      [
        `**What it does not do well:** It cannot write back to Jira, create issues, or update status. It reads. For anything that changes data, you need to do that in Jira directly.`,
        `**It writes, too.** "Create issues in the Mobile App project for each of these tasks" and "move the three blocked tickets to In Review" both work. Confluence pages come along with it, so "summarise this epic and write it up as a Confluence page" is a single request rather than three.

**The caveat that comes with write access.** Claude acting on your Jira is Claude acting as you, on a board your team relies on. Two habits worth adopting from the start: be specific about scope in any prompt that changes data — name the issues or the filter rather than "the ones that need updating" — and keep bulk operations to things you can undo. A misread instruction that closes forty tickets is a bad afternoon.

**What it still does not do:** it is not a substitute for your workflow rules. Automations, permissions and transitions configured in Jira still govern what is allowed; Claude works inside them rather than around them.`,
      ],
    ],
  },

  // Memory exists now; the "no memory across conversations" framing is stale.
  'claude-plus-google-docs': {
    edits: [[
      `**Expecting Claude to remember changes across conversations**

If you paste a document, make edits, and then start a new conversation, Claude does not remember the previous version. If you want Claude to track changes across sessions, keep the updated version in the conversation by continuing to reply in the same thread.`,
      `**Expecting Claude to remember the document itself across conversations**

Claude has memory, and it will retain the shape of what you are working on — that you are drafting a Q3 strategy memo, roughly what it argues. What it does not retain is the document. Start a new conversation and Claude will not have the previous version to diff against.

For iterative editing, keep working in the same thread, or put the document in a [Project](/glossary/claude-projects) so the current version is always loaded. Memory is for context about you and your work; the artefact itself belongs in a Project.`,
    ]],
  },

  // Accurate about the API, but "Claude" reads as the product here.
  'chatbot-with-persistent-memory': {
    edits: [[
      `The [context window](/glossary/context-window) resets every time a new conversation starts. Claude does not remember previous sessions by default — it has no persistent state.`,
      `The [context window](/glossary/context-window) resets every time a new conversation starts. The Messages API is stateless: it has no persistent state between requests, and you rebuild the conversation yourself on every call.

Worth separating two things that get conflated. Claude.ai has memory — it retains topic files across your conversations. That is a product feature of the Claude app, not a property of the API you are building against. If you want your chatbot to know a user's name, preferences or history, you are building that yourself.`,
    ]],
  },
}

async function main() {
  let failures = 0
  for (const [slug, p] of Object.entries(E)) {
    const { data, error } = await sb.from('articles').select('slug, body').eq('slug', slug).single()
    if (error || !data) {
      console.error(`✗ ${slug}: could not load — ${error?.message}`)
      failures++
      continue
    }

    let body = data.body as string
    let ok = true
    for (const [from, to] of p.edits) {
      if (!body.includes(from)) {
        console.error(`✗ ${slug}: anchor not found → ${from.slice(0, 70)}...`)
        ok = false
        break
      }
      body = body.replace(from, to)
    }
    if (!ok) { failures++; continue }

    const update: Record<string, unknown> = { body, updated_at: new Date().toISOString() }
    if (p.excerpt) update.excerpt = p.excerpt

    const { error: upErr } = await sb.from('articles').update(update).eq('slug', slug)
    if (upErr) {
      console.error(`✗ ${slug}: update failed — ${upErr.message}`)
      failures++
    } else {
      console.log(`✓ ${slug} — ${p.edits.length} section(s)${p.excerpt ? ' + excerpt' : ''}`)
    }
  }
  if (failures) { console.error(`\n${failures} article(s) failed.`); process.exit(1) }
  console.log('\nTier 2 batch 2 complete.')
}

main().catch((e) => { console.error(e); process.exit(1) })
