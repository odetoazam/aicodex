/**
 * Update connectors-skills-role article:
 * - Fix outdated Skills description
 * - Add toggling strategy
 * - Add token cost awareness
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/update-connectors-article.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const body = `Out of the box, Claude is capable but isolated. It can write, reason, and analyse — but only with what you give it in the conversation. [Connectors](/glossary/connector) change that by linking Claude to the tools and files you already work in.

## What Connectors actually do

A connector gives Claude read access — and sometimes action access — to an external service. Google Drive, Notion, Slack, Jira, Salesforce, Gmail, and many more. Instead of copying and pasting content into the chat, you ask Claude a question and it pulls the relevant information directly.

The practical difference: "Summarise the meeting notes from last Tuesday" just works, instead of requiring you to find the doc, open it, copy it, paste it, then ask.

Some connectors are read-only. Others let Claude take actions — creating tasks, drafting messages, updating records. The permission scope depends on what you grant when you set it up, and you can adjust individual permissions at any time in the connector's settings.

## You don't need to leave all of them on

This is the thing nobody tells you: having every connector active in every conversation isn't necessarily better. When a connector is enabled, Claude considers it as a potential source for every query. That means more overhead, more token usage, and occasionally Claude pulling from a source that wasn't relevant to what you were asking.

A better approach: keep connectors active that apply to your current work context, and disable the ones that don't. Most connector interfaces let you toggle them without fully disconnecting — you're not losing the integration, just pausing it.

If you're doing writing work: Google Drive is relevant. Jira probably isn't.
If you're triaging bugs: Jira and GitHub are relevant. Your CRM probably isn't.

Switching contexts? Switch your connector set.

## Connectors consume tokens

When Claude reads from a connector, the content it retrieves lands in your context window. A precise query that returns one relevant doc is fast and cheap. A vague query that returns fifteen documents — most of which aren't what you wanted — is slow and expensive.

This is why the way you phrase connector requests matters more than it might seem. "Find the Q3 roadmap in Notion" is a broad query. "Find the Notion page titled Q3 Product Roadmap in the Product workspace" is a specific one. The second costs fewer tokens, runs faster, and gives Claude something it can actually use.

For repeatable requests — daily task list, weekly pipeline summary, inbox triage — it's worth investing ten minutes to write a precise instruction once. Save it in your [project instructions](/glossary/project-instructions). Run it every time without rewriting it.

## What's worth connecting first

**Google Drive / Notion / Confluence** — if your team stores docs there and you find yourself copy-pasting things into Claude, connect it. One setup, zero copy-paste from then on.

**Jira / Linear / Asana** — for anyone who needs to track or update tasks without switching tabs constantly.

**Slack / Gmail** — useful for context retrieval ("what did we decide about X?") but be deliberate about action permissions. Having Claude draft a reply is useful. Having it send without review is a different risk level.

**Salesforce / HubSpot** — high value for sales and CS teams who need account context without navigating CRM screens.

Start with one. The habit of working with a connected tool is what matters — not having everything connected at once.
`

async function main() {
  const { error } = await sb
    .from('articles')
    .update({
      body,
      updated_at: new Date().toISOString(),
    })
    .eq('slug', 'connectors-skills-role')

  if (error) {
    console.error('✗ connectors-skills-role:', error.message)
  } else {
    console.log('✓ connectors-skills-role updated')
  }
}

main().catch(console.error)
