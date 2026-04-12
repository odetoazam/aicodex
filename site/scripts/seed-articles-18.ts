/**
 * Batch 18 — Connectors best practices + everyday AI productivity
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-18.ts
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

  // ── 1. Connectors: how to give precise instructions ───────────────────────
  {
    termSlug: 'tool-use',
    slug: 'how-to-write-precise-connector-instructions',
    angle: 'process',
    title: 'How to give Claude precise instructions when using connectors',
    excerpt: 'Vague instructions get vague results. The difference between "find me that doc in Notion" and an instruction that actually works — every time.',
    readTime: 6,
    cluster: 'Agents & Orchestration',
    body: `There is a version of working with connectors that frustrates people, and a version that feels almost automatic. The difference is not the connector itself. It is how precise the instruction is.

When you give Claude a vague instruction — "find me that Notion doc about the Q3 roadmap" — you are asking it to interpret what you meant, search in a way that matches your mental model of how the data is organized, and return something useful. Sometimes it works. Often it does not, and you end up re-asking or doing the search yourself.

The more precise instruction removes interpretation from the equation. Claude does not have to guess at what you mean. It knows exactly what to look for, where, and what to return.

This is a guide to writing connector instructions that work reliably — and the mental model behind why precision matters.

## What a connector actually does

A [connector](/glossary/mcp) gives Claude access to an external tool — Notion, Google Drive, Slack, a CRM, a calendar, a database. When you ask Claude to do something that requires information from that tool, it queries the tool using specific parameters and brings back the results.

The quality of what comes back depends almost entirely on how specific those parameters are. A search query like "roadmap" returns everything that contains the word roadmap. A search query for "pages in the Product workspace tagged Q3 modified after July 1" returns something far more useful.

You are not just describing what you want to a human who will use judgment to fill the gaps. You are specifying a query. The more specific the query, the more useful the result.

## The four elements of a precise instruction

Every effective connector instruction has four components. Not all are needed every time, but knowing them helps you figure out what is missing when an instruction fails.

**1. The resource type**

What kind of thing are you looking for? A document, a row in a database, a message, a task, an event, a contact? Being specific about the resource type focuses the search dramatically.

Vague: "Find the roadmap in Notion."
Precise: "Find the Notion page titled Q3 Product Roadmap."

If you do not know the exact title, narrow by type and location: "Find Notion pages in the Product workspace that contain 'Q3 roadmap' in the title."

**2. The location or scope**

Where should Claude look? Most tools have structure — workspaces, folders, channels, projects, databases. Telling Claude where to look prevents it from searching everything and returning a confusing mix.

Vague: "Check Slack for the conversation about the design feedback."
Precise: "Search the #product channel in Slack for messages about design feedback posted in the last 14 days."

**3. The filter or qualifier**

What properties should narrow the results? Dates, authors, tags, statuses, assignees, labels — most tools have metadata you can filter on. Using it turns a broad search into a targeted one.

Vague: "Pull the open tasks in Linear."
Precise: "Pull Linear issues assigned to me with status In Progress or In Review, sorted by priority."

**4. What to return**

What should Claude do with the results? Summarize them, list them, extract specific fields, draft a response based on them? Specifying the output format prevents Claude from returning a raw dump when you wanted a clean summary.

Vague: "Get my calendar for tomorrow."
Precise: "Get my calendar events for tomorrow between 8am and 6pm. List each one with the title, time, and any attached meeting link. If there are back-to-back meetings with no break, flag them."

## The before/after pattern

Here is what this looks like in practice across common connectors.

**Notion**

Before: "Find the notes from our last team meeting."
After: "Find the Notion page in the Team Meetings database with the most recent date. Return the title, date, and the section called Action Items."

**Google Drive**

Before: "Find the proposal we sent to Acme."
After: "Search Google Drive for files with 'Acme' and 'proposal' in the title, modified in the last 60 days. Return the file name, last modified date, and the link."

**Slack**

Before: "See what people said about the launch."
After: "Search the #announcements and #general channels for messages mentioning 'launch' posted between October 1 and October 15. Summarize the main reactions and any follow-up questions that were raised."

**Linear / Jira**

Before: "What are we working on?"
After: "Pull all Linear issues in the Current Sprint cycle assigned to the Product team. Group them by status: In Progress, In Review, Done. Flag anything with a due date in the next three days."

**CRM (Salesforce, HubSpot)**

Before: "Check the status of the Acme deal."
After: "Find the Acme Corp account in HubSpot. Return the deal stage, last activity date, next follow-up task, and the name of the deal owner."

## When to save instructions as defaults

If you find yourself writing the same precise instruction repeatedly — your daily task list, your weekly meeting notes, your inbox triage — save it as a default instruction in your [system prompt](/glossary/system-prompt) or project context.

The instruction "every morning, pull my Linear issues in progress, my calendar for today, and any Slack DMs I haven't replied to — give me a single prioritized list" becomes a morning routine you run once, not an instruction you type from scratch every day.

The connectors do not need to be re-explained each time. They need to be set up once with precision, tested until they work reliably, and then triggered without friction.

## The debugging pattern when it does not work

When a connector instruction returns the wrong thing, the problem is almost always in one of three places:

**The search terms are too broad.** The word you used appears in many more places than you expected. Add qualifiers — date ranges, specific fields, exact phrases in quotes.

**The scope is wrong.** Claude searched the right tool but the wrong part of it. Specify the workspace, folder, channel, or project explicitly.

**The output is not specified.** Claude returned the raw results instead of processing them. Add a final sentence describing what you want done with the results.

Run through these three checks before concluding the connector does not work. In most cases, the connector is fine — the instruction is just not specific enough.`
  },

  // ── 2. Managing email with Claude ────────────────────────────────────────
  {
    termSlug: 'workflow-automation',
    slug: 'managing-email-with-claude',
    angle: 'process',
    title: 'Managing your email with Claude: the system that actually works',
    excerpt: 'Inbox zero is a distraction. Here\'s how to use Claude to process email faster, write better replies, and stop letting your inbox run your day.',
    readTime: 6,
    cluster: 'Business Strategy & ROI',
    body: `Email is the one productivity problem that never gets solved. Tools come and go. Workflows get set up and abandoned. Folders get created, ignored, deleted. The inbox keeps growing.

The reason nothing sticks is that most email "systems" treat the inbox as an organization problem when it is actually a decision problem. You do not fail at email because your folders are wrong. You fail at email because every message requires a micro-decision — what is this, what do I do with it, when, and how — and most of those decisions are slow or avoided entirely.

Claude is useful here not because it organizes your email, but because it makes the decisions faster and the writing easier. Here is the system.

## The two things Claude actually helps with

**Processing: what is this and what do I do with it?**

The most common reason emails sit in an inbox is not that the response is hard to write — it is that the email requires reading carefully, extracting what matters, and deciding what action it demands. That triage step is where time disappears.

Claude compresses triage. Paste a batch of emails (or use a connector that pulls them), and ask: "For each of these, tell me: what is being asked of me, is it time-sensitive, and what should I do — reply, delegate, or file?"

You are not asking Claude to respond to the emails. You are asking it to do the reading and sorting so your decision-making is faster.

**Drafting: turning your rough thoughts into a complete reply**

The blank-reply problem is real. You know roughly what you want to say, but translating that into a complete, professional email takes time and mental energy you often do not have at the moment the email arrives.

Claude turns a rough set of notes into a complete draft. You do not need to give it a polished brief — just enough to work from.

Prompt: "Draft a reply to this email. My key points: [bullet notes]. Tone should be direct but friendly. Keep it short — five sentences max."

You review, edit lightly, send. The whole thing takes ninety seconds instead of ten minutes.

## The daily email routine

The most effective way to use Claude for email is not email-by-email as they arrive — that is reactive and fragmented. It is a dedicated processing block, once or twice a day, using a consistent routine.

**Morning block (15 minutes)**

Paste or connect your overnight and early-morning emails. Ask Claude to triage: which need a same-day response, which can wait, which are FYI only. For any that need a response, give Claude your rough notes and have it draft. Review and send. Archive or label the rest.

You have cleared your inbox before you start real work. The inbox does not run your day.

**End-of-day block (10 minutes)**

Same routine for afternoon arrivals. The goal is not to respond to everything — it is to know what is in there and have a clear decision about each item, so nothing is sitting in ambiguous limbo.

Most people check email constantly throughout the day and never fully process any of it. Two focused blocks with Claude are more effective and less exhausting.

## Prompts that actually work

**Triage batch:**
"Here are five emails from today. For each one, tell me: (1) what action it requires from me, (2) how urgent it is (today / this week / no deadline), (3) your recommended response — reply, ignore, or forward."

**Draft a reply:**
"Draft a reply to this email. My key points are: [notes]. Keep it under 100 words. Direct, warm, no filler phrases like 'Hope this finds you well.'"

**Draft a difficult message:**
"I need to decline this request without damaging the relationship. My reasons: [reasons]. Draft a reply that is honest but kind. Do not be vague about the fact that I'm saying no."

**Summarize a long thread:**
"Here is an email thread. Summarize the current state: what decision was made, what is still open, and what action is expected from me."

**Write a follow-up:**
"I sent this email [paste original] [X] days ago and haven't heard back. Draft a short follow-up that is friendly and gives them an easy out if they are not interested."

## What Claude is not good at with email

**Reading emotional subtext.** Claude can draft a reply to a difficult email, but it does not know the full history of your relationship with the sender or the political dynamics behind the message. Read difficult emails yourself before you ask Claude to draft the reply.

**Your personal voice.** Claude's first drafts are competent and professional, but they often sound like Claude, not you. Read every draft before sending. Edit for your actual voice — the specific words you use, the level of formality that fits your relationship with this person, your sense of humor when it is appropriate. The draft is a starting point, not a final product.

**Knowing what you should have said.** Claude works from what you tell it. If your brief is incomplete — if you forget to mention a key constraint or a piece of context that changes the reply — the draft will miss it. Brief Claude well, or the draft will need significant rewriting.

## The version for heavy email volume

If you manage a genuinely high volume of email — a hundred or more per day — the ad-hoc paste-and-draft approach will not keep up. The more scalable version uses a connector that pulls emails directly into a Claude conversation, filters by criteria you specify (sender, subject keywords, date range), and returns a pre-sorted list ready for triage.

This requires a setup investment — connecting your email client through Claude's integrations or a tool like Zapier — but once it is working, your daily email routine runs without manual copy-paste. You are making decisions, not handling logistics.

The setup is worth it if email is consistently consuming more than an hour of your day.`
  },

  // ── 3. Weekly review with Claude ─────────────────────────────────────────
  {
    termSlug: 'claude-projects',
    slug: 'weekly-review-with-claude',
    angle: 'field-note',
    title: 'The weekly review with Claude: a system for actually thinking about your week',
    excerpt: 'A weekly review sounds like a productivity cliché — until you do one with Claude. Here\'s the version that takes 20 minutes and actually changes what you do the following week.',
    readTime: 5,
    cluster: 'Business Strategy & ROI',
    body: `Most people who try to do a weekly review give up on it within a month. The ritual sounds valuable in theory — reflect on the week, plan the next one, stay aligned with what matters — but in practice it feels like a lot of thinking and writing for a document nobody reads, including yourself.

The problem is not the weekly review concept. It is the format. Writing a weekly review for an audience of one, where the "output" is a journal entry that lives in a folder, is not compelling enough to make the habit stick.

Using Claude changes the format. Instead of writing to yourself, you are having a conversation that produces specific outputs — a clear-eyed account of what happened, a prioritized list for next week, and decisions that actually get made rather than deferred again. Twenty minutes, every Friday. Here is how.

## The setup

Use a dedicated conversation in a [Claude Project](/glossary/claude-projects) for your weekly reviews. This is important: having the context of previous reviews available means Claude can notice patterns across weeks that you would not catch on your own. By month three, you have a Claude that knows your recurring bottlenecks, your energy patterns, and which commitments you consistently overestimate.

Name the project something you will actually open: "Weekly Operating System" or just "Friday Review."

## The conversation structure

**Part 1: The honest account (5 minutes)**

Start by telling Claude what actually happened this week — not what you planned, what happened. This is a data dump, not a polished narrative. Be specific and include the things that did not go well.

Prompt: "Here is my week. Tell me: what patterns do you see? What did I spend time on that was not in my plan? What did I avoid that probably matters?"

Claude is good at noticing the gap between what you said you would do and what you actually did. That gap is almost always the most important thing to examine.

**Part 2: The processing pass (5 minutes)**

Now clear the decks. What is hanging over from this week that needs to be resolved before next week starts?

Prompt: "Here are the things still in my head that are not done: [list]. Help me decide for each one — do I do it now, schedule it, delegate it, or drop it?"

This is the GTD capture step, done with a thinking partner rather than alone. You will make decisions faster because Claude will push you to be concrete: "Do it now" means you do it today. "Schedule it" means you name the day. "Delegate" means you name who. "Drop it" means you say out loud why it is not worth doing.

**Part 3: Next week (5 minutes)**

What matters most next week? Not everything you have to do — the three or four things that, if they get done, will make the week a success regardless of what else happens.

Prompt: "Based on what I've told you about my priorities and what slipped this week, what should the top three focuses be next week? What should I protect time for? What should I push back on or say no to?"

Claude will sometimes push back on your priorities. When it does — when it says "you've mentioned X three weeks in a row as a priority and it keeps not happening, is it actually a priority or is it something you feel guilty about not doing?" — that is the value of having context across weeks.

**Part 4: The one decision (5 minutes)**

Every good weekly review surfaces one thing you have been avoiding deciding. Not an action item — a decision. Should you end this client relationship? Should you change how you are approaching this project? Should you have a conversation you have been putting off?

Prompt: "What is the one thing I'm clearly avoiding deciding, based on what I've told you this week and in previous weeks? What would it look like to make that decision today?"

You do not have to decide it in the review. But naming it out loud, with Claude reflecting it back to you, removes the ability to pretend it is not there.

## What you leave with

At the end of twenty minutes you should have:
- A clear account of what actually happened this week (not a sanitized version)
- A resolved list of loose ends — each one either scheduled, delegated, or dropped
- Three specific priorities for next week
- One decision named, even if not yet made

This is not comprehensive. It is not a productivity system. It is the minimum viable weekly review — the version that is honest enough to be useful and short enough to actually do.

## The longer-term payoff

After eight to ten weeks of using the same Project, Claude starts to see things you cannot see in a single session. It will notice that you consistently overcommit on Mondays, that your energy for strategic work disappears in the afternoon, that a specific recurring meeting is consistently listed as a frustration but never examined.

These patterns are hard to see week-to-week. They become obvious in the aggregate. That is the payoff of keeping the reviews in the same Project instead of starting fresh each time.`
  },

  // ── 4. Cleaning up your computer with Claude ──────────────────────────────
  {
    termSlug: 'ai-augmentation',
    slug: 'using-claude-to-declutter-your-digital-life',
    angle: 'process',
    title: 'Using Claude to declutter your digital life',
    excerpt: 'Your Downloads folder, your desktop, your bookmarks, your subscriptions — the digital clutter that accumulates until your computer feels like a junk drawer. Here\'s how Claude helps you actually deal with it.',
    readTime: 5,
    cluster: 'Business Strategy & ROI',
    body: `There is a specific kind of digital procrastination that almost everyone experiences: the junk that accumulates in plain sight, that you know you should deal with, that you keep deferring because the act of deciding what to do with each item is more friction than it seems worth.

Your Downloads folder with four hundred files. Your desktop covered in screenshots. Your browser with forty-seven open tabs. Your email with a hundred subscriptions you never read. Your phone apps you have not opened in six months.

The clutter is not actually the problem — the decisions are. Every file, every tab, every subscription requires a small act of judgment: keep this or delete it, use this or unsubscribe, file this or let it sit. When every decision is slightly annoying and none of them feel urgent, they all get deferred.

Claude helps by removing the friction from the decision step. You still make the decisions — but Claude does the thinking work of categorizing, suggesting, and framing the choices, so you are making fast yes/no calls instead of slow open-ended ones.

## The Downloads folder

The Downloads folder is the easiest place to start because everything in it is technically disposable until proven otherwise — if you needed it long-term, you should have filed it somewhere already.

**Step 1: Get a list of what's there**

On a Mac or Windows, you can paste a directory listing into Claude. On Mac, open Terminal and run:
\`ls -lh ~/Downloads\`

Copy the output and paste it into Claude.

**Step 2: Let Claude categorize it**

Prompt: "Here is a list of files in my Downloads folder. Group them into: (1) things I probably need to keep and file somewhere, (2) things I can almost certainly delete, (3) things I need to look at before deciding. For each group, be specific about why."

Claude will identify patterns — the PDFs that look like tax documents versus the PDFs that look like marketing brochures you downloaded once and forgot about, the zip files you never opened, the installers for apps you already installed.

**Step 3: Make decisions fast**

Work through the "need to look at" list quickly. For each item, the decision is binary: file it somewhere or delete it. Claude can help you decide: "This looks like a contract from 2022 — is this something you'd need for tax purposes or legal reference? If yes, file it in your Documents with a descriptive name. If no, delete."

The goal is not a perfect filing system. It is a folder with nothing that should not be there.

## The email subscription audit

Everyone has subscriptions they do not read. The reason they do not get unsubscribed is that each individual one feels too small to bother with — it only takes a second to delete each email, and finding the unsubscribe link takes longer. So they keep arriving.

The audit takes thirty minutes once and then almost nothing afterward.

**Step 1: List your subscriptions**

Go through your inbox and list the email senders that appear regularly — newsletters, product updates, notifications, promotional emails. Paste the list into Claude.

Prompt: "Here are the email senders that regularly hit my inbox. For each one, help me decide: (1) does this actively add value to my life or work, (2) do I just not get around to deleting it but would not miss it, or (3) do I genuinely not know what this is? Flag any that look like they might be hard to unsubscribe from."

**Step 2: Act immediately on the obvious ones**

The "genuinely do not know what this is" category almost always gets deleted. The "do not get around to deleting it" category gets unsubscribed — pull up each sender and unsubscribe before moving on.

For the ones that add value: keep them, but consider whether you have a reading habit that actually captures them, or whether they just accumulate in a folder you never open.

## The open tabs

If you have more than fifteen tabs open, you have a decision backlog. The tabs are not information — they are deferred decisions about whether something is worth reading.

Paste your open tab titles into Claude (on Chrome, right-click on any tab → "Copy all URLs" or use the Tab Manager extension to get a list).

Prompt: "Here are my open tabs. Categorize them: (1) things I should actually read this week, (2) things I should bookmark and schedule for later, (3) things I opened out of curiosity but will realistically never come back to. Be honest."

The third category is usually 70-80% of the list. Close those tabs. The relief is immediate and disproportionate.

## The phone app audit

List every app on your phone. The fastest way: scroll through your home screens and app library and type out the names, or use a screenshot and describe what you see.

Prompt: "Here are the apps on my phone. Which ones are worth keeping based on what you know about me and typical usage patterns? Flag any that are probably duplicates of something else I use, any that I am likely keeping out of guilt rather than use, and any that are likely draining battery or attention."

Delete everything in the guilt category. You can always reinstall.

## The recurring theme

The pattern across all of these: digital clutter accumulates not because you are disorganized but because the decision cost of each individual item is higher than the consequence of leaving it. Claude lowers the decision cost by doing the categorization work, framing each choice as a simple yes/no, and giving you a reason to decide rather than defer.

You still make every decision. Claude just makes sure you actually make them, instead of walking past the junk drawer for the hundredth time.`
  },

]

async function main() {
  console.log(`Seeding ${ARTICLES.length} articles (batch 18 — connectors + productivity)…\n`)

  for (const art of ARTICLES) {
    const term = await getTermId(art.termSlug)
    if (!term) {
      console.error(`  ✗ Term not found: ${art.termSlug}`)
      continue
    }

    const { error } = await sb.from('articles').upsert({
      slug: art.slug,
      term_id: term.id,
      term_name: term.name,
      term_slug: art.termSlug,
      cluster: art.cluster,
      title: art.title,
      angle: art.angle,
      body: art.body.trim(),
      excerpt: art.excerpt,
      read_time: art.readTime,
      tier: 3,
      published: true,
    }, { onConflict: 'slug' })

    if (error) {
      console.error(`  ✗ ${art.slug}:`, error.message)
    } else {
      console.log(`  ✓ ${art.slug}`)
    }
  }

  console.log('\nDone.')
}

main().catch(console.error)
