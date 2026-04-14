/**
 * Batch 39 — Claude + Tool: Salesforce
 * claude-plus-salesforce
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-39.ts
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
  {
    termSlug: 'connector',
    slug: 'claude-plus-salesforce',
    angle: 'process',
    title: 'Claude + Salesforce: what actually works',
    excerpt: 'The Salesforce connector gives Claude read access to your CRM. The workflows that get real use — account research, pipeline summaries, pre-call prep — are ones where the value is in combining what Salesforce knows with what Claude can reason about.',
    readTime: 7,
    cluster: 'Claude + Tools',
    body: `Salesforce holds more context about your customers than anyone on your team can hold in their head. Deal history, support tickets, stakeholder names, last contact dates, contract values — it is all there. The problem is getting to the right context at the right moment, in a form you can actually think with.

That is where Claude + Salesforce fits. You bring your Salesforce data into Claude and get a conversational interface on top of it — one that can pull multiple records, compare them, and synthesize what is relevant for a specific question.

There is no native click-to-connect Salesforce connector in Claude for most plans. The integration works via three paths: copy-paste workflows (available to everyone), Zapier automations (available to teams or enterprise), or MCP server setup (Claude Enterprise). The workflows below work regardless of which path you use — the difference is just how the Salesforce data gets in front of Claude.

Here is what works in practice.

## What the integration actually does

Whether you copy-paste records into Claude, pipe them in via Zapier, or query them directly via MCP, you are getting the same thing: a way to ask questions about your Salesforce data in plain language instead of building reports or clicking through object views.

You are not automating Salesforce. Claude cannot create or update records — it only reads and reasons about what you give it. This matters because the access model shapes what the workflows are. Every workflow below is "I give Claude CRM context and ask it to do something with that context." Nothing writes back to Salesforce.

## The three workflows that get daily use

### Pre-call research

The most common use case, and the one with the clearest value: pulling everything you need to know about an account before a call, in about 90 seconds.

The workflow: pull the account view, open opportunities, and recent activity from Salesforce. Copy the relevant records into Claude and ask: *"Here is the account data for Acme Corp. What do I need to know before a call with them tomorrow? What should I ask about?"*

What you get is a brief that would have taken 10-15 minutes to compile manually across different Salesforce tabs and views. Account overview, recent deal activity, open issues, last touchpoints — all in one place. The value is not that Claude knows more than your Salesforce does. The value is that you arrive at the call with the context instead of scrambling for it during the first two minutes.

### Pipeline summaries for managers

For sales managers and CS leads who need a snapshot before a pipeline review: export your open opportunities to a CSV or copy the list view, paste it into Claude, and ask it to synthesize.

*"Here is our open pipeline. Summarize the deals that haven't had activity in the last 14 days. Which ones look stalled vs. just slow? What should I be asking my reps about in tomorrow's review?"*

Claude adds a layer of reasoning on top of the raw records: which deals have upcoming close dates that look optimistic given the activity level, which accounts have support tickets open alongside open deals. This is the kind of synthesis a manager does manually before every pipeline meeting — Claude does it in two minutes instead of twenty.

### Post-meeting follow-up drafts

After a customer call, you have notes but no email yet. The follow-up is the thing that separates deals that move from ones that stall. And it usually takes 20 minutes you do not have.

The workflow: paste the account summary from Salesforce and your rough call notes into Claude. *"Here is the account data from Salesforce and my notes from today's call. Draft a follow-up email that references where we left off, confirms the next step, and sounds like it was written by a person."*

Claude has the deal context and your fresh notes, and it produces a follow-up that is specific rather than generic. You edit it down to your voice and send it the same day.

## What does not work well

**Anything that requires updating records.** Claude cannot create or update Salesforce data in any of the integration paths. If you want to log a call, update an opportunity stage, or create a task, you are still doing that in Salesforce.

**Real-time pipeline tracking.** Claude conversations are not live. You are working with a snapshot of data at the moment you paste it in or query it. For anything that needs to update as deals change, that is a Salesforce feature, not a Claude one.

**Complex custom object queries (MCP path).** If you are querying Salesforce directly via MCP, deeply customized instances with many custom objects may not surface the right data — it depends on how your Salesforce schema is structured. Standard objects (Accounts, Contacts, Opportunities, Cases) work reliably.

## Setting it up

**Copy-paste path (everyone):** Export a view or copy relevant records from Salesforce and paste them into Claude before your question. Create a Claude Project for sales/CS work with a system prompt that includes your company context — that way every conversation starts with Claude knowing who you are and what you sell, so the only thing you need to add is the Salesforce data.

**Zapier path (Teams and Enterprise):** You can set up a Zap that exports Salesforce records to Claude on a trigger, or pulls a report into a Claude conversation on demand. Useful for pipeline summary workflows where the export step would otherwise be manual.

**MCP path (Enterprise):** Claude Enterprise supports MCP servers, which means you can connect a Salesforce MCP server and query records directly from Claude in natural language — no copy-paste. This is the closest to a native integration. Setup requires MCP server configuration; it is not a one-click setup.

## The honest version

Claude + Salesforce is most useful for people who live in CRM data every day — sales reps, account managers, CS managers — and for the managers who need pipeline visibility without running reports manually.

It is not a Salesforce replacement or a CRM automation tool. It is a better way to get context from your CRM at the moment you need it. That specific value is real and consistent for the workflows above. Outside of those, the connector is less useful than it first appears.

If you are evaluating it: start with pre-call research. Run ten calls where you used Claude to prep and ten where you did not. The difference in how prepared you feel walking in will tell you whether it is worth building into your regular workflow.

---

*For a broader view of which connectors are worth setting up for your role, [the integrations page](/integrations) breaks them down by team. If you work in customer success specifically, the [CS workflow guide](/articles/cs-manager-ai-workflow) covers how the Salesforce connector fits into a CS manager's week.*`,
  },
]

async function seed() {
  console.log('Seeding batch 39...\n')

  for (const article of ARTICLES) {
    const term = await getTermId(article.termSlug)
    if (!term) {
      console.error(`  ✗ Term not found: ${article.termSlug} (for ${article.slug})`)
      continue
    }

    const { error } = await sb.from('articles').upsert({
      slug: article.slug,
      term_id: term.id,
      term_name: term.name,
      term_slug: article.termSlug,
      cluster: article.cluster,
      title: article.title,
      angle: article.angle,
      body: article.body.trim(),
      excerpt: article.excerpt,
      read_time: article.readTime,
      tier: 2,
      published: true,
    }, { onConflict: 'slug' })

    if (error) {
      console.error(`  ✗ ${article.slug}:`, error.message)
    } else {
      console.log(`  ✓ ${article.slug}`)
    }
  }

  console.log('\nDone.')
}

seed().then(() => process.exit(0))
