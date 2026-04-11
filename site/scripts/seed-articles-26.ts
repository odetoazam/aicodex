/**
 * Batch 26 — "Claude + Tool" workflow guides
 * High-SEO articles that nobody else writes: Claude + Notion, Sheets, Slack, Zapier, Docs, HubSpot
 * Permanent moat content — Anthropic can't write these, competitors don't.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-26.ts
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

  // ── 1. Claude + Notion ─────────────────────────────────────────────────────
  {
    termSlug: 'connector',
    slug: 'claude-plus-notion',
    angle: 'process',
    title: 'How to use Claude with Notion: a practical guide',
    excerpt: "You've heard people talk about using Claude and Notion together. Here's exactly what that looks like — what to set up, which workflows actually save time, and what doesn't work.",
    readTime: 8,
    cluster: 'Tools & Ecosystem',
    audience: ['operator', 'user'],
    body: `Claude and Notion work together in three ways, and it is worth knowing which one applies before you start. The most common mistake is thinking they are more integrated than they are.

## The three ways Claude and Notion work together

**1. The Connector (inside Claude.ai)**

If you are on Claude Pro, Team, or Enterprise, you can link your Notion workspace directly from the Connectors section. Once connected, Claude can read your Notion pages, databases, and wikis — without you copying and pasting anything.

How to set it up:
- In Claude.ai, click the plug icon or go to Settings → Connectors
- Add Notion and authorize Claude to access your workspace
- Claude now has read access to your pages

What this gives you: Ask Claude questions about your Notion pages directly. "Summarize our company handbook." "What does our onboarding doc say about the first week?" "Which pages mention the quarterly budget?"

One important limitation: the Connector is currently read-only. Claude can read Notion but cannot create new pages or update existing ones directly through this connection.

**2. Copy-paste (works on any plan)**

The simplest approach, and often the fastest. Copy content from a Notion page, paste it into Claude's chat, and ask what you need. Works on Free, Pro, and every other plan, with no setup.

**3. Claude creates content, you paste it into Notion**

Claude writes something in response to your prompt — a wiki page, a process doc, a meeting summary — and you paste it into Notion. No integration needed. This is how most people actually use the two tools together.

## Three workflows that save real time

**Workflow 1: Turning messy meeting notes into proper documentation**

Most teams have Notion pages full of half-formed notes from calls, brainstorms, and standups. Useful as raw input but never actually read because they are hard to follow.

How to do it:
- Copy the raw notes from Notion
- Paste into Claude with: "Clean this up into structured documentation. Use headers and short paragraphs. Organize by topic. Keep all the content — just make it readable."
- Review Claude's output, make any adjustments, and paste it back into Notion

Time saved: 20 to 40 minutes per page of messy notes, and the output is actually used.

**Workflow 2: Building out a company wiki from scratch**

If you have been putting off documenting your processes because it feels like too big a project, Claude can turn a rough verbal description into a proper wiki page in minutes.

How to do it:
- Describe your process to Claude in plain language. It does not need to be organized. "Here's how we onboard a new client: first we send them a welcome email, then we schedule a kickoff call, then we set up their project folder..."
- Ask: "Write this as a Notion wiki page with a clear structure, numbered steps, and a 'common mistakes' section at the end."
- Paste the result into Notion and refine from there

This works especially well for processes you know how to do but have never written down.

**Workflow 3: Summarizing Notion pages before meetings**

Long Notion docs that nobody reads before meetings are a universal problem. Claude can give you a two-minute brief on any page.

If you have the Connector set up: "Summarize our product roadmap page in five bullet points. Focus on the highest-priority items for this quarter."

If you are copy-pasting: Copy the page, paste into Claude with: "TL;DR this in under 200 words. Focus on what decisions need to be made."

Use this before any meeting where someone says "did everyone read the doc?" You can read the doc in a minute and show up prepared.

## Common pitfalls

**Expecting Claude to update Notion automatically**

The Connector is read-only. Claude can read your pages and answer questions, but it will not create or update Notion content through the integration. If you want Claude to write to Notion automatically, you need a separate automation tool like Zapier or Make.

**Asking Claude to "look at your Notion" without specifying what**

After connecting, Claude does not browse your entire workspace automatically. You still need to tell it what to look at: "Check our Q4 planning page" or "Look at our client onboarding checklist." Be specific.

**Forgetting about formatting differences**

Notion uses its own formatting conventions: toggles, callout blocks, database views. Claude's output is clean text but not Notion-native. Ask Claude to "format this for a Notion wiki page" and it will lean toward headers, bullet lists, and short paragraphs — which paste in cleanly. You may still need to add specific Notion blocks manually.

**Copy-pasting huge Notion databases**

Notion databases with hundreds of rows are not ideal to paste into Claude. For database analysis, export to CSV and paste that instead — Claude handles tabular data better in that format.

## The honest verdict

Claude plus Notion is genuinely useful, mostly for the documentation creation and synthesis workflows. The Connector is worth setting up if you are on a paid plan — it removes the copy-paste step for the most common task: asking Claude questions about documents you already have in Notion.

What it will not do: replace Notion's own AI features, automatically update your pages, or index everything in your workspace without you pointing it somewhere specific.

**Best for:** Documentation-heavy teams, founders building their knowledge base, anyone who accumulates meeting notes and never gets around to organizing them.

**Skip if:** You mostly use Notion as a personal task manager. The real value is in document-heavy workspaces.`,
  },

  // ── 2. Claude + Google Sheets ──────────────────────────────────────────────
  {
    termSlug: 'tool-use',
    slug: 'claude-plus-google-sheets',
    angle: 'process',
    title: 'Claude for Google Sheets: what actually works',
    excerpt: "Claude can't open your spreadsheets directly — but it can write the formulas, clean your data, explain your numbers, and build a spreadsheet from scratch. Here's what works and what doesn't.",
    readTime: 7,
    cluster: 'Tools & Ecosystem',
    audience: ['operator', 'user'],
    body: `Claude cannot connect to Google Sheets the way it connects to Google Drive. It cannot open a spreadsheet URL, read live data, or update cells in real time. But it is still genuinely useful for spreadsheet work — once you understand exactly how.

## What Claude can and cannot do with spreadsheets

**Can do:**
- Write formulas for you (including complex ones with nested functions)
- Explain what a formula does in plain language
- Debug formulas that are not working
- Analyze data you paste in as text or a table
- Build a spreadsheet structure from scratch and give you the formula logic
- Write Google Apps Script to automate Google Sheets tasks

**Cannot do (without extra setup):**
- Open a Google Sheets URL or read live data
- Update cells directly
- See changes you make in real time

The workaround for most situations: paste the relevant data into Claude as text or copy a table from your sheet. Claude can work with tabular data pasted as plain text surprisingly well.

## Four workflows that save real time

**Workflow 1: Getting formulas written for you**

Most people know what they want a formula to do but not how to write it. Claude is excellent at this.

How to use it: Describe what you want in plain English.

Examples:
- "I need a formula that looks up a customer name from column A, finds their total spend in column C, and returns it in column E."
- "Write a COUNTIFS formula that counts rows where column B is 'paid' and column D is after January 1 2025."
- "I want to calculate the average of a range, but only for cells where the value in the next column is not blank."

Paste Claude's formula into your sheet. If it does not work, paste the error message back and ask Claude to fix it.

**Workflow 2: Cleaning and standardizing messy data**

If you have a spreadsheet with inconsistent formatting — dates in different formats, names in mixed case, extra spaces, trailing characters — Claude can write the formulas or scripts to clean it.

How to use it: Describe the problem.

"I have a column of phone numbers in different formats: some have dashes, some have dots, some have spaces, some start with +1. Write a formula that strips everything and returns just the 10 digits."

"My date column has entries like 'Jan 5', 'January 5th', '1/5/25', and '2025-01-05'. Write a Google Sheets formula to standardize all of these to MM/DD/YYYY."

For larger cleaning jobs, ask Claude to write a Google Apps Script instead of a formula — it can handle row-by-row transformations that formulas can't.

**Workflow 3: Analyzing data you paste in**

For data sets small enough to paste (a few hundred rows or a manageable table), paste directly into Claude and ask questions.

How to do it:
- Copy your sheet (or the relevant section) and paste it into Claude
- Ask specific questions: "Which product category has the highest average order value?" or "Summarize the trends in this data. What stands out?"
- Ask Claude to identify anomalies: "Are there any rows that look wrong or out of place?"

For very large data sets that cannot fit in a single message, export to CSV and paste the first few hundred rows, then describe what you are trying to understand.

**Workflow 4: Building a spreadsheet structure from scratch**

If you need to build a tracker, dashboard, or reporting template and do not know where to start, describe what you need and ask Claude to design it.

"I need a spreadsheet to track agency client projects. I want to see: client name, project status, estimated hours, actual hours, invoice amount, invoice status, due date. What columns and structure do you recommend, and what formulas should I use for summary calculations?"

Claude will give you a column structure, recommended formulas, and sometimes a full formula set you can paste in.

## Common pitfalls

**Pasting a formula without adapting the cell references**

Claude writes formulas with placeholder references like A2, B:B, or Sheet1!C:C. These will need to match your actual sheet layout. Read the formula before pasting — or paste it in and then tell Claude "the formula is returning an error, my columns are actually arranged like this."

**Asking Claude to analyze data it cannot see**

Claude can only work with data you share in the conversation. If you say "analyze my sales spreadsheet" without pasting any data, it can only give you generic advice. Share the data first.

**Expecting real-time integration without setup**

Claude does not connect to Google Sheets out of the box. If you want Claude to read or write to a live sheet automatically, you need to build that with Google Apps Script, Zapier, or Make. That is a separate project.

**Pasting too much at once**

If your sheet has tens of thousands of rows, do not try to paste all of it. Describe the structure and paste a representative sample (50-100 rows). Ask Claude to write the formulas or logic based on the structure, then apply it yourself.

## The honest verdict

Claude is most useful for Google Sheets work on the formula and logic side. It saves significant time when you know what you want to calculate but not how to write it — and it is the fastest way to debug formulas that are not working.

For data analysis, it works well with moderate data sets pasted directly in. For very large or live data, you need more infrastructure.

**Best for:** Non-technical users who need formulas they can not write themselves, analysts who want a faster way to explore and clean data, teams building spreadsheet templates.

**Skip if:** You are comfortable writing complex formulas yourself, or you need real-time spreadsheet integration — that requires a different setup.`,
  },

  // ── 3. Claude + Slack ──────────────────────────────────────────────────────
  {
    termSlug: 'connector',
    slug: 'claude-plus-slack-for-teams',
    angle: 'process',
    title: 'Setting up Claude in Slack: what to configure and what to skip',
    excerpt: "Claude works natively inside Slack through a built-in integration. Here's what it actually does, how to set it up properly, and whether it's worth using for your team.",
    readTime: 7,
    cluster: 'Tools & Ecosystem',
    audience: ['operator', 'user'],
    body: `Claude has a native Slack integration, and it is one of the more useful AI tools for teams that live in Slack. But most teams set it up without thinking about how they actually want to use it — and then it just sits there.

This guide covers what the integration actually does, how to configure it to be useful, and the workflows that consistently save time.

## What the Claude-Slack integration does

Once installed, Claude shows up in Slack as an app you can:
- Message directly in its own DM channel
- @mention in any channel or thread
- Use to process the conversation context it can see

The important boundary: Claude can only see messages in conversations where it has been explicitly invited or @mentioned. It does not have access to your entire Slack workspace by default. This is a deliberate privacy feature.

## How to install Claude for Slack

1. Go to claude.ai and navigate to the Slack integration page (or search "Claude for Slack" in the Slack App Directory)
2. Click "Add to Slack" and authorize the integration
3. Claude will appear as an app in your workspace
4. You can now DM Claude directly or invite it to channels where you want it available

For Team and Enterprise plans, admins can install Claude workspace-wide and control which channels have access.

## Five workflows that save real time in Slack

**Workflow 1: Catching up on long threads without reading every message**

The most universally useful thing Claude does in Slack. Any thread that has gone on for more than 20 messages can be summarized instantly.

How to do it: In the thread, @mention Claude: "@Claude summarize this thread for me. What are the key points and any decisions made?"

Claude reads the thread and gives you a one-paragraph catch-up. Useful when you come back to a long discussion after being away, or when someone has been added to a project channel partway through a conversation.

**Workflow 2: Drafting replies to customer questions**

For customer success and support teams, Claude can draft professional responses to customer messages inside the channel.

How to do it: When a customer message comes in, reply in thread: "@Claude draft a friendly reply to this. The answer is [your short summary of the answer]. Keep it under three sentences."

Claude drafts it; you review, edit, and send. Reduces the time to respond to routine questions significantly.

**Workflow 3: Meeting the team where they are for quick AI questions**

Instead of switching to Claude.ai every time someone has a quick question, they can ask Claude directly in Slack.

Example uses:
- "@Claude how should I phrase a decline email to a vendor we are not moving forward with?"
- "@Claude explain what an NPS score is — a new team member is asking"
- "@Claude proofread this customer email I am about to send"

This works best in a dedicated #ai-assistant channel where people are comfortable trying things, or in direct messages to Claude.

**Workflow 4: Processing and summarizing information shared in Slack**

When someone pastes a long document, meeting notes, or a chunk of text in Slack, Claude can immediately process it.

"@Claude here are the notes from our board meeting [paste]. Summarize the action items and who owns each one."

**Workflow 5: Quick research without leaving Slack**

For straightforward questions that do not need a full Claude.ai session, asking Claude in Slack is faster.

"@Claude what is the standard notice period for GDPR data deletion requests?"

Note: Claude's Slack integration uses the same model you have access to on Claude.ai. It has the same knowledge cutoff and the same limitations on real-time information.

## Configuration decisions worth making

**Which channels to add Claude to**

Do not add Claude to every channel. It can be jarring to see Claude @mentioned in social channels or sensitive HR discussions. Consider:

- A dedicated #claude or #ai-assistant channel for experimentation
- Your primary CS or support channel if you want the draft-reply workflow
- Your ops or project management channel if you want thread summaries
- DMs to Claude for individual use

**Setting a custom prompt (for Team and Enterprise)**

Admins on paid plans can configure a default system prompt for the Claude Slack integration. Use this to give Claude context about your team: what you do, your tone standards, terms you use, anything you would otherwise have to repeat each time.

Example system prompt for a CS team: "You are helping the customer success team at [Company]. We use Salesforce as our CRM. Our customers are mid-market SaaS companies. Keep responses concise and professional. When drafting customer replies, use a warm but direct tone."

## Common pitfalls

**Adding Claude to sensitive channels**

Claude can read messages in channels it is added to. Do not add it to HR channels, legal discussions, M&A discussions, or any channel where the conversation is confidential beyond the participants. Check your company's AI usage policy before installing.

**Expecting Claude to remember across conversations**

By default, Claude does not have persistent memory across Slack conversations. Each DM session with Claude is independent unless you configure memory through Claude.ai's settings.

**Forgetting that Claude needs to be in the channel to see the thread**

Claude cannot see messages in channels it has not been added to. If you @mention Claude in a channel where it is not installed, it will not appear. You need to invite it: "/invite @Claude" in the channel.

**Relying on Claude for real-time information**

Claude in Slack does not have web search unless you have explicitly enabled that feature. For questions about current events or live data, remind your team that Claude's answers reflect its training data, not today's information.

## The honest verdict

The Claude-Slack integration earns its keep for teams that live in Slack. The thread summary and draft-reply workflows alone justify the setup time for most customer-facing teams.

The biggest benefit is meeting people where they already are: if your team is reluctant to add another tool to their workflow, having Claude available inside Slack removes that barrier.

**Best for:** Customer-facing teams (CS, support), companies that run primarily through Slack, anyone who regularly needs to catch up on long threads.

**Lower value for:** Teams that prefer focused, longer Claude sessions; companies with strict data policies about third-party AI tools in communication channels; smaller teams where Slack is mostly social.`,
  },

  // ── 4. Claude + Zapier ─────────────────────────────────────────────────────
  {
    termSlug: 'workflow-automation',
    slug: 'claude-plus-zapier',
    angle: 'process',
    title: 'Automating workflows with Claude and Zapier',
    excerpt: 'Zapier connects Claude to almost any tool you already use — without writing code. Here are the automations worth building, how to set them up, and what to watch for.',
    readTime: 9,
    cluster: 'Tools & Ecosystem',
    audience: ['operator', 'founder'],
    body: `Zapier plus Claude is where AI goes from something you use manually to something that works in the background. The combination lets you route Claude into any workflow that Zapier supports — and Zapier connects to more than six thousand apps.

This guide covers how the integration works, which automations are worth building, and the most common failure modes.

## How Claude + Zapier works

Zapier's Claude integration (officially called the "Anthropic Claude" Zap step) lets you send text to Claude and receive a response as part of any Zap. This means Claude becomes a step in your automation — not a tool you visit manually.

The basic pattern: something triggers a Zap (a new email, a form submission, a Slack message, a new row in a spreadsheet) → the Zap sends relevant text to Claude with a prompt → Claude responds → the response gets sent somewhere useful (a Slack notification, a reply email, a new row in a sheet, a Notion page).

You need a Zapier account (paid plan for multi-step Zaps, which most of these require) and a Claude API key from the Anthropic Console.

## Four automations worth building

**Automation 1: Customer form → auto-drafted response in Gmail**

Every customer inquiry or support request gets a drafted reply waiting in your drafts folder — not sent automatically, just ready for you to review and fire.

How it works:
- Trigger: New form submission (Typeform, Google Forms, or your website form)
- Step 1: Send the submission content to Claude with a prompt: "A customer submitted the following inquiry: [inquiry text]. Draft a professional, friendly reply that acknowledges their question and lets them know someone will follow up within one business day. Keep it under 150 words."
- Step 2: Create a Gmail draft addressed to the submitter with Claude's response as the body

Result: Instead of writing each reply from scratch, you have a solid draft waiting. Review takes 30 seconds instead of three minutes.

**Automation 2: Slack message → weekly summary digest**

Collect all messages from a key Slack channel throughout the week, then get Claude to summarize them into a digest sent on Friday afternoon.

How it works:
- Trigger: Schedule (every Friday at 4pm)
- Step 1: Use Zapier to pull all messages from a specific Slack channel from the past seven days
- Step 2: Send to Claude: "Here are the Slack messages from our #customer-feedback channel this week: [messages]. Summarize the main themes, any recurring issues, and the most important feedback. Format as a short weekly digest."
- Step 3: Send the summary to a designated email or post it in a #weekly-digest Slack channel

Result: Everyone stays informed about key channel activity without having to read every message.

**Automation 3: New contact in CRM → personalized outreach draft**

When a new lead or contact is added to your CRM (HubSpot, Pipedrive, Salesforce), Claude drafts a personalized first-touch email based on what you know about them.

How it works:
- Trigger: New contact added in HubSpot (or your CRM)
- Step 1: Pull available contact fields: name, company, industry, job title, how they were acquired
- Step 2: Send to Claude: "Draft a personalized introductory email to [name], who is the [job title] at [company] in the [industry] industry. They found us through [source]. Keep it short — three sentences maximum. Do not mention anything we can not confirm. End with a low-friction question to open a conversation."
- Step 3: Create a draft email in Gmail or add a task note in HubSpot

Result: The rep reviews the draft, personalizes the one or two details that need touching, and sends. First-touch time drops from five minutes to one.

**Automation 4: New Google Sheets row → structured AI analysis**

For any process where you are collecting data in a spreadsheet and need consistent analysis on each row — job applications, vendor evaluations, product feedback — Claude can run through each entry and add a summary or recommendation column.

How it works:
- Trigger: New row added to Google Sheets
- Step 1: Send the row contents to Claude with a structured prompt: "Here is a product feedback submission: [row content]. Rate the severity from 1-5, identify which product area it relates to (choose from: onboarding, pricing, support, features, performance), and write a one-sentence summary. Return your response as: Severity: X | Area: Y | Summary: Z"
- Step 2: Add Claude's output to columns in the same row in Google Sheets

Result: Every new entry is instantly categorized and summarized. No manual triage required.

## How to set up the Claude step in Zapier

1. In your Zap, add a new step and search for "Anthropic Claude"
2. Choose "Send Prompt" as the action
3. Connect your Anthropic account using your API key (from console.anthropic.com)
4. In the "Prompt" field, write your instruction to Claude — you can insert Zapier variables (like {{form_field_name}}) to pull in dynamic content from the trigger
5. Select a model (Claude Sonnet is the right choice for most automation use cases — good quality, reasonable cost)
6. Map Claude's response output to whatever step comes next

The most important part: write your prompt in the Zapier step as if you were writing it manually. The more specific you are about the desired output format, the more reliably the automation works.

## Getting the prompts right for automation

When Claude is running automatically without you reviewing the prompt, the stakes are higher. A vague prompt produces inconsistent output. In an automation, inconsistent output breaks downstream steps.

Follow these rules for automation prompts:

**Be explicit about the output format.** If the next step needs to read a specific field, tell Claude exactly what to return. "Return only the email subject line, with no other text." Not "write a subject line."

**Anticipate edge cases.** What should Claude do if the input is empty? If the customer's message is abusive? If the data is missing key fields? Give Claude fallback instructions: "If the submission is empty or unclear, return only the word 'REVIEW'."

**Test with real examples.** Before turning on your Zap, test it with actual data from your trigger. What Claude produces in the Zapier test mode is what will actually run.

**Keep prompts focused.** Automation prompts should do one thing well. If you need Claude to do three different things, consider three separate steps or three separate Zaps.

## Common pitfalls

**Sending Claude output directly to customers without review**

Claude is good enough to draft, but not infallible. Never fully automate customer-facing communications without a human review step, at least initially. Build the automation to create a draft or a queue for review, not to send automatically.

**Underestimating API costs at volume**

Every Zap step that calls Claude costs tokens. If your Zap triggers hundreds of times per day, check your projected API cost before going live. Claude Haiku is the most cost-efficient model for simple, repetitive tasks — Sonnet for tasks where quality matters more.

**Ignoring rate limits**

If your Zap triggers very frequently (more than once per second at peak), you may hit API rate limits. Zapier retries on failure by default, but at high volume you may need to build in delays or use Zapier's Delay step to spread requests.

**Not handling API errors**

If Claude's API returns an error, your Zap fails. Add error handling: in Zapier, use the "Filter" step to check whether Claude's response is empty or contains an error keyword, and route accordingly.

## The honest verdict

Claude plus Zapier is the fastest way to get AI working in your actual workflow without writing code. The setup is accessible to non-technical users, and the potential use cases are essentially unlimited — anywhere you have a repetitive task that involves reading or writing text, this combination can help.

The effort is front-loaded: getting the prompt right and testing the Zap properly takes a few hours the first time. After that, it runs without you.

**Best for:** Ops and CS teams with high-volume repetitive tasks, founders who want AI working in the background without maintaining code, anyone who already uses Zapier for automation.

**Not the right fit for:** Tasks that require real-time responses (Zapier has a delay), anything where accuracy is so critical that no draft can go unreviewed, or teams with very limited Zapier budgets (multi-step Zaps require a paid Zapier plan).`,
  },

  // ── 5. Claude + Google Docs ────────────────────────────────────────────────
  {
    termSlug: 'ai-augmentation',
    slug: 'claude-plus-google-docs',
    angle: 'process',
    title: 'Using Claude for Google Docs: document collaboration that actually works',
    excerpt: 'Claude is not built into Google Docs — but the right workflow makes it feel like it is. Here is how to use Claude effectively alongside Docs without losing your mind to copy-pasting.',
    readTime: 6,
    cluster: 'Tools & Ecosystem',
    audience: ['operator', 'user'],
    body: `Claude does not have a native Google Docs plugin yet — there is no sidebar that lets you select text and ask Claude a question directly. But the right workflow makes the gap manageable, and the results are good enough that most people stop noticing the friction.

Here is how to make it work.

## The three main approaches

**Approach 1: Side-by-side workflow (most people's best option)**

Open Claude.ai and your Google Doc in separate browser windows. Copy sections of your document into Claude when you need help; paste Claude's output back into the Doc.

This is less seamless than a native integration, but it works on every plan and gives you full control. For most document work, this is the right starting point.

**Approach 2: Use the Google Drive Connector (Pro and above)**

If you connect Google Drive to Claude.ai, Claude can read documents directly from your Drive. You still cannot edit the Doc through Claude — but you can ask Claude questions about documents without copy-pasting them.

"Read my Q3 board update doc in Drive and summarize it in three sentences."

"Look at the [client proposal] in my Drive and tell me if the pricing section is clear."

For long documents you want Claude to analyze without the hassle of copying, this is the better option.

**Approach 3: Paste the entire document**

For shorter documents (under about 30 pages), paste the full content into Claude and work through the whole thing at once. Useful for editing passes, structural feedback, or rewrites where you want Claude to see the whole picture.

## Five document tasks Claude handles well

**Task 1: First-draft creation from an outline or notes**

Describe what you need the document to be — its purpose, audience, length, tone — and Claude writes a draft. Even a rough draft cuts the blank-page problem significantly.

Prompt pattern: "Write a first draft of a [document type] for [audience]. The main purpose is [goal]. Here are my rough notes or key points: [paste]. Format it with clear headers and short paragraphs. Length: approximately [target]."

Then edit in Google Docs as normal.

**Task 2: Editing passes**

Paste a section or the full document and ask Claude for a specific type of edit:

- "Edit this for clarity. Cut anything that is not essential. Keep my voice — do not formalize it."
- "This document is too long. Cut it by 30% without losing the key points."
- "Rewrite the introduction — it is too slow to get to the point."
- "Check the structure. Does the argument flow logically? What is missing?"

Claude is genuinely good at structural editing and cutting. It is less good at subtle tonal adjustments — those still need your eye.

**Task 3: Formatting and restructuring**

If you have a wall of text that needs to be organized, paste it in and ask Claude to restructure it.

"Take these meeting notes and reorganize them into: decisions made, action items (with owner and deadline), and open questions. Format as a clean document I can paste back into Google Docs."

**Task 4: Multiple format adaptations from one source**

Once you have a polished document, Claude can turn it into other formats quickly.

"Take this proposal and produce: (1) a one-page executive summary, (2) a five-bullet version for a quick email, and (3) a version with the technical sections removed for a non-technical reader."

This is mechanical adaptation work. Claude handles it faster than rewriting manually.

**Task 5: Proofread for tone and clarity, not just grammar**

Ask Claude to read your document from the perspective of its intended reader:

"Read this as a CFO who is skeptical of the ROI claims. What will she push back on? What is unconvincing?"

"Read this as someone who has never heard of our company. What is confusing or needs more context?"

This is more useful than a standard grammar check.

## Getting the formatting to paste in cleanly

When you paste Claude's output into Google Docs, the formatting may not transfer exactly. A few tips:

- Ask Claude to use "Heading 1," "Heading 2," and "Body" labels so you know where to apply Google Docs heading styles
- Plain text pastes cleanly; Claude's markdown formatting (like **bold** or ## headers) will appear as raw syntax in Docs unless you use the "Paste and match style" option
- For long documents, paste section by section so you can apply formatting as you go

## Common pitfalls

**Asking Claude to "review the document" without specifying what kind of review**

"Review this document" is too broad. Claude will default to a general grammar and clarity pass. Be specific: structural review, audience fit review, tone check, argument strength — each is a different task.

**Expecting Claude to remember changes across conversations**

If you paste a document, make edits, and then start a new conversation, Claude does not remember the previous version. If you want Claude to track changes across sessions, keep the updated version in the conversation by continuing to reply in the same thread.

**Using Claude for factual claims in the document**

If your document contains statistics, dates, or claims about specific people or organizations, do not rely on Claude to supply or verify those. Claude will confidently write plausible-sounding numbers that may be wrong. You supply the facts; Claude helps you communicate them clearly.

## The honest verdict

Claude alongside Google Docs is more useful than it sounds once you build the habit. The side-by-side workflow adds maybe 15 seconds per paste — a small price for significantly better output, especially on the drafting and editing tasks that used to take the most time.

The Google Drive Connector makes it meaningfully more seamless for long documents you want analyzed without copying. That alone is worth setting up if you write or review long documents regularly.

**Best for:** Anyone who writes regularly for work — proposals, reports, briefs, policies, communications. The editing and structural feedback use cases are the highest-value for most people.

**Overkill for:** Quick emails or one-paragraph Docs where the editing overhead of the Claude workflow is longer than just writing it yourself.`,
  },

  // ── 6. Claude + HubSpot ────────────────────────────────────────────────────
  {
    termSlug: 'workflow-automation',
    slug: 'claude-plus-hubspot',
    angle: 'process',
    title: 'Claude for CRM workflows: using Claude with HubSpot',
    excerpt: "Claude doesn't integrate natively with HubSpot, but the right workflows make it your best CRM assistant. Here's how sales and CS teams actually use Claude alongside HubSpot.",
    readTime: 7,
    cluster: 'Tools & Ecosystem',
    audience: ['operator', 'cs'],
    body: `There is no official Claude plugin for HubSpot — yet. But the teams getting the most out of Claude in their CRM workflow are not waiting for a native integration. They have built manual and semi-automated workflows that make Claude feel like it lives inside HubSpot.

This guide covers how to do that: what workflows save the most time, how to set them up, and how to automate the most common use cases with Zapier.

## What Claude can help with in a CRM context

Without any integration, Claude is already useful for:

- Drafting personalized outreach emails from contact data you copy-paste
- Summarizing a contact or company's history from notes you paste in
- Writing call prep briefs before customer meetings
- Turning rough call notes into structured CRM records
- Drafting follow-up sequences for specific deal stages
- Analyzing deal pipeline data you export from HubSpot

The bottleneck is always data transfer — copying information from HubSpot into Claude and pasting results back. The workflows below minimize that friction.

## Five workflows that save real time

**Workflow 1: Call prep in two minutes**

Before any sales call or customer success meeting, get Claude to brief you on the contact — using data you already have in HubSpot.

How to do it:
- In HubSpot, open the contact record and copy: company name, industry, job title, deal stage, last interaction date, any notes from previous calls
- Paste into Claude with: "I have a call in 30 minutes with [name], [title] at [company]. Here is what I know about them: [paste]. Give me a two-minute brief: what I should know going in, what questions to ask, and what their likely objections will be based on this context."

Result: You show up with context and a plan instead of winging it.

**Workflow 2: Turning rough call notes into structured CRM records**

Most reps take messy notes during calls and then spend 20 minutes turning them into proper CRM records. Claude cuts that to two minutes.

How to do it:
- After a call, paste your rough notes into Claude
- Ask: "Clean up these call notes into a structured HubSpot record update. Format as: Summary (two sentences), Next steps (bulleted list with owner and due date), Key concerns raised, Deal stage recommendation (choose from: Prospect / Discovery / Proposal / Negotiation / Closed Won / Closed Lost)."
- Copy the structured output into the relevant HubSpot fields

Result: CRM records that are actually useful instead of "spoke to customer, follow up next week."

**Workflow 3: Personalized outreach at scale**

For outbound sequences or re-engagement campaigns, Claude can draft personalized first emails from HubSpot contact data — much faster than writing each one manually.

How to do it:
- Export a list of contacts from HubSpot as a CSV (or copy a few at a time)
- Paste into Claude with a prompt: "I need first-touch emails for the following contacts. For each one, write a personalized three-sentence email that mentions their company and role, references a relevant pain point for their industry, and ends with a single low-friction call to action. [paste contact data]"
- Review and send each email from HubSpot or your email client

This also works well through Zapier automation (see below).

**Workflow 4: Pipeline review summaries**

Before pipeline reviews or forecasting calls, get a plain-English summary of where deals stand — instead of just looking at the stage columns.

How to do it:
- Export your current pipeline from HubSpot (CSV, or copy the key fields)
- Paste into Claude with: "Here is our sales pipeline as of today: [paste]. Summarize: which deals are most likely to close this quarter and why, which ones are at risk and what the warning signs are, and what the total pipeline value is broken down by stage."

Result: A brief you can share at the start of a forecasting call, or use yourself before entering the meeting.

**Workflow 5: Deal win/loss analysis from close notes**

After a deal closes — won or lost — Claude can extract patterns from your close notes that HubSpot's built-in reporting misses.

How to do it:
- Every quarter, pull all your closed deal notes from HubSpot
- Paste into Claude: "Here are the notes from all deals we closed (won and lost) this quarter: [paste]. What are the most common reasons deals were won? Most common reasons deals were lost? Are there any patterns in deal size, industry, or deal stage that correlate with wins or losses?"

## Automating with Zapier

For the workflows that happen repeatedly and follow a consistent structure, Zapier can eliminate the manual copy-paste entirely.

**Most useful HubSpot + Zapier + Claude automations:**

New deal created → Claude generates a one-page account research brief → brief added as a HubSpot note on the company record.

Deal moves to "Proposal" stage → Claude drafts a proposal outline based on the contact's industry and deal notes → outline sent to the rep via Slack.

New contact added from an inbound form → Claude drafts a personalized first email → email saved as a draft in Gmail.

Deal marked Closed Lost → Claude analyzes the deal notes and adds a standardized loss reason → loss reason tagged in HubSpot for reporting.

See the Claude + Zapier guide for step-by-step instructions on building these.

## Common pitfalls

**Asking Claude to work from memory about your CRM**

Claude does not have access to HubSpot unless you paste the data in. Saying "what do you know about Acme Corp?" returns nothing useful. Always include the relevant data in your message.

**Sending Claude-drafted emails without reviewing them**

Claude drafts well, but it does not know the specific nuances of your relationship with a contact, what was said in a previous call that is not in the notes, or the current situation at the prospect's company. Always read the draft before sending.

**Using Claude for pricing or contract specifics**

Claude will generate plausible-sounding numbers. Do not rely on it to quote pricing, calculate discounts, or draft contract terms without checking your actual pricing documentation. Use Claude to write the email; you supply the pricing.

**Pasting large amounts of contact data with personal information**

Before pasting customer data into Claude, check your company's data policy and Anthropic's privacy terms. For sensitive customer data (personal health information, financial data, data subject to GDPR), confirm that using Claude.ai or the API is compliant with your data handling requirements.

## The honest verdict

Claude alongside HubSpot saves the most time on the high-volume, text-heavy tasks: call prep, note cleanup, personalized outreach, and pipeline summaries. These are exactly the tasks that take reps away from selling.

The lack of a native integration is real friction, but for most of these workflows the copy-paste overhead is small compared to the time Claude saves. The Zapier automations eliminate that friction for the most repetitive use cases.

**Best for:** Sales and CS teams doing high-volume outreach, customer-facing roles with lots of call prep and follow-up, ops leaders who want better CRM data quality without adding headcount.

**Lower value for:** Teams where deals are very long and complex (low volume, high relationship), or where most communication happens outside of email (in-person sales, field sales, enterprise relationship management).`,
  },

]

async function run() {
  console.log('Seeding batch 26 — Claude + Tool workflow guides...')

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
