/**
 * Batch 28 — "Claude + Tool" workflow guides (continued)
 * Airtable, Asana, Linear, Figma, Webflow
 * Each article creates a permanent search entry for "Claude + [Tool]"
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-28.ts
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

  // ── 1. Claude + Airtable ───────────────────────────────────────────────────
  {
    termSlug: 'connector',
    slug: 'claude-plus-airtable',
    angle: 'process',
    title: 'How to use Claude with Airtable: a practical guide',
    excerpt: "Airtable stores your structured data. Claude helps you make sense of it, generate content from it, and build workflows around it. Here's exactly what that looks like in practice.",
    readTime: 7,
    cluster: 'Tools & Ecosystem',
    audience: ['operator', 'user'],
    body: `Airtable and Claude are a strong combination because Airtable is where your structured data lives — your CRM, your project tracker, your content calendar — and Claude is good at reading that data and doing something useful with it.

The integration is not native (there is no official Airtable Connector inside Claude.ai as of now), so you are working with copy-paste or automation tools like Zapier or Make. Here is what each approach gives you.

## Three ways Claude and Airtable work together

**1. Copy from Airtable, paste into Claude**

The most reliable method for one-off tasks. Select records in your Airtable view, copy the data (Airtable copies it as plain text or CSV-style columns), and paste it into Claude with your question or task.

This works best for: analyzing a batch of records, writing descriptions for a set of items, or identifying patterns across a table.

**2. Zapier or Make automation**

Set up a trigger in Airtable (new record, status change, form submission) that sends data to Claude via Zapier or Make, and writes the result back to Airtable. No code required.

Example: A record enters your "needs description" view → Zapier sends the record fields to Claude → Claude writes the description → Zapier writes it back to the Description field. Runs automatically.

**3. Airtable scripting with direct API calls**

If you have a developer on your team, Airtable's Scripting app lets you write JavaScript that calls the Anthropic API directly from within Airtable. More setup, but gives you exact control over which records get processed and how.

## Three workflows that save real time

**Workflow 1: Generating product or content descriptions at scale**

If you have an Airtable base with hundreds of products, projects, or pieces of content that need written descriptions, Claude can generate them in bulk.

How to do it with Zapier:
- Create a filtered view in Airtable showing records without descriptions
- Set up a Zapier automation: when a record enters that view, send the name and key fields to Claude
- Prompt: "Write a 2-sentence description for this product: [name]. Key details: [field 1], [field 2]. Keep it plain and factual."
- Write Claude's response to the Description field

The descriptions will not be perfect, but they will be good enough that editing takes less time than writing from scratch.

**Workflow 2: Summarizing or classifying form submissions**

If you use Airtable forms to collect customer feedback, applications, intake requests, or survey responses, Claude can read each submission and classify it, extract key details, or write a summary.

How to do it:
- Copy the full text of submissions from the Long text field
- Paste into Claude: "Here are 15 customer feedback submissions. For each one, identify: (1) the main issue, (2) the sentiment (positive / neutral / negative), (3) whether it contains a feature request. Format as a simple list."
- Paste the result back into your Airtable or use it to update a Classification field

This works especially well for support teams processing a backlog of tickets, and for teams running regular intake processes.

**Workflow 3: Turning Airtable project data into status updates**

If your Airtable base tracks projects, milestones, or tasks, Claude can read the current state and write a status update that you can send to stakeholders.

How to do it:
- Export your current sprint or project view as a CSV (File → Download as CSV)
- Paste into Claude: "This is our project tracker. Write a plain-English status update for our Friday standup. Include: what shipped this week, what is blocked, and what is starting next week. Tone: direct and brief, no jargon."
- Edit as needed and send

This saves the 20 to 30 minutes most project managers spend manually compiling weekly updates.

## What does not work well

**Claude cannot write directly to Airtable without an automation layer.** There is no native Claude Connector for Airtable inside Claude.ai, so Claude cannot browse your base or update records in real time without Zapier, Make, or the Scripting app.

**Very large bases get unwieldy.** If you paste 500 records into Claude at once, quality degrades. Work in batches of 20 to 50 records at a time for best results.

**Claude does not understand Airtable formulas.** If your table has formula fields, linked records, or rollups, Claude sees the computed values — not the underlying logic. It cannot debug or modify your formulas.

## The setup that gives you the most leverage

For most teams without a developer: Zapier automation on a single high-value view (the records that need attention right now). Set it up once for your most repetitive task — writing descriptions, classifying submissions, generating summaries — and let it run.

For teams with a developer: the Airtable Scripting app with direct API calls gives you the most control and avoids Zapier costs at scale.`,
  },

  // ── 2. Claude + Asana ─────────────────────────────────────────────────────
  {
    termSlug: 'connector',
    slug: 'claude-plus-asana',
    angle: 'process',
    title: 'How to use Claude with Asana: a practical guide',
    excerpt: "Asana manages your work. Claude helps you think through it, write the briefs and updates your tasks need, and surface what actually matters. Here's how to make that work.",
    readTime: 7,
    cluster: 'Tools & Ecosystem',
    audience: ['operator', 'user'],
    body: `Asana is where your team tracks work. Claude is good at reading through messy context and producing structured output. Together, they address the tax that most project management tools impose: all the writing that surrounds actual tasks — briefs, updates, retrospectives, scope documents.

There is no native Claude integration inside Asana, so you are working with copy-paste or automation through Zapier. Here is what actually saves time.

## What Claude and Asana are good for together

**Writing task descriptions and project briefs**

Most Asana tasks are created with a title and nothing else. "Update landing page." "Follow up with vendor." "Finalize Q3 report." Without context, whoever picks up the task has to guess at scope, ask clarifying questions, or do it wrong.

Claude can turn a rough idea into a proper task description with clear scope, definition of done, and any relevant context — in about 30 seconds.

How to do it:
- Open a new message in Claude
- Paste your rough task: "We need to update the landing page for the new product launch. The old design is from 2022. Sales team says the messaging is off. Launch is in 3 weeks."
- Prompt: "Write an Asana task description for this. Include: objective, key deliverables, definition of done, and any dependencies or blockers to flag. Keep it brief."
- Paste into the Asana task

This takes 30 seconds and eliminates most of the back-and-forth that happens when tasks are under-specified.

**Generating project kickoff documents**

When you start a new Asana project, you often need a brief or scope doc that lives alongside it. Claude can draft this from your notes.

How to do it:
- Write a rough brain dump of the project: what it is, why it matters, who is involved, what success looks like, what the timeline is
- Prompt Claude: "Turn this into a project brief. Sections: Overview (2-3 sentences), Goals, Out of scope, Stakeholders, Key milestones, Open questions. Plain language."
- Paste the result as a project description or attach it as a task

**Writing status updates from task lists**

The weekly project update is one of the most tedious recurring tasks in any project management workflow. You have to read through a Asana project, figure out what happened, and write a coherent summary.

How to do it:
- In Asana, switch to List view for the relevant project
- Copy the visible tasks and statuses (select all, copy)
- Paste into Claude: "These are this week's tasks and their statuses. Write a brief status update for our Monday standup. What shipped, what is in progress, what is blocked. Plain language, no bullet-point overload."
- Edit as needed

**Writing retrospective notes**

After a project closes, copy completed tasks and any notes into Claude. Prompt: "What went well, what slowed us down, what should we do differently next time? Write as a retrospective summary, 3 to 5 bullet points each section."

## What does not work well

**Claude cannot access Asana directly.** There is no live connection. You are always working from copied text, so Claude only knows what you show it.

**Large Asana projects become unwieldy when copied.** If you have 200 tasks, copying them all produces too much text for Claude to synthesize well. Paste only the active sprint or the blocked items.

**Asana's custom fields do not copy cleanly.** If you rely heavily on custom fields, dropdowns, or dependencies, the copied text may not include them. Use the CSV export for richer data.

## The automation worth setting up

If your team creates Asana tasks from a form (common for IT intake, creative requests, bug reports), you can automate the brief-writing step:

- Zapier trigger: new task created in a specific project or section
- Zapier action: send the task name and description to Claude with a "write a fuller brief" prompt
- Zapier action: update the Asana task description with Claude's output

This works especially well for teams where tasks are created by people who are not project managers — they fill out a form, and the resulting Asana task comes pre-written with proper scope.`,
  },

  // ── 3. Claude + Linear ─────────────────────────────────────────────────────
  {
    termSlug: 'connector',
    slug: 'claude-plus-linear',
    angle: 'process',
    title: 'How to use Claude with Linear: a practical guide',
    excerpt: "Linear is where engineering teams track issues and ship work. Claude helps you write better issues, triage faster, and generate the surrounding documentation that always falls behind. Here's the practical guide.",
    readTime: 7,
    cluster: 'Tools & Ecosystem',
    audience: ['developer', 'operator'],
    body: `Linear is the issue tracker most engineering and product teams use because it is fast and opinionated about how software work should be structured. Claude is useful alongside it for the writing work that developers find tedious: writing clear issue descriptions, writing acceptance criteria, generating changelogs, and summarizing what a sprint actually delivered.

There is no native Claude integration in Linear. You are working with copy-paste or Linear's API combined with Claude's API for automation.

## What Claude and Linear are good for together

**Writing issue descriptions that are actually useful**

The most common failure mode in Linear (and every issue tracker) is issues that exist as titles only. "Fix checkout bug." "Update profile page." "API rate limiting." Without a description, whoever picks it up has to investigate from scratch.

Claude can turn a rough description into a properly structured issue in 30 seconds.

How to do it:
- Start with a verbal description: "The checkout flow breaks when a user applies a discount code after adding items from a different currency. It throws a 500 error. This is blocking our EU launch."
- Prompt: "Write a Linear issue description. Include: Summary (1-2 sentences), Steps to reproduce, Expected vs actual behavior, Impact and priority context, Suggested approach if known. Technical, direct, no filler."
- Paste into Linear

This works especially well for bug reports from customer support tickets or Slack messages, which are usually written for a human reader, not an engineer.

**Writing acceptance criteria**

For feature issues, acceptance criteria are often missing or vague. Claude can generate a draft from a feature description.

Prompt: "Write acceptance criteria for this feature: [description]. Format as a checklist. Be specific — no 'should work correctly', only testable conditions."

**Summarizing sprint results for non-engineering stakeholders**

After a sprint closes in Linear, you often need to communicate what shipped to people who do not live in the issue tracker.

How to do it:
- In Linear, filter by completed issues in the sprint and copy the list
- Paste into Claude: "These are the issues we completed this sprint. Write a 5-bullet summary for our Monday product review. Focus on user-visible changes and any technical debt resolved. Skip internal refactors that do not affect users."
- Adjust for your audience (product, exec, customer-facing)

**Generating changelogs**

If you ship regularly, changelogs are high-value but painful to write. Claude can generate a draft from Linear issues.

How to do it:
- Export completed issues for the release period (CSV or copy from the milestone view)
- Prompt: "These are the issues we shipped in v2.4. Write a changelog. Format: short header for the release, then grouped entries under Features, Fixes, and Performance. Plain language — written for customers, not engineers."
- Review and publish

**Triaging incoming bug reports**

If your team receives bug reports through a form, Intercom, or email that then get created as Linear issues, Claude can pre-process them before you triage:

- Paste the raw report into Claude: "Extract: (1) what the user was trying to do, (2) what happened, (3) what they expected to happen, (4) severity based on their description. Format as a Linear issue description."

This converts messy customer language into engineer-readable issues faster than doing it manually.

## What does not work well

**Claude cannot read your Linear workspace in real time.** Everything is copy-paste or API-based. There is no live connection.

**Acceptance criteria still need engineering review.** Claude generates reasonable criteria but will miss edge cases specific to your codebase, infrastructure, or business logic. Treat it as a starting draft, not a final specification.

**Linear's cycle and roadmap structure does not copy cleanly.** When you copy issues, you lose relationships between issues, parent/child links, and cycle metadata. If you need Claude to understand project structure, export as CSV and provide more context.

## The automation worth building

If your team uses Linear's API: a webhook on new issues created in a specific team that sends the issue to Claude with a "write a fuller description" prompt, then patches the issue back via API. This is especially valuable for teams where issues are created by people outside engineering (support, sales, product) who write in customer language rather than technical language.`,
  },

  // ── 4. Claude + Figma ─────────────────────────────────────────────────────
  {
    termSlug: 'connector',
    slug: 'claude-plus-figma',
    angle: 'process',
    title: 'How to use Claude with Figma: a practical guide',
    excerpt: "Figma is where design lives. Claude helps with everything around the design — copy, specs, handoff notes, design feedback write-ups, and the back-and-forth between design and engineering. Here's what actually works.",
    readTime: 7,
    cluster: 'Tools & Ecosystem',
    audience: ['developer', 'operator', 'user'],
    body: `Claude does not see your Figma files — it cannot view screens, analyze visual designs, or read your component tree unless you paste content from them. What it can do is handle all the written work that surrounds design: copy, specs, handoff notes, feedback documentation, and design system documentation.

Most design teams are not bottlenecked by the tools — they are bottlenecked by the writing that design produces downstream. That is where Claude helps.

## What Claude and Figma are good for together

**Writing UI copy directly in Figma**

The cleanest workflow: use a Figma plugin that connects to Claude and lets you generate or rewrite copy in place.

The plugin that works best for this is the "Claude for Figma" community plugin (search in the Figma Community) or use a plugin like "AI Text" that supports custom API endpoints. Set it up once with your Anthropic API key, and you can select any text layer in Figma and ask Claude to rewrite it, shorten it, or generate alternatives.

What this replaces: the round-trip between designer and copywriter for button labels, error messages, empty states, tooltips, and microcopy. The designer can iterate on copy in the same tool as the design.

**Writing component documentation**

Design systems require documentation. Every component needs a usage note, a list of variants, and guidance on when to use it vs a similar component. This documentation is almost always out of date because writing it is tedious.

How to do it:
- Describe your component to Claude: component name, what it does, its variants, when to use it, and any common misuses you want to document
- Prompt: "Write documentation for a design system component. Sections: Description (1-2 sentences), When to use, When not to use, Variants, Accessibility notes. Plain language, specific."
- Paste into your design system documentation (Notion, Confluence, or a Figma frame)

**Writing design specs for engineering handoff**

When a design is ready for engineering, the spec that describes interactions, states, and edge cases is often missing or lives only in the designer's head.

How to do it:
- Screenshot your design and paste it into Claude (Claude can read images), or describe the component and its states in text
- Prompt: "Write a spec for engineering handoff. Describe: default state, hover state, active/pressed state, disabled state, loading state, error state, empty state. For each: what it looks like (reference the design), interaction behavior, any animation or transition. Be specific."
- Paste into the Figma file's annotation frame or the handoff doc

**Writing design feedback**

When reviewing designs, written feedback is more useful than verbal but takes longer to produce. Claude can help structure and sharpen design critique.

How to do it:
- Take a screenshot or describe the design you are reviewing
- Describe your feedback informally: "The primary CTA is too similar to the secondary, the empty state is confusing, the spacing feels off in the table"
- Prompt: "Turn this into structured design feedback. For each issue: (1) the observation, (2) why it is a problem for the user, (3) a suggested direction. Respectful, specific."
- Send as written feedback or paste into FigJam comments

## What does not work well

**Claude cannot see Figma files by default.** Unless you screenshot or paste content, Claude has no visual context. All text-based workflows work; anything requiring visual analysis needs you to provide the screenshot.

**Claude cannot generate production-quality UI.** It can help draft copy and documentation, but it does not understand your design system's constraints, your brand voice, or the exact visual context unless you tell it.

**Copy generated without visual context is often off.** If you ask Claude to write microcopy without showing it the design, the length, tone, and character count may not fit the UI. Always include context about where the copy lives (button label, empty state, error message, tooltip) and any character limits.

## The workflow designers use most

Screenshot a screen → paste into Claude → "Review this UI for clarity and usability. What is confusing? What copy should be rewritten? What states or edge cases might be missing?"

This is not a replacement for user testing, but it is a fast way to catch obvious issues before a design goes to engineering.`,
  },

  // ── 5. Claude + Webflow ───────────────────────────────────────────────────
  {
    termSlug: 'connector',
    slug: 'claude-plus-webflow',
    angle: 'process',
    title: 'How to use Claude with Webflow: a practical guide',
    excerpt: "Webflow lets you build websites without writing code. Claude helps with the content that fills them — copy, SEO text, blog posts, CMS entries, and the writing that takes as long as the design. Here's how to use them together.",
    readTime: 7,
    cluster: 'Tools & Ecosystem',
    audience: ['operator', 'user', 'founder'],
    body: `Webflow is a no-code website builder where the bottleneck is often not the design — it is the copy. Every section, page, and CMS entry needs content, and writing it takes as long as building the layout. Claude is fast at producing well-structured web copy when you give it proper context.

There is no native Claude integration in Webflow, but there are practical ways to use them together.

## What Claude and Webflow are good for together

**Writing page copy section by section**

The most reliable approach: describe each section of your Webflow page to Claude with context about your product, audience, and goal, and let it draft the copy.

How to do it:
- Describe your page structure: "Hero with a headline and subheadline. Features section with 3 columns. Testimonials. Pricing section. FAQ. Closing CTA."
- Give Claude context: your product, what makes it different, who it is for, the tone you want (direct, warm, professional, etc.)
- Prompt: "Write copy for each section. Hero: one headline (8-10 words) and one subheadline (1-2 sentences). Features: 3 feature names + 1-sentence descriptions. Closing CTA: headline + button text."
- Paste section by section into Webflow

This is faster than writing from scratch and faster than using a generic copywriting template.

**Filling CMS collections at scale**

Webflow CMS is where your blog posts, case studies, team bios, product pages, and any dynamic content live. If you need to create 20 blog posts, 15 product descriptions, or 10 case study summaries, Claude can produce first drafts much faster than writing each one.

How to do it:
- List the items you need: blog post titles, product names, case study clients
- Prompt: "Write a draft for each of these blog posts. For each: a title, a 2-sentence excerpt, and a 400-word body. Audience: [your audience]. Tone: [your tone]. Topic list: [list them]."
- Review and edit the drafts
- Paste into your Webflow CMS entries

For product descriptions and case studies, include specific facts (features, metrics, client outcomes) in your prompt — Claude will produce better output when it has real data to work with rather than inventing details.

**Writing SEO meta descriptions and titles**

Every page in Webflow needs an SEO title and meta description. Writing 50 of these is tedious. Claude can generate them all at once.

How to do it:
- Copy your page list (page name + one sentence about the page)
- Prompt: "For each page, write an SEO title (55-60 characters) and meta description (150-160 characters). Prioritize: what the page is, what the user gets, include the target keyword naturally. No marketing fluff."
- Paste into Webflow's SEO settings for each page

**Drafting FAQ content**

FAQ sections are high-SEO-value content that most websites underinvest in. Claude can generate realistic FAQs from your product description.

How to do it:
- Describe your product and typical customer questions
- Prompt: "Write 8 FAQ entries for a [product type] targeting [audience]. Questions should be what real customers actually ask before buying — including objections and concerns, not just easy questions. Answers: 2-4 sentences, plain language."
- Add to your Webflow CMS FAQ collection

## What does not work well

**Claude cannot edit your Webflow site directly.** All content has to be copy-pasted. There is no live connection or plugin that writes to Webflow for you.

**Generic prompts produce generic output.** The most common mistake: asking Claude to "write homepage copy" with no product context. The result reads like every SaaS homepage ever written. Always include specific details: what makes your product different, specific use cases, actual customer language if you have it.

**Claude does not know your brand voice unless you tell it.** If your brand has a distinct tone, describe it explicitly: "Write in a casual, direct tone. Short sentences. No corporate language. No 'solutions' or 'leverage'." Or paste an example of existing copy and ask Claude to match the voice.

## The fastest setup for a new Webflow site

Build the layout in Webflow first with placeholder text. Then go section by section and prompt Claude with: "Here is the section I am writing: [describe the section and its goal]. Here is what I know about my product/service: [core value prop, audience, differentiator]. Write the copy for this section."

This is faster than trying to write the whole site in one prompt, and it lets you adjust context and tone section by section based on what is working.`,
  },
]

async function main() {
  console.log('Seeding batch 28 articles...\n')

  for (const article of ARTICLES) {
    const term = await getTermId(article.termSlug)
    if (!term) {
      console.error(`  ✗ Term not found: ${article.termSlug}`)
      continue
    }

    const payload = {
      slug:      article.slug,
      title:     article.title,
      excerpt:   article.excerpt,
      body:      article.body,
      read_time: article.readTime,
      cluster:   article.cluster,
      angle:     article.angle,
      term_id:   term.id,
      term_name: term.name,
      term_slug: article.termSlug,
      published: true,
    }

    const { error } = await sb
      .from('articles')
      .upsert(payload, { onConflict: 'slug' })

    if (error) {
      console.error(`  ✗ ${article.slug}: ${error.message}`)
    } else {
      console.log(`  ✓ ${article.slug}`)
    }
  }

  console.log('\nDone.')
}

main()
